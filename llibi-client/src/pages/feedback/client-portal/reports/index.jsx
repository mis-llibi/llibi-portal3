import React, { useState } from 'react'

import axios from '@/lib/axios'
import useSWR from 'swr'

import moment from 'moment'

export const StatsSummaryPanels = ({
  questionTitle,
  very_easy,
  easy,
  moderate,
  difficult,
  very_difficult,
}) => {
  return (
    <div className="bg-white p-3 rounded-md flex-grow basis-[250px]">
      <div>
        <small className="font-bold">{questionTitle}</small>
      </div>
      <div>
        <div className="flex justify-between">
          <div>
            <small>Very Easy:</small>
          </div>
          <div>
            <small
              className={`font-bold ${
                very_easy < 50 ? 'text-red-700' : 'text-green-700'
              }`}>
              {very_easy}%
            </small>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <small>Easy:</small>
          </div>
          <div>
            <small
              className={`font-bold ${
                easy < 50 ? 'text-red-700' : 'text-green-700'
              }`}>
              {easy}%
            </small>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <small>Moderate:</small>
          </div>
          <div>
            <small
              className={`font-bold ${
                moderate < 50 ? 'text-red-700' : 'text-green-700'
              }`}>
              {moderate}%
            </small>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <small>Difficult:</small>
          </div>
          <div>
            <small
              className={`font-bold ${
                difficult < 50 ? 'text-red-700' : 'text-green-700'
              }`}>
              {difficult}%
            </small>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <small>Very Difficult:</small>
          </div>
          <div>
            <small
              className={`font-bold ${very_difficult < 50 && 'text-red-700'}`}>
              {very_difficult}%
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}

export const StatsSummaryPanelsYesNo = ({ questionTitle, yes, no }) => {
  return (
    <div className="bg-white p-3 rounded-md flex-grow basis-[250px]">
      <div>
        <small className="font-bold">{questionTitle}</small>
      </div>
      <div>
        <div className="flex justify-between">
          <div>
            <small>Yes:</small>
          </div>
          <div>
            <small
              className={`font-bold ${
                yes < 50 ? 'text-red-700' : 'text-green-700'
              }`}>
              {yes}%
            </small>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <small>No:</small>
          </div>
          <div>
            <small
              className={`font-bold ${
                no < 50 ? 'text-red-700' : 'text-green-700'
              }`}>
              {no}%
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReportHomePage() {
  const [page, setPage] = useState(1)
  const { data: feedbacks, isLoading, isValidating, mutate, error } = useSWR(
    `${process.env.apiPath}/feedbacks?page=${page}`,
    async () => {
      const response = await axios.get(
        `${process.env.apiPath}/feedbacks?page=${page}`,
      )
      return response.data
    },
    { revalidateOnFocus: false },
  )

  // console.log(feedbacks)

  if (isLoading) return <h1>Loading...</h1>

  return (
    <>
      <div className="bg-[#f1faee]">
        <nav className="bg-blue-300 h-16">
          <div className="flex gap-3 px-5">
            <img src="/logo.png" alt="LLIBI LOGO" width={200} />
          </div>
        </nav>
        <div className="px-20 text-gray-800">
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

          <div className="mb-3">
            <h1 className="uppercase font-bold mb-2">Statistics:</h1>
            <div className="flex gap-3 flex-wrap">
              <StatsSummaryPanels
                questionTitle={'Question 1.'}
                very_easy={feedbacks?.q1[0]?.very_easy}
                easy={feedbacks?.q1[0]?.easy}
                moderate={feedbacks?.q1[0]?.moderate}
                difficult={feedbacks?.q1[0]?.difficult}
                very_difficult={feedbacks?.q1[0]?.very_difficult}
              />
              <StatsSummaryPanels
                questionTitle={'Question 2.'}
                very_easy={feedbacks?.q2[0]?.very_easy}
                easy={feedbacks?.q2[0]?.easy}
                moderate={feedbacks?.q2[0]?.moderate}
                difficult={feedbacks?.q2[0]?.difficult}
                very_difficult={feedbacks?.q2[0]?.very_difficult}
              />
              <StatsSummaryPanelsYesNo
                questionTitle={'Question 3.'}
                yes={feedbacks?.q3[0]?.yes}
                no={feedbacks?.q3[0]?.no}
              />
              <StatsSummaryPanels
                questionTitle={'Question 4.'}
                very_easy={feedbacks?.q4[0]?.very_easy}
                easy={feedbacks?.q4[0]?.easy}
                moderate={feedbacks?.q4[0]?.moderate}
                difficult={feedbacks?.q4[0]?.difficult}
                very_difficult={feedbacks?.q4[0]?.very_difficult}
              />
            </div>
          </div>

          <table className="w-full text-sm border bg-white mb-3">
            <thead>
              <tr className="bg-blue-100">
                <th className="w-48 p-5"></th>
                <th className="w-24 p-5">Loa Type</th>
                <th className="w-72 p-5">Comments</th>
                <th className="w-24 p-5">Q1</th>
                <th className="w-24 p-5">Q2</th>
                <th className="w-24 p-5">Q3</th>
                <th className="w-24 p-5">Q4</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks &&
                feedbacks?.result?.data.map(feedback => {
                  return (
                    <tr key={feedback.id} className="border even:bg-gray-100">
                      <td className="p-5 font-bold">
                        <small className="text-gray-500">
                          {moment(feedback.created_at).format('MMM D, Y')}
                        </small>
                        <br />
                        <span>{feedback.company_name}</span>
                      </td>
                      <td className="p-5 text-center">
                        {feedback.loa_type.toUpperCase()}
                      </td>
                      <td className="p-5">{feedback.comments}</td>
                      <td className="p-5 text-center">{feedback.question1}</td>
                      <td className="p-5 text-center">{feedback.question2}</td>
                      <td className="p-5 text-center">{feedback.question3}</td>
                      <td className="p-5 text-center">{feedback.question4}</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
          <div className="flex justify-end">
            <div>
              <button
                className={`w-28 border bg-blue-900 p-2 uppercase text-sm rounded-md text-white mb-3 ${
                  feedbacks?.result?.current_page === 1 && 'bg-gray-600'
                }`}
                onClick={() => setPage(page - 1)}
                disabled={feedbacks?.result?.current_page === 1}>
                Previous
              </button>
              <button
                className={`w-28 border bg-blue-900 p-2 uppercase text-sm rounded-md text-white mb-3 ${
                  feedbacks?.result?.current_page ===
                    feedbacks?.result?.last_page && 'bg-gray-600'
                }`}
                onClick={() => setPage(page + 1)}
                disabled={
                  feedbacks?.result?.current_page ===
                  feedbacks?.result?.last_page
                }>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
