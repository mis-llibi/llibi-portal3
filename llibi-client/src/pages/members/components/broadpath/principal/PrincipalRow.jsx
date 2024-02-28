import moment from 'moment'
import React from 'react'

import { MdOutlineTouchApp } from 'react-icons/md'

export default function PrincipalRow({ row, handleSetSelected }) {
  return (
    <tr className="even:bg-blue-50">
      <td className="p-3 w-72">
        <p className='font-bold'>{row.member_id}</p>
        <p>{`${row.last_name}, ${row.first_name} ${row.middle_name}`}</p>
      </td>
      {/* <td className="p-3"></td> */}
      <td className="p-3 text-center">{row.relationship_id}</td>
      <td className="p-3 text-center">
        {moment(row.birth_date).format('Y-MM-DD')}
      </td>
      <td className="p-3 text-center">{row.gender}</td>
      <td className="p-3 text-center">{row.civil_status}</td>
      <td className="p-3">
        <button
          className="group border px-3 py-2 shadow rounded-md hover:bg-gray-800"
          title="Select Principal"
          onClick={() => handleSetSelected(row)}>
          <MdOutlineTouchApp className="group-hover:text-white text-lg" />
        </button>
      </td>
    </tr>
  )
}
