import React from 'react'

import Label from '@/components/Label'
import InputFile from '@/components/InputFile'
import Button from '@/components/Button'

import { useForm } from 'react-hook-form'

const modalUploadCertificateNumber = ({ upload, setLoading, setShow }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    const onUpload = data => {
        setLoading(true)
        upload({ ...data, setLoading, setShow, reset })
    }

    return (
        <>
            <form onSubmit={handleSubmit(onUpload)} className="w-full p-4">
                <div>
                    <Label className={'font-bold mb-1'} htmlFor="file">
                        Members For Approval (.xlsx, .xls or .csv)
                    </Label>
                    <InputFile
                        id="file"
                        register={register('file', {
                            required:
                                'Uploading certficate number requires excel file to import',
                        })}
                        type="file"
                        accept=".xlsx,.csv,.xls"
                        className="block mt-1 w-full"
                        errors={errors?.file}
                    />
                </div>
                <div>
                    <Button className="float-right mt-2 mb-2">
                        Upload To Approve Client
                    </Button>
                </div>
            </form>
        </>
    )
}

export default modalUploadCertificateNumber
