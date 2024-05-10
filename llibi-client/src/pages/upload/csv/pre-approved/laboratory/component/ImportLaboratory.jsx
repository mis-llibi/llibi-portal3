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

import { uploadLaboratoryCsv } from '@/hooks/pre-approved/laboratory'
import BackdropComponent from '@/components/BackdropComponent'

export default function ImportLaboratory({ row, ...props }) {
  const fileRef = useRef('')
  const [isLoading, setIsLoading] = useState(false)

  const handleUpload = async () => {
    let laboratoryFile = fileRef.current.files

    const FORMDATA = new FormData()

    FORMDATA.append('file', laboratoryFile[0])

    setIsLoading('uploading-laboratory')
    await uploadLaboratoryCsv({
      setIsLoading,
      FORMDATA,
    })
    props.handleClose()
    props.mutate()
  }

  return (
    <>
      <Dialog open={true} onClose={props.handleClose} fullWidth maxWidth={'md'}>
        <DialogTitle>
          <span className="font-bold text-gray-800">Import Laboratory</span>
        </DialogTitle>
        <DialogContent>
          <div className="mb-3">
            <Label>
              File{' '}
              <small className="font-thin text-green-700">
                (accept only csv file)
              </small>
            </Label>
            <input
              className="w-full rounded-md border p-3"
              type="file"
              name="laboratory"
              ref={fileRef}
              accept=".csv"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancel</Button>
          <Button onClick={handleUpload}>Save</Button>
        </DialogActions>
      </Dialog>

      <BackdropComponent open={isLoading === 'uploading-laboratory'} />
    </>
  )
}
