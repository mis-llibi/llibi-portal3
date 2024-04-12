import useSWR from 'swr'
import axios from '@/lib/axios'

import Swal from 'sweetalert2'

const swrSetting = {
  revalidateOnFocus: false,
  revalidateOnMount: true,
  revalidateOnReconnect: false,
  refreshWhenOffline: false,
  refreshWhenHidden: false,
  refreshInterval: 30000, // revalidate every 5 minutes
}

export const useManageHrMember = ({ status }) => {
  return useSWR(
    `/api/members-enrollment/members?status=${status}`,
    async () => {
      try {
        const response = await axios.get(
          `/api/members-enrollment/members?status=${status}`,
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

export const submitForEnrollmentHooks = async data => {
  try {
    const respponse = await axios.post(
      '/api/members-enrollment/submit-for-enrollment',
      {
        data: data,
      },
    )
    Swal.fire('Success', respponse.data.message, 'success')
  } catch (error) {
    Swal.fire('Error', 'Something went wrong.', 'error')
    throw error
  }
}

export const updateNewEnrollee = async ({
  setLoading,
  setShow,
  data,
  reset,
  ...props
}) => {
  try {
    const FORMDATA = new FormData()

    for (let key in data) {
      if (key === 'attachment') {
        for (let index = 0; index < data[key].length; index++) {
          FORMDATA.append('attachment[]', data[key][index])
        }
      } else {
        FORMDATA.append(key, data[key])
      }
    }

    FORMDATA.append('_method', 'PUT')
    const response = await axios.post(
      `/api/members-enrollment/new-enrollment/${data.id}`,
      FORMDATA,
    )

    reset()
    setShow(false)
    Swal.fire('Success', response.data.message, 'success')
    return true
  } catch (error) {
    Swal.fire('Error', error?.response?.data?.message, 'error')
    return false
  }
}

export const insertNewEnrollee = async ({ data, reset, ...props }) => {
  try {
    const response = await axios.post(
      '/api/members-enrollment/new-enrollment',
      data,
    )

    reset()
    if (props?.isMileStone > 30 && props?.relation === 'SPOUSE') {
      Swal.fire(
        'Notice',
        `
        <p><strong>STATUS</strong> of TEST LASTNAME1, TEST FIRSTNAME1 was changed to <strong>MARRIED</strong>.</p>
        <p><strong>STATUS</strong> of TEST LASTNAME1, FATHER was changed to <strong>INACTIVE</strong>.</p>
        <p><strong>STATUS</strong> of TEST LASTNAME1, MOTHER was changed to <strong>INACTIVE</strong>.</p>
        `,
        'info',
      )
    } else {
      Swal.fire('Success', response.data.message, 'success')
    }
    return true
  } catch (error) {
    Swal.fire('Error', error?.response?.data?.message, 'error')
    return false
  }
}

export const submitForDeletionHooks = async data => {
  try {
    const respponse = await axios.post(
      '/api/members-enrollment/submit-for-deletion',
      {
        data: data,
      },
    )
    Swal.fire('Success', respponse.data.message, 'success')
  } catch (error) {
    Swal.fire('Error', 'Something went wrong.', 'error')
    throw error
  }
}
