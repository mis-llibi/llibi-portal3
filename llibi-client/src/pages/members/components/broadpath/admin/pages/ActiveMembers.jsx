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
import ChangeMemberPlan from '@/components/boradpath/hris/modals/ChangeMemberPlan'
import moment from 'moment'

export default function ActiveMembers({ ...props }) {
  const { show, setShow, body, setBody, toggle } = ModalControl()
  const [selectionModel, setSelectionModel] = useState([])
  const [filter, setFilter] = useState(4)
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
      // flex: 1,
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
              {' '}
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
      field: 'certificate_no',
      headerName: 'Certificate',
      width: 150,
      renderCell: ({ row }) => {
        return (
          <>
            <div className="font-[poppins]">
              <p className="text-xs text-green-600">
                {row.certificate_issued_at &&
                  moment(row.certificate_issued_at).format('MMM DD, Y')}
              </p>
              <p>{row.certificate_no}</p>
            </div>
          </>
        )
      },
    },
    {
      field: 'plan',
      headerName: 'Plan',
      width: 150,
      renderCell: ({ row }) => {
        return (
          <>
            {row.plan && (
              <div className="font-[poppins] text-[9px]">
                <span className="bg-[#111111] text-white px-2 py-1 rounded-md">
                  {row.plan}
                </span>
              </div>
            )}
          </>
        )
      },
    },
    {
      field: 'action',
      headerName: '',
      sortable: false,
      width: 150,
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <>
            {![4, 6, 9].includes(row.status) && (
              <div className="font-[poppins] text-[9px]">
                <span className="bg-orange-600 text-white px-2 py-1 rounded-md uppercase">
                  {row.status_name}
                </span>
              </div>
            )}
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
              placeholder="Seach (ex. first name, last name)"
            />
          </div>
          <div className="w-48">
            <Label htmlFor="search">Filter</Label>
            <select
              name="filter"
              id="filter"
              className="rounded-md w-full"
              defaultValue={filter}
              onChange={e => setFilter(e.target.value)}>
              <option value="4">Active</option>
              <option value="3,5,8">With Pending</option>
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

      <Loader loading={loader} />
      <Modal show={show} body={body} toggle={toggle} />
    </>
  )
}
