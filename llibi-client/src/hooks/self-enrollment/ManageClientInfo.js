import useSWR from 'swr'

import axios from '@/lib/axios'

import Swal from 'sweetalert2'

import { env } from '@/../next.config'

export const ManageClientInfo = ({ id, company }) => {
  const { data: client, mutate } = useSWR(
    `${env.apiPath}/self-enrollment/get-client-info/${id}/${company}`,
    () =>
      axios
        .get(`${env.apiPath}/self-enrollment/get-client-info/${id}/${company}`)
        .then(res => res.data)
        .catch(error => {
          if (error.response.status !== 409) throw error
          alert('error')
        }),
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 1000,
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

  const updateClientInfo = async ({ setLoading, reset, ...props }) => {
    await csrf()

    let runfinally = true

    axios
      .post(`/self-enrollment/update-client-info/${company}`, props)
      .then(() => mutate())
      .catch(error => {
        const nerror = error?.response?.data?.message
        swaerror('Member Update Failed', nerror)
        runfinally = false
      })
      .finally(() => {
        setLoading(false)
        if (runfinally) {
          swasuccess(
            'Member Updated',
            'You have successfully updated your personal information',
          )
          reset()
        }
      })
  }

  const submitDependent = async ({ setLoading, ...props }) => {
    await csrf()

    let runfinally = true

    const formData = new FormData()

    formData.append(`principalId`, props.id)
    formData.append(`memberId`, props.memberId)
    formData.append(`principalCivilStatus`, props.civilStatus)
    formData.append(`genderPrincipal`, props.gender)
    formData.append(`hireDate`, props.hireDate)
    formData.append(`coverageDate`, props.coverageDate)

    props?.deps.map((item, i) => {
      formData.append(`list[]`, i)
      formData.append(`id[]`, item?.mId)
      formData.append(`first_name[]`, item?.first_name)
      formData.append(`last_name[]`, item?.last_name)
      formData.append(`middle_name[]`, item?.middle_name)
      formData.append(`relation[]`, item?.relation)
      formData.append(`birth_date[]`, item?.birth_date)
      formData.append(`gender[]`, item?.gender)
      formData.append(`civil_status[]`, item?.civil_status)

      for (let g = 0; g < item?.attachment?.length; g++) {
        formData.append(`attachment${i}[]`, item?.attachment[g])
      }

      //FOR LLIBI
      if (company === 'LLIBI') {
        formData.append(`skip_hierarchy[]`, item?.skip_hierarchy)
        formData.append(`skip_reason[]`, item?.skip_reason)

        item?.skip_document &&
          formData.append(`skip_document[]`, item?.skip_document[0])
      }
    })

    axios
      .post(`/self-enrollment/submit-dependent/${company}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => mutate()) //console.log(res)) //mutate())
      .catch(error => {
        const nerror = error?.response?.data?.message
        swaerror('Enrollment Update Failed', nerror)
        runfinally = false
      })
      .finally(() => {
        setLoading(false)
        if (runfinally) {
          swasuccess(
            'Enrollment Updated',
            'You have successfully updated your personal information & your dependent',
          )
        }
      })
  }

  const submitWithoutDependent = async ({ setLoading, ...props }) => {
    await csrf()

    let runfinally = true

    axios
      .post(`/self-enrollment/submit-without-dependent/${company}`, props)
      .then(() => mutate())
      .catch(error => {
        const nerror = error?.response?.data?.message
        swaerror('Enrollment Update Failed', nerror)
        runfinally = false
      })
      .finally(() => {
        setLoading(false)
        if (runfinally) {
          swasuccess(
            'Enrollment Updated',
            'You have successfully updated your personal information',
          )
        }
      })
  }

  const milestoneUpdate = async ({
    setLoading,
    reset,
    milestone,
    ...props
  }) => {
    await csrf()

    let runfinally = true

    axios
      .post(`/self-enrollment/milestone-update/${company}`, {
        milestone: milestone,
        ...props,
      })
      .then(() => mutate())
      .catch(error => {
        const nerror = error?.response?.data?.message
        swaerror('Milestone Update Failed', nerror)
        runfinally = false
      })
      .finally(() => {
        setLoading(false)
        if (runfinally) {
          swasuccess(
            'Milestone Enrollment Updated',
            'You have successfully updated your milestone information',
          )
          reset({ deps: [] })
          location.reload()
        }
      })
  }

  return {
    client,
    updateClientInfo,
    submitDependent,
    submitWithoutDependent,
    milestoneUpdate,
  }
}
