import useSWR from 'swr'
import axios from '@/lib/axios'

import Swal from 'sweetalert2'

import { env } from '@/../next.config'

export const ManageClientsForLifeInsurance = ({ selection }) => {
    const { data: clients, mutate } = useSWR(
        `${env.apiPath}/self-enrollment/get-clients-for-life-insurance/${
            selection || 0
        }`,
        () =>
            axios
                .get(
                    `${
                        env.apiPath
                    }/self-enrollment/get-clients-for-life-insurance/${
                        selection || 0
                    }`,
                )
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

    const updateClient = async ({ setLoading, setShow, reset, ...props }) => {
        await csrf()

        let runfinally = true

        axios
            .post(`/self-enrollment/update-life-insurance`, props)
            .then(() => mutate())
            .catch(error => {
                const nerror = error?.response?.data?.message
                swaerror('Client Update Failed', nerror)
                runfinally = false
            })
            .finally(() => {
                setLoading(false)
                if (runfinally) {
                    swasuccess(
                        'Client Updated',
                        'You have successfully updated the client',
                    )
                    setShow(false)
                    reset()
                }
            })
    }

    const removeClient = async ({ setLoading, ...props }) => {
        await csrf()

        let runfinally = true

        axios
            .post(`/self-enrollment/remove-client`, props)
            .then(() => mutate())
            .catch(error => {
                const nerror = error?.response?.data?.message
                swaerror('Client Remove Failed', nerror)
                runfinally = false
            })
            .finally(() => {
                setLoading(false)
                if (runfinally) {
                    swasuccess(
                        'Client Removed',
                        'You have successfully removed the client',
                    )
                }
            })
    }

    const exportClients = async ({ setLoading }) => {
        await csrf()

        let runfinally = true

        axios
            .get(`${env.apiPath}/self-enrollment/export-clients/${company}`, {
                responseType: 'blob',
            })
            .then(res => {
                console.log(res)
                if (res.data.size !== 0) {
                    let filename = res.headers['content-disposition']
                        .split('filename=')[1]
                        .split('.')[0]
                    let extension = res.headers['content-disposition']
                        .split('.')[1]
                        .split(';')[0]

                    const url = window.URL.createObjectURL(new Blob([res.data]))
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', `${filename}.${extension}`)
                    document.body.appendChild(link)
                    link.click()
                } else {
                    swaerror(
                        'Export Client Failed',
                        "There's no data found to generate masterlist file!",
                    )
                    runfinally = false
                }
            })
            .finally(() => {
                setLoading(false)
                if (runfinally) {
                    swasuccess(
                        'Client Exported',
                        'You have successfully export the client masterlist',
                    )
                }
            })
    }

    return {
        clients,
        updateClient,
        removeClient,
        exportClients,
    }
}
