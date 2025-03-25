import React, { useState, useEffect } from 'react'

import { useManageEnrollee } from '@/hooks/members/ManageEnrollee'

import ModalUpdateEnrollee from '@/pages/members/components/modalUpdateEnrollmentAdmin'
import ModalViewEnrollee from '@/pages/members/components/modalViewEnrollee'
import ModalMemberCorrection from '@/pages/members/components/modalMemberCorrection'

import Swal from 'sweetalert2'

import { SlUserFollow, SlEye, SlPeople } from 'react-icons/sl'
import Button from '@/components/Button'

import DataGrid from '@/components/DataGrid'

const pageEnrollmentAdmin = ({ props }) => {
    const [status, setStatus] = useState()

    const {
        enrollees,
        updateEnrollmentStatus,
        approveCancellation,
        forMemberCorrection,
    } = useManageEnrollee({
        selection: props?.selection,
    })

    const editEnrollment = data => {
        props?.setBody({
            title: `Updating Enrollment: ${
                data?.first_name + ' ' + data?.last_name
            }`,
            content: (
                <ModalUpdateEnrollee
                    data={data}
                    updateEnrollmentStatus={updateEnrollmentStatus}
                    loading={props?.loading}
                    setLoading={props?.setLoading}
                    setShow={props?.setShow}
                />
            ),
            modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
            modalContainer: 'h-full',
            modalBody: 'h-full',
        })
        props?.toggle()
    }

    const viewEnrollee = data => {
        props?.setBody({
            title: `Viewing Information of: ${
                data?.first_name + ' ' + data?.last_name
            }`,
            content: (
                <ModalViewEnrollee
                    data={data}
                    update={0}
                    loading={props?.loading}
                    setLoading={props?.setLoading}
                    setShow={props?.setShow}
                />
            ),
            modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
            modalContainer: 'h-full',
            modalBody: 'h-full',
        })
        props?.toggle()
    }

    const setApproveCancellation = () => {
        if (selectionModel.length) {
            //console.log(selectionModel)
            Swal.fire({
                title: 'Are you sure?',
                text:
                    "You are approving this membership cancellation, you can't revert it",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, cancel membership',
            }).then(result => {
                if (result.isConfirmed) {
                    props?.setLoading(true)
                    approveCancellation({
                        selected: selectionModel,
                        setLoading: props?.setLoading,
                    })
                }
            })
        } else {
            Swal.fire(
                'No Selected Member',
                "You haven't selected a member, pelase select by ticking checkbox then continue",
                'question',
            )
        }
    }

    const memberCorrection = data => {
        props?.setBody({
            title: `Member For Correction: ${
                data?.first_name + ' ' + data?.last_name
            }`,
            content: (
                <ModalMemberCorrection
                    data={data}
                    forMemberCorrection={forMemberCorrection}
                    loading={props?.loading}
                    setLoading={props?.setLoading}
                    setShow={props?.setShow}
                />
            ),
            modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
            modalContainer: 'h-full',
            modalBody: 'h-full',
        })
        props?.toggle()
    }

    //DATA GRID COLUMN HEADER
    const [selectionModel, setSelectionModel] = useState([])
    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        {
            field: 'employee_no',
            headerName: 'Emp No.',
            width: 100,
        },
        {
            field: 'last_name',
            headerName: 'Last Name',
            width: 160,
        },
        {
            field: 'first_name',
            headerName: 'First Name',
            width: 160,
        },
        {
            field: 'birth_date',
            headerName: 'Birth Date',
            width: 100,
        },
        {
            field: 'relationship_id',
            headerName: 'Relation',
            width: 110,
        },
        {
            field: 'reg_date',
            headerName: 'Regular',
            width: 100,
        },
        {
            field: 'effective_date',
            headerName: 'Effective',
            width: 100,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
        },
        {
            field: 'action',
            headerName: 'Action',
            sortable: false,
            width: 100,
            align: 'center',
            renderCell: ({ row }) => {
                if (props?.selection == 2) {
                    //If pending enrollment show edit & delete
                    return (
                        <>
                            <SlUserFollow
                                className="cursor-pointer text-3xl bg-orange-200 hover:bg-orange-400 p-1 rounded-md mr-2 transition duration-200"
                                onClick={() => editEnrollment(row)}
                                title="Update Enrollment Status"
                            />
                        </>
                    )
                } else if (props?.selection == 7) {
                    return (
                        <>
                            <SlEye
                                className="cursor-pointer text-3xl bg-blue-200 hover:bg-blue-400 p-1 rounded-md transition duration-200 mr-2"
                                onClick={() => viewEnrollee(row)}
                                title="View Member Info"
                            />
                            <SlPeople
                                className="cursor-pointer text-3xl bg-green-200 hover:bg-green-400 p-1 rounded-md transition duration-200"
                                onClick={() => memberCorrection(row)}
                                title="Member Correction"
                            />
                        </>
                    )
                } else if (props?.selection == 4 || props?.selection == 8) {
                    return (
                        <>
                            <SlEye
                                className="cursor-pointer text-3xl bg-blue-200 hover:bg-blue-400 p-1 rounded-md transition duration-200"
                                onClick={() => viewEnrollee(row)}
                                title="View Member Info"
                            />
                        </>
                    )
                }
            },
        },
    ]

    useEffect(() => {
        setStatus(props?.selection)
    }, [props?.selection])

    return (
        <div className="py-2">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    {/* FOR ENROLLMENT BOX */}
                    <div className={`px-3 pt-3 ${status == 2 || 'hidden'}`}>
                        <Button
                            className="mr-2 bg-green-400 hover:bg-green-600 focus:bg-green-600 active:bg-green-700 ring-green-200 mb-2 md:mb-0 w-full md:w-auto"
                            disabled={props?.loading}>
                            Export Members for Enrollment
                        </Button>
                        <div className="clear-both"></div>
                    </div>

                    {/* FOR CORRECTION BOX */}
                    <div className={`px-3 pt-3 ${status == 7 || 'hidden'}`}>
                        <Button
                            className="mr-2 bg-green-400 hover:bg-green-600 focus:bg-green-600 active:bg-green-700 ring-green-200 mb-2 md:mb-0 w-full md:w-auto"
                            disabled={props?.loading}>
                            Export Members for Correction
                        </Button>
                        <div className="clear-both"></div>
                    </div>

                    {/* FOR CANCELLATION BOX */}
                    <div className={`px-3 pt-3 ${status == 8 || 'hidden'}`}>
                        <Button
                            className="mr-2 bg-green-400 hover:bg-green-600 focus:bg-green-600 active:bg-green-700 ring-green-200 mb-2 md:mb-0 w-full md:w-auto"
                            disabled={props?.loading}>
                            Export Members for Cancellation
                        </Button>
                        <Button
                            onClick={setApproveCancellation}
                            className="bg-red-400 hover:bg-red-700 focus:bg-red-700 active:bg-red-700 ring-red-200 md:float-right mb-2 md:mb-0 w-full md:w-auto"
                            disabled={props?.loading}>
                            Approve Cancellation
                        </Button>
                        <div className="clear-both"></div>
                    </div>

                    {/* MAIN DATA GRID TABLE */}
                    <div className="h-96 min-h-screen p-3 bg-white border-b border-gray-200">
                        <DataGrid
                            data={enrollees?.list}
                            columns={columns}
                            selectionModel={selectionModel}
                            setSelectionModel={setSelectionModel}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default pageEnrollmentAdmin
