import Label from '@/components/Label'
import axios from '@/lib/axios'
import React, { useState } from 'react'
import { MdOutlineEscalatorWarning } from 'react-icons/md'

const provider = {
  infobip: 'infobip',
  default: 'default',
}

export default function EmailProviderSettingHomePage() {
  const [selectedProvider, setSelectedProvider] = useState('')

  const saveProvider = async () => {
    try {
      await axios.post('/api/provider-setting', {
        provider: selectedProvider,
      })

      alert('Saving success.')
    } catch (error) {
      alert(error?.response?.data?.message)
      // throw error
    }
  }

  return (
    <>
      <div className="max-w-3xl mx-auto flex justify-center items-center h-[50vh] flex-col !font-[poppins]">
        <div className="w-full text-center">
          <span className="text-[#191919] text-xl font-semibold uppercase">
            Choose provider for email sending
          </span>
          <div className="flex justify-center gap-3 rounded-md p-3 mb-3">
            <Label
              htmlFor="id_infibip"
              className={`${
                selectedProvider === provider.infobip &&
                'bg-blue-600 text-white'
              } border p-3 w-40 flex flex-col justify-center items-center h-20 rounded-md hover:bg-blue-700 hover:text-white transition-all ease-out`}>
              <input
                className="sr-only"
                type="radio"
                id="id_infibip"
                value={provider.infobip}
                onChange={e => setSelectedProvider(e.target.value)}
                checked={selectedProvider === provider.infobip}
              />
              {/* <MdOutlineEscalatorWarning size={32} /> */}
              <span className="tracking-widest">INFOBIP</span>
            </Label>
            <Label
              htmlFor="id_default"
              className={`${
                selectedProvider === provider.default &&
                'bg-blue-600 text-white'
              } border p-3 w-40 flex flex-col justify-center items-center h-20 rounded-md hover:bg-blue-700 hover:text-white transition-all ease-out`}>
              <input
                className="sr-only"
                type="radio"
                id="id_default"
                value={provider.default}
                onChange={e => setSelectedProvider(e.target.value)}
                checked={selectedProvider === provider.default}
              />
              {/* <MdOutlineEscalatorWarning size={32} /> */}
              <span className="tracking-widest">DIGITAL OCEAN</span>
            </Label>
          </div>
        </div>
        <button
          className="bg-blue-400 hover:bg-blue-600 text-white px-3 py-2 w-48 rounded-md font-bold tracking-wider"
          onClick={saveProvider}>
          <span>SAVE</span>
        </button>
      </div>
    </>
  )
}
