-- Rollback: Change employee status from enum back to boolean
-- This script reverts the employee status field from text enum back to boolean

-- 1. Add a temporary boolean column
ALTER TABLE employees 
ADD COLUMN status_old BOOLEAN;

-- 2. Migrate data from enum status to boolean
UPDATE employees 
SET status_old = 
    CASE 
        WHEN status::TEXT = 'ACTIVE' THEN TRUE
        WHEN status::TEXT = 'ON_LEAVE' THEN TRUE -- Maintain leave status differently
        ELSE FALSE -- INACTIVE, TERMINATED, SUSPENDED
    END;

-- 3. Drop the enum status column and rename the boolean one
ALTER TABLE employees 
DROP COLUMN status,
RENAME COLUMN status_old TO status;

-- 4. Set default value for the boolean status
ALTER TABLE employees 
ALTER COLUMN status SET DEFAULT TRUE;

-- 5. Drop the enum type if no other tables use it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE data_type = 'employee_status_enum'
    ) THEN
        DROP TYPE IF EXISTS employee_status_enum;
    END IF;
END$$; 