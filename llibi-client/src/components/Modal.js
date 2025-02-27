import { RiCloseFill } from 'react-icons/ri'

const Modal = ({ show, body, toggle }) => {
    if (typeof window !== 'undefined')
        if (show) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

    return (
        <>
            {show && (
                <>
                    <div className="w-full flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className={`mx-auto ${body?.modalOuterContainer}`}>
                            <div
                                className={`relative flex flex-col w-full bg-white outline-none focus:outline-none border-0 shadow-lg ${body?.modalContainer}`}>
                                <div
                                    className={`flex items-center justify-end p-2 border-b border-solid border-blueGray-200 ${
                                        body?.noClose && 'py-5'
                                    }`}>
                                    <p className="absolute left-0 ml-4">
                                        {body?.title}
                                    </p>
                                    <button
                                        className={`px-2 py-1 text-2xl hover:text-red-500 ${
                                            body?.noClose && 'hidden'
                                        }`}
                                        type="button"
                                        onClick={toggle}>
                                        <RiCloseFill />
                                    </button>
                                </div>
                                {/*body*/}
                                <div
                                    className={`relative p-2 flex-auto ${body?.modalBody}`}>
                                    {body?.content}
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-between p-2 border-t border-solid border-blueGray-200">
                                    {/* <div className='w-full text-center'>
                                        <h1 className='font-bold px-2 py-2  text-xs'>
                                            LEGEND <br />
                                            <span className='text-orange-900'>⭐ - <span className='uppercase'>This provider accepts LLIBI</span> e-LOA</span>
                                        </h1>


                                    </div> */}
                                    <button
                                        className={`hover:text-red-500 font-bold uppercase px-2 py-2 text-xs ${
                                            body?.noClose && 'hidden'
                                        }`}
                                        type="button"
                                        onClick={toggle}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            )}
        </>
    )
}

export default Modal
