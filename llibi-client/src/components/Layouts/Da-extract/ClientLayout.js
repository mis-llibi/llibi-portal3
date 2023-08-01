const ClientLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Page Content */}
            <main>{children}</main>
        </div>
    )
}

export default ClientLayout
