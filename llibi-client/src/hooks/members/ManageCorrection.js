import useSWR from 'swr'
import axios from '@/lib/axios'

import Swal from 'sweetalert2'

import { env } from '@/../next.config'

export const useManageCorrection = ({ id }) => {
    const { data: corrections, mutate } = useSWR(
        `${env.apiPath}/get-correction/${id}`,
        () =>
            axios
                .get(`${env.apiPath}/get-correction/${id}`)
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

    return { corrections }
}
