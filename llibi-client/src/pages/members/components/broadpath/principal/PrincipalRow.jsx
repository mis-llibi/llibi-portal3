import React from 'react'

import { MdOutlineTouchApp } from 'react-icons/md'

export default function PrincipalRow({ row, handleSetSelected }) {
  return (
    <tr className="even:bg-blue-50">
      <td className="p-3">{row.member_id}</td>
      <td className="p-3">{`${row.last_name}, ${row.first_name} ${row.middle_name}`}</td>
      <td className="p-3">{row.relation}</td>
      <td className="p-3">{row.birth_date}</td>
      <td className="p-3">{row.gender}</td>
      <td className="p-3">{row.civil_status}</td>
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
