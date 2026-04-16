import ProviderLayout from '@/components/Layouts/Self-service/ProviderLayout'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import Input from '@/components/Input'
import Button from '@/components/Button'
import axios from '@/lib/axios'
import ApplicationLogo from '@/components/ApplicationLogo'
import Clock from 'react-live-clock'
import Dropdown from '@/components/Dropdown'
import { DropdownButton } from '@/components/DropdownLink'
import { useAuth } from '@/hooks/auth'
import Swal from 'sweetalert2'

export default function CompanyPolicies() {
  const [search, setSearch] = useState('')
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)

  const { user, logout } = useAuth({
    middleware: 'auth',
  })

  useEffect(() => {
    const fetchAllCompanies = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          '/api/company-policies/get-all-companies',
        )
        setCompanies(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchAllCompanies()
  }, [])

  const handleSearch = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.get(
        '/api/company-policies/search-companies',
        {
          params: { search },
        },
      )
      setCompanies(response.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompanySelect = async companyName => {
    setLoading(true)
    try {
      const response = await axios.get(
        `/api/company-policies/get-policy/${encodeURIComponent(companyName)}`,
      )
      if (response.data.policypath) {
        window.open(response.data.policypath, '_blank')
      } else {
        Swal.fire('Notice', 'No policy found for this company.', 'info')
      }
    } catch (error) {
      console.error('Failed to fetch policy:', error)
      Swal.fire('Error', 'No policy found for this company.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProviderLayout>
      <Head>
        <title>Company Policies</title>
      </Head>

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="p-6 bg-white border-b border-gray-300 shadow-sm sm:rounded-lg mb-6">
            <div className="flex-none md:flex gap-5 font-bold text-xl text-gray-900">
              <ApplicationLogo width={200} />
              <div className="my-auto w-full">
                <div className="w-full text-center md:text-right">
                  <p className="text-blue-900">Company Policies</p>
                  <p className="text-sm text-shadow-lg text-gray-700">
                    <Clock
                      format={'dddd, MMMM Do, YYYY, h:mm:ss A'}
                      ticking={true}
                      timezone={'Asia/Manila'}
                    />
                  </p>
                  <div className="flex justify-end">
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
                      <DropdownButton onClick={logout}>Logout</DropdownButton>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b rounded">
              <h1 className="text-xl font-bold mb-4">Search Company Policy</h1>
              <form onSubmit={handleSearch} className="flex gap-4 mb-6">
                <Input
                  type="text"
                  placeholder="Search Company"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </form>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companies.map((company, index) => (
                  <div
                    key={index}
                    onClick={() => handleCompanySelect(company.name)}
                    className="p-4 border rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white hover:bg-gray-50">
                    <p className="font-semibold text-gray-700 text-center">
                      {company.name}
                    </p>
                  </div>
                ))}
                {!loading && companies.length === 0 && (
                  <p className="text-gray-500 col-span-full">
                    No companies found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProviderLayout>
  )
}
