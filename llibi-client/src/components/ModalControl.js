import { useState } from 'react'

const ModalControl = () => {
  const [show, setShow] = useState(false)
  const [body, setBody] = useState()

  function toggle() {
    setShow(prev => !prev)
  }

  return {
    show,
    setShow,
    body,
    setBody,
    toggle,
  }
}

export default ModalControl
