import React, { useEffect, useState } from 'react'

export default function debounce(text) {
  const [state, setState] = useState('')
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
    setTimer(
      setTimeout(() => {
        setState(text)
      }, 1000),
    )
  }, [text])

  return state
}
