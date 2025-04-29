
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departmentOptions, roleOptions } from '@/lib/constants';

interface EmployeeAuthFormsProps {
  showLoginForm: boolean;
  setShowLoginForm: (show: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  name: string;
  setName: (name: string) => void;
  department: string;
  setDepartment: (department: string) => void;
  role: string;
  setRole: (role: string) => void;
  handleEmployeeLogin: (e: React.FormEvent) => void;
  handleEmployeeSignup: (e: React.FormEvent) => void;
}

const EmployeeAuthForms = ({
  showLoginForm,
  setShowLoginForm,
  email,
  setEmail,
  password,
  setPassword,
  name,
  setName,
  department,
  setDepartment,
  role,
  setRole,
  handleEmployeeLogin,
  handleEmployeeSignup
}: EmployeeAuthFormsProps) => {
  return (
    <div className="py-6">
      {showLoginForm ? (
        <form onSubmit={handleEmployeeLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              required
            />
          </div>
          <div className="pt-2">
            <Button 
              type="submit"
              className="w-full bg-staffi-blue hover:bg-staffi-blue/90"
            >
              Sign In
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <Separator className="my-4" />
            <p className="text-sm text-gray-500">Don't have an account?</p>
            <Button 
              variant="ghost" 
              onClick={() => setShowLoginForm(false)}
              className="mt-2 w-full"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Sign Up
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleEmployeeSignup} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="signup-email" className="text-sm font-medium">Email</label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="signup-password" className="text-sm font-medium">Password</label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="department" className="text-sm font-medium">Department</label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger id="department" className="w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">Role</label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="pt-2">
            <Button 
              type="submit"
              className="w-full bg-staffi-blue hover:bg-staffi-blue/90"
            >
              Submit Sign Up Request
            </Button>
            <p className="text-xs text-center text-gray-500 mt-2">
              Your request will be sent to HR for approval
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <Separator className="my-4" />
            <p className="text-sm text-gray-500">Already have an account?</p>
            <Button 
              variant="ghost" 
              onClick={() => setShowLoginForm(true)}
              className="mt-2 w-full"
            >
              Back to Sign In
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EmployeeAuthForms;
