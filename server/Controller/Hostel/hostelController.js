const Hostel = require('../../Model/Hostel');
const { Sequelize } = require('sequelize');

const hostelController = {
  // Get ALL hostels (for users to browse) - PUBLIC ROUTE
  getAllHostels: async (req, res) => {
    try {
      const hostels = await Hostel.findAll({ 
        where: { 
          deletedAt: null,
          availableBeds: { [Sequelize.Op.gt]: 0 } // Only show hostels with available beds
        },
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: hostels
      });
    } catch (error) {
      console.error('Get all hostels error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch hostels',
        error: error.message
      });
    }
  },

  // CREATE
  createHostel: async (req, res) => {
    try {
      const imagePaths = req.files ? req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`) : [];
      const { name, city, address, price, description, amenities, totalBeds } = req.body;

      const hostel = await Hostel.create({
        ownerId: req.user.id,
        name, 
        city, 
        address, 
        price,
        description: description || '',
        amenities: amenities ? JSON.parse(amenities) : {},
        totalBeds,
        availableBeds: totalBeds,
        images: imagePaths
      });
      
      res.status(201).json({ success: true, message: 'Hostel created!', data: hostel });
    } catch (error) {
      console.error('Create hostel error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // READ ALL (OWNER ONLY)
  getOwnerHostels: async (req, res) => {
    try {
      const hostels = await Hostel.findAll({ 
        where: { ownerId: req.user.id, deletedAt: null },
        order: [['createdAt', 'DESC']]
      });
      
      const data = hostels.map(h => {
        const plain = h.get({ plain: true });
        return {
          ...plain,
          occupancy: plain.totalBeds > 0 ? Math.round(((plain.totalBeds - plain.availableBeds) / plain.totalBeds) * 100) : 0
        };
      });
      
      res.json({ success: true, data });
    } catch (error) {
      console.error('Get owner hostels error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // READ SINGLE
  getHostelById: async (req, res) => {
    try {
      const hostel = await Hostel.findOne({ 
        where: { id: req.params.id, ownerId: req.user.id, deletedAt: null } 
      });
      
      if (!hostel) {
        return res.status(404).json({ success: false, message: 'Not found' });
      }
      
      res.json({ success: true, data: hostel });
    } catch (error) {
      console.error('Get hostel error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // UPDATE
  updateHostel: async (req, res) => {
    try {
      const { id } = req.params;
      const hostel = await Hostel.findOne({ where: { id, ownerId: req.user.id } });
      
      if (!hostel) {
        return res.status(404).json({ success: false, message: 'Hostel not found' });
      }

      let imagePaths = hostel.images;
      if (req.files && req.files.length > 0) {
        imagePaths = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
      }

      await hostel.update({
        ...req.body,
        amenities: req.body.amenities ? JSON.parse(req.body.amenities) : hostel.amenities,
        images: imagePaths
      });
      
      res.json({ success: true, message: 'Updated successfully!', data: hostel });
    } catch (error) {
      console.error('Update hostel error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // DELETE (Soft Delete)
  deleteHostel: async (req, res) => {
    try {
      const result = await Hostel.update(
        { deletedAt: new Date() }, 
        { where: { id: req.params.id, ownerId: req.user.id } }
      );
      
      if (result[0] === 0) {
        return res.status(404).json({ success: false, message: 'Hostel not found' });
      }
      
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
      console.error('Delete hostel error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // STATISTICS
  getStatistics: async (req, res) => {
    try {
      const count = await Hostel.count({ where: { ownerId: req.user.id, deletedAt: null } });
      res.json({ success: true, data: { totalHostels: count } });
    } catch (error) {
      console.error('Get statistics error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = hostelController;