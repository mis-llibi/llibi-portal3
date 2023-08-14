import React, { useState } from 'react'

import Button from '@/components/Button'
import Label from '@/components/Label'

export default function Export({ exporting, setLoading }) {
  const [dateFrom, setDateFrom] = useState()
  const [dateTo, setDateTo] = useState()

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
          <Button type="button" onClick={handleDownloadReport}>
            Download
          </Button>
        </div>
      </div>
    </>
  )
}
