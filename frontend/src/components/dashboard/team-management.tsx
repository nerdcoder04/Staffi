import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  avatarUrl: string;
  status: 'active' | 'away' | 'offline' | 'busy';
}

interface TeamManagementProps {
  className?: string;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ className }) => {
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: '', department: '', avatarUrl: '' });
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  
  // ... keep existing code (generateTeamMembers function and other state variables)

  const handleAddMember = () => {
    if (!newMember.name || !newMember.role || !newMember.department) {
      toast.error("Please fill in all required fields");
      return;
    }

    // ... keep existing code (creating new member)
  };

  return (
    <Card className={cn("border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300", className)}>
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-semibold">Team Management</CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 rounded-full"
          onClick={() => setShowAllProjects(true)}
        >
          <ArrowUpRight className="h-4 w-4" />
          <span className="sr-only">View Details</span>
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <Avatar>
                            <AvatarImage src={member.avatarUrl} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.role}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.department}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={cn("w-2 h-2 rounded-full mr-1.5", getStatusColor(member.status))}></span>
                        <span className="text-sm text-gray-900 capitalize">{member.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => setShowAllMembers(!showAllMembers)}
              className="text-sm"
            >
              {showAllMembers ? "View Less" : "View All Members"}
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Add New Team Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>Fill in the details to add a new team member</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input 
                id="role"
                value={newMember.role}
                onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                placeholder="Senior Developer"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department"
                value={newMember.department}
                onChange={(e) => setNewMember({...newMember, department: e.target.value})}
                placeholder="Engineering"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View All Projects Dialog */}
      <Dialog open={showAllProjects} onOpenChange={setShowAllProjects}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Current Projects</DialogTitle>
            <DialogDescription>Overview of all active team projects</DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto py-4">
            <div className="space-y-4">
              {["Product Redesign", "Marketing Campaign", "API Integration", "Client Portal", "Mobile App"].map((project, i) => (
                <Card key={i} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{project}</h3>
                      <div className="mt-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <span>Progress: {Math.floor(Math.random() * 100)}%</span>
                          <Badge className={Math.random() > 0.5 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                            {Math.random() > 0.5 ? "On Track" : "Review Needed"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <Avatar key={i} className="h-6 w-6 border-2 border-white">
                          <AvatarImage src={teamMembers[i].avatarUrl} />
                          <AvatarFallback>TM</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowAllProjects(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TeamManagement;