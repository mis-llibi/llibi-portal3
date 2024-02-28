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

export function getPrincipal({ searchStr = '' }) {
  return useSWR(
    `/api/members-enrollment/principals?q=${searchStr}`,
    async () => {
      try {
        const response = await axios.get(
          `/api/members-enrollment/principals?q=${searchStr}`,
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
