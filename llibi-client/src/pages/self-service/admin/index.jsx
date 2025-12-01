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
import ProcedureForm from '@/pages/self-service/admin/procedureForm'
import Export from './export'
import Settings from './settings'
import Logs from './logs'
import ViewPolicy from './viewPolicy'

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

import { CustomPusher } from '@/lib/pusher'

import { FaXmark } from "react-icons/fa6";
import ApprovalForm from './approvalForm'
import ShowLoa from './showloa'

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

  const [isCallbackShow, setIsCallbackShow] = useState(false)


  const [isCallbackforProviderShow, setIsCallbackforProviderShow] = useState(false)


  const [getIdPerCallback, setGetIdPerCallback] = useState(0)

  const [loadingUnresponsive, setLoadingUnresponsive] = useState(false)

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

  useEffect(() => {
    setLoading(true)
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
    { value: 3, label: 'Approved LOA' },
    { value: 4, label: 'Disapproved' },
    { value: 5, label: 'Downloaded' },
    { value: 6, label: 'Not Viewed' },
    { value: 7, label: 'Approved Callback' },
    { value: 9, label: 'Pending Callback' },
    { value: 10, label: 'Failed Callback' }
  ]

  const handleShowModalSetDate = () => setBody(modalExporting)
  const handleShowModalSetting = () => setBody(modalSetting)
  const handleShowLogs = () => setBody(modalLogs)
  const handleShowModalViewPolicy = () => setBody(modalViewPolicy)

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

  const modalViewPolicy = () => {
    setBody({
      title: <span className="font-bold text-lg">View/Upload Policy</span>,
      content: <ViewPolicy />,
      modalOuterContainer: 'w-3/4',
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
//   useEffect(() => {
//     const playVideo = async () => {
//       try {
//         if (videoRef.current) {
//           if (clients?.length > 0) {
//             if (searchStatus === 2 || searchStatus === undefined) {
//               Swal.fire({
//                 title: 'NEW CLAIMS REQUEST',
//                 text: '',
//                 icon: 'warning',
//                 showCancelButton: false,
//                 confirmButtonColor: '#3085d6',
//                 cancelButtonColor: '#d33',
//                 confirmButtonText: 'OKAY',
//               }).then(result => {
//                 if (result.isConfirmed) {
//                   videoRef.current.muted = true
//                   videoRef.current.pause()
//                 }
//               })
//               videoRef.current.muted = false // Unmute
//               videoRef.current.autoPlay = true
//             }
//           }
//         }
//       } catch (err) {
//         console.error('Autoplay was prevented:', err)
//       }
//     }

//     if (process.env.NODE_ENV === 'production') {
//       playVideo()
//     }
//   }, [clients])

  useEffect(() => {
    if (user && user?.email === 'mailynramos@llibi.com') {
      router.push('/complaint/error-logs/')
      return
    }
    if (user && user?.email === 'manilacae@llibi.com') {
      router.push('/complaint/error-logs/monitoring')
      return
    }
  }, [user?.email])

//   useEffect(() => {
//     const channel = CustomPusher.subscribe('channel-realtime')
//     channel.bind('realtime-notification-event', data => {
//       const { message, date_created } = data.data

//       // setMessages(prevMessages => [...prevMessages, { message, date_created }])

//       Swal.fire({
//         title: 'Good day!',
//         text: message,
//         icon: 'info',
//       })
//       console.log(message, date_created)
//     })

//     return () => {
//       channel.unbind_all()
//       channel.unsubscribe()
//     }
//   }, [])

  const showCallbackModal = async(row, i) => {

    // console.log(clients[i])
    setGetIdPerCallback(i)

    try {
        const response = await axios.post('/api/changeCallbackStatus', {
            id: row.id
        })
        console.log(response)
        if(response.status == 200){
            setIsCallbackShow(true)
        }

    } catch (error) {
        console.log(error)
    }
  }

  const showCallbackModalProvider = async(row, i) => {

    console.log(row)

    setGetIdPerCallback(i)

    try {
        const response = await axios.post('/api/changeCallbackStatus', {
            id: row.id
        })
        console.log(response)
        if(response.status === 200){
            setIsCallbackforProviderShow(true)
        }



    } catch (error) {
        console.log(error)
    }
  }

  const handleDoneCallback = async(id) => {

    try {
        const response = await axios.post('/api/doneStatusCallback', {
            id: id
        })
        console.log(response)
        if(response.status == 200){
            Swal.fire({
                title: "Success",
                text: `Callback Request Completed at id ${id}`,
                icon: 'success'
            })
            setIsCallbackShow(false)
            setIsCallbackforProviderShow(false)
        }
    } catch (error) {
        console.log(error)
    }

  }

  const handleUnresponsive = async(id, failed_count, altEmail, email) => {

    setLoadingUnresponsive(true)
    try {
        const response = await axios.put('/api/unresponsiveCallback', {
            id: id,
            failed_count: failed_count,
            altEmail: altEmail,
            email: email
        })
        console.log(response)

        if(response.data.success){
            Swal.fire({
                title: "Callback Attempts",
                text: `${response.data.attempt}`,
                icon: 'info'
            })

            setIsCallbackforProviderShow(false)
            setIsCallbackShow(false)
            setLoadingUnresponsive(false)

        }

    } catch (error) {
        console.log(error)
    }
  }

  const disableUnresponsiveBtn = (date) => {
    const updateTime = new Date(date);
    const currentTime = new Date();

    return currentTime - updateTime <= 30000;
  }

  const viewProviderLaboratory = async(row) => {
    try {
      const reponse = await viewBy(row, 'view')
      // console.log(reponse);
      // return;

      if (!reponse.status) return

      setBody({
        title: row.memberID + ' - ' + row.lastName + ', ' + row.firstName,
        content: <ProcedureForm setRequest={setRequest} row={row} />,
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

  const viewProviderApproval = async(row) => {
    try {
      const reponse = await viewBy(row, 'view')
      // console.log(reponse);
      // return;

      if (!reponse.status) return

      setBody({
        title: row.memberID + ' - ' + row.lastName + ', ' + row.firstName,
        content: <ApprovalForm setRequest={setRequest} row={row} />,
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

  const showLoas = (row) => {
    setBody({
        title: row.memberID + ' - ' + row.lastName + ', ' + row.firstName,
        content: <ShowLoa row={row} />,
        modalOuterContainer: 'w-full h-full',
        //modalContainer: '',
        modalContainer: 'h-full',
        modalBody: 'h-full overflow-y-scroll',
      })
      toggle()
  }


  return (
    <ProviderLayout>
      <Head>
        <title>LLIBI PORTAL - ADMIN</title>
      </Head>
      {/* <video ref={videoRef} controls autoPlay muted className="hidden">
        <source src="/thepurge.mp3" type="audio/mpeg" />
      </video> */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Main form white background */}
          <div className="p-6 bg-white border-b border-gray-300 shadow-sm sm:rounded-lg">
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
              <div className="flex mb-5 gap-1 items-center justify-between">
                <div className="flex gap-1">
                  {[2, 3].includes(user?.user_level) && (
                    <>
                      <Button
                        type="button"
                        className="text-[.55em]"
                        onClick={handleShowModalSetDate}>
                        Export
                      </Button>
                      <Button
                        type="button"
                        className="text-[.55em]"
                        onClick={handleShowModalSetting}>
                        Settings
                      </Button>
                      <Button
                        type="button"
                        className="text-[.55em]"
                        onClick={handleShowLogs}>
                        Logs
                      </Button>
                      <a
                        className="text-blue-700 font-bold self-center capitalize border border-gray-300 px-3 py-2 rounded-md text-xs"
                        href="/search-masterlist"
                        target="_blank">
                        Search to masterlist
                      </a>
                      <a
                        className="text-blue-700 font-bold self-center capitalize border border-gray-300 px-3 py-2 rounded-md text-xs"
                        href="/manage-complaint"
                        target="_blank">
                        Complaints Management
                      </a>
                    </>
                  )}
                  <a
                    className="text-blue-700 font-bold self-center capitalize  border border-gray-300 px-3 py-2 rounded-md text-xs"
                    href="/complaint/error-logs"
                    target="_blank">
                    client portal error logs
                  </a>
                </div>
                <Button
                  type="button"
                  className="text-[.55em]"
                  onClick={handleShowModalViewPolicy}>
                  View/Upload Policy
                </Button>
              </div>
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
                    label="Default = Pending & Not Viewed"
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
              </div>

              <table className="table-auto w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-2 text-left">
                      Member ID
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      COMPANY/PROVIDER
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
                      Remaining
                    </th>
                    <th className="border border-gray-300 p-2 text-left">
                      D/T Created
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      PLATFORM
                    </th>
                    <th className="border border-gray-300 p-2 text-left w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {clients?.length > 0 ? (
                    clients?.map((row, i) =>{
                        // console.log(row)
                        return (
                            <tr
                              key={i}
                              className={`${
                                (row.status === 2 && 'bg-orange-50') ||
                                (row.status === 3 && 'bg-green-50') ||
                                (row.status === 4 && 'bg-red-100') ||
                                (row.status === 5 && 'bg-purple-100') ||
                                (row.status === 6 && 'bg-yellow-100') ||
                                (row.status === 7 && 'bg-blue-100') ||
                                (row.status === 9 && 'bg-deep-orange-50') ||
                                (row.status === 10 && 'bg-yellow-50')
                              }`}>
                              <td className="border border-gray-300 p-2 text-center">
                                {row.isDependent ? row.depMemberID : row.memberID}
                                {row.isDependent === null && row.memberID === null ? row.providerID : null}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {/* {row.company_name} */}
                                {row.loaType === "callback" ? row.providerName : row.company_name}
                                {row.loaType === "callback" && row.providerName === null ? row.company_name : null}
                              </td>
                              <td className="border border-gray-300 p-2 text-center">
                                {row.isDependent
                                  ? `${row.depLastName}, ${row.depFirstName}`
                                  : row.isDependent === null && row.lastName === null & row.firstName === null ? '-' : `${row.lastName}, ${row.firstName}`}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {/* {row.loaType.toUpperCase() || 'N/A'} */}
                                {row.loaType === "callback" && row.providerName ? (`${row.loaType} - Provider`).toUpperCase() : row.loaType === "callback" && row.providerName === null ? (`${row.loaType} - Member`).toUpperCase() : row.loaType.toUpperCase() || 'N/A'}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {row.status === 2 && 'Pending'}
                                {row.status === 3 && 'Approved LOA'}
                                {row.status === 4 && 'Disapproved'}
                                {row.status === 5 && 'Downloaded'}
                                {row.status === 6 && 'Not Viewed'}
                                {row.status === 7 && 'Approved Callback'}
                                {row.status === 9 && 'Pending Callback'}
                                {row.status === 10 && 'Failed Callback'}
                                {"\n"}
                                <span>

                                    {row?.total_remaining >= 1 && row?.is_complaint_has_approved == 1 && row.is_excluded == 1 ? "(Possible Exclusion)":
                                    row?.total_remaining >= 1 && row?.is_complaint_has_approved == 1 && row?.is_excluded == 0 ? "(System Approved)"  :
                                    row?.is_complaint_has_approved == 1 && row.is_excluded == 1 ? "(System Disapproved)" :
                                    row?.is_complaint_has_approved == 1 ? "(System Disapproved)" :
                                    ""
                                    }
                                </span>
                              </td>
                              <td className='border border-gray-300 p-2'>
                                {row.total_remaining <= 0 ? 0 : row.total_remaining}
                              </td>
                              <td className="border border-gray-300 p-2">
                                {row.createdAt}
                              </td>
                              <td className="border border-gray-300 p-2 text-center">
                                {row.platform === 'viber' ? "VIBER"
                                : row.platform === "qr" ? "QR"
                                : row.platform === "provider" ? "PROVIDER"
                                : "-"
                                }
                              </td>
                              <td className="border border-gray-300 p-2 text-center flex flex-col gap-2">
                                <a
                                  className="text-xs text-white px-2 py-1 rounded-sm cursor-pointer bg-blue-800 hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900"
                                  onClick={() => {
                                    row.loaType === "laboratory" && row.procedure_type === "Enumerate"
                                    ? viewProviderLaboratory(row)
                                    : row.loaType === "consultation" || row.loaType === "laboratory"
                                    ? view(row)
                                    : row.isDependent === null && row.memberID === null
                                    ? showCallbackModalProvider(row, i)
                                    : row.loaType === "approval" && row.platform == "provider"
                                    ? viewProviderApproval(row)
                                    : showCallbackModal(row, i)
                                  }}>
                                  VIEW
                                </a>
                                <a
                                    className='text-xs text-white px-2 py-1 rounded-sm cursor-pointer bg-green-800 hover:bg-green-700 active:bg-green-900 focus:outline-none focus:border-green-900'
                                    onClick={() => showLoas(row)}
                                    >
                                    LOAs
                                </a>
                              </td>
                            </tr>
                          )
                    })
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

        {isCallbackShow && (
          <div className='fixed inset-0 bg-white'>
            <div className='border-b p-2 grid grid-cols-3'>
                <h1 className='text-md text-black/70'>{clients[getIdPerCallback]?.memberID} - {clients[getIdPerCallback]?.lastName}, {clients[getIdPerCallback]?.firstName} </h1>
                <h1 className='font-bold text-center '>CALLBACK REQUEST - MEMBER CLIENT PORTAL</h1>
                <div className='flex justify-end'>
                    <h1 className='cursor-pointer ' onClick={() => setIsCallbackShow(false)}><FaXmark className='text-xl' /></h1>
                </div>
            </div>
            <div className='flex'>
                <div className='w-[50%] mt-10 px-5'>
                    <h1 className='text-xl font-bold text-center text-gray-700 '>EMPLOYEE DETAILS</h1>
                    <Label className="px-24 border-b mt-3 text-start ">
                        DATE/TIME CREATED: {' '} <span className='text-blue-500 '>{clients[getIdPerCallback]?.createdAt}</span>
                    </Label>
                    <Label className="px-24 border-b mt-3 text-start">
                        FULL NAME: {' '} <span className='text-blue-500 '>{clients[getIdPerCallback]?.lastName}, {clients[getIdPerCallback]?.firstName} </span>
                    </Label>
                    <Label className="px-24 border-b mt-3 text-start">
                        MEMBER ID: {' '} <span className='text-blue-500 '>{clients[getIdPerCallback]?.memberID} </span>
                    </Label>

                    <h1 className='text-xl font-bold text-center text-gray-700 mt-5'>CALLBACK DETAILS</h1>
                    <Label className="px-24 border-b mt-3 text-start ">
                        REMARKS: {' '} <span className='text-blue-500 '>{clients[getIdPerCallback]?.callback_remarks}</span>
                    </Label>
                    <Label className="px-24 border-b mt-3 text-start">
                        LANDLINE (OPTIONAL): {' '} <span className='text-blue-500 '>{clients[getIdPerCallback]?.opt_landline} </span>
                    </Label>
                    <Label className="px-24 border-b mt-3 text-start">
                        CONTACT #: {' '} <span className='text-blue-500 '>{clients[getIdPerCallback]?.contact} </span>
                    </Label>
                </div>
                <div className='border'></div>
                <div className='w-[50%] mt-10 px-5'>
                    <h1 className='text-xl font-bold text-center text-gray-700'>{clients[getIdPerCallback]?.status === 7 || clients[getIdPerCallback]?.status === 10 ? "" : "SET STATUS:"}</h1>
                    <div className={`${clients[getIdPerCallback]?.status === 7 || clients[getIdPerCallback]?.status === 10 ? "hidden" : "flex"} mt-5 flex-row justify-center items-center gap-3`}>
                    {clients[getIdPerCallback]?.failed_count < 3 &&
                            loadingUnresponsive
                            ? <h1 className='py-2 px-6 bg-red-800 rounded-full text-white hover:bg-red-900'>LOADING</h1>
                            : clients[getIdPerCallback]?.third_attempt_date !== null ? (
                                <>
                                <div>
                                    {disableUnresponsiveBtn(clients[getIdPerCallback]?.third_attempt_date) == false ? <button className='py-2 px-6 bg-red-800 rounded-full text-white hover:bg-red-900' onClick={() => handleUnresponsive(clients[getIdPerCallback]?.id, clients[getIdPerCallback]?.failed_count, clients[getIdPerCallback]?.altEmail, clients[getIdPerCallback]?.email)} >UNRESPONSIVE</button> : ""}
                                </div>
                                </>
                            )
                            : clients[getIdPerCallback]?.second_attempt_date !== null ? (
                                <>
                                <div>
                                    {disableUnresponsiveBtn(clients[getIdPerCallback]?.second_attempt_date) == false ? <button className='py-2 px-6 bg-red-800 rounded-full text-white hover:bg-red-900' onClick={() => handleUnresponsive(clients[getIdPerCallback]?.id, clients[getIdPerCallback]?.failed_count, clients[getIdPerCallback]?.altEmail, clients[getIdPerCallback]?.email)} >UNRESPONSIVE</button> : <button className='py-2 px-6 bg-gray-800 rounded-full text-white hover:bg-gray-900 cursor-not-allowed' >UNRESPONSIVE</button>}
                                </div>
                                </>
                            )
                            : clients[getIdPerCallback]?.first_attempt_date !== null ? (
                                <>
                                <div>
                                    {disableUnresponsiveBtn(clients[getIdPerCallback]?.first_attempt_date) == false ? <button className='py-2 px-6 bg-red-800 rounded-full text-white hover:bg-red-900' onClick={() => handleUnresponsive(clients[getIdPerCallback]?.id, clients[getIdPerCallback]?.failed_count, clients[getIdPerCallback]?.altEmail, clients[getIdPerCallback]?.email)} >UNRESPONSIVE</button> : <button className='py-2 px-6 bg-gray-800 rounded-full text-white hover:bg-gray-900 cursor-not-allowed' >UNRESPONSIVE</button>}
                                </div>
                                </>
                            )
                            : <button className='py-2 px-6 bg-red-800 rounded-full text-white hover:bg-red-900' onClick={() => handleUnresponsive(clients[getIdPerCallback]?.id, clients[getIdPerCallback]?.failed_count, clients[getIdPerCallback]?.altEmail, clients[getIdPerCallback]?.email)} >UNRESPONSIVE</button>}
                        <button className='py-2 px-6 bg-green-800 rounded-full text-white hover:bg-green-900' onClick={() => handleDoneCallback(clients[getIdPerCallback]?.id)}>DONE</button>
                    </div>
                    <div className='text-center mt-2'>
                    <Label className='px-24  mt-3 text-center'>
                        CURRENT STATUS: {' '} <span className={`${clients[getIdPerCallback]?.status === 10 ? "text-red-500" : clients[getIdPerCallback]?.status === 7 ? "text-blue-500" : "text-green-500"}`}>{clients[getIdPerCallback]?.status === 9 && "PENDING CALLBACK"}
                        {clients[getIdPerCallback]?.status === 6 && "NOT VIEWED"}
                        {clients[getIdPerCallback]?.status === 7 && "APPROVED CALLBACK"}
                        {clients[getIdPerCallback]?.status === 10 && "FAILED CALLBACK"}
                        </span>
                        </Label>
                        <h1 className='font-bold text-sm text-gray-700 cursor-pointer'>FAILED COUNT: <span className='text-red-500'>{clients[getIdPerCallback]?.failed_count}</span></h1>
                        <div>
                            {clients[getIdPerCallback]?.first_attempt_date !== null && <Label>FIRST ATTEMPT: <span className='text-red-500'>{clients[getIdPerCallback]?.first_attempt_date}</span></Label>}
                            {clients[getIdPerCallback]?.second_attempt_date !== null && <Label className='font-bold text-sm text-gray-700 cursor-pointer'>SECOND ATTEMPT: <span className='text-red-500'>{clients[getIdPerCallback]?.second_attempt_date}</span></Label>}
                            {clients[getIdPerCallback]?.third_attempt_date !== null && <Label className='font-bold text-sm text-gray-700 cursor-pointer'>THIRD ATTEMPT: <span className='text-red-500'>{clients[getIdPerCallback]?.third_attempt_date}</span></Label>}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {isCallbackforProviderShow && (
            <div className='fixed inset-0 bg-white'>
                <div className='border-b p-2 grid grid-cols-3'>
                    {/* <h1 className='text-md text-black/70'>Provider ID: {getCallbackforProviderDetails.providerID}</h1> */}
                    <div></div>
                    <h1 className='font-bold text-center'>CALLBACK REQUEST - PROVIDER PORTAL</h1>
                    <div className='flex justify-end'>
                        <h1 className='cursor-pointer ' onClick={() => setIsCallbackforProviderShow(false)}><FaXmark className='text-xl' /></h1>
                    </div>
                </div>
                <div className='flex'>
                    <div className='w-[50%] mt-10 px-5'>
                        <h1 className='text-xl font-bold text-center text-gray-700'>PROVIDER DETAILS</h1>
                        <Label className="px-24 border-b mt-3 text-start ">
                        DATE/TIME CREATED: {' '} <span className='text-blue-500 '>{clients[getIdPerCallback]?.createdAt}</span>
                        </Label>
                        {/* <Label className='px-24 border-b mt-3 text-start'>
                        PROVIDER ID: {' '} <span className='text-blue-500 '>{getCallbackforProviderDetails.providerID} </span>
                        </Label> */}
                        <Label className='px-24 border-b mt-3 text-start'>
                        PROVIDER: {' '} <span className='text-blue-500 '>{clients[getIdPerCallback]?.providerName?.toUpperCase()} </span>
                        </Label>
                        <Label className='px-24 border-b mt-3 text-start'>
                        EMAIL: {' '} <span className='text-blue-500 '>{clients[getIdPerCallback]?.email?.toUpperCase()} </span>
                        </Label>
                        <Label className='px-24 border-b mt-3 text-start'>
                        CONTACT: {' '} <span className='text-blue-500 '>{clients[getIdPerCallback]?.contact} </span>
                        </Label>
                        <Label className='px-24 border-b mt-3 text-start'>
                        LANDLINE: {' '} <span className='text-blue-500 '>{clients[getIdPerCallback]?.landline} </span>
                        </Label>

                        <h1 className='text-xl font-bold text-center text-gray-700 mt-5'>CALLBACK DETAILS</h1>
                        <Label className="px-24 border-b mt-3 text-start ">
                        REMARKS: {' '} <span className='text-blue-500 '>{clients[getIdPerCallback]?.callback_remarks}</span>
                        </Label>
                        <Label className='px-24 border-b mt-3 text-start'>
                        ALTERNATIVE CONTACT: {' '} <span className='text-blue-500 '>{clients[getIdPerCallback]?.opt_contact || "-"} </span>
                        </Label>
                        <Label className='px-24 border-b mt-3 text-start'>
                        ALTERNATIVE LANDLINE: {' '} <span className='text-blue-500 '>{clients[getIdPerCallback]?.opt_landline || "-"} </span>
                        </Label>
                        <Label className='px-24 border-b mt-3 text-start'>
                        ALTERNATIVE EMAIL: {' '} <span className='text-blue-500 '>{clients[getIdPerCallback]?.altEmail?.toUpperCase() || "-"} </span>
                        </Label>


                    </div>
                    <div className='border'></div>
                    <div className='w-[50%] mt-10 px-5'>
                        <h1 className='text-xl font-bold text-center text-gray-700'>{clients[getIdPerCallback]?.status === 7 || clients[getIdPerCallback]?.status === 10 ? "" : "SET STATUS:"}</h1>
                        <div className={`${clients[getIdPerCallback]?.status === 7 || clients[getIdPerCallback]?.status === 10 ? "hidden" : "flex"}  mt-3 flex-row justify-center items-center gap-3`}>

                            {clients[getIdPerCallback]?.failed_count < 3 &&
                            loadingUnresponsive
                            ? <h1 className='py-2 px-6 bg-red-800 rounded-full text-white hover:bg-red-900'>LOADING</h1>
                            : clients[getIdPerCallback]?.third_attempt_date !== null ? (
                                <>
                                <div>
                                    {disableUnresponsiveBtn(clients[getIdPerCallback]?.third_attempt_date) == false ? <button className='py-2 px-6 bg-red-800 rounded-full text-white hover:bg-red-900' onClick={() => handleUnresponsive(clients[getIdPerCallback]?.id, clients[getIdPerCallback]?.failed_count, clients[getIdPerCallback]?.altEmail, clients[getIdPerCallback]?.email)} >UNRESPONSIVE</button> : ""}
                                </div>
                                </>
                            )
                            : clients[getIdPerCallback]?.second_attempt_date !== null ? (
                                <>
                                <div>
                                    {disableUnresponsiveBtn(clients[getIdPerCallback]?.second_attempt_date) == false ? <button className='py-2 px-6 bg-red-800 rounded-full text-white hover:bg-red-900' onClick={() => handleUnresponsive(clients[getIdPerCallback]?.id, clients[getIdPerCallback]?.failed_count, clients[getIdPerCallback]?.altEmail, clients[getIdPerCallback]?.email)} >UNRESPONSIVE</button> : <button className='py-2 px-6 bg-gray-800 rounded-full text-white hover:bg-gray-900 cursor-not-allowed' >UNRESPONSIVE</button>}
                                </div>
                                </>
                            )
                            : clients[getIdPerCallback]?.first_attempt_date !== null ? (
                                <>
                                <div>
                                    {disableUnresponsiveBtn(clients[getIdPerCallback]?.first_attempt_date) == false ? <button className='py-2 px-6 bg-red-800 rounded-full text-white hover:bg-red-900' onClick={() => handleUnresponsive(clients[getIdPerCallback]?.id, clients[getIdPerCallback]?.failed_count, clients[getIdPerCallback]?.altEmail, clients[getIdPerCallback]?.email)} >UNRESPONSIVE</button> : <button className='py-2 px-6 bg-gray-800 rounded-full text-white hover:bg-gray-900 cursor-not-allowed' >UNRESPONSIVE</button>}
                                </div>
                                </>
                            )
                            : <button className='py-2 px-6 bg-red-800 rounded-full text-white hover:bg-red-900' onClick={() => handleUnresponsive(clients[getIdPerCallback]?.id, clients[getIdPerCallback]?.failed_count, clients[getIdPerCallback]?.altEmail, clients[getIdPerCallback]?.email)} >UNRESPONSIVE</button>}


                            {clients[getIdPerCallback]?.failed_count !== 3 && <button className='py-2 px-6 bg-green-800 rounded-full text-white hover:bg-green-900' onClick={() => handleDoneCallback(clients[getIdPerCallback]?.id)}>DONE</button>}
                        </div>
                    <div className='text-center mt-2'>
                        <Label className='px-24  mt-3 text-center'>
                        CURRENT STATUS: {' '} <span className={`${clients[getIdPerCallback]?.status === 10 ? "text-red-500" : clients[getIdPerCallback]?.status === 7 ? "text-blue-500" : "text-green-500"}`}>{clients[getIdPerCallback]?.status === 9 && "PENDING CALLBACK"}
                        {clients[getIdPerCallback]?.status === 6 && "NOT VIEWED"}
                        {clients[getIdPerCallback]?.status === 7 && "APPROVED CALLBACK"}
                        {clients[getIdPerCallback]?.status === 10 && "FAILED CALLBACK"}
                        </span>
                        </Label>
                        <h1 className='font-bold text-sm text-gray-700 cursor-pointer'>FAILED COUNT: <span className='text-red-500'>{clients[getIdPerCallback]?.failed_count}</span></h1>
                        <div>
                            {clients[getIdPerCallback]?.first_attempt_date !== null && <Label>FIRST ATTEMPT: <span className='text-red-500'>{clients[getIdPerCallback]?.first_attempt_date}</span></Label>}
                            {clients[getIdPerCallback]?.second_attempt_date !== null && <Label className='font-bold text-sm text-gray-700 cursor-pointer'>SECOND ATTEMPT: <span className='text-red-500'>{clients[getIdPerCallback]?.second_attempt_date}</span></Label>}
                            {clients[getIdPerCallback]?.third_attempt_date !== null && <Label className='font-bold text-sm text-gray-700 cursor-pointer'>THIRD ATTEMPT: <span className='text-red-500'>{clients[getIdPerCallback]?.third_attempt_date}</span></Label>}
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        )}

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
