const NotFoundPage = () => (
  <div className="relative flex place-items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
    <div className="max-w-xl mx-auto lg:px-2">
      <div className="flex items-center pt-8">
        <div className="px-4 text-4xl text-green-500 border-r border-gray-400 tracking-wider">
          Locked
        </div>

        <div className="ml-4 md:text-xl text-gray-700 uppercase tracking-wider">
          Sorry open enrollment is not available at the moment.
        </div>
      </div>
    </div>
  </div>
)

export default NotFoundPage
