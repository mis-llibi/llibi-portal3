import React, { useEffect, useState } from 'react'

import { DataGrid } from '@mui/x-data-grid'

import { SlPencil, SlBan, SlEye, SlPeople } from 'react-icons/sl'
import { BiPlus, BiSend, BiUpload } from 'react-icons/bi'

import {
  useManageHrMember,
  submitForEnrollmentHooks,
} from '@/hooks/members/ManageHrMember'
import Button from '@/components/Button'
import ManualInsertEnrollee from '../../ManualInsertEnrollee'
import Swal from 'sweetalert2'
import ManualUpdateEnrollee from '../../ManualUpdateEnrollee'
import Loader from '@/components/Loader'
import axios from '@/lib/axios'
import Label from '@/components/Label'
import moment from 'moment'

export default function PendingForApproval({ create, ...props }) {
  const [selectionModel, setSelectionModel] = useState([])
  const { data, isLoading, error, mutate } = useManageHrMember({
    status: '1,3,5,8',
  })
  const [loader, setLoader] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const handlePageSizeChange = data => {
    setPageSize(data)
  }

  const handleDelete = async row => {
    setLoader(true)
    try {
      const response = await axios.delete(
        `/api/members-enrollment/delete-pending/${row.id}`,
      )

      mutate()
      setLoader(false)
    } catch (error) {
      setLoader(false)
      Swal.fire('Error', 'Something went wrong.', 'error')
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 50, hide: true },
    {
      field: 'member_id',
      headerName: 'Name',
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <>
            <div className="font-[poppins]">
              <span className="text-green-600 text-[.75rem]">
                {row.member_id}
              </span>
              <br />
              <span>{`${row.last_name}, ${row.first_name} ${row.middle_name}`}</span>
            </div>
          </>
        )
      },
    },
    {
      field: 'birth_date',
      headerName: 'Birth Date',
      width: 150,
      renderCell: ({ row }) => {
        return (
          <>
            <div className="font-[poppins]">
              {row.birth_date ? moment(row.birth_date).format('MMM DD, Y') : ''}
            </div>
          </>
        )
      },
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 100,
      renderCell: ({ row }) => {
        return (
          <>
            <div className="font-[poppins]">{row.gender}</div>
          </>
        )
      },
    },
    {
      field: 'relationship_id',
      headerName: 'Relation',
      width: 150,
      renderCell: ({ row }) => {
        return (
          <>
            <div className="font-[poppins]">{row.relationship_id}</div>
          </>
        )
      },
    },
    {
      field: 'civil_status',
      headerName: 'Civil Status',
      width: 150,
      renderCell: ({ row }) => {
        return (
          <>
            <div className="font-[poppins]">{row.civil_status}</div>
          </>
        )
      },
    },
    {
      field: 'status_name',
      headerName: 'Status',
      width: 150,
      renderCell: ({ row }) => {
        return (
          <>
            <div className="font-[poppins] text-[9px]">
              <span className="bg-blue-100 text-blue-600 font-bold px-2 py-1 rounded-md uppercase">
                {row.status_name}
              </span>
            </div>
          </>
        )
      },
    },
    // {
    //   field: 'action',
    //   headerName: '',
    //   sortable: false,
    //   width: 100,
    //   align: 'center',
    //   renderCell: ({ row }) => {
    //     return (
    //       <div className="flex gap-1">
    //         {/* <button
    //           className="group border px-3 py-2 rounded-md hover:bg-gray-200"
    //           title="Edit Enrollee"
    //           onClick={() => updateEnrollee(row)}>
    //           <SlPencil className="text-lg" />
    //         </button> */}
    //         <button
    //           onClick={() => handleDelete(row)}
    //           className="group border px-3 py-2 rounded-md hover:bg-gray-200"
    //           title="Delete Enrollee">
    //           <SlBan className="text-lg" />
    //         </button>
    //       </div>
    //     )
    //   },
    // },
  ]

  const insertEnrollee = () => {
    props?.setBody({
      title: 'New Transaction',
      content: (
        <ManualInsertEnrollee
          create={create}
          loading={loader}
          setLoader={setLoader}
          setShow={props?.setShow}
          mutate={mutate}
        />
      ),
      modalOuterContainer: 'w-full md:w-4/6 max-h-screen font-[poppins]',
      modalContainer: 'h-full rounded-md',
      modalBody: 'h-full',
    })
    props?.toggle()
  }

  const handleSubmitForEnrollment = async () => {
    if (selectionModel.length <= 0) {
      Swal.fire('Error', 'Please select enrollee first.', 'error')
      return
    }
    setLoader(true)
    await submitForEnrollmentHooks(selectionModel)
    mutate()
    setLoader(false)
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
          mutate={mutate}
        />
      ),
      modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
      modalContainer: 'h-full',
      modalBody: 'h-full',
    })
    props?.toggle()
  }

  if (error) return <h1>Something went wrong.</h1>
  if (isLoading) return <h1>Loading...</h1>

  return (
    <>
      {/* PENDING ENROLLMENT BOX */}
      <div className="mb-3 font-[poppins]">
        <div className="flex justify-end">
          <Button
            onClick={insertEnrollee}
            className="bg-blue-400 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-700 ring-blue-200 mb-2 md:mb-0 w-full md:w-auto flex gap-1"
            disabled={props?.loading}>
            <BiPlus size={16} />
            <span>New Transaction</span>
          </Button>
          {/* <Button
            onClick={handleSubmitForEnrollment}
            className="bg-orange-400 hover:bg-orange-700 focus:bg-orange-700 active:bg-orange-700 ring-orange-200 mb-2 md:mb-0 w-full md:w-auto flex gap-1"
            disabled={selectionModel.length <= 0}>
            <BiUpload size={16} />
            <span>Submit for Enrollment</span>
          </Button> */}
        </div>
        <div className="w-full">
          <Label htmlFor="search">Seach</Label>
          <input
            type="text"
            id="search"
            className="w-full rounded-md"
            placeholder="Seach (ex. first name, last name)"
          />
        </div>
      </div>

      <DataGrid
        sx={{
          '.MuiDataGrid-columnHeaderTitle': {
            fontFamily: 'poppins !important',
            fontWeight: 'bold',
          },
        }}
        rows={data || []}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        rowsPerPageOptions={[10, 25, 50, 100]}
        disableSelectionOnClick
        autoHeight
        // checkboxSelection
        // selectionModel={selectionModel}
        // onSelectionModelChange={setSelectionModel}
        components={{
          NoResultsOverlay: () => (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-lg font-semibold text-red-400">
              <div>No result found in your filter</div>
            </div>
          ),
        }}
      />

      <Loader loading={loader} />
    </>
  )
}
