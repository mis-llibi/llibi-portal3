import React, {useState} from 'react'
import Head from 'next/head'
import ProviderLayout from '@/components/Layouts/Self-service/ProviderLayout'
import ApplicationLogo from '@/components/ApplicationLogo'

import Clock from 'react-live-clock'
import Dropdown from '@/components/Dropdown'
import { DropdownButton } from '@/components/DropdownLink'
import { useAuth } from '@/hooks/auth'
import Label from '@/components/Label'
import InputSelect from '@/components/InputSelect'
import { useForm } from 'react-hook-form'
import Input from '@/components/Input'
import { useManageComplaint } from '@/hooks/self-service/manage-complaint'
import Swal from 'sweetalert2'


function Page() {

    const [searchStatus, setSearchStatus] = useState({ status: null, page: 1, search: "" })
    const [loading, setLoading] = useState(false)

    const { user, logout } = useAuth({
      middleware: 'auth',
    })

    const { complaints, isLoading, approveStatus, deleteStatus, editComplaint } = useManageComplaint({
        status: searchStatus?.status,
        page: searchStatus?.page || 1,
        search: searchStatus?.search
    })



    const checkRequestStatus = data => {
        setSearchStatus({
        status: data?.value,
        page: 1   // reset to first page when changing filter
        });
    }

    const status = [
        { value: 1, label: 'Pending' },
        { value: 2, label: 'Approve' },
        { value: 3, label: 'All Status' },
    ]



    const {
        handleSubmit,
        register,
        control,
        formState: { errors },
    } = useForm()

    const handleApproveStatus = (id) => {
        Swal.fire({
            title: "Approve Complaint?",
            text: "Are you sure you want to approve this complaint?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, approve it",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {

                // OPTIONAL: show loading inside Swal
                Swal.fire({
                    title: "Processing...",
                    text: "Please wait",
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading(),
                })

                approveStatus({
                    setLoading,
                    id
                })
            }
        })
    }

    const handleDeleteStatus = (id) => {
        Swal.fire({
            title: "Delete Complaint?",
            text: "Are you sure you want to delete this complaint?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {

                // OPTIONAL: show loading inside Swal
                Swal.fire({
                    title: "Processing...",
                    text: "Please wait",
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading(),
                })

                deleteStatus({
                    setLoading,
                    id
                })
            }
        })
    }

    const handleEditComplaint = async(data) => {
        const {value: editedComplaint} = await Swal.fire({
            title: "Edit Complaint",
            input: "text",
            inputLabel: "New Complaint",
            inputValue: data.title,
            showCancelButton: true,
            inputValidator: (value) => {
                if(!value){
                    return "You need to fill this field"
                }
                if(value == data.title){
                    return "Value and Title is same"
                }
            }
        })

        if(editedComplaint){
            Swal.fire({
                title: "Edit Complaint?",
                text: "Are you sure you want to edit this complaint?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, change it",
                cancelButtonText: "Cancel",
            }).then(async (result) => {
                if (result.isConfirmed) {

                    // OPTIONAL: show loading inside Swal
                    Swal.fire({
                        title: "Processing...",
                        text: "Please wait",
                        allowOutsideClick: false,
                        didOpen: () => Swal.showLoading(),
                    })

                    editComplaint({
                        id: data.id,
                        editedComplaint
                    })
                }
            })
        }
    }




  return (
    <>
    <ProviderLayout>
        <Head>
            <title>LLIBI PORTAL - MANAGE COMPLAINT</title>
        </Head>

        <div className='py-12'>
            <div className='max-w-7xl mx-auto sm:px-6 lg:px-8'>
                <div className="p-6 bg-white border-b border-gray-300 shadow-sm sm:rounded-lg">
                    <div className="flex-none md:flex gap-5 font-bold text-xl text-gray-900">
                        <ApplicationLogo width={200} />
                        <div className="my-auto w-full">
                            <div className="w-full text-center md:text-right">
                                <p className='text-blue-900'>
                                    Manage Complaint
                                    {/* <span className="text-blue-900">Client Care Portal</span> */}
                                </p>
                                <p className="text-sm text-shadow-lg text-gray-700">
                                    <Clock
                                    format={'dddd, MMMM Do, YYYY, h:mm:ss A'}
                                    ticking={true}
                                    timezone={'Asia/Manila'}
                                    />
                                </p>
                                <div className="flex justify-end">
                                    <Dropdown
                                    align="right"
                                    width="48"
                                    trigger={
                                        <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                                        <div className="capitalize">
                                            {user?.last_name + ', ' + user?.first_name}
                                        </div>

                                        <div className="ml-1">
                                            <svg
                                            className="fill-current h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                            </svg>
                                        </div>
                                        </button>
                                    }>
                                    {/* Authentication */}
                                    <DropdownButton onClick={logout}>Logout</DropdownButton>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-2 mb-3 border-b-4 shadow border-blue-900 rounded-lg"></hr>

                    <div className="flex mb-5 gap-1 items-center justify-start">
                        <div className="basis-1/3 mb-2">
                        <Label htmlFor="status" className="text-blue-500 text-bold">
                            Complaint Status
                        </Label>
                        <InputSelect
                            id="searchStatus"
                            label="All Complaints"
                            onChange={e => checkRequestStatus(e)}
                            required={false}
                            register={{
                            ...register('searchStatus'),
                            }}
                            errors={errors?.searchStatus}
                            control={control}
                            option={status}
                        />
                        </div>
                        <div className="basis-1/3 mb-2">
                            <Label htmlFor="complaint" className="text-blue-500 text-bold">
                                Complaint
                            </Label>
                            <Input
                                id="complaint"
                                placeholder="Search for Complaint"
                                onChange={e =>
                                    setSearchStatus(prev => ({
                                        ...prev,
                                        search: e.target.value,
                                        page: 1 // reset when searching
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <table className='table-auto w-full'>
                        <thead className='bg-gray-100'>
                            <tr>
                                <th className="border border-gray-300 p-2 text-left">
                                    ID
                                </th>
                                <th className="border border-gray-300 p-2 text-left">
                                    COMPLAINT
                                </th>
                                <th className="border border-gray-300 p-2 text-center">
                                    STATUS
                                </th>
                                <th className="border border-gray-300 p-2 text-left">

                                </th>
                            </tr>
                        </thead>
                            <tbody>
                                {/* Loading State */}
                                {isLoading && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-center border p-4 text-blue-600 font-semibold bg-blue-50 animate-pulse"
                                        >
                                            Loading complaints...
                                        </td>
                                    </tr>
                                )}

                                {/* When loaded and has data */}
                                {!isLoading && complaints?.data?.length > 0 &&
                                    complaints.data.map((row, i) => (
                                        <tr key={i}>
                                            <td className="border border-gray-300 p-2">{row.id}</td>
                                            <td className="border border-gray-300 p-2">{row.title}</td>
                                            <td className="border border-gray-300 p-2 ">
                                                <div className='flex justify-center'>
                                                    <span className={`${row.is_status == 0 ? "bg-yellow-500" : "bg-green-500"} p-2 rounded text-white`}>
                                                        {row.is_status == 0 && "Pending"}
                                                        {row.is_status == 1 && "Approved"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 p-2 ">
                                                <div className='flex justify-center gap-2'>
                                                    <span className={`p-2 rounded border border-black/50 cursor-pointer ${row.is_status == 1 && 'hidden'}`}
                                                        onClick={() => handleApproveStatus(row.id)}
                                                    >
                                                        Approve
                                                    </span>
                                                    <span className={`p-2 rounded border border-black/50 cursor-pointer ${row.is_status == 1 && 'hidden'}`}
                                                        onClick={() => handleEditComplaint(row)}
                                                    >
                                                        Edit
                                                    </span>
                                                    <span className='p-2 rounded border border-black/50 cursor-pointer'
                                                        onClick={() => handleDeleteStatus(row.id)}
                                                    >
                                                        Delete
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }

                                {/* No Results */}
                                {!isLoading && complaints?.data?.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="text-center border bg-red-50 p-2 font-semibold"
                                        >
                                            No Complaints Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                    </table>
                    {complaints && complaints?.data?.length > 0 && (
                    <div className="flex justify-between mt-4">

                        {/* Previous Button */}
                        <button
                            disabled={isLoading || !complaints?.prev_page_url}
                            onClick={() => setSearchStatus(prev => ({ ...prev, page: complaints.current_page - 1 }))}
                            className={`px-3 py-1 rounded border ${
                                isLoading || !complaints?.prev_page_url
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-100"
                            }`}
                        >
                            Previous
                        </button>

                        {/* Page Indicator */}
                        <div className="px-3 py-1">
                        Page {complaints.current_page} of {complaints.last_page}
                        </div>

                        {/* Next Button */}
                        <button
                            disabled={isLoading || !complaints?.next_page_url}
                            onClick={() => setSearchStatus(prev => ({ ...prev, page: complaints.current_page + 1 }))}
                            className={`px-3 py-1 rounded border ${
                                isLoading || !complaints?.next_page_url
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-white hover:bg-gray-100"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                    )}
                </div>
            </div>
        </div>



    </ProviderLayout>


    </>
  )
}

export default Page
