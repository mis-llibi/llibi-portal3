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

import { useForm } from 'react-hook-form'

import { addLaboratory } from '@/hooks/pre-approved/laboratory'

import { zodResolver } from '@hookform/resolvers/zod'
import { FORM_SCHEMA } from '@/schema/LaboratorySchema'

import { Alert } from '@mui/material'
import Swal from 'sweetalert2'

export default function AddLaboratory({ row, ...props }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm({ resolver: zodResolver(FORM_SCHEMA) })
  const [responseError, setResponseError] = useState(null)

  const handleAddLab = async data => {
    try {
      setResponseError(null)
      const response = await addLaboratory({
        ...data,
      })
      props.handleClose()
      props.mutate()

      Swal.fire(
        'Success',
        'Your changes have been saved successfully.',
        'success',
      )
    } catch (error) {
      if (error.response.status === 422) {
        setResponseError(error.response.data.errors)
      }

      Swal.fire(
        'Error',
        'Oops! Something went wrong. Please try again later.',
        'error',
      )
    }
  }

  return (
    <>
      <Dialog
        open={true}
        onClose={props.handleClose}
        fullWidth
        maxWidth={'md'}
        className="font-[poppins]">
        <DialogTitle>
          <span className="font-bold text-gray-800 font-[poppins]">
            Add Laboratory
          </span>
        </DialogTitle>
        <DialogContent>
          <form>
            <div className="mb-3">
              <Label>Laboratory</Label>
              <input
                className="w-full rounded-md border border-gray-300"
                type="text"
                name="laboratory"
                {...register('laboratory', {
                  // required: 'Laboratory is required',
                })}
              />
              <p className="text-xs text-red-600">
                {errors?.laboratory?.message}
              </p>
            </div>
            <div className="mb-3">
              <Label>Class 1</Label>
              <input
                className="w-full rounded-md border border-gray-300"
                type="text"
                name="cost"
                {...register('cost', {
                  // required: 'Class 1 is required',
                })}
              />
              <p className="text-xs text-red-600">{errors?.cost?.message}</p>
            </div>
            <div className="mb-3">
              <Label>Class 2</Label>
              <input
                className="w-full rounded-md border border-gray-300"
                type="text"
                name="cost2"
                {...register('cost2', {
                  // required: 'Class 2 is required',
                })}
              />
              <p className="text-xs text-red-600">{errors?.cost2?.message}</p>
            </div>

            {responseError && (
              <Alert variant="outlined" severity="error">
                Please double check your input
              </Alert>
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className="!font-[poppins] !text-xs"
            onClick={handleSubmit(handleAddLab)}>
            Save
          </Button>
          <Button
            className="!font-[poppins] !text-xs"
            onClick={props.handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
