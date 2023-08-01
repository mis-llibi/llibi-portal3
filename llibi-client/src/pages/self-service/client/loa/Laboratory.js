import React from 'react'
import Link from 'next/link'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import Label from '@/components/Label'
import Input from '@/components/Input'
import InputMask from '@/components/InputMask'

import Button from '@/components/Button'
import ButtonText from '@/components/ButtonText'

import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'

import { useClient } from '@/hooks/self-service/client'

import ProviderLookupForm from './ProviderLookupForm'

import Swal from 'sweetalert2'

import { SlHome } from 'react-icons/sl'

import { useDropzone } from 'react-dropzone'
import { basePath } from '@/../next.config'

const RequestForLoaLaboratory = ({ refno, loatype }) => {
    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors, dirtyFields },
    } = useForm()

    const [loading, setLoading] = useState(false)
    const [request, setRequest] = useState()
    const { getRequest, updateRequest } = useClient()

    useEffect(() => {
        setLoading(true)
        getRequest({ setLoading, setRequest, refno })
    }, [])

    const submitForm = data => {
        Swal.fire({
            title: 'Are you sure?',
            text:
                'Once you click Submit, you will not be able to make any further changes to your LOA request. ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, confirm',
        }).then(result => {
            if (result.isConfirmed) {
                const ndata = {
                    ...data,
                    attachLab: files,
                }
                //Swal.fire('Submitted!', 'Your file has been deleted.', 'success')
                setLoading(true)
                updateRequest({ setRequest, setLoading, ...ndata })
            }
        })
    }

    const { show, setShow, body, setBody, toggle } = ModalControl()

    const [selectedHospital, setSelectedHospital] = useState()
    const [selectedDoctor, setSelectedDoctor] = useState()

    const findProvider = () => {
        setBody({
            title:
                'Find your preferred accredited provider (Hospital / Clinic)',
            content: (
                <ProviderLookupForm
                    setShow={setShow}
                    setSelectedHospital={setSelectedHospital}
                    setSelectedDoctor={setSelectedDoctor}
                />
            ),
            modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
            modalContainer: 'h-full rounded-md',
            modalBody: 'h-full',
        })
        toggle()
    }

    useEffect(() => {
        if (selectedHospital)
            setValue(
                'provider',
                `${selectedHospital?.id}||${selectedHospital?.name}++${
                    selectedHospital?.address
                }++${selectedHospital?.city}++${selectedHospital?.state}++${
                    selectedHospital?.email1
                }--${selectedDoctor?.id || 0}||${selectedDoctor?.last || ''}, ${
                    selectedDoctor?.first || ''
                }++${selectedDoctor?.specialization || ''}`,
            )
    }, [selectedHospital, selectedDoctor])

    //DROPZONE
    const thumbsContainer = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16,
    }

    const thumb = {
        display: 'inline-flex',
        borderRadius: 6,
        border: '1px solid #eaeaea',
        boxShadow: '2px 2px 2px #d6d6d6',
        marginBottom: 8,
        marginRight: 8,
        width: 105,
        height: 150,
        padding: 4,
        boxSizing: 'border-box',
    }

    const thumbInner = {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden',
    }

    const img = {
        borderRadius: 6,
        display: 'block',
        width: 'auto',
        height: '100%',
    }

    const onImageError = ev => {
        ev.target.src = `${basePath}/pdf.webp`
    }

    const [files, setFiles] = useState([])
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': [],
            'application/pdf': [],
        },
        onDrop: acceptedFiles => {
            setFiles(
                acceptedFiles.map(file =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    }),
                ),
            )
        },
    })

    const thumbs = files?.map(file => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                <img
                    src={file.preview}
                    style={img}
                    onError={onImageError}
                    // Revoke data uri after image is loaded
                    onLoad={() => {
                        URL.revokeObjectURL(file.preview)
                    }}
                />
            </div>
        </div>
    ))

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => files?.forEach(file => URL.revokeObjectURL(file?.preview))
    }, [])

    return (
        <>
            {/* Action Form */}
            <form onSubmit={handleSubmit(submitForm)}>
                <input type="hidden" {...register('refno')} value={refno} />
                <input type="hidden" {...register('loaType')} value={loatype} />

                <div className="relative">
                    <p className="p-2 md:p-4 mb-4 bg-gray-100 shadow rounded-md">
                        Hi{' '}
                        <span className="font-semibold capitalize">
                            {request?.firstName?.toLowerCase()}{' '}
                            {request?.lastName?.toLowerCase()}
                        </span>
                        <span
                            className={`${!request?.isDependent && 'hidden'}`}>
                            , you are requesting for your dependent{' '}
                            <span className="font-semibold capitalize">
                                {request?.depFirstName?.toLowerCase()}{' '}
                                {request?.depLastName?.toLowerCase()}
                            </span>
                        </span>
                        , Kindly answer the following:
                    </p>

                    <ol className="p-2 md:p-4 shadow-md rounded-md border mb-4">
                        {/* Upload File */}
                        {/* <li className="pb-2">
                            <Label
                                htmlFor="attachLab"
                                className="text-blue-500 text-bold mb-2">
                                Attach your Doctor’s Request for Laboratory
                                (with Diagnosis)
                            </Label>
                            <div className="w-full border-b-2 border-dotted mb-2"></div>
                            <InputFile
                                id="attachLab"
                                register={{
                                    ...register('attachLab', {
                                        required:
                                            'Please attach your doctors prescription here',
                                    }),
                                }}
                                multiple
                                type="file"
                                accept="image/*"
                                className="w-full"
                                placeholder="Laboratory Attachment"
                                errors={errors?.attachLab}
                            />
                        </li> */}

                        <li className="pb-2">
                            <Label
                                htmlFor="attachLab"
                                className="text-blue-500 text-bold mb-2">
                                Attach your Doctor’s Request for Laboratory
                                (with Diagnosis)
                            </Label>
                            <div
                                {...getRootProps({
                                    className:
                                        'dropzone w-full text-center bg-gray-200 py-3 rounded-lg shadow-md cursor-pointer border-2 border-gray-500 border-dashed',
                                })}>
                                <input id="attachLab" {...getInputProps()} />
                                <p>
                                    Drag & drop some files here, or click to
                                    select files
                                </p>
                            </div>
                            <aside style={thumbsContainer}>{thumbs}</aside>
                            <div
                                className={`text-xs text-red-600 text-center font-bold mb-2 ${
                                    files.length > 0 && 'hidden'
                                }`}>
                                No Image/PDF attachment yet
                            </div>
                        </li>

                        {/* Provider */}
                        <li className="mt-2 mb-4">
                            <Label
                                htmlFor="preferredProvider"
                                className="text-blue-500 text-bold mb-2">
                                Find your preferred accredited provider{' '}
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
                                className={`flex-none mt-4 p-2 border border-1 border-gray-400 border-dashed bg-gray-100 ${
                                    !selectedHospital && 'hidden'
                                }`}>
                                <div className="basis-1/2 text-sm">
                                    <p className="font-bold mb-1">
                                        Hospital / Clinic:{' '}
                                        <span className="font-normal">
                                            {selectedHospital?.name}
                                        </span>
                                    </p>
                                    <p className="font-bold mb-1">
                                        Address:{' '}
                                        <span className="font-normal">
                                            {selectedHospital?.address}
                                        </span>
                                    </p>
                                    <p className="font-bold mb-1">
                                        City:{' '}
                                        <span className="font-normal">
                                            {selectedHospital?.city}
                                        </span>
                                    </p>
                                    <p className="font-bold mb-1">
                                        State:{' '}
                                        <span className="font-normal">
                                            {selectedHospital?.state}
                                        </span>
                                    </p>
                                </div>
                                {/*  <div
                                    className={`basis-1/2 text-sm border-l-2 pl-2 flex items-center ${
                                        !selectedDoctor && 'justify-center'
                                    }`}>
                                    <div
                                        className={`text-red-600 font-semibold ${
                                            selectedDoctor && 'hidden'
                                        }`}>
                                        No doctor selected
                                    </div>
                                    <div
                                        className={`capitalize ${
                                            !selectedDoctor && 'hidden'
                                        }`}>
                                        <p className="font-bold mb-1">
                                            Doctor:{' '}
                                            <span className="font-normal">
                                                {selectedDoctor?.last},{' '}
                                                {selectedDoctor?.first}
                                            </span>
                                        </p>
                                        <p className="font-bold mb-1">
                                            Specialization:{' '}
                                            <span className="font-normal">
                                                {selectedDoctor?.specialization}
                                            </span>
                                        </p>
                                    </div>
                                </div> */}
                            </div>
                        </li>

                        {/* Email Address */}
                        <li>
                            <div className="grid lg:grid-cols-2 gap-2">
                                <div>
                                    <Label
                                        htmlFor="email"
                                        className="text-blue-500 text-bold mb-2 lg:text-xs">
                                        Please provide us your email address for
                                        the LOA and other notification
                                    </Label>
                                    <div className="w-full border-b-2 border-dotted mb-2"></div>
                                    <div className="mb-3">
                                        <Input
                                            id="email"
                                            register={{
                                                ...register('email', {
                                                    required:
                                                        'This is required so we can send the LOA to your email address',
                                                }),
                                            }}
                                            type="email"
                                            placeholder="Email address"
                                            errors={errors?.email}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label
                                        htmlFor="altEmail"
                                        className="text-blue-500 text-bold mb-2 lg:text-xs">
                                        Alternate Email (Optional)
                                    </Label>
                                    <div className="w-full border-b-2 border-dotted mb-2"></div>
                                    <div className="mb-3">
                                        <Input
                                            id="altEmail"
                                            register={{
                                                ...register('altEmail'),
                                            }}
                                            type="altEmail"
                                            placeholder="Alternate Email address"
                                            errors={errors?.altEmail}
                                        />
                                    </div>
                                </div>
                            </div>
                        </li>

                        {/* Mobile Number */}
                        <li>
                            <Label
                                htmlFor="contact"
                                className="text-blue-500 text-bold mb-2">
                                We can also notify you thru SMS (Approval /
                                Disapproval, LOA Number, Approval code){' '}
                                {/* <span className="text-orange-800">
                                    *Optional
                                </span> */}
                            </Label>
                            <div className="w-full border-b-2 border-dotted mb-2"></div>
                            <div className="mb-3 md:w-3/6">
                                <InputMask
                                    id="contact"
                                    register={{
                                        ...register('contact'),
                                    }}
                                    placeholder="Contact number"
                                    errors={errors?.contact}
                                />
                            </div>
                        </li>
                    </ol>

                    <div className="w-full text-center grid gap-2 grid-cols-2">
                        <Button
                            loading={loading}
                            className="mr-2 bg-blue-800 hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900">
                            <ButtonText
                                text="Submit Request"
                                loading={loading}
                            />
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
                                    Your request has been submitted, your
                                    reference # is{' '}
                                    <span className="text-orange-300">
                                        {refno}
                                    </span>
                                    . <br /> We will notify you through the
                                    email and mobile number you provided.
                                    <br />
                                    <br />
                                    <Link href="/">
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
                                    We cannot find you in our database, please
                                    go back to the member's form.
                                </>
                            )}
                        </span>
                    </div>
                </div>
            </form>

            <Modal show={show} body={body} toggle={toggle} />
        </>
    )
}

export default RequestForLoaLaboratory
