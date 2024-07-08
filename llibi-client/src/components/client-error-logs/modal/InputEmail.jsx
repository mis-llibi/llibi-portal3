import React from 'react'
import Label from '@/components/Label'
import { SendNotify } from '@/hooks/self-service/client-error-logs'
import { useForm } from 'react-hook-form'

// import { Button } from '@radix-ui/themes'
import { RocketIcon } from '@radix-ui/react-icons'

export default function InputEmail({ row, notifyTo, setShow, mutate }) {
  const {
    handleSubmit,
    register,
    control,
    watch,
    resetField,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onChange' })

  const submitForm = async data => {
    await SendNotify({
      row,
      notifyTo,
      cae_email: data.cae_email,
      remarks: data.remarks,
    })
    mutate()
    setShow(false)
  }

  return (
    <div className="w-[50em] px-4 font-[poppins]">
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="mb-3">
          <Label htmlFor="">Email:</Label>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300"
            {...register('cae_email', { required: 'Email is required' })}
          />
          <p className="text-red-600">{errors?.cae_email?.message}</p>
        </div>
        <div className="mb-3">
          <Label htmlFor="">Remarks:</Label>
          <textarea
            type="text"
            className="block w-full rounded-md border-gray-300"
            {...register('remarks')}
          />
          <p className="text-red-600">{errors?.remarks?.message}</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex gap-1 border px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white">
          <RocketIcon /> Send
        </button>
      </form>
    </div>
  )
}
