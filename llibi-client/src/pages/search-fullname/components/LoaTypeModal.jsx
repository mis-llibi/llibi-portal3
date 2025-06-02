import React, { useState, useEffect } from 'react'
import Head from 'next/head'

// Components | Layout
import ManualLayout from '@/components/Layouts/Upload-LOA/ManualLayout'
import Clock from 'react-live-clock'
import Input from '@/components/Input'
import Label from '@/components/Label'
import Button from '@/components/Button'
import ButtonText from '@/components/ButtonText'

// Logo
import ApplicationLogo from '@/components/ApplicationLogo'
import { useForm } from 'react-hook-form'

// Hooks
import { useUploadLOA } from '@/hooks/upload-loa/upload-loa'
import { FaX } from 'react-icons/fa6'



function LoaTypeModal({setLoaTypeModal, selectUser}) {

    const { register, handleSubmit, formState: {errors: error}, reset, watch, setValue  } = useForm({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(selectUser){
            setValue('client', selectUser)
        }
    }, [selectUser])

    const { validateClient } = useUploadLOA({})

    const submitLoaType = (data) => {
        // console.log(data)
        setLoading(true)

        validateClient({
            ...data,
            setLoading
        })
    }

  return (
    <div className='absolute inset-0 bg-black/30 flex justify-center items-center'>
      <div className='bg-white p-2 rounded-lg w-[30rem] '>
        <div className='flex justify-end'>
            <FaX className='text-black/30 cursor-pointer' onClick={() => setLoaTypeModal(false)} />
        </div>
        <form onSubmit={handleSubmit(submitLoaType)}>
        <Label className={'text-center'}>Request for LOA</Label>
            <div
                className={`my-2 flex gap-3 bg-gray-700 shadow rounded-md p-2 border-blue-200 flex-col md:flex-row`}>
                <div className="basis-1/2">
                    <div className="flex gap-2 items-center">
                        <input
                        type="radio"
                        {...register('typeLOA', {
                            required:
                            !watch('principalType') && '* Required',
                        })}
                        id="consultation"
                        value="consultation"
                        className={`w-3 h-3`}
                        />{' '}
                        <Label
                        htmlFor="consultation"
                        className="text-white">
                        Consultation{' '}
                        <span className="text-red-200 text-xs">
                            {error?.typeLOA?.message}
                        </span>
                        </Label>
                    </div>
                </div>
                <div className="basis-1/2">
                    <div className="flex gap-2 items-center">
                        <input
                        type="radio"
                        {...register('typeLOA')}
                        id="laboratory"
                        value="laboratory"
                        className="w-3 h-3"
                        />{' '}
                        <Label
                        htmlFor="laboratory"
                        className="text-white">
                        Laboratory
                        </Label>
                    </div>
                </div>
            </div>
            <div className='flex justify-center items-center'>
                <Button
                    loading={loading}
                    className="bg-blue-800 hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900">
                    <ButtonText
                    text="Submit and Proceed to Your Request"
                    loading={loading}
                    />
                </Button>
            </div>


        </form>
      </div>
    </div>
  )
}

export default LoaTypeModal
