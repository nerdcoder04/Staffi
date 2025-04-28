-- Migration: Create employee status history table
-- This migration adds a table to track the history of employee status changes

-- Create the employee_status_history table
CREATE TABLE IF NOT EXISTS employee_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    previous_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES hr_users(id),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employee_status_history_employee_id 
ON employee_status_history(employee_id);

CREATE INDEX IF NOT EXISTS idx_employee_status_history_changed_by 
ON employee_status_history(changed_by);

-- Add comment to the table
COMMENT ON TABLE employee_status_history IS 'Tracks the history of employee status changes for audit purposes';

-- Create view to show employee status changes with HR user names
CREATE OR REPLACE VIEW employee_status_history_view AS
SELECT 
    esh.id,
    esh.employee_id,
    e.name AS employee_name,
    esh.previous_status,
    esh.new_status,
    esh.changed_by,
    hr.name AS changed_by_name,
    esh.reason,
    esh.created_at
FROM 
    employee_status_history esh
LEFT JOIN 
    employees e ON esh.employee_id = e.id
LEFT JOIN 
    hr_users hr ON esh.changed_by = hr.id
ORDER BY 
    esh.created_at DESC; 