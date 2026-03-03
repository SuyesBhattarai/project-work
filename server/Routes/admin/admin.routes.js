const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const adminController = require("../../Controller/Admin/adminController");

// ==============================
// ADMIN AUTH MIDDLEWARE (JWT)
// ==============================
const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretkey"
    );

    // ✅ allow only admin
    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

// ==============================
// ADMIN ROUTES
// ==============================

router.get("/stats", adminAuth, adminController.getStats);
router.get("/recent-users", adminAuth, adminController.getRecentUsers);
router.get("/users", adminAuth, adminController.getAllUsers);
router.get("/users/:id", adminAuth, adminController.getUserById);
router.delete("/users/:id", adminAuth, adminController.deleteUser);

module.exports = router;