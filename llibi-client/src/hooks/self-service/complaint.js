import useSWR from 'swr'
import axios from '@/lib/axios'

export default function ComplaintHooks() {
  const { data: complaints, mutate } = useSWR(
    `/api/complaint`,
    async () => {
      try {
        const response = await axios.get('/api/complaint')
        return response.data
      } catch (error) {
        throw error
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
    },
  )

  return { complaints: complaints }
}
