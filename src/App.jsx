import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import RequestAbsenceForm from "./components/Absence/RequestAbsenceForm";
import RemplacementSuggestPage from "./pages/RemplacementSuggest";
import Dashboard from "./components/Dashboard/Dashboard";
import HeaderWithAuth from "./components/Layout/HeaderWithAuth";
import PrivateRoute from "./components/Layout/PrivateRoute";
import HomePage from "./pages/HomePage";
import CreatePassword from "./pages/CreatePassword";
import { useAuth } from "./context/AuthProvider";
import EmployeeAdmin from "./components/Employee/EmployeeAdmin";
import RemplacementAdmin from "./pages/RemplacementAdmin";
import Profile from "./components/Profile/Profile";
import Calendar from "./components/Dashboard/Calendar";
import HistoriqueAbsences from "./components/Dashboard/HistoriqueAbsences";
import EmployeeDashboardTab from "./components/Employee/EmployeeDashboardTab";
import MesTaches from "./pages/MesTaches";
import { ToastContainer } from 'react-toastify';

function AppContent() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const showHeader = user && !["/", "/login", "/register"].includes(pathname);
  return (
    <div className="min-h-screen bg-accent">
      {showHeader && <HeaderWithAuth />}
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/remplacement-suggest" element={<PrivateRoute><RemplacementSuggestPage /></PrivateRoute>} />
        <Route path="/remplacement-admin" element={<PrivateRoute><RemplacementAdmin /></PrivateRoute>} />
        <Route path="/absence/request" element={<PrivateRoute><RequestAbsenceForm /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard/calendar" replace />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="taches" element={<MesTaches />} />
          <Route path="absence" element={<RequestAbsenceForm />} />
          <Route path="remplacement" element={<RemplacementAdmin />} />
          <Route path="historique" element={<HistoriqueAbsences />} />
          <Route path="employes" element={<EmployeeDashboardTab />} />
        </Route>
        <Route path="/admin/employes" element={<PrivateRoute><EmployeeAdmin /></PrivateRoute>} />
        <Route path="/creer-mot-de-passe" element={<CreatePassword />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <ToastContainer position="top-right" autoClose={5000} />
    </BrowserRouter>
  );
}

