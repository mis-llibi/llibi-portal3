import React from 'react'

import ComplaintHooks from '@/hooks/self-service/complaint'
import moment from 'moment'

export default function ComplaintHomePage() {
  const { complaints } = ComplaintHooks()
  // console.log(complaints)

  return (
    <div>
      <div className="flex justify-center">
        <table className="w-4/5 border rounded-md">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className='p-3'>CASE ID</th>
              <th className='p-3'>NAME</th>
              <th className='p-3'>BIRTHDAY</th>
              <th className='p-3'>ER CARD NO.</th>
              <th className='p-3'>COMPANY</th>
            </tr>
          </thead>
          <tbody>
            {complaints?.map(item => (
              <tr key={item.id} className="even:bg-gray-50">
                <td className="p-2 text-center">{item.uuid}</td>
                <td className="p-2 text-center">
                  {item.last_name}, {item.first_name} {item.middle_name}
                </td>
                <td className="p-2 text-center">{moment(item.dob).format('MMM D, Y')}</td>
                <td className="p-2 text-center">{item.ercard_no}</td>
                <td className="p-2 text-center">{item.company_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
