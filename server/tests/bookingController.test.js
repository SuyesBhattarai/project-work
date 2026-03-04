// Test file for booking controller
jest.mock("../Model/Booking");
jest.mock("../Model/Hostel");

const Booking = require("../Model/Booking");
const Hostel = require("../Model/Hostel");
const bookingController = require("../Controller/Booking/bookingController");

describe("Booking Controller", () => {

  test("should fail if hostel not found", async () => {

    // Mock Hostel.findOne to return null, simulating a non-existent hostel
    Hostel.findOne.mockResolvedValue(null);

    const req = {
      user: { id: 1 },
      body: {
        hostelId: 9999,           // non-existent hostel ID
        fullName: 'Test User',    // must include all required fields
        phoneNumber: '1234567890',
        email: 'test@example.com',
        address: 'Test Address',
        checkInDate: '2026-03-10',
        checkOutDate: '2026-03-12',
        numberOfBeds: 1,
        totalAmount: 100
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await bookingController.createBooking(req, res);

    // Should return 404 because hostel not found
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Hostel not found'
      })
    );
  });

});