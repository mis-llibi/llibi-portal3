import axios from '@/lib/axios'
import React, { useEffect, useState } from 'react'

export default function Logs() {
  const [dataLogs, setDataLogs] = useState()
  const handleGetLogs = async () => {
    try {
      const response = await axios.get('/api/view-logs')
      setDataLogs(response.data)
    } catch (error) {
      alert('Something wrong.')
      throw error
    }
  }

  useEffect(() => {
    handleGetLogs()
  }, [])
  return (
    <>
      <table className="w-full border text-sm">
        <thead>
          <tr className="border">
            <th className="p-3">Member Id</th>
            <th className="p-3">Patient Name</th>
            <th className="p-3">View By</th>
            <th className="p-3">Email</th>
          </tr>
        </thead>
        <tbody>
          {dataLogs?.map((log, i) => (
            <tr key={i} className="border">
              <td className="p-3">{log.memberID}</td>
              <td className="p-3">
                {log.lastName}, {log.firstName}
              </td>
              <td className="p-3">
                {log.viewLastname}, {log.viewFirstname}
              </td>
              <td className="p-3">{log.viewEmail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
