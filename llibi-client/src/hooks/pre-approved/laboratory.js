import React from 'react'
import useSWR from 'swr'

import axios from '@/lib/axios'

export default function Laboratory({ q }) {
  const LaboratoryRequest = useSWR(
    `/api/pre-approve/laboratory?q=${q}`,
    async () => {
      try {
        const response = await axios.get(`/api/pre-approve/laboratory?q=${q}`)

        return response.data
      } catch (error) {
        throw error
      }
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  // const uploadLaboratoryCsv = async ({ setIsLoading, FORMDATA }) => {
  //   // await axios.get(`sanctum/csrf-cookie`)

  //   try {
  //     const response = await axios.post(
  //       `${process.env.apiPath}/pre-approve/upload/laboratory`,
  //       FORMDATA,
  //     )
  //   } catch (error) {
  //     throw error
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // const addLaboratory = async data => {
  //   try {
  //     const response = await axios.post(
  //       `${process.env.apiPath}/pre-approve/laboratory`,
  //       data,
  //     )
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // const editLaboratory = async (data, id) => {
  //   try {
  //     const response = await axios.put(
  //       `${process.env.apiPath}/pre-approve/laboratory/${id}`,
  //       data,
  //     )
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // const deleteLaboratory = async id => {
  //   try {
  //     const response = await axios.delete(
  //       `${process.env.apiPath}/pre-approve/laboratory/${id}`,
  //     )
  //   } catch (error) {
  //     throw error
  //   }
  // }

  return {
    // uploadLaboratoryCsv,
    LaboratoryRequest,
    // addLaboratory,
    // editLaboratory,
    // deleteLaboratory,
  }
}

export const addLaboratory = async data => {
  try {
    const response = await axios.post(`/api/pre-approve/laboratory`, data)
  } catch (error) {
    throw error
  }
}

export const editLaboratory = async (data, id) => {
  try {
    const response = await axios.put(
      `${process.env.apiPath}/pre-approve/laboratory/${id}`,
      data,
    )
  } catch (error) {
    throw error
  }
}

export const deleteLaboratory = async id => {
  try {
    const response = await axios.delete(
      `${process.env.apiPath}/pre-approve/laboratory/${id}`,
    )
  } catch (error) {
    throw error
  }
}

export const uploadLaboratoryCsv = async ({ setIsLoading, FORMDATA }) => {
  try {
    const response = await axios.post(
      `${process.env.apiPath}/pre-approve/laboratory/import`,
      FORMDATA,
    )
  } catch (error) {
    throw error
  } finally {
    setIsLoading(false)
  }
}
