import React, { useState, useEffect } from "react";
import { studentService, courseService } from "../services/api";

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [courseId, setCourseId] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            const studentData = await studentService.getAll();
            const courseData = await courseService.getAll();
            setStudents(studentData);
            setCourses(courseData);
        } catch (err) {
            console.error("Fetch students/courses error:", err.message);
            setError("Failed to retrieve directory rosters.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsSubmitting(true);

        const studentData = {
            student_name: name,
            email,
            course_id: courseId ? Number(courseId) : null
        };

        // On creation, we also pass the password
        if (!editingId) {
            studentData.password = password;
        }

        try {
            if (editingId) {
                await studentService.update(editingId, studentData);
                setSuccessMessage("Student details updated successfully!");
            } else {
                await studentService.create(studentData);
                setSuccessMessage("Student registered and enrolled successfully!");
            }
            // Clear form
            setName("");
            setEmail("");
            setPassword("");
            setCourseId("");
            setEditingId(null);
            // Refresh
            await fetchData();
        } catch (err) {
            console.error("Submit student error:", err.message);
            setError(err.response?.data?.message || "Failed to save student details. Check inputs.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (student) => {
        setEditingId(student.student_id);
        setName(student.student_name);
        setEmail(student.email);
        setCourseId(student.course?.course_id || student.course_id || "");
        setPassword(""); // Password not editable directly here (requires custom update route)
        setSuccessMessage("");
        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you absolutely sure you want to delete this student from the database? This cannot be undone.")) {
            return;
        }

        setError("");
        setSuccessMessage("");
        try {
            await studentService.delete(id);
            setSuccessMessage("Student removed successfully!");
            await fetchData();
        } catch (err) {
            console.error("Delete student error:", err.message);
            setError("Failed to delete student.");
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-light">
                <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading rosters...</span>
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
                        <h1 className="fw-bold text-info">Students Roster</h1>
                        <p className="text-secondary mb-0">Register students, manage details, and update course enrollments</p>
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
                                {editingId ? "✏️ Edit Student Details" : "➕ Register New Student"}
                            </h4>
                            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                <div className="form-group">
                                    <label className="text-secondary small mb-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control bg-dark border-secondary text-light px-3 py-2 rounded focus-info" 
                                        placeholder="e.g. John Doe"
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
                                
                                {!editingId && (
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
                                )}

                                <div className="form-group">
                                    <label className="text-secondary small mb-1">Assign Enrolled Course</label>
                                    <select 
                                        className="form-select bg-dark border-secondary text-light px-3 py-2 rounded focus-info"
                                        value={courseId}
                                        onChange={(e) => setCourseId(e.target.value)}
                                        disabled={isSubmitting}
                                    >
                                        <option value="">-- No Enrolled Course --</option>
                                        {courses.map((course) => (
                                            <option key={course.course_id} value={course.course_id}>
                                                {course.course_name} ({course.course_code})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="d-flex gap-2 mt-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-info text-dark fw-bold px-4 py-2 rounded flex-grow-1"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Saving..." : (editingId ? "Update" : "Register")}
                                    </button>
                                    {editingId && (
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary px-3"
                                            onClick={() => {
                                                setEditingId(null);
                                                setName("");
                                                setEmail("");
                                                setCourseId("");
                                                setPassword("");
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Student List */}
                    <div className="col-12 col-lg-8">
                        <div 
                            className="card border-secondary text-light p-4 shadow-sm"
                            style={{ background: "rgba(25, 25, 25, 0.7)", borderRadius: "12px" }}
                        >
                            <h4 className="fw-bold mb-4 text-light">👥 Student Directory</h4>
                            {students.length === 0 ? (
                                <p className="text-secondary text-center py-5">No students registered in the database.</p>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-dark table-hover border-secondary align-middle">
                                        <thead>
                                            <tr className="text-info border-secondary">
                                                <th scope="col">ID</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Enrolled Course</th>
                                                <th scope="col" className="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student) => (
                                                <tr key={student.student_id} className="border-secondary">
                                                    <td className="text-secondary small">#{student.student_id}</td>
                                                    <td className="fw-bold">{student.student_name}</td>
                                                    <td className="small text-secondary">{student.email}</td>
                                                    <td>
                                                        {student.course ? (
                                                            <span className="badge bg-info-subtle text-info-emphasis border border-info px-2 py-1 rounded">
                                                                📚 {student.course.course_name}
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-danger-subtle text-danger-emphasis border border-danger px-2 py-1 rounded">
                                                                ❌ Unassigned
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="text-end">
                                                        <div className="d-inline-flex gap-2">
                                                            <button 
                                                                className="btn btn-sm btn-outline-light rounded"
                                                                onClick={() => handleEdit(student)}
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            <button 
                                                                className="btn btn-sm btn-outline-danger rounded"
                                                                onClick={() => handleDelete(student.student_id)}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentList;
