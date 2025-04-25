const request = require('supertest');
const app = require('./index');

// Enable logging during tests
console.log = jest.fn();
console.error = jest.fn();
console.table = jest.fn();

// Mock the supabase client
jest.mock('./utils/supabaseClient', () => {
    const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn(),
        insert: jest.fn().mockReturnThis(),
        auth: {
            signUp: jest.fn(),
            signInWithPassword: jest.fn(),
            getUser: jest.fn()
        }
    };
    return mockSupabase;
});

describe('Authentication Flow', () => {
    let supabase;

    beforeEach(() => {
        supabase = require('./utils/supabaseClient');
        jest.clearAllMocks();
        // Clear console logs before each test
        console.log.mockClear();
        console.error.mockClear();
    });

    // Mock data
    const mockHrUser = {
        id: '1',
        name: 'Test HR',
        email: 'hr@test.com',
        wallet: '0x1234567890123456789012345678901234567890'
    };

    const mockEmployee = {
        id: '2',
        email: 'employee@test.com',
        user_metadata: {
            name: 'Test Employee'
        }
    };

    const mockSession = {
        access_token: 'valid-token',
        user: mockEmployee
    };

    // Setup mock implementations
    beforeEach(() => {
        // Mock HR user lookup
        supabase.single.mockImplementation(() => ({
            data: mockHrUser,
            error: null
        }));

        // Mock auth methods
        supabase.auth.signUp.mockImplementation(({ email }) => {
            if (email === 'existing@test.com') {
                return { data: null, error: { message: 'User already registered' } };
            }
            return { data: { user: mockEmployee }, error: null };
        });

        supabase.auth.signInWithPassword.mockImplementation(({ email, password }) => {
            if (email === 'wrong@test.com' || password === 'wrong') {
                return { data: null, error: { message: 'Invalid credentials' } };
            }
            return { data: { user: mockEmployee, session: mockSession }, error: null };
        });

        supabase.auth.getUser.mockImplementation((token) => {
            if (token === 'invalid-token') {
                return { data: { user: null }, error: { message: 'Invalid token' } };
            }
            return { data: { user: mockEmployee }, error: null };
        });
    });

    describe('HR Database Connection', () => {
        it('should fetch HR details from database', async () => {
            // Mock the database response
            const mockHrDetails = {
                id: '1',
                name: 'Test HR',
                email: 'hr@test.com',
                wallet: '0x1234567890123456789012345678901234567890'
            };

            // First mock for authentication
            supabase.single.mockImplementationOnce(() => ({
                data: mockHrUser,
                error: null
            }));

            // Second mock for details endpoint
            supabase.single.mockImplementationOnce(() => ({
                data: mockHrDetails,
                error: null
            }));

            // Make the request to fetch HR details
            const response = await request(app)
                .get('/api/hr/details')
                .set('x-wallet-address', mockHrUser.wallet);

            // Verify the response
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                data: mockHrDetails
            });

            // Verify logs
            expect(console.log).toHaveBeenCalledWith(
                '🔑 Attempting HR authentication for wallet:',
                mockHrUser.wallet
            );
            expect(console.log).toHaveBeenCalledWith(
                '✅ HR authentication successful for:',
                mockHrUser.email
            );
            expect(console.log).toHaveBeenCalledWith(
                '🔍 Fetching HR details for wallet:',
                mockHrUser.wallet
            );
            expect(console.log).toHaveBeenCalledWith(
                '📋 HR User Details:'
            );
            expect(console.table).toHaveBeenCalledWith([mockHrDetails]);
        });

        it('should handle database connection error', async () => {
            // First mock for authentication
            supabase.single.mockImplementationOnce(() => ({
                data: mockHrUser,
                error: null
            }));

            // Second mock for details endpoint with error
            supabase.single.mockImplementationOnce(() => ({
                data: null,
                error: { message: 'Database connection error' }
            }));

            const response = await request(app)
                .get('/api/hr/details')
                .set('x-wallet-address', mockHrUser.wallet);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                error: 'Database connection error'
            });

            // Verify error logs
            expect(console.error).toHaveBeenCalledWith(
                '❌ Database error:',
                { message: 'Database connection error' }
            );
        });
    });

    describe('HR Authentication', () => {
        it('should successfully login HR with valid wallet address', async () => {
            // Mock the database response
            supabase.from.mockImplementationOnce(() => supabase);
            supabase.select.mockImplementationOnce(() => supabase);
            supabase.eq.mockImplementationOnce(() => supabase);
            supabase.single.mockResolvedValueOnce({ data: mockHrUser, error: null });

            const response = await request(app)
                .post('/api/auth/hr-login')
                .set('Content-Type', 'application/json')
                .send({
                    walletAddress: mockHrUser.wallet
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('HR login successful');
            expect(response.body.user).toEqual({
                id: mockHrUser.id,
                name: mockHrUser.name,
                email: mockHrUser.email,
                wallet: mockHrUser.wallet
            });
        });

        it('should return 400 for missing wallet address', async () => {
            const response = await request(app)
                .post('/api/auth/hr-login')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Wallet address is required');
        });

        it('should return 401 for invalid HR wallet', async () => {
            supabase.single.mockImplementationOnce(() => ({
                data: null,
                error: new Error('Not found')
            }));

            const response = await request(app)
                .post('/api/auth/hr-login')
                .send({
                    walletAddress: '0xinvalid'
                });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Unauthorized HR access');
        });
    });

    describe('Employee Authentication', () => {
        it('should successfully signup employee', async () => {
            const response = await request(app)
                .post('/api/auth/employee/signup')
                .send({
                    email: 'new@test.com',
                    password: 'password123',
                    name: 'New Employee'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Employee signup successful');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user).toHaveProperty('email');
        });

        it('should return 400 for missing signup fields', async () => {
            const response = await request(app)
                .post('/api/auth/employee/signup')
                .send({
                    email: 'test@test.com'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Email, password, and name are required');
        });

        it('should return 400 for existing email', async () => {
            const response = await request(app)
                .post('/api/auth/employee/signup')
                .send({
                    email: 'existing@test.com',
                    password: 'password123',
                    name: 'Existing Employee'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('User already registered');
        });

        it('should successfully login employee', async () => {
            const response = await request(app)
                .post('/api/auth/employee/login')
                .send({
                    email: 'employee@test.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Employee login successful');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user).toHaveProperty('email');
            expect(response.body.session).toHaveProperty('access_token');
        });

        it('should return 400 for missing login credentials', async () => {
            const response = await request(app)
                .post('/api/auth/employee/login')
                .send({
                    email: 'test@test.com'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Email and password are required');
        });

        it('should return 401 for invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/employee/login')
                .send({
                    email: 'wrong@test.com',
                    password: 'wrong'
                });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid credentials');
        });
    });

    describe('Protected Routes', () => {
        it('should allow HR access with valid wallet', async () => {
            const response = await request(app)
                .get('/api/protected/hr-route')
                .set('x-wallet-address', mockHrUser.wallet);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('HR access granted');
        });

        it('should allow employee access with valid token', async () => {
            const response = await request(app)
                .get('/api/protected/employee-route')
                .set('Authorization', `Bearer ${mockSession.access_token}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Employee access granted');
        });

        it('should deny HR access with invalid wallet', async () => {
            supabase.single.mockImplementationOnce(() => ({
                data: null,
                error: new Error('Not found')
            }));

            const response = await request(app)
                .get('/api/protected/hr-route')
                .set('x-wallet-address', '0xinvalid');

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Unauthorized HR access');
        });

        it('should deny employee access with invalid token', async () => {
            const response = await request(app)
                .get('/api/protected/employee-route')
                .set('Authorization', 'Bearer invalid-token');

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Invalid or expired token');
        });
    });

    describe('Employee Management', () => {
        it('should successfully add an employee', async () => {
            const mockNewEmployee = {
                id: '3',
                name: 'John Smith',
                email: 'john.smith@staffi.com',
                role: 'Software Engineer',
                department: 'Engineering',
                status: true,
                doj: new Date().toISOString()
            };

            // Mock HR authentication
            supabase.single.mockImplementationOnce(() => ({
                data: mockHrUser,
                error: null
            }));

            // Mock the employee insertion
            supabase.from.mockImplementationOnce(() => supabase);
            supabase.insert.mockImplementationOnce(() => supabase);
            supabase.select.mockImplementationOnce(() => supabase);
            supabase.single.mockImplementationOnce(() => Promise.resolve({
                data: mockNewEmployee,
                error: null
            }));

            const response = await request(app)
                .post('/api/employee/add')
                .set('x-wallet-address', mockHrUser.wallet)
                .send({
                    name: 'John Smith',
                    email: 'john.smith@staffi.com',
                    role: 'Software Engineer',
                    department: 'Engineering'
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Employee added successfully');
            expect(response.body.employee).toEqual(mockNewEmployee);

            // Verify the insert chain was called correctly
            expect(supabase.from).toHaveBeenCalledWith('employees');
            expect(supabase.insert).toHaveBeenCalledWith([{
                name: 'John Smith',
                email: 'john.smith@staffi.com',
                role: 'Software Engineer',
                department: 'Engineering',
                wallet: null,
                status: true,
                doj: expect.any(String)
            }]);
        });

        it('should return 400 for missing required fields', async () => {
            const response = await request(app)
                .post('/api/employee/add')
                .set('x-wallet-address', mockHrUser.wallet)
                .send({
                    name: 'John Smith',
                    email: 'john.smith@staffi.com'
                    // Missing role and department
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Name, email, role, and department are required');
        });

        it('should return 401 for unauthorized access', async () => {
            // Mock HR authentication to fail
            supabase.single.mockImplementationOnce(() => ({
                data: null,
                error: new Error('Not found')
            }));

            const response = await request(app)
                .post('/api/employee/add')
                .set('x-wallet-address', '0xinvalid')
                .send({
                    name: 'John Smith',
                    email: 'john.smith@staffi.com',
                    role: 'Software Engineer',
                    department: 'Engineering'
                });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Unauthorized HR access');
        });
    });
}); 