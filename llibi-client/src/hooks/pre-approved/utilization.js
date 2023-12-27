import React from 'react'

import axios from '@/lib/axios'

export default function Utilization() {
  const uploadUtilizationCsv = async ({ setIsLoading, FORMDATA }) => {
    await axios.get(`sanctum/csrf-cookie`)

    try {
      const response = await axios.post(
        `${process.env.apiPath}/pre-approve/utilization`,
        FORMDATA,
      )
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { uploadUtilizationCsv }
}
