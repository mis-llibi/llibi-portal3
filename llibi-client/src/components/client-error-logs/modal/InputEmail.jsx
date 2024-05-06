import React from 'react'
import Label from '@/components/Label'
import { SendNotify } from '@/hooks/self-service/client-error-logs'
import { useForm } from 'react-hook-form'

export default function InputEmail({ row, notifyTo, setShow, mutate }) {
  const {
    handleSubmit,
    register,
    control,
    watch,
    resetField,
    clearErrors,
    formState: { errors },
  } = useForm()

  const submitForm = async data => {
    await SendNotify({ row, notifyTo, cae_email: data.cae_email })
    mutate()
    setShow(false)
  }

  return (
    <div className="w-[50em] px-4 font-[poppins]">
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="mb-3">
          <Label htmlFor="">Input CAE Email:</Label>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300"
            {...register('cae_email', { required: 'CAE Email is required' })}
          />
          <p className="text-red-600">{errors?.cae_email?.email}</p>
        </div>

        <button
          type="submit"
          className="bg-fav-blue-dark hover:bg-fav-blue-light text-white text-sm px-3 py-2 rounded-md">
          Send
        </button>
      </form>
    </div>
  )
}
