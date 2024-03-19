import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Label from '@/components/Label'
import moment from 'moment'

export default function ApproveDeleteMember({ row, showModal, setShowModal }) {
  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <>
      <Dialog fullWidth maxWidth="xs" open={showModal}>
        <DialogTitle>
          <span className="font-[poppins] font-bold uppercase">
            Approve Delete Member
          </span>
        </DialogTitle>
        <DialogContent>
          <Box noValidate component="form" className="font-[poppins]">
            <div className="mb-3">
              <Label>Remarks</Label>
              <textarea type="text" className="w-full rounded-md" rows={3} />
            </div>
          </Box>
        </DialogContent>
        <DialogActions className="font-[poppins]">
          <button
            className="border px-3 py-2 text-xs uppercase bg-blue-500 hover:bg-blue-700 font-semibold text-white rounded-md"
            onClick={handleClose}>
            Approved
          </button>
          <button
            className="border px-3 py-2 text-xs uppercase font-semibold rounded-md"
            onClick={handleClose}>
            Close
          </button>
        </DialogActions>
      </Dialog>
    </>
  )
}
