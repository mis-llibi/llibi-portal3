import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

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
    <div className="bg-white p-3 rounded-md flex-grow basis-[200px]">
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
    <div className="bg-white p-3 rounded-md flex-grow basis-[200px]">
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
  const router = useRouter()
  const [page, setPage] = useState(1)
  const { data: feedbacks, isLoading, isValidating, mutate, error } = useSWR(
    `${process.env.apiPath}/corporate/feedbacks?page=${page}`,
    async () => {
      const response = await axios.get(
        `${process.env.apiPath}/corporate/feedbacks?page=${page}`,
      )
      return response.data
    },
    { revalidateOnFocus: false },
  )

  // console.log(feedbacks)

  if (isLoading) return <h1>Loading...</h1>

  return (
    <>
      <Head>
        <title>Corporate Reports</title>
      </Head>
      <div className="bg-[#f1faee] font-[poppins]">
        <nav className="bg-blue-300 h-16">
          <div className="flex gap-3 px-5">
            <img src="/logo.png" alt="LLIBI LOGO" width={200} />
          </div>
        </nav>
        <div className="px-20 text-gray-800">
          <div className="mb-3 mt-3">
            <h1 className="uppercase text-3xl font-bold">
              Client Care Hotline
            </h1>
            <div className="flex justify-between mt-3">
              <h1 className="uppercase font-bold mb-2">Questions:</h1>
              <div className="flex gap-1">
                <button
                  className="bg-blue-600 text-white p-3 rounded-md"
                  title="Switch to client portal"
                  onClick={() =>
                    router.push('/feedback/client-portal/reports')
                  }>
                  <div className="flex gap-3 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 512 512"
                      fill="#fff">
                      <path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z" />
                    </svg>

                    <span className="capitalize text-xs">
                      Switch to client care portal
                    </span>
                  </div>
                </button>
                <button
                  className="bg-blue-900 text-white p-3 rounded-md"
                  title="Switch to ateneo"
                  onClick={() => router.push('/feedback/admu/reports')}>
                  <div className="flex gap-3 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 512 512"
                      fill="#fff">
                      <path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z" />
                    </svg>

                    <span className="capitalize text-xs">Switch to Ateneo</span>
                  </div>
                </button>
              </div>
            </div>

            <p>Q1. How easy was it to contact our Client Care Hotline?</p>
            <p>Q2. Did we respond within a reasonable timeframe?</p>
            <p>
              Q3. Did you find our Client Care Executive helpful and respectful?
            </p>
            <p>
              Q4. How easy was it to use our Lacson LOA at the accredited
              provider?
            </p>
            <p>Q5. Overall, how satisfied are you with Lacson & Lacson?</p>
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
              <StatsSummaryPanelsYesNo
                questionTitle={'Question 2.'}
                yes={feedbacks?.q2[0]?.yes}
                no={feedbacks?.q2[0]?.no}
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
              <StatsSummaryPanels
                questionTitle={'Question 5.'}
                very_easy={feedbacks?.q5[0]?.very_easy}
                easy={feedbacks?.q5[0]?.easy}
                moderate={feedbacks?.q5[0]?.moderate}
                difficult={feedbacks?.q5[0]?.difficult}
                very_difficult={feedbacks?.q5[0]?.very_difficult}
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
                <th className="w-24 p-5">Q5</th>
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
                      <td className="p-5 text-center">{feedback.question5}</td>
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
