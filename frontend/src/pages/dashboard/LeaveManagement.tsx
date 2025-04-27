
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { 
  Check, 
  X, 
  Calendar as CalendarIcon, 
  Search, 
  Filter,
  ChevronDown,
  FileText,
  Clock,
  CalendarDays,
  Users,
  Briefcase,
  AlertTriangle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// Interface for leave request
interface LeaveRequest {
  id: number;
  employeeName: string;
  employeePhoto?: string;
  employeeRole: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
  requestDate: string;
  project: string;
  projectDeadline: string;
  replacements: string[];
}

const leaveRequests: LeaveRequest[] = [
  {
    id: 1,
    employeeName: "Alex Johnson",
    employeePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    employeeRole: "Senior Developer",
    type: "Annual Leave",
    startDate: "2025-04-28",
    endDate: "2025-05-05",
    status: "Pending",
    reason: "Family vacation",
    requestDate: "2025-04-20",
    project: "Core Platform Upgrade",
    projectDeadline: "2025-06-15",
    replacements: ["Maya Patel", "James Wilson"]
  },
  {
    id: 2,
    employeeName: "Maya Patel",
    employeePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    employeeRole: "UI/UX Designer",
    type: "Sick Leave",
    startDate: "2025-04-24",
    endDate: "2025-04-25",
    status: "Approved",
    reason: "Doctor's appointment",
    requestDate: "2025-04-23",
    project: "Mobile App Redesign",
    projectDeadline: "2025-05-10",
    replacements: ["Emma Thompson"]
  },
  {
    id: 3,
    employeeName: "Daniel Kim",
    employeePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    employeeRole: "Product Manager",
    type: "Annual Leave",
    startDate: "2025-05-10",
    endDate: "2025-05-17",
    status: "Approved",
    reason: "Personal time off",
    requestDate: "2025-04-15",
    project: "Q3 Product Launch",
    projectDeadline: "2025-07-01",
    replacements: ["Alex Johnson"]
  },
  {
    id: 4,
    employeeName: "Sophia Rodriguez",
    employeePhoto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    employeeRole: "Marketing Specialist",
    type: "Maternity Leave",
    startDate: "2025-06-01",
    endDate: "2025-09-01",
    status: "Approved",
    reason: "Maternity leave",
    requestDate: "2025-03-15",
    project: "Brand Campaign",
    projectDeadline: "2025-05-25",
    replacements: ["James Wilson", "Emma Thompson"]
  },
  {
    id: 5,
    employeeName: "James Wilson",
    employeePhoto: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    employeeRole: "Data Analyst",
    type: "Sick Leave",
    startDate: "2025-04-26",
    endDate: "2025-04-26",
    status: "Pending",
    reason: "Medical appointment",
    requestDate: "2025-04-25",
    project: "Metrics Dashboard",
    projectDeadline: "2025-05-15",
    replacements: ["Alex Johnson"]
  }
];

const LeaveManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isNewLeaveDialogOpen, setIsNewLeaveDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const pendingLeaves = leaveRequests.filter(leave => leave.status === 'Pending');
  const approvedLeaves = leaveRequests.filter(leave => leave.status === 'Approved');
  const rejectedLeaves = leaveRequests.filter(leave => leave.status === 'Rejected');

  const filteredLeaves = searchQuery
    ? leaveRequests.filter(leave => 
        leave.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.employeeRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeTab === 'pending'
      ? pendingLeaves
      : activeTab === 'approved'
        ? approvedLeaves
        : activeTab === 'rejected'
          ? rejectedLeaves
          : leaveRequests;

  const handleLeaveAction = (leaveId: number, action: 'approve' | 'reject') => {
    // In a real app, this would make an API call
    // Here we just show a toast
    const leave = leaveRequests.find(l => l.id === leaveId);
    
    toast({
      title: action === 'approve' ? "Leave Approved" : "Leave Rejected",
      description: `${leave?.employeeName}'s leave request has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
    });
  };

  const handleLeaveClick = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setIsDetailDialogOpen(true);
  };

  const handleNewLeaveRequest = () => {
    setIsNewLeaveDialogOpen(true);
  };

  const submitNewLeaveRequest = () => {
    // In a real app, this would submit the form data
    // Here we just close the dialog and show a toast
    setIsNewLeaveDialogOpen(false);
    
    toast({
      title: "Leave Request Submitted",
      description: "The leave request has been submitted successfully.",
    });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-500 mt-1">Track, approve, and manage employee leave requests</p>
        </div>
        <Button 
          className="bg-staffi-purple hover:bg-staffi-purple-dark transition-all hover:scale-105"
          onClick={handleNewLeaveRequest}
        >
          Request Leave
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-amber-500">{pendingLeaves.length}</p>
            </div>
            <div className="bg-amber-50 p-2 rounded-full">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-green-500">{approvedLeaves.length}</p>
            </div>
            <div className="bg-green-50 p-2 rounded-full">
              <Check className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-red-500">{rejectedLeaves.length}</p>
            </div>
            <div className="bg-red-50 p-2 rounded-full">
              <X className="h-5 w-5 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-staffi-purple">{leaveRequests.length}</p>
            </div>
            <div className="bg-staffi-purple-light p-2 rounded-full">
              <CalendarDays className="h-5 w-5 text-staffi-purple" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests Table */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Leave Requests</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search leave requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
          
          <Tabs 
            defaultValue="pending" 
            className="mt-4"
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="all">
                All
                <span className="ml-1.5 inline-flex items-center justify-center bg-gray-200 text-gray-800 rounded-full h-5 min-w-[20px] px-1 text-xs">
                  {leaveRequests.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending
                <span className="ml-1.5 inline-flex items-center justify-center bg-amber-100 text-amber-800 rounded-full h-5 min-w-[20px] px-1 text-xs">
                  {pendingLeaves.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved
                <span className="ml-1.5 inline-flex items-center justify-center bg-green-100 text-green-800 rounded-full h-5 min-w-[20px] px-1 text-xs">
                  {approvedLeaves.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected
                <span className="ml-1.5 inline-flex items-center justify-center bg-red-100 text-red-800 rounded-full h-5 min-w-[20px] px-1 text-xs">
                  {rejectedLeaves.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="p-0 mt-4">
              <LeaveTable 
                leaves={filteredLeaves} 
                onLeaveClick={handleLeaveClick} 
                onLeaveAction={handleLeaveAction} 
                formatDate={formatDate}
                calculateDuration={calculateDuration}
              />
            </TabsContent>
            
            <TabsContent value="pending" className="p-0 mt-4">
              <LeaveTable 
                leaves={filteredLeaves} 
                onLeaveClick={handleLeaveClick} 
                onLeaveAction={handleLeaveAction} 
                formatDate={formatDate}
                calculateDuration={calculateDuration}
              />
            </TabsContent>
            
            <TabsContent value="approved" className="p-0 mt-4">
              <LeaveTable 
                leaves={filteredLeaves} 
                onLeaveClick={handleLeaveClick} 
                onLeaveAction={handleLeaveAction} 
                formatDate={formatDate}
                calculateDuration={calculateDuration}
              />
            </TabsContent>
            
            <TabsContent value="rejected" className="p-0 mt-4">
              <LeaveTable 
                leaves={filteredLeaves} 
                onLeaveClick={handleLeaveClick} 
                onLeaveAction={handleLeaveAction} 
                formatDate={formatDate}
                calculateDuration={calculateDuration}
              />
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Leave Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedLeave && (
            <>
              <DialogHeader>
                <DialogTitle>Leave Request Details</DialogTitle>
                <DialogDescription>
                  Review leave request information and update status
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedLeave.employeePhoto} alt={selectedLeave.employeeName} />
                    <AvatarFallback className="bg-staffi-purple text-white">
                      {selectedLeave.employeeName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-medium text-lg">{selectedLeave.employeeName}</h3>
                    <p className="text-gray-500 text-sm">{selectedLeave.employeeRole}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Type</Label>
                    <p className="font-medium">{selectedLeave.type}</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-500">Status</Label>
                    <Badge className={
                      selectedLeave.status === 'Approved'
                        ? "bg-green-100 text-green-700 mt-1"
                        : selectedLeave.status === 'Rejected'
                          ? "bg-red-100 text-red-700 mt-1"
                          : "bg-amber-100 text-amber-700 mt-1"
                    }>
                      {selectedLeave.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-500">From</Label>
                    <p className="font-medium">{formatDate(selectedLeave.startDate)}</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-500">To</Label>
                    <p className="font-medium">{formatDate(selectedLeave.endDate)}</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-500">Duration</Label>
                    <p className="font-medium">{calculateDuration(selectedLeave.startDate, selectedLeave.endDate)} days</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-500">Request Date</Label>
                    <p className="font-medium">{formatDate(selectedLeave.requestDate)}</p>
                  </div>

                  <div className="col-span-2">
                    <Label className="text-xs text-gray-500">Project</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Briefcase className="h-4 w-4 text-staffi-purple" />
                      <p className="font-medium">{selectedLeave.project}</p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <Label className="text-xs text-gray-500">Project Deadline</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <CalendarIcon className="h-4 w-4 text-red-500" />
                      <p className="font-medium">{formatDate(selectedLeave.projectDeadline)}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <Label className="text-xs text-gray-500">Employees Covering</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedLeave.replacements.map((employee, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
                          {employee}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedLeave.status === "Pending" && (
                    <div className="col-span-2">
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex gap-2 mt-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                        <p className="text-sm text-amber-700">
                          This request requires your attention. Please approve or reject it based on project deadlines and team availability.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="col-span-2">
                    <Label className="text-xs text-gray-500">Reason</Label>
                    <p className="bg-gray-50 p-3 rounded-md mt-1 text-sm">{selectedLeave.reason}</p>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                {selectedLeave.status === 'Pending' ? (
                  <div className="flex gap-2 w-full sm:justify-end">
                    <Button 
                      variant="outline" 
                      className="flex-1 sm:flex-none" 
                      onClick={() => {
                        handleLeaveAction(selectedLeave.id, 'reject');
                        setIsDetailDialogOpen(false);
                      }}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                    <Button 
                      className="flex-1 sm:flex-none bg-staffi-purple hover:bg-staffi-purple-dark" 
                      onClick={() => {
                        handleLeaveAction(selectedLeave.id, 'approve');
                        setIsDetailDialogOpen(false);
                      }}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsDetailDialogOpen(false)}>Close</Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New Leave Request Dialog */}
      <Dialog open={isNewLeaveDialogOpen} onOpenChange={setIsNewLeaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Leave</DialogTitle>
            <DialogDescription>
              Fill out the form below to submit a new leave request.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="leave-type">Leave Type</Label>
              <select 
                id="leave-type" 
                className="w-full h-10 px-3 rounded-md border border-gray-300"
              >
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal Leave</option>
                <option value="maternity">Maternity Leave</option>
                <option value="paternity">Paternity Leave</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="start-date"
                    type="date"
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="end-date"
                    type="date"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee-covering">Employee(s) Covering</Label>
              <select 
                id="employee-covering" 
                className="w-full h-10 px-3 rounded-md border border-gray-300"
                multiple
              >
                <option value="alex">Alex Johnson</option>
                <option value="maya">Maya Patel</option>
                <option value="daniel">Daniel Kim</option>
                <option value="sophia">Sophia Rodriguez</option>
                <option value="james">James Wilson</option>
              </select>
              <p className="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple employees</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <textarea 
                id="reason" 
                className="w-full h-24 px-3 py-2 rounded-md border border-gray-300 resize-none"
                placeholder="Please provide a reason for your leave request..."
              ></textarea>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsNewLeaveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-staffi-purple hover:bg-staffi-purple-dark"
              onClick={submitNewLeaveRequest}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Component for the leave table to avoid repetition
const LeaveTable = ({ 
  leaves, 
  onLeaveClick, 
  onLeaveAction, 
  formatDate,
  calculateDuration
}) => {
  return leaves.length > 0 ? (
    <div className="rounded-md border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Employee</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden md:table-cell">Duration</TableHead>
            <TableHead className="hidden lg:table-cell">Project</TableHead>
            <TableHead className="hidden lg:table-cell">Deadline</TableHead>
            <TableHead className="hidden lg:table-cell">Covering</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaves.map((leave) => (
            <TableRow key={leave.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onLeaveClick(leave)}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={leave.employeePhoto} alt={leave.employeeName} />
                    <AvatarFallback className="bg-staffi-purple text-white">
                      {leave.employeeName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{leave.employeeName}</p>
                    <p className="text-xs text-gray-500">{leave.employeeRole}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-gray-50 font-normal">
                  {leave.type}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-col">
                  <span className="text-sm">{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</span>
                  <span className="text-xs text-gray-500">{calculateDuration(leave.startDate, leave.endDate)} days</span>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4 text-staffi-purple" />
                  <span className="text-sm">{leave.project}</span>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <span className="text-sm font-medium">{formatDate(leave.projectDeadline)}</span>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{leave.replacements.length} {leave.replacements.length === 1 ? 'person' : 'people'}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={
                  leave.status === 'Approved'
                    ? "bg-green-100 text-green-700"
                    : leave.status === 'Rejected'
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                }>
                  {leave.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {leave.status === 'Pending' ? (
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLeaveAction(leave.id, 'reject');
                      }}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Reject</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLeaveAction(leave.id, 'approve');
                      }}
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Approve</span>
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLeaveClick(leave);
                    }}
                  >
                    Details
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-gray-100 p-3">
        <FileText className="h-6 w-6 text-gray-500" />
      </div>
      <h3 className="mt-4 text-lg font-medium">No leave requests</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-sm">
        There are no leave requests matching your current filters.
      </p>
    </div>
  );
};

export default LeaveManagement;
