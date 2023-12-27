import React, { useState, useRef } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import axios from '@/lib/axios'
import Label from '@/components/Label'

export default function AddLaboratory({ row, ...props }) {
  const labRef = useRef('')
  const costRef = useRef(0)

  const handleAddLab = async () => {
    let laboratory = labRef.current.value
    let cost = costRef.current.value

    await axios.get(`sanctum/csrf-cookie`)

    try {
      await axios.post(`${process.env.apiPath}/pre-approve/laboratory`, {
        laboratory: laboratory,
        cost: cost,
      })

      props.handleClose()
      props.mutate()
    } catch (error) {
      throw error
    }
  }

  return (
    <>
      <Dialog open={true} onClose={props.handleClose} fullWidth maxWidth={'md'}>
        <DialogTitle>
          <span className="font-bold text-gray-800">Add Laboratory</span>
        </DialogTitle>
        <DialogContent>
          <div className="mb-3">
            <Label>Laboratory</Label>
            <input
              className="w-full rounded-md"
              type="text"
              name="laboratory"
              ref={labRef}
            />
          </div>
          <div className="mb-3">
            <Label>Cost</Label>
            <input
              className="w-full rounded-md"
              type="text"
              name="cost"
              ref={costRef}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancel</Button>
          <Button onClick={handleAddLab}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
