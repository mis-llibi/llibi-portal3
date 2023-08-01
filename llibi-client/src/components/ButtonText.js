import { BounceLoader } from 'react-spinners'

const ButtonText = ({ text = 'Submit', loading = false }) =>
    loading ? (
        <>
            <BounceLoader size={14} color="#FAFAFA" />{' '}
            <span className="ml-2">Please wait...</span>
        </>
    ) : (
        text
    )

export default ButtonText
