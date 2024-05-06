import moment from 'moment'
import React from 'react'
import ActionButton from '../ActionButton'

export default function ErrorLogsRow({ row, mutate }) {
  return (
    <tr
      key={row.id}
      className={`${
        row.notify_status === 1 ? 'bg-yellow-300' : 'even:bg-gray-100'
      } `}>
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
      <td className="text-center px-3 py-2 whitespace-nowrap">{row.dob}</td>
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
              {row.fullname}
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
      <td>
        <ActionButton key={row.id} row={row} mutate={mutate} />
      </td>
    </tr>
  )
}
