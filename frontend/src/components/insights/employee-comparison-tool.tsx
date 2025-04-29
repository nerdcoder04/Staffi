
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import StaffiButton from "@/components/ui/staffi-button";
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const EmployeeComparisonTool = () => {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const { toast } = useToast();

  // Mock employee data
  const employees = [
    { id: "1", name: "Sarah Johnson" },
    { id: "2", name: "Michael Chen" },
    { id: "3", name: "Emily Rodriguez" },
    { id: "4", name: "David Kim" },
    { id: "5", name: "Lisa Thompson" },
  ];

  const handleEmployeeSelect = (employeeId: string) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    } else {
      if (selectedEmployees.length < 3) {
        setSelectedEmployees([...selectedEmployees, employeeId]);
      } else {
        toast({
          title: "Maximum Employees Selected",
          description: "You can compare up to 3 employees at a time.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCompare = () => {
    if (selectedEmployees.length < 2) {
      toast({
        title: "Too Few Employees Selected",
        description: "Please select at least 2 employees to compare.",
        variant: "destructive",
      });
      return;
    }

    setIsComparing(true);

    // Simulate API call
    setTimeout(() => {
      const barData = generateComparisonBarData();
      const radarData = generateComparisonRadarData();
      
      setComparisonData({
        barData,
        radarData,
        summaries: generateComparisonSummaries(),
      });
      
      setIsComparing(false);
      
      toast({
        title: "Comparison Complete",
        description: `Comparing ${selectedEmployees.length} employees.`,
      });
    }, 1500);
  };

  const generateComparisonBarData = () => {
    // Generate mock comparison data for bar chart
    const metrics = ['Engagement', 'Productivity', 'Communication', 'Leadership', 'Innovation'];
    return metrics.map(metric => {
      const result: Record<string, any> = { name: metric };
      
      selectedEmployees.forEach(employeeId => {
        const employee = employees.find(e => e.id === employeeId);
        if (employee) {
          // Generate a score between 50-100 with some patterns based on employee ID
          let baseScore = 70;
          if (employeeId === "1") baseScore = 85; // High performer
          if (employeeId === "2") baseScore = 75; // Good performer
          if (employeeId === "3") baseScore = 65; // Average performer
          
          // Add some random variation
          const score = Math.min(100, Math.max(50, baseScore + (Math.random() * 20 - 10)));
          result[employee.name] = Math.round(score);
        }
      });
      
      return result;
    });
  };

  const generateComparisonRadarData = () => {
    // Creating the skills categories first
    const skills = [
      "Teamwork", 
      "Problem Solving", 
      "Technical", 
      "Creativity", 
      "Adaptability", 
      "Time Management"
    ];
    
    // Create the radar data structure correctly - each data point needs all skills
    const radarData = skills.map(skill => {
      const dataPoint: Record<string, any> = { subject: skill };
      
      selectedEmployees.forEach(employeeId => {
        const employee = employees.find(e => e.id === employeeId);
        if (employee) {
          // Generate different skill profiles based on employee ID
          let score = 70; // Default base score
          
          // Customize base scores based on employee
          if (employeeId === "1") { // Team leader type
            if (skill === "Teamwork") score = 90;
            else if (skill === "Problem Solving") score = 85;
            else if (skill === "Technical") score = 70;
            else if (skill === "Creativity") score = 60;
            else if (skill === "Adaptability") score = 80;
            else if (skill === "Time Management") score = 85;
          } else if (employeeId === "2") { // Technical expert
            if (skill === "Teamwork") score = 70;
            else if (skill === "Problem Solving") score = 90;
            else if (skill === "Technical") score = 95;
            else if (skill === "Creativity") score = 75;
            else if (skill === "Adaptability") score = 65;
            else if (skill === "Time Management") score = 80;
          } else if (employeeId === "3") { // Creative type
            if (skill === "Teamwork") score = 75;
            else if (skill === "Problem Solving") score = 70;
            else if (skill === "Technical") score = 65;
            else if (skill === "Creativity") score = 95;
            else if (skill === "Adaptability") score = 85;
            else if (skill === "Time Management") score = 60;
          }
          
          // Add some random variation
          score = Math.min(100, Math.max(50, score + (Math.random() * 15 - 7.5)));
          dataPoint[employee.name] = Math.round(score);
        }
      });
      
      return dataPoint;
    });
    
    return radarData;
  };

  const generateComparisonSummaries = () => {
    // Generate comparison summaries based on selected employees
    const summaries: Record<string, string> = {};
    
    selectedEmployees.forEach(employeeId => {
      const employee = employees.find(e => e.id === employeeId);
      if (employee) {
        if (employeeId === "1") {
          summaries[employee.name] = "Shows strong leadership qualities and excellent team management skills. Highest engagement score among peers, but showing signs of potential burnout due to high workload. Consider delegating some responsibilities.";
        } else if (employeeId === "2") {
          summaries[employee.name] = "Technical expert with outstanding problem-solving abilities. Could benefit from more team collaboration opportunities. Has shown consistent improvement in productivity metrics over the past quarter.";
        } else if (employeeId === "3") {
          summaries[employee.name] = "Highly creative with exceptional adaptability. Could improve in technical skills and time management. Brings valuable innovative ideas to projects but sometimes struggles with deadlines.";
        } else if (employeeId === "4") {
          summaries[employee.name] = "Well-balanced performer with consistent metrics across all categories. Shows potential for growth in leadership roles. Has taken fewer leave days than average and maintains steady engagement.";
        } else {
          summaries[employee.name] = "Shows strong communication skills and is highly regarded by peers. Recent performance indicates readiness for more challenging projects. Consider providing growth opportunities to maintain engagement.";
        }
      }
    });
    
    return summaries;
  };

  // Color map for consistent colors per employee
  const colorMap: Record<string, string> = {
    "Sarah Johnson": "#8b5cf6",
    "Michael Chen": "#3b82f6",
    "Emily Rodriguez": "#ef4444",
    "David Kim": "#10b981",
    "Lisa Thompson": "#f59e0b",
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Employee Comparison Tool</CardTitle>
          <CardDescription>
            Select multiple employees to compare their performance metrics side-by-side
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Select Employees (max 3)</p>
              <div className="flex flex-wrap gap-2">
                {employees.map((employee) => (
                  <Button
                    key={employee.id}
                    variant={selectedEmployees.includes(employee.id) ? "default" : "outline"}
                    className={`${
                      selectedEmployees.includes(employee.id) ? "bg-staffi-purple text-white" : ""
                    }`}
                    onClick={() => handleEmployeeSelect(employee.id)}
                  >
                    {employee.name}
                    {selectedEmployees.includes(employee.id) && " ✓"}
                  </Button>
                ))}
              </div>
            </div>
            
            <StaffiButton
              onClick={handleCompare}
              disabled={isComparing || selectedEmployees.length < 2}
              className="w-full sm:w-auto"
            >
              {isComparing ? (
                <>
                  <span className="animate-pulse">Comparing...</span>
                  <div className="ml-2 animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                </>
              ) : (
                <>Compare Selected Employees</>
              )}
            </StaffiButton>
          </div>
        </CardContent>
      </Card>

      {comparisonData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Performance Metrics Comparison Chart */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Performance Metrics Comparison</CardTitle>
              <CardDescription>
                Key performance indicators across different areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={comparisonData.barData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, '']}
                      labelFormatter={(label) => `Metric: ${label}`}
                    />
                    <Legend />
                    {selectedEmployees.map((employeeId) => {
                      const employee = employees.find(e => e.id === employeeId);
                      if (employee) {
                        return (
                          <Bar
                            key={employee.name}
                            dataKey={employee.name}
                            fill={colorMap[employee.name as keyof typeof colorMap] || "#8884d8"}
                            barSize={30}
                          />
                        );
                      }
                      return null;
                    })}
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Skills Radar Chart */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Skills Assessment Comparison</CardTitle>
              <CardDescription>
                Comparing strengths across key competency areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius="80%" data={comparisonData.radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    {selectedEmployees.map((employeeId, index) => {
                      const employee = employees.find(e => e.id === employeeId);
                      if (employee) {
                        return (
                          <Radar
                            key={employee.name}
                            name={employee.name}
                            dataKey={employee.name}
                            stroke={colorMap[employee.name] || "#8884d8"}
                            fill={colorMap[employee.name] || "#8884d8"}
                            fillOpacity={0.3}
                          />
                        );
                      }
                      return null;
                    })}
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights Section */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>AI-Driven Insights</CardTitle>
              <CardDescription>
                Analysis of each employee's strengths, weaknesses, and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {selectedEmployees.map((employeeId) => {
                  const employee = employees.find(e => e.id === employeeId);
                  if (employee && comparisonData.summaries[employee.name]) {
                    return (
                      <div 
                        key={employee.id}
                        className="p-4 rounded-lg border border-gray-100 shadow-sm"
                        style={{ borderLeft: `4px solid ${colorMap[employee.name] || "#8884d8"}` }}
                      >
                        <h3 className="font-medium text-lg mb-2">{employee.name}</h3>
                        <p className="text-gray-700">{comparisonData.summaries[employee.name]}</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <StaffiButton
                className="w-full sm:w-auto"
                onClick={() => {
                  toast({
                    title: "Report Generated",
                    description: "Detailed comparison report has been sent to your email.",
                  });
                }}
              >
                Export Comparison Report
              </StaffiButton>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default EmployeeComparisonTool;