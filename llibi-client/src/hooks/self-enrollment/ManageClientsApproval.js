import useSWR from 'swr'
import axios from '@/lib/axios'

import { env } from '@/../next.config'

export const ManageClientsApproval = ({ memberId, company }) => {
    const { data: clients, mutate } = useSWR(
        `${env.apiPath}/self-enrollment/get-submitted-and-approved-clients/${memberId}/${company}`,
        () =>
            axios
                .get(
                    `${env.apiPath}/self-enrollment/get-submitted-and-approved-clients/${memberId}/${company}`,
                )
                .then(res => res.data.list)
                .catch(error => {
                    if (error.response.status !== 409) throw error
                    alert('error')
                }),
    )

    return {
        clients,
    }
}
