import React from "react";
import QuizApp from "./pages/QuizApp";
import AdminPage from "./pages/AdminPage";
import { CategoriesProvider } from "./contexts/CategoriesContext";
import "./style.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";

const ProtectedRoute = ({ element }) => {
  const { token } = useAuth();
  return token ? element : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CategoriesProvider>
          <Routes>
            <Route path="/" element={<QuizApp />} />
            <Route
              path="/admin/*"
              element={<ProtectedRoute element={<AdminPage />} />}
            />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </CategoriesProvider>
      </AuthProvider>
    </Router>
  );
}
