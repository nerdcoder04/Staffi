-- Add additional fields to leaves table if they don't exist

-- Check and add start_date column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leaves' AND column_name = 'start_date'
    ) THEN
        ALTER TABLE leaves ADD COLUMN start_date DATE NOT NULL;
    END IF;
END $$;

-- Check and add approved_by column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leaves' AND column_name = 'approved_by'
    ) THEN
        ALTER TABLE leaves ADD COLUMN approved_by UUID REFERENCES hr_users(id);
    END IF;
END $$;

-- Check and add approved_at column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leaves' AND column_name = 'approved_at'
    ) THEN
        ALTER TABLE leaves ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Check and add rejected_by column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leaves' AND column_name = 'rejected_by'
    ) THEN
        ALTER TABLE leaves ADD COLUMN rejected_by UUID REFERENCES hr_users(id);
    END IF;
END $$;

-- Check and add rejected_at column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leaves' AND column_name = 'rejected_at'
    ) THEN
        ALTER TABLE leaves ADD COLUMN rejected_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Check and add rejection_reason column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leaves' AND column_name = 'rejection_reason'
    ) THEN
        ALTER TABLE leaves ADD COLUMN rejection_reason TEXT;
    END IF;
END $$; 