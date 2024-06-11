import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import axios from '@/lib/axios'
import useSWR from 'swr'

import moment from 'moment'

import Navigation from '@/components/Layouts/Feedback/Navigation'
import { DownloadIcon, ReloadIcon } from '@radix-ui/react-icons'

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
        <Navigation />
        <div className="px-10 md:px-20 text-gray-800">
          <div className="mb-3 mt-3">
            <h1 className="uppercase text-3xl font-bold">
              Client Care Hotline
            </h1>
            <div className="flex justify-between mt-3 flex-col md:flex-row">
              <h1 className="uppercase font-bold mb-2">Questions:</h1>
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

          <div className="flex justify-end mb-3">
            <div className="flex flex-col md:flex-row gap-1">
              <span>
                <button
                  className="bg-blue-700 text-white text-xs px-3 py-2 rounded-md"
                  title="Switch to client portal"
                  onClick={() =>
                    router.push('/feedback/client-portal/reports')
                  }>
                  <div className="flex gap-3 items-center">
                    <ReloadIcon />
                    <span className="capitalize text-xs">
                      Switch to client care portal
                    </span>
                  </div>
                </button>
              </span>

              <span>
                <button
                  className="bg-blue-900 text-white text-xs px-3 py-2 rounded-md"
                  title="Switch to ateneo"
                  onClick={() => router.push('/feedback/admu/reports')}>
                  <div className="flex gap-3 items-center">
                    <ReloadIcon />
                    <span className="capitalize text-xs">Switch to ateneo</span>
                  </div>
                </button>
              </span>

              <a
                href={`${process.env.backEndUrl}/api/corporate/feedbacks-export`}
                target="_blank">
                <button className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-2 rounded-md capitalize">
                  <div className="flex gap-3 items-center">
                    <DownloadIcon />
                    <span className="capitalize text-xs">Export to excel</span>
                  </div>
                </button>
              </a>
            </div>
          </div>

          <div className="overflow-x-scroll custom-scrollbar">
            <table className="w-full text-sm border bg-white mb-3">
              <thead>
                <tr className="bg-blue-600 text-white uppercase text-xs">
                  <th className="w-48 p-2"></th>
                  <th className="w-24 p-2">Loa Type</th>
                  <th className="w-72 p-2">Comments</th>
                  <th className="w-24 p-2">Q1</th>
                  <th className="w-24 p-2">Q2</th>
                  <th className="w-24 p-2">Q3</th>
                  <th className="w-24 p-2">Q4</th>
                  <th className="w-24 p-2">Q5</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks &&
                  feedbacks?.result?.data.map(feedback => {
                    return (
                      <tr key={feedback.id} className="border even:bg-gray-100">
                        <td className="p-2 font-bold text-xs whitespace-nowrap lg:whitespace-normal">
                          <small className="text-gray-500">
                            {moment(feedback.created_at).format('MMM D, Y')}
                          </small>
                          <br />
                          <span>{feedback.company_name}</span>
                        </td>
                        <td className="p-2 text-center text-xs">
                          {feedback.loa_type.toUpperCase()}
                        </td>
                        <td className="p-2 text-xs">{feedback.comments}</td>
                        <td className="p-2 text-center text-xs whitespace-nowrap lg:whitespace-normal">
                          {feedback.question1}
                        </td>
                        <td className="p-2 text-center text-xs whitespace-nowrap lg:whitespace-normal">
                          {feedback.question2}
                        </td>
                        <td className="p-2 text-center text-xs whitespace-nowrap lg:whitespace-normal">
                          {feedback.question3}
                        </td>
                        <td className="p-2 text-center text-xs whitespace-nowrap lg:whitespace-normal">
                          {feedback.question4}
                        </td>
                        <td className="p-2 text-center text-xs whitespace-nowrap lg:whitespace-normal">
                          {feedback.question5}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <div>
              <button
                className={`w-28 border bg-blue-900 p-2 uppercase text-xs rounded-md text-white mb-3 ${
                  feedbacks?.result?.current_page === 1 && 'bg-gray-600'
                }`}
                onClick={() => setPage(page - 1)}
                disabled={feedbacks?.result?.current_page === 1}>
                Previous
              </button>
              <button
                className={`w-28 border bg-blue-900 p-2 uppercase text-xs rounded-md text-white mb-3 ${
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
