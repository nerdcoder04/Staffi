
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Clock, ArrowUpRight } from "lucide-react";
import { format, addDays, subDays, isSameDay } from 'date-fns';

interface ScheduleCardProps {
  className?: string;
}

interface ScheduleEvent {
  id: number;
  time: string;
  startTime: string;
  endTime: string;
  title: string;
  attendees?: { name: string; avatar: string }[];
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ className }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visibleDates, setVisibleDates] = useState(generateDateRange(new Date(), 5));

  function generateDateRange(startDate: Date, count: number) {
    return Array.from({ length: count }).map((_, i) => addDays(startDate, i));
  }

  const handlePrevDay = () => {
    setVisibleDates(prev => prev.map(date => subDays(date, 5)));
  };

  const handleNextDay = () => {
    setVisibleDates(prev => prev.map(date => addDays(date, 5)));
  };

  // Mock schedule data
  const getScheduleForDate = (date: Date): ScheduleEvent[] => {
    const dayOfWeek = date.getDay();
    
    const morningEvents = [
      { 
        id: 1, 
        time: "09:00", 
        startTime: "09:30", 
        endTime: "10:00", 
        title: "Daily Sync",
        attendees: [] 
      },
      { 
        id: 2, 
        time: "11:00", 
        startTime: "11:00", 
        endTime: "11:30", 
        title: "Team Review Meeting", 
        attendees: [
          { name: "AJ", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
          { name: "MP", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
        ] 
      }
    ];
    
    const afternoonEvents = [
      { 
        id: 3, 
        time: "12:00", 
        startTime: "12:00", 
        endTime: "13:00", 
        title: "Daily Meeting",
        attendees: [] 
      },
      { 
        id: 4, 
        time: "14:00", 
        startTime: "14:00", 
        endTime: "14:30", 
        title: "Interview: Product Designer",
        attendees: [
          { name: "AJ", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
        ]
      },
      { 
        id: 5, 
        time: "15:00", 
        startTime: "15:00", 
        endTime: "16:00", 
        title: "Onboarding New Developer", 
        attendees: [] 
      }
    ];
    
    // Vary events based on day of week to make it more realistic
    if (dayOfWeek === 1 || dayOfWeek === 3) { // Monday or Wednesday
      return [...morningEvents, ...afternoonEvents];
    } else if (dayOfWeek === 2 || dayOfWeek === 4) { // Tuesday or Thursday
      return [...morningEvents, afternoonEvents[0], afternoonEvents[2]];
    } else if (dayOfWeek === 5) { // Friday
      return [morningEvents[0], afternoonEvents[0]];
    } else { // Weekend
      return [];
    }
  };
  
  const eventsForSelectedDay = getScheduleForDate(selectedDate);

  return (
    <Card className={cn("h-full overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300", className)}>
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-semibold">Schedule</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full"
            onClick={handlePrevDay}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full"
            onClick={handleNextDay}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full"
          >
            <ArrowUpRight className="h-4 w-4" />
            <span className="sr-only">Expand</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Horizontal Calendar */}
        <div className="px-4 py-2 border-b border-gray-100">
          <div className="flex justify-between items-center">
            {visibleDates.map(date => (
              <button
                key={date.toString()}
                className={cn(
                  "flex flex-col items-center justify-center rounded-full w-12 h-12 text-sm transition-colors",
                  isSameDay(date, selectedDate)
                    ? "bg-staffi-purple text-white"
                    : "hover:bg-gray-100"
                )}
                onClick={() => setSelectedDate(date)}
              >
                <span className="text-xs font-medium">
                  {format(date, 'EEE')}
                </span>
                <span className={cn(
                  "text-base",
                  isSameDay(date, selectedDate) ? "font-semibold" : ""
                )}>
                  {format(date, 'd')}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Timeline */}
        <div className="relative pl-12 pr-4 py-2 h-[calc(100%-65px)] overflow-y-auto">
          {/* Time markers */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-100">
            <div className="absolute w-2 h-2 rounded-full bg-staffi-purple left-[-3px]" style={{ top: '77px' }} />
          </div>
          
          {/* Events */}
          {eventsForSelectedDay.length > 0 ? (
            <div className="space-y-4">
              {eventsForSelectedDay.map(event => (
                <div key={event.id} className="relative">
                  {/* Time marker */}
                  <div className="absolute left-[-28px] text-xs text-gray-500 w-[24px] text-right">
                    {event.time}
                  </div>
                  
                  {/* Event card */}
                  <div className={cn(
                    "p-3 rounded-lg ml-4",
                    event.id % 2 === 0 ? "bg-gray-800 text-white" : "bg-staffi-purple-light/20 border border-staffi-purple-light"
                  )}>
                    <div className="flex justify-between items-start">
                      <h5 className={cn(
                        "font-medium text-sm",
                        event.id % 2 === 0 ? "" : "text-gray-900"
                      )}>
                        {event.title}
                      </h5>
                      {event.id % 3 === 0 && (
                        <span className="flex items-center text-xs font-medium rounded-full px-1.5 py-0.5 bg-yellow-400/20 text-yellow-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1"></span>
                          Important
                        </span>
                      )}
                    </div>
                    <p className={cn(
                      "text-xs mt-1",
                      event.id % 2 === 0 ? "text-gray-300" : "text-gray-500"
                    )}>
                      {event.startTime} - {event.endTime}
                    </p>
                    
                    {/* Attendees */}
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="flex mt-2">
                        <div className="flex -space-x-2">
                          {event.attendees.map((attendee, i) => (
                            <img 
                              key={i} 
                              src={attendee.avatar} 
                              alt={attendee.name}
                              className="w-6 h-6 rounded-full border-2 border-white"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-6">
              <Clock className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No events scheduled</p>
              <p className="text-xs text-gray-400">Enjoy your day off</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleCard;
