import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronDown, 
  Mail, 
  Phone, 
  Calendar,
  Building,
  DollarSign,
  FileText,
  TrendingUp,
  UserPlus
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

// Interface for employee data
interface Employee {
  id: number;
  name: string;
  photo: string;
  jobTitle: string;
  department: string;
  site: string;
  salary: string;
  project: string;
  impactScore: number;
  status: 'Active' | 'On Leave' | 'Inactive';
  startDate: string;
  lifecycle: string;
  email: string;
  phone: string;
}

// Mock data for employees
const initialEmployees: Employee[] = [
  {
    id: 1,
    name: 'Alex Johnson',
    photo: 'https://github.com/shadcn.png',
    jobTitle: 'Senior Developer',
    department: 'Engineering',
    site: 'Remote',
    salary: '$120,000',
    project: 'Core Platform',
    impactScore: 87,
    status: 'Active',
    startDate: '2022-05-15',
    lifecycle: 'Employed',
    email: 'alex.johnson@staffi.com',
    phone: '+1 (555) 123-4567'
  },
  {
    id: 2,
    name: 'Maya Patel',
    photo: 'https://github.com/shadcn.png',
    jobTitle: 'UI/UX Designer',
    department: 'Design',
    site: 'New York Office',
    salary: '$95,000',
    project: 'Mobile App Redesign',
    impactScore: 82,
    status: 'Active',
    startDate: '2023-02-10',
    lifecycle: 'Employed',
    email: 'maya.patel@staffi.com',
    phone: '+1 (555) 234-5678'
  },
  {
    id: 3,
    name: 'Daniel Kim',
    photo: 'https://github.com/shadcn.png',
    jobTitle: 'Product Manager',
    department: 'Product',
    site: 'San Francisco Office',
    salary: '$135,000',
    project: 'Q3 Product Launch',
    impactScore: 91,
    status: 'On Leave',
    startDate: '2021-09-05',
    lifecycle: 'Employed',
    email: 'daniel.kim@staffi.com',
    phone: '+1 (555) 345-6789'
  },
  {
    id: 4,
    name: 'Sophia Rodriguez',
    photo: 'https://github.com/shadcn.png',
    jobTitle: 'Marketing Specialist',
    department: 'Marketing',
    site: 'Chicago Office',
    salary: '$85,000',
    project: 'Brand Campaign',
    impactScore: 78,
    status: 'Active',
    startDate: '2023-04-20',
    lifecycle: 'Employed',
    email: 'sophia.rodriguez@staffi.com',
    phone: '+1 (555) 456-7890'
  },
  {
    id: 5,
    name: 'James Wilson',
    photo: 'https://github.com/shadcn.png',
    jobTitle: 'Data Analyst',
    department: 'Analytics',
    site: 'Remote',
    salary: '$92,000',
    project: 'Metrics Dashboard',
    impactScore: 84,
    status: 'Active',
    startDate: '2022-11-15',
    lifecycle: 'Employed',
    email: 'james.wilson@staffi.com',
    phone: '+1 (555) 567-8901'
  },
  {
    id: 6,
    name: 'Emma Thompson',
    photo: 'https://github.com/shadcn.png',
    jobTitle: 'HR Coordinator',
    department: 'Human Resources',
    site: 'London Office',
    salary: '$78,000',
    project: 'Employee Onboarding',
    impactScore: 76,
    status: 'Active',
    startDate: '2023-01-10',
    lifecycle: 'Employed',
    email: 'emma.thompson@staffi.com',
    phone: '+44 (20) 1234-5678'
  }
];

const EmployeeManagement = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const { toast: uiToast } = useToast();
  
  // Form state for adding new employee
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: '',
    jobTitle: '',
    department: '',
    site: '',
    salary: '',
    project: '',
    email: '',
    phone: '',
    status: 'Active',
    lifecycle: 'Employed',
  });

  const filteredEmployees = searchQuery 
    ? employees.filter(emp => 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : employees;
  
  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleAddEmployee = () => {
    setIsAddEmployeeOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewEmployee = () => {
    // Form validation
    if (!newEmployee.name || !newEmployee.jobTitle || !newEmployee.email) {
      uiToast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const newId = Math.max(...employees.map(e => e.id)) + 1;
    
    const createdEmployee: Employee = {
      id: newId,
      name: newEmployee.name || '',
      photo: 'https://github.com/shadcn.png',
      jobTitle: newEmployee.jobTitle || '',
      department: newEmployee.department || '',
      site: newEmployee.site || '',
      salary: newEmployee.salary || '',
      project: newEmployee.project || '',
      impactScore: 75,
      status: newEmployee.status as 'Active' | 'On Leave' | 'Inactive',
      startDate: today,
      lifecycle: newEmployee.lifecycle || 'Employed',
      email: newEmployee.email || '',
      phone: newEmployee.phone || '',
    };

    setEmployees(prev => [...prev, createdEmployee]);
    
    // Reset form
    setNewEmployee({
      name: '',
      jobTitle: '',
      department: '',
      site: '',
      salary: '',
      project: '',
      email: '',
      phone: '',
      status: 'Active',
      lifecycle: 'Employed',
    });
    
    setIsAddEmployeeOpen(false);
    
    toast.success(`${createdEmployee.name} has been added successfully!`, {
      className: "bg-white text-gray-900"
    });
  };

  const handleFilterClick = () => {
    toast.info("Filter options applied successfully", {
      className: "bg-white text-gray-900"
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
        
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search employees..."
              className="pl-9 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleFilterClick}
          >
            <Filter className="h-4 w-4" />
            Filter
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          <Button 
            className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2"
            onClick={handleAddEmployee}
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>
      
      {/* Employee Card Grid - Vertical glassmorphism cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredEmployees.map(employee => (
          <div 
            key={employee.id}
            className="group cursor-pointer"
            onClick={() => handleEmployeeClick(employee)}
          >
            <div className="relative h-full transition-all duration-300 transform group-hover:-translate-y-2">
              {/* Glass Card Effect - Made taller */}
              <div className="absolute inset-0 rounded-2xl bg-white/30 backdrop-blur-lg border border-white/30 shadow-xl overflow-hidden group-hover:shadow-staffi-purple/20 min-h-[420px]">
                {/* Background gradient decoration */}
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-staffi-purple/20 to-staffi-blue/20 rounded-full blur-xl opacity-70"></div>
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-staffi-blue/10 to-staffi-purple/10 rounded-full blur-xl opacity-50"></div>
              </div>
              
              {/* Card Content */}
              <div className="relative h-full flex flex-col p-5 z-10 min-h-[420px]">
                {/* Status badge */}
                <div className="absolute top-4 right-4">
                  <Badge className={
                    employee.status === 'Active' 
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : employee.status === 'On Leave'
                      ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }>
                    {employee.status}
                  </Badge>
                </div>
                
                {/* Avatar and basic info */}
                <div className="flex flex-col items-center pb-4 border-b border-gray-100">
                  <Avatar className="h-24 w-24 mb-4 ring-2 ring-white shadow-lg">
                    <AvatarImage src={employee.photo} alt={employee.name} />
                    <AvatarFallback className="bg-staffi-purple text-white text-xl">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="font-semibold text-lg text-center">{employee.name}</h3>
                  <p className="text-gray-500 text-sm text-center mb-2">{employee.jobTitle}</p>
                </div>
                
                {/* Details - Added more padding for longer card */}
                <div className="mt-6 space-y-3 text-sm flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Department:</span>
                    <span className="font-medium">{employee.department}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">{employee.site}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Impact Score:</span>
                    <span className="font-medium flex items-center">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full mr-2">
                        <div 
                          className="h-full bg-staffi-purple rounded-full" 
                          style={{ width: `${employee.impactScore}%` }}
                        ></div>
                      </div>
                      {employee.impactScore}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Project:</span>
                    <span className="font-medium">{employee.project}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Start Date:</span>
                    <span className="font-medium">{new Date(employee.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {/* View details button - moved below details, always visible on hover */}
                <div className="mt-6 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg shadow-lg hover:bg-gray-800 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-gray-100 p-3">
            <UserPlus className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No employees found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          <Button 
            className="mt-4 bg-staffi-purple hover:bg-staffi-purple-dark"
            onClick={handleAddEmployee}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add New Employee
          </Button>
        </div>
      )}
      
      {/* Employee Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl animate-scale-in">
          {selectedEmployee && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Employee Profile</DialogTitle>
                <DialogDescription>View and manage employee details</DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="md:col-span-1 flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={selectedEmployee.photo} alt={selectedEmployee.name} />
                    <AvatarFallback className="bg-staffi-purple text-white text-4xl">
                      {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-bold mt-4">{selectedEmployee.name}</h2>
                  <p className="text-gray-500">{selectedEmployee.jobTitle}</p>
                  
                  <div className="flex items-center gap-4 mt-6">
                    <Button size="sm" variant="outline" className="rounded-full flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                    <Button size="sm" variant="outline" className="rounded-full flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <Tabs defaultValue="info">
                    <TabsList className="mb-4">
                      <TabsTrigger value="info">Information</TabsTrigger>
                      <TabsTrigger value="projects">Projects</TabsTrigger>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="info">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Department</p>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <p>{selectedEmployee.department}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Site</p>
                          <p>{selectedEmployee.site}</p>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Salary</p>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <p>{selectedEmployee.salary}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Status</p>
                          <Badge className={
                            selectedEmployee.status === 'Active' 
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : selectedEmployee.status === 'On Leave'
                              ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }>
                            {selectedEmployee.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Start Date</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <p>{new Date(selectedEmployee.startDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Lifecycle</p>
                          <p>{selectedEmployee.lifecycle}</p>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-staffi-blue">{selectedEmployee.email}</p>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Phone</p>
                          <p>{selectedEmployee.phone}</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="projects">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-md bg-staffi-purple bg-opacity-10">
                            <FileText className="h-5 w-5 text-staffi-purple" />
                          </div>
                          <div>
                            <h4 className="font-medium">{selectedEmployee.project}</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Currently assigned to this project with high priority.
                            </p>
                            <div className="mt-3">
                              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                In Progress
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="performance">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Impact Score</span>
                            <span className="font-bold">{selectedEmployee.impactScore}/100</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-staffi-purple h-2.5 rounded-full" 
                              style={{ width: `${selectedEmployee.impactScore}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Based on project contribution, code quality, and team collaboration.
                          </p>
                        </div>
                        
                        <div className="p-4 border rounded-lg flex items-start gap-3">
                          <div className="p-2 rounded-md bg-green-100">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Performance Trend</h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Consistently improving over the last 3 months.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <DialogFooter className="flex justify-between items-center gap-2 sm:gap-0 mt-6">
                <Button 
                  variant="outline" 
                  className="bg-white hover:bg-gray-50"
                  onClick={() => {
                    setIsDialogOpen(false);
                  }}
                >
                  Close
                </Button>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      setEmployees(prev => prev.filter(emp => emp.id !== selectedEmployee.id));
                      setIsDialogOpen(false);
                      toast.error(`${selectedEmployee.name} has been removed from the system.`, {
                        className: "bg-white text-gray-900"
                      });
                    }}
                  >
                    Delete Employee
                  </Button>
                  <Button 
                    className="bg-staffi-purple hover:bg-staffi-purple-dark"
                    onClick={() => {
                      setIsDialogOpen(false);
                      toast.success(`${selectedEmployee.name}'s profile has been updated.`, {
                        className: "bg-white text-gray-900"
                      });
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Employee Dialog */}
      <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New Employee</DialogTitle>
            <DialogDescription>Enter employee information to create a new profile</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={newEmployee.name}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-sm font-medium">Job Title *</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                placeholder="Senior Developer"
                value={newEmployee.jobTitle}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@staffi.com"
                value={newEmployee.email}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+1 (555) 123-4567"
                value={newEmployee.phone}
                onChange={handleFormChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium">Department</Label>
              <Input
                id="department"
                name="department"
                placeholder="Engineering"
                value={newEmployee.department}
                onChange={handleFormChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site" className="text-sm font-medium">Work Location</Label>
              <Input
                id="site"
                name="site"
                placeholder="Remote / Office Location"
                value={newEmployee.site}
                onChange={handleFormChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary" className="text-sm font-medium">Salary</Label>
              <Input
                id="salary"
                name="salary"
                placeholder="$100,000"
                value={newEmployee.salary}
                onChange={handleFormChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project" className="text-sm font-medium">Current Project</Label>
              <Input
                id="project"
                name="project"
                placeholder="Project Name"
                value={newEmployee.project}
                onChange={handleFormChange}
              />
            </div>

            <div className="md:col-span-2 flex justify-center mt-4">
              <div className="bg-gray-50 p-4 rounded-lg w-full max-w-md text-center">
                <Avatar className="h-20 w-20 mx-auto">
                  <AvatarFallback className="bg-staffi-purple text-white text-xl">
                    {newEmployee.name ? newEmployee.name.split(' ').map(n => n && n[0]).join('') : 'New'}
                  </AvatarFallback>
                </Avatar>
                <p className="mt-2 text-sm text-gray-500">
                  Photo upload will be available after employee creation
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddEmployeeOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-staffi-purple hover:bg-staffi-purple-dark"
              onClick={handleSubmitNewEmployee}
            >
              Create Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;
