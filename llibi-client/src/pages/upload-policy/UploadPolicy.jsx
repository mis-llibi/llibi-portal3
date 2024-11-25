import Dropzone from '@/components/DropzoneSingle'
import Button from '@/components/Button'
import { useState, useEffect } from 'react'
import axios from '@/lib/axios'

function UploadPolicy() {
  const [file, setFile] = useState(null)
  const fileTypes = ['pdf']

  return (
    <div className="flex flex-col lg:w-full md:w-full sm:w-full lg:h-[32rem] md:h-96 sm:h-96 gap-4">
      <Dropzone
        fileTypes={fileTypes}
        setFile={setFile}
        className={'flex flex-col justify-start h-full'}
      />
      {/* Upload Button */}
      <div className="flex justify-end my-4">
        <Button
          type="button"
          onClick={() => console.log(file)}
          disabled={!file}>
          Upload
        </Button>
      </div>
    </div>
  )
}

export default UploadPolicy
