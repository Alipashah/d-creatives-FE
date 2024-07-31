import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "../../components/Client/Sidebar/sidebar";
import Dashboard from "../../components/Client/Dashboard/dashboard";
import Inprogress from "../../components/Client/InProgress/inProgress";
import Completed from "../../components/Client/Completed/completed";
import Invoices from "../../components/Client/Invoices/invoices";
import Services from "../../components/Client/Services/services";
import PrivateRoute from "../../PrivateRoute";

function Client() {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/client" element={<Dashboard />} />
        <Route path="/client/in-progress" element={<Inprogress />} />
        <Route path="/client/completed" element={<Completed />} />
        <Route path="/client/invoices" element={<Invoices />} />
        <Route path="/client/services" element={<Services />} />
        <Route path="*" element={<Navigate to="/client" />}></Route>
      </Routes>
    </>
  );
}

export default Client;
