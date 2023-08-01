import axios from '@/lib/axios'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

import { basePath, api } from '@/../next.config'

export const useClient = () => {
    const router = useRouter()

    const csrf = () => axios.get(`${api}/sanctum/csrf-cookie`)

    const validate = async ({ setLoading, ...props }) => {
        await csrf()

        axios
            .post(`${api}/validate-client-mobile`, props)
            .then(res => {
                const result = res.data
                //console.log(result.data)
                if (!result?.response) {
                    Swal.fire({
                        title: 'Validation Error',
                        text: result?.message,
                        icon: 'error',
                    })
                } else {
                    router.push(result?.link)
                }
            })
            .catch(error => {
                if (error?.response?.status !== 422) throw error
                alert(error?.response?.data?.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const getRequest = async ({ setLoading, setRequest, refno }) => {
        await csrf()

        axios
            .get(`${api}/get-request-mobile/${refno}`)
            .then(res => {
                const result = res.data[0]
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

    const updateRequest = async ({ setRequest, setLoading, ...props }) => {
        await csrf()

        const formData = new FormData()

        formData.append('refno', props.refno)
        formData.append('loaType', props.loaType)
        formData.append('email', props.email)
        formData.append('contact', props.contact)
        if (props.loaType === 'laboratory') {
            formData.append('attachLab', ...props?.attachLab)
            formData.append('provider', props?.provider)
        }

        axios
            .post(
                `${api}/update-request-mobile`,
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
                if (error?.response?.status !== 422) throw error
                alert(error?.response?.data?.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const searcHospital = async ({ search, setHospital, setHosploading }) => {
        await csrf()

        axios
            .get(
                `${api}/client-search-hospital-mobile?search=${
                    search || 'DONT SEARCH'
                }`,
            )
            .then(res => {
                const result = res.data
                if (result?.length === 0) {
                    Swal.fire({
                        title: 'Hospital/Clinic not found',
                        text:
                            'System cannot find the parameters you want to search',
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
                `${api}/client-search-doctor-mobile?hospitalid=${id}&search=${
                    search || ''
                }`,
            )
            .then(res => {
                const result = res.data
                if (result?.length === 0) {
                    Swal.fire({
                        title: 'No Doctor Found',
                        text:
                            'System cannot find the parameters you want to search',
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

    return { validate, getRequest, updateRequest, searcHospital, searchDoctor }
}
