import useSWR from 'swr'
import axios from '@/lib/axios'

export const useMasterlist = ({ search = '' }) => {
  const { data: masterlist, mutate } = useSWR(
    `/api/search-masterlist?search=${search}`,
    async () => {
      try {
        const response = await axios.get(
          `/api/search-masterlist?search=${search}`,
        )

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

  return { masterlist }
}
