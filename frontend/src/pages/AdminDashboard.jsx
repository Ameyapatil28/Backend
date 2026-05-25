import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { courseService, studentService } from "../services/api";

const AdminDashboard = () => {
    const [stats, setStats] = useState({ coursesCount: 0, studentsCount: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const courses = await courseService.getAll();
                const students = await studentService.getAll();
                setStats({
                    coursesCount: courses.length,
                    studentsCount: students.length
                });
            } catch (err) {
                console.error("Dashboard stats error:", err.message);
                setError("Could not load latest system stats.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-light">
                <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading Hub...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-dark text-light py-5">
            <div className="container">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-4 mb-5">
                    <div>
                        <h1 className="fw-bold text-info">Admin Control Center</h1>
                        <p className="text-secondary mb-0">System health, courses database, and students rosters</p>
                    </div>
                    <span className="fs-1 d-none d-md-inline">🛠️</span>
                </div>

                {error && (
                    <div className="alert alert-warning border-warning bg-warning-subtle text-warning-emphasis mb-4 rounded" role="alert">
                        ⚠️ {error}
                    </div>
                )}

                {/* KPI Metrics */}
                <div className="row g-4 mb-5">
                    <div className="col-12 col-md-6">
                        <div 
                            className="card border-secondary text-light p-4 h-100 shadow-sm"
                            style={{ background: "rgba(33, 37, 41, 0.7)", borderRadius: "12px" }}
                        >
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <span className="text-secondary small uppercase tracking-wider">Total Active Courses</span>
                                    <h2 className="display-4 fw-bold mt-1 text-info">{stats.coursesCount}</h2>
                                </div>
                                <span className="fs-1 bg-dark px-3 py-2 rounded">📚</span>
                            </div>
                            <div className="mt-4 pt-3 border-top border-secondary">
                                <Link className="btn btn-outline-info w-100 fw-semibold rounded" to="/courses">
                                    Manage Courses Base →
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div 
                            className="card border-secondary text-light p-4 h-100 shadow-sm"
                            style={{ background: "rgba(33, 37, 41, 0.7)", borderRadius: "12px" }}
                        >
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <span className="text-secondary small uppercase tracking-wider">Total Registered Students</span>
                                    <h2 className="display-4 fw-bold mt-1 text-info">{stats.studentsCount}</h2>
                                </div>
                                <span className="fs-1 bg-dark px-3 py-2 rounded">👥</span>
                            </div>
                            <div className="mt-4 pt-3 border-top border-secondary">
                                <Link className="btn btn-outline-info w-100 fw-semibold rounded" to="/students">
                                    Manage Students Roster →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div 
                    className="card border-secondary text-light p-4 shadow-lg mb-5"
                    style={{ background: "rgba(25, 25, 25, 0.9)", borderRadius: "12px" }}
                >
                    <h4 className="fw-bold mb-4 text-light">⚡ Quick Administrative Actions</h4>
                    <div className="row g-3">
                        <div className="col-12 col-sm-6 col-lg-3">
                            <Link className="btn btn-info text-dark w-100 py-3 fw-bold rounded shadow-sm" to="/courses">
                                ➕ Add New Course
                            </Link>
                        </div>
                        <div className="col-12 col-sm-6 col-lg-3">
                            <Link className="btn btn-info text-dark w-100 py-3 fw-bold rounded shadow-sm" to="/students">
                                ➕ Register Student
                            </Link>
                        </div>
                        <div className="col-12 col-sm-6 col-lg-3">
                            <Link className="btn btn-outline-light w-100 py-3 fw-bold rounded" to="/courses">
                                📋 Check Roster Ratios
                            </Link>
                        </div>
                        <div className="col-12 col-sm-6 col-lg-3">
                            <a 
                                className="btn btn-outline-secondary w-100 py-3 fw-semibold rounded" 
                                href="http://localhost:5000" 
                                target="_blank" 
                                rel="noreferrer"
                            >
                                🔌 Test API Connection
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
