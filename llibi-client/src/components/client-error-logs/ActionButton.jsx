import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'
import axios from '@/lib/axios'
import { useModalNotifyCaeStore } from '@/store/useModalNotifyCaeStore'
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
  BiInfoCircle,
} from 'react-icons/bi'

import InputEmail from './modal/InputEmail'

import { SendNotify } from '@/hooks/self-service/client-error-logs'

export default function ActionButton({ row }) {
  const { show, setShow, body, setBody, toggle } = ModalControl()
  // const { Mshow, Mbody, setModalState } = useModalNotifyCaeStore()

  const [anchorEl, setAnchorEl] = useState(null)
  // const { anchorEl, setAnchorEl } = useActionButtonDropdownStore()

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNotify = async (row, notifyTo) => {
    await SendNotify({ row, notifyTo })

    handleClose()
  }

  const handleShowModal = (row, notifyTo) => {
    setBody({
      title: (
        <span className="text-xl font-bold uppercase text-fav-black">
          Notify to CAE
        </span>
      ),
      content: <InputEmail row={row} notifyTo={notifyTo} setShow={setShow} />,
      modalOuterContainer: '',
      modalContainer: 'h-full rounded-md',
      modalBody: 'h-full',
    })

    toggle()
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
        }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}>
        <Paper sx={{ width: 220 }}>
          <MenuItem onClick={() => handleNotify(row, 'member')}>
            <div className="flex gap-3 items-center font-[poppins] text-sm">
              <BiInfoCircle size={20} />
              <span>Notify Member</span>
            </div>
          </MenuItem>
          <MenuItem onClick={() => handleNotify(row, 'mis')}>
            <div className="flex gap-3 items-center font-[poppins] text-sm">
              <BiInfoCircle size={20} />
              <span>Notify MIS</span>
            </div>
          </MenuItem>
          <MenuItem onClick={() => handleShowModal(row, 'cae')}>
            <div className="flex gap-3 items-center font-[poppins] text-sm">
              <BiInfoCircle size={20} />
              <span>Notify CAE</span>
            </div>
          </MenuItem>
        </Paper>
      </Menu>

      <Modal show={show} body={body} toggle={toggle} />
    </>
  )
}
