import React, { useEffect, useState } from 'react'
import Modal from '@/components/Modal'
import axios from '@/lib/axios'

import { MdOutlineTouchApp, MdOutlineSearch } from 'react-icons/md'

import { getPrincipal } from '@/hooks/members/PrincipalHooks'
import PrincipalRow from './principal/PrincipalRow'

export default function PrincipalList({ show, setShow, setSelectedPrincipal }) {
  const [search, setSearch] = useState(null)
  const { data: principals, isLoading, errors } = getPrincipal({ search })

  const handleSetSelected = row => {
    setSelectedPrincipal(row)
    setShow(false)
  }

  if (errors) return <h1>Something went wrong.</h1>
  if (isLoading) return <h1>Loading...</h1>

  return (
    <>
      <div className="h-[70vh] overflow-y-scroll">
        <label htmlFor="search" className="text-xs">
          Search
        </label>
        <div className="flex gap-1">
          <div className="flex-1">
            <input
              id="search"
              type="text"
              name="search"
              className="border rounded-md w-full mb-3 text-xs border-gray-400"
            />
          </div>
          <div>
            <button
              className="group border px-3 py-2 shadow rounded-md hover:bg-gray-800 border-gray-400"
              title="Search">
              <MdOutlineSearch className="group-hover:text-white text-lg" />
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead className="text-xs bg-blue-700 text-white">
            <tr>
              <th className="p-3 w-32">Principal</th>
              {/* <th className="p-3 flex-grow">Name</th> */}
              <th className="p-3 ">Relation</th>
              <th className="p-3 w-32">Birth Date</th>
              <th className="p-3 ">Gender</th>
              <th className="p-3 ">Civil Status</th>
              <th className="p-3 ">Action</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {principals?.map((row, i) => {
              return (
                <PrincipalRow
                  key={row.id}
                  row={row}
                  handleSetSelected={handleSetSelected}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
