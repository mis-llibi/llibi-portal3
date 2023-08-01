import axios from '@/lib/axios'
import Swal from 'sweetalert2'

import { api } from '@/../next.config'

export const useCode = () => {
    const csrf = () => axios.get(`${api}/sanctum/csrf-cookie`)

    const searchRequest = async ({ setRequest, setLoading, search }) => {
        await csrf()

        axios
            .get(`${api}/get-by-code/${search || 'X'}`)
            .then(res => {
                const result = res.data
                if (result?.length === 0) {
                    Swal.fire({
                        title: 'Search not found',
                        text:
                            'System cannot find the parameters you want to search',
                        icon: 'error',
                    })
                }
                setRequest(result)
            })
            .catch(error => {
                if (error?.response?.status !== 422) throw error
                alert(error?.response?.data?.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return { searchRequest }
}
