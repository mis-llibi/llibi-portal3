import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import axios from '@/lib/axios'

import { FaRegUser, FaSearch } from 'react-icons/fa'
import ComplaintInformation from '@/components/Self-Service/ComplaintInformation'

export default function ComplaintDetails() {
  const router = useRouter()

  const { case_id } = router.query
  const [complaint, setComplaint] = useState(null)

  const getComplaint = async () => {
    try {
      const response = await axios.get(`/api/complaint/${case_id}`)

      setComplaint(response.data)
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    getComplaint()
  }, [case_id])

  // console.log(complaint)

  return (
    <>
      <div className="flex gap-5 justify-center items-center h-[50vh] bg-gray-50">
        <ComplaintInformation complaint={complaint} />
      </div>

      <div className="flex justify-center mt-3">
        <div className="w-3/4">
          <div className="flex items-center gap-1">
            <div className="flex-grow">
              <input type="text" className="w-full rounded-md" placeholder='Search by name' />
            </div>
            <div>
              <button className="bg-blue-700 p-3 text-white rounded-md">
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
