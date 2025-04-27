
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface AttendanceReportCardProps {
  className?: string;
}

const AttendanceReportCard: React.FC<AttendanceReportCardProps> = ({ className }) => {
  // Mock data for attendance visualization
  const presentCount = 63;
  const absentCount = 12;
  const totalDays = 31;
  
  // Generate the dot grid based on the mock data
  const generateAttendanceDots = () => {
    const totalDots = 62; // Approximately for a month view
    const dots = [];
    let presentDotsCreated = 0;
    let absentDotsCreated = 0;
    
    for (let i = 0; i < totalDots; i++) {
      if (presentDotsCreated < presentCount && Math.random() > 0.3) {
        dots.push({ type: 'present', intensity: Math.random() > 0.5 ? 'high' : 'medium' });
        presentDotsCreated++;
      } else if (absentDotsCreated < absentCount) {
        dots.push({ type: 'absent' });
        absentDotsCreated++;
      } else {
        dots.push({ type: 'empty' });
      }
    }
    
    return dots;
  };
  
  const attendanceDots = generateAttendanceDots();

  return (
    <Card className={cn("h-full overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-gray-900 text-white", className)}>
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-semibold">Attendance Report</CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 rounded-full text-gray-300 hover:text-white hover:bg-gray-800"
        >
          <ArrowUpRight className="h-4 w-4" />
          <span className="sr-only">Expand</span>
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-baseline gap-6 mb-8">
          <div>
            <p className="text-5xl font-semibold">{presentCount}</p>
            <p className="text-gray-400 text-xs mt-1">Present</p>
          </div>
          <div>
            <p className="text-4xl font-semibold text-gray-500">{absentCount}</p>
            <p className="text-gray-500 text-xs mt-1">Absent</p>
          </div>
        </div>

        {/* Attendance dot grid visualization */}
        <div className="grid grid-cols-7 gap-2">
          {attendanceDots.map((dot, index) => (
            <div 
              key={index} 
              className={cn(
                "w-3 h-3 rounded-full", 
                dot.type === 'present' && dot.intensity === 'high' && "bg-yellow-400",
                dot.type === 'present' && dot.intensity === 'medium' && "bg-yellow-500/70",
                dot.type === 'absent' && "bg-gray-700",
                dot.type === 'empty' && "bg-gray-800"
              )} 
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs mt-4">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
            <span className="text-gray-300">Present</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-700"></span>
            <span className="text-gray-300">Absent</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceReportCard;
