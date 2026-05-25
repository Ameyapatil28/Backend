const db = require("../config/db");
const bcrypt = require("bcryptjs");

const UserModel = {
    // Create new user (Student or Admin) inside the students table, optionally with a course_id
    async create({ name, email, password, role, course_id }) {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            "INSERT INTO students (student_name, email, password, role, course_id) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashedPassword, role || "student", course_id || null]
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
            `SELECT s.student_id, s.student_name, s.email, s.role, s.course_id, 
                    c.course_name, c.course_code, c.course_duration
             FROM students s 
             LEFT JOIN courses c ON s.course_id = c.course_id 
             WHERE s.student_id = ?`,
            [id]
        );
        return rows[0];
    },

    // Find all users (filter optional by role) with full course columns
    async findAll(role = null) {
        let query = `
            SELECT s.student_id, s.student_name, s.email, s.role, s.course_id, 
                   c.course_name, c.course_code, c.course_duration
            FROM students s 
            LEFT JOIN courses c ON s.course_id = c.course_id
        `;
        const params = [];
        if (role) {
            query += " WHERE s.role = ?";
            params.push(role);
        }
        const [rows] = await db.query(query, params);
        return rows;
    },

    // Update student details
    async update(id, { name, email, role, course_id }) {
        const [result] = await db.query(
            "UPDATE students SET student_name = ?, email = ?, role = ?, course_id = ? WHERE student_id = ?",
            [name, email, role, course_id || null, id]
        );
        return result.affectedRows > 0;
    },

    // Delete student
    async delete(id) {
        const [result] = await db.query(
            "DELETE FROM students WHERE student_id = ?",
            [id]
        );
        return result.affectedRows > 0;
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
