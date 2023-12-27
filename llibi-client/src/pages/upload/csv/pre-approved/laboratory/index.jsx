import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'

import { DataGrid } from '@mui/x-data-grid'
import axios from '@/lib/axios'

import Laboratory from '@/hooks/pre-approved/laboratory'
import AddLaboratory from './component/AddLaboratory'
import EditLaboratory from './component/EditLaboratory'

export default function LaboratoryPage() {
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedRow, SetSelectedRow] = useState(null)

  const { LaboratoryRequest, uploadLaboratoryCsv } = Laboratory()

  const handleUpload = async () => {
    if (!file) {
      alert('Please select csv file first.')
      return
    }
    setIsLoading(true)
    const FORMDATA = new FormData()
    if (file) {
      for (let index = 0; index < file.length; index++) {
        FORMDATA.append('file[]', file[index])
      }
    }

    uploadLaboratoryCsv({ setIsLoading, FORMDATA })

    // await axios.get(`sanctum/csrf-cookie`)

    // try {
    //   const response = await axios.post(
    //     `${process.env.apiPath}/pre-approve/laboratory`,
    //     FORMDATA,
    //   )
    //   setIsLoading(false)
    // } catch (error) {
    //   setIsLoading(false)
    //   throw error
    // }
  }

  const handleButtonAdd = () => {
    setModalIsOpen('add-laboratory')
  }

  const handleButtonEdit = row => {
    SetSelectedRow(row)
    setModalIsOpen('edit-laboratory')
  }

  const handleButtonEditModalClose = () => {
    setModalIsOpen(false)
  }

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
        <>
          <button
            onClick={() => handleButtonEdit(row)}
            className="bg-blue-600 px-3 py-1 rounded-md text-white uppercase font-semibold text-xs">
            Edit
          </button>
        </>
      ),
    },
  ]

  if (LaboratoryRequest.error) return <h1>Error...</h1>
  if (!LaboratoryRequest.data) return <h1>Loading...</h1>

  return (
    <>
      {/* <div className="max-w-lg flex flex-col justify-between items-center border mx-auto mt-20 p-5 rounded-md h-[20rem]">
        <div>
          <h1 className="font-bold uppercase text-3xl mb-5 text-gray-900">
            UPLOAD CSV FOR LABORATORY
          </h1>
          <label htmlFor="file" className="text-gray-700 text-sm font-semibold">
            Select CSV File
          </label>
          <input
            className="mb-5 w-full border bg-blue-50 p-3 rounded-md cursor-pointer"
            type="file"
            name="file"
            id="file"
            multiple
            accept=".csv"
            onChange={e => setFile(e.target.files)}
          />
        </div>
        <button
          className="p-3 w-full rounded-md font-bold hover:underline"
          onClick={() => router.push('/upload/csv/pre-approved/utilization')}>
          Switch to Utilization
        </button>
        <button
          disabled={isLoading}
          className={`${
            isLoading ? 'bg-gray-900' : 'bg-blue-700 hover:bg-blue-900'
          }  p-3 w-full rounded-md uppercase text-white font-bold`}
          onClick={handleUpload}>
          Upload
        </button>
      </div> */}

      <div className="px-20 py-5">
        <div className="flex justify-end mb-3">
          <button
            className="bg-blue-600 px-3 py-1 rounded-md text-white uppercase font-semibold text-xs"
            onClick={handleButtonAdd}>
            Add New Laboratory
          </button>
        </div>
        <div className="flex justify-center">
          <div className="h-[calc(100vh-100px)] flex-1">
            <DataGrid
              rows={LaboratoryRequest?.data || []}
              columns={columns}
              pageSize={100}
              // selectionModel={selectionModel}
              // setSelectionModel={setSelectionModel}
            />
          </div>
        </div>
      </div>

      {modalIsOpen === 'add-laboratory' && (
        <AddLaboratory
          row={selectedRow}
          isOpen={modalIsOpen}
          handleClose={handleButtonEditModalClose}
          mutate={LaboratoryRequest.mutate}
        />
      )}

      {modalIsOpen === 'edit-laboratory' && (
        <EditLaboratory
          row={selectedRow}
          isOpen={modalIsOpen}
          handleClose={handleButtonEditModalClose}
          mutate={LaboratoryRequest.mutate}
        />
      )}
    </>
  )
}
