
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlassPanel } from "@/components/dashboard/glass-panel";
import ScheduleCard from "@/components/dashboard/schedule-card";
import AttendanceReportCard from "@/components/dashboard/attendance-report-card";
import KeyMetricsSection from "@/components/dashboard/key-metrics-section";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  FilePlus, Bell, MoreVertical, 
  ChevronDown, ChevronUp, FileCheck, 
  Clock, Calendar as CalendarIcon, 
  CheckCircle2, AlertCircle, Users,
  Briefcase, CreditCard, Search,
  Mail, MessageSquare, Smartphone,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  TooltipProps as RechartsTooltipProps,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';

const hiringScoreData = [
  { month: 'Jan', candidates: 48, hired: 12 },
  { month: 'Feb', candidates: 60, hired: 15 },
  { month: 'Mar', candidates: 45, hired: 10 },
  { month: 'Apr', candidates: 70, hired: 18 },
  { month: 'May', candidates: 55, hired: 13 },
  { month: 'Jun', candidates: 63, hired: 17 },
  { month: 'Jul', candidates: 52, hired: 14 }
];

const pendingLeaveRequests = [
  { 
    employee: "Alex Johnson", 
    role: "Senior Developer", 
    from: "May 5, 2025", 
    to: "May 12, 2025", 
    days: 5, 
    reason: "Vacation", 
    status: "Pending",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  { 
    employee: "Maya Patel", 
    role: "UI/UX Designer", 
    from: "Apr 28, 2025", 
    to: "May 2, 2025", 
    days: 5, 
    reason: "Personal", 
    status: "Pending",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

const ongoingProjects = [
  {
    name: "Website Redesign",
    progress: 75,
    deadline: "Jun 15, 2025",
    team: ["AJ", "MP", "SK"],
    status: "Active"
  },
  {
    name: "Mobile App Development",
    progress: 45,
    deadline: "Aug 30, 2025",
    team: ["DK", "EJ", "RB"],
    status: "Active"
  },
  {
    name: "Data Migration",
    progress: 90,
    deadline: "May 5, 2025",
    team: ["AJ", "MC", "TW"],
    status: "Active"
  }
];

const teamMembers = [
  { 
    name: 'Alex Johnson', 
    email: 'alexj@staffi.com',
    role: 'Senior Developer', 
    employment: '1 year 6 months 15 days', 
    productivity: 'High',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  { 
    name: 'Maya Patel', 
    email: 'mayap@staffi.com',
    role: 'UI/UX Designer', 
    employment: '8 months 30 days', 
    productivity: 'Medium',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  { 
    name: 'Daniel Kim', 
    email: 'danielk@staffi.com',
    role: 'Product Manager', 
    employment: '2 years 3 months', 
    productivity: 'High',
    status: 'On Leave',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<any>;
  label?: string;
}

const DashboardOverview = () => {
  const [expandedTeamMember, setExpandedTeamMember] = useState<typeof teamMembers[0] | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({ title: '', content: '' });
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  const handleNewJobPost = () => {
    setDialogContent({
      title: 'Create New Job Post',
      content: 'This will guide you through creating a new job posting for your organization.'
    });
    setShowDialog(true);
  };

  const handleMemberClick = (member: typeof teamMembers[0]) => {
    setExpandedTeamMember(expandedTeamMember === member ? null : member);
  };

  const handleNotification = () => {
    toast({
      title: "Notifications",
      description: "You have 3 unread notifications",
    });
  };

  const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 p-2 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <p className="text-gray-500 text-sm">{greeting},</p>
          <h1 className="text-3xl font-bold text-gray-900">Sarah Williams</h1>
        </div>

        <div className="flex mt-4 md:mt-0 items-center gap-3">
          <button 
            className="bg-gray-900 text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-gray-800 transition-all transform hover:scale-105"
            onClick={handleNewJobPost}
          >
            <FilePlus className="h-4 w-4" />
            <span>New Job Post</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Section */}
      <KeyMetricsSection />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Schedule Card */}
        <div className="lg:col-span-4">
          <ScheduleCard className="h-[540px]" />
        </div>

        <div className="lg:col-span-5 grid grid-cols-1 gap-6">
          {/* Pending Leave Requests Card */}
          <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Pending Leave Requests</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => {
                    toast({
                      title: "View All",
                      description: "Navigating to leaves management",
                    });
                  }}
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">View All</span>
                </Button>
              </div>
              <CardDescription>Requires your approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingLeaveRequests.map((request, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={request.avatar} alt={request.employee} />
                        <AvatarFallback>{request.employee.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{request.employee}</p>
                        <p className="text-xs text-gray-500">{request.from} - {request.to}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs"
                        onClick={() => {
                          toast({
                            title: "Rejected",
                            description: `You have rejected ${request.employee}'s leave request`,
                            variant: "destructive"
                          });
                        }}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8 px-3 text-xs bg-staffi-purple hover:bg-staffi-purple-dark"
                        onClick={() => {
                          toast({
                            title: "Approved",
                            description: `You have approved ${request.employee}'s leave request`,
                          });
                        }}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="ghost"
                  className="w-full text-staffi-purple hover:text-staffi-purple-dark hover:bg-staffi-purple-light/50 text-sm"
                  onClick={() => {
                    toast({
                      title: "View All",
                      description: "Navigating to leaves management",
                    });
                  }}
                >
                  View all requests
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Payroll */}
          <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Upcoming Payroll</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => {
                    toast({
                      title: "Process Payroll",
                      description: "Navigate to payroll processing",
                    });
                  }}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Next run: April 30, 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 120 120">
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="54" 
                      fill="none" 
                      stroke="#E5E7EB" 
                      strokeWidth="12"
                    />
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="54" 
                      fill="none" 
                      stroke="#8B5CF6" 
                      strokeWidth="12"
                      strokeDasharray="339.3"
                      strokeDashoffset="84.8" /* 75% complete */
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold">5d</span>
                  </div>
                </div>
                
                <div className="space-y-3 flex-1 ml-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Amount</span>
                    <span className="font-semibold">$258,942.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax Withholdings</span>
                    <span className="font-semibold">$62,145.08</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Net Payroll</span>
                    <span className="font-semibold">$196,796.92</span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full mt-4 bg-staffi-purple hover:bg-staffi-purple-dark text-white"
                onClick={() => {
                  toast({
                    title: "Payroll Preview",
                    description: "Previewing payroll calculations",
                  });
                }}
              >
                Preview Payroll Run
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 gap-6">
          {/* Project Status */}
          <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Project Status</CardTitle>
              <CardDescription>Active projects overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ongoingProjects.map((project, i) => (
                  <div key={i} className="flex flex-col p-3 border border-gray-100 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{project.name}</p>
                        <p className="text-xs text-gray-500">Deadline: {project.deadline}</p>
                      </div>
                      <Badge className="bg-staffi-purple text-white hover:bg-staffi-purple-dark text-xs">
                        {project.status}
                      </Badge>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-staffi-purple h-1.5 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-medium">{project.progress}% Complete</span>
                      <div className="flex -space-x-2">
                        {project.team.map((member, j) => (
                          <Avatar key={j} className="h-6 w-6 border-2 border-white">
                            <AvatarFallback className="bg-staffi-purple text-white text-xs">{member}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="ghost"
                  className="w-full text-staffi-purple hover:text-staffi-purple-dark hover:bg-staffi-purple-light/50 text-sm"
                  onClick={() => {
                    toast({
                      title: "View Projects",
                      description: "Navigating to project management",
                    });
                  }}
                >
                  View all projects
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Report Card */}
          <AttendanceReportCard />
        </div>
      </div>

      {/* Hiring Score with Line Chart */}
      <Card className="border-0 shadow-md mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Hiring Statistics</CardTitle>
            <Tabs defaultValue="candidates">
              <TabsList className="grid grid-cols-2 w-[200px]">
                <TabsTrigger value="candidates">Candidates</TabsTrigger>
                <TabsTrigger value="hired">Hired</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>Track recruitment metrics over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={hiringScoreData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => value.toString()}
                />
                <RechartsTooltip 
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#8B5CF6', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Legend verticalAlign="top" align="right" />
                <Line 
                  type="monotone" 
                  dataKey="candidates" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 0, fill: '#8B5CF6' }}
                  activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                  name="Candidates"
                />
                <Line 
                  type="monotone" 
                  dataKey="hired" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 0, fill: '#F59E0B' }}
                  activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
                  name="Hired"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Team Management */}
      <Card className="mb-6 overflow-hidden border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Team Management</CardTitle>
            <CardDescription>Manage your team members and their performance</CardDescription>
          </div>
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search members..."
              className="pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-staffi-purple"
            />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Length of employment</TableHead>
                <TableHead>Productivity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member, index) => (
                <React.Fragment key={index}>
                  <TableRow 
                    className="cursor-pointer hover:bg-gray-50" 
                    onClick={() => handleMemberClick(member)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-staffi-purple text-white">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.employment}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        member.productivity === 'High' 
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-blue-100 text-blue-700 border-blue-200"
                      )}>
                        {member.productivity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        member.status === 'Active' 
                          ? "text-green-600" 
                          : "text-amber-600"
                      )}>
                        {member.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        {expandedTeamMember === member ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {expandedTeamMember === member && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <h4 className="font-medium text-sm">Contact Information</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Email: {member.email}<br />
                                Phone: +1 (555) 123-4567
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">Current Projects</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Website Redesign<br />
                                Mobile App Development
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">Performance</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Impact Score: 82/100<br />
                                Tasks Completed: 24 this month
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast({
                                  title: "View Profile",
                                  description: `Opening ${member.name}'s full profile`,
                                });
                              }}
                            >
                              View Full Profile
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <Button 
            variant="outline"
            className="text-staffi-purple border-staffi-purple hover:bg-staffi-purple-light/20"
            onClick={() => {
              toast({
                title: "Team Management",
                description: "Navigating to full team management page",
              });
            }}
          >
            View All Team Members
          </Button>
        </CardFooter>
      </Card>

      {/* Dialog for various actions */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogContent.title}</DialogTitle>
            <DialogDescription>
              {dialogContent.content}
            </DialogDescription>
          </DialogHeader>
          
          {dialogContent.title === 'Create New Job Post' && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="job-title" className="text-right text-sm font-medium">
                  Job Title
                </label>
                <input
                  id="job-title"
                  className="col-span-3 h-10 rounded-md border border-gray-300 px-3"
                  placeholder="e.g. Senior Developer"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="department" className="text-right text-sm font-medium">
                  Department
                </label>
                <input
                  id="department"
                  className="col-span-3 h-10 rounded-md border border-gray-300 px-3"
                  placeholder="e.g. Engineering"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <label htmlFor="description" className="text-right text-sm font-medium pt-2">
                  Description
                </label>
                <textarea
                  id="description"
                  className="col-span-3 h-20 rounded-md border border-gray-300 p-3"
                  placeholder="Job description..."
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={() => {
                setShowDialog(false);
                toast({
                  title: "Success",
                  description: dialogContent.title === 'Create New Job Post' 
                    ? "Job post created successfully!"
                    : "Action completed successfully!",
                });
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardOverview;
