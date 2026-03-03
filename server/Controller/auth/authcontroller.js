import { User } from "../../models/index.js";
import { generateToken } from "../../security/jwt-util.js";
import bcrypt from "bcrypt";

// ================= REGISTER =================
const register = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, role } = req.body;

    // ---------- Validation ----------
    if (!fullName || !email || !password || !confirmPassword || !role) {
      return res.status(400).send({
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).send({
        message: "Passwords do not match",
      });
    }

    // ---------- Check existing user ----------
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).send({
        message: "User already exists",
      });
    }

    // ---------- Hash password ----------
    const hashedPassword = await bcrypt.hash(password, 10);

    // ---------- Create user ----------
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    // ---------- Generate Token ----------
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(201).send({
      message: "User registered successfully",
      user,
      accessToken: token,
    });

  } catch (error) {
    console.log("Register Error:", error);
    res.status(500).send({
      message: "Register failed",
    });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        message: "Email and password required",
      });
    }

    // ===================================================
    // ✅ FIXED ADMIN LOGIN
    // ===================================================
    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = "admin123";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = generateToken({
        id: "admin",
        email: ADMIN_EMAIL,
        role: "admin",
      });

      return res.status(200).send({
        message: "Admin login successful",
        user: {
          id: "admin",
          fullName: "Admin",
          email: ADMIN_EMAIL,
          role: "admin",
        },
        accessToken: token,
      });
    }

    // ===================================================
    // ✅ NORMAL USER LOGIN
    // ===================================================
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({
        message: "Invalid password",
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).send({
      message: "Login successful",
      user,
      accessToken: token,
    });

  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).send({
      message: "Login failed",
    });
  }
};

// ================= FORGOT PASSWORD =================
const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).send({
        message: "Email and new password required",
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).send({
      message: "Password updated successfully",
    });

  } catch (error) {
    console.log("Forgot Password Error:", error);
    res.status(500).send({
      message: "Reset password failed",
    });
  }
};

// ================= EXPORT =================
export const authController = {
  register,
  login,
  forgotPassword,
};