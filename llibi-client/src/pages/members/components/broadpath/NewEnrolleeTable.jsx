import React, { useEffect, useState } from 'react'

import { DataGrid } from '@mui/x-data-grid'

import { SlPencil, SlBan, SlEye, SlPeople } from 'react-icons/sl'

export default function NewEnrolleeTable({ data, updateEnrollee }) {
  const [selectionModel, setSelectionModel] = useState([])
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
                [{row.member_id}]
              </span>
              <br />
              <span>{`${row.last_name}, ${row.first_name}`}</span>
            </div>
          </>
        )
      },
    },
    // {
    //   field: 'fullname',
    //   headerName: 'Name',
    //   flex: 1,
    //   renderCell: ({ row }) => {
    //     return `${row.last_name}, ${row.first_name}`
    //   },
    // },
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
      field: 'relation',
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
            <button
              className="group border px-3 py-2 shadow rounded-md hover:bg-gray-800"
              title="Edit Enrollee"
              onClick={() => updateEnrollee(row)}>
              <SlPencil className="group-hover:text-white text-lg" />
            </button>
            <button
              className="group border px-3 py-2 shadow rounded-md hover:bg-gray-800"
              title="Delete Enrollee">
              <SlBan className="group-hover:text-white text-lg" />
            </button>
          </div>
        )
      },
    },
  ]
  
  return (
    <DataGrid
      rows={data}
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
  )
}
