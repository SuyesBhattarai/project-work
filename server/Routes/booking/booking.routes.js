// Booking Routes - defines all booking endpoints
const express = require('express');
const router = express.Router();
const bookingController = require('../../Controller/Booking/bookingController');
const { verifyToken, isOwner } = require('../../Security/jwt');

// All routes require authentication
router.use(verifyToken);

// ✅ USER ROUTES - Create booking and view own bookings
router.post('/create', bookingController.createBooking);
router.get('/my-bookings', bookingController.getUserBookings);

// ✅ OWNER ROUTES - View bookings for their hostels
router.get('/owner-bookings', isOwner, bookingController.getOwnerBookings);
router.get('/statistics', isOwner, bookingController.getStatistics);
router.put('/:id/status', isOwner, bookingController.updateBookingStatus);

module.exports = router;