import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';

import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';






function Datatable({loaData}) {



   const toast = useRef(null);
   const dt = useRef(null);
   const [products, setProducts] = useState(null);
   const [globalFilter, setGlobalFilter] = useState(null);

    const exportCSV = () => {
        dt.current.exportCSV()
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Products</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </IconField>
        </div>
    );

  return (
    <div>
      <Toast ref={toast} />
      <div className='card'>
        <Toolbar className='mb-4' end={rightToolbarTemplate}></Toolbar>

        <DataTable value={loaData} ref={dt}
           dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
            <Column selectionMode="multiple" exportable={false}></Column>
            <Column field="loanumber" header="LOA Number" sortable style={{ minWidth: '12rem' }}></Column>
            <Column field="dateissued" header="Date Issued" sortable style={{ minWidth: '16rem' }}></Column>
            <Column field="uploaded" header="Uploaded" sortable style={{ minWidth: '10rem' }}></Column>


        </DataTable>

      </div>

    </div>
  )
}

export default Datatable
