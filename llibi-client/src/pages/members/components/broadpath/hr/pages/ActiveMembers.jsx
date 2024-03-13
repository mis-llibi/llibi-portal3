import React, { useEffect, useState } from 'react'

import { DataGrid } from '@mui/x-data-grid'

import { SlPencil, SlBan, SlEye, SlPeople } from 'react-icons/sl'
import {
  BiPlus,
  BiSend,
  BiTrashAlt,
  BiUpvote,
  BiPencil,
  BiDotsVerticalRounded,
} from 'react-icons/bi'

import {
  useManageHrMember,
  submitForDeletionHooks,
} from '@/hooks/members/ManageHrMember'

import Button from '@/components/Button'
import ManualInsertEnrollee from '../../ManualInsertEnrollee'
import Swal from 'sweetalert2'
import ManualUpdateEnrollee from '../../ManualUpdateEnrollee'
import Loader from '@/components/Loader'
import Label from '@/components/Label'
import ActionButton from '@/components/boradpath/hris/ActionButton'
import ModalControl from '@/components/ModalControl'
import Modal from '@/components/Modal'
import DeleteMemberRemarks from '@/components/boradpath/hris/modals/DeleteMemberRemarks'

export default function ActiveMembers({ create, ...props }) {
  const { show, setShow, body, setBody, toggle } = ModalControl()
  const [selectionModel, setSelectionModel] = useState([])
  const { data, isLoading, error, mutate } = useManageHrMember({ status: 2 })
  const [loader, setLoader] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const handlePageSizeChange = data => {
    setPageSize(data)
  }

  const handleDelete = (callback, row) => {
    // console.log(row)
    callback()
    setBody({
      title: 'Delete Members',
      content: <DeleteMemberRemarks row={row} />,
      modalOuterContainer: 'w-full md:w-4/6 max-h-screen font-[poppins]',
      modalContainer: 'h-full',
      modalBody: 'h-full',
    })
    toggle()
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
            <div className="font-[poppins]">{row.birth_date}</div>
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
      width: 300,
      renderCell: ({ row }) => {
        return (
          <>
            <div className="font-[poppins]">{row.civil_status}</div>
          </>
        )
      },
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
            {/* <button
              className="group border px-3 py-2 rounded-md hover:bg-gray-200"
              title="Delete Enrollee">
              <SlBan className="text-lg" />
            </button> */}

            <div>
              <ActionButton
                key={row.id}
                row={row}
                handleDelete={handleDelete}
              />
            </div>
          </div>
        )
      },
    },
  ]

  const handleSubmitForDeletion = async () => {
    if (selectionModel.length <= 0) {
      Swal.fire('Error', 'Please select enrollee first.', 'error')
      return
    }
    setLoader(true)
    await submitForDeletionHooks(selectionModel)
    mutate()
    setLoader(false)
  }

  if (error) return <h1>Something went wrong.</h1>
  if (isLoading) return <h1>Loading...</h1>

  return (
    <>
      {/* PENDING ENROLLMENT BOX */}
      <div className="mb-3 font-[poppins]">
        <div className="flex justify-end gap-1">
          {/* <Button
            onClick={insertEnrollee}
            className="bg-blue-400 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-700 ring-blue-200 mb-2 md:mb-0 w-full md:w-auto flex gap-1"
            disabled={props?.loading}>
            <BiPlus size={16} />
            <span>New Transaction</span>
          </Button> */}
          {/* <Button
            onClick={handleSubmitForDeletion}
            className="bg-blue-400 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-700 ring-blue-200 mb-2 md:mb-0 w-full md:w-auto flex gap-1"
            disabled={selectionModel.length <= 0 || selectionModel.length > 1}>
            <BiUpvote size={16} />
            <span>Upgrade plan</span>
          </Button>
          <Button
            onClick={handleSubmitForDeletion}
            className="bg-indigo-400 hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-700 ring-indigo-200 mb-2 md:mb-0 w-full md:w-auto flex gap-1"
            disabled={selectionModel.length <= 0 || selectionModel.length > 1}>
            <BiPencil size={16} />
            <span>Update information</span>
          </Button>
          <Button
            onClick={handleSubmitForDeletion}
            className="bg-red-400 hover:bg-red-700 focus:bg-red-700 active:bg-red-700 ring-red-200 mb-2 md:mb-0 w-full md:w-auto flex gap-1"
            disabled={selectionModel.length <= 0}>
            <BiTrashAlt size={16} />
            <span>Submit for deletion</span>
          </Button> */}
          <div className="grow">
            <Label htmlFor="search">Seach</Label>
            <input
              type="text"
              id="search"
              className="w-full rounded-md"
              placeholder="Seach (ex. First name, Last name)"
            />
          </div>
        </div>
      </div>

      <DataGrid
        sx={{
          '.MuiDataGrid-columnHeaderTitle': {
            fontFamily: 'poppins !important',
          },
        }}
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
      <Modal show={show} body={body} toggle={toggle} />
    </>
  )
}
