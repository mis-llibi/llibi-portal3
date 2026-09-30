'use client'
import React, { useState } from "react"
import Label from '@/components/Label'
import Button from '@/components/Button'


export default function ExportReportDateRange({exportReport, status}){



    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = e => {
        e.preventDefault()

        setLoading(true)
        exportReport({
            startDate,
            endDate,
            status,
            setLoading
        })



    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <Label htmlFor="reportStartDate">Start Date</Label>
            <input
            id="reportStartDate"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
            />
        </div>
        <div>
            <Label htmlFor="reportEndDate">End Date</Label>
            <input
            id="reportEndDate"
            type="date"
            value={endDate}
            min={startDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
            />
        </div>
        <div className="flex justify-end">
            <Button type="submit" loading={loading}>
            Export
            </Button>
        </div>
        </form>
    )
}
