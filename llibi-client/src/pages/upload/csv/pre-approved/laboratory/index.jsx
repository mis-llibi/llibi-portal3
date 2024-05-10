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
import Swal from 'sweetalert2'

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

  const handleButtonAdd = () => {
    setModalIsOpen('add-laboratory')
  }

  const handleButtonEdit = row => {
    SetSelectedRow(row)
    setModalIsOpen('edit-laboratory')
  }

  const handleButtonDelete = async row => {
    try {
      await deleteLaboratory(row.id)
      LaboratoryRequest.mutate()

      Swal.fire('Success', 'The item has been successfully deleted.', 'success')
    } catch (error) {
      Swal.fire(
        'Error',
        'Oops! Something went wrong. Please try again later.',
        'error',
      )
    }
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

  return (
    <PreApprovedLayout>
      <div className="px-5 max-w-7xl bg-white mx-auto mt-5 rounded-md py-5">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="uppercase text-2xl font-bold text-fav-black">
              Laboratory List
            </h1>
          </div>
          <div className="flex gap-1">
            <button
              className="hover:bg-gray-100 px-2 py-1 rounded-md text-blue-700 uppercase font-semibold text-xs flex gap-1 items-center border border-gray-300"
              onClick={handleButtonAdd}
              title="New">
              <CiSquarePlus className="text-2xl " />
              <span>Add New</span>
            </button>
            <button
              className="hover:bg-gray-100 px-2 py-1 rounded-md text-orange-700 uppercase font-semibold text-xs flex gap-1 items-center border border-gray-300"
              onClick={handleButtonImport}
              title="Import">
              <CiImport className="text-2xl " />
              <span>Import</span>
            </button>
            <button
              className="hover:bg-gray-100 px-2 py-1 rounded-md text-green-700 uppercase font-semibold text-xs flex gap-1 items-center border border-gray-300"
              onClick={handleButtonExport}
              title="Export">
              <CiExport className="text-2xl" />
              <span>Excel</span>
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="" className="font-bold text-gray-800">
            Search
          </label>
          <input
            type="text"
            className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
