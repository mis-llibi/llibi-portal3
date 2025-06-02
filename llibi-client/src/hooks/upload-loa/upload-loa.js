import useSWR from 'swr'

import axios from '@/lib/axios'
import Swal from 'sweetalert2'

import { env } from '@/../next.config'

import { useRouter } from 'next/router'


export const useUploadLOA = ({}) => {

  const router = useRouter()

  const csrf = () => axios.get(`sanctum/csrf-cookie`)

  const validateClient = async({setLoading, ...props}) => {
    await csrf()

    axios
        .post(`/upload-loa/validate-client`, props)
        .then(res => {
            if(res.status === 200){
                router.push(res.data.link)
            }
        })
        .catch(err => {
            if(err.response.status === 404){
                Swal.fire({
                    title: "Validation Error",
                    text: `${err.response.data.response}`,
                    icon: "error"
                })
            }
        })
        .finally(() => {
            setLoading(false)
        })


  }

  const getRequest = async ({ setLoading, setRequest, loaType ,refno }) => {
    await csrf()

    axios
      .get(`/upload-loa/get-request/${loaType}/${refno}`)
      .then(res => {
        const result = res.data[0]

        if (result) setRequest(result)

        if (!result)
          Swal.fire({
            title: '<strong>Request Not Found</strong>',
            icon: 'error',
            html:
              '<p style="text-align:center;">There is no request to the reference number provided, please retype then try again</p>',
          })
      })
      .catch(error => {
        if (error?.response?.status !== 422) throw error
        alert(error?.response?.data?.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const updateRequest = async({setLoading, setRequest, reset, ...props}) => {
    // console.log(props)

    const formData = new FormData()

    formData.append('refno', props.refno)
    formData.append('provider', props.provider)
    formData.append('loaNumber', props.loaNumber)
    formData.append('attachLOA', ...props?.file)

    await csrf()

    axios.post('/upload-loa/update-request', formData)
        .then(res => {
            console.log(res.data)
            if(res.status === 200){
                Swal.fire({
                    title: "Submit",
                    text: "Submitted Successfully",
                    icon: "success"
                })
                setRequest(res.data)
            }
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            setLoading(false)
            reset()
        })

  }

  return {
    validateClient,
    getRequest,
    updateRequest
  }



}
