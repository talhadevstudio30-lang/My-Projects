import React from 'react';
import { Link } from "react-router-dom";


const LoginPage = ({ Handle_Create_Account_Btn, Token_inp, token_val , loginError ,  isValidating }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Project Manager</h1>
          <p className="text-gray-500 mt-2">Enter your Vercel Personal Access Token to continue.</p>
        </div>
        <div>
          <form onSubmit={Handle_Create_Account_Btn}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    placeholder="First Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name (optional)</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
                <input
                  type="password"
                   id="token"
                  name="token"
                  required
                  placeholder="vercel_token_..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
              {loginError && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {loginError}
                </div>
              )}

              <button type="submit" disabled={isValidating}>
                {isValidating ? "Validating..." : "Connect to Vercel"}
              </button>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm"
              >
                Connect Account
              </button>
            </div>
          </form>
          <div className="mt-2">
            <Link to="demo-access">
              <button
                className="w-full hover:bg-gray-200 border-2 text-gray-800 border-gray-800 font-semibold py-3 rounded-lg transition-colors shadow-sm"
              >
                Demo (Temporary Access)
              </button>
            </Link>
          </div>
        </div>
        <div className="mt-6 text-center">
          <a
            href="https://vercel.com/account/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:underline"
          >
            How to get your own token?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
