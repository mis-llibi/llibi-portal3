import { basePath } from '@/../next.config'

const ApplicationLogo = props => (
    <img src={`${basePath}/logo.png`} style={{ width: props?.width }} />
)

export default ApplicationLogo
