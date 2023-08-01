import BeatLoader from 'react-spinners/BeatLoader'

const ButtonLink = ({
    type = 'submit',
    bgcolor = 'blue',
    className,
    loading,
    ...props
}) => {
    return (
        <a
            type={type}
            className={`${className} inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-700 active:bg-blue-900 border focus:border-blue-900 border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest focus:outline-none focus:ring ring-blue-300 disabled:opacity-25 transition ease-in-out duration-150 cursor-pointer`}
            disabled={loading}
            {...props}>
            {!loading ? (
                props?.children
            ) : (
                <BeatLoader color="#ffff" loading={loading} size={12} />
            )}
        </a>
    )
}

export default ButtonLink
