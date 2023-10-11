import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'

import BackdropComponent from '@/components/BackdropComponent'

export default function SendingFeedback() {
  const router = useRouter()
  const fileRef = useRef(null)

  const { employee_id } = router.query

  const [file, setFile] = useState(null)
  const [email, setEmail] = useState('')
  const [bccEmail, setBccEmail] = useState('')

  const [open, setOpen] = useState(false)

  const handleSendFeedback = async () => {
    const FORMDATA = new FormData()

    FORMDATA.append('loa', file)
    FORMDATA.append('email', email)
    FORMDATA.append('employee_id', employee_id)
    setOpen(true)
    try {
      const response = await axios.post(
        `${process.env.apiPath}/corporate/feedbacks`,
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

  useEffect(() => {
    const getEmployee = async () => {
      try {
        const response = await axios.get(
          `${process.env.apiPath}/corporate/feedbacks/employee?employee_id=${employee_id}`,
        )
        setEmail(response.data.email)
      } catch (error) {
        throw new Error(error)
      }
    }
    if (employee_id) {
      getEmployee()
    }
  }, [employee_id])

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-blue-gray-50">
        <div className="w-1/2 mx-auto border flex flex-col items-center p-5 shadow-md bg-white rounded-md">
          <div className="w-full px-3 mb-3 text-center">
            <label className="font-bold uppercase text-lg">
              Sending Loa with Feedback link
            </label>
          </div>
          <div className="w-full px-3 mb-3">
            <label className="text-sm font-bold" htmlFor="">
              Recipient Email {''}
              <small className="font-light text-red-700">(Required)</small>
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
            <label className="text-sm font-bold" htmlFor="">
              BCC Email{' '}
              <small className="font-light text-red-700">
                (To add multiple bcc add comma separated like this
                email1@example.com,email2.example.com)
              </small>
            </label>
            <input
              className="w-full rounded-md"
              type="email"
              name="bccemail"
              id="bccemail"
              placeholder="BCC Email"
              value={bccEmail}
              onChange={e => setBccEmail(e.target.value)}
            />
          </div>
          <div className="w-full px-3 mb-3">
            <label className="text-sm font-bold" htmlFor="">
              LOA Attachment{' '}
              <small className="font-light text-red-700">
                (Required & Downloaded LOA PDF from corporate only)
              </small>
            </label>
            <input
              className="w-full cursor-pointer"
              type="file"
              name="upload_loa"
              id="upload_loa"
              onChange={e => setFile(e.target.files[0])}
              ref={fileRef}
            />
          </div>
          <div className="w-full px-3 mt-6">
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
