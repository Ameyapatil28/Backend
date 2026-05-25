import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [], guestOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
                <div className="spinner-border text-info" role="status" style={{ width: "3rem", height: "3rem" }}>
                    <span className="visually-hidden">Loading Profile...</span>
                </div>
            </div>
        );
    }

    // 1. Route is for non-logged-in users only (Login/Register)
    if (guestOnly) {
        if (user) {
            // Redirect logged-in users to their respective dashboard
            return <Navigate to={user.role === "admin" ? "/admin" : "/student"} replace />;
        }
        return children;
    }

    // 2. Private route for authenticated users
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Role-based auth verification
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        console.warn(`Protected Access blocked: Role '${user.role}' is not in allowed list [${allowedRoles}]`);
        return <Navigate to={user.role === "admin" ? "/admin" : "/student"} replace />;
    }

    return children;
};

export default ProtectedRoute;
