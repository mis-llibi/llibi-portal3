import React, { useState } from 'react'
import { useAuth } from '@/hooks/auth'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { useMasterlist } from '@/hooks/search-masterlist/masterlist'

import AppLayout from '@/components/Layouts/AppLayout'
import GuestLayout from '@/components/Layouts/GuestLayout'
import { DropdownButton } from '@/components/DropdownLink'
import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'

export default function SearchMasterListHomePage() {
  const [search, setSearch] = useState('')
  const { masterlist } = useMasterlist({ search })

  const router = useRouter()
  const { user, logout } = useAuth({ middleware: 'auth' })

  const [timer, setTimer] = useState(null)

  const searchForm = text => {
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
    setTimer(
      setTimeout(() => {
        setSearch(text)
      }, 1000),
    )
  }

  console.log(masterlist)
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto p-10 bg-white">
        <div className="flex items-center w-full">
          <div className="flex-grow flex items-center">
            <Link href="/self-service/admin">
              <a>
                <ApplicationLogo
                  width={200}
                  className="block h-10 w-auto fill-current text-gray-600"
                />
              </a>
            </Link>
          </div>

          <div className="">
            <Dropdown
              align="right"
              width="48"
              trigger={
                <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                  <div className="capitalize">
                    {user?.last_name + ', ' + user?.first_name}
                  </div>

                  <div className="ml-1">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>
              }>
              {/* Authentication */}
              <DropdownButton onClick={logout}>Logout</DropdownButton>
            </Dropdown>
          </div>
        </div>
        <div className="mb-3 mt-10">
          <label htmlFor="search">Search</label>
          <input
            type="text"
            id="search"
            className="w-full rounded-md"
            onChange={e => searchForm(e.target.value)}
          />
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th>MemberId</th>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Birhdate</th>
              <th>Relation</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {masterlist?.map(row => (
              <tr key={row.id} className="even:bg-gray-100">
                <td className="p-3 text-center">{row.member_id}</td>
                <td className="p-3">{row.first_name}</td>
                <td className="p-3">{row.last_name}</td>
                <td className="p-3 text-center">{row.birth_date}</td>
                <td className="p-3 text-center">{row.relation || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
