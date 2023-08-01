import useSWR from 'swr'
import axios from '@/lib/axios'
import { useRouter } from 'next/router'

import Swal from 'sweetalert2'

import { env } from '@/../next.config'

export const useManageMember = ({ memberId }) => {
    const router = useRouter()

    const { data: members, error, mutate } = useSWR(
        `${env.apiPath}/dental-insurance/get-enrolled`,
        () =>
            axios
                .get(`${env.apiPath}/dental-insurance/get-enrolled`)
                .then(res => res.data)
                .catch(error => {
                    if (error.response.status !== 409) throw error

                    router.push('/verify-email')
                }),
        {
            revalidateOnFocus: false,
            revalidateOnMount: true,
            revalidateOnReconnect: false,
            refreshWhenOffline: false,
            refreshWhenHidden: false,
            refreshInterval: 0,
        },
    )

    const csrf = () => axios.get(`/sanctum/csrf-cookie`)

    const swasuccess = (title, text) => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: title,
            text: text,
            showConfirmButton: true,
        })
    }

    const swaerror = (title, text) => {
        const ntext = text?.replace(/ *\([^)]*\) */g, '').replace('values)', '')
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: title,
            text: ntext,
            showConfirmButton: true,
        })
    }

    const create = async ({ reset, setLoading, setShow, ...props }) => {
        await csrf()

        let runfinally = true

        axios
            .post(`/dental-insurance/create`, props)
            .then(() => mutate())
            .catch(error => {
                const nerror = error?.response?.data?.message
                swaerror('Dependent Enrollment Failed', nerror)
                runfinally = false
            })
            .finally(() => {
                setLoading(false)
                if (runfinally) {
                    swasuccess(
                        'Dependent Enrolled',
                        'You have successfully enrolled the member',
                    )
                    setShow(false)
                    reset()
                }
            })
    }

    const update = async ({ reset, setLoading, setShow, ...props }) => {
        await csrf()

        let runfinally = true

        axios
            .post(`/dental-insurance/update`, props)
            .then(() => mutate())
            .catch(error => {
                const nerror = error?.response?.data?.message
                swaerror('Member Update Failed', nerror)
                runfinally = false
            })
            .finally(() => {
                setLoading(false)
                if (runfinally) {
                    swasuccess(
                        'Member Updated',
                        'You have successfully updated the member',
                    )
                    setShow(false)
                    reset()
                }
            })
    }

    const remove = async ({ setLoading, setShow, id }) => {
        await csrf()

        let runfinally = true

        axios
            .post(`/dental-insurance/delete`, { id: id })
            .then(() => mutate())
            .catch(error => {
                const nerror = error?.response?.data?.message
                swaerror('Dependent Delete Failed', nerror)
                runfinally = false
            })
            .finally(() => {
                setLoading(false)
                if (runfinally) {
                    swasuccess(
                        'Dependent Deleted',
                        'You have successfully deleted the dependent',
                    )
                    setShow(false)
                }
            })
    }

    return {
        members,
        create,
        update,
        remove,
    }
}
