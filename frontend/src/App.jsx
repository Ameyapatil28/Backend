import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CourseList from "./pages/CourseList";
import StudentList from "./pages/StudentList";

// Root redirection controller
const RootRedirect = () => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return <Navigate to={user.role === "admin" ? "/admin" : "/student"} replace />;
};

const AppContent = () => {
    return (
        <BrowserRouter>
            <div className="bg-dark min-vh-100 text-light d-flex flex-column">
                <Navbar />
                <main className="flex-grow-1">
                    <Routes>
                        {/* Root Route Redirects dynamically */}
                        <Route path="/" element={<RootRedirect />} />

                        {/* Guest-only auth routes */}
                        <Route 
                            path="/login" 
                            element={
                                <ProtectedRoute guestOnly>
                                    <Login />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/register" 
                            element={
                                <ProtectedRoute guestOnly>
                                    <Register />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Protected Student Portal */}
                        <Route 
                            path="/student" 
                            element={
                                <ProtectedRoute allowedRoles={["student"]}>
                                    <StudentDashboard />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Protected Admin Hub */}
                        <Route 
                            path="/admin" 
                            element={
                                <ProtectedRoute allowedRoles={["admin"]}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Protected Course Directories (Admin only) */}
                        <Route 
                            path="/courses" 
                            element={
                                <ProtectedRoute allowedRoles={["admin"]}>
                                    <CourseList />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Protected Student Directory Roster (Admin only) */}
                        <Route 
                            path="/students" 
                            element={
                                <ProtectedRoute allowedRoles={["admin"]}>
                                    <StudentList />
                                </ProtectedRoute>
                            } 
                        />

                        {/* Fallback route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
