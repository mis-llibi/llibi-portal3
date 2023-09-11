import axios from '@/lib/axios'
import React, { useState } from 'react'

export default function ClaimsPage() {
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async () => {
    setIsLoading(true)
    const FORMDATA = new FormData()
    if (file) {
      FORMDATA.append('file', file)
    }

    await axios.get(`sanctum/csrf-cookie`)

    try {
      const response = await axios.post(
        `${process.env.apiPath}/pre-approve/claims`,
        FORMDATA,
      )
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }
  return (
    <>
      <div className="max-w-lg flex flex-col justify-center items-center border mx-auto mt-20 p-5 rounded-md">
        <h1 className="font-bold uppercase text-3xl mb-5">UPLOAD CSV</h1>
        <input
          className="mb-5 w-full"
          type="file"
          name="file"
          id="file"
          onChange={e => setFile(e.target.files[0])}
        />
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
