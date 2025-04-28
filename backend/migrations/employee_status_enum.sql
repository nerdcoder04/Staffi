-- Migration: Change employee status from boolean to text enum
-- This migration changes the 'status' column in the employees table
-- from a boolean to a text enum with values like ACTIVE, TERMINATED, ON_LEAVE, etc.

-- 1. First create the enum type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'employee_status_enum') THEN
        CREATE TYPE employee_status_enum AS ENUM (
            'ACTIVE',
            'INACTIVE',
            'ON_LEAVE',
            'TERMINATED',
            'SUSPENDED'
        );
    END IF;
END$$;

-- 2. Add a temporary column with the new type
ALTER TABLE employees 
ADD COLUMN status_new employee_status_enum;

-- 3. Migrate data from boolean status to the new enum
UPDATE employees 
SET status_new = 
    CASE 
        WHEN status IS TRUE THEN 'ACTIVE'::employee_status_enum
        WHEN status IS FALSE THEN 'INACTIVE'::employee_status_enum
        ELSE 'TERMINATED'::employee_status_enum -- For NULL values
    END;

-- 4. Drop the old status column and rename the new one
ALTER TABLE employees 
DROP COLUMN status,
RENAME COLUMN status_new TO status;

-- 5. Set default value for the new status column
ALTER TABLE employees 
ALTER COLUMN status SET DEFAULT 'ACTIVE'::employee_status_enum;

-- 6. Add a comment to the column to describe possible values
COMMENT ON COLUMN employees.status IS 'Employee status: ACTIVE, INACTIVE, ON_LEAVE, TERMINATED, SUSPENDED'; 