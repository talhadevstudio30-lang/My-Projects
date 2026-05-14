import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";

function SideBar({isSidebarOpen , setIsSidebarOpen , handleLogout , firstName , lastName}) {
  const location = useLocation();
  const [clickedItem, setClickedItem] = useState(null);

  const handleClick = (itemId) => {
    setClickedItem(itemId);
    setTimeout(() => setClickedItem(null), 150);
  };

  return (
    <div>
      <nav className={`
          fixed left-0 top-0 z-40 h-screen
          flex flex-col gap-4 p-3 pt-16
          bg-white/40 backdrop-blur-2xl 
          border-r border-white/60
          shadow-[8px_0_32px_0_rgba(0,0,0,0.05)]
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          w-60
      `}>
          {/* Header Section */}
          <div className="px-4 mb-4">
              <h1 className="text-4xl font-bold truncate text-indigo-600">
                  {firstName} {lastName}
              </h1>
              <p className="text-md text-gray-500">Administrator</p>
          </div>
      
          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto space-y-1">
              {/* Active Dashboard Link */}
              <Link
                  to="/"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    handleClick('dashboard');
                  }}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-[9px] transition-all duration-100
                    ${location.pathname === '/'
                      ? 'bg-indigo-600 text-white shadow-md scale-[0.98]'
                      : 'text-gray-600 hover:bg-white/60 hover:text-indigo-600 hover:shadow-sm active:scale-[0.97]'
                    }
                    ${clickedItem === 'dashboard' ? 'scale-[0.97]' : ''}
                  `}
              >
                  <span className="text-[14px] font-medium">Dashboard</span>
              </Link>
      
              {/* Navigation Items */}
              {[
                  { label: "About", path: "/about" },
                  { label: "Lock System", path: "/lock" },
                  { label: "Feedback", path: "/feedback" },
                  { label: "Contact", path: "/contact" },
              ].map((item, index) => (
                  <Link
                      key={index}
                      to={item.path}
                      onClick={() => {
                        setIsSidebarOpen(false);
                        handleClick(item.path);
                      }}
                      className={`
                        flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-100
                        ${location.pathname === item.path
                          ? 'bg-indigo-600 text-white shadow-md scale-[0.98]'
                          : 'text-gray-600 hover:bg-white/60 hover:text-indigo-600 hover:shadow-sm active:scale-[0.97]'
                        }
                        ${clickedItem === item.path ? 'scale-[0.97]' : ''}
                      `}
                  >
                      <span className="material-symbols-outlined text-[20px]">
                          {item.icon}
                      </span>
                      <span className="text-[14px] font-medium">{item.label}</span>
                  </Link>
              ))}
          </div>
      
          {/* Footer/Logout Section (Optional) */}
          <div className="border-t border-gray-200 pt-4">
              <button
                  onClick={() => {
                    handleClick('logout');
                    handleLogout();
                  }}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-100
                    text-gray-600 hover:bg-red-50 hover:text-red-600 active:scale-[0.97]
                    ${clickedItem === 'logout' ? 'scale-[0.97] bg-red-50' : ''}
                  `}
              >
                  <span className="material-symbols-outlined text-[20px] transition-all duration-200 hover:text-red-600">
                      logout
                  </span>
                  <span className="text-sm font-medium">Logout</span>
              </button>
          </div>
      </nav>
    </div>
  )
}

export default SideBar
