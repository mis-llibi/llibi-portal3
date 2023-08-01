import axios from '@/lib/axios'
import Swal from 'sweetalert2'

import { basePath, api } from '@/../next.config'

export const useProvider = () => {
    const csrf = () => axios.get(`${api}/sanctum/csrf-cookie`)

    const searchRequest = async ({ setRequest, setLoading, search }) => {
        await csrf()

        axios
            .get(`${api}/provider-search-request/${search || 0}/0`)
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

    const updateRequest = async ({
        setShow,
        setRequest,
        setClient,
        setLoading,
        ...props
    }) => {
        await csrf()

        axios
            .post(`${api}/provider-update-request`, props, {
                responseType: 'blob',
            })
            .then(res => {
                //const result = res.data

                if (
                    props?.status === '2' ||
                    (props?.status == '1' && !props?.sendEmail)
                ) {
                    Swal.fire({
                        title: 'Downloaded & Completed',
                        text: `LOA was successfully sent to LLIBI for processing. It was also downloaded into your system.`,
                        icon: 'success',
                    })
                } else {
                    Swal.fire({
                        title: 'Downloaded & Completed',
                        text: `LOA was successfully downloaded into your system, you may print or send it digitally to LLIBI.`,
                        icon: 'success',
                    })
                }

                const url = window.URL.createObjectURL(new Blob([res.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `${props?.loaNumber}.pdf`) //or any other extension
                document.body.appendChild(link)
                link.click()

                setRequest([])
                setClient([])
            })
            .catch(error => {
                if (error?.response?.status !== 422) throw error
                alert(error?.response?.data?.message)
            })
            .finally(() => {
                setLoading(false)
                setShow(false)
            })
    }

    return { searchRequest, updateRequest }
}
