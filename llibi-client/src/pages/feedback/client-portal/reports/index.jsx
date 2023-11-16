import React from 'react'

import axios from '@/lib/axios'
import useSWR from 'swr'

export default function ReportHomePage() {
  const { data: feedbacks, isLoading, isValidating, mutate, error } = useSWR(
    `${process.env.apiPath}/feedbacks`,
    async () => {
      const response = await axios.get(`${process.env.apiPath}/feedbacks`)
      return response.data
    },
    { revalidateOnFocus: false },
  )

  console.log(feedbacks)

  if (isLoading) return <h1>Loading...</h1>

  return (
    <>
      <nav className="bg-blue-300 h-16">
        <div className='flex gap-3 px-5'>
          <img src="/logo.png" alt="LLIBI LOGO" width={200} />
        </div>
      </nav>
      <div className="max-w-[65rem] mx-auto text-gray-800">
        <div className="mb-3 mt-3">
          <h1 className="uppercase font-bold mb-2">Questions:</h1>

          <p>Q1. How easy was it to use our Client Care Portal?</p>
          <p>
            Q2. How easy was it to use our Lacson LOA at the accredited
            provider?
          </p>
          <p>Q3. Did we respond within the turn-around time?</p>
          <p>Q4. Overall, how satisfied are you with Client Care Portal?</p>
        </div>
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-blue-100">
              <th className="w-48 p-5"></th>
              <th className="w-72 p-5">Comments</th>
              <th className="w-24 p-5">Q1</th>
              <th className="w-24 p-5">Q2</th>
              <th className="w-24 p-5">Q3</th>
              <th className="w-24 p-5">Q4</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks &&
              feedbacks.map(feedback => {
                return (
                  <>
                    <tr key={feedback.id} className="border even:bg-gray-50">
                      <td className="p-5 font-bold">
                        <small>{feedback.company_code}</small>
                        <br />
                        {feedback.member_id}
                      </td>
                      <td className="p-5">{feedback.comments}</td>
                      <td className="p-5 text-center">{feedback.question1}</td>
                      <td className="p-5 text-center">{feedback.question2}</td>
                      <td className="p-5 text-center">{feedback.question3}</td>
                      <td className="p-5 text-center">{feedback.question4}</td>
                    </tr>
                    <></>
                  </>
                )
              })}
          </tbody>
        </table>
      </div>
    </>
  )
}
