import React, { useEffect, useRef, useState } from 'react'
import Button from '@/components/Button'
import { BiSave } from 'react-icons/bi'
import axios from '@/lib/axios'

import { insertNewEnrollee } from '@/hooks/members/ManageHrMember'

export default function ForInactiveDependents({
  show,
  setShow,
  data,
  reset,
  isMileStone,
  relation,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lists, setLists] = useState(null)

  const proceedSubmit = async () => {
    setIsSubmitting(true)
    try {
      const FORMDATA = new FormData()

      for (let key in data) {
        if (key === 'attachment') {
          for (let index = 0; index < data[key].length; index++) {
            FORMDATA.append('attachment[]', data[key][index])
          }
        } else {
          if (
            ![
              'principalMemberId',
              'principalName',
              'principalCivilStatus',
            ].includes(key)
          ) {
            FORMDATA.append(key, data[key])
          }
        }
      }

      FORMDATA.append(
        `principalInfo`,
        JSON.stringify({
          principalMemberId: data.principalMemberId,
          principalName: data.principalName,
          principalCivilStatus: data.principalCivilStatus,
          principalBirthDate: data.principalBirthDate,
        }),
      )

      FORMDATA.append('isMileStone', isMileStone >= 30 ? true : false)

      await insertNewEnrollee({
        data: FORMDATA,
        reset,
        isMileStone: isMileStone,
        relation: data?.relation,
      })

      setShow(false)
      setIsSubmitting(false)
    } catch (error) {
      setIsSubmitting(false)
      throw error
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/members-enrollment/dependents-for-inactive?member_id=${data.member_id}&principal_civil_status=${data.principalCivilStatus}&principal_birthdate=${data.principalBirthDate}&birthdate=${data.birthdate}&relation=${data.relation}`,
          {
            signal: signal,
          },
        )
        setLists(response.data)
      } catch (error) {
        throw new Error('Something went wrong.')
      }
    }

    fetchData()

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <>
      <div className="max-h-[70vh] overflow-y-auto font-[poppins] mb-3 border-b">
        <h6 className="text-gray-600 text-sm mb-3">
          All of this dependents will be affected when you proceed.
        </h6>
        <table className="w-full mb-3">
          <thead className="text-xs bg-blue-700 text-white">
            <tr className="uppercase">
              <th className="p-3">Member Number</th>
              <th className="p-3">Name</th>
              <th className="p-3">Relation</th>
              <th className="p-3">Civil Status</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {lists?.length <= 0 && (
              <tr>
                <td className='text-center py-3' colSpan={5}>No Records</td>
              </tr>
            )}

            {lists?.map((row, i) => {
              return (
                <tr key={row.id}>
                  <td>{row.member_id}</td>
                  <td>{row.full_name}</td>
                  <td className="text-center">{row.relationship_id}</td>
                  <td className="text-center">{row.civil_status}</td>
                  <td className="text-center">
                    {row.relationship_id === 'PRINCIPAL' ? (
                      <>
                        Change to <span className="font-bold">MARRIED</span>
                      </>
                    ) : (
                      <>
                        Change to <span className="font-bold">INACTIVE</span>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Button
        onClick={proceedSubmit}
        disabled={isSubmitting}
        className="bg-blue-400 hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 ring-blue-200 my-2 flex gap-1"
        loading={isSubmitting}>
        <BiSave size={16} />
        <span>Proceed</span>
      </Button>
    </>
  )
}
