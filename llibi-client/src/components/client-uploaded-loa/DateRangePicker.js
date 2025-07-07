import React from 'react'

import dayjs from 'dayjs'
import { DateRangePicker } from 'rsuite'

import "rsuite/dist/rsuite.css"

function DatePicker({loading, handleOkButton}) {

    const { combine, allowedMaxDays, beforeToday, before, after } = DateRangePicker

    var now = dayjs()



  return (
    <DateRangePicker
        format='MMM dd, yyyy'
        placeholder="Select Date Range"
        shouldDisableDate={combine(before('January 28, 2025'), after(now))}
        loading={loading}
        onOk={handleOkButton}


        />
  )
}

export default DatePicker
