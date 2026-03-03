const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  fullName: { type: DataTypes.STRING, allowNull: false },

  email: { type: DataTypes.STRING, allowNull: false, unique: true },

  phoneNumber: { type: DataTypes.STRING, allowNull: false },

  password: { type: DataTypes.STRING, allowNull: false },

  role: {
    type: DataTypes.ENUM("user", "hostel_owner"),
    allowNull: false,
    defaultValue: "user",
  },

  refreshToken: { type: DataTypes.TEXT, allowNull: true },
});

module.exports = User;
