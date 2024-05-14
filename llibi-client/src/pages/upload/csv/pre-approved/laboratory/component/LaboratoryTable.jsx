'use client'
import React from 'react'

import { DataGrid } from '@mui/x-data-grid'
import { CiEdit, CiTrash } from 'react-icons/ci'
import Loader from '@/components/Loader'

import { NumberFormatter } from '@/lib/number-formatter'

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
      renderCell: ({ row }) => {
        return (
          <>
            <div className="font-[poppins]">{row.code}</div>
          </>
        )
      },
    },
    {
      field: 'laboratory',
      headerName: 'Laboratory',
      // width: 160,
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <>
            <div className="font-[poppins]">{row.laboratory}</div>
          </>
        )
      },
    },
    {
      field: 'cost',
      headerName: 'Class 1',
      // width: 160,
      flex: 1,
      renderCell: ({ row }) => (
        <span className="font-[poppins]">
          {NumberFormatter.format(row.cost)}
        </span>
      ),
    },
    {
      field: 'cost2',
      headerName: 'Class 2',
      // width: 160,
      flex: 1,
      renderCell: ({ row }) => (
        <span className="font-[poppins]">
          {NumberFormatter.format(row.cost2)}
        </span>
      ),
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
            className="bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded-md text-white uppercase font-semibold text-xs">
            <CiEdit className="text-white md:text-2xl" />
          </button>
          <button
            onClick={() => handleButtonDelete(row)}
            className="bg-red-600 hover:bg-red-500 px-2 py-1 rounded-md text-white uppercase font-semibold text-xs">
            <CiTrash className="text-white md:text-2xl" />
          </button>
        </div>
      ),
    },
  ]

  if (LaboratoryRequest?.error) return <h1>Error...</h1>
  if (!LaboratoryRequest?.data) return <Loader />

  return (
    <DataGrid
      sx={{
        '.MuiDataGrid-columnHeaderTitle': {
          fontFamily: 'poppins !important',
          fontWeight: 'bold',
        },
      }}
      rows={LaboratoryRequest?.data || []}
      columns={columns}
      pageSize={100}
      // selectionModel={selectionModel}
      // setSelectionModel={setSelectionModel}
    />
  )
}
