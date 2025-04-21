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
export const useBirthdateSearch = async (search, setErrors) => {
  try {
    const response = await axios.post('/api/search-birthdate-by-name', search)
    return response.data
  } catch (error) {
    if (error.response?.data?.errors) {
      setErrors(Object.values(error.response.data.errors).flat())
    } else {
      setErrors(['An unexpected error occurred.'])
    }

    return null
  }
}
