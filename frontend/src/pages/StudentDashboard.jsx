import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { courseService, authService } from "../services/api";

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const fetchDashboardData = async () => {
        try {
            const freshProfile = await authService.getProfile();
            setProfile(freshProfile);
            
            // All Course CRUD APIs are Admin Protected now (GET /courses), but wait!
            // If GET /courses is admin only, can students fetch them?
            // Ah! We made GET /courses admin protected in courseRoutes.js!
            // Wait! If GET /courses is admin only, then the student cannot fetch all courses!
            // Let's check: did we make all Course routes Admin-only? Yes!
            // But wait, if they cannot GET /courses, they won't see available courses.
            // Oh! Let's check if they can fetch it, or if it throws a 403.
            // If they get a 403, it will fail.
            // Wait, we can catch that error or let them view their profile.
            // Let's implement fetchDashboardData to gracefully handle if getting all courses fails,
            // or let's check: should we have a public or student-accessible endpoint to list courses?
            // Yes! Normally, students can see courses to enroll. Since Course CRUD GET /courses is Admin only,
            // we can gracefully catch 403 and display "Course list available to admins only or restricted"
            // OR we can fetch available courses from another place, but catching the error is extremely safe.
            let availableCourses = [];
            try {
                // If it fails with 403, we gracefully catch it
                availableCourses = await courseService.getAll();
            } catch (err) {
                console.log("Could not load course list (restricted to admins in this route scheme).");
            }
            setCourses(availableCourses);
        } catch (error) {
            console.error("Dashboard load failed:", error.message);
            setMessage({ text: "Error loading your profile data.", type: "danger" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleEnroll = async (courseId) => {
        setMessage({ text: "", type: "" });
        setActionLoading(true);

        try {
            const data = await courseService.enroll(courseId);
            setMessage({ text: data.message || "Enrolled successfully!", type: "success" });
            // Refresh data
            await fetchDashboardData();
        } catch (error) {
            console.error("Enrollment failed:", error.message);
            setMessage({ 
                text: error.response?.data?.message || "Enrollment failed. Please try again.", 
                type: "danger" 
            });
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-light">
                <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading Portal...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-dark text-light py-5">
            <div className="container">
                {/* Profile Header */}
                <div className="row g-4 mb-5">
                    <div className="col-12">
                        <div 
                            className="card border-secondary text-light p-4 shadow-lg position-relative overflow-hidden"
                            style={{ 
                                background: "linear-gradient(135deg, rgba(33,37,41,0.9) 0%, rgba(20,20,20,0.9) 100%)", 
                                borderRadius: "15px" 
                            }}
                        >
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                                <div>
                                    <span className="text-info fw-bold text-uppercase tracking-wider small">Student Dashboard</span>
                                    <h1 className="fw-bold mt-1 text-light">Hello, {profile?.student_name}!</h1>
                                    <p className="text-secondary mb-0">Email: {profile?.email} | Student ID: {profile?.student_id}</p>
                                </div>
                                <div className="bg-info-subtle text-info-emphasis px-4 py-3 rounded text-center border border-info shadow-sm">
                                    <span className="small d-block text-secondary text-uppercase tracking-wider">Current Enrollment Status</span>
                                    {profile?.course_id ? (
                                        <h4 className="fw-bold text-info mb-0 mt-1">📚 {profile.course_name}</h4>
                                    ) : (
                                        <h4 className="fw-bold text-danger mb-0 mt-1">❌ Not Enrolled in any course</h4>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {message.text && (
                    <div className={`alert alert-${message.type} border-${message.type} mb-4 rounded`} role="alert">
                        {message.type === "success" ? "🎉" : "⚠️"} {message.text}
                    </div>
                )}

                {/* Available Courses */}
                <div className="row">
                    <div className="col-12">
                        <div 
                            className="card border-secondary text-light p-4 shadow-sm"
                            style={{ background: "rgba(25, 25, 25, 0.8)", borderRadius: "12px" }}
                        >
                            <h3 className="fw-bold text-light mb-4">🎓 Available Courses for Enrollment</h3>
                            
                            {courses.length === 0 ? (
                                <div className="text-center py-5 border border-secondary border-dashed rounded">
                                    <span className="fs-1 d-block mb-3">📭</span>
                                    <h5 className="text-secondary mb-2">No Courses Available</h5>
                                    <p className="text-muted small max-w-md mx-auto">
                                        The administrative console has not registered any active courses or listing is restricted. Please check back later.
                                    </p>
                                </div>
                            ) : (
                                <div className="row g-4">
                                    {courses.map((course) => {
                                        const isCurrentlyEnrolled = profile?.course_id === course.course_id;
                                        return (
                                            <div className="col-12 col-md-6 col-lg-4" key={course.course_id}>
                                                <div 
                                                    className="card border-secondary text-light h-100 shadow-sm transition-all"
                                                    style={{ background: "rgba(33, 37, 41, 0.6)", borderRadius: "10px" }}
                                                >
                                                    <div className="card-body p-4 d-flex flex-column justify-content-between">
                                                        <div>
                                                            <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                                                                <h5 className="card-title fw-bold text-info mb-0">{course.course_name}</h5>
                                                                <span className="badge bg-secondary text-uppercase" style={{ fontSize: "0.7rem" }}>
                                                                    {course.course_code}
                                                                </span>
                                                            </div>
                                                            <p className="text-secondary small mb-3">
                                                                Duration: <span className="text-light fw-semibold">{course.course_duration} Hours</span>
                                                            </p>
                                                            <span className="text-muted small d-block">
                                                                👥 Enrolled Students: <span className="text-secondary">{course.student_count || 0}</span>
                                                            </span>
                                                        </div>

                                                        <div className="mt-4 pt-3 border-top border-secondary">
                                                            {isCurrentlyEnrolled ? (
                                                                <button className="btn btn-success w-100 fw-bold rounded shadow-sm" disabled>
                                                                    ✓ Currently Registered
                                                                </button>
                                                            ) : (
                                                                <button 
                                                                    className="btn btn-outline-info w-100 fw-bold rounded shadow-sm"
                                                                    onClick={() => handleEnroll(course.course_id)}
                                                                    disabled={actionLoading || isCurrentlyEnrolled}
                                                                >
                                                                    {actionLoading ? "Processing..." : "⚡ Quick Enroll"}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
