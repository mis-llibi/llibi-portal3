'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'


// Hooks
import { useUploadLOA } from '@/hooks/upload-loa/upload-loa'
import { useForm } from 'react-hook-form'

// Components
import ManualLayout from '@/components/Layouts/Upload-LOA/ManualLayout'
import ApplicationLogo from '@/components/ApplicationLogo'
import Clock from 'react-live-clock'
import Button from '@/components/Button'
import Swal from 'sweetalert2'
import Label from '@/components/Label'
import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'
import ButtonText from '@/components/ButtonText'
import Input from '@/components/Input'

// Icons
import { SlHome } from 'react-icons/sl'
// import FindProvider from './FindProvider'
import FindProvider from './FindProvider'




function Client() {


  const [loading, setLoading] = useState(false)
  const [request, setRequest] = useState()

  const [selectHospital, setSelectHospital] = useState()

  const router = useRouter()

  const loaType = router?.query?.loatype
  const refno = router?.query?.refno

  const complaint = [
    { value: 0, label: 'Back Pain / Body Pain' },
    { value: 1, label: 'Chest Pain' },
    { value: 2, label: 'Cough' },
    { value: 3, label: 'Cold, Flu-like symtoms' },
    { value: 4, label: 'Headache' },
    { value: 5, label: 'Urinary Complaints' },
    { value: 6, label: 'Ear Pain' },
    { value: 7, label: 'Highblood pressure' },
    { value: 8, label: 'Nausea' },
    { value: 9, label: 'Diarrhea' },
    { value: 10, label: 'Sore Throat' },
    { value: 11, label: 'Eye Conditions' },
    { value: 12, label: 'Skin Conditions' },
    { value: 13, label: 'Menstrual Pain' },
    { value: 14, label: 'Abdominal Pain' },
    { value: 15, label: 'Joint Pain' },
    { value: 16, label: 'Mass / Lump' },
    { value: 17, label: 'Pre and Post natal consultation' },
    { value: 18, label: 'Allergies' },
    { value: 19, label: 'Dizziness' },
    { value: 20, label: 'Fever' },
  ]

  const { getRequest, updateRequest } = useUploadLOA({})
  const { show, setShow, body, setBody, toggle } = ModalControl()

  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { errors },
    reset,
    watch
  } = useForm()


  useEffect(() => {

    if(loaType !== undefined && refno !== undefined){
        setLoading(true)
        getRequest({ setLoading, setRequest, loaType, refno })
        setValue('refno', refno)
    }


  }, [loaType, refno])



  const findProvider = () => {
    setBody({
      title:
        `Find client's preferred accredited provider (Hospital / Clinic / Doctor)`,
      content: (
        <FindProvider
            setShow={setShow}
            setSelectHospital={setSelectHospital}
        />
      ),
      modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
      modalContainer: 'h-full rounded-md',
      modalBody: 'h-full',
    })
    toggle()
  }

  useEffect(() => {
    if(selectHospital){
        setValue(
            'provider',
            `${selectHospital?.id} || ${selectHospital?.name}++${
                selectHospital?.address
            }++${selectHospital?.city}++${selectHospital?.state}++${
                selectHospital?.email1
            }`
        )
    }
  }, [selectHospital])

  const file = watch('file')

  useEffect(() => {
    if(file && file.length > 0){
        const fileNameWithoutExtension = file[0].name.replace(/\.[^/.]+$/, "")
        setValue("loaNumber", fileNameWithoutExtension);
    }
  }, [file, setValue])


  const submitUploadLOA = (data) => {

    setLoading(true)

    updateRequest({
        ...data,
        setLoading,
        setRequest,
        reset
    })

  }




  return (
    <>
    {loaType && refno && (
        <>
        <ManualLayout>
            <Head>
                <title>LLIBI PORTAL - UPLOAD</title>
            </Head>

            <div className='px-2 py-10 flex justify-center items-center'>
                <div className='bg-white w-full rounded-2xl p-2 md:py-5 md:px-7 lg:w-3/4'>
                    <div className='flex flex-col justify-center items-center md:flex-row md:justify-between'>
                        <ApplicationLogo width={200} />
                        <div>
                            <p className='font-bold text-blue-900 text-center md:text-right text-lg lg:text-xl'>Manual Upload LOA</p>
                            <p className='font-bold text-sm text-shadow-lg text-gray-700 text-center md:text-right'>
                                <Clock
                                format={'dddd, MMMM Do, YYYY, h:mm:ss A'}
                                ticking={true}
                                timezone={'Asia/Manila'}
                                />
                            </p>
                        </div>
                    </div>
                    <hr className="my-2 mb-3 border-b-4 shadow border-blue-900 rounded-lg"></hr>

                    <form onSubmit={handleSubmit(submitUploadLOA)}>
                        <div className='relative'>
                            <div className='border-1 rounded-lg shadow-md mb-4 py-2 md:py-4 px-5 text-center md:text-start'>
                                {request?.isDependent ? (
                                    <>
                                    <p className='text-md'>Hi, you are uploading <span className='font-semibold capitalize'>{request?.depFirstName?.toLowerCase()} {request?.depLastName?.toLowerCase()}</span>'s LOA </p>
                                    </>
                                ) : (
                                    <>
                                    <p className='text-md'>Hi, you are uploading <span className='font-semibold capitalize'>{request?.firstName?.toLowerCase()} {request?.lastName?.toLowerCase()}</span>'s LOA </p>
                                    </>
                                )}
                            </div>

                            <ol className="p-2 md:p-4 shadow-md rounded-md border mb-4">

                                <li>
                                    <Label
                                        htmlFor="attachment"
                                        className="text-blue-500 text-bold mb-2">
                                        Attach LOA
                                    </Label>
                                    <div className="w-full border-b-2 border-dotted mb-2"></div>
                                    <input type="file" id='attachment' className='border-2 border-black/10 rounded-lg w-full p-2'
                                        accept='.pdf'
                                        {...register("file", {
                                            required: "You must upload the Client's LOA",
                                            validate: (files) => {
                                            const file = files[0];
                                            if (file?.type !== "application/pdf") {
                                                Swal.fire({
                                                title: "Invalid File",
                                                text: "Upload PDF Only",
                                                icon: "warning",
                                                });
                                                return "Only PDF files are allowed.";
                                            }
                                            return true;
                                            },
                                        })}
                                    />
                                    <span className="ml-2 text-red-500 text-xs font-semibold">
                                        {errors?.file?.message}
                                    </span>
                                </li>

                                <li className='mt-2 mb-4'>
                                    <Label
                                        htmlFor="loa_number"
                                        className="text-blue-500 text-bold mb-2">
                                        LOA Number
                                    </Label>
                                    <div className="w-full border-b-2 border-dotted mb-2"></div>
                                    <Input
                                    id="loaNumber"
                                    register={register('loaNumber')}
                                    disabled
                                    placeholder="LOA Number"
                                    errors={errors?.loaNumber}
                                    />
                                </li>

                                <li className='mt-2'>
                                    <Label
                                        htmlFor="preferredProvider"
                                        className="text-blue-500 text-bold mb-2">
                                        Find client's preferred accredited provider{' '}
                                        <b>(Hospital / Clinic)</b>
                                    </Label>
                                    <div className="w-full border-b-2 border-dotted mb-3"></div>
                                    <a
                                        className="px-6 py-2 text-sm transition duration-200 ease-in-out bg-gradient-to-r from-cyan-300 to-blue-300 hover:bg-gradient-to-l transform hover:-translate-y-1 hover:scale-110 hover:shadow-sm cursor-pointer rounded-md"
                                        onClick={() => findProvider()}>
                                        Find and select your preferred provider
                                    </a>
                                    <input
                                        type="hidden"
                                        {...register('provider', {
                                        required:
                                            'You must select Hospital or Clinic to complete the assessment',
                                        })}
                                    />
                                    <span className="ml-2 text-red-500 text-xs font-semibold">
                                        {errors?.provider?.message}
                                    </span>
                                    <div
                                        className={`flex mt-4 p-2 border border-1 border-gray-400 border-dashed bg-gray-100 ${
                                        !selectHospital && 'hidden'
                                        }`}>
                                        <div className="basis-1/2 text-sm">
                                        <p className="font-bold mb-1">
                                            Hospital / Clinic:{' '}
                                            <span className="font-normal">
                                            {selectHospital?.name}
                                            </span>
                                        </p>
                                        <p className="font-bold mb-1">
                                            Address:{' '}
                                            <span className="font-normal">
                                            {selectHospital?.address}
                                            </span>
                                        </p>
                                        <p className="font-bold mb-1">
                                            City:{' '}
                                            <span className="font-normal">
                                            {selectHospital?.city}
                                            </span>
                                        </p>
                                        <p className="font-bold mb-1">
                                            State:{' '}
                                            <span className="font-normal">
                                            {selectHospital?.state}
                                            </span>
                                        </p>
                                        </div>
                                    </div>
                                </li>

                            </ol>

                            <div className="w-full text-center grid gap-2 grid-cols-2">
                                <Button
                                loading={loading}
                                className="mr-2 bg-blue-800 hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900">
                                <ButtonText text="Submit Request" loading={loading} />
                                </Button>

                                <Link href="/">
                                <Button className="bg-red-300 hover:bg-red-600 active:bg-red-700 cursor-pointer">
                                    <SlHome className="mr-2" />
                                    <span>Go Back to Home Page</span>
                                </Button>
                                </Link>
                            </div>



                            {/* Backdrop form */}
                            <div
                                className={`absolute inset-0 flex justify-center items-center z-10 bg-black/70 backdrop-blur-sm rounded-md ${
                                request?.status && request?.status === 1 && 'hidden'
                                }`}>
                                <span className="text-white font-semibold">
                                {request?.status ? (
                                    <div className="text-center">
                                    Your request has been submitted, your reference # is{' '}
                                    <span className="text-orange-300">{refno}</span>
                                    . <br /> We will notify you through the email and mobile
                                    number you provided.
                                    <br />
                                    <br />
                                    <Link href="/search-fullname">
                                        <Button className="bg-red-300 hover:bg-red-600 active:bg-red-700 cursor-pointer">
                                        <SlHome className="mr-2" />
                                        <span>Go Back to Home Page</span>
                                        </Button>
                                    </Link>
                                    </div>
                                ) : loading ? (
                                    <>Loading data, please wait a moment...</>
                                ) : (
                                    <>
                                    We cannot find you in our database, please go back to the
                                    member's form.
                                    </>
                                )}
                                </span>
                            </div>
                        </div>

                    </form>

                </div>
            </div>


        </ManualLayout>
        </>
    )}


      <Modal show={show} body={body} toggle={toggle} />
    </>
  )
}

export default Client
