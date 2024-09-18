import { useState, useEffect } from 'react'
import Dropzone from 'react-dropzone'

function DropzoneSingle({
  fileTypes,
  setFile,
  className,
  previewTextClassName = 'text-lg font-semibold text-gray-700',
  iframeClassName = 'w-full h-full',
  previewText = 'Preview',
  preview = true,
  rootClassName = 'border-2 border-dashed border-gray-300 p-8 rounded-md flex justify-center items-center cursor-pointer hover:border-indigo-500 transition duration-300 ease-in-out',
  inputClassName,
}) {
  const [uploadedFile, setUploadedFile] = useState(null)

  const handleFile = file => {
    file.preview = URL.createObjectURL(file)
    file
    setUploadedFile(file)
  }

  useEffect(() => {
    if (uploadedFile) {
      setFile(uploadedFile)
      console.log(uploadedFile)
    }
  }, [uploadedFile])

  return (
    <div className={className}>
      <Dropzone onDrop={acceptedFiles => handleFile(acceptedFiles[0])}>
        {({ getRootProps, getInputProps }) => (
          <section className="container">
            <div
              {...getRootProps({
                className: rootClassName,
              })}>
              <input
                {...getInputProps({
                  accept: fileTypes.map(type => `.${type}`).join(','),
                  required: true,
                  className: inputClassName,
                })}
              />
              <div className="flex flex-col items-center">
                {uploadedFile ? (
                  <div className="flex flex-col items-center">
                    <p className="text-gray-700 text-center cursor-default">
                      File "{uploadedFile.name}" is uploaded.
                    </p>
                    <p className="text-gray-500 text-center mt-2 text-sm">
                      You can drag/drop a new file or click here to replace it.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="text-gray-500 text-center cursor-pointer">
                      Drag/Drop a file or{' '}
                      <span className="text-indigo-500">click here</span> to
                      browse
                    </p>
                    {/* allowed file types */}
                    <p className="text-gray-500 text-center mt-2 text-sm">
                      Allowed file types: {fileTypes.toString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </Dropzone>
      {/* Preview Section */}
      {uploadedFile && preview && (
        <div className="my-4 h-full">
          <h2 className={previewTextClassName}>
            {previewText}
            <span
              onClick={() => window.open(uploadedFile.preview)}
              className="text-indigo-500 cursor-pointer ml-2 hover:underline">
              (Click Here to Preview Full)
            </span>
          </h2>
          <iframe
            src={uploadedFile.preview}
            className={iframeClassName}></iframe>
        </div>
      )}
    </div>
  )
}

export default DropzoneSingle
