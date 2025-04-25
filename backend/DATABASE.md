# Database Setup Guide

## Prerequisites
- Supabase account
- Supabase project created
- Supabase connection details (URL and ANON_KEY)

## Setup Steps

1. **Create a new Supabase project** if you haven't already:
   - Go to https://supabase.com
   - Sign in and create a new project
   - Note down your project URL and anon key

2. **Set up environment variables**:
   Create a `.env` file in the backend directory with:
   ```env
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   JWT_SECRET=your_jwt_secret
   ```

3. **Initialize the database**:
   - Go to your Supabase project's SQL Editor
   - Copy the contents of `schema.sql`
   - Paste and run in the SQL Editor

4. **Verify the setup**:
   - Check that all tables are created in the Table Editor
   - Verify that the test HR user is inserted
   - Test HR login with the test wallet address

## Test Data

The schema includes a test HR user with these credentials:
```
Wallet Address: 0x1234567890123456789012345678901234567890
Email: hr@test.com
Role: hr_manager
```

## Tables Created

1. **hr_users**: HR staff management
2. **employees**: Employee records
3. **leaves**: Leave requests
4. **payrolls**: Salary records
5. **certificates**: Employee certificates (NFTs)
6. **ai_logs**: AI prediction logs
7. **audit_logs**: System audit trail

## Common Issues

1. **Missing Tables**: 
   - Run the schema.sql again
   - Check for any error messages in SQL Editor

2. **Authentication Errors**:
   - Verify your SUPABASE_URL and SUPABASE_ANON_KEY
   - Check if the test HR user exists

3. **Column Errors**:
   - If you see "column does not exist" errors, run schema.sql again
   - Some columns might be missing if you're upgrading from an older version

## Upgrading

When upgrading the database schema:
1. Backup your data
2. Run the new schema.sql
3. Verify data integrity
4. Update any affected code

## Development vs Production

For development:
- Use the test HR user
- Add test data as needed

For production:
- Remove test data
- Use real wallet addresses
- Set up proper backup procedures 