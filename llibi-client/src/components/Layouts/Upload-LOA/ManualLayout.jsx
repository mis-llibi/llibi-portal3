import { basePath } from '@/../next.config'

const ManualLayout = ({ children }) => {
    return (
        <div
            className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-500 px-2 bg-contain bg-repeat"
            style={{
                backgroundImage: `url(
                ${basePath}/self-service/bg-portal.webp)`,
            }}>
            {/* Page Content */}
            <main>{children}</main>
        </div>
    )
}

export default ManualLayout
