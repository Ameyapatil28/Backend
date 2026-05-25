const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Get all courses & course details (Admin only)
router.get("/", protect, authorize("admin"), courseController.getAllCourses);
router.get("/:id", protect, authorize("admin"), courseController.getCourseById);

// Create, Update, Delete courses (Admin only)
router.post("/", protect, authorize("admin"), courseController.createCourse);
router.put("/:id", protect, authorize("admin"), courseController.updateCourse);
router.delete("/:id", protect, authorize("admin"), courseController.deleteCourse);

// Enroll in a course (Student only)
router.post("/:id/enroll", protect, authorize("student"), courseController.enrollInCourse);

// Get course student roster list (Admin only)
router.get("/:id/students", protect, authorize("admin"), courseController.getCourseStudents);

module.exports = router;
