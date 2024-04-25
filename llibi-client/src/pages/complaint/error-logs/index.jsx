import axios from '@/lib/axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

export default function ClientPortalErrorLogsHomePage() {
  //   {
  //     "id": 422,
  //     "member_id": null,
  //     "first_name": "glenmore",
  //     "last_name": "ilagan",
  //     "dob": "1999-12-08",
  //     "is_dependent": null,
  //     "dependent_member_id": null,
  //     "dependent_first_name": null,
  //     "dependent_last_name": null,
  //     "dependent_dob": null
  // }

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
    <div>
      <table className="text-xs w-full">
        <thead>
          <tr className="bg-blue-700 text-white">
            <th className="px-3 py-2">MEMBER ID</th>
            <th className="px-3 py-2">FIRSTNAME</th>
            <th className="px-3 py-2">LASTNAME</th>
            <th className="px-3 py-2">BIRTHDATE</th>
            <th className="px-3 py-2">IS DEPENDENT</th>
            <th className="px-3 py-2">DEPENDENT MEMBER ID</th>
            <th className="px-3 py-2">DEPENDENT FISRTNAME</th>
            <th className="px-3 py-2">DEPENDENT LASTNAME</th>
            <th className="px-3 py-2">DEPENDENT BIRTHDATE</th>
            <th className="px-3 py-2">CREATED AT</th>
          </tr>
        </thead>
        <tbody>
          {data?.map(row => (
            <tr className="even:bg-gray-100">
              <td>{row.member_id}</td>
              <td>{row.first_name}</td>
              <td>{row.last_name}</td>
              <td className='text-center'>{row.dob}</td>
              <td className='text-center'>{row.is_dependent === 1 ? 'YES' : ''}</td>
              <td>{row.dependent_member_id}</td>
              <td>{row.dependent_first_name}</td>
              <td>{row.dependent_last_name}</td>
              <td className='text-center'>{row.dependent_dob}</td>
              <td>{moment(row.created_at).format('MM DD, Y HH:mm')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
