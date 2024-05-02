import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'

import { DataGrid } from '@mui/x-data-grid'
import axios from '@/lib/axios'

import Laboratory, { deleteLaboratory } from '@/hooks/pre-approved/laboratory'

import AddLaboratory from './component/AddLaboratory'
import EditLaboratory from './component/EditLaboratory'
import LaboratoryTable from './component/LaboratoryTable'
import ImportLaboratory from './component/ImportLaboratory'
import PreApprovedLayout from '@/components/Layouts/PreApprovedLayout'

import debounce from '@/lib/debounce'

import {
  CiEdit,
  CiTrash,
  CiSquarePlus,
  CiImport,
  CiExport,
} from 'react-icons/ci'

export default function LaboratoryPage() {
  const router = useRouter()
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedRow, SetSelectedRow] = useState(null)
  const [search, setSearch] = useState('')
  const debounceValue = debounce(search)

  const { LaboratoryRequest, uploadLaboratoryCsv } = Laboratory({
    q: debounceValue,
  })

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

  const handleButtonDelete = async row => {
    await deleteLaboratory(row.id)
    LaboratoryRequest.mutate()
  }

  const handleButtonEditModalClose = () => {
    setModalIsOpen(false)
  }

  const handleSearch = text => {
    setSearch(text)
  }

  const handleButtonImport = async () => {
    setModalIsOpen('import-laboratory')
  }

  const handleButtonExport = async () => {
    window.open(
      `${process.env.backEndUrl}/api/pre-approve/laboratory/export?q=${debounceValue}`,
    )
  }

  // const columns = [
  //   // { field: 'id', headerName: 'ID', width: 50 },
  //   {
  //     field: 'code',
  //     headerName: 'Code',
  //     // width: 100,
  //     flex: 1,
  //   },
  //   {
  //     field: 'laboratory',
  //     headerName: 'Laboratory',
  //     // width: 160,
  //     flex: 1,
  //   },
  //   {
  //     field: 'cost',
  //     headerName: 'Cost',
  //     // width: 160,
  //     flex: 1,
  //   },
  //   {
  //     field: 'action',
  //     headerName: 'Action',
  //     sortable: false,
  //     width: 200,
  //     align: 'center',
  //     renderCell: ({ row }) => (
  //       <div className="flex gap-1">
  //         <button
  //           onClick={() => handleButtonEdit(row)}
  //           className="border hover:bg-gray-400 p-2 rounded-md text-white uppercase font-semibold text-xs">
  //           <CiEdit className="text-fav-black md:text-2xl" />
  //         </button>
  //         <button
  //           onClick={() => handleButtonDelete(row)}
  //           className="border hover:bg-gray-400 p-2 rounded-md text-white uppercase font-semibold text-xs">
  //           <CiTrash className="text-fav-black md:text-2xl" />
  //         </button>
  //       </div>
  //     ),
  //   },
  // ]

  // if (LaboratoryRequest.error) return <h1>Error...</h1>
  // if (!LaboratoryRequest.data) return <h1>Loading...</h1>

  return (
    <PreApprovedLayout>
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

      <div className="px-5 max-w-7xl bg-white mx-auto mt-5 rounded-md py-5">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="uppercase text-2xl font-bold text-fav-black">
              Laboratory List
            </h1>
          </div>
          <div>
            <button
              className="hover:bg-gray-300 p-1 rounded-md text-white uppercase font-semibold text-xs"
              onClick={handleButtonAdd}
              title="New">
              <CiSquarePlus className="text-2xl text-blue-700" />
            </button>
            <button
              className="hover:bg-gray-300 p-1 rounded-md text-white uppercase font-semibold text-xs"
              onClick={handleButtonImport}
              title="Import">
              <CiImport className="text-2xl text-orange-700" />
            </button>
            <button
              className="hover:bg-gray-300 p-1 rounded-md text-white uppercase font-semibold text-xs"
              onClick={handleButtonExport}
              title="Export">
              <CiExport className="text-2xl text-green-700" />
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="" className="font-bold text-gray-800">
            Search
          </label>
          <input
            type="text"
            className="w-full rounded-md border-gray-300"
            placeholder="Search Laboratory"
            onChange={e => handleSearch(e.target.value)}
          />
        </div>

        <div className="flex justify-center">
          <div className="h-[calc(100vh-100px)] flex-1">
            <LaboratoryTable
              LaboratoryRequest={LaboratoryRequest}
              handleButtonEdit={handleButtonEdit}
              handleButtonDelete={handleButtonDelete}
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
      {modalIsOpen === 'import-laboratory' && (
        <ImportLaboratory
          row={selectedRow}
          isOpen={modalIsOpen}
          handleClose={handleButtonEditModalClose}
          mutate={LaboratoryRequest.mutate}
        />
      )}
    </PreApprovedLayout>
  )
}
