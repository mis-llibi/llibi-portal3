import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import ComplaintHooks from '@/hooks/self-service/complaint'
import moment from 'moment'

import { FaRegEye } from 'react-icons/fa'

import ErrorPage from 'next/error'

export default function ComplaintHomePage() {
  const { complaints } = ComplaintHooks()
  // console.log(complaints)

  const [showDeps, setShowDeps] = useState(null)

  const handleViewDependet = uuid => {
    setShowDeps(uuid)
  }

  return <ErrorPage statusCode={404} />

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <table className="w-full rounded-md">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="p-3">CASE ID</th>
              <th className="p-3">NAME</th>
              <th className="p-3">BIRTHDAY</th>
              <th className="p-3">ER CARD NO.</th>
              <th className="p-3">COMPANY</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {complaints?.map(item => (
              <>
                <tr>
                  <td colSpan={5} className="p-2 font-bold bg-">
                    <div className="flex gap-3">
                      <span class="bg-red-100 text-red-800 text-xs font-bold me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                        PERSONAL INFORMATION
                      </span>
                      {item.deps_dob && (
                        <span
                          className="group bg-blue-50 px-3 flex items-center rounded-sm cursor-pointer hover:bg-blue-400"
                          title="View Dependent"
                          onClick={() => handleViewDependet(item.uuid)}>
                          <FaRegEye className="text-blue-700 group-hover:text-white" />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
                <tr key={item.id} className="even:bg-gray-50">
                  <td className="p-2 text-center">
                    <span className="text-blue-700 underline">
                      <Link href={`complaint/${item.uuid}`}>{item.uuid}</Link>
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    {item.last_name}, {item.first_name} {item.middle_name}
                  </td>
                  <td className="p-2 text-center">
                    {moment(item.dob).format('MMM D, Y')}
                  </td>
                  <td className="p-2 text-center">{item.ercard_no}</td>
                  <td className="p-2 text-center">{item.company_name}</td>
                </tr>
                {item.deps_dob && showDeps === item.uuid && (
                  <>
                    <tr className="bg-green-50">
                      <td colSpan={5} className="p-2 font-bold">
                        <span class="bg-green-100 text-green-800 text-xs font-bold me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                          DEPENDENT INFORMATION
                        </span>
                      </td>
                    </tr>
                    <tr key={item.id} className="bg-green-50">
                      <td className="p-2 text-center">{item.uuid}</td>
                      <td className="p-2 text-center">
                        {item.deps_last_name}, {item.deps_first_name}{' '}
                        {item.deps_middle_name}
                      </td>
                      <td className="p-2 text-center">
                        {item.deps_dob
                          ? moment(item.deps_dob).format('MMM D, Y')
                          : null}
                      </td>
                      <td className="p-2 text-center">{item.deps_ercard_no}</td>
                      <td className="p-2 text-center"> </td>
                    </tr>
                  </>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
