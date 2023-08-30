import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import Button from '@/components/Button'
import Label from '@/components/Label'

import axios from '@/lib/axios'

import { MdOutlineThumbDown, MdOutlineThumbUp } from 'react-icons/md'
import Swal from 'sweetalert2'

export default function FeedBackIndex() {
  // https://dev.to/michaelburrows/create-a-custom-react-star-rating-component-5o6
  // const [rating, setRating] = useState(0)
  const [feedBackForm, setFeedBackForm] = useState({
    rating: '',
    comments: '',
  })
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { rid, compcode, memid, reqstat } = router.query

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${process.env.apiPath}/feedbacks`, {
        ...feedBackForm,
        request_id: rid,
        company_code: compcode,
        member_id: memid,
        request_status: reqstat,
      })
      Swal.fire('Success', response.data.message, 'success')
      setLoading(false)
      router.push('/')
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const checkIfAlreadyFeedback = async () => {
    try {
      const response = await axios.get(
        `${process.env.apiPath}/feedbacks/${rid}`,
      )
      if (response.data) {
        router.push('/')
      }
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    if (rid) {
      checkIfAlreadyFeedback()
    }
  }, [router.query])

  if (!rid) return <h1>Loading...</h1>

  return (
    <>
      <Head>
        <title>Feedback</title>
      </Head>
      <div className="py-12">
        <div className="md:w-[40em] mx-auto w-full px-10 md:px-0">
          <div className="mb-5">
            <h1 className="mb-1 text-center text-3xl font-bold text-gray-700">
              Are you satisfied on our service?
            </h1>

            <div className="flex justify-center gap-5">
              <MdOutlineThumbUp
                className={`${
                  feedBackForm.rating === 'up'
                    ? 'text-blue-700'
                    : 'text-gray-700'
                } text-[7em] cursor-pointer hover:text-blue-700`}
                onClick={() =>
                  setFeedBackForm({ ...feedBackForm, rating: 'up' })
                }
              />
              <MdOutlineThumbDown
                className={`${
                  feedBackForm.rating === 'down'
                    ? 'text-red-700'
                    : 'text-gray-700'
                } text-[7em] cursor-pointer hover:text-red-700`}
                onClick={() =>
                  setFeedBackForm({ ...feedBackForm, rating: 'down' })
                }
              />
            </div>
          </div>
          <div className="mb-5">
            <Label className="mb-1">We are happy to hear from you</Label>
            <textarea
              className="w-full border text-sm rounded-lg focus:outline focus:outline-1 block p-2.5"
              rows={5}
              placeholder="If you have any additional feedback, please type in here."
              defaultValue={feedBackForm.comments}
              onChange={e =>
                setFeedBackForm({ ...feedBackForm, comments: e.target.value })
              }
            />
          </div>
          <div className="mb-5">
            <Button loading={loading} onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
