import ProviderLayout from '@/components/Layouts/Self-service/ProviderLayout'
import Head from 'next/head'
import { useRouter } from 'next/router'

import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'

import { useEffect, useRef, useState } from 'react'
import { SyncLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import Backdrop from '@mui/material/Backdrop'
import ApplicationLogo from '@/components/ApplicationLogo'

import Clock from 'react-live-clock'
import axios from '@/lib/axios'
import Button from '@/components/Button'
import ReactPaginate from 'react-paginate'
import UploadPolicy from '@/pages/upload-policy/UploadPolicy'

const UploadPolicyForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { show, setShow, body, setBody, toggle } = ModalControl()

  // START search variables, etc.
  const [search, setSearch] = useState('')
  const [companies, setCompanies] = useState([])
  const [contentLoading, setContentLoading] = useState(false)

  useEffect(() => {
    setContentLoading(true)
    axios
      .get('/self-service/get-companies')
      .then(res => {
        console.log(res.data)
        setCompanies(res.data)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setContentLoading(false)
      })
  }, [])

  // filtering companies
  const filteredCompanies =
    search.length > 0
      ? companies.filter(company =>
          company.name.toLowerCase().includes(search.toLowerCase()),
        )
      : companies
  // END search variables, etc.

  // START search results variables, pagination, etc.
  const [currentPage, setCurrentPage] = useState(0)

  const itemsPerPage = 8

  const offset = currentPage * itemsPerPage
  const currentItems = filteredCompanies.slice(offset, offset + itemsPerPage)
  const pageCount = Math.ceil(filteredCompanies.length / itemsPerPage)

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected)
  }
  // END search results variables, pagination, etc.

  // START Uploading functions, variables, etc.
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [file, setFile] = useState(null)
  const handleShowModalUploadPolicy = () => setBody(modalUploadPolicy)
  const modalUploadPolicy = () => {
    setBody({
      title: `Upload Policy (${selectedCompany.name})`,
      content: (
        <UploadPolicy
          fileTypes={['pdf']}
          file={file}
          setFile={setFile}
          className={'flex flex-col justify-start h-full'}
        />
      ),
      noClose: false,
      modalOuterContainer: 'w-2/3',
      modalContainer: 'rounded-lg',
      modalBody: 'h-full',
    })
    toggle()
  }

  useEffect(() => {
    if (selectedCompany) {
      console.log(selectedCompany)
      handleShowModalUploadPolicy()
    }
  }, [selectedCompany])

  useEffect(() => {
    if (!show) {
      setSelectedCompany(null)
    }
  }, [show])

  // END Uploading function, variables, etc.

  return (
    <ProviderLayout>
      <Head>
        <title>Upload Policy</title>
      </Head>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Main Form */}
          <div className="p-6 bg-white border-b border-gray-300 shadow-sm sm:rounded-lg">
            {/* Main Header, title and logo */}
            <div className="flex-none md:flex gap-5 font-bold text-xl text-gray-900">
              <ApplicationLogo width={200} />
              <div className="my-auto w-full">
                <div className="w-full text-center md:text-right">
                  <p>Upload Policy</p>
                  <p className="text-sm text-shadow-lg text-gray-700">
                    <Clock
                      format={'dddd, MMMM Do, YYYY, h:mm:ss A'}
                      ticking={true}
                      timezone={'Asia/Manila'}
                    />
                  </p>
                  <p
                    className="text-xs text-blue-500 cursor-pointer"
                    onClick={() => {
                      console.log('Tutorial Modal')
                    }}>
                    Click here to view tutorial
                  </p>
                </div>
              </div>
            </div>
            <hr className="my-2 mb-3 border-b-4 shadow border-blue-900 rounded-lg"></hr>
            {/* Content */}
            <div className="flex flex-col px-6 py-4 gap-2">
              <input
                type="text"
                placeholder="Search Company Name"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  height: '30px',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '5px',
                  border: '1px solid #0EB0FB',
                }}
              />
              {loading ? (
                <SyncLoader color="#0EB0FB" loading={loading} size={10} />
              ) : (
                <div className="flex flex-col w-full">
                  <table className="table table-auto w-full grid-cols-5">
                    <thead className=" text-center border-b-2 border-b-blue-gray-800">
                      {filteredCompanies.length === 0 ? null : (
                        <tr>
                          <th className=" col-span-4">Company Name</th>
                          <th>Policy</th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {currentItems.map((company, index) => (
                        <tr
                          key={index}
                          className="border-b-2 border-b-blue-gray-800">
                          <td>{company.name}</td>
                          <td className="flex justify-center">
                            <div className="flex justify-center flex-row gap-6 py-2">
                              <Button
                                className="whitespace-nowrap"
                                onClick={() => {
                                  setSelectedCompany(company)
                                }}>
                                Upload Policy
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-center">
                    {filteredCompanies.length > itemsPerPage && (
                      <ReactPaginate
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        breakLabel={'...'}
                        pageCount={pageCount}
                        marginPagesDisplayed={3}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName="flex justify-center gap-2 mt-4 w-1/2"
                        pageClassName="px-3 py-1 border rounded-md hover:bg-blue-500 hover:text-white"
                        activeClassName="bg-blue-500 text-white"
                        previousClassName="px-3 py-1 border rounded-md hover:bg-blue-500 hover:text-white"
                        nextClassName="px-3 py-1 border rounded-md hover:bg-blue-500 hover:text-white"
                        disabledClassName="opacity-50 cursor-not-allowed"
                        breakClassName="px-3 py-1 border rounded-md"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
            <Modal show={show} body={body} toggle={toggle} />
          </div>
        </div>
      </div>
    </ProviderLayout>
  )
}

export default UploadPolicyForm
