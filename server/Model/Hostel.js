// Model/Hostel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../Database/db');

const Hostel = sequelize.define('Hostel', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ownerId: { type: DataTypes.INTEGER, allowNull: false, field: 'owner_id' },
  name: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false, field: 'price_per_night' },
  description: { type: DataTypes.TEXT },
  amenities: { type: DataTypes.JSONB, defaultValue: {} },
  totalBeds: { type: DataTypes.INTEGER, allowNull: false, field: 'total_beds' },
  availableBeds: { type: DataTypes.INTEGER, field: 'available_beds', defaultValue: function() { return this.totalBeds; } },
  images: { type: DataTypes.JSONB, defaultValue: [] },
  deletedAt: { type: DataTypes.DATE, field: 'deleted_at' }
}, {
  tableName: 'hostels',
  timestamps: true,
  underscored: true
});

// Helper methods
Hostel.getByOwnerId = function(ownerId) {
  return this.findAll({ where: { ownerId, deletedAt: null }, order: [['createdAt', 'DESC']] });
};
Hostel.getById = function(id) {
  return this.findOne({ where: { id, deletedAt: null } });
};

module.exports = Hostel;