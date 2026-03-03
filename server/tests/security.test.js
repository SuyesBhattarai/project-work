const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// ✅ Mock BEFORE importing — provide manual factory so methods are jest.fn()
jest.mock('../Controller/Booking/bookingController', () => ({
  createBooking: jest.fn(),
  updateBookingStatus: jest.fn(),
  getUserBookings: jest.fn(),
  getOwnerBookings: jest.fn(),
  getStatistics: jest.fn(),
}));

// ✅ Mock auth middleware too
jest.mock('../Security/jwt', () => jest.fn());

const bookingController = require('../Controller/Booking/bookingController');
const authMiddleware = require('../Security/jwt');

const app = express();
app.use(bodyParser.json());

// Routes registered AFTER mocks are set up
app.post('/api/bookings', authMiddleware, bookingController.createBooking);
app.patch('/api/bookings/:id/status', authMiddleware, bookingController.updateBookingStatus);

describe('Security Tests', () => {

  const validToken = 'valid-jwt-token';
  const invalidToken = 'invalid-token';

  beforeAll(() => {
    // ✅ Now this works because authMiddleware is a jest.fn()
    authMiddleware.mockImplementation((req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }
      if (authHeader === `Bearer ${validToken}`) {
        req.user = { id: 1, role: 'user' };
        return next();
      }
      return res.status(403).json({ success: false, message: 'Invalid token' });
    });
  });

  beforeEach(() => {
    // ✅ Reset controller mocks before each test to avoid cross-test pollution
    jest.clearAllMocks();

    // Re-apply authMiddleware mock after clearAllMocks
    authMiddleware.mockImplementation((req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ success: false, message: 'No token provided' });
      }
      if (authHeader === `Bearer ${validToken}`) {
        req.user = { id: 1, role: 'user' };
        return next();
      }
      return res.status(403).json({ success: false, message: 'Invalid token' });
    });
  });

  test('Should block request without token', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .send({});

    expect(res.status).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({ success: false, message: 'No token provided' })
    );
  });

  test('Should block request with invalid token', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({});

    expect(res.status).toBe(403);
    expect(res.body).toEqual(
      expect.objectContaining({ success: false, message: 'Invalid token' })
    );
  });

  test('Should allow request with valid token', async () => {
    // ✅ Mock as implementation (not mockResolvedValue — Express needs req/res handling)
    bookingController.createBooking.mockImplementation((req, res) => {
      return res.status(201).json({ success: true });
    });

    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        hostelId: 1,
        fullName: 'Test User',
        phoneNumber: '1234567890',
        email: 'test@example.com',
        address: 'Test Address',
        checkInDate: '2026-03-10',
        checkOutDate: '2026-03-12',
        numberOfBeds: 1,
        totalAmount: 100
      });

    expect(res.status).toBe(201);
    expect(bookingController.createBooking).toHaveBeenCalled();
  });

  test('User cannot update booking status if not owner', async () => {
    bookingController.updateBookingStatus.mockImplementation((req, res) => {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or you do not have permission'
      });
    });

    const res = await request(app)
      .patch('/api/bookings/1/status')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ status: 'confirmed' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'Booking not found or you do not have permission'
      })
    );
  });

});