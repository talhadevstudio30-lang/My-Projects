import React from 'react'

function Dash_Header({searchTerm , handle_input_change}) {
    
    return (
        <div>
            <div className='md:flex md:justify-center md:mb-0 mb-7 md:items-center md:border-b md:bg-white/40 md:border-white/60 px-3 md:px-6.5 w-full'>
                <div className="mt-0 md:mt-4 mb-4 relative lg:w-2xl md:w-full w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <input
                        type="text"
                        placeholder="Search projects by name or repository..."
                        className="block w-full pl-10 pr-3 py-3 border border-white/60 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
                        value={searchTerm}
                        onChange={handle_input_change}
                    />
                </div>
            </div>
        </div>
    )
}

export default Dash_Header
