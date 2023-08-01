import React, { useEffect } from 'react'

//import Label from '@/components/Label'

import Modal from '@/components/Modal'
import ModalControl from '@/components/ModalControl'

import ProviderLookupForm from './ProviderLookupForm'

const ProviderLookup = () => {
    const { show, setShow, body, setBody, toggle } = ModalControl()

    const findProvider = () => {
        setBody({
            title: 'Find your preferred provider (Hospital or Clinic / Doctor)',
            content: <ProviderLookupForm />,
            modalOuterContainer: 'w-full md:w-4/6 max-h-screen',
            modalContainer: 'h-full rounded-md',
            modalBody: 'h-full',
        })
        toggle()
    }

    useEffect(() => {
        return findProvider()
    }, [])

    return (
        <>
            <Modal show={show} body={body} toggle={toggle} />
        </>
    )
}

export default ProviderLookup
