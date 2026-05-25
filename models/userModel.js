const db = require("../config/db");
const bcrypt = require("bcryptjs");

const UserModel = {
    // Create new user (Student or Admin) inside the students table
    async create({ name, email, password, role }) {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            "INSERT INTO students (student_name, email, password, role) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, role || "student"]
        );
        return result.insertId;
    },

    // Find user by email (for authentication and unique checks)
    async findByEmail(email) {
        const [rows] = await db.query(
            "SELECT * FROM students WHERE email = ?",
            [email]
        );
        return rows[0];
    },

    // Find user by student_id (joining course if student)
    async findById(id) {
        const [rows] = await db.query(
            `SELECT s.student_id, s.student_name, s.email, s.role, s.course_id, c.course_name 
             FROM students s 
             LEFT JOIN courses c ON s.course_id = c.course_id 
             WHERE s.student_id = ?`,
            [id]
        );
        return rows[0];
    },

    // Enroll a student in a course (update course_id)
    async enrollStudent(studentId, courseId) {
        const [result] = await db.query(
            "UPDATE students SET course_id = ? WHERE student_id = ? AND role = 'student'",
            [courseId, studentId]
        );
        return result.affectedRows > 0;
    },

    // Find all students enrolled in a specific course
    async findStudentsByCourse(courseId) {
        const [rows] = await db.query(
            "SELECT student_id, student_name, email FROM students WHERE course_id = ? AND role = 'student'",
            [courseId]
        );
        return rows;
    },

    // Helper: Compare entered password with hashed password
    async comparePassword(enteredPassword, hashedPassword) {
        return await bcrypt.compare(enteredPassword, hashedPassword);
    }
};

module.exports = UserModel;
