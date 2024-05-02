import React from 'react'
import { useRouter } from 'next/router'

import {
  CiBank,
  CiUser,
  CiCircleList,
  CiBadgeDollar,
  CiSaveDown1,
} from 'react-icons/ci'

export default function PatientCardDetails({ employee }) {
  const router = useRouter()
  const { hospital_class } = router.query

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-3 mb-3">
      <div className="flex gap-3 rounded-md flex-wrap">
        <div className="flex-1 bg-gradient-to-tl from-red-500 via-red-700 to-red-900 p-3 rounded-md">
          <div className="flex justify-between">
            <div>
              <h4 className="font-bold text-white text-sm uppercase">
                Company Name
              </h4>
            </div>
            <div>
              <CiBank className="text-white text-3xl" />
            </div>
          </div>
          <div>
            <span className="text-white font-bold text-sm">
              {employee?.companies?.name}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-3 rounded-md flex-wrap">
        <div className="flex-1 bg-gradient-to-tl from-red-500 via-red-700 to-red-900 p-3 rounded-md">
          <div className="flex justify-between">
            <div>
              <h4 className="font-bold text-white text-sm uppercase">
                Patient Name
              </h4>
            </div>
            <div>
              <CiUser className="text-white text-3xl" />
            </div>
          </div>
          <div>
            <span className="text-white font-bold text-sm">
              {employee?.masterlist?.last_name},{' '}
              {employee?.masterlist?.first_name}{' '}
              {employee?.masterlist?.middle_name}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-3 rounded-md flex-wrap">
        <div className="flex-1 bg-gradient-to-tl from-red-500 via-red-700 to-red-900 p-3 rounded-md">
          <div className="flex justify-between">
            <div>
              <h4 className="font-bold text-white text-sm uppercase">
                Plan Type - CLASS {hospital_class}
              </h4>
            </div>
            <div>
              <CiCircleList className="text-white text-3xl" />
            </div>
          </div>
          <div>
            <span className="text-white font-bold text-sm">
              {employee?.companies?.plantype} {' | '}
              {employee?.plan_type === 1 && 'Individual OP Limit'}
              {employee?.plan_type === 2 && 'OP Shared by family'}
              {employee?.plan_type === 3 &&
                'OP Shared by family except employee'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
