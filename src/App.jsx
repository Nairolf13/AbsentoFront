import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import RequestAbsenceForm from "./components/Absence/RequestAbsenceForm";
import RemplacementSuggestPage from "./pages/RemplacementSuggest";
import Dashboard from "./components/Dashboard/Dashboard";
import HeaderWithAuth from "./components/Layout/HeaderWithAuth";
import PrivateRoute from "./components/Layout/PrivateRoute";
import HomePage from "./pages/HomePage";
import CreatePassword from "./pages/CreatePassword";
import useAuth from "./hooks/useAuth";
import EmployeeAdmin from "./components/Employee/EmployeeAdmin";

function AppContent() {
  const { pathname } = useLocation();
  const { token } = useAuth();
  // Affiche le header si connecté ET pas sur la home, login ou register
  const showHeader = token && !["/", "/login", "/register"].includes(pathname);
  return (
    <div className="min-h-screen bg-accent">
      {showHeader && <HeaderWithAuth />}
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/absence/request" element={<PrivateRoute><RequestAbsenceForm /></PrivateRoute>} />
        <Route path="/absence/suggest" element={<PrivateRoute><RemplacementSuggestPage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin/employes" element={<PrivateRoute><EmployeeAdmin /></PrivateRoute>} />
        <Route path="/creer-mot-de-passe" element={<CreatePassword />} />
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
    </BrowserRouter>
  );
}

// Note: The link to the register page should be added in the LoginForm component, not in the App component.
// The following code should be added in the LoginForm component:
// 
// import { useNavigate } from "react-router-dom";
// 
// function LoginForm() {
//   const navigate = useNavigate();
// 
//   return (
//     // ...
//     <div className="text-xs text-center mt-4 text-secondary cursor-pointer" onClick={() => navigate('/register')}>Create an account</div>
//     // ...
//   );
// }
