import useSWR from 'swr'

import axios from '@/lib/axios'
import Swal from 'sweetalert2'

import { env } from '@/../next.config'



export const FindShowLoa = () => {

    const csrf = () => axios.get(`sanctum/csrf-cookie`)

    const FindPatientAllLoa = ({setLoading, fullname, inscode, compcode, setGetLoaFiles, setGetLoaClaimed}) => {

        // console.log(props)
        axios.get(`${env.apiPath}/self-service/findPatientAllLoa`, {
            params: {
                fullname,
                inscode,
                compcode
            }
        })
        .then((res) => {
            if(res.status == 200){
                setGetLoaFiles(res.data.loafiles)
                setGetLoaClaimed(res.data.claims)
            }
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            setLoading(false)
        })

    }

    return{
        FindPatientAllLoa
    }
}
