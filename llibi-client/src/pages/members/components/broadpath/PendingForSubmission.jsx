import React, { useEffect, useState } from 'react'

import { DataGrid } from '@mui/x-data-grid'

import { SlPencil, SlBan, SlEye, SlPeople } from 'react-icons/sl'
import { BiPlus, BiSend, BiUpload } from 'react-icons/bi'

import {
  useManageHrMember,
  submitForEnrollmentHooks,
} from '@/hooks/members/ManageHrMember'
import Button from '@/components/Button'
import ManualInsertEnrollee from './ManualInsertEnrollee'
import Swal from 'sweetalert2'
import ManualUpdateEnrollee from './ManualUpdateEnrollee'
import Loader from '@/components/Loader'

export default function PendingForSubmission({ create, ...props }) {
  const [selectionModel, setSelectionModel] = useState([])
  const { data, isLoading, error, mutate } = useManageHrMember({ status: 1 })
  const [loader, setLoader] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const handlePageSizeChange = data => {
    setPageSize(data)
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
            <div>
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
    },
    {
      field: 'gender',
      headerName: 'Gender',
      width: 100,
    },
    {
      field: 'relationship_id',
      headerName: 'Relation',
      width: 150,
    },
    {
      field: 'civil_status',
      headerName: 'Civil Status',
      width: 300,
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      width: 100,
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <div className="flex gap-1">
            {/* <button
              className="group border px-3 py-2 rounded-md hover:bg-gray-200"
              title="Edit Enrollee"
              onClick={() => updateEnrollee(row)}>
              <SlPencil className="text-lg" />
            </button> */}
            <button
              className="group border px-3 py-2 rounded-md hover:bg-gray-200"
              title="Delete Enrollee">
              <SlBan className="text-lg" />
            </button>
          </div>
        )
      },
    },
  ]

  const insertEnrollee = () => {
    props?.setBody({
      title: 'New Transaction',
      content: (
        <ManualInsertEnrollee
          create={create}
          loading={props?.loading}
          setLoading={props?.setLoading}
          setShow={props?.setShow}
          mutate={mutate}
        />
      ),
      modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
      modalContainer: 'h-full',
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
      <div className="mb-3">
        <div className="flex justify-between">
          <Button
            onClick={insertEnrollee}
            className="bg-blue-400 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-700 ring-blue-200 mb-2 md:mb-0 w-full md:w-auto flex gap-1"
            disabled={props?.loading}>
            <BiPlus size={16} />
            <span>New Transaction</span>
          </Button>
          <Button
            onClick={handleSubmitForEnrollment}
            className="bg-orange-400 hover:bg-orange-700 focus:bg-orange-700 active:bg-orange-700 ring-orange-200 mb-2 md:mb-0 w-full md:w-auto flex gap-1"
            disabled={selectionModel.length <= 0}>
            <BiUpload size={16} />
            <span>Submit for Enrollment</span>
          </Button>
        </div>
      </div>

      <DataGrid
        rows={data || []}
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

      <Loader loading={loader} />
    </>
  )
}
