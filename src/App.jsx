import React, { useState, useMemo, useCallback, lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

// Lazy-loaded routes to reduce initial bundle size
const Demo_Access = lazy(() => import("./components/Demo-Access/Demo-Access"));
const Dashboard = lazy(() => import("./components/Dashboard/Dashboard"));
const About = lazy(() => import("./components/About"));
const SideBar = lazy(() => import("./components/SideBar"));
const Lock = lazy(() => import("./components/Lock"));
const Feedback = lazy(() => import("./components/Feedback"));
const Contact = lazy(() => import("./components/Contact"));

// Layout Component - moved outside App to prevent recreation on every render
function AppLayout({ isLoggedIn, isSidebarOpen, setIsSidebarOpen, handleLogout, firstName, lastName }) {
  return (
    <div className="flex min-h-screen">
      {isLoggedIn && (
        // SideBar is lazy-loaded via Suspense in the router below
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

  const handleLogout = useCallback(() => {
    localStorage.removeItem('VERCEL_LOGIN_STATE');
    localStorage.removeItem('VERCEL_SECURE_TOKEN');
    localStorage.removeItem('USER_FIRST_NAME');
    localStorage.removeItem('USER_LAST_NAME');
    setIsLoggedIn(false);
  }, []);

  // Create the router once (memoized) so it isn't recreated on every render.
  const router = useMemo(() => createBrowserRouter([
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
            <Suspense fallback={<div />}> 
              <Dashboard
                isLoggedIn={isLoggedIn}
                firstName={firstName} setFirstName={setFirstName}
                lastName={lastName} setLastName={setLastName}
                setIsLoggedIn={setIsLoggedIn}
                handleLogout={handleLogout}
              />
            </Suspense>
          ),
        },
        {
          path: "about",
          element: (
            <Suspense fallback={<div />}>
              <About />
            </Suspense>
          ),
        },
        {
          path: "demo-access",
          element: (
            <Suspense fallback={<div />}>
              <Demo_Access />
            </Suspense>
          ),
        },
        {
          path: "lock",
          element: (
            <Suspense fallback={<div />}>
              <Lock />
            </Suspense>
          ),
        },
        {
          path: "feedback",
          element: (
            <Suspense fallback={<div />}>
              <Feedback />
            </Suspense>
          ),
        },
        {
          path: "contact",
          element: (
            <Suspense fallback={<div />}>
              <Contact />
            </Suspense>
          ),
        },
      ],
    },
  ]), // only recreate if these change (rare)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [isLoggedIn, isSidebarOpen, firstName, lastName]);

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(prev => !prev)}
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
      {/* background orbs removed for performance */}
      <RouterProvider router={router} />
    </>
  );
}
