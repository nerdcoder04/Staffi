
import React from 'react';
import { Wallet, Mail } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface RoleSelectorProps {
  selectedRole: "hr" | "employee" | null;
  onRoleSelect: (role: "hr" | "employee") => void;
}

const RoleSelector = ({ selectedRole, onRoleSelect }: RoleSelectorProps) => {
  const handleRoleSelect = (role: "hr" | "employee") => {
    console.log("Role clicked:", role);
    onRoleSelect(role);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center text-xl">Choose Your Role</DialogTitle>
        <DialogDescription className="text-center">
          Select how you want to sign in to STAFFI Portal
        </DialogDescription>
      </DialogHeader>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleRoleSelect("hr")} 
            className="flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
          >
            <div className="rounded-full bg-staffi-purple/10 p-3 mb-2">
              <Wallet className="w-6 h-6 text-staffi-purple" />
            </div>
            <div className="font-medium">HR Admin</div>
            <div className="text-xs text-gray-500 mt-1">Web3 Login</div>
          </button>
          
          <button 
            onClick={() => handleRoleSelect("employee")} 
            className="flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
          >
            <div className="rounded-full bg-staffi-blue/10 p-3 mb-2">
              <Mail className="w-6 h-6 text-staffi-blue" />
            </div>
            <div className="font-medium">Employee</div>
            <div className="text-xs text-gray-500 mt-1">Email Login</div>
          </button>
        </div>
      </div>
    </>
  );
};

export default RoleSelector;
