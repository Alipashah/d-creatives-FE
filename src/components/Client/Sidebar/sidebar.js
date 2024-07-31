import React, { useEffect, useState, useRef } from "react";
import SidebarLogo01 from "../../../../src/assets/images/sidebar-01.svg";
import SidebarLogo02 from "../../../../src/assets/images/sidebar-02.svg";
import SidebarLogo03 from "../../../../src/assets/images/sidebar-03.svg";
import SidebarLogo04 from "../../../../src/assets/images/sidebar-09.svg";
import { useLocation, useNavigate } from "react-router-dom";
import Logout from "../../Logout/logout";

function Sidebar(props) {
  const navigate = useNavigate();
  const image = localStorage.getItem("image");
  const role = localStorage.getItem("role") || props.role;
  const location = useLocation();
  const [isClick, setIsClick] = useState(false);
  function hanldeClick() {
    if (isClick) setIsClick(false);
    else setIsClick(true);
  }
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef(null);
  const clickRef = useRef(null);

  // Function to toggle the drawer open/close
  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  // Function to close the drawer when clicking outside of it
  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      setIsOpen(false);
    }
    if (clickRef.current && !clickRef.current.contains(event.target)) {
      setIsClick(false);
    }
  };

  useEffect(() => {
    // Add event listener to handle clicks outside the drawer
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {(location.pathname === "/settings" ||
        location.pathname == "/client" ||
        location.pathname == "/client/in-progress" ||
        location.pathname == "/client/completed") &&
        role === "client" && (
          <>
            <nav className="fixed top-0 z-50 w-screen sidebar-bg ">
              <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                  <div className="flex">
                    <div className="flex items-center justify-start me-2">
                      <button
                        onClick={toggleDrawer}
                        type="button"
                        className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                      >
                        <span className="sr-only">Open sidebar</span>
                        <svg
                          className="w-6 h-6"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            clip-rule="evenodd"
                            fill-rule="evenodd"
                            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center sidebar-heading">
                      Client Portal
                    </div>
                  </div>
                  <div className="flex me-4">
                    <div className="flex items-center">
                      <div className="flex items-center ml-3">
                        <div>
                          <button
                            type="button"
                            onClick={hanldeClick}
                            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                          >
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="w-8 h-8 rounded-full"
                              src={
                                image
                                  ? image
                                  : "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                              }
                              alt="user photo"
                            />
                          </button>
                        </div>
                        {isClick && (
                          <div
                            ref={clickRef}
                            className="absolute z-50 right-2 mt-24 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                          >
                            <div className="px-4 py-3">
                              <Logout />
                            </div>
                          </div>
                        )}
                        {/* <img
                          onClick={() => {
                            navigate("settings");
                          }}
                          className="w-8 h-8 rounded-full cursor-pointer"
                          src={
                            image
                              ? image
                              : "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                          }
                          alt="user photo"
                        /> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            <aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-12 transition-transform -translate-x-full  sm:translate-x-0 ">
              <div className="sidebar-bg h-screen px-6 pb-4 pt-3 overflow-y-auto ">
                <ul className="space-y-1 ">
                  <li>
                    <label for="simple-search" className="sr-only">
                      Search
                    </label>
                    <div className="relative w-full pl-2">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-500 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="simple-search"
                        onChange={(e) => props.setSearch(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-1 mt-1 mb-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search"
                        required
                        autocomplete="off"
                      />
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        navigate("/client");
                      }}
                      className="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
                    >
                      <img src={SidebarLogo01} alt="logo-01" className="w-5" />
                      <span className="ml-3 sidebar-text">Dashboard</span>
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        navigate("/client/in-progress");
                      }}
                      className="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
                    >
                      <img src={SidebarLogo02} alt="logo-01" className="w-5" />
                      <span className="ml-3 sidebar-text">In Progress</span>
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        navigate("/client/completed");
                      }}
                      className="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
                    >
                      <img src={SidebarLogo03} alt="logo-01" className="w-5" />
                      <span className="ml-3 sidebar-text">
                        Completed Projects
                      </span>
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        navigate("/settings");
                      }}
                      className="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
                    >
                      <img src={SidebarLogo04} alt="logo-01" className="w-5" />
                      <span className="ml-3 sidebar-text">Settings</span>
                    </div>
                  </li>
                </ul>
              </div>
            </aside>

            {isOpen && (
              <div
                className="w-full"
                style={{
                  height: "100vh",
                  position: "fixed",
                  top: 0,
                  left: 0,
                  zIndex: 100,
                  background: "rgb(0,0,0,0.3)",
                }}
              >
                <div
                  className="w-56 h-screen"
                  ref={drawerRef}
                  style={{
                    height: "100vh",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 100,
                  }}
                >
                  <div className="sidebar-bg h-screen px-3 pb-4 pt-3 overflow-y-auto flex justify-between flex-col ">
                    <ul className="space-y-1 ">
                      <li>
                        <label for="simple-search" className="sr-only">
                          Search
                        </label>
                        <div className="relative w-full pl-2 cursor-pointer">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <svg
                              aria-hidden="true"
                              className="w-5 h-5 text-gray-500 dark:text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={props.search}
                            id="simple-search"
                            onChange={(e) => props.setSearch(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") setIsOpen(false);
                            }}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-1 mt-1 mb-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search"
                            required
                          />
                        </div>
                      </li>
                      <li>
                        <div
                          onClick={() => {
                            toggleDrawer();
                            navigate("/client");
                          }}
                          className="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
                        >
                          <img
                            src={SidebarLogo01}
                            alt="logo-01"
                            className="w-5"
                          />
                          <span className="ml-3 sidebar-text">Dashboard</span>
                        </div>
                      </li>
                      <li>
                        <div
                          onClick={() => {
                            toggleDrawer();
                            navigate("/client/in-progress");
                          }}
                          className="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
                        >
                          <img
                            src={SidebarLogo02}
                            alt="logo-01"
                            className="w-5"
                          />
                          <span className="ml-3 sidebar-text">In Progress</span>
                        </div>
                      </li>
                      <li>
                        <div
                          onClick={() => {
                            toggleDrawer();
                            navigate("/client/completed");
                          }}
                          className="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
                        >
                          <img
                            src={SidebarLogo03}
                            alt="logo-01"
                            className="w-5"
                          />
                          <span className="ml-3 sidebar-text">
                            Completed Projects
                          </span>
                        </div>
                      </li>
                      <li>
                        <div
                          onClick={() => {
                            toggleDrawer();
                            navigate("/settings");
                          }}
                          className="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
                        >
                          <img
                            src={SidebarLogo04}
                            alt="logo-01"
                            className="w-5"
                          />
                          <span className="ml-3 sidebar-text">Settings</span>
                        </div>
                      </li>
                    </ul>
                    <div className="flex items-center justify-start me-2">
                      <button
                        onClick={toggleDrawer}
                        type="button"
                        className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                      >
                        <span className="sr-only">Open sidebar</span>
                        <svg
                          className="w-6 h-6"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            clip-rule="evenodd"
                            fill-rule="evenodd"
                            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
    </>
  );
}

export default Sidebar;
