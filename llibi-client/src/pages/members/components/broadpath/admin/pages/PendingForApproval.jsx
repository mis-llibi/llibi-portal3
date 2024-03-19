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

import { ActionButtonAdmin } from '@/components/boradpath/hris/ActionButton'
import ApproveChangeMemberPlan from '@/components/boradpath/hris/modals/admin/ApproveChangeMemberPlan'
import ApprovePendingMember from '@/components/boradpath/hris/modals/admin/ApprovePendingMember'
import ApproveDeleteMember from '@/components/boradpath/hris/modals/admin/ApproveDeleteMember'

export default function PendingForApproval({ create, ...props }) {
  const [selectionModel, setSelectionModel] = useState([])
  const [filter, setFilter] = useState('1,3,5,8')
  const { data, isLoading, error, mutate } = useManageHrMember({
    status: filter,
  })
  const [loader, setLoader] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

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
              {row.birth_date ? moment(row.birth_date).format('MMM DD Y') : ''}
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
              <span className="bg-[#111111] text-white px-2 py-1 rounded-md">
                {row.status_name}
              </span>
            </div>
          </>
        )
      },
    },
    {
      field: 'action',
      headerName: '',
      sortable: false,
      width: 100,
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <div className="flex gap-1">
            <ActionButtonAdmin
              key={row.id}
              row={row}
              setShowModal={setShowModal}
              setSelectedRow={setSelectedRow}
            />
          </div>
        )
      },
    },
  ]

  if (error) return <h1>Something went wrong.</h1>
  if (isLoading) return <h1>Loading...</h1>

  return (
    <>
      {/* PENDING ENROLLMENT BOX */}
      <div className="mb-3 font-[poppins]">
        <div className="flex justify-end gap-1">
          <div className="grow">
            <Label htmlFor="search">Seach</Label>
            <input
              type="text"
              id="search"
              className="w-full rounded-md"
              placeholder="Seach (ex. first name, last name)"
            />
          </div>
          <div className="w-48">
            <Label htmlFor="search">Filter</Label>
            <select
              name="filter"
              id="filter"
              className="rounded-md w-full"
              defaultValue="1,3,5,8"
              onChange={e => setFilter(e.target.value)}>
              <option value="1,3,5,8">Select filter</option>
              <option value="1">Pending Members</option>
              <option value="3">Pending Deletion</option>
              <option value="5">Pending Correction</option>
              <option value="8">Pending Change Plan</option>
            </select>
          </div>
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

      {showModal === 'change-plan' && (
        <ApproveChangeMemberPlan
          showModal={showModal}
          setShowModal={setShowModal}
          row={selectedRow}
        />
      )}

      {showModal === 'approve-member' && (
        <ApprovePendingMember
          showModal={showModal}
          setShowModal={setShowModal}
          row={selectedRow}
          mutate={mutate}
        />
      )}

      {showModal === 'approve-deletion' && (
        <ApproveDeleteMember
          showModal={showModal}
          setShowModal={setShowModal}
          row={selectedRow}
        />
      )}
      <Loader loading={loader} />
    </>
  )
}
