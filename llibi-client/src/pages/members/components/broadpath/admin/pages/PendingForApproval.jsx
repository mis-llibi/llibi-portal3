import React, { useEffect, useState } from 'react'

import { DataGrid } from '@mui/x-data-grid'

import { useManageHrMember } from '@/hooks/members/ManageHrMember'
import Loader from '@/components/Loader'
import Label from '@/components/Label'
import moment from 'moment'

import { ActionButtonAdmin } from '@/components/boradpath/hris/ActionButton'
import ApproveChangeMemberPlan from '@/components/boradpath/hris/modals/admin/ApproveChangeMemberPlan'
import ApprovePendingMember from '@/components/boradpath/hris/modals/admin/ApprovePendingMember'
import ApproveDeleteMember from '@/components/boradpath/hris/modals/admin/ApproveDeleteMember'
import DisapproveMember from '@/components/boradpath/hris/modals/admin/DisapproveMember'
import PendingDocuments from '@/components/boradpath/hris/modals/admin/PendingDocuments'
import ApproveEditInformation from '@/components/boradpath/hris/modals/admin/ApproveEditInformation'

import ModalControl from '@/components/ModalControl'
import Modal from '@/components/Modal'
import ViewUploadedPendingDocuments from '@/components/boradpath/hris/modals/admin/ViewUploadedPendingDocuments'

export default function PendingForApproval({ create, ...props }) {
  const { show, setShow, body, setBody, toggle } = ModalControl()

  const [selectionModel, setSelectionModel] = useState([])
  const [filter, setFilter] = useState('all-pending')
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
              {row.birth_date ? moment(row.birth_date).format('MMM DD, Y') : ''}
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
      field: 'status_name',
      headerName: 'Status',
      width: 150,
      renderCell: ({ row }) => {
        return (
          <>
            <div className="font-[poppins] text-[9px]">
              <span
                className={`${
                  row.status === 3
                    ? 'bg-red-100 text-red-600'
                    : 'bg-blue-100 text-blue-600'
                } font-bold px-2 py-1 rounded-md uppercase`}>
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

  // useEffect(() => {
  //   if (showModal === 'approve-edit-information') {
  //     setBody({
  //       title: (
  //         <span className="font-bold text-xl text-gray-800">
  //           Approve Edit Information
  //         </span>
  //       ),
  //       content: (
  //         <ApproveEditInformation
  //           showModal={Boolean(showModal)}
  //           setShowModal={setShowModal}
  //           mutate={mutate}
  //           setShow={setShow}
  //         />
  //       ),
  //       modalOuterContainer: 'font-[poppins]',
  //       modalContainer: 'h-full rounded-md',
  //       modalBody: 'h-full',
  //     })
  //     toggle()
  //   }

  //   // return () => setShowModal(false)
  //   console.log(show)
  // }, [show])

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
              className="w-full rounded-md text-xs border border-gray-300"
              placeholder="Seach (ex. first name, last name)"
            />
          </div>
          <div className="w-48">
            <Label htmlFor="search">Filter</Label>
            <select
              name="filter"
              id="filter"
              className="w-full rounded-md text-xs border border-gray-300"
              defaultValue="all-pending"
              onChange={e => setFilter(e.target.value)}>
              <option value="all-pending">All</option>
              <option value="1">Pending Members</option>
              <option value="3">Pending Deletion</option>
              <option value="5">Pending Correction</option>
              <option value="8">Pending Change Plan</option>
              <option value="pending-documents">Pending Documents</option>
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

      {showModal === 'change-plan' && (
        <ApproveChangeMemberPlan
          showModal={Boolean(showModal)}
          setShowModal={setShowModal}
          row={selectedRow}
          mutate={mutate}
        />
      )}

      {showModal === 'approve-member' && (
        <ApprovePendingMember
          showModal={Boolean(showModal)}
          setShowModal={setShowModal}
          row={selectedRow}
          mutate={mutate}
        />
      )}

      {showModal === 'approve-deletion' && (
        <ApproveDeleteMember
          showModal={Boolean(showModal)}
          setShowModal={setShowModal}
          row={selectedRow}
          mutate={mutate}
        />
      )}

      {showModal === 'disapprove-member' && (
        <DisapproveMember
          showModal={Boolean(showModal)}
          setShowModal={setShowModal}
          row={selectedRow}
          mutate={mutate}
        />
      )}

      {showModal === 'pending-documents' && (
        <PendingDocuments
          showModal={Boolean(showModal)}
          setShowModal={setShowModal}
          row={selectedRow}
          mutate={mutate}
        />
      )}

      {showModal === 'view-uploaded-pending-documents' && (
        <ViewUploadedPendingDocuments
          showModal={Boolean(showModal)}
          setShowModal={setShowModal}
          row={selectedRow}
          mutate={mutate}
        />
      )}

      {showModal === 'approve-edit-information' && (
        <ApproveEditInformation
          showModal={Boolean(showModal)}
          setShowModal={setShowModal}
          mutate={mutate}
        />
      )}

      <Loader loading={loader} />
      <Modal show={show} body={body} toggle={toggle} />
    </>
  )
}
