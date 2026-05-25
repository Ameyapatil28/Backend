const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load Environment variables from .env first
dotenv.config({ path: path.join(__dirname, "./.env") });

const db = require("./config/db");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes Placeholders (will import actual routes next)
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

app.get("/", (req, res) => {
    res.send("Student & Course Management API Running");
});

// Database Schema Initialization
async function initDB() {
    try {
        // Test connection
        await db.query("SELECT 1");
        console.log("MySQL Connection Pool established.");

        // Create tables if not exists
        await db.query(`
            CREATE TABLE IF NOT EXISTS courses (
                course_id INT AUTO_INCREMENT PRIMARY KEY,
                course_name VARCHAR(100) NOT NULL,
                course_code VARCHAR(20) UNIQUE NOT NULL,
                course_duration INT NOT NULL
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS students (
                student_id INT AUTO_INCREMENT PRIMARY KEY,
                student_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'student') DEFAULT 'student',
                course_id INT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE SET NULL
            )
        `);
        console.log("MySQL Database Tables Initialized.");
    } catch (error) {
        console.error("Database Initialization failed:", error.message);
        process.exit(1);
    }
}

// Start Server after Database connection
const PORT = process.env.PORT || 5000;
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
