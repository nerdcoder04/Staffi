const request = require('supertest');
const jwt = require('jsonwebtoken');
const supabase = require('../utils/supabaseClient');

// Set test environment
process.env.NODE_ENV = 'test';

// Mock the auth middleware
jest.mock('../middleware/authMiddleware', () => ({
  authenticateEmployee: (req, res, next) => {
    req.user = {
      id: 'emp-uuid-123',
      email: 'employee@test.com',
      role: 'employee'
    };
    next();
  },
  authenticateHR: (req, res, next) => {
    req.user = {
      id: 'hr-uuid-123',
      email: 'hr@test.com',
      role: 'hr'
    };
    next();
  }
}));

// Import the app after mocking the middleware
const app = require('../index');

// Mock supabase client
jest.mock('../utils/supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis()
}));

// Mock logger
jest.mock('../utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

// Sample test data
const testEmployee = {
  id: 'emp-uuid-123',
  name: 'Test Employee',
  email: 'employee@test.com',
  role: 'DEVELOPER'
};

const testHR = {
  id: 'hr-uuid-123',
  name: 'Test HR',
  email: 'hr@test.com'
};

const testLeave = {
  id: 'leave-uuid-123',
  emp_id: testEmployee.id,
  reason: 'Vacation',
  days: 5,
  start_date: '2023-06-15',
  status: 'PENDING',
  submitted_at: new Date().toISOString()
};

// Helper function to generate tokens
function generateEmployeeToken() {
  return jwt.sign(
    { id: testEmployee.id, email: testEmployee.email, role: 'employee' },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
}

function generateHRToken() {
  return jwt.sign(
    { id: testHR.id, email: testHR.email, role: 'hr' },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1h' }
  );
}

describe('Leave Management API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/leave/apply', () => {
    it('should create a leave request for authenticated employee', async () => {
      // Mock the response from Supabase
      supabase.insert.mockImplementationOnce(() => ({
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({
          data: testLeave,
          error: null
        })
      }));

      const response = await request(app)
        .post('/api/leave/apply')
        .send({
          reason: 'Vacation',
          days: 5,
          startDate: '2023-06-15'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('submitted successfully');
      expect(response.body.leave).toEqual(testLeave);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/leave/apply')
        .send({
          reason: 'Vacation'
          // Missing days and startDate
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('required');
    });
  });

  describe('GET /api/leave/my-leaves', () => {
    it('should fetch leave requests for authenticated employee', async () => {
      // Mock the response from Supabase
      supabase.select.mockImplementationOnce(() => ({
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValueOnce({
          data: [testLeave],
          error: null
        })
      }));

      const response = await request(app)
        .get('/api/leave/my-leaves');

      expect(response.status).toBe(200);
      expect(response.body.leaves).toEqual([testLeave]);
    });
  });

  describe('GET /api/leave/all', () => {
    it('should fetch all leave requests for HR', async () => {
      // Mock the response from Supabase
      supabase.select.mockImplementationOnce(() => ({
        order: jest.fn().mockResolvedValueOnce({
          data: [testLeave],
          error: null
        })
      }));

      const response = await request(app)
        .get('/api/leave/all');

      expect(response.status).toBe(200);
      expect(response.body.leaves).toEqual([testLeave]);
    });
  });

  describe('POST /api/leave/:id/approve', () => {
    it('should approve a pending leave request', async () => {
      // Mock get leave
      supabase.select.mockImplementationOnce(() => ({
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({
          data: testLeave,
          error: null
        })
      }));

      // Mock update leave
      supabase.update.mockImplementationOnce(() => ({
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({
          data: { ...testLeave, status: 'APPROVED' },
          error: null
        })
      }));

      const response = await request(app)
        .post(`/api/leave/${testLeave.id}/approve`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('approved successfully');
      expect(response.body.leave.status).toBe('APPROVED');
    });
  });

  describe('POST /api/leave/:id/reject', () => {
    it('should reject a pending leave request with a reason', async () => {
      // Mock get leave
      supabase.select.mockImplementationOnce(() => ({
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({
          data: testLeave,
          error: null
        })
      }));

      // Mock update leave
      supabase.update.mockImplementationOnce(() => ({
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({
          data: { 
            ...testLeave, 
            status: 'REJECTED',
            rejection_reason: 'Not enough resources'
          },
          error: null
        })
      }));

      const response = await request(app)
        .post(`/api/leave/${testLeave.id}/reject`)
        .send({
          rejectionReason: 'Not enough resources'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('rejected successfully');
      expect(response.body.leave.status).toBe('REJECTED');
    });

    it('should require a rejection reason', async () => {
      const response = await request(app)
        .post(`/api/leave/${testLeave.id}/reject`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Rejection reason');
    });
  });
}); 