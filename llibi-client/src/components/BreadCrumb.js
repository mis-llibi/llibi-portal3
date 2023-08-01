const BreadCrumb = ({ breadActive, breadCrumb }) => {
    const active =
        'font-bold hover:text-gray-900 md:ml-2 dark:text-gray-400 dark:hover:text-white'
    const inactive = 'text-gray-500 md:ml-2 dark:text-gray-400'

    const homeIcon =
        'M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z'
    const nextIcon =
        'M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'

    return (
        <nav className="flex bg-gray-200 p-2 mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {Object.keys(breadCrumb).map(i => (
                    <li key={i} className="inline-flex items-center">
                        {/* {console.log(i + '' + breadActive)} */}
                        <div className="flex items-center">
                            <svg
                                className={
                                    i > 0
                                        ? 'w-6 h-6 text-gray-400'
                                        : 'w-4 h-4 mr-2'
                                }
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fillRule="evenodd"
                                    d={i > 0 ? nextIcon : homeIcon}
                                    clipRule="evenodd"></path>
                            </svg>
                            <a
                                href="#"
                                className={`ml-1 text-sm font-medium ${
                                    i === 0 ? active : inactive
                                }`}>
                                {breadCrumb[i] || '...'}
                            </a>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    )
}

export default BreadCrumb

/* 
<li className="inline-flex items-center">
    <a
        href="#"
        className={`inline-flex items-center text-sm font-medium ${
            formActive === 0 ? active : inactive
        }`}>
        <svg
            className="w-4 h-4 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
        </svg>
        {formValue[0] || 'Home'}
    </a>
</li>
<li>
    <div className="flex items-center">
        <svg
            className="w-6 h-6 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"></path>
        </svg>
        <a
            href="#"
            className={`ml-1 text-sm font-medium ${
                formActive === 1 ? active : inactive
            }`}>
            {formValue[1] || '...'}
        </a>
    </div>
</li>
<li aria-current="page">
    <div className="flex items-center">
        <svg
            className="w-6 h-6 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"></path>
        </svg>
        <a
            href="#"
            className={`ml-1 text-sm font-medium ${
                formActive === 2 ? active : inactive
            }`}>
            {formValue[2] || '...'}
        </a>
    </div>
</li> */
