import ProviderLayout from '@/components/Layouts/Self-service/ProviderLayout'
import Head from 'next/head'
import { useRouter } from 'next/router'

import ApplicationLogo from '@/components/ApplicationLogo'
import Label from '@/components/Label'
import Input from '@/components/Input'
import InputSelect from '@/components/InputSelect'
import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAdmin } from '@/hooks/self-service/admin'

import { SyncLoader } from 'react-spinners'

import Form from '@/pages/self-service/admin/form'
import Export from './export'
import Settings from './settings'
import Logs from './logs'

import Clock from 'react-live-clock'

import { useAuth } from '@/hooks/auth'
import Button from '@/components/Button'
import Dropdown from '@/components/Dropdown'
import { DropdownButton } from '@/components/DropdownLink'
import axios from '@/lib/axios'

import useSound from 'use-sound'
import Swal from 'sweetalert2'

import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import MUIButton from '@mui/material/Button'
import Link from 'next/link'

const Admin = () => {
  const router = useRouter()
  // const [play] = useSound('/thepurge.mp3')
  // const [audio, setAudio] = useState(null)
  const videoRef = useRef(null)
  const { user, logout } = useAuth({
    middleware: 'auth',
  })
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm()

  const [loading, setLoading] = useState(false)

  const { show, setShow, body, setBody, toggle } = ModalControl()

  const [request, setRequest] = useState()
  const [timer, setTimer] = useState(null)

  const [name, setName] = useState()
  const [searchStatus, setSearchStatus] = useState()

  const {
    clients,
    searchRequest,
    exporting,
    viewBy,
    settings,
    updateSettings,
    previewExport,
  } = useAdmin({
    name: name,
    status: searchStatus,
  })

  const checkRequestStatus = data => {
    setSearchStatus(data?.value)
  }

  const searchForm = data => {
    setLoading(true)
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
    setTimer(
      setTimeout(() => {
        setName(data?.name)
      }, 1000),
    )
    setLoading(false)
  }

  /*
        useEffect(() => {
            const intervalId = setInterval(() => {
                //assign interval to a variable to clear it.
                console.log(name)
            }, 10000)

            return () => clearInterval(intervalId) //This is important
        }, []) 
    */

  useEffect(() => {
    setLoading(true)
    //assign interval to a variable to clear it.
    searchRequest({
      setRequest,
      setLoading,
      name: name,
      status: searchStatus,
    })
    setLoading(false)
  }, [name, searchStatus])

  const view = async row => {
    try {
      const reponse = await viewBy(row, 'view')
      // console.log(reponse);
      // return;

      if (!reponse.status) return

      setBody({
        title: row.memberID + ' - ' + row.lastName + ', ' + row.firstName,
        content: <Form setRequest={setRequest} row={row} />,
        //modalOuterContainer: 'w-full md:w-10/12 max-h-screen',
        modalOuterContainer: 'w-full h-full',
        //modalContainer: '',
        modalContainer: 'h-full',
        modalBody: 'h-full overflow-y-scroll',
      })
      toggle()
    } catch (error) {
      throw error
    }
  }

  const status = [
    { value: 2, label: 'Pending' },
    { value: 3, label: 'Approved' },
    { value: 4, label: 'Disapproved' },
    { value: 5, label: 'Downloaded' },
  ]

  const handleShowModalSetDate = () => setBody(modalExporting)
  const handleShowModalSetting = () => setBody(modalSetting)
  const handleShowLogs = () => setBody(modalLogs)

  const modalExporting = () => {
    setBody({
      title: <span className="font-bold text-lg">Select Date</span>,
      content: (
        <Export
          exporting={exporting}
          previewExport={previewExport}
          setLoading={setLoading}
        />
      ),
      //modalOuterContainer: 'w-full md:w-10/12 max-h-screen',
      modalOuterContainer: 'w-1/3',
      //modalContainer: '',
      modalContainer: 'h-full',
      modalBody: 'h-full',
    })
    toggle()
  }

  const modalSetting = () => {
    setBody({
      title: <span className="font-bold text-lg">Settings</span>,
      content: <Settings settings={settings} updateSettings={updateSettings} />,
      //modalOuterContainer: 'w-full md:w-10/12 max-h-screen',
      modalOuterContainer: 'w-1/2',
      //modalContainer: '',
      modalContainer: 'h-full',
      modalBody: 'h-full',
    })
    toggle()
  }

  const modalLogs = () => {
    setBody({
      title: <span className="font-bold text-lg">Logs</span>,
      content: <Logs />,
      //modalOuterContainer: 'w-full md:w-10/12 max-h-screen',
      modalOuterContainer: 'w-1/2',
      //modalContainer: '',
      modalContainer: 'h-full',
      modalBody: 'h-full',
    })
    toggle()
  }

  // https://championcr.com/topic/enable-auto-play/
  useEffect(() => {
    const playVideo = async () => {
      try {
        if (videoRef.current) {
          if (clients?.length > 0) {
            if (searchStatus === 2 || searchStatus === undefined) {
              Swal.fire({
                title: 'NEW CLAIMS REQUEST',
                text: '',
                icon: 'warning',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OKAY',
              }).then(result => {
                if (result.isConfirmed) {
                  videoRef.current.muted = true
                  videoRef.current.pause()
                }
              })
              videoRef.current.muted = false // Unmute
              videoRef.current.autoPlay = true
            }
          }
        }
      } catch (err) {
        console.error('Autoplay was prevented:', err)
      }
    }

    if (process.env.NODE_ENV === 'production') {
      playVideo()
    }
  }, [clients])

  return (
    <ProviderLayout>
      <Head>
        <title>LLIBI PORTAL - ADMIN</title>
      </Head>
      <video ref={videoRef} controls autoPlay muted className="hidden">
        <source src="/thepurge.mp3" type="audio/mpeg" />
      </video>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Main form white background */}
          <div className="p-6 bg-white border-b border-gray-200 shadow-sm sm:rounded-lg">
            {/* Main Header, title and logo */}
            <div className="flex-none md:flex gap-5 font-bold text-xl text-gray-900">
              <ApplicationLogo width={200} />
              <div className="my-auto w-full">
                <div className="w-full text-center md:text-right">
                  <p>
                    Member{' '}
                    <span className="text-blue-900">Client Care Portal</span>
                  </p>
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
                      {/* Authentication */}
                      <DropdownButton onClick={logout}>Logout</DropdownButton>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
            <hr className="my-2 mb-3 border-b-4 shadow border-blue-900 rounded-lg"></hr>

            {/* Action Form */}
            <form onChange={handleSubmit(searchForm)} className="w-full">
              <div className="flex gap-2">
                <div className="basis-1/3 mb-2">
                  <Label htmlFor="name" className="text-blue-500 text-bold">
                    Patient Name / Member ID
                  </Label>
                  <Input
                    id="name"
                    register={{
                      ...register('name'),
                    }}
                    placeholder="Search for patient's name or member ID"
                    errors={errors?.name}
                  />
                </div>
                <div className="basis-1/3 mb-2">
                  <Label htmlFor="status" className="text-blue-500 text-bold">
                    Request Status
                  </Label>
                  <InputSelect
                    id="searchStatus"
                    label="Default = Pending"
                    onChange={e => checkRequestStatus(e)}
                    required={false}
                    register={{
                      ...register('searchStatus'),
                    }}
                    errors={errors?.searchStatus}
                    control={control}
                    option={status}
                  />
                </div>
                <div className="basis-1/3 flex place-items-center pl-5">
                  {loading && <SyncLoader size={10} color="#0EB0FB" />}
                </div>
                <div className="basis-1/3 mb-2 flex justify-end items-center">
                  {[2, 3].includes(user?.user_level) && (
                    <>
                      <div className="flex gap-1">
                        <a className='text-blue-700 font-bold w-40 self-center' href='/search-masterlist' target='_blank'>
                          Search to masterlist
                        </a>
                        <Button type="button" onClick={handleShowModalSetDate}>
                          Export
                        </Button>
                        <Button type="button" onClick={handleShowModalSetting}>
                          Settings
                        </Button>
                        <Button type="button" onClick={handleShowLogs}>
                          Logs
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <table className="table-auto w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-2 text-left">
                      Member ID
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      COMPANY
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Patient's Name
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      LOA Type
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      Status
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      D/T Created
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      VIBER
                    </th>
                    <th className="border border-gray-300 p-2 text-left w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {clients?.length > 0 ? (
                    clients?.map((row, i) => (
                      <tr
                        key={i}
                        className={`${
                          (row.status === 2 && 'bg-orange-50') ||
                          (row.status === 3 && 'bg-green-50') ||
                          (row.status === 4 && 'bg-red-100') ||
                          (row.status === 5 && 'bg-purple-100')
                        }`}>
                        <td className="border border-gray-300 p-2">
                          {row.isDependent ? row.depMemberID : row.memberID}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {row.company_name}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {row.isDependent
                            ? `${row.depLastName}, ${row.depFirstName}`
                            : `${row.lastName}, ${row.firstName}`}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {row.loaType.toUpperCase() || 'N/A'}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {row.status === 2 && 'Pending'}
                          {row.status === 3 && 'Approved'}
                          {row.status === 4 && 'Disapproved'}
                          {row.status === 5 && 'Downloaded'}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {row.createdAt}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {row.platform === 'viber' ? 'YES' : '-'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          <a
                            className="text-xs text-white px-2 py-1 rounded-sm cursor-pointer bg-blue-800 hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900"
                            onClick={() => {
                              view(row)
                            }}>
                            VIEW
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="text-center border bg-red-50 p-2 font-semibold"
                        colSpan={6}>
                        No patient found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </form>
            {/* End Table */}
          </div>
        </div>

        <Modal show={show} body={body} toggle={toggle} />

        <Backdrop
          sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
          open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </ProviderLayout>
  )
}

export default Admin
