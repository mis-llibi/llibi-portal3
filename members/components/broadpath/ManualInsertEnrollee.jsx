import React, { useEffect, useState } from 'react'

import Label from '@/components/Label'

import {
  MdOutlineFamilyRestroom,
  MdOutlineEscalatorWarning,
} from 'react-icons/md'

import PrincipalEnrollment from '@/components/boradpath/hris/modals/hr/PrincipalEnrollment'
import DependentEnrollment from '@/components/boradpath/hris/modals/hr/DependentEnrollment'

const INITIAL_ENROLLMENT_RELATION = {
  principal: 'PRINCIPAL',
  dependent: 'DEPENDENT',
}

import { useEnrollmentRelationStore } from '@/store/useEnrollmentRelationStore'

const ManualInsertEnrollee = ({
  create,
  loading,
  setLoader,
  setShow,
  mutate,
}) => {
  const {
    enrollmentRelation,
    setEnrollmentRelation,
  } = useEnrollmentRelationStore()

  // const handleSetEnrollmentRelation = value => {
  //   setEnrollmentRelation(value)
  // }

  return (
    <div className="p-3 font-[poppins]">
      <div className="mb-3">
        <span className="text-gray-700 text-sm font-semibold">
          Please select what relation to enroll
        </span>
        <div className="flex justify-center gap-3 border rounded-md p-3 mb-3">
          <Label
            htmlFor="enrollment_relation_principal"
            className={`${
              enrollmentRelation === INITIAL_ENROLLMENT_RELATION.principal &&
              'bg-blue-700 text-white'
            } border p-3 w-40 flex flex-col justify-center items-center h-20 rounded-md hover:bg-blue-700 hover:text-white transition-all ease-out`}>
            <input
              className="sr-only"
              type="radio"
              id="enrollment_relation_principal"
              value="PRINCIPAL"
              onChange={e => setEnrollmentRelation(e.target.value)}
              checked={
                enrollmentRelation === INITIAL_ENROLLMENT_RELATION.principal
              }
            />
            <MdOutlineEscalatorWarning size={32} />
            <span className="tracking-widest">PRINCIPAL</span>
          </Label>
          <Label
            htmlFor="enrollment_relation_dependent"
            className={`${
              enrollmentRelation === INITIAL_ENROLLMENT_RELATION.dependent &&
              'bg-blue-700 text-white'
            } border p-3 w-40 flex flex-col justify-center items-center h-20 rounded-md hover:bg-blue-700 hover:text-white transition-all ease-out`}>
            <input
              className="sr-only"
              type="radio"
              id="enrollment_relation_dependent"
              value="DEPENDENT"
              onChange={e => setEnrollmentRelation(e.target.value)}
              checked={
                enrollmentRelation === INITIAL_ENROLLMENT_RELATION.dependent
              }
            />
            <MdOutlineFamilyRestroom size={32} />
            <span className="tracking-widest">DEPENDENT</span>
          </Label>
        </div>
      </div>

      {enrollmentRelation === INITIAL_ENROLLMENT_RELATION.principal && (
        <PrincipalEnrollment
          loading={loading}
          setLoader={setLoader}
          mutate={mutate}
        />
      )}
      {enrollmentRelation === INITIAL_ENROLLMENT_RELATION.dependent && (
        <DependentEnrollment
          loading={loading}
          setLoader={setLoader}
          mutate={mutate}
        />
      )}
    </div>
  )
}

export default ManualInsertEnrollee
