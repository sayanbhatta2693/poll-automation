// src/components/LoginForm.tsx
import React from "react";
import { useNavigate, Link } from "react-router-dom"; // ⬅️ Import Link

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: "teacher" | "student") => {
    navigate(`/dashboard/${role}`);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-xl rounded-xl p-10 text-center space-y-6">
        <h2 className="text-2xl font-bold">Poll Automation System</h2>
        <p className="text-gray-600">Select your role to continue</p>
        <div className="space-x-4">
          <button
            onClick={() => handleRoleSelection("teacher")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl"
          >
            Login as Teacher
          </button>
          <button
            onClick={() => handleRoleSelection("student")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl"
          >
            Login as Student
          </button>
        </div>

        {/* Add this */}
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
