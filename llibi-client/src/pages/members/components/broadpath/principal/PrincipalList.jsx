import React, { useEffect, useRef, useState } from 'react'

import { MdOutlineSearch } from 'react-icons/md'

import { getPrincipal } from '@/hooks/members/PrincipalHooks'
import PrincipalRow from './PrincipalRow'

export default function PrincipalList({ show, setShow, setSelectedPrincipal }) {
  const [search, setSearch] = useState('')
  const { data: principals, isLoading, errors } = getPrincipal({ search })

  const searchRef = useRef('')

  const handleSetSelected = row => {
    setSelectedPrincipal(row)
    setShow(false)
  }

  const handleSearch = () => {
    setSearch(searchRef.current.value)
  }

  if (errors) return <h1>Something went wrong.</h1>
  if (isLoading) return <h1>Loading...</h1>

  return (
    <>
      <div className="max-h-[70vh] overflow-y-auto font-[poppins]">
        <label htmlFor="search" className="text-xs">
          Search
        </label>
        <div className="flex gap-1">
          <div className="w-60">
            <input
              id="search"
              type="text"
              name="search"
              placeholder="Input search (ex: first name, last name)"
              className="border rounded-md w-full mb-3 text-xs border-gray-200"
              ref={searchRef}
            />
          </div>
          <div>
            <button
              className="group border px-3 py-2 rounded-md hover:bg-gray-100"
              title="Search"
              onClick={handleSearch}>
              <MdOutlineSearch className="text-lg" />
            </button>
          </div>
        </div>
        <table className="w-screen">
          <thead className="text-xs bg-blue-700 text-white">
            <tr className="uppercase">
              <th className="p-3">Principal</th>
              {/* <th className="p-3 flex-grow">Name</th> */}
              {/* <th className="p-3 ">Relation</th> */}
              <th className="p-3">Regularization Date</th>
              <th className="p-3">Hired Date</th>
              <th className="p-3">Email</th>
              <th className="p-3">Birth Date</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Civil Status</th>
              {/* <th className="p-3">Action</th> */}
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
