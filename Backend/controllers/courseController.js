const CourseModel = require("../models/courseModel");
const UserModel = require("../models/userModel");

const courseController = {
    // @desc    Create a new course
    // @route   POST /api/courses
    // @access  Private (Admin only)
    async createCourse(req, res) {
        const title = req.body.title || req.body.course_name;
        const code = req.body.code || req.body.course_code;
        const duration = req.body.duration || req.body.course_duration;

        if (!title || !code || !duration) {
            return res.status(400).json({ 
                message: "Course title (course_name), code (course_code), and duration (course_duration) are required" 
            });
        }

        try {
            const courseId = await CourseModel.create({ title, code, duration });
            res.status(201).json({
                message: "Course created successfully",
                course: {
                    course_id: courseId,
                    course_name: title,
                    course_code: code,
                    course_duration: duration
                }
            });
        } catch (error) {
            console.error("CreateCourse error:", error.message);
            res.status(500).json({ message: "Server error creating course" });
        }
    },

    // @desc    Get all courses with student counts
    // @route   GET /api/courses
    // @access  Private (Admin & Student)
    async getAllCourses(req, res) {
        try {
            const courses = await CourseModel.findAll();
            res.json(courses);
        } catch (error) {
            console.error("GetAllCourses error:", error.message);
            res.status(500).json({ message: "Server error fetching courses" });
        }
    },

    // @desc    Get course by ID
    // @route   GET /api/courses/:id
    // @access  Private (Admin & Student)
    async getCourseById(req, res) {
        const { id } = req.params;

        try {
            const course = await CourseModel.findById(id);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            res.json(course);
        } catch (error) {
            console.error("GetCourseById error:", error.message);
            res.status(500).json({ message: "Server error fetching course details" });
        }
    },

    // @desc    Update a course
    // @route   PUT /api/courses/:id
    // @access  Private (Admin only)
    async updateCourse(req, res) {
        const { id } = req.params;
        const title = req.body.title || req.body.course_name;
        const code = req.body.code || req.body.course_code;
        const duration = req.body.duration || req.body.course_duration;

        if (!title || !code || !duration) {
            return res.status(400).json({ 
                message: "Course title (course_name), code (course_code), and duration (course_duration) are required" 
            });
        }

        try {
            const course = await CourseModel.findById(id);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }

            await CourseModel.update(id, { title, code, duration });
            res.json({
                message: "Course updated successfully",
                course: {
                    course_id: Number(id),
                    course_name: title,
                    course_code: code,
                    course_duration: duration
                }
            });
        } catch (error) {
            console.error("UpdateCourse error:", error.message);
            res.status(500).json({ message: "Server error updating course" });
        }
    },

    // @desc    Delete a course
    // @route   DELETE /api/courses/:id
    // @access  Private (Admin only)
    async deleteCourse(req, res) {
        const { id } = req.params;

        try {
            const course = await CourseModel.findById(id);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }

            await CourseModel.delete(id);
            res.json({ message: "Course deleted successfully" });
        } catch (error) {
            console.error("DeleteCourse error:", error.message);
            res.status(500).json({ message: "Server error deleting course" });
        }
    },

    // @desc    Enroll current logged-in student into a course
    // @route   POST /api/courses/:id/enroll
    // @access  Private (Student only)
    async enrollInCourse(req, res) {
        const courseId = req.params.id;
        const studentId = req.user.student_id || req.user.id;

        try {
            // Verify course exists
            const course = await CourseModel.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }

            // Enroll student
            const enrolled = await UserModel.enrollStudent(studentId, courseId);
            if (!enrolled) {
                return res.status(400).json({ message: "Enrollment failed or user is not a student" });
            }

            res.json({
                message: "Successfully enrolled in the course",
                courseId: Number(courseId),
                courseTitle: course.course_name
            });
        } catch (error) {
            console.error("Enroll error:", error.message);
            res.status(500).json({ message: "Server error during course enrollment" });
        }
    },

    // @desc    Get all students enrolled in a specific course (using optimized SQL JOIN)
    // @route   GET /api/courses/:id/students
    // @access  Private (Admin only)
    async getCourseStudents(req, res) {
        const courseId = req.params.id;

        try {
            // Retrieve roster using optimized JOIN query
            const rows = await CourseModel.findCourseRoster(courseId);

            if (rows.length === 0) {
                return res.status(404).json({ message: "Course not found" });
            }

            // Extract course info from first row
            const firstRow = rows[0];
            const courseDetails = {
                course_id: firstRow.course_id,
                course_name: firstRow.course_name,
                course_code: firstRow.course_code,
                course_duration: firstRow.course_duration
            };

            // Build student list (filtering out nulls if course has no students)
            const students = rows
                .filter(row => row.student_id !== null)
                .map(row => ({
                    student_id: row.student_id,
                    student_name: row.student_name,
                    email: row.email
                }));

            res.json({
                ...courseDetails,
                student_count: students.length,
                students
            });
        } catch (error) {
            console.error("GetCourseStudents error:", error.message);
            res.status(500).json({ message: "Server error fetching course roster" });
        }
    }
};

module.exports = courseController;
