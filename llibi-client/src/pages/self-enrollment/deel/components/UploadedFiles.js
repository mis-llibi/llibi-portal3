import React from 'react'

import { ManageUploadedFiles } from '@/hooks/self-enrollment/ManageUploadedFiles'

import { basePath } from '@/../next.config'

import { RiDeleteBin2Line } from 'react-icons/ri'

import Swal from 'sweetalert2'

const UploadedFiles = ({ id, setLoading, reset }) => {
    const { files, removeFile } = ManageUploadedFiles({ id: id })

    const onImageError = ev => {
        ev.target.src = `${basePath}/pdf.png`
    }

    const onDelete = imageId => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are deleting this file, do you want to continue?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it',
        }).then(result => {
            if (result.isConfirmed) {
                setLoading(true)
                const props = {
                    imageId,
                    id,
                }
                removeFile({ ...props, setLoading, reset })
            }
        })
    }

    return (
        <div className="w-full p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files?.length > 0 ? (
                    files?.map((item, i) => {
                        return (
                            <div
                                key={i}
                                className="bg-blue-50 p-2 rounded-md shadow-sm">
                                <a
                                    onClick={() => onDelete(item?.id)}
                                    className="text-center">
                                    <RiDeleteBin2Line className="text-2xl cursor-pointer text-black transition-all duration-200 bg-red-100 hover:bg-red-300 rounded p-1 mb-1 float-right" />
                                </a>
                                <a
                                    href={`${basePath}/storage/${item?.file_link}`}
                                    target="_blank"
                                    key={i}
                                    className="bg-gray-200 w-full h-32 flex place-items-center cursor-pointer hover:shadow-md transition-all duration-200 ease-in truncate touch-pan-right grayscale hover:grayscale-0 scale-95 hover:scale-100 hover:origin-top">
                                    <img
                                        onError={onImageError}
                                        src={`${basePath}/storage/${item?.file_link}`}
                                    />
                                </a>
                                <div className="text-xs mt-2 font-bold text-center truncate">
                                    <p>{item?.file_name}</p>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center cols-span-2 md:col-span-4">
                        No uploaded files, upload first then try again
                    </div>
                )}
            </div>
        </div>
    )
}

export default UploadedFiles
