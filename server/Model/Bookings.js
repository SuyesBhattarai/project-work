const { DataTypes } = require('sequelize');
const sequelize = require('../Database/db');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
    },
    hostelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'hostel_id'
    },
    // User booking information
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'full_name'
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'phone_number'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    // Booking details
    checkInDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'check_in_date'
    },
    checkOutDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'check_out_date'
    },
    numberOfBeds: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'number_of_beds'
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'total_amount'
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'confirmed'
    },
    // Optional review
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    review: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'bookings',
    timestamps: true,
    underscored: true
});

module.exports = Booking;