import useSWR from 'swr'
import axios from '@/lib/axios'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

import { env } from '@/../next.config'
import { useErrorLogsStore } from '@/store/useErrorLogsStore'

export const useClient = () => {
  const router = useRouter()
  const { setErrorLogs } = useErrorLogsStore()

  const csrf = () => axios.get(`sanctum/csrf-cookie`)

  const validate = async ({ setLoading, ...props }) => {
    await csrf()

    axios
      .post(`/self-service/validate-client`, props)
      .then(res => {
        const result = res.data
        //console.log(result.data)
        if (!result?.response) {
          // Swal.fire({
          //   title: 'Validation Error',
          //   text: result?.message,
          //   icon: 'error',
          // })

          Swal.fire({
            title: 'Validation Error',
            text: result?.message,
            icon: 'error',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Report',
            denyButtonText: `Close`,
          }).then(result => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isDenied) {
              // setLoading('send-complaint')
              setLoading(false)
              setErrorLogs(null)
            } else {
              setLoading(false)
              setErrorLogs(res.data?.error_data)
            }
          })
        } else {
          router.push(result?.link)
          setLoading(false)
          setErrorLogs(null)
        }
      })
      .catch(error => {
        if (error?.response?.status !== 422) throw error
        alert(error?.response?.data?.message)
      })
    // .finally(() => {
    //   setLoading(false)
    // })
  }

  const getRequest = async ({ setLoading, setRequest, refno }) => {
    await csrf()

    axios
      .get(`/self-service/get-request/${refno}`)
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

  const updateRequest = async ({ setRequest, setLoading, ...props }) => {
    await csrf()

    const formData = new FormData()

    formData.append('refno', props.refno)
    formData.append('loaType', props.loaType)
    formData.append('email', props.email)
    formData.append('altEmail', props.altEmail)
    formData.append('contact', props.contact)
    if (props.loaType === 'laboratory') {
      for (let g = 0; g < props?.attachLab?.length; g++) {
        formData.append('attachment[]', props?.attachLab[g])
      }
      //formData.append('attachLab[]', ...props?.attachLab)
      formData.append('provider', props?.provider)
      formData.append('providerEmail2', props?.providerEmail2)
      formData.append('sendLoaToProvider', props?.sendLoaToProvider)
    }

    axios
      .post(
        `/self-service/update-request`,
        props.loaType === 'laboratory' ? formData : props,
      )
      .then(res => {
        const result = res.data
        //console.log(result.data)
        Swal.fire({
          title: 'Successful Request for LOA',
          text: `Your request has been submitted, your referrence # is ${result[0]?.refno}. We will notify you through the email and mobile number you provided`,
          icon: 'success',
        })
        setRequest(result[0])
      })
      .catch(error => {
        const nerror = error?.response?.data?.message
        alert(nerror)
        //runfinally = false
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const searcHospital = async ({ search, setHospital, setHosploading }) => {
    await csrf()

    axios
      .get(
        `/self-service/client-search-hospital?search=${
          search || 'DONT SEARCH'
        }`,
      )
      .then(res => {
        const result = res.data
        if (result?.length === 0) {
          Swal.fire({
            title: 'Hospital/Clinic not found',
            text: 'System cannot find the parameters you want to search',
            icon: 'warning',
          })
          setHospital('')
        } else {
          setHospital(result)
        }
      })
      .catch(error => {
        if (error?.response?.status !== 422) throw error
        alert(error?.response?.data?.message)
      })
      .finally(() => {
        setHosploading(false)
      })
  }

  const searchDoctor = async ({ id, search, setDoctor, setDocloading }) => {
    await csrf()

    axios
      .get(
        `/self-service/client-search-doctor?hospitalid=${id}&search=${
          search || ''
        }`,
      )
      .then(res => {
        const result = res.data
        if (result?.length === 0) {
          Swal.fire({
            title: 'No Doctor Found',
            text: 'System cannot find the parameters you want to search',
            icon: 'warning',
          })
          setDoctor('')
        } else {
          setDoctor(result)
        }
      })
      .catch(error => {
        if (error?.response?.status !== 422) throw error
        alert(error?.response?.data?.message)
      })
      .finally(() => {
        setDocloading(false)
      })
  }

  return {
    validate,
    getRequest,
    updateRequest,
    searcHospital,
    searchDoctor,
  }
}
