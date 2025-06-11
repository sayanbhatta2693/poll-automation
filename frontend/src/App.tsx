import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import your components
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login Page */}
        <Route path="/login" element={<LoginForm />} />

        {/* Register Page */}
        <Route path="/register" element={<RegisterForm />} />

        {/* Teacher Dashboard */}
        <Route path="/dashboard/teacher" element={<TeacherDashboard />} />

        {/* Student Dashboard */}
        <Route path="/dashboard/student" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
