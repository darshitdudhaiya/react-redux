import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/authUtils";
import { HiMenu, HiX } from "react-icons/hi";
import { Button } from "flowbite-react";
import { useMediaQuery } from "react-responsive";

function Dashboard() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      const isAuth = await checkAuth();
      setIsAuthenticated(isAuth);
    };

    authenticate();
    document.title = "Dashboard";
  }, [checkAuth]);

  if (!isAuthenticated) {
    return (
      <div className="bg-[#134B70] h-screen flex items-center justify-center text-white text-lg">
        <div className="flex flex-col items-center">
          <svg
            className="w-16 h-16 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0116 0 8 8 0 01-16 0z"
            ></path>
          </svg>
          <span className="mt-4">Loading...</span>
          <Link to="/">
            <Button className="bg-[#508C9B] hover:bg-[#417482] focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 text-center">
              Go Back Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar */}
        <nav
          className={`fixed  left-0 z-40 bg-[#201E43] text-white transition-transform transform ${
            isSidebarOpen ? "translate-x-0 top-16" : "top-0 -translate-x-full"
          } md:relative md:translate-x-0 md:w-[200px] lg:w-[250px]`}
          style={{ minWidth: "200px" }}
        >
          <div className="p-4">
            <Link
              to={"/Client"}
              className="block mb-4 p-2 bg-[#134B70] text-white rounded hover:bg-[#0f4a6d] text-center"
            >
              Client Dashboard
            </Link>
            <Button
              onClick={() => {
                // Logout logic here
                sessionStorage.removeItem("jwtToken");
                navigate("/");
              }}
              className="block w-full bg-[#D9534F] hover:bg-[#c9302c] text-white rounded"
            >
              Logout
            </Button>
          </div>
        </nav>

        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <header className="bg-[#201E43] text-white p-4 flex items-center justify-between md:flex">
            <span className="text-lg font-semibold">Dashboard</span>
            {isMobile ?? (
              <button
                className="text-white"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <HiX className="w-6 h-6" />
                ) : (
                  <HiMenu className="w-6 h-6" />
                )}
              </button>
            )}
          </header>

          {/* Main Content */}
          <main className="flex-1 bg-[#134B70] p-4 text-white overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Your dashboard content here */}
              <div className="bg-[#201E43] p-4 rounded">
                {/* Use the provided code for a specific section */}
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-lg mb-4">Welcome to the Dashboard</div>
                  <Link
                    to={"/Client"}
                    className="border-solid border-2 bg-[#201E43] border-[#134B70] text-white focus:ring-4 font-medium rounded-lg px-4 py-2 text-center"
                  >
                    Go to Client Dashboard
                  </Link>
                </div>
              </div>
              {/* Other dashboard components */}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
