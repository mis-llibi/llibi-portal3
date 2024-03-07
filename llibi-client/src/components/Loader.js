import HashLoader from 'react-spinners/HashLoader'

const Loader = ({ loading }) => {
    return (
        <div
            className={
                'fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-[99] overflow-hidden bg-gray-800 opacity-70 flex flex-col items-center justify-center ' +
                (!loading && 'hidden')
            }>
            <HashLoader color="#02C0EA" loading={loading} size={120} />
            <p className="w-1/3 text-center text-white mt-10">
                This may take a few seconds, please don't close this page.
            </p>
        </div>
    )
}

export default Loader
