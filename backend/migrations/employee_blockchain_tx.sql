-- Add blockchain_tx column to employee_requests table if it doesn't exist

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'employee_requests' AND column_name = 'blockchain_tx'
    ) THEN
        ALTER TABLE employee_requests ADD COLUMN blockchain_tx TEXT;
    END IF;
END $$; 