
import React, { useState, useCallback } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Lightbulb,
  TrendingUp,
  LineChart,
  Users,
  Calendar,
  FileText,
  MessageSquare,
  ChevronRight,
  RefreshCw,
  Check,
  MoreHorizontal,
  ZoomIn,
  Download
} from 'lucide-react';
import StaffiButton from '@/components/ui/staffi-button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AIInsights = () => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeInsight, setActiveInsight] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('productivity');
  const { toast } = useToast();
  
  // Sample data for charts
  const productivityData = [
    { name: 'Mon', value: 78 },
    { name: 'Tue', value: 82 },
    { name: 'Wed', value: 85 },
    { name: 'Thu', value: 90 },
    { name: 'Fri', value: 75 },
    { name: 'Sat', value: 50 },
    { name: 'Sun', value: 40 },
  ];
  
  const satisfactionData = [
    { name: "Very Satisfied", value: 60 },
    { name: "Satisfied", value: 25 },
    { name: "Neutral", value: 10 },
    { name: "Unsatisfied", value: 5 }
  ];
  
  const COLORS = ['#8B5CF6', '#6E59A5', '#E5DEFF', '#D3E4FD'];
  
  const insights = [
    {
      id: 1,
      title: "Employee Productivity Trends",
      description: "Team productivity has increased by 15% in the last quarter. Top performers include Sarah Williams and Michael Chen.",
      category: "Productivity",
      icon: TrendingUp,
      date: "Updated 2 days ago",
      color: "bg-purple-50 text-staffi-purple",
      detailedChart: "productivity",
      detailedDescription: "Team productivity is measured based on task completion rates, quality of work, and adherence to deadlines. The 15% increase represents a significant improvement over the previous quarter, particularly in the Engineering and Design departments. This positive trend correlates with the recent implementation of flexible work arrangements and improved project management workflows."
    },
    {
      id: 2,
      title: "Burnout Risk Analysis",
      description: "3 employees show potential signs of burnout based on work hours and decreased engagement metrics.",
      category: "Wellbeing",
      icon: Users,
      date: "Updated 1 day ago",
      color: "bg-amber-50 text-amber-600",
      detailedChart: "burnout",
      detailedDescription: "Early burnout indicators include consistently working over 50 hours weekly, decreased participation in team activities, and subtle changes in communication patterns. The AI has identified these patterns in 3 team members, primarily in the Development and Marketing departments. Recommended interventions include scheduling 1:1 check-ins, evaluating workload distribution, and encouraging the use of available mental health resources."
    },
    {
      id: 3,
      title: "Leave Pattern Prediction",
      description: "Expect 20% increase in leave requests during the upcoming holiday season. Plan staffing accordingly.",
      category: "Leave",
      icon: Calendar,
      date: "Updated 3 days ago",
      color: "bg-blue-50 text-blue-600",
      detailedChart: "leave",
      detailedDescription: "Historical leave data shows consistent patterns of increased time-off requests during November-December. The projected 20% increase is based on current staffing levels, historical trends, and announced holiday plans. Departments most affected will likely be Customer Support and Operations. Recommended actions include early scheduling discussions, temporary role cross-training, and potential contingent staffing for critical positions."
    },
    {
      id: 4,
      title: "Payroll Optimization",
      description: "Payroll efficiency can be improved by 7% through automation of overtime calculations.",
      category: "Payroll",
      icon: FileText,
      date: "Updated 5 days ago",
      color: "bg-green-50 text-green-600",
      detailedChart: "payroll",
      detailedDescription: "Manual overtime calculations are currently costing approximately 15 hours of HR time monthly with a 3.5% error rate. Implementing automated calculations would reduce processing time by 85% while virtually eliminating calculation errors. The 7% efficiency improvement factors in reduced labor costs, error correction time, and compliance risk reduction. Implementation would require approximately 3 weeks with minimal disruption to existing workflows."
    },
  ];
  
  const inquiries = [
    "Who are our top performing employees this month?",
    "What is our average employee satisfaction score?",
    "Predict leave patterns for the next quarter",
    "Suggest improvements for our onboarding process",
  ];

  const handleAskAI = useCallback(() => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a query first",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "AI Response",
        description: "Analysis complete. Results are now available in your insights dashboard.",
      });
    }, 2000);
  }, [query, toast]);

  const handleInsightClick = (insight) => {
    setActiveInsight(insight);
    setShowDialog(true);
  };

  const handleRefreshChart = (chartType) => {
    setActiveTab(chartType);
    toast({
      title: "Refreshing Data",
      description: "Chart data has been refreshed with the latest information.",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Generating Report",
      description: "Your detailed report is being prepared and will be available shortly.",
    });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-500 mt-1">Intelligence-driven HR analytics and recommendations</p>
        </div>
      </div>

      {/* AI Assistant */}
      <Card className="border-0 shadow-md overflow-hidden transition-all hover:shadow-lg duration-200">
        <div className="bg-gradient-to-r from-staffi-purple to-staffi-purple-dark p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Staffi AI Assistant</h3>
              <p className="text-sm text-white/80">Ask anything about your HR data and get instant insights</p>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex flex-col space-y-4">
              <Textarea 
                placeholder="Ask a question about your employees, payroll, leave patterns, or productivity..."
                className="bg-white/10 border-white/20 min-h-[80px] text-white placeholder:text-white/60 focus-visible:ring-white/30"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex space-x-3">
                <StaffiButton 
                  className="bg-white text-staffi-purple hover:bg-white/90"
                  onClick={handleAskAI}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-1 h-4 w-4 animate-spin" /> 
                      Processing...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-1 h-4 w-4" /> 
                      Ask AI
                    </>
                  )}
                </StaffiButton>
                <Button 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                  onClick={() => {
                    toast({
                      title: "Sample Queries",
                      description: "Sample queries have been loaded below.",
                    });
                  }}
                >
                  View Sample Queries
                </Button>
              </div>
            </div>
            
            {!query && (
              <div className="mt-6 space-y-3">
                <p className="text-sm font-medium">Popular inquiries:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {inquiries.map((inquiry, index) => (
                    <div 
                      key={index}
                      className="bg-white/10 border border-white/20 rounded-lg p-3 hover:bg-white/20 cursor-pointer transition-colors"
                      onClick={() => setQuery(inquiry)}
                    >
                      <p className="text-sm">{inquiry}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <Card key={insight.id} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleInsightClick(insight)}>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className={cn("p-2 rounded-full", insight.color)}>
                  <insight.icon className="h-5 w-5" />
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="font-medium text-gray-900 mt-3">{insight.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{insight.description}</p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {insight.date}
                </span>
                <Button variant="ghost" size="sm" className="h-7 text-staffi-purple hover:text-staffi-purple hover:bg-staffi-purple/5">
                  Details <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Trends */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Team Productivity Trends</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => handleRefreshChart('productivity')}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Average productivity scores over the last week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productivityData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis domain={[0, 100]} tick={{fontSize: 12}} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Productivity']}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                      border: 'none' 
                    }}
                  />
                  <Bar dataKey="value" fill="#8B5CF6" barSize={30} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => {
                  toast({
                    title: "Report Downloaded",
                    description: "Productivity report has been downloaded.",
                  });
                }}
              >
                <Download className="h-3.5 w-3.5 mr-1" /> Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Employee Satisfaction */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Employee Satisfaction</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => handleRefreshChart('satisfaction')}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Based on latest employee survey data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {satisfactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Employees']}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                      border: 'none' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-2">
              <div className="flex items-center space-x-4">
                {satisfactionData.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-3 w-3 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-xs">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => {
                  toast({
                    title: "Report Downloaded",
                    description: "Satisfaction report has been downloaded.",
                  });
                }}
              >
                <Download className="h-3.5 w-3.5 mr-1" /> Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
            onClick={handleGenerateReport}
          >
            Generate Detailed Report
          </StaffiButton>
        </CardFooter>
      </Card>

      {/* Insight Detail Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-4xl">
          {activeInsight && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className={cn("p-1.5 rounded-full", activeInsight.color)}>
                    <activeInsight.icon className="h-4 w-4" />
                  </div>
                  <DialogTitle>{activeInsight.title}</DialogTitle>
                </div>
                <DialogDescription>
                  {activeInsight.category} · {activeInsight.date}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {activeInsight.detailedDescription}
                  </p>
                </div>
                
                <div className="h-[300px] w-full">
                  <Tabs defaultValue={activeInsight.detailedChart}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="productivity">Productivity</TabsTrigger>
                      <TabsTrigger value="trends">Trends</TabsTrigger>
                      <TabsTrigger value="comparison">Comparison</TabsTrigger>
                    </TabsList>
                    <TabsContent value="productivity" className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productivityData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    <TabsContent value="trends" className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={satisfactionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {satisfactionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    <TabsContent value="comparison" className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productivityData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" name="Current" fill="#8B5CF6" />
                          <Bar dataKey="value" name="Previous" fill="#E5DEFF" />
                        </BarChart>
                      </ResponsiveContainer>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border border-gray-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Productivity Rate</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Improvement</span>
                          <span className="font-medium">+15%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Affected Employees</span>
                          <span className="font-medium">42</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                        <li>Schedule team review of findings</li>
                        <li>Implement suggested policy changes</li>
                        <li>Follow up with key stakeholders</li>
                        <li>Review progress in 30 days</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                >
                  Close
                </Button>
                <Button 
                  variant="default"
                  onClick={() => {
                    setShowDialog(false);
                    toast({
                      title: "Report Generated",
                      description: "Detailed report has been generated and sent to your email.",
                    });
                  }}
                >
                  Download Report
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIInsights;
