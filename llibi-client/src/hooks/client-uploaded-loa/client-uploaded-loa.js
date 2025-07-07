import useSWR from 'swr'

import axios from '@/lib/axios'
import Swal from 'sweetalert2'

import { env } from '@/../next.config'

export const useClientUploaded = ({} = {}) => {


  const csrf = () => axios.get(`sanctum/csrf-cookie`)

  const selectDate = async({setLoading, setLoaData, ...props}) => {
    await csrf()

    axios.post('/api/show-loa-client', props)
        .then(res => {
            console.log(res)
            setLoaData(res.data.combined)
        })
        .catch(err => console.log(err))
        .finally(() => {
            setLoading(false)
        })

  }


  return{
    selectDate
  }


}
