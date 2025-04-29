import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Calendar as CalendarIcon, Clock, FileText } from "lucide-react";
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { GlassPanel } from "@/components/dashboard/glass-panel";
import { toast } from 'sonner';

// Define types
interface LeaveRequest {
  id: number;
  type: string;
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: Date;
}

const LeaveRequests = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      type: 'Annual Leave',
      startDate: new Date(2025, 4, 15),
      endDate: new Date(2025, 4, 20),
      days: 6,
      reason: 'Family vacation',
      status: 'approved',
      submittedDate: new Date(2025, 3, 20)
    },
    {
      id: 2,
      type: 'Sick Leave',
      startDate: new Date(2025, 5, 3),
      endDate: new Date(2025, 5, 4),
      days: 2,
      reason: 'Doctor appointment',
      status: 'pending',
      submittedDate: new Date(2025, 5, 1)
    }
  ]);

  // New leave request modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewRequest, setViewRequest] = useState<LeaveRequest | null>(null);
  const [newRequest, setNewRequest] = useState({
    type: 'Annual Leave',
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    reason: ''
  });

  // Stats
  const leaveStats = {
    annual: { used: 12, total: 25 },
    sick: { used: 3, total: 14 },
    personal: { used: 1, total: 5 }
  };

  const calculateDays = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmitRequest = () => {
    const days = calculateDays(newRequest.startDate, newRequest.endDate);
    
    const newLeaveRequest: LeaveRequest = {
      id: Math.max(0, ...requests.map(r => r.id)) + 1,
      type: newRequest.type,
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      days,
      reason: newRequest.reason,
      status: 'pending',
      submittedDate: new Date()
    };
    
    setRequests([...requests, newLeaveRequest]);
    setIsDialogOpen(false);
    toast.success('Leave request submitted successfully!');
    
    // Reset the form
    setNewRequest({
      type: 'Annual Leave',
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      reason: ''
    });
  };

  // View leave request details
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleViewRequest = (request: LeaveRequest) => {
    setViewRequest(request);
    setIsViewDialogOpen(true);
  };

  // Handle date changes
  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setNewRequest({ ...newRequest, startDate: date });
      
      // If end date is before new start date, update end date to start date
      if (newRequest.endDate < date) {
        setNewRequest({ ...newRequest, startDate: date, endDate: date });
      }
    }
  };
  
  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      // Only update if end date is not before start date
      if (date >= newRequest.startDate) {
        setNewRequest({ ...newRequest, endDate: date });
      } else {
        toast.error("End date cannot be before start date");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Leave stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassPanel className="p-5 h-full" variant="light">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Annual Leave</h3>
              <Badge variant="outline" className="bg-staffi-purple/10 text-staffi-purple border-staffi-purple/20">
                {leaveStats.annual.used} / {leaveStats.annual.total}
              </Badge>
            </div>
            <div className="bg-gray-100 h-2 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-staffi-purple h-full rounded-full" 
                style={{ width: `${(leaveStats.annual.used / leaveStats.annual.total) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {leaveStats.annual.total - leaveStats.annual.used} days remaining
            </p>
          </div>
        </GlassPanel>
        
        <GlassPanel className="p-5 h-full" variant="light">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Sick Leave</h3>
              <Badge variant="outline" className="bg-staffi-blue/10 text-staffi-blue border-staffi-blue/20">
                {leaveStats.sick.used} / {leaveStats.sick.total}
              </Badge>
            </div>
            <div className="bg-gray-100 h-2 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-staffi-blue h-full rounded-full" 
                style={{ width: `${(leaveStats.sick.used / leaveStats.sick.total) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {leaveStats.sick.total - leaveStats.sick.used} days remaining
            </p>
          </div>
        </GlassPanel>
        
        <GlassPanel className="p-5 h-full" variant="light">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Personal Leave</h3>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                {leaveStats.personal.used} / {leaveStats.personal.total}
              </Badge>
            </div>
            <div className="bg-gray-100 h-2 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-amber-500 h-full rounded-full" 
                style={{ width: `${(leaveStats.personal.used / leaveStats.personal.total) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {leaveStats.personal.total - leaveStats.personal.used} days remaining
            </p>
          </div>
        </GlassPanel>
      </div>
      
      {/* Leave requests section */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle>Leave Requests</CardTitle>
          <Button 
            onClick={() => setIsDialogOpen(true)} 
            size="sm"
            className="bg-staffi-purple hover:bg-staffi-purple/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leave Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>
                    {format(request.startDate, 'MMM dd')} - {format(request.endDate, 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>{request.days}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      request.status === 'approved' && "bg-green-100 text-green-800",
                      request.status === 'pending' && "bg-blue-100 text-blue-800",
                      request.status === 'rejected' && "bg-red-100 text-red-800",
                    )}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewRequest(request)}
                      className="flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No leave requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Submit leave request dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Submit Leave Request</DialogTitle>
            <DialogDescription>
              Fill out the form below to request time off
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select 
                value={newRequest.type} 
                onValueChange={(value) => setNewRequest({...newRequest, type: value})}
              >
                <SelectTrigger id="leaveType">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                  <SelectItem value="Unpaid Leave">Unpaid Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newRequest.startDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newRequest.startDate}
                      onSelect={handleStartDateChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newRequest.endDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newRequest.endDate}
                      onSelect={handleEndDateChange}
                      disabled={(date) => date < newRequest.startDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{calculateDays(newRequest.startDate, newRequest.endDate)} day(s) requested</span>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Leave</Label>
              <Textarea 
                id="reason" 
                placeholder="Briefly describe the reason for your leave request"
                value={newRequest.reason}
                onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitRequest}
              disabled={!newRequest.reason.trim()}
              className="bg-staffi-purple hover:bg-staffi-purple/90"
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View leave request details dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
          </DialogHeader>
          
          {viewRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-500">Leave Type</p>
                  <p>{viewRequest.type}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Status</p>
                  <Badge className={cn(
                    viewRequest.status === 'approved' && "bg-green-100 text-green-800",
                    viewRequest.status === 'pending' && "bg-blue-100 text-blue-800",
                    viewRequest.status === 'rejected' && "bg-red-100 text-red-800",
                  )}>
                    {viewRequest.status.charAt(0).toUpperCase() + viewRequest.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Start Date</p>
                  <p>{format(viewRequest.startDate, 'PPP')}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">End Date</p>
                  <p>{format(viewRequest.endDate, 'PPP')}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Days Requested</p>
                  <p>{viewRequest.days}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Submitted On</p>
                  <p>{format(viewRequest.submittedDate, 'PPP')}</p>
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-500">Reason</p>
                <p className="border rounded-md p-3 bg-gray-50 mt-1">{viewRequest.reason}</p>
              </div>
              
              {viewRequest.status === 'pending' && (
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setRequests(prevRequests => 
                        prevRequests.filter(r => r.id !== viewRequest.id)
                      );
                      setIsViewDialogOpen(false);
                      toast.success('Leave request cancelled');
                    }}
                  >
                    Cancel Request
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveRequests;