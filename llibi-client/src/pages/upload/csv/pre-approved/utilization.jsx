import axios from '@/lib/axios'
import React, { useState } from 'react'
import { useRouter } from 'next/router'

import Utilization from '@/hooks/pre-approved/utilization'

export default function UtilizationPage() {
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { uploadUtilizationCsv } = Utilization()

  const handleUpload = async () => {
    if (!file) {
      alert('Please select csv file first.')
      return
    }
    setIsLoading(true)
    const FORMDATA = new FormData()
    if (file) {
      for (let index = 0; index < file.length; index++) {
        FORMDATA.append('file[]', file[index])
      }
    }

    uploadUtilizationCsv({ setIsLoading, FORMDATA })

    // await axios.get(`sanctum/csrf-cookie`)

    // try {
    //   const response = await axios.post(
    //     `${process.env.apiPath}/pre-approve/utilization`,
    //     FORMDATA,
    //   )
    //   setIsLoading(false)
    // } catch (error) {
    //   setIsLoading(false)
    //   throw error
    // }
  }
  return (
    <>
      <div className="max-w-lg flex flex-col justify-between items-center border mx-auto mt-20 p-5 rounded-md h-[20rem]">
        <div>
          <h1 className="font-bold uppercase text-3xl mb-5 text-gray-900">
            UPLOAD CSV FOR UTILIZATION
          </h1>
          <label htmlFor="file" className="text-gray-700 text-sm font-semibold">
            Select CSV File
          </label>
          <input
            className="mb-5 w-full border bg-blue-50 p-3 rounded-md cursor-pointer"
            type="file"
            name="file"
            id="file"
            multiple
            accept=".csv"
            onChange={e => setFile(e.target.files)}
          />
        </div>

        <button
          className="p-3 w-full rounded-md font-bold hover:underline"
          onClick={() => router.push('/upload/csv/pre-approved/laboratory')}>
          Switch to Laboratory
        </button>
        <button
          disabled={isLoading}
          className={`${
            isLoading ? 'bg-gray-900' : 'bg-blue-700 hover:bg-blue-900'
          }  p-3 w-full rounded-md uppercase text-white font-bold`}
          onClick={handleUpload}>
          Upload
        </button>
      </div>
    </>
  )
}
