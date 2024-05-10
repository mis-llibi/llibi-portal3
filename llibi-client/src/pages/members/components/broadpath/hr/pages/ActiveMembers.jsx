import React, { useEffect, useState } from 'react'

import { DataGrid } from '@mui/x-data-grid'

import {
  useManageHrMember,
  submitForDeletionHooks,
} from '@/hooks/members/ManageHrMember'

import Swal from 'sweetalert2'
import Loader from '@/components/Loader'
import Label from '@/components/Label'
import ActionButton from '@/components/boradpath/hris/ActionButton'
import ModalControl from '@/components/ModalControl'
import Modal from '@/components/Modal'
import DeleteMemberRemarks from '@/components/boradpath/hris/modals/DeleteMemberRemarks'
import ChangeMemberPlan from '@/components/boradpath/hris/modals/ChangeMemberPlan'
import moment from 'moment'
import { excludeClickableColumns } from '@/util/column-headers'
import ViewDependentsDetails from '@/components/boradpath/hris/modals/hr/ViewDependentsDetails'
import { useActionButtonDropdownStore } from '@/store/useActionButtonDropdownStore'
import debounce from '@/lib/debounce'

export default function ActiveMembers({ create, ...props }) {
  const { show, setShow, body, setBody, toggle } = ModalControl()
  const { anchorEl, setAnchorEl } = useActionButtonDropdownStore()

  const [selectionModel, setSelectionModel] = useState([])
  const [filter, setFilter] = useState(4)
  const [search, setSearch] = useState('')
  const searchDebounce = debounce(search)
  const { data, isLoading, error, mutate } = useManageHrMember({
    search: searchDebounce,
    status: filter,
  })
  const [loader, setLoader] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const handlePageSizeChange = data => {
    setPageSize(data)
  }

  const handleDelete = row => {
    setAnchorEl(null)
    setBody({
      title: 'Delete Members',
      content: (
        <DeleteMemberRemarks row={row} mutate={mutate} setShow={setShow} />
      ),
      modalOuterContainer: 'w-full md:w-96 max-h-screen font-[poppins]',
      modalContainer: 'h-full rounded-md',
      modalBody: 'h-full',
    })
    toggle()
  }

  const handleChangePlan = row => {
    setAnchorEl(null)
    setBody({
      title: 'Change Members Plan',
      content: <ChangeMemberPlan row={row} mutate={mutate} setShow={setShow} />,
      modalOuterContainer: 'w-full md:w-96 max-h-screen font-[poppins]',
      modalContainer: 'h-full rounded-md',
      modalBody: 'h-full',
    })
    toggle()
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 50, hide: true },
    {
      field: 'member_id',
      headerName: 'Name',
      // width: 300,
      flex: 1,
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
    // {
    //   field: 'birth_date',
    //   headerName: 'Birth Date',
    //   width: 150,
    //   renderCell: ({ row }) => {
    //     return (
    //       <>
    //         <div className="font-[poppins]">
    //           {' '}
    //           {row.birth_date ? moment(row.birth_date).format('MMM DD, Y') : ''}
    //         </div>
    //       </>
    //     )
    //   },
    // },
    // {
    //   field: 'gender',
    //   headerName: 'Gender',
    //   width: 150,
    //   renderCell: ({ row }) => {
    //     return (
    //       <>
    //         <div className="font-[poppins]">{row.gender}</div>
    //       </>
    //     )
    //   },
    // },
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
      field: 'effective_date',
      headerName: 'Effectivity Date',
      width: 150,
      renderCell: ({ row }) => {
        return (
          <>
            <div className="font-[poppins]">
              {row.effective_date &&
                moment(row.effective_date).format('MMM DD, Y')}
            </div>
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
              <p>{row.certificate_no}</p>
            </div>
          </>
        )
      },
    },
    {
      field: 'certificate_issued_at',
      headerName: 'Date Approved',
      width: 150,
      renderCell: ({ row }) => {
        return (
          <>
            <div className="font-[poppins]">
              <p>
                {row.certificate_issued_at &&
                  moment(row.certificate_issued_at).format('MMM DD, Y')}
              </p>
            </div>
          </>
        )
      },
    },
    // {
    //   field: 'plan',
    //   headerName: 'Plan',
    //   width: 150,
    //   renderCell: ({ row }) => {
    //     return (
    //       <>
    //         {row.plan && (
    //           <div className="font-[poppins] text-[9px]">
    //             <span className="bg-blue-100 text-blue-600 font-bold px-2 py-1 rounded-md">
    //               {row.plan}
    //             </span>
    //           </div>
    //         )}
    //       </>
    //     )
    //   },
    // },
    {
      field: 'action',
      headerName: '',
      sortable: false,
      width: 150,
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <>
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

            {/* 1 pending submission
              3 Pending deletion
              5 pending correction
              8 pending change plan

              4 approved/active members
              6 approved correction
              9 approvd change plan */}

            {[4, 6, 9].includes(row.status) && (
              <div>
                <ActionButton
                  key={row.id}
                  row={row}
                  handleDelete={handleDelete}
                  handleChangePlan={handleChangePlan}
                />
              </div>
            )}

            {[3, 5, 8].includes(row.status) && (
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
            )}
          </>
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

  const handleViewDetails = (params, event, details) => {
    if (!excludeClickableColumns.includes(params.colDef.headerName)) {
      setBody({
        title: (
          <span className="font-bold text-xl text-gray-800">
            Personal Information
          </span>
        ),
        content: <ViewDependentsDetails row={params?.row} />,
        modalOuterContainer: 'font-[poppins]',
        modalContainer: 'h-full rounded-md',
        modalBody: 'h-full',
      })
      toggle()
    }
  }

  if (error) return <h1>Something went wrong.</h1>
  if (isLoading) return <h1>Loading...</h1>

  return (
    <>
      {/* PENDING ENROLLMENT BOX */}
      <div className="mb-3 font-[poppins]">
        <div className="flex gap-1">
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
          <div className="w-56">
            <Label htmlFor="search">Seach</Label>
            <input
              type="text"
              id="search"
              className="w-full rounded-md text-xs border border-gray-300"
              placeholder="Seach (ex. first name, last name)"
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="w-48">
            <Label htmlFor="search">Filter</Label>
            <select
              name="filter"
              id="filter"
              className="w-full rounded-md text-xs border border-gray-300"
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
        onCellClick={handleViewDetails}
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
