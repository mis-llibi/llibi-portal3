import React from 'react'
import useSWR from 'swr'

import axios from '@/lib/axios'

export default function Laboratory() {
  const LaboratoryRequest = useSWR(
    `${process.env.apiPath}/pre-approve/laboratory`,
    async () => {
      try {
        const response = await axios.get(
          `${process.env.apiPath}/pre-approve/laboratory`,
        )

        return response.data
      } catch (error) {
        throw error
      }
    },
  )

  const uploadLaboratoryCsv = async ({ setIsLoading, FORMDATA }) => {
    await axios.get(`sanctum/csrf-cookie`)

    try {
      const response = await axios.post(
        `${process.env.apiPath}/pre-approve/upload/laboratory`,
        FORMDATA,
      )
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { uploadLaboratoryCsv, LaboratoryRequest }
}
