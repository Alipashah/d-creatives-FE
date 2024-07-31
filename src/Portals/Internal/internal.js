import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "../../components/Internal/Sidebar/sidebar";
import Dashboard from "../../components/Internal/Dashboard/dashboard";
import Project from "../../components/Internal/ProjectManagment/projectManagment";
import PrivateRoute from "../../PrivateRoute";

function Internal() {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/editor" element={<Dashboard />} />
        <Route path="/editor/project-managment" element={<Project />} />
        <Route path="*" element={<Navigate to="/editor" />}></Route>
      </Routes>
    </>
  );
}

export default Internal;
