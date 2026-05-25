import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary shadow-lg py-3 sticky-top">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-info" to="/">
                    <span className="fs-3">🎓</span>
                    <span className="tracking-wide">EduManage</span>
                </Link>

                <button 
                    className="navbar-toggler border-secondary" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
                        {user && (
                            <>
                                <li className="nav-item">
                                    <Link 
                                        className="nav-link px-3 rounded hover-glow text-light" 
                                        to={user.role === "admin" ? "/admin" : "/student"}
                                    >
                                        🏠 Dashboard
                                    </Link>
                                </li>
                                {user.role === "admin" && (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link px-3 rounded hover-glow text-light" to="/courses">
                                                📚 Courses
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link px-3 rounded hover-glow text-light" to="/students">
                                                👥 Students
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </>
                        )}
                    </ul>

                    <div className="d-flex align-items-center gap-3">
                        {user ? (
                            <>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="text-secondary small">Logged in as:</span>
                                    <span className="fw-semibold text-info">{user.student_name}</span>
                                    <span className={`badge rounded-pill text-uppercase ${
                                        user.role === "admin" 
                                            ? "bg-danger text-light shadow-sm" 
                                            : "bg-info text-dark shadow-sm"
                                    }`} style={{ fontSize: "0.75rem", padding: "0.4em 0.8em" }}>
                                        {user.role}
                                    </span>
                                </div>
                                <button 
                                    className="btn btn-outline-danger btn-sm px-3 py-2 rounded d-flex align-items-center gap-1 transition-all"
                                    onClick={handleLogout}
                                >
                                    🚪 Logout
                                </button>
                            </>
                        ) : (
                            <div className="d-flex gap-2">
                                <Link className="btn btn-outline-info btn-sm px-3 py-2" to="/login">
                                    Sign In
                                </Link>
                                <Link className="btn btn-info btn-sm px-3 py-2 text-dark fw-semibold" to="/register">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
