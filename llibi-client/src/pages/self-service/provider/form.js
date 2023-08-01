import React from 'react'

import Label from '@/components/Label'
import Input from '@/components/Input'
import Button from '@/components/Button'
import ButtonText from '@/components/ButtonText'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useProvider } from '@/hooks/self-service/provider'

import { basePath } from '@/../next.config'

import Swal from 'sweetalert2'

const form = ({ setShow, setRequest, row }) => {
    const {
        handleSubmit,
        register,
        resetField,
        formState: { errors },
        watch,
    } = useForm()

    const [loading, setLoading] = useState(false)
    const [client, setClient] = useState(row)
    //const [request, setRequest] = useState()
    const { updateRequest } = useProvider()

    const submitForm = data => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, confirm',
        }).then(result => {
            if (result.isConfirmed) {
                setLoading(true)
                updateRequest({
                    setShow,
                    setRequest,
                    setClient,
                    setLoading,
                    ...data,
                })
            }
        })
    }

    useEffect(() => {
        resetField('updatedEmail')
    }, [watch('sendEmail')])

    const hospital = client?.providerName?.split('++')
    const doctor = client?.doctorName?.split('++')

    return (
        <form onSubmit={handleSubmit(submitForm)}>
            <input type="hidden" {...register('id')} value={client?.id || 0} />
            <input
                type="hidden"
                {...register('loaNumber')}
                value={client?.loaNumber || 0}
            />

            <div className="flex">
                <div className="basis-3/5">
                    <div className="flex flex-col h-screen">
                        {client?.loaAttachment && client?.status !== 4 ? (
                            <object
                                className="w-full h-full"
                                data={`${basePath}/${client?.loaAttachment}#toolbar=0`}
                                type="application/pdf"></object>
                        ) : (
                            <div className="flex flex-grow bg-black/30 justify-center place-items-center py-10">
                                No LOA attachment found
                            </div>
                        )}
                    </div>
                </div>

                {/* Patients personal & Membership information */}
                <div className="basis-2/5 m-4 p-2 rounded-md">
                    {/* Personal Details */}
                    <div className="mb-5">
                        <h2 className="text-md mb-2 w-full text-center">
                            {client?.isDependent ? 'DEPENDENT' : 'EMPLOYEE'}{' '}
                            DETAILS
                        </h2>
                        <div className="mb-3 border-b-2 border-dotted">
                            <Label className="text-bold text-sm">
                                FULL NAME:{' '}
                                <span
                                    className={`text-blue-500 ${
                                        client?.isDependent && 'hidden'
                                    }`}>
                                    {client?.lastName}, {client?.firstName}
                                </span>
                                <span
                                    className={`text-blue-500 ${
                                        !client?.isDependent && 'hidden'
                                    }`}>
                                    {client?.depLastName},{' '}
                                    {client?.depFirstName}
                                </span>
                            </Label>
                        </div>
                        <div className="mb-3 border-b-2 border-dotted">
                            <Label className="text-bold text-sm">
                                DATE OF BIRTH:{' '}
                                <span
                                    className={`text-blue-500 ${
                                        client?.isDependent && 'hidden'
                                    }`}>
                                    {client?.dob}
                                </span>
                                <span
                                    className={`text-blue-500 ${
                                        !client?.isDependent && 'hidden'
                                    }`}>
                                    {client?.depDob}
                                </span>
                            </Label>
                        </div>
                        <div className="mb-3 border-b-2 border-dotted">
                            <Label className="text-bold text-sm">
                                MEMBER ID:{' '}
                                <span
                                    className={`text-blue-500 ${
                                        client?.isDependent && 'hidden'
                                    }`}>
                                    {client?.memberID}
                                </span>
                                <span
                                    className={`text-blue-500 ${
                                        !client?.isDependent && 'hidden'
                                    }`}>
                                    {client?.depMemberID}
                                </span>
                            </Label>
                        </div>
                        <div className="mb-3 border-b-2 border-dotted">
                            <Label className="text-bold text-sm">
                                EMAIL:{' '}
                                <span className={`text-blue-500`}>
                                    {client?.email}
                                </span>
                            </Label>
                        </div>
                        <div className="mb-3 border-b-2 border-dotted">
                            <Label className="text-bold text-sm">
                                CONTACT #:{' '}
                                <span className={`text-blue-500`}>
                                    {client?.contact || 'NONE'}
                                </span>
                            </Label>
                        </div>
                        <div className="mb-3 border-b-2 border-dotted">
                            <Label className="text-bold text-sm">
                                COMPLAINT(S):{' '}
                                <span className={`text-red-500`}>
                                    {client?.complaint}
                                </span>
                            </Label>
                        </div>
                    </div>

                    {/* Memberhip Details */}
                    <div className="mb-5">
                        <h2 className="text-md mb-2 w-full text-center">
                            LOA STATUS
                        </h2>
                        <div className="mb-3 border-b-2 border-dotted">
                            <Label className="text-bold text-sm">
                                LOA NUMBER:{' '}
                                <span className={`text-blue-500`}>
                                    {client?.loaNumber || 'N/A'}
                                </span>
                            </Label>
                        </div>
                        <div className="mb-3 border-b-2 border-dotted">
                            <Label className="text-bold text-sm">
                                APPROVAL CODE:{' '}
                                <span className={`text-blue-500`}>
                                    {client?.approvalCode || 'N/A'}
                                </span>
                            </Label>
                        </div>
                        <div className="mb-3 border-b-2 border-dotted">
                            <Label className="text-bold text-sm">
                                STATUS:{' '}
                                <span
                                    className={`text-${
                                        (client?.status === 2 && 'orange') ||
                                        (client?.status === 3 && 'green') ||
                                        (client?.status === 4 && 'red')
                                    }-500`}>
                                    {client?.status === 2 && 'PENDING'}
                                    {client?.status === 3 && 'APPROVED'}
                                    {client?.status === 4 && 'DISAPPROVED'}
                                </span>
                            </Label>
                        </div>
                    </div>

                    {/* PROVIDER */}
                    <div className="mb-5">
                        <h2 className="text-md mb-2 w-full text-center">
                            PROVIDER INFORMATION
                        </h2>

                        {/* HOSPITAL */}
                        <div className="mb-3 border-b-2 border-dotted">
                            <Label className="text-bold text-md">
                                HOSPITAL/CLINIC:{' '}
                                <span className={`text-blue-500 uppercase`}>
                                    {hospital && hospital[0]}
                                    <input
                                        {...register('provider')}
                                        type="hidden"
                                        value={(hospital && hospital[0]) || ''}
                                    />
                                </span>
                                <br />
                                REGISTERED EMAIL:{' '}
                                <span className={`text-blue-500 uppercase`}>
                                    {(hospital && hospital[4]) || 'NONE'}
                                    <input
                                        {...register('registeredEmail')}
                                        type="hidden"
                                        value={(hospital && hospital[4]) || ''}
                                    />
                                </span>
                            </Label>
                        </div>

                        {/* DOCTOR */}
                        <div className={`mb-3 border-b-2 border-dotted`}>
                            <Label className="text-bold text-md">
                                DOCTOR NAME:{' '}
                                <span className={`text-blue-500 uppercase`}>
                                    {doctor && doctor[0]}
                                    <input
                                        {...register('docName')}
                                        type="hidden"
                                        value={(doctor && doctor[0]) || ''}
                                    />
                                </span>
                                <br />
                                SPECIALIZATION:{' '}
                                <span className={`text-blue-500 uppercase`}>
                                    {doctor && doctor[1]}
                                    <input
                                        {...register('specialization')}
                                        type="hidden"
                                        value={(doctor && doctor[1]) || ''}
                                    />
                                </span>
                            </Label>
                        </div>
                    </div>

                    {/* Memberhip Details FORM */}
                    <div className={`mb-5 ${client?.status !== 3 && 'hidden'}`}>
                        <input
                            type="hidden"
                            {...register('id')}
                            value={client?.id || 0}
                        />
                        <h2 className="mb-1 w-full text-center">
                            MANAGE REQUEST
                        </h2>
                        <div className="mb-3 border-b-2 border-dotted pb-1">
                            <Label className="text-bold text-md mb-2">
                                SET STATUS:
                            </Label>
                            <div className="flex">
                                <div className="basis-1/2 flex gap-2 items-center">
                                    <input
                                        type="radio"
                                        {...register('status', {
                                            required: true,
                                        })}
                                        id="setDiagnosisCompleted"
                                        value="1"
                                        className="w-4 h-4"
                                    />{' '}
                                    <Label
                                        htmlFor="setDiagnosisCompleted"
                                        className="text-xs text-green-800">
                                        INPUT DIAGNOSIS & SET AS COMPLETED
                                    </Label>
                                </div>
                                <div className="basis-1/2 flex gap-2 items-center">
                                    <input
                                        type="radio"
                                        {...register('status', {
                                            required: true,
                                        })}
                                        id="setCompleted"
                                        value="2"
                                        className="w-4 h-4"
                                    />{' '}
                                    <Label
                                        htmlFor="setCompleted"
                                        className="text-xs text-blue-900">
                                        DOWNLOAD LOA & SET AS COMPLETED
                                    </Label>
                                </div>
                            </div>
                            <span className="text-xs text-red-600 w-full text-center">
                                {errors?.status &&
                                    'Please select status of this request'}
                            </span>
                        </div>

                        {/* SEND EMAIL BOX */}
                        <div
                            className={`relative p-2 ${
                                watch('status') !== '1' && 'hidden'
                            }`}>
                            <div className="mb-3 border-b-2 border-dotted pb-1">
                                <div className="basis-1/2 flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        {...register('sendEmail')}
                                        id="sendEmail"
                                        value="1"
                                        className="w-4 h-4"
                                    />{' '}
                                    <Label
                                        htmlFor="sendEmail"
                                        className="text-xs">
                                        Send LOA directly to LLIBI for
                                        processing
                                    </Label>
                                </div>
                            </div>
                            <div
                                className={`mb-3 border-b-2 border-dotted pb-1 ${
                                    !watch('sendEmail') && 'hidden'
                                }`}>
                                <Label
                                    htmlFor="updatedEmail"
                                    className="text-bold text-xs">
                                    UPDATED EMAIL: LEAVE BLANK IF YOU WANT TO
                                    USE REGISTERED EMAIL ADDRESS
                                </Label>
                                <Input
                                    id="updatedEmail"
                                    type="email"
                                    register={{
                                        ...register('updatedEmail', {
                                            required:
                                                hospital &&
                                                !hospital[4] &&
                                                watch('sendEmail') === '1' &&
                                                'You dont have registered email, you must include your email address if you want to send LOA directly to LLIBI',
                                        }),
                                    }}
                                    disabled={
                                        watch('status') === '1' ? false : true
                                    }
                                    placeholder="PROVIDER'S UPDATED EMAIL ADDRESS"
                                    errors={errors?.updatedEmail}
                                />
                            </div>
                            <div className="mb-3 border-b-2 border-dotted pb-1">
                                <Label className="text-bold text-xs">
                                    DIAGNOSIS:
                                </Label>
                                <Input
                                    id="diagnosis"
                                    register={{
                                        ...register('diagnosis', {
                                            required:
                                                watch('status') === '1' &&
                                                `Patient's diagnosis is required`,
                                        }),
                                    }}
                                    disabled={
                                        watch('status') === '1' ? false : true
                                    }
                                    placeholder="PATIENT'S DIAGNOSIS"
                                    errors={errors?.diagnosis}
                                />
                            </div>

                            {/* Backdrop form */}
                            <div
                                className={`absolute inset-0 flex justify-center items-center z-10 bg-black/30 backdrop-blur-sm rounded-md ${
                                    watch('status') === '1' && 'hidden'
                                }`}>
                                <span className="text-white font-semibold"></span>
                            </div>
                        </div>

                        <div className="w-full text-center">
                            <Button
                                loading={loading}
                                className="mt-2 bg-green-600 hover:bg-green-700 active:bg-green-900 focus:outline-none focus:border-green-900">
                                <ButtonText
                                    text="Update Request"
                                    loading={loading}
                                />
                            </Button>
                        </div>
                    </div>

                    <div className="w-full text-center">
                        <Button
                            loading={loading}
                            className={`mt-2 bg-pink-500 hover:bg-pink-700 active:bg-pink-900 focus:outline-none focus:border-pink-900 hidden`}
                            disabled={client?.status !== 3 && true}>
                            <ButtonText
                                text="Submit Request"
                                loading={loading}
                            />
                        </Button>

                        <Button
                            loading={loading}
                            className={`mt-2 bg-pink-500 hover:bg-red-700 active:bg-pink-900 focus:outline-none focus:border-pink-900 hidden`}>
                            <ButtonText
                                text="Download LOA & Set as completed"
                                loading={loading}
                            />
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default form
