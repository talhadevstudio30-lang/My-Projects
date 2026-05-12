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
          fixed left-0 top-0 z-50 h-screen
          flex flex-col gap-4 p-0.5 pt-16
          bg-white/20 backdrop-blur-xl
          border-r border-white/30
          shadow-[8px_0_40px_0_rgba(99,102,241,0.08),inset_-1px_0_0_rgba(255,255,255,0.4)]
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          w-60
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.10) 100%)',
      }}
      >
          {/* Subtle inner highlight at the top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/70 to-transparent" />

          {/* Header Section */}
          <div className="px-4 mb-4">
              <h1 className="text-4xl font-bold truncate text-indigo-600 drop-shadow-sm">
                  {firstName} {lastName}
              </h1>
              <p className="text-md text-gray-500/80">Administrator</p>
          </div>
      
          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto space-y-1 px-2">
              {/* Active Dashboard Link */}
              <Link
                  to="/"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    handleClick('dashboard');
                  }}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-[9px] transition-all duration-150
                    ${location.pathname === '/'
                      ? 'bg-indigo-500/80 backdrop-blur-sm text-white shadow-[0_4px_16px_rgba(99,102,241,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] scale-[0.98] border border-indigo-400/40'
                      : 'text-gray-600 hover:bg-white/40 hover:backdrop-blur-sm hover:text-indigo-600 hover:shadow-[0_2px_12px_rgba(99,102,241,0.12),inset_0_1px_0_rgba(255,255,255,0.5)] hover:border hover:border-white/50 active:scale-[0.97] border border-transparent'
                    }
                    ${clickedItem === 'dashboard' ? 'scale-[0.97]' : ''}
                  `}
              >
                  <span className="text-[14px] font-medium">Dashboard</span>
              </Link>
      
              {/* Navigation Items */}
              {[
                  { icon: "info", label: "About", path: "/about" },
                  { icon: "lock", label: "Lock System", path: "/lock" },
                  { icon: "feedback", label: "Feedback", path: "/feedback" },
                  { icon: "contact_mail", label: "Contact", path: "/contact" },
              ].map((item, index) => (
                  <Link
                      key={index}
                      to={item.path}
                      onClick={() => {
                        setIsSidebarOpen(false);
                        handleClick(item.path);
                      }}
                      className={`
                        flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-150
                        ${location.pathname === item.path
                          ? 'bg-indigo-500/80 backdrop-blur-sm text-white shadow-[0_4px_16px_rgba(99,102,241,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] scale-[0.98] border border-indigo-400/40'
                          : 'text-gray-600 hover:bg-white/40 hover:backdrop-blur-sm hover:text-indigo-600 hover:shadow-[0_2px_12px_rgba(99,102,241,0.12),inset_0_1px_0_rgba(255,255,255,0.5)] hover:border hover:border-white/50 active:scale-[0.97] border border-transparent'
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
      
          {/* Footer/Logout Section */}
          <div className="border-t border-white/30 pt-4"
               style={{ borderImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent) 1' }}>
              <button
                  onClick={() => {
                    handleClick('logout');
                    handleLogout();
                  }}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-150
                    text-gray-600 border border-transparent
                    hover:bg-red-500/10 hover:backdrop-blur-sm hover:text-red-500 hover:border-red-300/30
                    hover:shadow-[0_2px_12px_rgba(239,68,68,0.10),inset_0_1px_0_rgba(255,255,255,0.4)]
                    active:scale-[0.97]
                    ${clickedItem === 'logout' ? 'scale-[0.97] bg-red-500/10' : ''}
                  `}
              >
                  <span className="material-symbols-outlined text-[20px] transition-all duration-200">
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