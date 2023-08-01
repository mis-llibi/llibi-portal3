import Navigation from '@/components/Layouts/da-extract/Navigation'
import { useAuth } from '@/hooks/auth'

const AppLayout = ({ header, children }) => {
    //console.log(user)
    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />

            {/* Page Heading */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {header}
                </div>
            </header>

            {/* Page Content */}
            <main>{children}</main>
        </div>
    )
}

export default AppLayout
