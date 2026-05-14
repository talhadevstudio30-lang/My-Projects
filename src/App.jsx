import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import Demo_Access from "./components/Demo-Access/Demo-Access";
import Dashboard from "./components/Dashboard/Dashboard";
import About from "./components/About";
import SideBar from "./components/SideBar";
import Lock from "./components/Lock";
import Feedback from "./components/Feedback";
import Contact from "./components/Contact";

// Layout Component - moved outside App to prevent recreation on every render
function AppLayout({ isLoggedIn, isSidebarOpen, setIsSidebarOpen, handleLogout, firstName, lastName }) {
  return (
    <div className="flex min-h-screen">
      {isLoggedIn && (
        <SideBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          handleLogout={handleLogout}
          firstName={firstName}
          lastName={lastName}
        />
      )}
      <div className={isLoggedIn ? "flex-1 md:ml-60" : "flex-1"}>
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  const [firstName, setFirstName] = useState(localStorage.getItem('USER_FIRST_NAME') || '');
  const [lastName, setLastName] = useState(localStorage.getItem('USER_LAST_NAME') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLoginState = localStorage.getItem('VERCEL_LOGIN_STATE');
    return savedLoginState === 'true';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('VERCEL_LOGIN_STATE');
    localStorage.removeItem('VERCEL_SECURE_TOKEN');
    localStorage.removeItem('USER_FIRST_NAME');
    localStorage.removeItem('USER_LAST_NAME');
    setIsLoggedIn(false);
  };

  // Router - created inside but with elements that use the current state
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AppLayout
          isLoggedIn={isLoggedIn}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          handleLogout={handleLogout}
          firstName={firstName}
          lastName={lastName}
        />
      ),
      children: [
        {
          index: true,
          element: (
            <Dashboard
              isLoggedIn={isLoggedIn}
              firstName={firstName} setFirstName={setFirstName}
              lastName={lastName} setLastName={setLastName}
              setIsLoggedIn={setIsLoggedIn}
              handleLogout={handleLogout}
            />
          ),
        },
        {
          path: "about",
          element: <About />,
        },
        {
          path: "demo-access",
          element: <Demo_Access />,
        },
        {
          path: "lock",
          element: <Lock />,
        },
        {
          path: "feedback",
          element: <Feedback />,
        },
        {
          path: "contact",
          element: <Contact />,
        },
      ],
    },
  ]);

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-30 backdrop-blur-[3px] transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Global background blur orbs */}
      <div className="app-bg-orbs">
        <div className="app-bg-orb-1" />
        <div className="app-bg-orb-2" />
        <div className="app-bg-orb-3" />
        <div className="app-bg-orb-4" />
        <div className="app-bg-orb-5" />
      </div>
      <RouterProvider router={router} />
    </>
  );
}
