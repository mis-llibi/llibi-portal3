import Label from '@/components/Label'
import axios from '@/lib/axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

export default function ViewDependentsDetails({ row }) {
  const [deps, setDeps] = useState(null)

  const getDependents = async () => {
    try {
      const response = await axios.get(
        `/api/members-enrollment/view-dependents?id=${row?.id}&member_id=${row?.member_id}`,
      )
      setDeps(response.data)
    } catch (error) {
      throw new Error('Something went wrong.')
    }
  }

  useEffect(() => {
    getDependents()
  }, [row?.id])

  return (
    <div className="w-[90vw] md:w-[60em] px-2">
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* COL1 */}
        <div>
          <div>
            <Label htmlFor="">
              Employee Number:{' '}
              <span className="font-thin">{row?.member_id}</span>
            </Label>
          </div>
          <div>
            <Label htmlFor="">
              Name: <span className="font-thin">{row?.full_name}</span>
            </Label>
          </div>
          <div>
            <Label htmlFor="">
              Email: <span className="font-thin">{row?.principalEmail}</span>
            </Label>
          </div>
          <div>
            <Label htmlFor="">
              Birth Date:{' '}
              <span className="font-thin">
                {row?.birth_date && moment(row?.birth_date).format('MMM DD, Y')}
              </span>
            </Label>
          </div>
          <div>
            <Label htmlFor="">
              Relation:{' '}
              <span className="font-thin">{row?.relationship_id}</span>
            </Label>
          </div>
          <div>
            <Label htmlFor="">
              Civil Status:{' '}
              <span className="font-thin">{row?.civil_status}</span>
            </Label>
          </div>
        </div>
        {/* COL2 */}
        <div>
          <div>
            <Label htmlFor="">
              Hired Date:{' '}
              <span className="font-thin">
                {row?.date_hired && moment(row?.date_hired).format('MMM DD, Y')}
              </span>
            </Label>
          </div>
          <div>
            <Label htmlFor="">
              Regularization Date:{' '}
              <span className="font-thin">
                {row?.reg_date && moment(row?.reg_date).format('MMM DD, Y')}
              </span>
            </Label>
          </div>
          <div>
            <Label htmlFor="">
              Effectivity Date:{' '}
              <span className="font-thin">
                {row?.effectivity_date &&
                  moment(row?.effectivity_date).format('MMM DD, Y')}
              </span>
            </Label>
          </div>
          <div>
            <Label htmlFor="">
              Certificate No.:{' '}
              <span className="font-thin">{row?.certificate_no}</span>
            </Label>
          </div>
          <div>
            <Label htmlFor="">
              Date Approved:{' '}
              <span className="font-thin">
                {row?.certificate_issued_at &&
                  moment(row?.certificate_issued_at).format('MMM DD, Y')}
              </span>
            </Label>
          </div>
        </div>
      </div>

      <div className='bg-gray-50'>
        <h1 className='font-bold'>Relationship</h1>
        <table className="text-xs w-full">
          <thead>
            <tr>
              <th className="px-3 py-2 bg-blue-gray-50">Member ID</th>
              <th className="px-3 py-2 bg-blue-gray-50">Name</th>
              <th className="px-3 py-2 bg-blue-gray-50">Birthdate</th>
              <th className="px-3 py-2 bg-blue-gray-50">Civil Status</th>
              <th className="px-3 py-2 bg-blue-gray-50">Relation</th>
            </tr>
          </thead>
          <tbody>
            {deps?.map(item => (
              <tr key={item.id}>
                <td className="px-3 py-1">{item.member_id}</td>
                <td className="px-3 py-1">
                  {item.last_name}, {item.first_name} {item.middle_name}
                </td>
                <td className="px-3 py-1">{item.birth_date}</td>
                <td className="px-3 py-1">{item.civil_status}</td>
                <td className="px-3 py-1">{item.relationship_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
