import React, { useEffect, useState } from 'react'

import { DataGrid } from '@mui/x-data-grid'

import { SlPencil, SlBan, SlEye, SlPeople } from 'react-icons/sl'
import { BiPlus, BiSend, BiTrashAlt } from 'react-icons/bi'

import {
  useManageHrMember,
  submitForEnrollmentHooks,
} from '@/hooks/members/ManageHrMember'
import Button from '@/components/Button'
import ManualInsertEnrollee from './ManualInsertEnrollee'
import Swal from 'sweetalert2'
import ManualUpdateEnrollee from './ManualUpdateEnrollee'
import Loader from '@/components/Loader'
import axios from '@/lib/axios'

export default function ApprovedMember({ create, ...props }) {
  const [selectionModel, setSelectionModel] = useState([])
  const { data, isLoading, error, mutate } = useManageHrMember({ status: 4 })
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
              onClick={() => handleDelete(row)}
              className="group border px-3 py-2 rounded-md hover:bg-gray-200"
              title="Delete Enrollee">
              <SlBan className="text-lg" />
            </button>
          </div>
        )
      },
    },
  ]

  const handleSubmitForDeletion = async () => {
    setLoader(true)
    setLoader(false)
  }

  if (error) return <h1>Something went wrong.</h1>
  if (isLoading) return <h1>Loading...</h1>

  return (
    <>
      {/* PENDING ENROLLMENT BOX */}
      <div className="mb-3">
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitForDeletion}
            className="bg-blue-400 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-700 ring-blue-200 mb-2 md:mb-0 w-full md:w-auto flex gap-1"
            disabled={selectionModel.length <= 0}>
            <BiTrashAlt size={16} />
            <span>Approved Members</span>
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
