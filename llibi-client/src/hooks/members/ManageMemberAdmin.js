import useSWR from 'swr'
import axios from '@/lib/axios'

import Swal from 'sweetalert2'

import { env } from '@/../next.config'

export const useManageMemberAdmin = ({ selection }) => {
    const { data: members, mutate } = useSWR(
        `${env.apiPath}/get-members/${selection}`,
        () =>
            axios
                .get(`${env.apiPath}/get-members/${selection}`)
                .then(res => res.data)
                .catch(error => {
                    if (error.response.status !== 409) throw error
                    alert('error')
                }),
        {
            revalidateOnFocus: true,
            revalidateOnMount: true,
            revalidateOnReconnect: false,
            refreshWhenOffline: false,
            refreshWhenHidden: false,
            refreshInterval: 60000,
        },
    )

    const csrf = () => axios.get(`sanctum/csrf-cookie`)

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

    const update = async ({ setLoading, setShow, reset, ...props }) => {
        await csrf()

        let runfinally = true

        axios
            .post(`/hr/admin-update-member`, props)
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

    return {
        members,
        update,
    }
}
