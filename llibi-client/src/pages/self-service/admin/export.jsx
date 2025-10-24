import React, { useState } from 'react'

import Button from '@/components/Button'
import Label from '@/components/Label'
import PreviewTable from './previewTable'

import ModalControl from '@/components/ModalControl'
import Modal from '@/components/Modal'

export default function Export({ exporting, previewExport, setLoading }) {
  const [dateFrom, setDateFrom] = useState()
  const [dateTo, setDateTo] = useState()
  const { show, setShow, body, setBody, toggle } = ModalControl()

  const handleDownloadReport = async () => {
    try {
      setLoading(true)
      await exporting(dateFrom, dateTo)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const handlePreview = async () => {
    setLoading(true)
    const previewData = await previewExport(dateFrom, dateTo)
    setBody({
      title: 'Preview Export (Use ctrl + F to search keywords)',
      content: <PreviewTable previewData={previewData} />,
      //modalOuterContainer: 'w-full md:w-10/12 max-h-screen',
      modalOuterContainer: 'w-[90%] h-2/3',
      //modalContainer: '',
      modalContainer: 'h-full',
      modalBody: 'h-full overflow-y-scroll',
    })
    toggle()
    setLoading(false)
  }

  return (
    <>
      <div className="px-3">
        <div className="flex flex-col gap-3 mb-3">
          <div className="flex flex-col">
            <Label className="text-bold">Date From</Label>
            <input
              className="rounded-md"
              type="date"
              onChange={e => setDateFrom(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-bold">Date To</Label>
            <input
              className="rounded-md"
              type="date"
              onChange={e => setDateTo(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div className="flex gap-1">
            <Button type="button" onClick={handleDownloadReport}>
              Download
            </Button>
            <Button type="button" onClick={handlePreview}>
              Preview
            </Button>
          </div>
        </div>
      </div>

      <Modal show={show} body={body} toggle={toggle} />
    </>
  )
}
