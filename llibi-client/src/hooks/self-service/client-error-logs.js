import useSWR from 'swr'
import axios from '@/lib/axios'
import Swal from 'sweetalert2'

export default function ClientErrorLogsHooks({ search, filter }) {
  return useSWR(
    `/api/error-logs?search=${search}&filter=${filter}`,
    async () => {
      try {
        const response = await axios.get(
          `/api/error-logs?search=${search}&filter=${filter}`,
        )
        return response.data
      } catch (error) {
        throw error
      }
    },
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 30000,
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

    if (notifyTo === 'member') {
      Swal.fire('Success', 'Email notification sent to the member.', 'success')
    } else if (notifyTo === 'cae') {
      Swal.fire(
        'Success',
        'Email notification sent to the CAE for validation with HR.',
        'success',
      )
    } else {
      Swal.fire(
        'Success',
        'Email notification sent to the MIS for further checking.',
        'success',
      )
    }
  } catch (error) {
    throw new Error('Something went wrong.')
  }
}
