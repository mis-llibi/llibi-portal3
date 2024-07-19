import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'
import { Menu, MenuItem, Paper, Popper } from '@mui/material'
import React, { useEffect, useState } from 'react'

import {
  BiPlus,
  BiSend,
  BiTrashAlt,
  BiUpvote,
  BiPencil,
  BiDotsVerticalRounded,
  BiUserCheck,
  BiUserX,
  BiFile,
} from 'react-icons/bi'
import ApproveChangeMemberPlan from './modals/admin/ApproveChangeMemberPlan'

import { useActionButtonDropdownStore } from '@/store/useActionButtonDropdownStore'
import { useActiveMemberSelectedRowStore } from '@/store/useActiveMemberSelectedRowStore'
import { usePendingMemberSelectedRowStore } from '@/store/usePendingMemberSelectedRowStore'

export default function ActionButton({
  row,
  handleDelete,
  handleChangePlan,
  handleEditInformation,
}) {
  // const [anchorEl, setAnchorEl] = useState(null)
  const { anchorEl, setAnchorEl } = useActionButtonDropdownStore()
  const { selectedRow, setSelectedRow } = useActiveMemberSelectedRowStore()

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
    setSelectedRow(row)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <button
        onClick={handleClick}
        className="group border px-2 py-1 rounded-md hover:bg-gray-200"
        title="Action"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}>
        <BiDotsVerticalRounded size={24} />
      </button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
        <Paper sx={{ width: 220 }}>
          <MenuItem onClick={handleDelete}>
            <div className="flex gap-3 items-center font-[poppins] text-sm">
              <BiTrashAlt size={20} />
              <span>Delete</span>
            </div>
          </MenuItem>
          <MenuItem onClick={handleChangePlan}>
            <div className="flex gap-3 items-center font-[poppins] text-sm">
              <BiUpvote size={20} />
              <span>Change Plan</span>
            </div>
          </MenuItem>
          <MenuItem onClick={handleEditInformation}>
            <div className="flex gap-3 items-center font-[poppins] text-sm">
              <BiPencil size={20} />
              <span>Edit Information</span>
            </div>
          </MenuItem>
        </Paper>
      </Menu>
    </>
  )
}

export function ActionButtonAdmin({ row, setShowModal, setSelectedRow }) {
  const {
    selectedRowState,
    setSelectedRowState,
  } = usePendingMemberSelectedRowStore()

  const [anchorEl, setAnchorEl] = useState(null)
  // const [showModal, setShowModal] = useState(false)
  // const [selectedRow, setSelectedRow] = useState(null)

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChangePlanModal = () => {
    setSelectedRow(row)
    setShowModal('change-plan')
    handleClose()
  }

  const handleApproveMemberModal = () => {
    setSelectedRow(row)
    setShowModal('approve-member')
    handleClose()
  }

  const handleApproveDeleteMemberModal = () => {
    setSelectedRow(row)
    setShowModal('approve-deletion')
    handleClose()
  }

  const handleDisApproveMemberModal = () => {
    setSelectedRow(row)
    setShowModal('disapprove-member')
    handleClose()
  }

  const handlePendingDocumentsModal = () => {
    setSelectedRow(row)
    setShowModal('pending-documents')
    handleClose()
  }

  const handleViewUploadedPendingDocumentsModal = () => {
    setSelectedRow(row)
    setShowModal('view-uploaded-pending-documents')
    handleClose()
  }

  const handleApproveInformationCorrection = data => {
    setSelectedRowState(data)
    setShowModal('approve-edit-information')
    handleClose()
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <button
        onClick={e => handleClick(e)}
        className="group border px-2 py-1 rounded-md hover:bg-gray-200"
        title="Action"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}>
        <BiDotsVerticalRounded size={24} />
      </button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: row.status === 1 ? 50 : 20,
              right: -5,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}>
        <Paper sx={{ width: 250 }}>
          {row.status === 1 && (
            <>
              <MenuItem onClick={handleApproveMemberModal}>
                <div className="flex gap-3 items-center font-[poppins] text-sm">
                  <BiUserCheck size={20} />
                  <span>Approve Member</span>
                </div>
              </MenuItem>
              <MenuItem onClick={handleDisApproveMemberModal}>
                <div className="flex gap-3 items-center font-[poppins] text-sm">
                  <BiUserX size={20} />
                  <span>Disapprove Member</span>
                </div>
              </MenuItem>
              <MenuItem onClick={handlePendingDocumentsModal}>
                <div className="flex gap-3 items-center font-[poppins] text-sm">
                  <BiFile size={20} />
                  <span>Pending Documents</span>
                </div>
              </MenuItem>
            </>
          )}
          {row.status === 3 && (
            <MenuItem onClick={handleApproveDeleteMemberModal}>
              <div className="flex gap-3 items-center font-[poppins] text-sm">
                <BiUserCheck size={20} />
                <span>Approve Delete</span>
              </div>
            </MenuItem>
          )}
          {row.status === 5 && (
            <MenuItem onClick={() => handleApproveInformationCorrection(row)}>
              <div className="flex gap-3 items-center font-[poppins] text-sm">
                <BiUserCheck size={20} />
                <span>Approve Correction</span>
              </div>
            </MenuItem>
          )}
          {row.status === 8 && (
            <MenuItem onClick={handleChangePlanModal}>
              <div className="flex gap-3 items-center font-[poppins] text-sm">
                <BiUserCheck size={20} />
                <span>Approve Change Plan</span>
              </div>
            </MenuItem>
          )}

          {row.status === 11 && (
            <>
              <MenuItem onClick={handlePendingDocumentsModal}>
                <div className="flex gap-3 items-center font-[poppins] text-sm">
                  <BiFile size={20} />
                  <span>Send Pending Documents</span>
                </div>
              </MenuItem>
              <MenuItem onClick={handleViewUploadedPendingDocumentsModal}>
                <div className="flex gap-3 items-center font-[poppins] text-sm">
                  <BiFile size={20} />
                  <span>View Uploaded Documents</span>
                </div>
              </MenuItem>
            </>
          )}
        </Paper>
      </Menu>
    </>
  )
}
