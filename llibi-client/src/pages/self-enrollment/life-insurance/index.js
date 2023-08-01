import { useState } from 'react'

import { ManageClientsForLifeInsurance } from '@/hooks/self-enrollment/ManageClientsForLifeInsurance'

import ModalUpdateEnrollee from './components/modalUpdateEnrollee'

import Swal from 'sweetalert2'

import Select from '@/components/Select'

import { SlPencil, SlLike, SlDislike } from 'react-icons/sl'

import Button from '@/components/Button'
import ButtonLink from '@/components/ButtonLink'
import DataGrid from '@/components/DataGrid'

const HomeLlibi = ({ register, watch, props }) => {
    const { clients, updateClient } = ManageClientsForLifeInsurance({
        selection: watch && watch('selection'),
    })

    //ELIGIBLE FOR LIFE INSURANCE
    const editEnrollee = data => {
        props?.setBody({
            title: `Approving Life Insurance of ${
                data?.first_name + ' ' + data?.last_name
            }`,
            content: (
                <ModalUpdateEnrollee
                    data={data}
                    update={updateClient}
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

    const deleteEnrollee = data => {
        Swal.fire({
            title: 'Are you sure?',
            text:
                'You are trying to deny this employee for life insurance, do you want to continue?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, deny it!',
        }).then(result => {
            if (result.isConfirmed) {
                props?.setLoading(true)
                remove({ ...data, setLoading: props?.setLoading })
            }
        })
    }

    const onExportEnrollee = () => {
        //console.log(selectionModel)
        Swal.fire({
            title: 'Export Enrollee Masterlist?',
            text:
                'You are exporting the masterlist, it may take seconds, do you want to continue?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, export it!',
        }).then(result => {
            if (result.isConfirmed) {
                props?.setLoading(true)
                exportEnrollee({
                    setLoading: props?.setLoading,
                })
            }
        })
    }

    //DATA GRID COLUMN HEADER
    const [selectionModel, setSelectionModel] = useState([])
    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        {
            field: 'member_id',
            headerName: 'Emp No.',
            width: 100,
        },
        {
            field: 'last_name',
            headerName: 'Last Name',
            width: 140,
        },
        {
            field: 'first_name',
            headerName: 'First Name',
            width: 140,
        },
        {
            field: 'salary',
            headerName: 'Salary',
            width: 100,
            format: field => field.toLocaleString('en-US'),
        },
        {
            field: 'email',
            headerName: 'Email 1',
            width: 180,
        },
        {
            field: 'email2',
            headerName: 'Email 2',
            width: 180,
        },
        {
            field: 'mobile_no',
            headerName: 'Mobile',
            width: 130,
        },
        {
            field: 'action',
            headerName: 'Action',
            sortable: false,
            width: 100,
            align: 'center',
            renderCell: ({ row }) => {
                if (watch && watch('selection') == 0) {
                    //If pending enrollment show edit & delete
                    return (
                        <>
                            <SlLike
                                className="cursor-pointer text-3xl bg-green-200 hover:bg-green-400 p-1 rounded-md mr-2 transition duration-200"
                                onClick={() => editEnrollee(row)}
                                title="View Profile"
                            />
                            <SlDislike
                                className="cursor-pointer text-3xl bg-red-200 hover:bg-red-400 p-1 rounded-md transition duration-200"
                                onClick={() => deleteEnrollee(row)}
                                title="Deny for Life Insurance"
                            />
                        </>
                    )
                } else if (
                    (watch && watch('selection') == 1) ||
                    (watch && watch('selection') == 3)
                ) {
                    return (
                        <>
                            <SlPencil
                                className="cursor-pointer text-3xl bg-green-200 hover:bg-green-400 p-1 rounded-md mr-2 transition duration-200"
                                onClick={() => editEnrollee(row)}
                                title="View Profile"
                            />
                            <SlDislike
                                className="cursor-pointer text-3xl bg-red-200 hover:bg-red-400 p-1 rounded-md transition duration-200"
                                onClick={() => deleteEnrollee(row)}
                                title="Deny for Life Insurance"
                            />
                        </>
                    )
                }
            },
        },
    ]

    return (
        <>
            {/* ADMIN ENROLLMENT PAGE */}
            <div className="max-w-xl mx-auto sm:px-6 lg:px-8 mt-2">
                <Select
                    register={register && register('selection')}
                    id="statusCheckerClient"
                    className="block mt-1 w-full"
                    defaultValue={0}
                    options={[
                        {
                            label: 'Pending Life Insurance',
                            value: 0,
                        },
                        { label: 'Approved Life Insurance', value: 1 },
                        { label: 'Denied Life Insurance', value: 3 },
                    ]}
                />
            </div>

            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* PENDING ENROLLMENT BOX */}
                        <div
                            className={`px-3 pt-3 ${
                                (watch && watch('selection') == 0) || 'hidden'
                            }`}>
                            <Button
                                className="bg-red-400 hover:bg-red-700 focus:bg-red-700 active:bg-red-700 ring-red-200 md:float-right mb-2 md:mb-0 w-full  md:w-auto hidden"
                                disabled={props?.loading}>
                                DENY LIFE INSURANCE
                            </Button>
                            <div className="clear-both"></div>
                        </div>

                        {/* APPROVED BOX */}
                        <div
                            className={`px-3 pt-3 ${
                                (watch && watch('selection') == 1) || 'hidden'
                            }`}>
                            <ButtonLink
                                onClick={onExportEnrollee}
                                className="mr-2 bg-green-400 hover:bg-green-600 focus:bg-green-600 active:bg-green-700 ring-green-200 mb-2 md:mb-0 w-full md:w-auto"
                                disabled={props?.loading}>
                                Generate Payroll File
                            </ButtonLink>
                        </div>

                        {/* MAIN DATA GRID TABLE */}
                        <div className="h-96 min-h-screen p-3 bg-white border-b border-gray-200">
                            <DataGrid
                                data={clients?.list}
                                columns={columns}
                                selectionModel={selectionModel}
                                setSelectionModel={setSelectionModel}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeLlibi
