import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import Button from '@/components/Button'
import Label from '@/components/Label'

import axios from '@/lib/axios'

// import { MdOutlineThumbDown, MdOutlineThumbUp } from 'react-icons/md'
// import { FaRegSmile, FaRegSadTear } from 'react-icons/fa'

// import Slider from '@mui/material/Slider'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

import Swal from 'sweetalert2'
import QuestionComponent from '../../questions/QuestionComponent'

export default function FeedBackManual() {
  const router = useRouter()
  // const { company } = router.query
  // https://dev.to/michaelburrows/create-a-custom-react-star-rating-component-5o6
  // const [rating, setRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [comment, setComment] = useState('')
  const [questionOne, setQuestionOne] = useState(4)
  const [questionTwo, setQuestionTwo] = useState(4)
  const [questionThree, setQuestionThree] = useState(1)
  const [questionFour, setQuestionFour] = useState(4)

  const csrf = () => axios.get('/sanctum/csrf-cookie')

  const handleSubmit = async () => {
    setLoading(true)

    await csrf()

    try {
      const response = await axios.post(
        `/api/feedbacks`,
        {
          comment: comment,
          questionOne: questionOne,
          questionTwo: questionTwo,
          questionThree: questionThree,
          questionFour: questionFour,

          request_id: 0,
          company_code: 'admu',
          member_id: 'MANUAL',
          request_status: 3,
        },
        {
          headers: {
            'X-LLIBIXADMU-KEY': process.env.LLIBIXADMU_KEY,
          },
        },
      )
      Swal.fire('Success', response.data.message, 'success')
      setLoading(false)
      window.close()
    } catch (error) {
      setLoading(false)
      Swal.fire(error.response.data.message, '', 'info')
      throw error
    }
  }

  const questions = [
    {
      question: '1.	How easy was it to use our Client Care Portal?',
      questionValue: questionOne,
      setQuestion: setQuestionOne,
    },
    {
      question:
        '2. How easy was it to use our Lacson LOA at the accredited provider?',
      questionValue: questionTwo,
      setQuestion: setQuestionTwo,
    },
  ]

  // if (!company) return <h1>Loading...</h1>

  return (
    <>
      <Head>
        <title>Feedback</title>
      </Head>
      <div className="py-12 font-[poppins]">
        <div className="md:w-[60em] mx-auto w-full px-10 md:px-0">
          <div>
            <div className="flex justify-end items-center">
              <a
                href={
                  process.env.NODE_ENV === 'production'
                    ? 'https://portal.llibi.app/'
                    : '/'
                }>
                <img src="/logo.png" alt="llibi logo" width={252} />
              </a>
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
            {questions.map((question, i) => {
              return (
                <QuestionComponent
                  key={i}
                  question={question.question}
                  questionValue={question.questionValue}
                  setQuestion={question.setQuestion}
                />
              )
            })}

            <div className="w-full flex flex-col md:flex-row gap-5 mb-5">
              <div className=" flex-1 py-3">
                <p className="text-sm">
                  3. Did we respond within the turn-around time?{' '}
                  <small className="text-green-700">(please choose one)</small>
                </p>
              </div>
              <div className="flex-1 p-3 flex items-center">
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={questionThree}
                    onChange={e => setQuestionThree(e.target.value)}>
                    <FormControlLabel
                      value={1}
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={0}
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>

            <QuestionComponent
              key={'4'}
              question={
                '4. Overall, how satisfied are you with Client Care Portal?'
              }
              questionValue={questionFour}
              setQuestion={setQuestionFour}
            />
          </div>
          <div className="mb-5">
            <p className="text-sm">
              5. WHat else can we do to improve our service?
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
            <Button loading={loading} onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
