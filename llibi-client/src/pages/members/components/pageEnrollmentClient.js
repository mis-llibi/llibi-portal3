import { useState, useEffect } from 'react'

import { useManageEnrollee } from '@/hooks/members/ManageEnrollee'

import ModalInsertEnrollee from '@/pages/members/components/modalInsertEnrollee'
import ModalUploadEnrollee from '@/pages/members/components/modalUploadEnrollee'
import ModalUpdateEnrollee from '@/pages/members/components/modalUpdateEnrollee'
import ModalViewEnrollee from '@/pages/members/components/modalViewEnrollee'
import ModalMemberCorrection from '@/pages/members/components/modalMemberCorrection'

import Swal from 'sweetalert2'

import { SlPencil, SlBan, SlEye, SlPeople } from 'react-icons/sl'
import Button from '@/components/Button'

// import DataGrid from '@/components/DataGrid'
import { DataGrid } from '@mui/x-data-grid'
import ManualInsertEnrollee from './broadpath/ManualInsertEnrollee'
import NewEnrolleeTable from './broadpath/NewEnrolleeTable'
import ManualUpdateEnrollee from './broadpath/ManualUpdateEnrollee'
import axios from '@/lib/axios'

const pageEnrollmentClient = ({ props }) => {
  const [status, setStatus] = useState()

  const {
    enrollees,
    upload,
    create,
    update,
    remove,
    forEnrollment,
    forCancellation,
    revokeCancellation,
    forMemberCorrection,
    revokeCorrection,
    submitForEnrollmentHooks
  } = useManageEnrollee({ selection: props?.selection })

  //ENROLLEES
  const uploadEnrollee = () => {
    props?.setBody({
      title: 'Upload Excel File to Masterlist',
      content: (
        <ModalUploadEnrollee
          upload={upload}
          loading={props?.loading}
          setLoading={props?.setLoading}
          setShow={props?.setShow}
        />
      ),
      modalOuterContainer: 'w-full lg:w-3/6 max-h-screen',
      modalContainer: 'h-full',
      modalBody: 'h-full',
    })
    props?.toggle()
  }

  const insertEnrollee = () => {
    props?.setBody({
      title: 'New Transaction',
      content: (
        <ManualInsertEnrollee
          create={create}
          loading={props?.loading}
          setLoading={props?.setLoading}
          setShow={props?.setShow}
        />
      ),
      modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
      modalContainer: 'h-full',
      modalBody: 'h-full',
    })
    props?.toggle()
  }

  const updateEnrollee = row => {
    props?.setBody({
      title: 'Update Enrollee',
      content: (
        <ManualUpdateEnrollee
          loading={props?.loading}
          setLoading={props?.setLoading}
          setShow={props?.setShow}
          data={row}
        />
      ),
      modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
      modalContainer: 'h-full',
      modalBody: 'h-full',
    })
    props?.toggle()
  }

  const editEnrollee = data => {
    props?.setBody({
      title: `Edit Enrollee: ${data?.first_name + ' ' + data?.last_name}`,
      content: (
        <ModalUpdateEnrollee
          data={data}
          update={update}
          loading={props?.loading}
          setLoading={props?.setLoading}
          setShow={props?.setShow}
        />
      ),
      modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
      modalContainer: 'h-full',
      modalBody: 'h-full',
    })
    props?.toggle()
  }

  const deleteEnrollee = data => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (result.isConfirmed) {
        props?.setLoading(true)
        remove({ ...data, setLoading: props?.setLoading })
      }
    })
  }

  const submitForEnrollment = () => {
    if (selectionModel.length) {
      //console.log(selectionModel)
      Swal.fire({
        title: 'Are you sure?',
        text:
          "You are submitting these members for enrollment, you won't be able to revert this and you will need a request if you have modification to these members in the future",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit it!',
      }).then(result => {
        if (result.isConfirmed) {
          props?.setLoading(true)
          forEnrollment({
            selected: selectionModel,
            setLoading: props?.setLoading,
          })
        }
      })
    } else {
      Swal.fire(
        'No Selected Enrollee',
        "You haven't selected an enrollee, pelase select by ticking checkbox then continue",
        'question',
      )
    }
  }

  const viewEnrollee = data => {
    props?.setBody({
      title: `Viewing Information of: ${
        data?.first_name + ' ' + data?.last_name
      }`,
      content: (
        <ModalViewEnrollee
          data={data}
          update={update}
          loading={props?.loading}
          setLoading={props?.setLoading}
          setShow={props?.setShow}
        />
      ),
      modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
      modalContainer: 'h-full',
      modalBody: 'h-full',
    })
    props?.toggle()
  }

  const memberCorrection = data => {
    props?.setBody({
      title: `Member For Correction: ${
        data?.first_name + ' ' + data?.last_name
      }`,
      content: (
        <ModalMemberCorrection
          data={data}
          forMemberCorrection={forMemberCorrection}
          loading={props?.loading}
          setLoading={props?.setLoading}
          setShow={props?.setShow}
        />
      ),
      modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
      modalContainer: 'h-full',
      modalBody: 'h-full',
    })
    props?.toggle()
  }

  //MEMBERS
  const submitForCancellation = () => {
    if (selectionModel.length) {
      //console.log(selectionModel)
      Swal.fire({
        title: 'Are you sure?',
        text:
          "You are submitting these members for cancellation, once approved by the LLIBI officer you won't be able to revert this action",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, submit for cancellation',
      }).then(result => {
        if (result.isConfirmed) {
          props?.setLoading(true)
          forCancellation({
            selected: selectionModel,
            setLoading: props?.setLoading,
          })
        }
      })
    } else {
      Swal.fire(
        'No Selected Member',
        "You haven't selected a member, pelase select by ticking checkbox then continue",
        'question',
      )
    }
  }

  const revokeForCancellation = () => {
    if (selectionModel.length) {
      //console.log(selectionModel)
      Swal.fire({
        title: 'Are you sure?',
        text: 'You are revoking these members cancellation',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, revoke cancellation',
      }).then(result => {
        if (result.isConfirmed) {
          props?.setLoading(true)
          revokeCancellation({
            selected: selectionModel,
            setLoading: props?.setLoading,
          })
        }
      })
    } else {
      Swal.fire(
        'No Selected Member',
        "You haven't selected a member, pelase select by ticking checkbox then continue",
        'question',
      )
    }
  }

  const revokeForCorrection = () => {
    if (selectionModel.length) {
      //console.log(selectionModel)
      Swal.fire({
        title: 'Are you sure?',
        text: 'You are revoking these members correction',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, revoke correction',
      }).then(result => {
        if (result.isConfirmed) {
          props?.setLoading(true)
          revokeCorrection({
            selected: selectionModel,
            setLoading: props?.setLoading,
          })
        }
      })
    } else {
      Swal.fire(
        'No Selected Member',
        "You haven't selected a member, pelase select by ticking checkbox then continue",
        'question',
      )
    }
  }

  const exportLateEnrolled = () => {
    window.open(
      `${process.env.backEndUrl}/api/export-enrolled?status=${status}`,
      '_blank',
    )
  }

  //DATA GRID COLUMN HEADER
  const [selectionModel, setSelectionModel] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const handlePageSizeChange = data => {
    setPageSize(data)
  }

  const handleSubmitForEnrollment = async () => {
    await submitForEnrollmentHooks(selectionModel)
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 50, hide: true },
    {
      field: 'employee_no',
      headerName: 'Emp No.',
      width: 100,
    },
    {
      field: 'fullname',
      headerName: 'Name',
      // width: 100,
      flex: 1,
      renderCell: ({ row }) => {
        return `${row.last_name}, ${row.first_name}`
      },
    },
    // {
    //   field: 'last_name',
    //   headerName: 'Last Name',
    //   width: 160,
    // },
    // {
    //   field: 'first_name',
    //   headerName: 'First Name',
    //   width: 160,
    // },
    {
      field: 'birth_date',
      headerName: 'Birth Date',
      width: 100,
    },
    {
      field: 'relationship_id',
      headerName: 'Relation',
      width: 110,
    },
    {
      field: 'reg_date',
      headerName: 'Regular',
      width: 100,
    },
    {
      field: 'effective_date',
      headerName: 'Effective',
      width: 100,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      width: 100,
      align: 'center',
      renderCell: ({ row }) => {
        if (props?.selection == 1) {
          //If pending enrollment show edit & delete
          return (
            <>
              <SlPencil
                className="cursor-pointer text-3xl bg-green-200 hover:bg-green-400 p-1 rounded-md mr-2 transition duration-200"
                onClick={() => editEnrollee(row)}
                title="Edit Enrollee"
              />
              <SlBan
                className="cursor-pointer text-3xl bg-red-200 hover:bg-red-400 p-1 rounded-md transition duration-200"
                onClick={() => deleteEnrollee(row)}
                title="Delete Enrollee"
              />
            </>
          )
        } else if (
          props?.selection == 3 ||
          props?.selection == 6 ||
          props?.selection == 8 ||
          props?.selection == 9
        ) {
          //Deletions & Pending
          return (
            <>
              <SlEye
                className="cursor-pointer text-3xl bg-blue-200 hover:bg-blue-400 p-1 rounded-md transition duration-200"
                onClick={() => viewEnrollee(row)}
                title="View Member Info"
              />
            </>
          )
        } else if (props?.selection == 4 || props?.selection == 7) {
          //Enrolled
          return (
            <>
              <SlEye
                className="cursor-pointer text-3xl bg-blue-200 hover:bg-blue-400 p-1 rounded-md transition duration-200 mr-2"
                onClick={() => viewEnrollee(row)}
                title="View Member Info"
              />
              <SlPeople
                className="cursor-pointer text-3xl bg-green-200 hover:bg-green-400 p-1 rounded-md transition duration-200"
                onClick={() => memberCorrection(row)}
                title="Member Correction"
              />
            </>
          )
        } else if (props?.selection == 101) {
          //Enrolled
          return (
            <>
              <SlEye
                className="cursor-pointer text-3xl bg-blue-200 hover:bg-blue-400 p-1 rounded-md transition duration-200 mr-2"
                onClick={() => editEnrollee(row)}
                title="View Member Info"
              />
            </>
          )
        }
      },
    },
  ]

  useEffect(() => {
    setStatus(props?.selection)
  }, [props?.selection])

  return (
    <div className="py-2">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          {/* PENDING ENROLLMENT BOX */}
          <div className={`px-3 pt-3 ${status == 1 || 'hidden'}`}>
            {/* <Button
              onClick={uploadEnrollee}
              className="mr-2 bg-blue-400 hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 ring-blue-200 mb-2 md:mb-0 w-full md:w-auto"
              disabled={props?.loading}>
              Batch Upload Enrollee
            </Button> */}
            <div className="flex justify-between">
              <Button
                onClick={insertEnrollee}
                className="mr-2 bg-blue-400 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-700 ring-blue-200 mb-2 md:mb-0 w-full md:w-auto"
                disabled={props?.loading}>
                New Transaction
              </Button>
              <Button
                onClick={handleSubmitForEnrollment}
                className="mr-2 bg-orange-400 hover:bg-orange-700 focus:bg-orange-700 active:bg-orange-700 ring-orange-200 mb-2 md:mb-0 w-full md:w-auto"
                disabled={props?.loading}>
                Submit for Enrollment
              </Button>
            </div>
            {/* <Button
              onClick={exportLateEnrolled}
              className="mr-2 bg-green-400 hover:bg-green-600 focus:bg-green-600 active:bg-green-700 ring-green-200 mb-2 md:mb-0 w-full md:w-auto"
              disabled={props?.loading}>
              Export Pending Enrollment
            </Button> */}

            {/* <Button
              onClick={submitForEnrollment}
              className="bg-orange-400 hover:bg-orange-700 focus:bg-orange-700 active:bg-orange-700 ring-orange-200 md:float-right mb-2 md:mb-0 w-full  md:w-auto"
              disabled={props?.loading}>
              Submit for Enrollment
            </Button> */}
          </div>

          {/* FOR MEMBERS ENROLLED BOX */}
          <div className={`px-3 pt-3 ${status == 4 || 'hidden'}`}>
            <Button
              onClick={submitForCancellation}
              className="bg-red-400 hover:bg-red-700 focus:bg-red-700 active:bg-red-700 ring-red-200 md:float-right mb-2 md:mb-0 w-full md:w-auto"
              disabled={props?.loading}>
              Submit for Cancellation
            </Button>
            <div className="clear-both"></div>
          </div>

          {/* FOR CANCELLATION BOX */}
          <div className={`px-3 pt-3 ${status == 8 || 'hidden'}`}>
            <Button
              onClick={revokeForCancellation}
              className="bg-red-400 hover:bg-red-700 focus:bg-red-700 active:bg-red-700 ring-red-200 md:float-right mb-2 md:mb-0 w-full md:w-auto"
              disabled={props?.loading}>
              Revoke Cancellation
            </Button>
            <div className="clear-both"></div>
          </div>

          {/* FOR CORRECTION BOX */}
          <div className={`px-3 pt-3 ${status == 7 || 'hidden'}`}>
            <Button
              onClick={revokeForCorrection}
              className="bg-red-400 hover:bg-red-700 focus:bg-red-700 active:bg-red-700 ring-red-200 md:float-right mb-2 md:mb-0 w-full md:w-auto"
              disabled={props?.loading}>
              Revoke Correction
            </Button>
            <div className="clear-both"></div>
          </div>

          {/* LATE ENROLLED */}
          <div className={`px-3 pt-3 ${status == 101 || 'hidden'}`}>
            <Button
              onClick={exportLateEnrolled}
              className="mr-2 bg-green-400 hover:bg-green-600 focus:bg-green-600 active:bg-green-700 ring-green-200 mb-2 md:mb-0 w-full md:w-auto"
              disabled={props?.loading}>
              Export Late Enrolled
            </Button>
          </div>

          {/* MAIN DATA GRID TABLE */}
          <div className="h-96 min-h-screen p-3 bg-white border-b border-gray-200">
            {/* <DataGrid
              data={enrollees?.list}
              columns={columns}
              selectionModel={selectionModel}
              setSelectionModel={setSelectionModel}
            /> */}

            {status == 1 ? (
              // pending for submittion
              <NewEnrolleeTable
                data={enrollees?.new_enrollee || []}
                updateEnrollee={updateEnrollee}
                selectionModel={selectionModel}
                setSelectionModel={setSelectionModel}
              />
            ) : (
              <DataGrid
                rows={enrollees?.list || []}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                rowsPerPageOptions={[10, 25, 50, 100]}
                disableSelectionOnClick
                checkboxSelection
                selectionModel={selectionModel}
                onSelectionModelChange={setSelectionModel}
                components={{
                  NoResultsOverlay: () => (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-lg font-semibold text-red-400">
                      <div>No result found in your filter</div>
                    </div>
                  ),
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default pageEnrollmentClient
