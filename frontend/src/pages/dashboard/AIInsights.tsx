
import React, { useState, useCallback, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Check,
  BarChart,
  LineChart,
  Users,
  Activity,
  User
} from 'lucide-react';
import StaffiButton from '@/components/ui/staffi-button';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeComparisonTool from '@/components/insights/employee-comparison-tool';
import AnomalyDetector from '@/components/insights/anomaly-detector';

const AIInsights = () => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [behaviorLogs, setBehaviorLogs] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState<null | {
    riskLevel: 'low' | 'medium' | 'high';
    suggestions: string[];
  }>(null);
  const [engagementTrends, setEngagementTrends] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("individual");
  
  const { toast } = useToast();

  // Mock employee data
  const employees = [
    { id: "1", name: "Sarah Johnson" },
    { id: "2", name: "Michael Chen" },
    { id: "3", name: "Emily Rodriguez" },
    { id: "4", name: "David Kim" },
    { id: "5", name: "Lisa Thompson" }
  ];

  // Generate engagement trend data when employee is selected
  useEffect(() => {
    if (selectedEmployee) {
      // Mock data - in a real app, this would come from an API
      const mockData = generateMockEngagementData(selectedEmployee);
      setEngagementTrends(mockData);
    } else {
      setEngagementTrends([]);
    }
  }, [selectedEmployee]);

  // Generate mock engagement data
  const generateMockEngagementData = (employeeId: string) => {
    const today = new Date();
    const data = [];
    
    // Generate 12 weeks of data
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i * 7);
      
      // Different patterns based on employee ID
      let score;
      if (employeeId === "1") {
        // Declining pattern
        score = 85 - i * 3 + Math.random() * 10;
      } else if (employeeId === "2") {
        // Improving pattern
        score = 50 + i * 3 + Math.random() * 10;
      } else if (employeeId === "3") {
        // Stable pattern
        score = 75 + Math.random() * 10;
      } else {
        // Random pattern
        score = 50 + Math.random() * 40;
      }
      
      // Ensure score is within bounds
      score = Math.max(0, Math.min(100, score));
      
      data.push({
        week: `Week ${12-i}`,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: Math.round(score),
        emoji: getEmojiForScore(Math.round(score))
      });
    }
    
    return data;
  };

  // Get emoji based on score
  const getEmojiForScore = (score: number) => {
    if (score >= 70) return "🙂";
    if (score >= 40) return "😐";
    return "😟";
  };

  const handlePrediction = useCallback(() => {
    if (!selectedEmployee || !behaviorLogs.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an employee and provide behavior logs.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      
      // Different results based on selected employee
      let riskLevel: 'low' | 'medium' | 'high';
      let suggestions: string[];
      
      if (selectedEmployee === "1") {
        riskLevel = 'high';
        suggestions = [
          "Schedule an urgent 1-on-1 check-in to discuss concerns and provide support",
          "Consider temporary workload reduction or redistribution",
          "Offer access to wellness resources and mental health support",
          "Review team dynamics and communication patterns"
        ];
      } else if (selectedEmployee === "2") {
        riskLevel = 'medium';
        suggestions = [
          "Schedule weekly 1-on-1 check-ins to improve communication and address concerns",
          "Consider providing additional learning and development opportunities",
          "Review workload distribution and team dynamics",
          "Encourage participation in team-building activities"
        ];
      } else {
        riskLevel = 'low';
        suggestions = [
          "Maintain regular check-ins to ensure continued engagement",
          "Provide opportunities for growth and skill development",
          "Acknowledge and celebrate achievements to maintain motivation",
          "Consider assigning mentorship responsibilities to leverage expertise"
        ];
      }
      
      setPredictionResult({
        riskLevel,
        suggestions
      });
      
      toast({
        title: "Analysis Complete",
        description: "Engagement prediction has been generated successfully.",
      });
    }, 2000);
  }, [selectedEmployee, behaviorLogs, toast]);

  const getRiskLevelColor = (level: 'low' | 'medium' | 'high') => {
    const colors = {
      low: 'bg-green-50 text-green-700',
      medium: 'bg-amber-50 text-amber-700',
      high: 'bg-red-50 text-red-700'
    };
    return colors[level];
  };

  const getRiskLevelEmoji = (level: 'low' | 'medium' | 'high') => {
    const emojis = {
      low: '🙂',
      medium: '😐',
      high: '😟'
    };
    return emojis[level];
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Engagement Analysis</h1>
          <p className="text-gray-500 mt-1">Use AI to predict employee engagement and get personalized recommendations</p>
        </div>
      </div>

      <Tabs defaultValue="individual" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-2xl">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Individual Analysis
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Compare Employees
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="flex items-center gap-2">
            <Activity className="h-4 w-4" /> Anomalies
          </TabsTrigger>
        </TabsList>
        
        {/* Individual Analysis Tab */}
        <TabsContent value="individual" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Engagement Prediction</CardTitle>
              <CardDescription>
                Select an employee and provide recent behavior observations for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select Employee</label>
                <Select 
                  value={selectedEmployee} 
                  onValueChange={setSelectedEmployee}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Behavior Logs</label>
                <Textarea 
                  placeholder="Enter recent behavior observations, performance notes, or relevant incidents..."
                  value={behaviorLogs}
                  onChange={(e) => setBehaviorLogs(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <StaffiButton 
                onClick={handlePrediction}
                disabled={isAnalyzing}
                className="w-full sm:w-auto"
              >
                {isAnalyzing ? (
                  <>
                    <span className="animate-pulse">Analyzing...</span>
                    <div className="ml-2 animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  </>
                ) : (
                  <>Run AI Analysis</>
                )}
              </StaffiButton>
            </CardContent>
          </Card>

          {predictionResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <CardTitle>Prediction Results</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className={`p-4 rounded-lg ${getRiskLevelColor(predictionResult.riskLevel)}`}>
                    <div className="font-medium flex items-center justify-between">
                      <div>
                        Risk Level: {predictionResult.riskLevel.charAt(0).toUpperCase() + predictionResult.riskLevel.slice(1)}
                      </div>
                      <div className="text-2xl">
                        {getRiskLevelEmoji(predictionResult.riskLevel)}
                      </div>
                    </div>
                  </div>
                  
                  {/* AI-generated summary styled like a chatbot message */}
                  <div className="bg-staffi-purple/10 rounded-lg p-4 border border-staffi-purple/20">
                    <div className="flex items-start gap-3">
                      <div className="bg-staffi-purple text-white rounded-full p-2 h-8 w-8 flex items-center justify-center">
                        AI
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">
                          {predictionResult.riskLevel === 'high' && (
                            "This employee is showing significant signs of disengagement that require immediate attention. Recent activity patterns suggest potential burnout risks that should be addressed proactively."
                          )}
                          {predictionResult.riskLevel === 'medium' && (
                            "There are some warning signs of decreasing engagement for this employee. While not critical yet, addressing these concerns now could prevent further disengagement."
                          )}
                          {predictionResult.riskLevel === 'low' && (
                            "This employee appears to be well-engaged and productive. Their activity patterns indicate healthy work involvement and satisfaction with current roles and responsibilities."
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Trend Chart */}
                  {engagementTrends.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-staffi-purple" />
                        Engagement Trends
                      </h3>
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart data={engagementTrends} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="date" 
                              tick={{ fontSize: 12 }} 
                              tickMargin={10}
                            />
                            <YAxis 
                              domain={[0, 100]} 
                              tick={{ fontSize: 12 }} 
                              tickMargin={10}
                            />
                            <Tooltip 
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white p-3 border shadow-md rounded-md">
                                      <p className="font-medium">{data.date}</p>
                                      <p className="text-staffi-purple flex items-center gap-2">
                                        Engagement Score: {data.score} <span>{data.emoji}</span>
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="score" 
                              stroke="#8b5cf6" 
                              strokeWidth={3} 
                              dot={{ fill: '#8b5cf6', stroke: '#8b5cf6', strokeWidth: 2, r: 4 }}
                              activeDot={{ fill: '#8b5cf6', stroke: '#8b5cf6', strokeWidth: 3, r: 6 }}
                            />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* Emoji Key */}
                      <div className="flex items-center gap-6 justify-end text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-lg">🙂</span>
                          <span className="text-gray-600">High Engagement</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">😐</span>
                          <span className="text-gray-600">Moderate Engagement</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">😟</span>
                          <span className="text-gray-600">Low Engagement</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-staffi-purple" />
                      Recommendations
                    </h3>
                    <ul className="space-y-3">
                      {predictionResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-staffi-purple mt-0.5" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* Compare Employees Tab */}
        <TabsContent value="compare">
          <EmployeeComparisonTool />
        </TabsContent>

        {/* Anomalies Tab */}
        <TabsContent value="anomalies">
          <AnomalyDetector />
        </TabsContent>
      </Tabs>

      {/* AI Recommendations */}
      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-0">
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>Based on analysis of your HR data and industry trends</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg border border-green-100 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
              <Check className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Implement Flexible Work Policy</h4>
                <p className="text-sm text-gray-600 mt-1">Employee satisfaction could increase by 18% by implementing a more flexible work schedule policy based on our analysis of productivity patterns and survey feedback.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-100 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer">
              <Check className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Burnout Prevention Program</h4>
                <p className="text-sm text-gray-600 mt-1">Consider implementing a wellbeing program targeting the 15% of employees showing early signs of burnout, particularly in the engineering and design departments.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
              <Check className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Skills Development Focus</h4>
                <p className="text-sm text-gray-600 mt-1">Data suggests investing in AI and automation skills training would benefit 65% of your workforce and lead to productivity gains within 3-6 months.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-purple-100 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
              <Check className="h-5 w-5 text-staffi-purple mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Team Structure Optimization</h4>
                <p className="text-sm text-gray-600 mt-1">Our analysis suggests reshuffling 3 project teams to better align skills with project requirements, potentially increasing delivery speed by 22%.</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <StaffiButton 
            className="w-full sm:w-auto"
            onClick={() => {
              toast({
                title: "Report Generation Started",
                description: "Your detailed report is being generated and will be available soon.",
              });
            }}
          >
            Generate Detailed Report
          </StaffiButton>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AIInsights;