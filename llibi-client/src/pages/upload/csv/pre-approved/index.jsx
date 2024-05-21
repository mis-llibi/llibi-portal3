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
    <div className="h-screen bg-gray-100 font-[poppins] flex items-center">
      <div className="max-w-lg flex flex-col justify-between items-center border mx-auto p-5 rounded-md h-[20rem] bg-white">
        <div>
          <h1 className="font-bold uppercase text-center text-3xl mb-5 text-fav-black">
            UPLOAD CSV FOR UTILIZATION
          </h1>
          <label htmlFor="file" className="text-gray-700 text-sm font-semibold">
            Select CSV File
          </label>
          <input
            className="mb-5 w-full border  p-3 rounded-md cursor-pointer file:bg-blue-600 file:rounded-md file:text-white file:border-none file:px-3 file:py-1"
            type="file"
            name="file"
            id="file"
            multiple
            accept=".csv"
            onChange={e => setFile(e.target.files)}
          />
        </div>

        <button
          className="p-3 w-full rounded-md font-bold hover:underline text-fav-subtitle uppercase underline"
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
    </div>
  )
}
