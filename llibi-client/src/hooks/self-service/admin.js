import useSWR from 'swr'

import axios from '@/lib/axios'
import Swal from 'sweetalert2'

import { env } from '@/../next.config'

export const useAdmin = ({ name, status }) => {
    const { data: clients, mutate } = useSWR(
        `${env.apiPath}/self-service/admin-search-request/${name || 0}/${status || '2,6'}`,
        () =>
          axios
            .get(
              `${env.apiPath}/self-service/admin-search-request/${name || 0}/${status || '2,6'}`,
            )
            .then(res => res.data)
            .catch(error => {
              if (error.response?.status !== 409) throw error;
              alert('error');
            }),
        {
          revalidateOnFocus: false,
          revalidateOnMount: true,
          revalidateOnReconnect: false,
          refreshWhenOffline: false,
          refreshWhenHidden: true,
          refreshInterval: 10000,
        },
      );


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

  const searchRequest = async ({ setLoading }) => {
    await csrf()

    let runfinally = true

    const controller = new AbortController()
    const signal = controller.signal

    axios
      .get(
        `${env.apiPath}/self-service/admin-search-request/${name || 0}/${
          status || 2
        }`,
        { signal: signal },
      )
      .then(() => mutate())
      .catch(error => {
        const nerror = error?.response?.data?.message
        swaerror('Search not found', nerror)
        runfinally = false
      })
      .finally(() => {
        setLoading(false)
        if (runfinally) {
          //swasuccess('Client Found', '')
        }
      })
  }

  const updateRequest = async ({
    setRequest,
    setClient,
    setLoading,
    ...props
  }) => {
    await csrf()

    const formData = new FormData()

    formData.append('id', props.id)
    formData.append('status', props.status)
    if (props.status === '3') {
      formData.append('attachLOA', ...props?.attachLOA)
      formData.append('loaNumber', props?.loaNumber)
      formData.append('approvalCode', props?.approvalCode)
    } else {
      formData.append('disapproveRemarks', props?.disapproveRemarks)
    }
    formData.append('hospital_email1', props.hospital_email1)
    formData.append('hospital_email2', props.hospital_email2)
    formData.append('email_format_type', props.email_format_type)

    let runfinally = true

    axios
      .post(`/self-service/admin-update-request`, formData)
      .then(res => {
        mutate()

        const result = res.data
        //console.log(result.data)
        Swal.fire({
          title: 'Updated',
          text: `Your have successfully updated the request for LOA`,
          icon: 'success',
        })
        setRequest(result?.all)
        setClient(result?.client[0])
      })
      .catch(error => {
        const nerror = error?.response?.data?.message
        swaerror('Update Failed', nerror)
        runfinally = false
      })
      .finally(() => {
        setLoading(false)
        if (runfinally) {
          swasuccess(
            'Updated',
            'You have successfully updated the client request',
          )
          //setShow(false)
        }
      })
  }

  const exporting = async (from, to) => {
    await csrf()

    try {
      const response = await axios.post(
        `${env.apiPath}/self-service/admin/export`,
        {
          search: name ?? 0,
          status: status ?? 2,
          from: from ?? null,
          to: to ?? null,
        },
        { responseType: 'blob' },
      )
      const result = response.data
      const url = window.URL.createObjectURL(new Blob([result]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'records.xlsx')
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      alert('Something Went Wrong.')
      throw error
    }
  }

  const viewBy = async (row, type) => {
    await csrf()

    try {
      const response = await axios.post(`${env.apiPath}/view-by`, {
        type: type,
        ...row,
      })

      if (!response.data.status) {
        Swal.fire({
          // title: 'Updated',
          text: response.data.message,
          icon: 'error',
        })
      }
      return response.data
    } catch (error) {
      throw error
    }
  }

  const { data: settings, mutate: mutateSettings } = useSWR(
    `${env.apiPath}/settings`,
    () =>
      axios
        .get(`${env.apiPath}/settings`)
        .then(res => res.data)
        .catch(error => {
          if (error.response.status !== 409) throw error
          alert('error')
        }),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: true,
      refreshInterval: 10000,
    },
  )

  const updateSettings = async payload => {
    await csrf()

    try {
      const response = await axios.put(`/api/settings`, payload)

      if (response.data.status) {
        Swal.fire({
          title: 'Settings',
          text: response.data.message,
          icon: 'success',
        })
      }
    } catch (error) {
      throw error
    }
  }

  const previewExport = async (from, to) => {
    await csrf()

    try {
      const response = await axios.post(
        `/api/self-service/admin/preview-export-records`,
        {
          search: name ?? 0,
          status: status ?? 2,
          from: from ?? null,
          to: to ?? null,
        },
      )

      return response.data
    } catch (error) {
      throw error
    }
  }

  /*
        const searchRequest = async ({ setRequest, setLoading, name, status }) => {
            await csrf()

            axios
                .get(
                    `${env.apiPath}/self-service/admin-search-request/${
                        name || 0
                    }/${status || 2}`,
                )
                .then(res => {
                    const result = res.data
                    if (result?.length === 0) {
                        Swal.fire({
                            title: 'Search not found',
                            text:
                                'System cannot find the parameters you want to search',
                            icon: 'error',
                        })
                    }
                    setRequest(result)
                })
                .catch(error => {
                    if (error?.response?.status !== 422) throw error
                    alert(error?.response?.data?.message)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    */

  /*
        const updateRequest = async ({
            setRequest,
            setClient,
            setLoading,
            ...props
        }) => {
            await csrf()

            const formData = new FormData()

            formData.append('id', props.id)
            formData.append('status', props.status)
            if (props.status === '3') {
                formData.append('attachLOA', ...props?.attachLOA)
                formData.append('loaNumber', props?.loaNumber)
                formData.append('approvalCode', props?.approvalCode)
            } else {
                formData.append('disapproveRemarks', props?.disapproveRemarks)
            }

            axios
                .post(`/self-service/admin-update-request`, formData)
                .then(res => {
                    const result = res.data
                    //console.log(result.data)
                    Swal.fire({
                        title: 'Updated',
                        text: `Your have successfully updated the request for LOA`,
                        icon: 'success',
                    })
                    setRequest(result?.all)
                    setClient(result?.client[0])
                    //console.log(result)
                })
                .catch(error => {
                    if (error?.response?.status !== 422) throw error
                    alert(error?.response?.data?.message)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    */

  return {
    clients,
    searchRequest,
    updateRequest,
    exporting,
    viewBy,
    settings,
    updateSettings,
    previewExport,
  }
}
