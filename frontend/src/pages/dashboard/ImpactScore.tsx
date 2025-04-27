
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Activity, 
  TrendingUp, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight, 
  Star,
  Clock,
  X,
  Check,
  Users,
  Filter,
  Download,
  Zap,
  BarChart4
} from 'lucide-react';
import { cn } from '@/lib/utils';
import StaffiButton from '@/components/ui/staffi-button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { toast } from "@/hooks/use-toast";

// Mock data for different time periods
const getTimeRangeData = (range) => {
  const baseScore = 85;
  const variations = {
    week: { base: -5, trend: Array.from({length: 7}, (_, i) => ({ day: `Day ${i+1}`, score: baseScore + Math.floor(Math.random() * 10) - 5 })) },
    month: { base: 0, trend: Array.from({length: 30}, (_, i) => ({ day: `Day ${i+1}`, score: baseScore + Math.floor(Math.random() * 15) - 7 })) },
    quarter: { base: 5, trend: Array.from({length: 90}, (_, i) => ({ day: `Day ${i+1}`, score: baseScore + Math.floor(Math.random() * 20) - 10 })) },
    year: { base: 10, trend: Array.from({length: 12}, (_, i) => ({ month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i], score: baseScore + Math.floor(Math.random() * 25) - 12 })) }
  };
  return variations[range];
};

const ImpactScore = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [activeTab, setActiveTab] = useState('individuals');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    department: 'all',
    scoreRange: 'all',
    sortBy: 'score'
  });

  // Sample employee impact score data - MOVED UP before it's used
  const employeeScores = [
    {
      id: 1,
      name: "Sarah Williams",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      position: "HR Manager",
      department: "Human Resources",
      impactScore: 92,
      change: 4,
      productivity: 94,
      teamwork: 90,
      innovation: 85,
      satisfaction: 95
    },
    {
      id: 2,
      name: "John Smith",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      position: "Software Engineer",
      department: "Engineering",
      impactScore: 88,
      change: 2,
      productivity: 91,
      teamwork: 83,
      innovation: 92,
      satisfaction: 86
    },
    {
      id: 3,
      name: "Emily Johnson",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      position: "UI/UX Designer",
      department: "Design",
      impactScore: 86,
      change: -1,
      productivity: 82,
      teamwork: 88,
      innovation: 95,
      satisfaction: 84
    },
    {
      id: 4,
      name: "Michael Brown",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      position: "Product Manager",
      department: "Product",
      impactScore: 90,
      change: 3,
      productivity: 88,
      teamwork: 92,
      innovation: 86,
      satisfaction: 90
    },
    {
      id: 5,
      name: "Jessica Davis",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      position: "Marketing Specialist",
      department: "Marketing",
      impactScore: 82,
      change: 5,
      productivity: 80,
      teamwork: 85,
      innovation: 78,
      satisfaction: 88
    },
  ];
  
  // Sample department impact scores
  const departmentScores = [
    { name: "Engineering", impactScore: 87, change: 3, employees: 15 },
    { name: "Design", impactScore: 85, change: 2, employees: 8 },
    { name: "Marketing", impactScore: 82, change: 4, employees: 6 },
    { name: "Human Resources", impactScore: 89, change: 5, employees: 4 },
    { name: "Product", impactScore: 84, change: -1, employees: 7 },
    { name: "Sales", impactScore: 80, change: 2, employees: 10 }
  ];

  // Update trend data based on time range
  const trendData = timeRange === 'year' ? 
    getTimeRangeData(timeRange).trend :
    getTimeRangeData(timeRange).trend.map(item => ({
      month: item.day,
      score: item.score
    }));

  // Employee details dialog
  const EmployeeDetailsDialog = ({ employee, open, onClose }) => {
    if (!employee) return null;
    
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Impact Details</DialogTitle>
            <DialogDescription>Comprehensive performance metrics for {employee.name}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh] px-4">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <img src={employee.avatar} alt={employee.name} className="w-20 h-20 rounded-full" />
                <div>
                  <h3 className="text-xl font-semibold">{employee.name}</h3>
                  <p className="text-gray-500">{employee.position}</p>
                  <p className="text-gray-500">{employee.department}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries({
                  'Impact Score': employee.impactScore,
                  'Productivity': employee.productivity,
                  'Teamwork': employee.teamwork,
                  'Innovation': employee.innovation,
                  'Satisfaction': employee.satisfaction
                }).map(([key, value]) => (
                  <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">{key}</p>
                    <p className="text-2xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Performance Highlights</h4>
                <div className="grid gap-3">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-medium text-green-700">Strengths</h5>
                    <ul className="mt-2 space-y-1 text-sm text-green-600">
                      <li>Exceptional team collaboration</li>
                      <li>High project completion rate</li>
                      <li>Strong leadership qualities</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h5 className="font-medium text-amber-700">Areas for Growth</h5>
                    <ul className="mt-2 space-y-1 text-sm text-amber-600">
                      <li>Time management in complex projects</li>
                      <li>Cross-team communication</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Recent Achievements</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 p-1 bg-staffi-purple/10 rounded">
                      <Award className="h-4 w-4 text-staffi-purple" />
                    </div>
                    <div>
                      <p className="font-medium">Project Excellence Award</p>
                      <p className="text-sm text-gray-500">Awarded for exceptional leadership in Q2 2024</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  };

  // Department details sheet
  const DepartmentDetailsSheet = ({ department, open, onClose }) => {
    if (!department) return null;

    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-[90vw] sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>{department.name} Department Impact Analysis</SheetTitle>
            <SheetDescription>Detailed performance metrics and insights</SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Impact Score</p>
                  <p className="text-2xl font-semibold">{department.impactScore}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Team Size</p>
                  <p className="text-2xl font-semibold">{department.employees}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Change</p>
                  <div className="flex items-center">
                    {department.change > 0 ? (
                      <ArrowUpRight className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingUp className="h-5 w-5 rotate-180 text-red-500" />
                    )}
                    <span className="text-2xl font-semibold ml-1">
                      {Math.abs(department.change)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Department Metrics</h4>
                <div className="grid gap-4">
                  {['Productivity', 'Collaboration', 'Innovation', 'Employee Satisfaction'].map((metric) => (
                    <div key={metric} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{metric}</span>
                        <span className="text-staffi-purple font-semibold">
                          {75 + Math.floor(Math.random() * 20)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-staffi-purple rounded-full transition-all duration-500"
                          style={{ width: `${75 + Math.floor(Math.random() * 20)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Key Projects</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Digital Transformation', status: 'In Progress', completion: 75 },
                    { name: 'Team Expansion', status: 'Completed', completion: 100 },
                    { name: 'Process Optimization', status: 'Planning', completion: 25 }
                  ].map((project) => (
                    <div key={project.name} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{project.name}</h5>
                          <p className="text-sm text-gray-500">{project.status}</p>
                        </div>
                        <span className="text-sm font-medium text-staffi-purple">
                          {project.completion}%
                        </span>
                      </div>
                      <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-staffi-purple rounded-full transition-all duration-500"
                          style={{ width: `${project.completion}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  };

  // Filter dialog component
  const FilterDialog = ({ open, onClose }) => (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Impact Scores</DialogTitle>
          <DialogDescription>Customize your view of impact scores</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">Human Resources</option>
              <option value="Product">Product</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Score Range</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={filters.scoreRange}
              onChange={(e) => setFilters(prev => ({ ...prev, scoreRange: e.target.value }))}
            >
              <option value="all">All Scores</option>
              <option value="90-100">90-100 (Exceptional)</option>
              <option value="80-89">80-89 (Excellent)</option>
              <option value="70-79">70-79 (Good)</option>
              <option value="below-70">Below 70 (Needs Improvement)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <select 
              className="w-full p-2 border rounded-md"
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            >
              <option value="score">Impact Score</option>
              <option value="name">Name</option>
              <option value="department">Department</option>
              <option value="change">Score Change</option>
            </select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Handle export functionality
  const handleExport = () => {
    const data = activeTab === 'individuals' ? employeeScores : departmentScores;
    const csvContent = "data:text/csv;charset=utf-8," + 
      data.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `impact_scores_${activeTab}_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: `Successfully exported ${activeTab} impact scores data.`,
      duration: 3000,
    });
  };

  // Filter and sort data
  const filteredEmployeeScores = employeeScores
    .filter(emp => {
      if (filters.department !== 'all' && emp.department !== filters.department) return false;
      if (filters.scoreRange !== 'all') {
        const [min, max] = filters.scoreRange.split('-').map(Number);
        if (max) {
          return emp.impactScore >= min && emp.impactScore <= max;
        } else {
          return emp.impactScore < 70;
        }
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'department':
          return a.department.localeCompare(b.department);
        case 'change':
          return b.change - a.change;
        default:
          return b.impactScore - a.impactScore;
      }
    });

  // Sample component scores data
  const componentScoresData = [
    { name: "Productivity", value: 85 },
    { name: "Teamwork", value: 88 },
    { name: "Innovation", value: 79 },
    { name: "Satisfaction", value: 83 },
    { name: "Growth", value: 86 }
  ];
  
  // Sample strengths and areas for improvement
  const strengths = [
    "High employee retention rate (95%)",
    "Excellent team collaboration metrics",
    "Strong innovation score, particularly in R&D",
  ];
  
  const improvements = [
    "Meeting efficiency scores below target",
    "Cross-department collaboration opportunities",
    "Onboarding impact can be improved"
  ];
  
  // Helper function for score color
  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-emerald-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };
  
  // Helper function for change icon and color
  const getChangeDisplay = (change) => {
    if (change > 0) {
      return {
        icon: <ArrowUpRight className="h-3 w-3 text-green-600" />,
        class: "text-green-600"
      };
    } else if (change < 0) {
      return {
        icon: <TrendingUp className="h-3 w-3 rotate-180 text-red-600" />,
        class: "text-red-600"
      };
    } else {
      return {
        icon: <TrendingUp className="h-3 w-3 text-gray-600 transform rotate-90" />,
        class: "text-gray-600"
      };
    }
  };

  // Overall company score (average of all employees)
  const overallScore = Math.round(employeeScores.reduce((sum, emp) => sum + emp.impactScore, 0) / employeeScores.length);
  
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Impact Score</h1>
          <p className="text-gray-500 mt-1">Track and improve organizational and individual impact</p>
        </div>
        <div className="flex gap-2">
          <ToggleGroup type="single" value={timeRange} onValueChange={(val) => val && setTimeRange(val)}>
            <ToggleGroupItem value="week" className="text-xs">Week</ToggleGroupItem>
            <ToggleGroupItem value="month" className="text-xs">Month</ToggleGroupItem>
            <ToggleGroupItem value="quarter" className="text-xs">Quarter</ToggleGroupItem>
            <ToggleGroupItem value="year" className="text-xs">Year</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      {/* Company Overall Score */}
      <Card className="overflow-hidden border-0 shadow-md">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-staffi-purple to-staffi-purple-dark p-6 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white/20 p-2">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-90">Company Impact Score</p>
                    <h2 className="text-3xl font-bold">{overallScore}/100</h2>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 text-sm">
                    <ArrowUpRight className="h-4 w-4" />
                    <span>+2.5% from last {timeRange}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-1.5 text-sm">
                    <span>Score Breakdown</span>
                    <span>{overallScore}/100</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: `${overallScore}%` }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {componentScoresData.map((item, index) => (
                    <div key={index}>
                      <p className="text-xs font-medium opacity-75">{item.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-lg font-semibold">{item.value}</span>
                        <span className="text-xs opacity-75">/100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Decorative pattern */}
            <div className="absolute top-0 right-0 opacity-10">
              <svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="75" cy="25" r="20" fill="white" />
                <circle cx="75" cy="75" r="15" fill="white" />
                <circle cx="25" cy="75" r="20" fill="white" />
                <circle cx="25" cy="25" r="15" fill="white" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Impact Score Trend */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Impact Score Trend</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 border-gray-200"
              onClick={handleExport}
            >
              <Download className="mr-1 h-4 w-4" />
              Export Data
            </Button>
          </div>
          <CardDescription>Track your organization's impact over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{fontSize: 12}} />
                <YAxis domain={[70, 100]} tick={{fontSize: 12}} />
                <Tooltip
                  formatter={(value) => [`${value} points`, 'Impact Score']}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                    border: 'none' 
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  fill="url(#scoreGradient)" 
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md col-span-1">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">Key Strengths</CardTitle>
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="min-w-5 text-green-500 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md col-span-1">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">Areas for Improvement</CardTitle>
              <div className="bg-amber-100 p-2 rounded-full">
                <Zap className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {improvements.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="min-w-5 text-amber-500 mt-0.5">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-md col-span-1">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">Actions to Take</CardTitle>
              <div className="bg-staffi-purple-light p-2 rounded-full">
                <BarChart4 className="h-5 w-5 text-staffi-purple" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="min-w-5 text-staffi-purple mt-0.5">
                  <Activity className="h-4 w-4" />
                </div>
                <span className="text-sm">Schedule cross-departmental collaboration sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="min-w-5 text-staffi-purple mt-0.5">
                  <Activity className="h-4 w-4" />
                </div>
                <span className="text-sm">Implement meeting efficiency training</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="min-w-5 text-staffi-purple mt-0.5">
                  <Activity className="h-4 w-4" />
                </div>
                <span className="text-sm">Revise onboarding process with team feedback</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Impact Scores Table */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Impact Scores</CardTitle>
              <CardDescription>View and compare impact scores across the organization</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8 border-gray-200"
                onClick={() => setFilterOpen(true)}
              >
                <Filter className="mr-1 h-3 w-3" />
                Filter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8 border-gray-200"
                onClick={handleExport}
              >
                <Download className="mr-1 h-3 w-3" />
                Export
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="w-full bg-transparent gap-1">
              <TabsTrigger value="individuals" className="flex-1 data-[state=active]:bg-staffi-purple data-[state=active]:text-white">
                <Users className="mr-1.5 h-4 w-4" />
                Individuals
              </TabsTrigger>
              <TabsTrigger value="departments" className="flex-1 data-[state=active]:bg-staffi-purple data-[state=active]:text-white">
                <BarChart4 className="mr-1.5 h-4 w-4" />
                Departments
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="individuals" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Impact Score</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployeeScores.map((employee) => (
                    <TableRow 
                      key={employee.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <img 
                            src={employee.avatar} 
                            alt={employee.name} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span>{employee.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        <span className={getScoreColor(employee.impactScore)}>
                          {employee.impactScore}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className={getChangeDisplay(employee.change).class}>
                            {getChangeDisplay(employee.change).icon}
                          </span>
                          <span className={getChangeDisplay(employee.change).class}>
                            {Math.abs(employee.change)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="departments" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Team Size</TableHead>
                    <TableHead>Impact Score</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentScores.map((department) => (
                    <TableRow 
                      key={department.name}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedDepartment(department)}
                    >
                      <TableCell className="font-medium">
                        {department.name}
                      </TableCell>
                      <TableCell>{department.employees}</TableCell>
                      <TableCell>
                        <span className={getScoreColor(department.impactScore)}>
                          {department.impactScore}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className={getChangeDisplay(department.change).class}>
                            {getChangeDisplay(department.change).icon}
                          </span>
                          <span className={getChangeDisplay(department.change).class}>
                            {Math.abs(department.change)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
      
      {/* Dialogs and Sheets */}
      <EmployeeDetailsDialog 
        employee={selectedEmployee}
        open={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
      
      <DepartmentDetailsSheet
        department={selectedDepartment}
        open={!!selectedDepartment}
        onClose={() => setSelectedDepartment(null)}
      />
      
      <FilterDialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
      />
    </div>
  );
};

export default ImpactScore;
