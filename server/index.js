// ==============================
// IMPORTS
// ==============================
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

dotenv.config();

// ==============================
// DATABASE
// ==============================
const sequelize = require("./Database/db");

// ==============================
// ROUTES
// ==============================
const hostelRoutes = require("./Routes/hostel/hostel.routes");
const bookingRoutes = require("./Routes/booking/booking.routes");
const adminRoutes = require("./Routes/admin/admin.routes");

// ==============================
// MODELS
// ==============================
const Hostel = require("./Model/Hostel");
const Booking = require("./Model/Booking");

// ==============================
// APP CONFIG
// ==============================
const app = express();
const PORT = process.env.PORT || 5000;

// ==============================
// GLOBAL MIDDLEWARE
// ==============================
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==============================
// USER MODEL
// ==============================
const User = sequelize.define(
  "User",
  {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false, // user | hostel_owner | admin
    },
  },
  {
    timestamps: true,
  }
);

// ==============================
// MAKE MODELS GLOBAL
// ==============================
app.set("models", { User, Hostel, Booking });

// ==============================
// MODEL RELATIONSHIPS
// ==============================

// Owner → Hostels
Hostel.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
User.hasMany(Hostel, { foreignKey: "ownerId", as: "hostels" });

// User → Bookings
Booking.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Booking, { foreignKey: "userId", as: "bookings" });

// Hostel → Bookings
Booking.belongsTo(Hostel, { foreignKey: "hostelId", as: "hostel" });
Hostel.hasMany(Booking, { foreignKey: "hostelId", as: "bookings" });

// ==============================
// DATABASE CONNECTION
// ==============================
async function connectDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("✅ Database connected & synced");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

// ✅ FIXED: Don't connect to DB during tests
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// ==============================
// AUTH ROUTES
// ==============================

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// ---------- REGISTER ----------
app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      role,
    } = req.body;

    if (!fullName || !email || !phoneNumber || !password || !confirmPassword || !role)
      return res.status(400).json({ message: "All fields required!" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match!" });

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser)
      return res.status(400).json({ message: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered successfully!",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// ---------- LOGIN ----------
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ==========================
    // ADMIN LOGIN
    // ==========================
    const ADMIN_EMAIL = "admin@hostel.com";
    const ADMIN_PASSWORD = "Admin@1234";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        {
          id: "admin",
          email: ADMIN_EMAIL,
          role: "admin",
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        message: "Admin login successful!",
        accessToken: token,
        user: {
          id: "admin",
          fullName: "Admin",
          email: ADMIN_EMAIL,
          role: "admin",
        },
      });
    }

    // ==========================
    // USER / OWNER LOGIN
    // ==========================
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(404).json({ message: "User not found!" });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(400).json({ message: "Invalid password!" });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful!",
      accessToken: token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
});

// ==============================
// BUSINESS ROUTES
// ==============================
app.use("/api/hostels", hostelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// ==============================
// HEALTH CHECK
// ==============================
app.get("/", (req, res) => {
  res.json({ message: "🚀 Hostel Finder Backend Running" });
});

// ==============================
// 404 HANDLER
// ==============================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ==============================
// START SERVER
// ==============================
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;