import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import Button from '@/components/Button'
import Label from '@/components/Label'
import QuestionComponent from './questions/QuestionComponent'

import axios from '@/lib/axios'

// import { MdOutlineThumbDown, MdOutlineThumbUp } from 'react-icons/md'
import { FaRegSmile, FaRegSadTear } from 'react-icons/fa'

import Slider from '@mui/material/Slider'

import Swal from 'sweetalert2'

export default function FeedBackIndex() {
  const router = useRouter()
  const { rid, compcode, memid, reqstat } = router.query
  // https://dev.to/michaelburrows/create-a-custom-react-star-rating-component-5o6
  // const [rating, setRating] = useState(0)
  const [feedBackForm, setFeedBackForm] = useState({
    rating: '',
    comments: '',
  })
  const [loading, setLoading] = useState(false)
  const [questionOne, setQuestionOne] = useState(50)
  const [questionTwo, setQuestionTwo] = useState(50)
  const [questionThree, setQuestionThree] = useState(50)

  const qOneHappy = questionOne >= 50 ? questionOne / 100 : 0
  const qOneSad = questionOne <= 50 ? (100 - questionOne) / 100 : 0

  const qTwoHappy = questionTwo >= 50 ? questionTwo / 100 : 0
  const qTwoSad = questionTwo <= 50 ? (100 - questionTwo) / 100 : 0

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
      // router.push('/')
      window.close()
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
        // router.push('/')
        window.close()
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
            <h1 className="mb-3 text-center text-3xl font-bold text-gray-700">
              Are you happy with our service?
            </h1>
            <p className="text-center text-sm mb-3">
              Please select happy or sad face base on your experience with our
              service.
            </p>
            <div className="flex justify-center gap-5">
              <span
                className={`${
                  feedBackForm.rating === 'happy' && 'bg-blue-100'
                } border hover:bg-blue-100 p-5 rounded-md shadow-md cursor-pointer`}
                onClick={() =>
                  setFeedBackForm({ ...feedBackForm, rating: 'happy' })
                }>
                <FaRegSmile className={`text-blue-700 text-[7em]`} />
              </span>
              <span
                className={`${
                  feedBackForm.rating === 'sad' && 'bg-red-100'
                } border hover:bg-red-100 p-5 rounded-md shadow-md cursor-pointer`}
                onClick={() =>
                  setFeedBackForm({ ...feedBackForm, rating: 'sad' })
                }>
                <FaRegSadTear className={`text-red-700 text-[7em]`} />
              </span>
            </div>
          </div>
          <div className="mb-5">
            <QuestionComponent
              question="1. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Impedit dicta, consequatur, sapiente voluptatibus quod voluptate
              architecto sequi non ipsum facilis eius expedita ab in molestiae
              facere eum officiis iure neque?"
              setQuestion={setQuestionOne}
              happy={qOneHappy}
              sad={qOneSad}
            />
            <QuestionComponent
              question="2. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Impedit dicta, consequatur, sapiente voluptatibus quod voluptate
              architecto sequi non ipsum facilis eius expedita ab in molestiae
              facere eum officiis iure neque?"
              setQuestion={setQuestionTwo}
              happy={qTwoHappy}
              sad={qTwoSad}
            />
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
