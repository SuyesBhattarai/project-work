const express = require('express');
const router = express.Router();
const hostelController = require('../../Controller/Hostel/hostelController');
const upload = require('../../middleware/upload');
const { verifyToken, isOwner } = require('../../Security/jwt');

// ✅ PUBLIC ROUTE - Get all hostels (for users to browse)
// Must be BEFORE the verifyToken middleware
router.get('/all', verifyToken, hostelController.getAllHostels);

// ✅ OWNER ROUTES - Protected with verifyToken and isOwner
router.use(verifyToken);
router.use(isOwner);

// Create new hostel
router.post(
  '/create',
  upload.array('images', 5),
  hostelController.createHostel
);

// Get all hostels for owner
router.get('/my-hostels', hostelController.getOwnerHostels);

// Get hostel statistics
router.get('/statistics', hostelController.getStatistics);

// Get single hostel
router.get('/:id', hostelController.getHostelById);

// Update hostel
router.put('/:id', hostelController.updateHostel);

// Delete hostel
router.delete('/:id', hostelController.deleteHostel);

module.exports = router;