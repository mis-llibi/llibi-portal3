import Pusher from 'pusher-js'

// Enable pusher logging - don't include this in production
Pusher.logToConsole = false

export const CustomPusher = new Pusher(process.env.PUSHER_APP_KEY, {
  cluster: process.env.PUSHER_APP_CLUSTER,
})
