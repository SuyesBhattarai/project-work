const adminController = {
  // =============================
  // DASHBOARD STATS
  // =============================
  getStats: async (req, res) => {
    try {
      const { User } = req.app.get("models");

      const users = await User.findAll();
      
      // Filter by role
      const totalUsers = users.filter(u => u.role === "user").length;
      const totalOwners = users.filter(u => u.role === "hostel_owner").length;
      
      // For now, consider all users as active since we don't have an isActive field
      const activeUsers = users.length;
      const inactiveUsers = 0;

      console.log('Stats fetched:', { totalUsers, totalOwners }); // Debug log

      res.json({
        success: true,
        data: {
          totalUsers,
          totalOwners,
          activeUsers,
          inactiveUsers,
        },
      });
    } catch (error) {
      console.error("Error in getStats:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch stats" 
      });
    }
  },

  // =============================
  // RECENT USERS
  // =============================
  getRecentUsers: async (req, res) => {
    try {
      const { User } = req.app.get("models");

      const users = await User.findAll({
        where: {
          role: ['user', 'hostel_owner'] // Only get users and owners, not admins
        },
        order: [["createdAt", "DESC"]],
        limit: 5,
        attributes: ["id", "fullName", "email", "role", "createdAt"],
      });

      console.log('Recent users fetched:', users.length); // Debug log

      res.json({ 
        success: true, 
        data: users 
      });
    } catch (error) {
      console.error("Error in getRecentUsers:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error fetching recent users" 
      });
    }
  },

  // =============================
  // ALL USERS - FIXED VERSION
  // =============================
  getAllUsers: async (req, res) => {
    try {
      const { User } = req.app.get("models");

      console.log('Fetching all users...'); // Debug log

      // Get only users and owners, exclude admins
      const users = await User.findAll({
        where: {
          role: ['user', 'hostel_owner'] // This is crucial - only get users and owners
        },
        order: [["createdAt", "DESC"]],
        attributes: [
          "id",
          "fullName",
          "email",
          "phoneNumber",
          "role",
          "createdAt",
          "updatedAt"
        ],
      });

      console.log(`Found ${users.length} users/owners`); // Debug log
      console.log('Roles found:', users.map(u => u.role)); // Debug log

      // Return with proper structure
      res.status(200).json({ 
        success: true, 
        data: users 
      });
      
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error fetching users",
        error: error.message 
      });
    }
  },

  // =============================
  // DELETE USER
  // =============================
  deleteUser: async (req, res) => {
    try {
      const { User } = req.app.get("models");
      const { id } = req.params;

      console.log('Attempting to delete user:', id); // Debug log

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      if (user.role === "admin") {
        return res.status(403).json({ 
          success: false, 
          message: "Cannot delete admin" 
        });
      }

      await user.destroy();

      console.log('User deleted successfully:', id); // Debug log

      res.json({ 
        success: true, 
        message: "User deleted successfully" 
      });
      
    } catch (error) {
      console.error("Error in deleteUser:", error);
      res.status(500).json({ 
        success: false, 
        message: "Delete failed" 
      });
    }
  },

  // =============================
  // GET USER BY ID
  // =============================
  getUserById: async (req, res) => {
    try {
      const { User } = req.app.get("models");

      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] } // Don't send password
      });

      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      console.log('User fetched by ID:', user.id); // Debug log

      res.json({ 
        success: true, 
        data: user 
      });
      
    } catch (error) {
      console.error("Error in getUserById:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error fetching user" 
      });
    }
  },
};

module.exports = adminController;