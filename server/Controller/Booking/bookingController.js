const Booking = require('../../Model/Booking');
const Hostel = require('../../Model/Hostel');
const sequelize = require('../../Database/db');

const bookingController = {
  // Create new booking (for users)
  createBooking: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const userId = req.user.id;
      const {
        hostelId,
        fullName,
        phoneNumber,
        email,
        address,
        checkInDate,
        checkOutDate,
        numberOfBeds,
        totalAmount
      } = req.body;

      // Validation
      if (!hostelId || !fullName || !phoneNumber || !email || !address || 
          !checkInDate || !checkOutDate || !numberOfBeds || !totalAmount) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields'
        });
      }

      // Check if hostel exists and has enough beds
      const hostel = await Hostel.findOne({
        where: { id: hostelId, deletedAt: null },
        transaction
      });

      if (!hostel) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Hostel not found'
        });
      }

      if (hostel.availableBeds < numberOfBeds) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Only ${hostel.availableBeds} beds available`
        });
      }

      // Create booking
      const booking = await Booking.create({
        userId,
        hostelId,
        fullName,
        phoneNumber,
        email,
        address,
        checkInDate,
        checkOutDate,
        numberOfBeds,
        totalAmount,
        status: 'confirmed'
      }, { transaction });

      // Update hostel available beds
      await hostel.update({
        availableBeds: hostel.availableBeds - numberOfBeds
      }, { transaction });

      await transaction.commit();

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Create booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create booking',
        error: error.message
      });
    }
  },

  // Get user's bookings
  getUserBookings: async (req, res) => {
    try {
      const userId = req.user.id;

      const bookings = await Booking.findAll({
        where: { userId },
        include: [{
          model: Hostel,
          as: 'hostel',
          attributes: ['name', 'city', 'images']
        }],
        order: [['createdAt', 'DESC']]
      });

      // Format response
      const formattedBookings = bookings.map(booking => {
        const plain = booking.get({ plain: true });
        return {
          ...plain,
          hostelName: plain.hostel?.name,
          hostelCity: plain.hostel?.city,
          hostelImages: plain.hostel?.images
        };
      });

      res.status(200).json({
        success: true,
        data: formattedBookings
      });
    } catch (error) {
      console.error('Get user bookings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bookings',
        error: error.message
      });
    }
  },

  // Get owner's bookings (hostel owner sees who booked their hostels)
  getOwnerBookings: async (req, res) => {
    try {
      const ownerId = req.user.id;

      // First get owner's hostels
      const ownerHostels = await Hostel.findAll({
        where: { ownerId, deletedAt: null },
        attributes: ['id']
      });

      const hostelIds = ownerHostels.map(h => h.id);

      // Then get bookings for those hostels
      const bookings = await Booking.findAll({
        where: {
          hostelId: hostelIds
        },
        include: [{
          model: Hostel,
          as: 'hostel',
          attributes: ['name', 'city']
        }],
        order: [['createdAt', 'DESC']]
      });

      // Format response
      const formattedBookings = bookings.map(booking => {
        const plain = booking.get({ plain: true });
        return {
          ...plain,
          user_name: plain.fullName, // Match frontend expectation
          hostel_name: plain.hostel?.name,
          check_in_date: plain.checkInDate,
          check_out_date: plain.checkOutDate,
          total_amount: plain.totalAmount
        };
      });

      res.status(200).json({
        success: true,
        data: formattedBookings
      });
    } catch (error) {
      console.error('Get owner bookings error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch bookings',
        error: error.message
      });
    }
  },

  // Update booking status
  updateBookingStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const ownerId = req.user.id;

      // Find booking and verify ownership through hostel
      const booking = await Booking.findOne({
        where: { id },
        include: [{
          model: Hostel,
          as: 'hostel',
          where: { ownerId }
        }]
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found or you do not have permission'
        });
      }

      await booking.update({ status });

      res.status(200).json({
        success: true,
        message: 'Booking status updated',
        data: booking
      });
    } catch (error) {
      console.error('Update booking status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update booking status',
        error: error.message
      });
    }
  },

  // Get booking statistics
  getStatistics: async (req, res) => {
    try {
      const ownerId = req.user.id;

      // Get owner's hostels
      const ownerHostels = await Hostel.findAll({
        where: { ownerId, deletedAt: null },
        attributes: ['id']
      });

      const hostelIds = ownerHostels.map(h => h.id);

      // Get booking counts
      const totalBookings = await Booking.count({
        where: { hostelId: hostelIds }
      });

      const confirmedBookings = await Booking.count({
        where: { 
          hostelId: hostelIds,
          status: 'confirmed'
        }
      });

      const completedBookings = await Booking.count({
        where: { 
          hostelId: hostelIds,
          status: 'completed'
        }
      });

      // Get total revenue
      const bookings = await Booking.findAll({
        where: { hostelId: hostelIds },
        attributes: ['totalAmount']
      });

      const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.totalAmount || 0), 0);

      res.status(200).json({
        success: true,
        data: {
          totalBookings,
          confirmedBookings,
          completedBookings,
          totalRevenue
        }
      });
    } catch (error) {
      console.error('Get booking statistics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics',
        error: error.message
      });
    }
  }
};

module.exports = bookingController;