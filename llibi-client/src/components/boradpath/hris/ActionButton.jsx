import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'
import { Menu, MenuItem, Paper, Popper } from '@mui/material'
import React, { useState } from 'react'

import {
  BiPlus,
  BiSend,
  BiTrashAlt,
  BiUpvote,
  BiPencil,
  BiDotsVerticalRounded,
} from 'react-icons/bi'

export default function ActionButton({ row, handleDelete }) {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChangePlan = () => {
    console.log(row)
    handleClose()
  }
  const handleEditInfo = () => {
    console.log(row)
    handleClose()
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
          <MenuItem onClick={() => handleDelete(handleClose, row)}>
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
          <MenuItem onClick={handleEditInfo}>
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
