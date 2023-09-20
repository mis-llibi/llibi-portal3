import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'

import BackdropComponent from '@/components/BackdropComponent'

export default function ManualSendPage() {
  const router = useRouter()
  const fileRef = useRef(null)

  const [file, setFile] = useState(null)
  const [email, setEmail] = useState('')

  const [open, setOpen] = useState(false)

  const handleSendFeedback = async () => {
    const FORMDATA = new FormData()

    FORMDATA.append('loa', file)
    FORMDATA.append('email', email)
    FORMDATA.append('employee_id', router.query.employee_id)
    setOpen(true)
    try {
      const response = await axios.post(
        `${process.env.apiPath}/feedbacks/manual`,
        FORMDATA,
      )
      setOpen(false)
      fileRef.current.value = null
      setFile(null)
      setEmail('')
    } catch (error) {
      setOpen(false)
      alert('Something wrong')
      throw error
    }
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="w-1/3 mx-auto border flex flex-col items-center p-5 shadow-md">
          <div className="w-full px-3 mb-3 text-center">
            <label className="font-bold uppercase text-lg">Attach LOA</label>
          </div>
          <div className="w-full px-3 mb-3">
            <label className="text-sm font-bold" htmlFor="">
              Email
            </label>
            <input
              className="w-full rounded-md"
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full px-3 mb-3">
            <input
              className="w-full cursor-pointer"
              type="file"
              name="upload_loa"
              id="upload_loa"
              onChange={e => setFile(e.target.files[0])}
              ref={fileRef}
            />
          </div>
          <div className="w-full px-3 mb-3">
            <button
              className="w-full font-bold tracking-widest rounded-md bg-blue-700 hover:bg-blue-900 uppercase text-white p-2"
              onClick={handleSendFeedback}>
              Submit
            </button>
          </div>
        </div>
      </div>

      <BackdropComponent open={open} />
    </>
  )
}
