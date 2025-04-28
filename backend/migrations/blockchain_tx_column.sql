-- Add blockchain_tx column to leaves table if it doesn't exist

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leaves' AND column_name = 'blockchain_tx'
    ) THEN
        ALTER TABLE leaves ADD COLUMN blockchain_tx TEXT;
    END IF;
END $$; 