import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login/login";
import Project from "./components/Internal/ProjectManagment/projectManagment";
import Dashboard from "./components/Internal/Dashboard/dashboard";
import Completed from "./components/Client/Completed/completed";
import Sidebar from "./components/Internal/Sidebar/sidebar";
import SidebarClient from "./components/Client/Sidebar/sidebar";
import DashboardClient from "./components/Client/Dashboard/dashboard";
import InProgress from "./components/Client/InProgress/inProgress";
import ClientMangement from "./components/Admin/ClientManagement/client";
import EditorManagement from "./components/Admin/EditorManagement/editor";
import "./App.css";
import "flowbite";
import SignUp from "./components/SignUp/signup";
import SignUpEditor from "./components/EditorSignUp/signupEditor";
import Settings from "./components/Settings/settings";
import ForgetPassword from "./components/ForgetPassword/forget";
import CompletedProjects from "./components/Admin/CompletedProjects/completedProjects";
import io from "socket.io-client";

// Usage in your routes or components
//client - https://dcsocket.thecbt.live/
//our - https://dc-socket.thecbt.live/
//const socket = io.connect("http://192.168.100.33:4000");
export const socket = io("https://dcsocket.thecbt.live/", {
  // Configure CORS options
  transports: ["websocket"],
  withCredentials: false,
  extraHeaders: {
    "Access-Control-Allow-Origin": "https://dcsocket.thecbt.live/", // Replace with your frontend origin
  },
});
const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const userid = localStorage.getItem("id");
  const [role, setRole] = useState("");
  const [token, setToken] = useState("");
  const [search, setSearch] = useState();

  const login = (userRole, userToken) => {
    setLoggedIn(true);
    setRole(userRole);
    setToken(userToken);
  };

  useEffect(() => {
    // Handle WebSocket events
    socket.on("connect", () => {
      console.log("Connected to the WebSocket server");
    });

    // socket.on("disconnect", () => {
    //   console.log("Disconnected from the WebSocket server");
    // });
    // return () => {
    //   // Clean up the WebSocket connection on unmount if needed
    //   socket.disconnect();
    // };
  }, []);
  const withAuth = (WrappedComponent, allowedRoles) => {
    return class extends React.Component {
      render() {
        const isAuthenticated = localStorage.getItem("token"); // Replace with your authentication logic
        const userRole = localStorage.getItem("role"); // Replace with your logic to get the user's role
        if (isAuthenticated && allowedRoles.includes(userRole)) {
          return <WrappedComponent {...this.props} />;
        } else {
          return <Navigate to="/" />;
        }
      }
    };
  };

  // Route configuration
  const routes = [
    {
      path: "/",
      element: <Login login={login} />,
      isProtected: false, // Public route
    },
    {
      path: "/signup",
      element: <SignUp />,
      isProtected: false, // Public route
    },
    {
      path: "/user-signup/:id",
      element: <SignUpEditor />,
      isProtected: false, // Public route
    },
    {
      path: "/forget-password/:id",
      element: <ForgetPassword />,
      isProtected: false, // Public route
    },
    {
      path: "/settings",
      element: (
        <Route
          element={
            <withAuth
              component={Settings}
              allowedRoles={["admin", "editor", "client"]}
            />
          }
        />
      ),
      isProtected: true, // Protected route
    },
    {
      path: "/admin",
      element: (
        <Route
          element={<withAuth component={Dashboard} allowedRoles={["admin"]} />}
        />
      ),
      isProtected: true, // Protected route
    },
    {
      path: "/admin/project-management",
      element: (
        <Route
          element={<withAuth component={Project} allowedRoles={["admin"]} />}
        />
      ),
      isProtected: true, // Protected route
    },
    {
      path: "/admin/editor-management",
      element: (
        <Route
          element={
            <withAuth component={EditorManagement} allowedRoles={["admin"]} />
          }
        />
      ),
      isProtected: true, // Protected route
    },
    {
      path: "/admin/client-management",
      element: (
        <Route
          element={
            <withAuth component={ClientMangement} allowedRoles={["admin"]} />
          }
        />
      ),
      isProtected: true, // Protected route
    },
    {
      path: "/admin/completed-projects",
      element: (
        <Route
          element={
            <withAuth component={CompletedProjects} allowedRoles={["admin"]} />
          }
        />
      ),
      isProtected: true, // Protected route
    },
    {
      path: "/client",
      element: (
        <Route
          element={
            <withAuth component={DashboardClient} allowedRoles={["client"]} />
          }
        />
      ),
      isProtected: true, // Protected route
    },
    {
      path: "/client/in-progress",
      element: (
        <Route
          element={
            <withAuth component={InProgress} allowedRoles={["client"]} />
          }
        />
      ),
      isProtected: true, // Protected route
    },
    {
      path: "/client/completed",
      element: (
        <Route
          element={<withAuth component={Completed} allowedRoles={["client"]} />}
        />
      ),
      isProtected: true, // Protected route
    },
    {
      path: "/editor",
      element: (
        <Route
          element={<withAuth component={Dashboard} allowedRoles={["editor"]} />}
        />
      ),
      isProtected: true, // Protected route
    },
    {
      path: "/editor/project-management",
      element: (
        <Route
          element={<withAuth component={Project} allowedRoles={["editor"]} />}
        />
      ),
      isProtected: true, // Protected route
    },
    // Add more routes as needed
  ];

  return (
    <>
      <Sidebar role={role} />
      <SidebarClient role={role} setSearch={setSearch} search={search} />
      <Routes>
        {routes.map((route, index) => {
          if (route.isProtected) {
            const ProtectedComponent = withAuth(
              route.element.props.element.props.component,
              route.element.props.element.props.allowedRoles
            );
            return (
              <Route
                key={index}
                path={route.path}
                element={<ProtectedComponent search={search} />}
              />
            );
          } else {
            return (
              <Route key={index} path={route.path} element={route.element} />
            );
          }
        })}
      </Routes>
    </>
  );
};
export default App;
