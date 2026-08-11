import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "@/pages/Login/Login";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Employees from "@/pages/Employees/Employees";
import Reports from "@/pages/Reports/Reports";
import Attendance from "@/pages/Attendance/Attendance";

import ProtectedRoute from "@/routes/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/attendance" element={<Attendance />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default AppRoutes;