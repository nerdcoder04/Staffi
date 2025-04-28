-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define roles table for predefined roles
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    role_name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert predefined roles
INSERT INTO roles (role_name, description) 
VALUES 
('ADMIN', 'Administrator with full access'),
('MANAGER', 'Team or department manager'),
('DEVELOPER', 'Software developer or engineer'),
('DESIGNER', 'UI/UX or graphic designer'),
('HR', 'Human resources personnel'),
('FINANCE', 'Finance and accounting staff'),
('MARKETING', 'Marketing and communications'),
('SALES', 'Sales representative'),
('SUPPORT', 'Customer support staff'),
('INTERN', 'Temporary intern position')
ON CONFLICT (role_name) DO NOTHING;

-- Departments table for predefined departments
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    dept_name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert predefined departments
INSERT INTO departments (dept_name, description) 
VALUES 
('ENGINEERING', 'Software development and engineering'),
('DESIGN', 'Product and graphic design'),
('OPERATIONS', 'Business operations'),
('FINANCE', 'Finance and accounting'),
('MARKETING', 'Marketing and communications'),
('SALES', 'Sales and customer acquisition'),
('HUMAN_RESOURCES', 'HR and talent management'),
('CUSTOMER_SUPPORT', 'Customer service and support')
ON CONFLICT (dept_name) DO NOTHING;

-- Employees table (updated with role and department references)
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    wallet TEXT UNIQUE,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    department_id INTEGER NOT NULL REFERENCES departments(id),
    doj DATE NOT NULL,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Employee Signup Requests table
CREATE TABLE IF NOT EXISTS employee_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    department_id INTEGER NOT NULL REFERENCES departments(id),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_by UUID REFERENCES hr_users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT
);

-- HR Users table
CREATE TABLE IF NOT EXISTS hr_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Leaves table
CREATE TABLE IF NOT EXISTS leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emp_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    days INTEGER NOT NULL CHECK (days > 0),
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payrolls table
CREATE TABLE IF NOT EXISTS payrolls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emp_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    tx_hash TEXT UNIQUE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Certificates table
CREATE TABLE IF NOT EXISTS certificates (
    token_id INTEGER PRIMARY KEY,
    emp_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    token_uri TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Logs table
CREATE TABLE IF NOT EXISTS ai_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    emp_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    log_input JSONB NOT NULL,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    suggestions JSONB NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_wallet ON employees(wallet);
CREATE INDEX IF NOT EXISTS idx_employees_role_id ON employees(role_id);
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_hr_users_wallet ON hr_users(wallet);
CREATE INDEX IF NOT EXISTS idx_employee_requests_email ON employee_requests(email);
CREATE INDEX IF NOT EXISTS idx_employee_requests_status ON employee_requests(status);
CREATE INDEX IF NOT EXISTS idx_leaves_emp_id ON leaves(emp_id);
CREATE INDEX IF NOT EXISTS idx_payrolls_emp_id ON payrolls(emp_id);
CREATE INDEX IF NOT EXISTS idx_certificates_emp_id ON certificates(emp_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_emp_id ON ai_logs(emp_id);

-- Add triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hr_users_updated_at
    BEFORE UPDATE ON hr_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employee_requests_updated_at
    BEFORE UPDATE ON employee_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaves_updated_at
    BEFORE UPDATE ON leaves
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 