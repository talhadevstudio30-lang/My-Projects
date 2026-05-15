import React from 'react'

function Account_Btn({onRefresh , loading , logout_alert}) {
    return (
        <div>
            <div className="flex items-center justify-end md:justify-start gap-3 mt-3.5 pr-3 md:pr-0">
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="text-gray-500 border px-3 py-2 rounded-[9px] shadow-sm cursor-pointer hover:bg-white/60 border-white/60 bg-white/70 transition-colors disabled:opacity-50"
                    title="Refresh projects"
                >
                    <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>

                <button
                    onClick={logout_alert}
                    className="px-4 py-2 text-sm font-medium bg-red-100 text-red-600 hover:bg-red-300 cursor-pointer rounded-[9px] transition-colors flex items-center gap-2 border border-red-200 hover:border-red-300"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>

            </div>
        </div>
    )
}

export default Account_Btn
