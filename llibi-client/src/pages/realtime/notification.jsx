import React, { useEffect, useState } from 'react'

import { CustomPusher } from '@/lib/pusher'

export default function RealtimeNotificationPage() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const channel = CustomPusher.subscribe('channel-realtime')
    channel.bind('realtime-notification-event', data => {
      const { message, date_created } = data.data

      setMessages(prevMessages => [...prevMessages, { message, date_created }])

      console.log(message, date_created)
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [])

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <div className="max-w-5xl  mx-auto flex items-center justify-center font-[poppins]">
        <div className="w-96">
          {messages?.map((item, index) => {
            return (
              <div key={index}>
                <div className="bg-white rounded-md border  mb-3 px-3 py-2">
                  <div>
                    <p className="text-xl font-bold text-blue-400">
                      {item.message}
                    </p>
                    <p className="font-thin text-fav-black">{item.message}</p>
                    <p className="text-[10px] font-thin text-fav-subtitle text-right">
                      {item.date_created}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
