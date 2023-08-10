import React, { useRef, useState } from 'react'

import { useAuth } from '@/hooks/auth'

import Alert from '@mui/material/Alert'

export default function AdminLoginPage() {
  const { login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/self-service/admin',
  })

  const [errors, setErrors] = useState([])
  const [status, setStatus] = useState([])

  const emailRef = useRef('')
  const passwordRef = useRef('')

  const handleLogin = () => {
    let email = emailRef.current.value
    let password = passwordRef.current.value

    login({ setErrors, setStatus, email, password })
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-1/3">
          <div className="flex justify-center">
            <img src="/logo.png" alt="LLIBI LOGO" />
          </div>
          <div className="mb-3">
            <label htmlFor="">Email</label>
            <input
              className="w-full rounded-md"
              name="email"
              type="email"
              ref={emailRef}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="">Password</label>
            <input
              className="w-full rounded-md"
              name="password"
              type="password"
              ref={passwordRef}
            />
          </div>
          <div className="mb-3">
            {errors.map((err, i) => (
              <>
                <Alert className="mb-3" severity="error" key={i}>
                  {err}
                </Alert>
              </>
            ))}
          </div>
          <button
            className="bg-blue-700 hover:bg-blue-500 text-white px-5 py-2 rounded-md"
            onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </>
  )
}
