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

import { editLaboratory } from '@/hooks/pre-approved/laboratory'

export default function EditLaboratory({ row, ...props }) {
  const labRef = useRef('')
  const costRef = useRef(0)

  // const { editLaboratory } = Laboratory()

  const handleEditLab = async () => {
    let laboratory = labRef.current.value
    let cost = costRef.current.value

    await editLaboratory({ laboratory: laboratory, cost: cost }, row.id)
    props.handleClose()
    props.mutate()
  }

  return (
    <>
      <Dialog open={true} onClose={props.handleClose} fullWidth maxWidth={'md'}>
        <DialogTitle>
          <span className="font-bold text-gray-800">Edit Laboratory</span>
        </DialogTitle>
        <DialogContent>
          <div className="mb-3">
            <Label>Laboratory</Label>
            <input
              className="w-full rounded-md"
              type="text"
              name="laboratory"
              defaultValue={row.laboratory}
              ref={labRef}
            />
          </div>
          <div className="mb-3">
            <Label>Cost (E.g. 1500, 2500)</Label>
            <input
              className="w-full rounded-md"
              type="text"
              name="cost"
              defaultValue={row.cost}
              ref={costRef}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancel</Button>
          <Button onClick={handleEditLab}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
