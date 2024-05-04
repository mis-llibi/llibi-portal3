import { useErrorLogsStore } from '@/store/useErrorLogsStore'
import React, { useEffect } from 'react'
import Label from '../Label'

import { useForm } from 'react-hook-form'
import axios from '@/lib/axios'
import Swal from 'sweetalert2'

export default function ReportValidationError({ setShow }) {
  const { errorLogs, setErrorLogs } = useErrorLogsStore()

  const {
    handleSubmit,
    register,
    control,
    watch,
    resetField,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onChange' })

  const submitForm = async (data, allowType) => {
    // console.log(errorLogs)
    // console.log(data)
    // console.log(type)

    try {
      const response = await axios.post('/api/error-logs', {
        ...data,
        error_data: errorLogs,
        is_allow_to_call: allowType,
      })
      // console.log(response.data)

      Swal.fire(
        'Success',
        'Please allow 4 - 8 hours to validate your membership information. Meanwhile you may contact our 24/7 Client Care Hotline for urgent assistance.',
        'success',
      )
      setErrorLogs(null)
      setShow(false)
    } catch (error) {
      throw new Error('Something went wrong.')
    }
  }

  const handleClose = () => {
    setShow(false)
  }

  useEffect(() => {
    return () => {
      setErrorLogs(null)
    }
  }, [])

  console.log(errorLogs)

  return (
    <div className="w-[50em] px-4 font-[poppins]">
      <p className="text-lg font-bold mb-3 text-gray-800">
        In order for us to verify membership, kindly provide the following
        details:
      </p>

      <form className="mb-3">
        <div className="mb-3">
          <Label htmlFor="fullname" className={'mb-1'}>
            Full Name
          </Label>
          <input
            {...register('fullname', { required: 'Fullname is required.' })}
            type="text"
            id="fullname"
            defaultValue={
              errorLogs?.last_name &&
              errorLogs?.first_name &&
              `${errorLogs?.last_name}, ${errorLogs?.first_name}`
            }
            className="rounded-md w-full border-gray-300"
          />
          <p className="text-xs text-red-600">{errors.fullname?.message}</p>
        </div>
        {errorLogs?.is_dependent && (
          <div className="mb-3">
            <Label htmlFor="deps_fullname" className={'mb-1'}>
              Full Name of Dependent
            </Label>
            <input
              {...register('deps_fullname', {
                required: 'Fullname of dependent is required.',
              })}
              type="text"
              id="deps_fullname"
              defaultValue={
                errorLogs?.dependent_last_name &&
                errorLogs?.dependent_first_name &&
                `${errorLogs?.dependent_last_name}, ${errorLogs?.dependent_first_name}`
              }
              className="rounded-md w-full border-gray-300"
            />
            <p className="text-xs text-red-600">
              {errors.deps_fullname?.message}
            </p>
          </div>
        )}
        <div className="mb-3">
          <Label htmlFor="company" className={'mb-1'}>
            Company
          </Label>
          <input
            {...register('company', { required: 'Company is required.' })}
            type="text"
            id="company"
            className="rounded-md w-full border-gray-300"
          />
          <p className="text-xs text-red-600">{errors.company?.message}</p>
        </div>
        <div className="mb-3">
          <Label htmlFor="email" className={'mb-1'}>
            Email
          </Label>
          <input
            {...register('email', { required: 'Email is required.' })}
            type="text"
            id="email"
            className="rounded-md w-full border-gray-300"
          />
          <p className="text-xs text-red-600">{errors.email?.message}</p>
        </div>
        <div className="mb-3">
          <Label htmlFor="mobile" className={'mb-1'}>
            Mobile <span className="text-gray-600 text-xs">(optional)</span>
          </Label>
          <input
            {...register('mobile')}
            type="text"
            id="mobile"
            className="rounded-md w-full border-gray-300"
          />
        </div>
      </form>

      <p className="text-center font-bold mb-3 mt-6 text-gray-800">
        Lacson may reach out to your company to validate and effect changes in
        your information.
      </p>

      <div className="flex gap-1 mt-6 justify-center">
        <button
          disabled={isSubmitting}
          className="bg-blue-600 px-3 py-2 text-white rounded-md text-xs font-bold capitalize"
          onClick={handleSubmit(data => submitForm(data, 1))}>
          I allow LLIBI to verify my membership
        </button>
        <button
          disabled={isSubmitting}
          className="bg-red-600 px-3 py-2 text-white rounded-md text-xs font-bold capitalize"
          onClick={handleSubmit(data => submitForm(data, 0))}>
          No do not proceed with the validation
        </button>
      </div>
    </div>
  )
}
