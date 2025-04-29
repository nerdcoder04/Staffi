
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  UserCheck,
  Activity,
  Calendar,
  Clock,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import StaffiButton from "@/components/ui/staffi-button";

type AnomalyType = 'leave' | 'activity' | 'performance' | 'attendance' | 'engagement';

interface Anomaly {
  id: string;
  type: AnomalyType;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  detectedAt: string;
  affectedEmployees: {
    id: string;
    name: string;
  }[];
  recommendedActions: string[];
}

const AnomalyDetector = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedAnomalyId, setExpandedAnomalyId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to get anomalies
    const fetchAnomalies = async () => {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockAnomalies: Anomaly[] = [
        {
          id: '1',
          type: 'leave',
          title: 'Unusual spike in leave requests',
          description: 'There has been a 75% increase in leave requests from the Design department in the past week compared to the monthly average.',
          severity: 'medium',
          detectedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
          affectedEmployees: [
            { id: '2', name: 'Michael Chen' },
            { id: '5', name: 'Lisa Thompson' },
            { id: '8', name: 'Jamal Williams' }
          ],
          recommendedActions: [
            'Schedule a team check-in to understand if there are any underlying issues',
            'Review project deadlines and workload distribution',
            'Consider temporarily reassigning critical tasks'
          ]
        },
        {
          id: '2',
          type: 'activity',
          title: 'Multiple employees inactive',
          description: '3 employees from the Marketing team have shown minimal system activity for the past 3 days.',
          severity: 'high',
          detectedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
          affectedEmployees: [
            { id: '12', name: 'Alex Johnson' },
            { id: '15', name: 'Sofia Garcia' },
            { id: '18', name: 'Daniel Park' }
          ],
          recommendedActions: [
            'Reach out to each employee individually to check on their well-being',
            'Verify if they are working on offline tasks or projects',
            'Ensure they have the necessary resources and support'
          ]
        },
        {
          id: '3',
          type: 'performance',
          title: 'Sudden drop in performance metrics',
          description: 'The Engineering team has shown a 32% decrease in code commits and task completion rate in the last sprint.',
          severity: 'high',
          detectedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
          affectedEmployees: [
            { id: '23', name: 'Emma Wilson' },
            { id: '24', name: 'Ryan Thomas' },
            { id: '28', name: 'Olivia Martinez' },
            { id: '30', name: 'Noah Lee' }
          ],
          recommendedActions: [
            'Schedule an urgent sprint retrospective meeting',
            'Identify technical blockers or dependencies hindering progress',
            'Consider adjusting sprint scope or providing additional resources'
          ]
        },
        {
          id: '4',
          type: 'attendance',
          title: 'Irregular attendance patterns',
          description: 'Several customer support team members have shown irregular clock-in and clock-out times, deviating significantly from scheduled hours.',
          severity: 'medium',
          detectedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
          affectedEmployees: [
            { id: '35', name: 'Aiden Taylor' },
            { id: '42', name: 'Isabella Brown' }
          ],
          recommendedActions: [
            'Review attendance policy with the team',
            'Discuss flexible scheduling options if needed',
            'Ensure adequate coverage for customer support hours'
          ]
        },
        {
          id: '5',
          type: 'engagement',
          title: 'Declining engagement scores',
          description: 'Monthly pulse survey results show a 28% decline in engagement scores from the Finance department.',
          severity: 'low',
          detectedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
          affectedEmployees: [
            { id: '50', name: 'William Harris' },
            { id: '51', name: 'Sophia Clark' },
            { id: '55', name: 'Benjamin King' }
          ],
          recommendedActions: [
            'Conduct anonymous feedback sessions to identify concerns',
            'Review recent changes that might have affected morale',
            'Develop targeted engagement initiatives for the department'
          ]
        }
      ];
      
      setAnomalies(mockAnomalies);
      setIsLoading(false);
    };
    
    fetchAnomalies();
  }, []);

  const refreshAnomalies = () => {
    setIsLoading(true);
    setExpandedAnomalyId(null);
    
    // Simulate refreshing data
    setTimeout(() => {
      toast({
        title: "Anomalies Refreshed",
        description: "The anomaly detection system has been updated with the latest data.",
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleAnomalyClick = (anomalyId: string) => {
    if (expandedAnomalyId === anomalyId) {
      setExpandedAnomalyId(null);
    } else {
      setExpandedAnomalyId(anomalyId);
    }
  };

  const getTypeIcon = (type: AnomalyType) => {
    switch (type) {
      case 'leave':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'activity':
        return <Activity className="h-5 w-5 text-red-500" />;
      case 'performance':
        return <FileText className="h-5 w-5 text-amber-500" />;
      case 'attendance':
        return <Clock className="h-5 w-5 text-purple-500" />;
      case 'engagement':
        return <UserCheck className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: 'high' | 'medium' | 'low') => {
    const classes = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      low: 'bg-green-100 text-green-700 border-green-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes[severity]}`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) {
      return 'Just now';
    } else if (diffHrs === 1) {
      return '1 hour ago';
    } else if (diffHrs < 24) {
      return `${diffHrs} hours ago`;
    } else {
      const days = Math.floor(diffHrs / 24);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Anomaly Detection
            </CardTitle>
            <CardDescription>
              AI-detected patterns and abnormalities that might require attention
            </CardDescription>
          </div>
          <StaffiButton
            onClick={refreshAnomalies}
            disabled={isLoading}
            size="sm"
            className="whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <span className="animate-pulse">Scanning...</span>
                <div className="ml-2 animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              </>
            ) : (
              <>Refresh Anomalies</>
            )}
          </StaffiButton>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin w-10 h-10 border-4 border-staffi-purple border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">Scanning employee data for anomalies...</p>
            </div>
          ) : anomalies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <UserCheck className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-1">No anomalies detected</p>
              <p className="text-gray-600">All employee metrics are within expected thresholds.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {anomalies.map((anomaly) => (
                <motion.div
                  key={anomaly.id}
                  animate={{ height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className={`border border-gray-100 rounded-lg shadow-sm overflow-hidden cursor-pointer 
                    ${expandedAnomalyId === anomaly.id ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                  onClick={() => handleAnomalyClick(anomaly.id)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(anomaly.type)}
                        <h3 className="font-medium">{anomaly.title}</h3>
                      </div>
                      <div className="flex items-center gap-3">
                        {getSeverityBadge(anomaly.severity)}
                        <span className="text-xs text-gray-500">{formatTimestamp(anomaly.detectedAt)}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">{anomaly.description}</p>
                    
                    {expandedAnomalyId === anomaly.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-4"
                      >
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-gray-700">Affected Employees:</h4>
                          <div className="flex flex-wrap gap-2">
                            {anomaly.affectedEmployees.map((employee) => (
                              <span key={employee.id} className="inline-flex items-center gap-1.5 py-1 px-2 rounded-full text-xs font-medium bg-gray-100">
                                <span className="w-2 h-2 rounded-full bg-staffi-purple"></span>
                                {employee.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-gray-700">Recommended Actions:</h4>
                          <ul className="space-y-2">
                            {anomaly.recommendedActions.map((action, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <ArrowRight className="h-4 w-4 mt-0.5 text-staffi-purple" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="pt-2">
                          <Button variant="outline" className="text-staffi-purple border-staffi-purple hover:bg-staffi-purple/10">
                            Schedule Follow-up
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <p className="text-sm text-gray-500">AI analysis based on 30-day pattern recognition</p>
          <Button 
            variant="link" 
            className="text-staffi-purple"
            onClick={() => {
              toast({
                title: "Alert Settings Updated",
                description: "Notification preferences for anomaly alerts have been updated.",
              });
            }}
          >
            Configure Alert Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AnomalyDetector;