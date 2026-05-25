const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All Student APIs are protected and restricted to Admin only
router.post("/", protect, authorize("admin"), studentController.addStudent);
router.get("/", protect, authorize("admin"), studentController.getAllStudents);
router.get("/:id", protect, authorize("admin"), studentController.getStudentById);
router.put("/:id", protect, authorize("admin"), studentController.updateStudent);
router.delete("/:id", protect, authorize("admin"), studentController.deleteStudent);

module.exports = router;
