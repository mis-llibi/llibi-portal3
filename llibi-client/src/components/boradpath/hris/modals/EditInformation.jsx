import React, { useRef, useState } from 'react'
import moment from 'moment'

import Label from '@/components/Label'

import { BiLoader, BiTrashAlt } from 'react-icons/bi'

import { useForm } from 'react-hook-form'
import axios from '@/lib/axios'

import { TextField } from '@radix-ui/themes'
import Datepicker from 'react-tailwindcss-datepicker'

import { useActiveMemberSelectedRowStore } from '@/store/useActiveMemberSelectedRowStore'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Swal from 'sweetalert2'

const FORM_SCHEMA = z.object({
  last_name: z.string().min(1, { message: 'Last Name is required' }),
  first_name: z.string().min(1, { message: 'First Name is required' }),
  middle_name: z.string(),
  email: z.string().email(),
})

export default function EditInformation({ mutate, setShow }) {
  const selectedRow = useActiveMemberSelectedRowStore(
    state => state.selectedRow,
  )

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm({ mode: 'onChange', resolver: zodResolver(FORM_SCHEMA) })

  const [value, setValue] = useState({
    startDate: moment(selectedRow?.birth_date).format('Y-MM-DD'),
    endDate: moment(selectedRow?.birth_date).format('Y-MM-DD'),
  })

  const handleValueChange = newValue => {
    console.log('newValue:', newValue)
    setValue(newValue)
  }

  const submitForm = async data => {
    if (!value.startDate) {
      return
    }

    try {
      const response = await axios.post(
        '/api/members-enrollment/update-information',
        { ...data, birth_date: value.startDate, id: selectedRow?.id },
      )
      mutate()
      setShow(false)
      Swal.fire('Success', response.data?.message, 'success')
    } catch (error) {
      Swal.fire('Error', 'Something went wrong', 'error')
      throw new Error(
        `Something went wrong. ${error.response.status} ${error.response.statusText}`,
      )
    }
  }

  return (
    <>
      <div className="font-[poppins] w-[90vw] md:w-[75vw] px-3">
        <form>
          <div className="mb-3">
            <label htmlFor="" className="font-bold text-sm">
              Last Name
            </label>
            <TextField.Root
              size="2"
              defaultValue={selectedRow?.last_name}
              {...register('last_name')}
            />
            <p className="text-xs text-red-600">{errors?.last_name?.message}</p>
          </div>
          <div className="mb-3">
            <label htmlFor="" className="font-bold text-sm">
              First Name
            </label>
            <TextField.Root
              size="2"
              defaultValue={selectedRow?.first_name}
              {...register('first_name')}
            />
            <p className="text-xs text-red-600">
              {errors?.first_name?.message}
            </p>
          </div>
          <div className="mb-3">
            <label htmlFor="" className="font-bold text-sm">
              Middle Name <span className="text-xs">(optional)</span>
            </label>
            <TextField.Root
              size="2"
              defaultValue={selectedRow?.middle_name}
              {...register('middle_name')}
            />
            <p className="text-xs text-red-600">
              {errors?.middle_name?.message}
            </p>
          </div>
          <div className="mb-3">
            <label htmlFor="" className="font-bold text-sm">
              Birth Date
            </label>
            <Datepicker
              useRange={false}
              readOnly
              inputClassName="w-full rounded-md border border-gray-400 text-xs text-fav-black"
              value={value}
              onChange={handleValueChange}
              asSingle
              // showShortcuts={true}
              // showFooter={true}
              popoverDirection="down"
            />
            <p className="text-xs text-red-600">
              {!value.startDate && 'Birth Date is required'}
            </p>
          </div>
          <div className="mb-3">
            <label htmlFor="" className="font-bold text-sm">
              Email
            </label>
            <TextField.Root
              size="2"
              defaultValue={selectedRow?.contact?.email}
              {...register('email')}
            />
            <p className="text-xs text-red-600">{errors?.email?.message}</p>
          </div>
        </form>
        <div>
          <button
            // disabled={isSubmitting}
            type="submit"
            onClick={handleSubmit(data => submitForm(data))}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-2 text-white rounded-md text-xs flex gap-1 items-center justify-center font-bold uppercase">
            {isSubmitting ? 'Loading...' : 'Submit'}
          </button>
        </div>
      </div>
    </>
  )
}
