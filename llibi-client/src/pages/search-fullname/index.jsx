import AuthValidationErrors from '@/components/AuthValidationErrors'
import { useBirthdateSearch } from '@/hooks/search-masterlist/masterlist'
import { Button, Typography } from '@mui/material'
import { useState } from 'react'
import { SyncLoader } from 'react-spinners'
import LoaTypeModal from './components/LoaTypeModal'
import ViewDetailsModal from './components/ViewDetailsModal'
import dayjs from 'dayjs'

import Head from 'next/head'

export default function SearchBirthdateByName() {
  const [search, setSearch] = useState({
    first_name: '',
    last_name: '',
  })
  // Loading state
  const [loading, setLoading] = useState(false)
  // Errors
  const [errors, setErrors] = useState([])
  // Data
  const [results, setResults] = useState([])
  // Pagination
  const [Page, setPage] = useState(1)
  const [batch, setBatch] = useState(0)
  const itemsPerPage = 5
  const batchSize = 50
  const localPage = (Page - 1) % (batchSize / itemsPerPage)
  const paginatedResults = results.slice(
    localPage * itemsPerPage,
    (localPage + 1) * itemsPerPage,
  )
  const searchForm = async e => {
    e.preventDefault()
    if (!search.first_name && !search.last_name) {
      setErrors(['Please enter at least one search term.'])
      return
    }

    setErrors([])
    setPage(1)
    fetchBatch(0) // reset and fetch first 50
  }
  const fetchBatch = async batchNumber => {
    const offset = batchNumber * batchSize

    //start loading
    setLoading(true)
    const data = await useBirthdateSearch(
      { ...search, offset, limit: batchSize },
      setErrors,
      setLoading,
    )

    if (data) {
      setResults(data)
      setBatch(batchNumber)
    }
    setLoading(false)
  }
  const handlePageChange = async newPage => {
    const newBatch = Math.floor((newPage - 1) / (batchSize / itemsPerPage))

    if (newBatch !== batch) {
      await fetchBatch(newBatch)
    }

    setPage(newPage)
  }

  //   Uploading LOA
  const [loaTypeModal, setLoaTypeModal] = useState(false)
  const [selectUser, setSelectUser] = useState()

  // View Details Modal
  const [viewDetailsModal, setViewDetailsModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)

  const handleClickUpload = user => {
    setLoaTypeModal(true)
    setSelectUser(user)
  }

  const handleViewDetails = member => {
    setSelectedMember(member)
    setViewDetailsModal(true)
  }

  const formatDate = value => {
    if (!value) return '-'
    const d = dayjs(value)
    return d.isValid() ? d.format('MMM-DD-YYYY') : '-'
  }

  return (
    <>
      <Head>
        <title>CCE - MANUAL UPLOAD</title>
      </Head>

      <div className="bg-gray-50 min-h-screen py-6 sm:py-10 flex justify-center items-start sm:items-center px-4">
        <div className="mx-auto p-4 sm:p-10 bg-white w-full max-w-6xl rounded-lg shadow-sm">
          <div className="flex items-center w-full"></div>
          <div className="mb-3 mt-10">
            <form onSubmit={searchForm}>
              <div className="mb-5 text-center">
                <h1 className="text-2xl font-bold">Search Member</h1>
                <p className="text-sm text-gray-500">
                  Search for a member's birthdate by name.
                </p>
              </div>
              <AuthValidationErrors errors={errors} />
              <div className="mt-5 mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-left">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    className="w-full rounded-md"
                    onChange={e =>
                      setSearch({ ...search, first_name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-left">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    className="w-full rounded-md"
                    onChange={e =>
                      setSearch({ ...search, last_name: e.target.value })
                    }
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    disabled={loading}
                    type="submit"
                    className="mt-1 bg-blue-500 text-white py-2 px-4 rounded-md w-full">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[780px] sm:min-w-0 px-4 sm:px-0">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left whitespace-nowrap">Firstname</th>
                    <th className="text-center whitespace-nowrap">Lastname</th>
                    <th className="whitespace-nowrap">Member ID</th>
                    <th className="hidden md:table-cell whitespace-nowrap">
                      Company
                    </th>
                    <th className="whitespace-nowrap">Birthdate</th>
                    <th className="hidden lg:table-cell whitespace-nowrap">
                      Incepfrom
                    </th>
                    <th className="hidden lg:table-cell whitespace-nowrap">
                      Incepto
                    </th>
                    <th className="whitespace-nowrap">View Details</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {paginatedResults.length === 0 && !loading && (
                    <tr>
                      <td colSpan={8} className="text-center p-3">
                        No results found.
                      </td>
                    </tr>
                  )}
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-6 text-center">
                        <div className="flex justify-center items-center h-full">
                          <SyncLoader color="#23b9ff" size={11} />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedResults.map(row => (
                      <tr key={row.id} className="even:bg-gray-100">
                        <td className="p-3 text-left whitespace-nowrap">
                          {row.first_name}
                        </td>
                        <td className="p-3 text-center whitespace-nowrap">
                          {row.last_name}
                        </td>
                        <td className="p-3 text-center whitespace-nowrap">
                          {row.member_id}
                        </td>
                        <td className="p-3 text-center hidden md:table-cell whitespace-nowrap">
                          {row.company_name || '-'}
                        </td>
                        <td className="p-3 text-center whitespace-nowrap">
                          {formatDate(row.birth_date)}
                        </td>
                        <td className="p-3 text-center hidden lg:table-cell whitespace-nowrap">
                          {formatDate(row.incepfrom)}
                        </td>
                        <td className="p-3 text-center hidden lg:table-cell whitespace-nowrap">
                          {formatDate(row.incepto)}
                        </td>
                        <td className="p-3 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(row)}
                            className="bg-blue-700 text-white px-3 py-2 rounded-lg hover:bg-blue-800">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full mt-2">
            <div className="flex content-center justify-center items-center">
              <Button
                disabled={Page <= 1}
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={() => handlePageChange(Page - 1)}>
                &lt;
              </Button>
              <Typography
                variant="body2"
                className="text-center py-2 px-4 font-bold text-sm sm:text-md">
                {Page}
              </Typography>
              <Button
                //   disabled={Page === totalPages}
                disabled={results.length < 50 && localPage === 4}
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={() => handlePageChange(Page + 1)}>
                &gt;
              </Button>
            </div>
          </div>
        </div>
      </div>

      {loaTypeModal && (
        <LoaTypeModal
          setLoaTypeModal={setLoaTypeModal}
          selectUser={selectUser}
        />
      )}

      {viewDetailsModal && (
        <ViewDetailsModal
          setViewDetailsModal={setViewDetailsModal}
          memberData={selectedMember}
        />
      )}
    </>
  )
}
