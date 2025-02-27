import { useState } from 'react'

const TermsOfUseModalControl = () => {
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

export default TermsOfUseModalControl
