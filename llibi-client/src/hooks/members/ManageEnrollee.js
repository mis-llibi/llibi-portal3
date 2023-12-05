import useSWR from 'swr'
import axios from '@/lib/axios'

import Swal from 'sweetalert2'

import { env } from '@/../next.config'

export const useManageEnrollee = ({ selection }) => {
  const { data: enrollees, mutate } = useSWR(
    `${env.apiPath}/get-enrollees/${selection || 1}`,
    () =>
      axios
        .get(`${env.apiPath}/get-enrollees/${selection || 1}`)
        .then(res => res.data)
        .catch(error => {
          if (error.response.status !== 409) throw error
          alert('error')
        }),
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 60000,
    },
  )

  const csrf = () => axios.get(`sanctum/csrf-cookie`)

  const swasuccess = (title, text) => {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: title,
      text: text,
      showConfirmButton: true,
    })
  }

  const swaerror = (title, text) => {
    const ntext = text?.replace(/ *\([^)]*\) */g, '').replace('values)', '')
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: title,
      text: ntext,
      showConfirmButton: true,
    })
  }

  //Client
  const upload = async ({ setLoading, setShow, reset, ...props }) => {
    await csrf()

    const formData = new FormData()

    formData.append('file', ...props.file)

    let runfinally = true

    axios
      .post(`/hr/import-enrollees`, formData)
      .then(res => {
        mutate()
        props.setLateEnrolledUploaded(res.data)
      })
      .catch(error => {
        const nerror = error?.response?.data?.message
        swaerror('Enrollees Upload Failed', nerror)
        runfinally = false
      })
      .finally(() => {
        setLoading(false)
        if (runfinally) {
          swasuccess(
            'Enrollees Uploaded',
            'You have successfully uploaded the enrollees to the masterlist',
          )
          // setShow(false)
          reset()
        }
      })
  }

  const create = async ({ setLoading, setShow, reset, ...props }) => {
    await csrf()

    let runfinally = true

    axios
      .post(`/hr/create-enrollee`, props)
      .then(() => mutate())
      .catch(error => {
        const nerror = error?.response?.data?.message
        swaerror('Enrollee Create Failed', nerror)
        runfinally = false
      })
      .finally(() => {
        setLoading(false)
        if (runfinally) {
          swasuccess(
            'Enrollee Created',
            'You have successfully created the enrollee',
          )
          setShow(false)
          reset()
        }
      })
  }

  const update = async ({ setLoading, setShow, reset, ...props }) => {
    await csrf()

    let runfinally = true

    axios
      .post(`/hr/update-enrollee`, props)
      .then(() => mutate())
      .catch(error => {
        const nerror = error?.response?.data?.message
        swaerror('Enrollee Update Failed', nerror)
        runfinally = false
      })
      .finally(() => {
        setLoading(false)
        if (runfinally) {
          swasuccess(
            'Enrollee Updated',
            'You have successfully updated the enrollee',
          )
          setShow(false)
          reset()
        }
      })
  }

  const remove = async ({ setLoading, ...props }) => {
    await csrf()

    let runfinally = true

    axios
      .post(`/hr/remove-enrollee`, props)
      .then(() => mutate())
      .catch(error => {
        const nerror = error?.response?.data?.message
        swaerror('Enrollee Remove Failed', nerror)
        runfinally = false
      })
      .finally(() => {
        setLoading(false)
        if (runfinally) {
          swasuccess(
            'Enrollee Removed',
            'You have successfully removed the enrollee',
          )
        }
      })
  }

  const forEnrollment = async ({ setLoading, ...props }) => {
    await csrf()

    let runfinally = true

    axios
      .post(`/hr/for-enrollment-member`, props)
      .then(() => mutate())
      .catch(error => {
        const nerror = error?.response?.data?.message
        swaerror('Member For Enrollment Failed', nerror)
        runfinally = false
      })
      .finally(() => {
        setLoading(false)
        if (runfinally) {
          swasuccess(
            'Member For Enrollment',
            'You have successfully submitted these members request for enrollment to LLIBI',
          )
        }
      })
  }

  const forCancellation = async ({ setLoading, ...props }) => {
    await csrf()

    let runfinally = true

    axios
      .post(`/hr/for-cancellation-member`, props)
      .then(() => mutate())
      .catch(error => {
        const nerror = error?.response?.data?.message
        swaerror('Member For Cancellation Failed', nerror)
        runfinally = false
      })
      .finally(() => {
        setLoading(false)
        if (runfinally) {
          swasuccess(
            'Member For Cancellation',
            'You have successfully submitted these members request for cancellation to LLIBI',
          )
        }
      })
  }

  const revokeCancellation = async ({ setLoading, ...props }) => {
    await csrf()

    let runfinally = true

    axios
      .post(`/hr/revoke-cancellation-member`, props)
      .then(() => mutate())
      .catch(error => {
        const nerror = error?.response?.data?.message
        swaerror('Revoking Cancellation Failed', nerror)
        runfinally = false
      })
      .finally(() => {
        setLoading(false)
        if (runfinally) {
          swasuccess(
            'Cancellation Revoked',
            'You have successfully revoked these members submitted for cancellation to LLIBI',
          )
        }
      })
  }

  const forMemberCorrection = async ({
    setLoading,
    setShow,
    reset,
    ...props
  }) => {
    await csrf()

    let runfinally = true

    axios
      .post(`/hr/for-member-correction`, props)
      .then(() => mutate())
      .catch(error => {
        const nerror = error?.response?.data?.message
        swaerror('Member For Correction Failed', nerror)
        runfinally = false
      })
      .finally(() => {
        setLoading(false)
        if (runfinally) {
          swasuccess(
            'Member Corrections Submitted',
            'You have successfully submitted a request for correction to the LLIBI officer',
          )
          setShow(false)
          reset()
        }
      })
  }

  const revokeCorrection = async ({ setLoading, ...props }) => {
    await csrf()

    let runfinally = true

    axios
      .post(`/hr/revoke-correction-member`, props)
      .then(() => mutate())
      .catch(error => {
        const nerror = error?.response?.data?.message
        swaerror('Revoking Member Correction Failed', nerror)
        runfinally = false
      })
      .finally(() => {
        setLoading(false)
        if (runfinally) {
          swasuccess(
            'Member Correction Revoked',
            'You have successfully revoked these members submitted for correction to LLIBI',
          )
        }
      })
  }

  //Admin
  const updateEnrollmentStatus = async ({
    setLoading,
    setShow,
    reset,
    ...props
  }) => {
    await csrf()

    let runfinally = true

    axios
      .post(`/hr/update-enrollment-status`, props)
      .then(() => mutate())
      .catch(error => {
        const nerror = error?.response?.data?.message
        swaerror('Enrollment Status Update Failed', nerror)
        runfinally = false
      })
      .finally(() => {
        setLoading(false)
        if (runfinally) {
          swasuccess(
            'Enrollment Status Updated',
            'You have successfully updated the enrollment status',
          )
          setShow(false)
          reset()
        }
      })
  }

  const approveCancellation = async ({ setLoading, ...props }) => {
    await csrf()

    let runfinally = true

    axios
      .post(`/hr/approve-cancellation-member`, props)
      .then(() => mutate())
      .catch(error => {
        const nerror = error?.response?.data?.message
        swaerror('Approve Cancellation Failed', nerror)
        runfinally = false
      })
      .finally(() => {
        setLoading(false)
        if (runfinally) {
          swasuccess(
            'Membership Cancelled',
            'You have successfully cancelled their membership',
          )
        }
      })
  }

  return {
    enrollees,
    upload,
    create,
    update,
    remove,
    forEnrollment,
    forCancellation,
    revokeCancellation,
    forMemberCorrection,
    revokeCorrection,

    updateEnrollmentStatus,
    approveCancellation,
  }
}
