const AuthCard = ({ logo, children }) => (
    <div className="min-h-screen max-h-full flex flex-col justify-center items-center pt-6 bg-gray-100">
        <div>{logo}</div>

        <div className="w-full max-w-md mt-6 px-6 py-4 bg-white">
            {children}
        </div>
    </div>
)

export default AuthCard
