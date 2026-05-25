const db = require("../config/db");

const CourseModel = {
    // Create a new course
    async create({ title, code, duration }) {
        const [result] = await db.query(
            "INSERT INTO courses (course_name, course_code, course_duration) VALUES (?, ?, ?)",
            [title, code, duration]
        );
        return result.insertId;
    },

    // Find all courses with enrolled student count
    async findAll() {
        const [rows] = await db.query(
            `SELECT c.course_id, c.course_name, c.course_code, c.course_duration, COUNT(s.student_id) AS student_count 
             FROM courses c 
             LEFT JOIN students s ON s.course_id = c.course_id AND s.role = 'student' 
             GROUP BY c.course_id`
        );
        return rows;
    },

    // Find course by course_id
    async findById(id) {
        const [rows] = await db.query(
            "SELECT * FROM courses WHERE course_id = ?",
            [id]
        );
        return rows[0];
    },

    // Update course details
    async update(id, { title, code, duration }) {
        const [result] = await db.query(
            "UPDATE courses SET course_name = ?, course_code = ?, course_duration = ? WHERE course_id = ?",
            [title, code, duration, id]
        );
        return result.affectedRows > 0;
    },

    // Delete a course
    async delete(id) {
        const [result] = await db.query(
            "DELETE FROM courses WHERE course_id = ?",
            [id]
        );
        return result.affectedRows > 0;
    },

    // Find all students enrolled in a specific course using SQL JOIN
    async findCourseRoster(courseId) {
        const [rows] = await db.query(
            `SELECT c.course_id, c.course_name, c.course_code, c.course_duration,
                    s.student_id, s.student_name, s.email
             FROM courses c
             LEFT JOIN students s ON s.course_id = c.course_id AND s.role = 'student'
             WHERE c.course_id = ?`,
            [courseId]
        );
        return rows;
    }
};

module.exports = CourseModel;
