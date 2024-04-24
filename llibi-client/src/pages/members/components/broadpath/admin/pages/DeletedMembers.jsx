import React, { useEffect, useState } from 'react'

import { DataGrid } from '@mui/x-data-grid'

import { useManageHrMember } from '@/hooks/members/ManageHrMember'

import Loader from '@/components/Loader'
import Label from '@/components/Label'
import ModalControl from '@/components/ModalControl'
import Modal from '@/components/Modal'
import moment from 'moment'

import { FaRegFolderOpen } from 'react-icons/fa'

export default function DeletedMembers({ create, ...props }) {
  const { show, setShow, body, setBody, toggle } = ModalControl()
  const [selectionModel, setSelectionModel] = useState([])
  const [filter, setFilter] = useState(7)
  const { data, isLoading, error, mutate } = useManageHrMember({
    status: filter,
  })
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
      width: 300,
      renderCell: ({ row }) => {
        return (
          <>
            <div className="font-[poppins]">
              <span className="text-green-600 text-xs">{row.member_id}</span>
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
      width: 150,
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
      width: 250,
      renderCell: ({ row }) => {
        return (
          <>
            <div className="font-[poppins]">{row.civil_status}</div>
          </>
        )
      },
    },
    {
      field: 'approved_deleted_member_at',
      headerName:
        Number(filter) === 7 ? 'Termination Date' : 'Disapproval Date',
      width: 150,
      renderCell: ({ row }) => {
        return (
          <>
            <div className="font-[poppins]">
              {row.approved_deleted_member_at
                ? moment(row.approved_deleted_member_at).format('MMM DD, Y')
                : ''}
            </div>
          </>
        )
      },
    },
    Number(filter) === 10 && {
      field: 'pending_documents',
      headerName: 'Action',
      width: 200,
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <>
            <div className="font-[poppins]">
              <button
                title="Pending Documents"
                className="text-gray-600 border rounded px-2 py-1 hover:bg-gray-200">
                <FaRegFolderOpen size={24} />
              </button>
            </div>
          </>
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
        <div className="flex gap-1">
          <div className="w-56">
            <Label htmlFor="search">Seach</Label>
            <input
              type="text"
              id="search"
              className="w-full rounded-md text-xs border border-gray-200"
              placeholder="Seach (ex. first name, last name)"
            />
          </div>
          <div className="w-48">
            <Label htmlFor="search">Filter</Label>
            <select
              name="filter"
              id="filter"
              className="w-full rounded-md text-xs border border-gray-200"
              defaultValue={filter}
              onChange={e => setFilter(e.target.value)}>
              <option value="7">Deleted Members</option>
              <option value="10">Disapproved Members</option>
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
        // disableColumnFilter
        // disableColumnSelector
        disableColumnMenu
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
      <Modal show={show} body={body} toggle={toggle} />
    </>
  )
}
