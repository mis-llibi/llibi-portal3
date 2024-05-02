'use client'

import React, { useState, useRef, useEffect } from 'react'
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

import { editLaboratory } from '@/hooks/pre-approved/laboratory'

import { NumberFormatter } from '@/lib/number-formatter'

export default function EditLaboratory({ row, ...props }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm()

  // const { editLaboratory } = Laboratory()

  const handleEditLab = async data => {
    await editLaboratory({ ...data }, row.id)
    props.handleClose()
    props.mutate()
  }

  useEffect(() => {
    reset({
      laboratory: row?.laboratory,
      cost: NumberFormatter.format(row?.cost),
      cost2: NumberFormatter.format(row?.cost2),
    })
  }, [row?.id])

  return (
    <>
      <Dialog open={true} onClose={props.handleClose} fullWidth maxWidth={'md'}>
        <DialogTitle>
          <span className="font-bold text-gray-800">Edit Laboratory</span>
        </DialogTitle>
        <DialogContent>
          <form>
            <div className="mb-3">
              <Label>Laboratory</Label>
              <input
                className="w-full rounded-md"
                type="text"
                name="laboratory"
                {...register('laboratory', {
                  required: 'Laboratory is required',
                })}
              />
              <p className="text-xs text-red-600">
                {errors?.laboratory?.message}
              </p>
            </div>
            <div className="mb-3">
              <Label>Class 1</Label>
              <input
                className="w-full rounded-md"
                type="text"
                name="cost"
                {...register('cost', {
                  required: 'Class 1 is required',
                  // pattern: {
                  //   value: /^[0-9]+$/,
                  //   message: 'Please enter a number',
                  // },
                })}
              />
              <p className="text-xs text-red-600">{errors?.cost?.message}</p>
            </div>
            <div className="mb-3">
              <Label>Class 2</Label>
              <input
                className="w-full rounded-md"
                type="text"
                name="cost2"
                {...register('cost2', {
                  required: 'Class 2 is required',
                  // pattern: {
                  //   value: /^[0-9]+$/,
                  //   message: 'Please enter a number',
                  // },
                })}
              />
              <p className="text-xs text-red-600">{errors?.cost2?.message}</p>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancel</Button>
          <Button onClick={handleSubmit(handleEditLab)}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
