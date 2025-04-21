import AuthValidationErrors from '@/components/AuthValidationErrors'
import { useBirthdateSearch } from '@/hooks/search-masterlist/masterlist'
import { Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { set } from 'react-hook-form'
import { SyncLoader } from 'react-spinners'

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
  return (
    <div className="bg-gray-50 min-h-screen py-10 flex justify-center items-center">
      <div className="mx-auto p-5 sm:p-10 bg-white w-full max-w-4xl">
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
            <div className="mt-5 mb-5">
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
              <label htmlFor="last_name" className="block text-left mt-4">
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
              <button
                disabled={loading}
                type="submit"
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md w-full">
                Search
              </button>
            </div>
          </form>
        </div>
        <table className="w-full min-w-[400px]overflow-x-hidden">
          <thead>
            <tr>
              <th className="text-left">Firstname</th>
              <th className="text-center">Lastname</th>
              <th>Member ID</th>
              <th>Company</th>
              <th>Birthdate</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {paginatedResults.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="text-center p-3">
                  No results found.
                </td>
              </tr>
            )}
            {loading ? (
              <tr>
                <td colSpan={5} className="py-6 text-center">
                  <div className="flex justify-center items-center h-full">
                    <SyncLoader color="#23b9ff" size={11} />
                  </div>
                </td>
              </tr>
            ) : (
              paginatedResults.map(row => (
                <tr key={row.id} className="even:bg-gray-100">
                  <td className="p-3 text-left">{row.first_name}</td>
                  <td className="p-3 text-center">{row.last_name}</td>
                  <td className="p-3 text-center">{row.member_id}</td>
                  <td className="p-3 text-center">{row.company_name}</td>
                  <td className="p-3 text-center">{row.birth_date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
  )
}
