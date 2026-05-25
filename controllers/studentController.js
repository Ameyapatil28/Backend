const UserModel = require("../models/userModel");
const CourseModel = require("../models/courseModel");

// Helper to format flat SQL JOIN results into a highly structured JSON response
const formatStudentResponse = (row) => {
    if (!row) return null;
    
    const student = {
        student_id: row.student_id,
        student_name: row.student_name,
        email: row.email,
        role: row.role,
        course: null
    };

    if (row.course_id) {
        student.course = {
            course_id: row.course_id,
            course_name: row.course_name,
            course_code: row.course_code,
            course_duration: row.course_duration
        };
    }
    
    return student;
};

const studentController = {
    // @desc    Add/Create a new student with optional course assignment
    // @route   POST /api/students
    // @access  Private (Admin only)
    async addStudent(req, res) {
        const name = req.body.student_name || req.body.name;
        const { email, password, course_id } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide name, email, and password" });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please provide a valid email address" });
        }

        // Password length validation
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        try {
            // Check if student with email already exists
            const userExists = await UserModel.findByEmail(email);
            if (userExists) {
                return res.status(400).json({ message: "A student/user already exists with this email" });
            }

            // Validate if course exists before assigning (Core assignment requirement)
            if (course_id) {
                const course = await CourseModel.findById(course_id);
                if (!course) {
                    return res.status(400).json({ 
                        message: `Cannot assign student. Course with ID '${course_id}' does not exist` 
                    });
                }
            }

            // Create student (password is automatically hashed inside UserModel.create)
            const newStudentId = await UserModel.create({
                name,
                email,
                password,
                role: "student",
                course_id: course_id || null
            });

            // Retrieve and return created student details
            const student = await UserModel.findById(newStudentId);
            res.status(201).json({
                message: "Student added successfully",
                student: formatStudentResponse(student)
            });
        } catch (error) {
            console.error("AddStudent error:", error.message);
            res.status(500).json({ message: "Server error creating student" });
        }
    },

    // @desc    Get all students with nested course details (using SQL JOIN)
    // @route   GET /api/students
    // @access  Private (Admin only)
    async getAllStudents(req, res) {
        try {
            const students = await UserModel.findAll("student");
            res.json(students.map(formatStudentResponse));
        } catch (error) {
            console.error("GetAllStudents error:", error.message);
            res.status(500).json({ message: "Server error fetching students" });
        }
    },

    // @desc    Get student by ID with nested course details (using SQL JOIN)
    // @route   GET /api/students/:id
    // @access  Private (Admin only)
    async getStudentById(req, res) {
        const { id } = req.params;

        try {
            const student = await UserModel.findById(id);
            if (!student || student.role !== "student") {
                return res.status(404).json({ message: "Student not found" });
            }
            res.json(formatStudentResponse(student));
        } catch (error) {
            console.error("GetStudentById error:", error.message);
            res.status(500).json({ message: "Server error fetching student details" });
        }
    },

    // @desc    Update student details
    // @route   PUT /api/students/:id
    // @access  Private (Admin only)
    async updateStudent(req, res) {
        const { id } = req.params;
        const name = req.body.student_name || req.body.name;
        const { email, course_id } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        try {
            // Check student exists
            const student = await UserModel.findById(id);
            if (!student || student.role !== "student") {
                return res.status(404).json({ message: "Student not found" });
            }

            // Validate course exists if course_id is updated
            if (course_id) {
                const course = await CourseModel.findById(course_id);
                if (!course) {
                    return res.status(400).json({ 
                        message: `Cannot update student. Course with ID '${course_id}' does not exist` 
                    });
                }
            }

            // Update details
            await UserModel.update(id, {
                name,
                email,
                role: "student",
                course_id: course_id || null
            });

            // Return updated details
            const updatedStudent = await UserModel.findById(id);
            res.json({
                message: "Student updated successfully",
                student: formatStudentResponse(updatedStudent)
            });
        } catch (error) {
            console.error("UpdateStudent error:", error.message);
            res.status(500).json({ message: "Server error updating student" });
        }
    },

    // @desc    Delete a student
    // @route   DELETE /api/students/:id
    // @access  Private (Admin only)
    async deleteStudent(req, res) {
        const { id } = req.params;

        try {
            const student = await UserModel.findById(id);
            if (!student || student.role !== "student") {
                return res.status(404).json({ message: "Student not found" });
            }

            await UserModel.delete(id);
            res.json({ message: "Student deleted successfully" });
        } catch (error) {
            console.error("DeleteStudent error:", error.message);
            res.status(500).json({ message: "Server error deleting student" });
        }
    }
};

module.exports = studentController;
