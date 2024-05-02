import axios from '@/lib/axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

export default function ClientPortalErrorLogsHomePage() {
  const [data, setData] = useState([])

  const getErrorLogs = async () => {
    try {
      const response = await axios.get('/api/error-logs')
      // console.log(response.data)
      setData(response.data)
    } catch (error) {
      alert('Something went wrong.')
    }
  }

  useEffect(() => {
    getErrorLogs()
  }, [])

  return (
    <>
      <div className="w-11/12 mx-auto">
        <h1 className="font-bold text-xl text-fav-black uppercase h-14 flex items-center">
          CLIENT PORTAL ERROR LOGS
        </h1>
      </div>

      <div className="flex h-[90vh] flex-col items-center justify-center">
        <div className="font-[poppins] w-11/12 overflow-scroll h-[80vh] mx-auto">
          <table className="text-xs">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="px-3 py-2 w-60 whitespace-nowrap">
                  MEMBER DETAILS
                </th>
                <th className="px-3 py-2 w-60 whitespace-nowrap">BIRTHDATE</th>
                <th className="px-3 py-2 w-60 whitespace-nowrap">
                  IS DEPENDENT
                </th>
                <th className="px-3 py-2 w-60 whitespace-nowrap">
                  DEPENDENT DETAILS
                </th>
                <th className="px-3 py-2 w-60 whitespace-nowrap">
                  DEPENDENT BIRTHDATE
                </th>
                <th className="px-3 py-2 w-60 whitespace-nowrap">REPORT</th>
                <th className="px-3 py-2 w-60 whitespace-nowrap">
                  CALL ALLOWED
                </th>
                <th className="px-3 py-2 w-60 whitespace-nowrap">CREATED AT</th>
              </tr>
            </thead>
            <tbody>
              {data?.map(row => (
                <tr className="even:bg-gray-100">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <p>
                      <span className="font-bold">Member Id: </span>
                      {row.member_id}
                    </p>
                    <p>
                      <span className="font-bold">Firstname: </span>
                      {row.first_name}
                    </p>
                    <p>
                      <span className="font-bold">Lastname: </span>
                      {row.last_name}
                    </p>
                  </td>
                  <td className="text-center px-3 py-2 whitespace-nowrap">
                    {row.dob}
                  </td>
                  <td className="text-center px-3 py-2 whitespace-nowrap">
                    {row.is_dependent === 1 ? 'YES' : 'NO'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <p>
                      <span className="font-bold">Member Id: </span>
                      {row.dependent_member_id}
                    </p>
                    <p>
                      <span className="font-bold">Firstname: </span>
                      {row.dependent_first_name}
                    </p>
                    <p>
                      <span className="font-bold">Lastname: </span>
                      {row.dependent_last_name}
                    </p>
                  </td>
                  <td className="text-center px-3 py-2 whitespace-nowrap">
                    {row.dependent_dob}
                  </td>
                  <td className="text-left px-3 py-2 whitespace-nowrap">
                    {(row.company || row.email) && (
                      <>
                        <p>
                          <span className="font-bold">Company: </span>
                          {row.company}
                        </p>
                        <p>
                          <span className="font-bold">Email: </span> {row.email}
                        </p>
                        <p>
                          <span className="font-bold">Mobile: </span>
                          {row.mobile}
                        </p>
                        <p>
                          <span className="font-bold">Principal: </span>
                          {row.deps_fullname}
                        </p>
                        <p>
                          <span className="font-bold">Dependent: </span>
                          {row.deps_fullname}
                        </p>
                      </>
                    )}
                  </td>
                  <td className="text-center px-3 py-2 whitespace-nowrap">
                    {Number(row.is_allow_to_call) === 1 ? 'YES' : 'NO'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {moment(row.created_at).format('MM DD, Y HH:mm A')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
