import moment from 'moment'
import React from 'react'

import { BiPointer } from 'react-icons/bi'

export default function PrincipalRow({ row, handleSetSelected }) {
  return (
    <tr
      className="even:bg-blue-50/50 cursor-pointer hover:bg-blue-100/50"
      onClick={() => handleSetSelected(row)}>
      <td className="p-3 w-72">
        <p className="font-thin text-[10px]">
          <span className="text-green-600">{row?.member_id}</span>
          {/* <span className="bg-orange-600 text-white rounded-md px-2">
            {row.relationship_id}
          </span> */}
        </p>
        {/* <p className="font-bold text-[10px]"></p> */}
        {/* <p className="font-bold text-[10px]">{row.civil_status}</p> */}
        <p>{`${row?.last_name}, ${row?.first_name} ${row?.middle_name}`}</p>
      </td>
      {/* <td className="p-3"></td> */}
      {/* <td className="p-3 text-center">{row.relationship_id}</td> */}
      <td className="p-3 text-center">{row?.contact?.email}</td>
      <td className="p-3 text-center">
        {moment(row?.birth_date).format('MMM DD, Y')}
      </td>
      <td className="p-3 text-center">{row?.gender}</td>
      <td className="p-3 text-center">{row?.civil_status}</td>
      <td className="p-3 text-center">
        {moment(row?.date_hired).format('MMM DD, Y')}
      </td>
      <td className="p-3 text-center">
        {moment(row?.reg_date).format('MMM DD, Y')}
      </td>
      {/* <td className="p-3 text-center">
        <button
          className="group border px-3 py-2 rounded-md hover:bg-gray-100"
          title="Select Principal"
          onClick={() => handleSetSelected(row)}>
          <BiPointer size={16} />
        </button>
      </td> */}
    </tr>
  )
}
