import React from 'react'
import { useRouter } from 'next/router'

import {
  CiBank,
  CiUser,
  CiCircleList,
  CiBadgeDollar,
  CiSaveDown1,
  CiHospital1,
} from 'react-icons/ci'

const PatientCardComponent = ({ title, content, icon }) => {
  return (
    <div className="flex-1 bg-gradient-to-tl from-red-500 via-red-700 to-red-900 p-3 rounded-md">
      <div className="flex justify-between">
        <div>
          <h4 className="font-bold text-white text-xs uppercase">{title}</h4>
        </div>
        <div>{icon}</div>
      </div>
      <div>{content}</div>
    </div>
  )
}

export default function PatientCardDetails({ employee }) {
  const router = useRouter()
  const { hospital_class } = router.query

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-3 mb-3">
      <div className="flex gap-3 rounded-md flex-wrap">
        <PatientCardComponent
          title="Company Name"
          content={
            <span className="text-white font-bold text-xs">
              {employee?.companies?.name}
            </span>
          }
          icon={<CiBank className="text-white text-3xl" />}
        />
      </div>
      <div className="flex gap-3 rounded-md flex-wrap">
        <PatientCardComponent
          title="Patient Name"
          content={
            <span className="text-white font-bold text-xs">
              {employee?.masterlist?.last_name},{' '}
              {employee?.masterlist?.first_name}{' '}
              {employee?.masterlist?.middle_name}
            </span>
          }
          icon={<CiUser className="text-white text-3xl" />}
        />
      </div>
      <div className="flex gap-3 rounded-md flex-wrap">
        <PatientCardComponent
          title="Hospital"
          content={
            <>
              <p className="text-white font-bold text-xs mb-3 uppercase">
                {employee?.hospital?.name}
              </p>
              <p className="text-white font-bold text-xs">
                {employee?.hospital?.add1}
              </p>
            </>
          }
          icon={<CiHospital1 className="text-white text-3xl" />}
        />
      </div>
      <div className="flex gap-3 rounded-md flex-wrap">
        <PatientCardComponent
          title={`Plan Type - CLASS ${hospital_class}`}
          content={
            <span className="text-white font-bold text-xs">
              {employee?.companies?.plantype} {' | '}
              {employee?.plan_type === 1 && 'Individual OP Limit'}
              {employee?.plan_type === 2 && 'OP Shared by family'}
              {employee?.plan_type === 3 &&
                'OP Shared by family except employee'}
            </span>
          }
          icon={<CiHospital1 className="text-white text-3xl" />}
        />
      </div>
    </div>
  )
}
