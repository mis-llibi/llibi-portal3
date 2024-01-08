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

import { addLaboratory } from '@/hooks/pre-approved/laboratory'

export default function AddLaboratory({ row, ...props }) {
  const labRef = useRef('')
  const costRef = useRef(0)

  const handleAddLab = async () => {
    let laboratory = labRef.current.value
    let cost = costRef.current.value

    await addLaboratory({
      laboratory: laboratory,
      cost: cost,
    })

    props.handleClose()
    props.mutate()
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
            <Label>Cost (E.g. 1500, 2500)</Label>
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
