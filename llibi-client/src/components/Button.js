import BeatLoader from 'react-spinners/BeatLoader'

import { clsx } from 'clsx'

const Button = ({
  type = 'submit',
  bgcolor = 'blue',
  className = '',
  loading,
  ...props
}) => {
  return (
    <button
      type={type}
      className={clsx(
        className,
        `bg-blue-500 hover:bg-blue-700 active:bg-blue-900 border focus:border-blue-900 inline-flex items-center px-4 py-2 border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest focus:outline-none focus:ring ring-white disabled:opacity-25 transition ease-in-out duration-150`,
      )}
      disabled={loading}
      {...props}>
      {!loading ? (
        props?.children
      ) : (
        <BeatLoader color="#ffff" loading={loading} size={12} />
      )}
    </button>
  )
}

export default Button
