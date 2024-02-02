import React from 'react'
import { FaRegUser } from 'react-icons/fa'

export default function ComplaintInformation({ complaint }) {
  return (
    <>
      <div className="w-[30em] rounded-md p-3 bg-gradient-to-tl from-blue-600 via-cyan-600 to-teal-600 shadow-md h-44 text-white">
        <div className="mb-5 flex justify-between">
          <div>
            <h4 className="font-bold uppercase text-2xl">
              Personal Information
            </h4>
          </div>
          <div>
            <FaRegUser size={30} />
          </div>
        </div>
        <div>
          <div>
            <span className="uppercase font-bold">Name </span>
            <span className="uppercase">
              {complaint.last_name}, {complaint.first_name}{' '}
              {complaint.middle_name}
            </span>
          </div>
          <div>
            <span className="uppercase font-bold">Date of Birth </span>
            <span className="uppercase">{complaint.dob}</span>
          </div>
          <div>
            <span className="uppercase font-bold">ER Card No. </span>
            <span className="uppercase">{complaint.ercard_no}</span>
          </div>
          <div>
            <span className="uppercase font-bold">Company Name </span>
            <span className="uppercase">{complaint.company_name}</span>
          </div>
        </div>
      </div>
      <div className="w-[30em] rounded-md p-3 bg-gradient-to-tl from-red-500 via-red-700 to-red-900 shadow-md h-44 text-white">
        <div className="mb-5 flex justify-between">
          <div>
            <h4 className="font-bold uppercase text-2xl">
              Dependent Information
            </h4>
          </div>
          <div>
            <FaRegUser size={30} />
          </div>
        </div>
        <div>
          <div>
            <span className="uppercase font-bold">Name </span>
            <span className="uppercase">
              {complaint.deps_last_name}, {complaint.deps_first_name}{' '}
              {complaint.deps_middle_name}
            </span>
          </div>
          <div>
            <span className="uppercase font-bold">Date of Birth </span>
            <span className="uppercase">{complaint.deps_dob}</span>
          </div>
          <div>
            <span className="uppercase font-bold">ER Card No. </span>
            <span className="uppercase">{complaint.deps_ercard_no}</span>
          </div>
        </div>
      </div>
    </>
  )
}
