import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Button from '@/components/Button'
import BackdropComponent from '@/components/BackdropComponent'

export default function ManualPage() {
  const router = useRouter()
  const { q, member_id, company_code } = router.query
  const [loading, setLoading] = useState(false)
  const [comment, setComment] = useState('')

  const handleSubmit = async () => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }

  return (
    <>
      <Head>
        <title>Feedback</title>
      </Head>
      <div className="py-12">
        <div className="md:w-[60em] mx-auto w-full px-10 md:px-0">
          <div>
            <div className="flex justify-end items-center">
              <img src="/logo.png" alt="llibi logo" width={252} />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl mb-3 font-bold">
                YOUR FEEDBACK IS IMPORTANT TO US!
              </h1>
            </div>
            <p className="mb-3">
              <span className="font-semibold">Lacson & Lacson</span> is
              committed to continually improving the quality of service we offer
              to our members, and we appreciate your feedback. Please help us by
              completing this feedback form.
            </p>
          </div>
          <div className="mb-5">
            <p className="text-sm">
              5. What could we do to improve our service to you, let us know
              your comments:
            </p>
            <textarea
              className="w-full border text-sm rounded-lg focus:outline focus:outline-1 block p-2.5"
              rows={5}
              placeholder="If you have any additional feedback, please type in here."
              defaultValue={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <Button loading={false} onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </div>

      <BackdropComponent open={loading} />
    </>
  )
}
