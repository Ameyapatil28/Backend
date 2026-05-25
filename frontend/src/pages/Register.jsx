import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { courseService } from "../services/api";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [courseId, setCourseId] = useState("");
    const [courses, setCourses] = useState([]);
    
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    // Dynamically fetch courses on mount for dropdown course selection
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const activeCourses = await courseService.getAll();
                setCourses(activeCourses);
            } catch (err) {
                console.warn("Could not fetch active courses for registration dropdown:", err.message);
            }
        };

        fetchCourses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            // Include course_id only if role is 'student' and one is selected
            const registrationPayload = {
                name,
                email,
                password,
                role,
                course_id: role === "student" && courseId ? Number(courseId) : null
            };

            await register(
                registrationPayload.name,
                registrationPayload.email,
                registrationPayload.password,
                registrationPayload.role,
                registrationPayload.course_id
            );

            // Redirect based on role
            if (role === "admin") {
                navigate("/admin");
            } else {
                navigate("/student");
            }
        } catch (err) {
            setError(err);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100 py-5">
            {/* Glassmorphism Dark Panel Card */}
            <div 
                className="card border-secondary text-light p-4 shadow-lg w-100" 
                style={{ 
                    maxWidth: "440px", 
                    background: "rgba(25, 25, 25, 0.85)", 
                    backdropFilter: "blur(8px)",
                    borderRadius: "15px"
                }}
            >
                <div className="text-center mb-4">
                    <span className="fs-1">🚀</span>
                    <h2 className="fw-bold mt-2 text-info">Create Account</h2>
                    <p className="text-secondary small">Join EduManage Student & Course hub</p>
                </div>

                {/* Validation Banner Alerts */}
                {error && (
                    <div className="alert alert-danger border-danger bg-danger-subtle text-danger-emphasis py-2 px-3 small rounded" role="alert">
                        ⚠️ {error}
                    </div>
                )}

                {/* Registration Bootstrap Form */}
                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                    <div className="form-group">
                        <label className="text-secondary small mb-1">Full Name</label>
                        <input 
                            type="text" 
                            className="form-control bg-dark border-secondary text-light px-3 py-2 rounded focus-info" 
                            placeholder="Enter full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label className="text-secondary small mb-1">Email Address</label>
                        <input 
                            type="email" 
                            className="form-control bg-dark border-secondary text-light px-3 py-2 rounded focus-info" 
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label className="text-secondary small mb-1">Password</label>
                        <input 
                            type="password" 
                            className="form-control bg-dark border-secondary text-light px-3 py-2 rounded focus-info" 
                            placeholder="Minimum 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label className="text-secondary small mb-1">Select Role</label>
                        <select 
                            className="form-select bg-dark border-secondary text-light px-3 py-2 rounded focus-info"
                            value={role}
                            onChange={(e) => {
                                setRole(e.target.value);
                                if (e.target.value !== "student") setCourseId(""); // Clear course if admin
                            }}
                            required
                            disabled={isSubmitting}
                        >
                            <option value="student">Student (Learn & Enroll)</option>
                            <option value="admin">Administrator (Manage System)</option>
                        </select>
                    </div>

                    {/* Dynamic Course Dropdown: Renders only when role is 'student' */}
                    {role === "student" && courses.length > 0 && (
                        <div className="form-group animate-fade-in">
                            <label className="text-secondary small mb-1">Select Initial Course (Optional)</label>
                            <select 
                                className="form-select bg-dark border-secondary text-light px-3 py-2 rounded focus-info"
                                value={courseId}
                                onChange={(e) => setCourseId(e.target.value)}
                                disabled={isSubmitting}
                            >
                                <option value="">-- No Enrollment Yet --</option>
                                {courses.map((course) => (
                                    <option key={course.course_id} value={course.course_id}>
                                        {course.course_name} ({course.course_code})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="btn btn-info text-dark fw-bold py-2 mt-2 rounded d-flex justify-content-center align-items-center gap-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Creating Account...
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>

                <div className="text-center mt-4 pt-2 border-top border-secondary">
                    <span className="text-secondary small">Already have an account? </span>
                    <Link to="/login" className="text-info fw-semibold text-decoration-none small hover-underline">
                        Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
