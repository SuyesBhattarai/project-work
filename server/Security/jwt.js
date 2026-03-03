const jwt = require("jsonwebtoken");

// ================= VERIFY TOKEN =================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = decoded; // { id, email, role }
    next();
  });
};

// ================= OWNER CHECK =================
const isOwner = (req, res, next) => {
  console.log("🔍 USER ROLE:", req.user.role);

  // ✅ FIXED: Accept both "hostel_owner" and "Hostel Owner"
  if (req.user.role !== "hostel_owner" && req.user.role !== "Hostel Owner") {
    return res.status(403).json({ 
      message: "Forbidden: Owner only",
      receivedRole: req.user.role 
    });
  }

  next();
};

module.exports = {
  verifyToken,
  isOwner,
};