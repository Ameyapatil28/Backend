const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Protect route middleware
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from database (exclude password)
            const [rows] = await db.query(
                "SELECT student_id, student_name, email, role, course_id FROM students WHERE student_id = ?",
                [decoded.id]
            );

            if (rows.length === 0) {
                return res.status(401).json({ message: "Not authorized, user not found" });
            }

            req.user = rows[0];
            next();
        } catch (error) {
            console.error("Auth error:", error.message);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token provided" });
    }
};

// Authorize roles middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role '${req.user ? req.user.role : "none"}' is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
