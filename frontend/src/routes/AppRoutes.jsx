import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "@/pages/Login/Login";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Employees from "@/pages/Employees/Employees";
import Reports from "@/pages/Reports/Reports";
import Attendance from "@/pages/Attendance/Attendance";
import DailyActivity from "@/pages/DailyActivity/DailyActivity";
import Tasks from "@/pages/Tasks/Tasks";
import EmployeeTasks from "@/pages/EmployeeTasks/EmployeeTasks";

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
            <Route path="/daily-activity" element={<DailyActivity />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/employee-tasks" element={<EmployeeTasks />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default AppRoutes;