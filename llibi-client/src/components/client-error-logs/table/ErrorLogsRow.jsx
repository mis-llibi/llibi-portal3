import moment from 'moment'
import React, { useMemo } from 'react'
import ActionButton from '../ActionButton'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/router'

export default function ErrorLogsRow({ row, mutate }) {
  const { user } = useAuth({
    middleware: 'auth',
  })

  const router = useRouter()
  const isMonitoring = useMemo(
    () => router.pathname.split('/').includes('monitoring'),
    [router.pathname],
  )

  return (
    <tr
      key={row.id}
      className={`${
        row.notify_status === 1 && row.is_allow_to_call === 1 && 'bg-green-300'
      } ${
        row.notify_status === 2 && row.is_allow_to_call === 1 && 'bg-orange-300'
      } ${
        row.notify_status === 3 && row.is_allow_to_call === 1 && 'bg-red-300'
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
        {!isMonitoring && (
          <>
            {Number(row.is_allow_to_call) === 1 &&
              Number(row.notify_status) !== 2 &&
              !['mailynramos@llibi.com'].includes(user?.email) && (
                <ActionButton key={row.id} row={row} mutate={mutate} />
              )}

            {Number(row.is_allow_to_call) === 1 &&
              Number(row.notify_status) === 2 &&
              ['mailynramos@llibi.com'].includes(user?.email) && (
                <ActionButton key={row.id} row={row} mutate={mutate} />
              )}
          </>
        )}
      </td>
    </tr>
  )
}
