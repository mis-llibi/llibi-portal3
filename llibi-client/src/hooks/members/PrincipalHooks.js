import useSWR from 'swr'
import axios from '@/lib/axios'

const swrSetting = {
  revalidateOnFocus: false,
  revalidateOnMount: true,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 0,
}

export function getPrincipal({ search }) {
  return useSWR(
    `/api/members-enrollment/principals?q=${search}`,
    async () => {
      try {
        const response = await axios.get(
          `/api/members-enrollment/principals?q=${search}`,
        )
        return response.data
      } catch (error) {
        if (error.response.status !== 409) throw error
        alert('Somethin went wrong.')
      }
    },
    { ...swrSetting },
  )
}
