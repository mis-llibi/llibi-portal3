import { useErrorLogsStore } from '@/store/useErrorLogsStore'
import React, { useEffect } from 'react'
import Label from '../Label'

import { useForm } from 'react-hook-form'
import axios from '@/lib/axios'

export default function ReportValidationError() {
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

  const submitForm = async (data, type) => {
    console.log(errorLogs)
    console.log(data)
    console.log(type)

    try {
      const response = await axios.post('/api/test', {
        data: data,
        error_data: errorLogs,
      })
      console.log(response.data)
      setErrorLogs(null)
    } catch (error) {
      throw new Error('Something went wrong.')
    }
  }

  useEffect(() => {
    return () => {
      setErrorLogs(null)
    }
  }, [])

  return (
    <div className="w-[40em] px-4">
      <p className="text-lg font-bold mb-3 text-gray-800">
        In order for us to verify membership, kindly provide the following
        details:
      </p>

      <form className="mb-3">
        <div className="mb-3">
          <Label htmlFor="company" className={'mb-1'}>
            Company
          </Label>
          <input
            {...register('company', { required: 'Company is required.' })}
            type="text"
            id="company"
            className="rounded-md w-full"
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
            className="rounded-md w-full"
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
            className="rounded-md w-full"
          />
        </div>
      </form>

      <p className="text-sm text-center font-bold mb-3 mt-6 text-gray-800">
        We may reach out to your company HR to validate and effect changes to
        your information.
      </p>

      <div className="flex gap-1 mt-6 justify-center">
        <button
          disabled={isSubmitting}
          className="bg-blue-600 px-3 py-2 text-white rounded-md text-xs font-bold capitalize"
          onClick={handleSubmit(data => submitForm(data, 'allow'))}>
          I allow LLIBI to verify my membership
        </button>
        <button
          disabled={isSubmitting}
          className="bg-red-600 px-3 py-2 text-white rounded-md text-xs font-bold capitalize"
          onClick={handleSubmit(data => submitForm(data, 'not-allow'))}>
          No do not proceed with the validation
        </button>
      </div>
    </div>
  )
}
