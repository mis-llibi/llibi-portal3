import AppLayout from '@/components/Layouts/da-extract'
import Head from 'next/head'

import { useState } from 'react'

import { DataGrid, GridToolbar } from '@mui/x-data-grid'

import { SlPencil, SlBan } from 'react-icons/sl'

import { useMember } from '@/hooks/da-extract/member'

const index = () => {
    const [pageSize, setPageSize] = useState(10)

    const handlePageSizeChange = data => {
        setPageSize(data)
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 60 },
        {
            field: 'empNo',
            headerName: 'Emp No.',
            width: 150,
        },
        {
            field: 'compCode',
            headerName: 'Comp Code',
            width: 150,
        },
        {
            field: 'lastName',
            headerName: 'Last Name',
            width: 150,
        },
        {
            field: 'firstName',
            headerName: 'First Name',
            width: 150,
        },
        {
            field: 'birthDate',
            headerName: 'Birth Date',
            width: 100,
        },
        {
            field: 'relation',
            headerName: 'Relation',
            width: 150,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: '100%',
        },
    ]

    const { members } = useMember({})

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }>
            <Head>
                <title>LLIBI DA Extract</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="h-96 min-h-screen p-6 bg-white border-b border-gray-200">
                            <DataGrid
                                rows={members || []}
                                columns={columns}
                                disableSelectionOnClick
                                pageSize={pageSize}
                                onPageSizeChange={handlePageSizeChange}
                                rowsPerPageOptions={[10, 25, 50, 100]}
                                //experimentalFeatures={{ newEditingApi: true }}
                                components={{
                                    Toolbar: GridToolbar,
                                    NoRowsOverlay: () => (
                                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-lg font-semibold text-red-400">
                                            <div>
                                                No member found in the server
                                            </div>
                                        </div>
                                    ),
                                    NoResultsOverlay: () => (
                                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-lg font-semibold text-red-400">
                                            <div>
                                                No result found in your filter
                                            </div>
                                        </div>
                                    ),
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default index
