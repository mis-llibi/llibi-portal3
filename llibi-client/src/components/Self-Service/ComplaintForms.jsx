import React from 'react'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import Label from '../Label'
import moment from 'moment'
import axios from '@/lib/axios'

import { useClientRequestStore } from '@/store/useClientRequestStore'

const schema = z.object({
  last_name: z.string().min(1),
  first_name: z.string().min(1),
  middle_name: z.string(),
  dob: z.date().min(new Date('1900-01-01'), { message: 'Too old' }),
  email: z.string().email(),
  ercard_no: z.number({
    required_error: 'ER Card No. is required',
    invalid_type_error: 'ER Card No. must be a number',
  }),
  company_name: z.string().min(1),

  // deps_last_name: z.string().min(1),
  // deps_first_name: z.string().min(1),
  // deps_dob: z.date().min(new Date('1900-01-01'), { message: 'Too old' }),
  // deps_ercard_no: z.number({
  //   required_error: 'ER Card No. is required',
  //   invalid_type_error: 'ER Card No. must be a number',
  // }),
})

export default function ComplaintForms({ setLoading, setShow }) {
  const isDependent = useClientRequestStore(state => state.isDependent)
  const schemaDependent = z.object({
    deps_last_name: z.string().min(1),
    deps_first_name: z.string().min(1),
    deps_dob: z.date().min(new Date('1900-01-01'), { message: 'Too old' }),
    deps_ercard_no: z.number({
      required_error: 'ER Card No. is required',
      invalid_type_error: 'ER Card No. must be a number',
    }),
  })

  const finalSchema = isDependent ? schema.merge(schemaDependent) : schema

  const {
    handleSubmit,
    register,
    control,
    watch,
    resetField,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(finalSchema),
  })

  const submitForm = async data => {
    try {
      const response = await axios.post('/api/complaint', data)
      console.log(response.data)

      setShow(false)
      setLoading(false)
    } catch (error) {
      throw error
    }
  }

  console.log(isDependent)

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)} className="px-3">
        <div className="flex justify-evenly gap-3">
          <div className="w-1/2">
            <h1>PERSONAL INFORMATION</h1>
            <div className="mb-3">
              <Label>Last Name</Label>
              <input
                className="rounded-md w-full"
                type="text"
                {...register('last_name', { required: true })}
              />
              <span className="text-xs text-red-300">
                {errors?.last_name?.message}
              </span>
            </div>
            <div className="mb-3">
              <Label>First Name</Label>
              <input
                className="rounded-md w-full"
                type="text"
                {...register('first_name', { required: true })}
              />
              <span className="text-xs text-red-300">
                {errors?.first_name?.message}
              </span>
            </div>
            <div className="mb-3">
              <Label>Middle Name (optional)</Label>
              <input
                className="rounded-md w-full"
                type="text"
                {...register('middle_name')}
              />
            </div>
            <div className="mb-3">
              <Label>Date of Birth</Label>
              <input
                className="rounded-md w-full"
                type="date"
                {...register('dob', {
                  required: true,
                  setValueAs: val => new Date(val),
                })}
              />
              <span className="text-xs text-red-300">
                {errors?.dob?.message}
              </span>
            </div>
            <div className="mb-3">
              <Label>Email Address</Label>
              <input
                className="rounded-md w-full"
                type="text"
                {...register('email', { required: true })}
              />
              <span className="text-xs text-red-300">
                {errors?.email?.message}
              </span>
            </div>
            <div className="mb-3">
              <Label>ER Card No. (optional)</Label>
              <input
                className="rounded-md w-full"
                type="text"
                {...register('ercard_no', {
                  setValueAs: val => Number(val),
                })}
              />
              <span className="text-xs text-red-300">
                {errors?.ercard_no?.message}
              </span>
            </div>
            <div className="mb-3">
              <Label>Company Name</Label>
              <input
                className="rounded-md w-full"
                type="text"
                {...register('company_name', { required: true })}
              />
              <span className="text-xs text-red-300">
                {errors?.company_name?.message}
              </span>
            </div>
          </div>

          {isDependent && (
            <div className="w-1/2">
              <h1>DEPENDENTS INFORMATION</h1>
              <div className="mb-3">
                <Label>Last Name</Label>
                <input
                  className="rounded-md w-full"
                  type="text"
                  {...register('deps_last_name', { required: true })}
                />
                <span className="text-xs text-red-300">
                  {errors?.deps_last_name?.message}
                </span>
              </div>
              <div className="mb-3">
                <Label>First Name</Label>
                <input
                  className="rounded-md w-full"
                  type="text"
                  {...register('deps_first_name', { required: true })}
                />
                <span className="text-xs text-red-300">
                  {errors?.deps_first_name?.message}
                </span>
              </div>
              <div className="mb-3">
                <Label>Date of Birth</Label>
                <input
                  className="rounded-md w-full"
                  type="date"
                  {...register('deps_dob', {
                    required: true,
                    setValueAs: val => new Date(val),
                  })}
                />
                <span className="text-xs text-red-300">
                  {errors?.deps_dob?.message}
                </span>
              </div>
              <div className="mb-3">
                <Label>ER Card No. (optional)</Label>
                <input
                  className="rounded-md w-full"
                  type="text"
                  {...register('deps_ercard_no', {
                    setValueAs: val => Number(val),
                  })}
                />
                <span className="text-xs text-red-300">
                  {errors?.deps_ercard_no?.message}
                </span>
              </div>
            </div>
          )}
        </div>
        <button
          className="bg-blue-700 p-2 rounded-md text-white font-bold hover:bg-blue-800"
          type="submit">
          Send Complaint
        </button>
      </form>
    </>
  )
}
