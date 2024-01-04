import React from 'react'

import { DataGrid } from '@mui/x-data-grid'
import { CiEdit, CiTrash } from 'react-icons/ci'
import Loader from '@/components/Loader'

export default function LaboratoryTable({
  LaboratoryRequest,
  handleButtonEdit,
  handleButtonDelete,
}) {
  const columns = [
    // { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'code',
      headerName: 'Code',
      // width: 100,
      flex: 1,
    },
    {
      field: 'laboratory',
      headerName: 'Laboratory',
      // width: 160,
      flex: 1,
    },
    {
      field: 'cost',
      headerName: 'Cost',
      // width: 160,
      flex: 1,
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      width: 200,
      align: 'center',
      renderCell: ({ row }) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleButtonEdit(row)}
            className="border hover:bg-gray-400 p-2 rounded-md text-white uppercase font-semibold text-xs">
            <CiEdit className="text-fav-black md:text-2xl" />
          </button>
          <button
            onClick={() => handleButtonDelete(row)}
            className="border hover:bg-gray-400 p-2 rounded-md text-white uppercase font-semibold text-xs">
            <CiTrash className="text-fav-black md:text-2xl" />
          </button>
        </div>
      ),
    },
  ]

  if (LaboratoryRequest.error) return <h1>Error...</h1>
  if (!LaboratoryRequest.data) return <Loader />

  return (
    <DataGrid
      rows={LaboratoryRequest?.data || []}
      columns={columns}
      pageSize={100}
      // selectionModel={selectionModel}
      // setSelectionModel={setSelectionModel}
    />
  )
}
