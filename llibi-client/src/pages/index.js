'use client'
import Client from '@/pages/self-service/client/index'
import React, { useEffect } from 'react'

import { useRouter } from 'next/router'

const client = () => {
  const router = useRouter()
  useEffect(() => {
    router.push('https://portal.llibi.app')
  }, [])

  return <Client />
}

export default client
