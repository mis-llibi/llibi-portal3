import useSWR from 'swr'
import axios from '@/lib/axios'

import Swal from 'sweetalert2'

import { env } from '@/../next.config'

export const ManageUploadedFiles = ({ id }) => {
    const { data: files, mutate } = useSWR(
        `${env.apiPath}/self-service/get-uploaded-files/${id}`,
        () =>
            axios
                .get(`${env.apiPath}/self-service/get-uploaded-files/${id}`)
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

    const removeFile = async ({ setLoading, reset, ...props }) => {
        await csrf()

        let runfinally = true

        axios
            .post(`/self-enrollment/remove-uploaded-file`, props)
            .then(() => mutate())
            .catch(error => {
                const nerror = error?.response?.data?.message
                swaerror('Remove Failed', nerror)
                runfinally = false
            })
            .finally(() => {
                setLoading(false)
                if (runfinally) {
                    swasuccess(
                        'Remove Successful',
                        'You have successfully removed the file',
                    )
                    //console.log(client?.dependent)
                    //reset({ deps: client?.dependent })
                }
            })
    }

    return {
        files,
        removeFile,
    }
}
