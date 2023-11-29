import React, { useState } from 'react'

import { useMasterlist } from '@/hooks/search-masterlist/masterlist'
import AppLayout from '@/components/Layouts/AppLayout'
export default function SearchMasterListHomePage() {
  const [search, setSearch] = useState('')
  const { masterlist } = useMasterlist({ search })

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
    <AppLayout>
      <div className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto p-10 bg-white">
          <div className="mb-3">
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
                  <td className="p-3">{row.member_id}</td>
                  <td className="p-3">{row.first_name}</td>
                  <td className="p-3">{row.last_name}</td>
                  <td className="p-3">{row.dob}</td>
                  <td className="p-3">{row.relation || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}
