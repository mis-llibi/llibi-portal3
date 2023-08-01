import React from 'react'

import { useState } from 'react'

import { DataGrid, GridToolbar } from '@mui/x-data-grid'

const DataGridTbl = ({
    data,
    columns,
    selectionModel,
    setSelectionModel,
    notFound = 'No data found in the server',
}) => {
    const [pageSize, setPageSize] = useState(10)

    const handlePageSizeChange = data => {
        setPageSize(data)
    }

    return (
        <>
            <DataGrid
                rows={data || []}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                rowsPerPageOptions={[10, 25, 50, 100]}
                disableSelectionOnClick
                checkboxSelection
                selectionModel={selectionModel}
                onSelectionModelChange={setSelectionModel}
                components={{
                    Toolbar: GridToolbar,
                    NoRowsOverlay: () => (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-lg font-semibold text-red-400">
                            <div>{notFound}</div>
                        </div>
                    ),
                    NoResultsOverlay: () => (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-lg font-semibold text-red-400">
                            <div>No result found in your filter</div>
                        </div>
                    ),
                }}
            />
        </>
    )
}

export default DataGridTbl
