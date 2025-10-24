import useSWR from 'swr'
import axios from '@/lib/axios'
import Swal from 'sweetalert2'
import { env } from '@/../next.config'

export const ManageEnumerateLaboratory = ({ id }) => {
  const { data: procedure, mutate } = useSWR(
    `${env.apiPath}/self-service/get-procedure/${id}`,
    () =>
      axios
        .get(`${env.apiPath}/self-service/get-procedure/${id}`)
        .then((res) => res.data)
        .catch((err) => {
          if (err.response.status !== 409) throw err
          alert('error')
        }),
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 60000,
    }
  )

  return {
    procedure,
    mutate, // ✅ return mutate so components can update data locally
  }
}
