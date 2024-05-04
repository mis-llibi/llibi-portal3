import useSWR from 'swr'
import axios from '@/lib/axios'

export default function ClientErrorLogsHooks() {
  return useSWR(
    `/api/error-logs`,
    async () => {
      try {
        const response = await axios.get('/api/error-logs')
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
      refreshInterval: 10000,
    },
  )
}

export const SendNotify = async ({ row, notifyTo, ...rest }) => {
  try {
    const response = await axios.post('/api/error-logs-send-notify', {
      row,
      notifyTo,
      ...rest,
    })
  } catch (error) {
    throw new Error('Something went wrong.')
  }
}
