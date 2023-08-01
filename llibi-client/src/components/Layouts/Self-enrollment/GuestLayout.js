import Head from 'next/head'

const GuestLayout = ({ title = 'LLIBI Self-Enrollment Portal', children }) => {
    return (
        <div>
            <Head>
                <title>{title}</title>
            </Head>

            <div className="text-gray-900 antialiased">
                <div className="grid min-h-screen place-items-center bg-gray-100 p-4">
                    <div className="container mx-auto rounded-lg shadow p-6 bg-white">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GuestLayout
