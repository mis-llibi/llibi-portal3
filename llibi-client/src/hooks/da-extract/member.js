import useSWR from 'swr'
import axios from '@/lib/axios'

import Swal from 'sweetalert2'

export const useMember = ({}) => {
    const { data: members, mutate } = useSWR(
        `/api/da-extract-members`,
        () =>
            axios
                .get(`/api/da-extract-members`)
                .then(res => res.data)
                .catch(error => {
                    if (error.response.status !== 409) throw error
                    alert('error')
                })
                .finally(() => {
                    //setLoading(false)
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

    return {
        members,
    }
}
