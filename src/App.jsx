import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";

import Demo_Access from "./components/Demo-Access/Demo-Access";
import Dashboard from "./components/Dashboard/Dashboard";
import About from "./components/About";
import SideBar from "./components/SideBar";
import Lock from "./components/Lock";
import Feedback from "./components/Feedback";
import Contact from "./components/Contact";

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

  // Layout Component
  function AppLayout() {
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

  // Router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: (
            <Dashboard
              isLoggedIn={isLoggedIn}
              firstName={firstName} setFirstName={setFirstName} 
             lastName={lastName} setLastName={setLastName}
              setIsLoggedIn={setIsLoggedIn}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
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
