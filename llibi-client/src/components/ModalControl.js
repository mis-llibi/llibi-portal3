import { useState } from 'react'

const ModalControl = () => {
  const [show, setShow] = useState(false)
  const [body, setBody] = useState()

  function toggle() {
    setShow(!show)
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
