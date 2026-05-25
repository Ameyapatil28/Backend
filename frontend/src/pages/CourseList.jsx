import React, { useState, useEffect } from "react";
import { courseService } from "../services/api";

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Form states
    const [title, setTitle] = useState("");
    const [code, setCode] = useState("");
    const [duration, setDuration] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Roster view states
    const [roster, setRoster] = useState(null);
    const [rosterLoading, setRosterLoading] = useState(false);

    const fetchCourses = async () => {
        try {
            const data = await courseService.getAll();
            setCourses(data);
        } catch (err) {
            console.error("Fetch courses error:", err.message);
            setError("Failed to retrieve course list.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsSubmitting(true);

        const courseData = { title, code, duration: Number(duration) };

        try {
            if (editingId) {
                await courseService.update(editingId, courseData);
                setSuccessMessage("Course updated successfully!");
            } else {
                await courseService.create(courseData);
                setSuccessMessage("Course added successfully!");
            }
            // Clear form
            setTitle("");
            setCode("");
            setDuration("");
            setEditingId(null);
            // Refresh
            await fetchCourses();
        } catch (err) {
            console.error("Submit course error:", err.message);
            setError(err.response?.data?.message || "Failed to save course. Check fields.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (course) => {
        setEditingId(course.course_id);
        setTitle(course.course_name);
        setCode(course.course_code);
        setDuration(course.course_duration);
        setSuccessMessage("");
        setError("");
        // Scroll to form
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you absolutely sure you want to delete this course? Enrolled students will be automatically unlinked.")) {
            return;
        }

        setError("");
        setSuccessMessage("");
        try {
            await courseService.delete(id);
            setSuccessMessage("Course deleted successfully!");
            await fetchCourses();
        } catch (err) {
            console.error("Delete course error:", err.message);
            setError("Failed to delete course.");
        }
    };

    const handleViewRoster = async (courseId) => {
        setRosterLoading(true);
        setRoster(null);
        try {
            const data = await courseService.getRoster(courseId);
            setRoster(data);
        } catch (err) {
            console.error("Roster error:", err.message);
            setError("Failed to load course student roster.");
        } finally {
            setRosterLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-light">
                <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading courses...</span>
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
                        <h1 className="fw-bold text-info">Courses Directory</h1>
                        <p className="text-secondary mb-0">Create new courses, manage details, and inspect rosters</p>
                    </div>
                </div>

                {successMessage && (
                    <div className="alert alert-success border-success bg-success-subtle text-success-emphasis mb-4 rounded" role="alert">
                        🎉 {successMessage}
                    </div>
                )}
                {error && (
                    <div className="alert alert-danger border-danger bg-danger-subtle text-danger-emphasis mb-4 rounded" role="alert">
                        ⚠️ {error}
                    </div>
                )}

                <div className="row g-4">
                    {/* Add / Edit Form */}
                    <div className="col-12 col-lg-4">
                        <div 
                            className="card border-secondary text-light p-4 shadow-lg sticky-md-top"
                            style={{ background: "rgba(25, 25, 25, 0.85)", borderRadius: "12px", top: "100px", zIndex: "10" }}
                        >
                            <h4 className="fw-bold text-info mb-4">
                                {editingId ? "✏️ Edit Course" : "➕ Add New Course"}
                            </h4>
                            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                <div className="form-group">
                                    <label className="text-secondary small mb-1">Course Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control bg-dark border-secondary text-light px-3 py-2 rounded focus-info" 
                                        placeholder="e.g. Web Development"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="text-secondary small mb-1">Course Code</label>
                                    <input 
                                        type="text" 
                                        className="form-control bg-dark border-secondary text-light px-3 py-2 rounded focus-info" 
                                        placeholder="e.g. CS-101"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="text-secondary small mb-1">Duration (Hours)</label>
                                    <input 
                                        type="number" 
                                        className="form-control bg-dark border-secondary text-light px-3 py-2 rounded focus-info" 
                                        placeholder="e.g. 45"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="d-flex gap-2 mt-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-info text-dark fw-bold px-4 py-2 rounded flex-grow-1"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Saving..." : (editingId ? "Update" : "Create")}
                                    </button>
                                    {editingId && (
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary px-3"
                                            onClick={() => {
                                                setEditingId(null);
                                                setTitle("");
                                                setCode("");
                                                setDuration("");
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Course list */}
                    <div className="col-12 col-lg-8">
                        <div 
                            className="card border-secondary text-light p-4 shadow-sm"
                            style={{ background: "rgba(25, 25, 25, 0.7)", borderRadius: "12px" }}
                        >
                            <h4 className="fw-bold mb-4 text-light">📚 Active Course Base</h4>
                            {courses.length === 0 ? (
                                <p className="text-secondary text-center py-5">No courses registered in system.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-dark table-hover border-secondary align-middle">
                                        <thead>
                                            <tr className="text-info border-secondary">
                                                <th scope="col">Code</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Duration</th>
                                                <th scope="col">Roster Ratio</th>
                                                <th scope="col" className="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courses.map((course) => (
                                                <tr key={course.course_id} className="border-secondary">
                                                    <td className="fw-semibold text-secondary small">{course.course_code}</td>
                                                    <td className="fw-bold">{course.course_name}</td>
                                                    <td>{course.course_duration} Hrs</td>
                                                    <td>
                                                        <span className="badge bg-info text-dark fw-bold rounded-pill px-2">
                                                            👥 {course.student_count || 0} enrolled
                                                        </span>
                                                    </td>
                                                    <td className="text-end">
                                                        <div className="d-inline-flex gap-2">
                                                            <button 
                                                                className="btn btn-sm btn-outline-info rounded"
                                                                onClick={() => handleViewRoster(course.course_id)}
                                                            >
                                                                🔎 Roster
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-outline-light rounded"
                                                                onClick={() => handleEdit(course)}
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger rounded"
                                                                onClick={() => handleDelete(course.course_id)}
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Roster View panel */}
                        {roster && (
                            <div 
                                className="card border-secondary text-light p-4 shadow-lg mt-4 animate-fade-in"
                                style={{ background: "rgba(20, 20, 20, 0.95)", borderRadius: "12px" }}
                            >
                                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary">
                                    <div>
                                        <span className="text-info small uppercase tracking-wider">Class Roster List</span>
                                        <h4 className="fw-bold mt-1 text-light">{roster.courseTitle || roster.course_name}</h4>
                                    </div>
                                    <button 
                                        className="btn-close btn-close-white" 
                                        onClick={() => setRoster(null)}
                                        aria-label="Close"
                                    ></button>
                                </div>

                                {roster.students.length === 0 ? (
                                    <p className="text-secondary text-center py-4">No students currently enrolled in this course.</p>
                                ) : (
                                    <div className="list-group list-group-flush bg-transparent">
                                        {roster.students.map((student) => (
                                            <div 
                                                key={student.student_id} 
                                                className="list-group-item bg-transparent text-light border-secondary d-flex justify-content-between align-items-center py-3 px-1"
                                            >
                                                <div>
                                                    <h6 className="fw-bold mb-0 text-light">{student.student_name}</h6>
                                                    <span className="text-secondary small">{student.email}</span>
                                                </div>
                                                <span className="badge bg-secondary text-muted rounded">ID: {student.student_id}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseList;
