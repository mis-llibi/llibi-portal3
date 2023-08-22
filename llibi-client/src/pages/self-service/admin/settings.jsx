import React, { useState } from 'react'

import Button from '@/components/Button'
import Label from '@/components/Label'

export default function Settings({ settings, updateSettings }) {
  const [loading, setLoading] = useState(false)
  const [minutes, setMinutes] = useState(settings?.minutes)
  const [receiver, setReceiver] = useState(settings?.receiver)

  const handleUpdateSettings = async () => {
    try {
      setLoading(true)
      await updateSettings({ minutes: minutes, receiver: receiver })
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
            <Label className="text-bold">Minutes</Label>
            <input
              value={minutes}
              className="rounded-md border p-3 focus:outline-blue-700"
              type="input"
              onChange={e => setMinutes(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <Label className="text-bold">Receiver</Label>
            <input
              value={receiver}
              className="rounded-md border p-3 focus:outline-blue-700"
              type="input"
              onChange={e => setReceiver(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Button
            loading={loading}
            type="button"
            onClick={handleUpdateSettings}>
            Save
          </Button>
        </div>
      </div>
    </>
  )
}
