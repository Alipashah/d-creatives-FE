import React, { useEffect, useState, useRef } from "react";
import logo from "../../../../src/assets/images/sidebar-05.svg";
import logo1 from "../../../../src/assets/images/Ouzo-home.webp";
import SidebarLogo01 from "../../../../src/assets/images/sidebar-06.svg";
import SidebarLogo02 from "../../../../src/assets/images/sidebar-07.svg";
import SidebarLogo03 from "../../../../src/assets/images/sidebar-08.svg";
import SidebarLogo04 from "../../../../src/assets/images/sidebar-09.svg";
import SidebarLogo05 from "../../../../src/assets/images/sidebar-10.svg";
import client from "../../../assets/images/client.svg";
import editor from "../../../assets/images/editor.svg";
import completed from "../../../assets/images/completed.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Logout from "../../Logout/logout";
import Notification from "../Notification/notification";
import { socket } from "../../../App";

function Sidebar(props) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || props.role;
  const location = useLocation();
  const id = localStorage.getItem("id");
  const [notification, setNotification] = useState(false);
  const [newNotification, setNewNotification] = useState(true);

  function handleNotification() {
    if (newNotification) setNewNotification(false);
    if (notification) setNotification(false);
    else setNotification(true);
  }

  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef(null);
  const notificationRef = useRef(null);

  // Function to toggle the drawer open/close
  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };

  // Function to close the drawer when clicking outside of it
  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      setIsOpen(false);
    }
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setNotification(false);
    }
  };

  useEffect(() => {
    socket.on("notifaction-list", (res) => {
      const user_id = parseInt(id);

      if (res?.editor && res?.editor?.includes(user_id)) {
        setNewNotification(true);
      }
    });
  }, [socket]);

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
        location.pathname === "/admin" ||
        location.pathname === "/editor" ||
        location.pathname === "/admin/editor-management" ||
        location.pathname === "/admin/client-management" ||
        location.pathname === "/admin/project-management" ||
        location.pathname === "/editor/project-management" ||
        location.pathname === "/admin/completed-projects") &&
        (role === "editor" || role === "admin") && (
          <>
            <div
              onClick={toggleDrawer}
              className="sm:hidden block ps-3 pt-1 lg:px-5 lg:pl-3"
            >
              <div className="flex">
                <button
                  data-drawer-toggle="logo-sidebar"
                  aria-controls="logo-sidebar"
                  type="button"
                  className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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

            <div className="sidebar-bg-editor fixed top-0 left-0 z-40 w-16 h-screen pt-10 flex flex-col flex-between  -translate-x-full  sm:translate-x-0">
              <div className=" h-screen px-3 pb-4 overflow-y-auto ">
                <div
                  className="flex justify-center mt-4 items-center mb-10 cursor-pointer"
                  onClick={() => {
                    if (role === "admin") navigate("/admin");
                    else navigate("/editor");
                  }}
                >
                  <img src={logo1} alt="logo-01" className="w-8" />
                </div>

                <ul className="space-y-1 whitespace-nowrap">
                  {role === "admin" ? (
                    <li>
                      <div
                        onClick={() => {
                          navigate("/admin");
                        }}
                        className="cursor-pointer tooltip flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <img
                          src={SidebarLogo01}
                          alt="logo-01"
                          className="w-5"
                        />
                        <span className="tooltiptext">Dashboard</span>
                      </div>
                    </li>
                  ) : (
                    <li>
                      <div
                        onClick={() => {
                          navigate("/editor");
                        }}
                        className="cursor-pointer tooltip flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <img
                          src={SidebarLogo01}
                          alt="logo-01"
                          className="w-5"
                        />
                        <span className="tooltiptext">Dashboard</span>
                      </div>
                    </li>
                  )}
                  {role === "editor" && (
                    <li>
                      <div
                        onClick={() => {
                          navigate("/editor/project-management");
                        }}
                        className="cursor-pointer tooltip flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <img
                          src={SidebarLogo02}
                          alt="logo-01"
                          className="w-5"
                        />
                        <span className="tooltiptext">Project Management</span>
                      </div>
                    </li>
                  )}
                  {role === "admin" && (
                    <li>
                      <div
                        onClick={() => {
                          navigate("/admin/project-management");
                        }}
                        className="cursor-pointer tooltip flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <img
                          src={SidebarLogo02}
                          alt="logo-01"
                          className="w-5"
                        />
                        <span className="tooltiptext">Project Management</span>
                      </div>
                    </li>
                  )}
                  {role === "admin" && (
                    <li>
                      <div
                        onClick={() => {
                          navigate("/admin/editor-management");
                        }}
                        className="cursor-pointer tooltip flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <img src={editor} alt="logo-01" className="w-5" />
                        <span className="tooltiptext">User Management</span>
                      </div>
                    </li>
                  )}
                  {role === "admin" && (
                    <li>
                      <div
                        onClick={() => {
                          navigate("/admin/client-management");
                        }}
                        className="cursor-pointer tooltip flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <img src={client} alt="logo-01" className="w-5" />
                        <span className="tooltiptext">Client Management</span>
                      </div>
                    </li>
                  )}
                  {role === "admin" && (
                    <li>
                      <div
                        onClick={() => {
                          navigate("/admin/completed-projects");
                        }}
                        className="cursor-pointer tooltip flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <img src={completed} alt="logo-01" className="w-5" />
                        <span className="tooltiptext">Completed Projects</span>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
              <div className="px-3 pb-3">
                <div
                  className="p-2 relative cursor-pointer text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  onClick={handleNotification}
                >
                  {newNotification && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 10,
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "red",
                      }}
                    ></div>
                  )}
                  <img src={SidebarLogo03} alt="icon" className="w-4" />
                </div>
                <div
                  className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate("settings");
                  }}
                >
                  <img src={SidebarLogo04} alt="icon" className="w-4" />
                </div>
                <button
                  onClick={toggleDrawer}
                  type="button"
                  className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                >
                  <span className="sr-only">Open sidebar</span>
                  <img src={SidebarLogo05} alt="icon" className="w-4" />
                </button>
              </div>
            </div>

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
                  className="sidebar-bg-editor pt-10 w-64 flex flex-col justify-between"
                  ref={drawerRef}
                  style={{
                    height: "100vh",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 100,
                    fontWeight: "600",
                    boxShadow: "0px 0px 6px 0px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className=" h-screen px-3 pb-4 overflow-y-auto ">
                    <div
                      className="flex justify-center items-center mb-10 cursor-pointer"
                      onClick={() => {
                        if (role === "admin") navigate("/admin");
                        else navigate("/editor");
                      }}
                    >
                      <img src={logo1} alt="logo-01" className="w-28" />
                    </div>
                    <ul className="space-y-1 whitespace-nowrap ">
                      {role === "admin" ? (
                        <li>
                          <div
                            onClick={() => {
                              toggleDrawer();
                              navigate("/admin");
                            }}
                            className="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <img
                              src={SidebarLogo01}
                              alt="logo-01"
                              className="w-5 me-3"
                            />
                            Dashboard
                          </div>
                        </li>
                      ) : (
                        <li>
                          <div
                            onClick={() => {
                              toggleDrawer();
                              navigate("/editor");
                            }}
                            className="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <img
                              src={SidebarLogo01}
                              alt="logo-01"
                              className="w-5 me-3"
                            />
                            Dashboard
                          </div>
                        </li>
                      )}
                      {role === "editor" && (
                        <li>
                          <div
                            onClick={() => {
                              toggleDrawer();
                              navigate("/editor/project-management");
                            }}
                            className="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <img
                              src={SidebarLogo02}
                              alt="logo-01"
                              className="w-5 me-3"
                            />
                            Project Management
                          </div>
                        </li>
                      )}
                      {role === "admin" && (
                        <li>
                          <div
                            onClick={() => {
                              toggleDrawer();
                              navigate("/admin/project-management");
                            }}
                            className="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <img
                              src={SidebarLogo02}
                              alt="logo-01"
                              className="w-5 me-3"
                            />
                            Project Management
                          </div>
                        </li>
                      )}
                      {role === "admin" && (
                        <li>
                          <div
                            onClick={() => {
                              toggleDrawer();
                              navigate("/admin/editor-management");
                            }}
                            className="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <img
                              src={editor}
                              alt="logo-01"
                              className="w-5 me-3"
                            />
                            User Management
                          </div>
                        </li>
                      )}
                      {role === "admin" && (
                        <li>
                          <div
                            onClick={() => {
                              toggleDrawer();
                              navigate("/admin/client-management");
                            }}
                            className="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <img
                              src={client}
                              alt="logo-01"
                              className="w-5 me-3"
                            />
                            Client Management
                          </div>
                        </li>
                      )}
                      {role === "admin" && (
                        <li>
                          <div
                            onClick={() => {
                              toggleDrawer();
                              navigate("/admin/completed-projects");
                            }}
                            className="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <img
                              src={completed}
                              alt="logo-01"
                              className="w-5 me-3"
                            />
                            Completed Projects
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="px-3 pb-3 flex">
                    <button
                      onClick={toggleDrawer}
                      type="button"
                      className="inline-flex items-center p-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    >
                      <span className="sr-only">Open sidebar</span>
                      <img src={SidebarLogo05} alt="icon" className="w-4" />
                    </button>
                    <div
                      className="p-3 relative cursor-pointer text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                      onClick={handleNotification}
                    >
                      {newNotification && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 10,
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: "red",
                          }}
                        ></div>
                      )}
                      <img src={SidebarLogo03} alt="icon" className="w-4" />
                    </div>
                    <div
                      className="p-3 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        toggleDrawer();
                        navigate("settings");
                      }}
                    >
                      <img src={SidebarLogo04} alt="icon" className="w-4" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      <Notification
        notificationRef={notificationRef}
        notification={notification}
        setNotification={setNotification}
      />
    </>
  );
}

export default Sidebar;
