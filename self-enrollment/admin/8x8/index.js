import { useState } from 'react'

import { ManageClients } from '@/hooks/self-enrollment/ManageClients'

import ModalInsertEnrollee from './components/modalInsertEnrollee'
import ModalUploadEnrollee from './components/modalUploadEnrollee'
import ModalUpdateEnrollee from './components/modalUpdateEnrollee'
import ModalUploadCancellation from './components/modalUploadCancellation'

import Swal from 'sweetalert2'

import Select from '@/components/Select'

import { SlPencil, SlBan, SlEnvolope } from 'react-icons/sl'

import Button from '@/components/Button'
import ButtonLink from '@/components/ButtonLink'
import DataGrid from '@/components/DataGrid'

const HomeEigthByEigth = ({ register, watch, props }) => {
    const {
        clients,
        importClients,
        importClientsForCancellation,
        sendClientInvite,
        sendClientInviteForMilestone,
        createClient,
        updateClient,
        removeClient,
        exportClients,
    } = ManageClients({
        selection: watch && watch('selection'),
        company: props?.user?.company_id,
    })

    //ENROLLEES
    const uploadEnrollee = () => {
        props?.setBody({
            title: 'Upload Excel File to Masterlist',
            content: (
                <ModalUploadEnrollee
                    upload={importClients}
                    loading={props?.loading}
                    setLoading={props?.setLoading}
                    setShow={props?.setShow}
                />
            ),
            modalOuterContainer: 'w-full lg:w-3/6 max-h-screen',
            modalContainer: 'h-full',
            modalBody: 'h-full',
        })
        props?.toggle()
    }

    const insertEnrollee = () => {
        props?.setBody({
            title: 'Insert Enrollee',
            content: (
                <ModalInsertEnrollee
                    create={createClient}
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

    const editEnrollee = data => {
        props?.setBody({
            title: `Edit Enrollee: ${data?.first_name + ' ' + data?.last_name}`,
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
                'You are trying to cancel this employee enrollment, do you want to continue?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!',
        }).then(result => {
            if (result.isConfirmed) {
                props?.setLoading(true)
                removeClient({ ...data, setLoading: props?.setLoading })
            }
        })
    }

    const sendInvite = data => {
        Swal.fire({
            title: 'Are you sure?',
            text:
                'You are sending this employee his/her enrollment invite, do you want to continue?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, send it!',
        }).then(result => {
            if (result.isConfirmed) {
                props?.setLoading(true)
                sendClientInvite({ ...data, setLoading: props?.setLoading })
            }
        })
    }

    const sendInviteForMilestone = data => {
        Swal.fire({
            title: 'Are you sure?',
            text:
                'You are sending this employee his/her enrollment invite, do you want to continue?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, send it!',
        }).then(result => {
            if (result.isConfirmed) {
                props?.setLoading(true)
                sendClientInviteForMilestone({
                    ...data,
                    setLoading: props?.setLoading,
                })
            }
        })
    }

    const updateEnrollee = data => {
        props?.setBody({
            title: `UPDATE CLIENT: ${data?.first_name + ' ' + data?.last_name}`,
            content: (
                <ModalUpdateEnrollee
                    data={data}
                    company={props?.user?.company_id}
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
                exportClients({
                    setLoading: props?.setLoading,
                })
            }
        })
    }

    const modUploadCancellation = () => {
        props?.setBody({
            title: 'Upload Excel File to Masterlist',
            content: (
                <ModalUploadCancellation
                    upload={importClientsForCancellation}
                    loading={props?.loading}
                    setLoading={props?.setLoading}
                    setShow={props?.setShow}
                />
            ),
            modalOuterContainer: 'w-full lg:w-3/6 max-h-screen',
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
            field: 'member_id',
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
            field: 'gender',
            headerName: 'Gender',
            width: 110,
        },
        {
            field: 'civil_status',
            headerName: 'CivilStatus',
            width: 100,
        },
        {
            field: 'hire_date',
            headerName: 'Hire Date',
            width: 100,
        },
        {
            field: 'action',
            headerName: 'Action',
            sortable: false,
            width: 120,
            align: 'center',
            renderCell: ({ row }) => {
                if (watch && watch('selection') == 1) {
                    //If pending enrollment show edit & delete
                    return (
                        <>
                            <SlPencil
                                className="cursor-pointer text-3xl bg-green-200 hover:bg-green-400 p-1 rounded-md mr-2 transition duration-200"
                                onClick={() => editEnrollee(row)}
                                title="Edit Enrollee"
                            />
                            <SlBan
                                className="cursor-pointer text-3xl bg-red-200 hover:bg-red-400 p-1 rounded-md mr-2 transition duration-200"
                                onClick={() => deleteEnrollee(row)}
                                title="Delete Enrollee"
                            />
                            <SlEnvolope
                                className="cursor-pointer text-3xl bg-blue-200 hover:bg-blue-400 p-1 rounded-md transition duration-200"
                                onClick={() => sendInvite(row)}
                                title="Resend Enrollment Invite"
                            />
                        </>
                    )
                } else if (
                    (watch && watch('selection') == 2) ||
                    (watch && watch('selection') == 4)
                ) {
                    return (
                        <>
                            <SlPencil
                                className="cursor-pointer text-3xl bg-green-200 hover:bg-green-400 p-1 rounded-md mr-2 transition duration-200"
                                onClick={() => updateEnrollee(row)}
                                title="Edit Enrollee"
                            />
                            <SlBan
                                className="cursor-pointer text-3xl bg-red-200 hover:bg-red-400 p-1 rounded-md transition duration-200"
                                onClick={() => deleteEnrollee(row)}
                                title="Delete Enrollee"
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
                    id="statusCheckerClient"
                    className="block mt-1 w-full"
                    defaultValue={1}
                    options={[
                        {
                            label: 'Sent Invites',
                            value: 1,
                        },
                        { label: 'Submitted Enrollment', value: 2 },
                        { label: 'Approved Members', value: 4 },
                        { label: 'Cancelled Members', value: 3 },
                    ]}
                    register={register && register('selection')}
                />
            </div>

            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* PENDING ENROLLMENT BOX */}
                        <div
                            className={`px-3 pt-3 ${
                                (watch && watch('selection') == 1) || 'hidden'
                            }`}>
                            <Button
                                onClick={uploadEnrollee}
                                className="mr-2 bg-blue-400 hover:bg-blue-600 focus:bg-blue-600 active:bg-blue-700 ring-blue-200 mb-2 md:mb-0 w-full md:w-auto"
                                disabled={props?.loading}>
                                Upload Enrollee
                            </Button>
                            <Button
                                onClick={insertEnrollee}
                                className="bg-pink-400 hover:bg-pink-700 focus:bg-pink-700 active:bg-pink-700 ring-pink-200 mb-2 md:mb-0 w-full md:w-auto"
                                disabled={props?.loading}>
                                Insert Enrollee
                            </Button>
                            <Button
                                className="bg-orange-400 hover:bg-orange-700 focus:bg-orange-700 active:bg-orange-700 ring-orange-200 md:float-right mb-2 md:mb-0 w-full  md:w-auto"
                                disabled={props?.loading}>
                                Lock Enrollment
                            </Button>
                        </div>

                        {/* SUBMITTED ENROLLMENT BOX */}
                        <div
                            className={`px-3 pt-3 ${
                                (watch && watch('selection') == 2) || 'hidden'
                            }`}>
                            <ButtonLink
                                onClick={onExportEnrollee}
                                className="mr-2 bg-green-400 hover:bg-green-600 focus:bg-green-600 active:bg-green-700 ring-green-200 mb-2 md:mb-0 w-full md:w-auto"
                                disabled={props?.loading}>
                                Export Submitted Enrollment
                            </ButtonLink>
                            <Button
                                onClick={modUploadCancellation}
                                className="mr-2 bg-red-400 hover:bg-red-600 focus:bg-red-600 active:bg-red-700 ring-red-200 mb-2 md:mb-0 w-full md:w-auto float-right"
                                disabled={props?.loading}>
                                Import Cancellation
                            </Button>
                        </div>

                        {/* APPROVED BOX */}
                        <div
                            className={`px-3 pt-3 ${
                                (watch && watch('selection') == 4) || 'hidden'
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

export default HomeEigthByEigth
