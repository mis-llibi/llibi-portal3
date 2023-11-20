import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Button from '@/components/Button'
import BackdropComponent from '@/components/BackdropComponent'
import QuestionComponent from '../questions/QuestionComponent'

import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import axios from '@/lib/axios'

import Swal from 'sweetalert2'

export default function ManualPage() {
  const router = useRouter()
  const { q, member_id, company_code, approval_code } = router.query
  const [loading, setLoading] = useState(false)
  const [questionOne, setQuestionOne] = useState(4)
  const [questionTwo, setQuestionTwo] = useState(1)
  const [questionThree, setQuestionThree] = useState(1)
  const [questionFour, setQuestionFour] = useState(4)
  const [questionFive, setQuestionFive] = useState(4)
  const [comment, setComment] = useState('')

  const csrf = () => axios.get('/sanctum/csrf-cookie') 

  const handleSubmit = async () => {
    setLoading(true)

    const payload = {
      questionOne: Number(questionOne),
      questionTwo: Number(questionTwo),
      questionThree: Number(questionThree),
      questionFour: Number(questionFour),
      questionFive: Number(questionFive),
      comments: comment,
      member_id: member_id,
      company_code: company_code,
      approval_code: approval_code,
    }

    await csrf();

    try {
      const response = await axios.post(
        `${process.env.apiPath}/corporate/feedbacks/save`,
        payload,
      )

      Swal.fire('Success', response.data.message, 'success')
      window.close()
    } catch (error) {
      Swal.fire(error.response.data.message, '', 'info')
      throw new Error(error)
    } finally {
      setLoading(false)
    }
  }

  // useEffect(() => {

  // }, [])

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
            <QuestionComponent
              question={
                '1.	How easy was it to contact our Client Care Hotline? '
              }
              questionValue={questionOne}
              setQuestion={setQuestionOne}
            />
          </div>

          <div className="w-full flex flex-col md:flex-row gap-5 mb-5">
            <div className=" flex-1 py-3">
              <p className="text-sm">
                2. Did we respond within a reasonable timeframe?{' '}
                <small className="text-green-700">(please choose one)</small>
              </p>
            </div>
            <div className="flex-1 p-3 flex items-center">
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={questionTwo}
                  onChange={e => setQuestionTwo(e.target.value)}>
                  <FormControlLabel value={1} control={<Radio />} label="Yes" />
                  <FormControlLabel value={0} control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-5 mb-5">
            <div className=" flex-1 py-3">
              <p className="text-sm">
                3. Did you find our Client Care Executive helpful and
                respectful?{' '}
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
                  <FormControlLabel value={1} control={<Radio />} label="Yes" />
                  <FormControlLabel value={0} control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          <div className="mb-5">
            <QuestionComponent
              question={
                '4.	How easy was it to use our Lacson LOA at the accredited provider? '
              }
              questionValue={questionFour}
              setQuestion={setQuestionFour}
            />
          </div>
          <div className="mb-5">
            <QuestionComponent
              question={
                '5.	Overall, how satisfied are you with Lacson & Lacson?  '
              }
              questionValue={questionFive}
              setQuestion={setQuestionFive}
            />
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
            <Button loading={loading} onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </div>
      </div>

      <BackdropComponent open={loading} />
    </>
  )
}
