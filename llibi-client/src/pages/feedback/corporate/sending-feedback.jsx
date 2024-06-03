import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import axios from '@/lib/axios'

import BackdropComponent from '@/components/BackdropComponent'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const ACCEPTED_IMAGE_TYPES = [
  // 'image/jpeg',
  // 'image/jpg',
  'application/pdf',
  // 'image/webp',
]

const LOATYPE = {
  CONSULTATION: 'consultation',
  STANDALONE: '2n1-standalone',
  LABORATORY: 'laboratory',
  PREAPPROVED: 'pre-approved-laboratory',
}

const FORM_SCHEMA = z.object({
  email: z.string('Email is required').email().min(1, 'Email is required'),
  provider_email: z.string(),
  file: z
    .any()
    .refine(
      file => ACCEPTED_IMAGE_TYPES.includes(file[0]?.type),
      'PDF format is only supported',
    ),
  email_format_type: z
    .any()
    .refine(
      data => Object.values(LOATYPE).includes(data),
      'Email format is required',
    ),
})

export default function SendingFeedback() {
  const router = useRouter()
  const fileRef = useRef(null)

  const {
    handleSubmit,
    register,
    control,
    watch,
    reset,
    setValue,
    resetField,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      provider_email: '',
      file: null,
      email_format_type: '',
    },
    mode: 'onChange',
    resolver: zodResolver(FORM_SCHEMA),
  })

  const {
    employee_id,
    patient_id,
    hospital_id,
    company_id,
    approval_code,
    loatype,
  } = router.query

  const [file, setFile] = useState(null)
  const [email, setEmail] = useState('')
  const [providerEmail, setProviderEmail] = useState('')
  const [bccEmail, setBccEmail] = useState('')

  const [open, setOpen] = useState(false)

  const handleSendFeedback = async data => {
    const FORMDATA = new FormData()

    // FORMDATA.append('loa', data.file[0])
    FORMDATA.append('email', data.email)
    FORMDATA.append('provider_email', data.provider_email)
    FORMDATA.append('email_format_type', data.email_format_type)
    FORMDATA.append('employee_id', employee_id)
    FORMDATA.append('approval_code', approval_code)
    FORMDATA.append('company_id', company_id)

    for (let i = 0; i < data.file.length; i++) {
      FORMDATA.append('loa[]', data.file[i])
    }
    
    setOpen(true)
    try {
      const response = await axios.post(
        `${process.env.apiPath}/corporate/feedbacks`,
        FORMDATA,
      )
      setOpen(false)
      reset()
      window.close()
    } catch (error) {
      setOpen(false)
      if (error.response.status === 422) {
        let errMsg = ''
        const keys = Object.keys(error.response.data.errors)
        for (let i in Object.keys(error.response.data.errors)) {
          errMsg += `${error.response.data.errors[keys[i]][0]}\n`
        }
        alert(errMsg)
        return
      }
      alert('Something wrong')
      throw error
    }
  }

  useEffect(() => {
    const getEmployee = async () => {
      setOpen(true)
      try {
        const response = await axios.get(
          `/api/corporate/feedbacks/employee?employee_id=${employee_id}`,
        )
        reset({ email: response.data.email })
      } catch (error) {
        alert(
          'Please advice MIS (Mailyn/Joy) to upload in the DA masterlist. For the mean time please proceed using manual email',
        )
        throw error
      } finally {
        setOpen(false)
      }
    }

    if (employee_id) {
      getEmployee()
    }
  }, [employee_id])

  return (
    <>
      <Head>
        <title>Sending Feedback</title>
      </Head>
      <div className="flex justify-center items-center h-screen bg-blue-gray-50 px-5 font-[poppins]">
        <div className="w-full md:w-1/2 mx-auto border flex flex-col items-center p-5 shadow-md bg-white rounded-md">
          <div className="w-full px-3 mb-3 text-center">
            <label className="font-bold uppercase text-2xl">
              Send Loa with Feedback link
            </label>
          </div>
          <form>
            <div className="w-full px-3 mb-3">
              <label className="text-sm font-bold" htmlFor="">
                Recipient Email {''}
                <small className="font-light text-red-700">(Required)</small>
              </label>
              <input
                className="w-full rounded-md"
                type="email"
                name="email"
                id="email"
                placeholder="Recipient Email"
                // value={email ?? ''}
                // onChange={e => setEmail(e.target.value)}
                {...register('email')}
              />
              <p className="text-red-600 text-xs">{errors?.email?.message}</p>
            </div>
            <div className="w-full px-3 mb-3">
              <label className="text-sm font-bold" htmlFor="">
                Provider Email {''}
              </label>
              <input
                className="w-full rounded-md"
                type="email"
                name="provider_email"
                id="email"
                placeholder="Provider Email"
                {...register('provider_email')}
              />
            </div>
            <div className="w-full px-3 mb-3">
              <label className="text-sm font-bold" htmlFor="">
                LOA Attachment{' '}
                <small className="font-light text-red-700">
                  (Download this from the corporate system)
                </small>
              </label>
              <input
                className="w-full cursor-pointer file:bg-blue-600 file:text-white file:border-none file:px-3 file:py-1 file:rounded-md"
                type="file"
                name="upload_loa"
                id="upload_loa"
                multiple
                {...register('file')}
              />
              <p className="text-red-600 text-xs">{errors?.file?.message}</p>
            </div>
            <div className="w-full px-3 mb-3">
              {loatype?.toLowerCase() === LOATYPE.CONSULTATION && (
                <>
                  <div>
                    <input
                      className="inline-block mr-3"
                      type="radio"
                      name="email_format_type"
                      id="consultation"
                      value="consultation"
                      {...register('email_format_type')}
                    />
                    <label className="text-sm font-bold" htmlFor="consultation">
                      Consultaion
                    </label>
                  </div>
                  <div>
                    <input
                      className="inline-block mr-3"
                      type="radio"
                      name="email_format_type"
                      id="2n1-standalone"
                      value="2n1-standalone"
                      {...register('email_format_type')}
                    />
                    <label
                      className="text-sm font-bold"
                      htmlFor="2n1-standalone">
                      2 in 1
                    </label>
                  </div>
                </>
              )}

              {loatype?.toLowerCase() === LOATYPE.LABORATORY && (
                <>
                  <div>
                    <input
                      className="inline-block mr-3"
                      type="radio"
                      name="email_format_type"
                      id="laboratory"
                      value="laboratory"
                      {...register('email_format_type')}
                    />
                    <label className="text-sm font-bold" htmlFor="laboratory">
                      Laboratory
                    </label>
                  </div>
                  <div>
                    <input
                      className="inline-block mr-3"
                      type="radio"
                      name="email_format_type"
                      id="pre-approved-laboratory"
                      value="pre-approved-laboratory"
                      {...register('email_format_type')}
                    />
                    <label
                      className="text-sm font-bold"
                      htmlFor="pre-approved-laboratory">
                      Pre-approved Laboratory
                    </label>
                  </div>
                </>
              )}

              <p className="text-red-600 text-xs">
                {errors?.email_format_type?.message}
              </p>
            </div>
          </form>
          <div className="w-full px-3 mt-6">
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full font-bold tracking-widest rounded-md bg-blue-700 hover:bg-blue-900 uppercase text-white p-2"
              onClick={handleSubmit(data => handleSendFeedback(data))}>
              Send
            </button>
          </div>
        </div>
      </div>

      <BackdropComponent open={open} />
    </>
  )
}
