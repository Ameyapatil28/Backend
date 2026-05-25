const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Generate JWT token helper
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

const authController = {
    // @desc    Register a new user (admin/student)
    // @route   POST /api/auth/register
    // @access  Public
    async register(req, res) {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please enter all required fields" });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        // Password length validation
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Validate role input if provided
        if (role && !["admin", "student"].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Must be 'admin' or 'student'" });
        }

        try {
            // Check if user already exists
            const userExists = await UserModel.findByEmail(email);
            if (userExists) {
                return res.status(400).json({ message: "User already exists with this email" });
            }

            // Create user
            const studentId = await UserModel.create({
                name,
                email,
                password,
                role: role || "student"
            });

            // Return user details and token
            res.status(201).json({
                message: "User registered successfully",
                user: {
                    student_id: studentId,
                    student_name: name,
                    email,
                    role: role || "student"
                },
                token: generateToken(studentId)
            });
        } catch (error) {
            console.error("Register error:", error.message);
            res.status(500).json({ message: "Server error during registration" });
        }
    },

    // @desc    Authenticate user & get token
    // @route   POST /api/auth/login
    // @access  Public
    async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        try {
            // Find user
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            // Check password
            const isMatch = await UserModel.comparePassword(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            // Return user details and token
            res.json({
                message: "Logged in successfully",
                user: {
                    student_id: user.student_id,
                    student_name: user.student_name,
                    email: user.email,
                    role: user.role
                },
                token: generateToken(user.student_id)
            });
        } catch (error) {
            console.error("Login error:", error.message);
            res.status(500).json({ message: "Server error during login" });
        }
    },

    // @desc    Get current user profile
    // @route   GET /api/auth/profile
    // @access  Private
    async getProfile(req, res) {
        try {
            // req.user.student_id is set by protect middleware
            const userId = req.user.student_id || req.user.id;
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
        } catch (error) {
            console.error("GetProfile error:", error.message);
            res.status(500).json({ message: "Server error retrieving profile" });
        }
    }
};

module.exports = authController;
