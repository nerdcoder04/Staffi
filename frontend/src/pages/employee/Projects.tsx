import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, ChevronRight, MessageSquare } from "lucide-react";
import { GlassPanel } from "@/components/dashboard/glass-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Define types for better TypeScript support
interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

interface Project {
  id: number;
  name: string;
  status: "in-progress" | "completed" | "review" | "planning";
  progress: number;
  deadline: string;
  description: string;
  team: string;
  members: TeamMember[];
  tasks: {
    id: number;
    name: string;
    status: "to-do" | "in-progress" | "completed";
    assignee: string;
    dueDate: string;
  }[];
}

const Projects = () => {
  // Mock data for projects
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 101,
      name: "Mobile App Redesign",
      status: "in-progress",
      progress: 65,
      deadline: "2025-05-15",
      description: "Redesign the mobile app interface with a focus on improving user experience and implementing new features based on customer feedback.",
      team: "Product Development",
      members: [
        { id: 1, name: "Sarah Wilson", role: "Product Manager", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
        { id: 2, name: "Michael Chen", role: "Senior Developer", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36" },
        { id: 3, name: "Aisha Patel", role: "UX Designer", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956" },
        { id: 4, name: "Carlos Rodriguez", role: "Frontend Developer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" }
      ],
      tasks: [
        {
          id: 1001,
          name: "User research and analysis",
          status: "completed",
          assignee: "Sarah Wilson",
          dueDate: "2025-04-20"
        },
        {
          id: 1002,
          name: "Create wireframes for new features",
          status: "completed",
          assignee: "Aisha Patel",
          dueDate: "2025-04-30"
        },
        {
          id: 1003,
          name: "Implement navigation redesign",
          status: "in-progress",
          assignee: "Carlos Rodriguez",
          dueDate: "2025-05-10"
        },
        {
          id: 1004,
          name: "Integrate new API endpoints",
          status: "to-do",
          assignee: "Michael Chen",
          dueDate: "2025-05-12"
        }
      ]
    },
    {
      id: 102,
      name: "Dashboard Analytics",
      status: "completed",
      progress: 100,
      deadline: "2025-04-01",
      description: "Develop a comprehensive analytics dashboard for tracking key performance indicators and providing actionable insights to stakeholders.",
      team: "Product Development",
      members: [
        { id: 1, name: "Sarah Wilson", role: "Product Manager", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
        { id: 2, name: "Michael Chen", role: "Senior Developer", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36" },
        { id: 5, name: "Emma Johnson", role: "Data Analyst", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4" }
      ],
      tasks: [
        {
          id: 2001,
          name: "Define key metrics and KPIs",
          status: "completed",
          assignee: "Sarah Wilson",
          dueDate: "2025-03-10"
        },
        {
          id: 2002,
          name: "Design dashboard layout",
          status: "completed",
          assignee: "Aisha Patel",
          dueDate: "2025-03-15"
        },
        {
          id: 2003,
          name: "Implement data visualization components",
          status: "completed",
          assignee: "Michael Chen",
          dueDate: "2025-03-25"
        },
        {
          id: 2004,
          name: "User testing and feedback",
          status: "completed",
          assignee: "Emma Johnson",
          dueDate: "2025-03-30"
        }
      ]
    },
    {
      id: 103,
      name: "Q2 Campaign",
      status: "planning",
      progress: 10,
      deadline: "2025-06-30",
      description: "Plan and execute marketing campaign for Q2 focusing on new product features and increased user acquisition.",
      team: "Marketing",
      members: [
        { id: 5, name: "Emma Johnson", role: "Marketing Director", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4" },
        { id: 6, name: "David Kim", role: "Content Strategist", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e" },
        { id: 7, name: "Sophia Martinez", role: "Social Media Manager", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80" },
        { id: 1, name: "Sarah Wilson", role: "Product Manager", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" }
      ],
      tasks: [
        {
          id: 3001,
          name: "Define campaign objectives",
          status: "in-progress",
          assignee: "Emma Johnson",
          dueDate: "2025-05-05"
        },
        {
          id: 3002,
          name: "Create content calendar",
          status: "to-do",
          assignee: "David Kim",
          dueDate: "2025-05-12"
        },
        {
          id: 3003,
          name: "Design campaign visuals",
          status: "to-do",
          assignee: "Sophia Martinez",
          dueDate: "2025-05-18"
        },
        {
          id: 3004,
          name: "Coordinate with product team",
          status: "to-do",
          assignee: "Sarah Wilson",
          dueDate: "2025-05-20"
        }
      ]
    }
  ]);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Filter projects by status
  const activeProjects = projects.filter(p => p.status !== "completed");
  const completedProjects = projects.filter(p => p.status === "completed");
  
  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsOpen(true);
  };
  
  return (
    <div className="space-y-6">
      {/* Projects Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassPanel className="p-5 h-full" variant="light">
          <div className="space-y-2">
            <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg">Total Projects</h3>
            <p className="text-3xl font-bold">{projects.length}</p>
            <p className="text-sm text-gray-500">
              {activeProjects.length} active, {completedProjects.length} completed
            </p>
          </div>
        </GlassPanel>
        
        <GlassPanel className="p-5 h-full" variant="light">
          <div className="space-y-2">
            <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg">In Progress</h3>
            <p className="text-3xl font-bold">
              {projects.filter(p => p.status === "in-progress").length}
            </p>
            <div className="w-full bg-gray-100 h-1.5 rounded-full">
              <div 
                className="bg-green-500 h-full rounded-full" 
                style={{ width: `${(projects.filter(p => p.status === "in-progress").length / projects.length) * 100}%` }}
              />
            </div>
          </div>
        </GlassPanel>
        
        <GlassPanel className="p-5 h-full" variant="light">
          <div className="space-y-2">
            <div className="rounded-full bg-amber-100 w-12 h-12 flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-lg">In Review</h3>
            <p className="text-3xl font-bold">
              {projects.filter(p => p.status === "review").length}
            </p>
            <div className="w-full bg-gray-100 h-1.5 rounded-full">
              <div 
                className="bg-amber-500 h-full rounded-full" 
                style={{ width: `${(projects.filter(p => p.status === "review").length / projects.length) * 100}%` }}
              />
            </div>
          </div>
        </GlassPanel>
        
        <GlassPanel className="p-5 h-full" variant="light">
          <div className="space-y-2">
            <div className="rounded-full bg-purple-100 w-12 h-12 flex items-center justify-center mb-3">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg">Planning</h3>
            <p className="text-3xl font-bold">
              {projects.filter(p => p.status === "planning").length}
            </p>
            <div className="w-full bg-gray-100 h-1.5 rounded-full">
              <div 
                className="bg-purple-500 h-full rounded-full" 
                style={{ width: `${(projects.filter(p => p.status === "planning").length / projects.length) * 100}%` }}
              />
            </div>
          </div>
        </GlassPanel>
      </div>
      
      {/* Projects List */}
      <Card>
        <CardHeader>
          <CardTitle>My Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active Projects</TabsTrigger>
              <TabsTrigger value="completed">Completed Projects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4">
              {activeProjects.map(project => (
                <motion.div
                  key={project.id}
                  whileHover={{ y: -2 }}
                  className="cursor-pointer"
                  onClick={() => handleViewProject(project)}
                >
                  <Card className="border overflow-hidden">
                    <div className="h-1.5">
                      <div 
                        className={cn(
                          "h-full",
                          project.status === "in-progress" && "bg-blue-500",
                          project.status === "review" && "bg-amber-500",
                          project.status === "planning" && "bg-purple-500"
                        )} 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{project.name}</h3>
                          <p className="text-sm text-gray-500">{project.team}</p>
                        </div>
                        <Badge className={cn(
                          project.status === "in-progress" && "bg-blue-100 text-blue-800",
                          project.status === "review" && "bg-amber-100 text-amber-800",
                          project.status === "planning" && "bg-purple-100 text-purple-800"
                        )}>
                          {project.status === "in-progress" ? "In Progress" : 
                          project.status === "review" ? "In Review" : "Planning"}
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Due: {new Date(project.deadline).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        
                        <div className="flex -space-x-2">
                          {project.members.slice(0, 3).map(member => (
                            <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                              <AvatarImage src={`${member.avatar}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`} alt={member.name} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                          ))}
                          {project.members.length > 3 && (
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-xs font-medium border-2 border-white">
                              +{project.members.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
              
              {activeProjects.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No active projects found
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              {completedProjects.map(project => (
                <motion.div
                  key={project.id}
                  whileHover={{ y: -2 }}
                  className="cursor-pointer"
                  onClick={() => handleViewProject(project)}
                >
                  <Card className="border overflow-hidden">
                    <div className="h-1.5">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{project.name}</h3>
                          <p className="text-sm text-gray-500">{project.team}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Completed: {new Date(project.deadline).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        
                        <div className="flex -space-x-2">
                          {project.members.slice(0, 3).map(member => (
                            <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                              <AvatarImage src={`${member.avatar}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`} alt={member.name} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                          ))}
                          {project.members.length > 3 && (
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-xs font-medium border-2 border-white">
                              +{project.members.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
              
              {completedProjects.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No completed projects found
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Project Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription>
              Details and tasks for {selectedProject?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-6 py-4">
              <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selectedProject.name}</h2>
                  <p className="text-gray-500">{selectedProject.team}</p>
                </div>
                <Badge className={cn(
                  selectedProject.status === "completed" && "bg-green-100 text-green-800",
                  selectedProject.status === "in-progress" && "bg-blue-100 text-blue-800",
                  selectedProject.status === "review" && "bg-amber-100 text-amber-800",
                  selectedProject.status === "planning" && "bg-purple-100 text-purple-800"
                )}>
                  {selectedProject.status === "in-progress" ? "In Progress" : 
                  selectedProject.status === "completed" ? "Completed" : 
                  selectedProject.status === "review" ? "In Review" : "Planning"}
                </Badge>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Project Description</h3>
                <p className="text-gray-600">{selectedProject.description}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Project Progress</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Completion</span>
                  <span>{selectedProject.progress}%</span>
                </div>
                <Progress value={selectedProject.progress} className="h-2 mb-4" />
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Deadline:</span>{" "}
                    <span className="font-medium">{new Date(selectedProject.deadline).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Team Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProject.members.map(member => (
                    <div key={member.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <Avatar>
                        <AvatarImage src={`${member.avatar}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Tasks</h3>
                <div className="space-y-2">
                  {selectedProject.tasks.map(task => (
                    <div 
                      key={task.id} 
                      className={cn(
                        "p-3 border rounded-lg flex items-center justify-between",
                        task.status === "completed" && "bg-green-50 border-green-100",
                        task.status === "in-progress" && "bg-blue-50 border-blue-100",
                        task.status === "to-do" && "bg-gray-50 border-gray-100",
                      )}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div 
                            className={cn(
                              "w-2 h-2 rounded-full",
                              task.status === "completed" && "bg-green-500",
                              task.status === "in-progress" && "bg-blue-500",
                              task.status === "to-do" && "bg-gray-400",
                            )}
                          ></div>
                          <p className="font-medium">{task.name}</p>
                        </div>
                        <div className="flex gap-4 mt-1 text-xs text-gray-500">
                          <p>Assigned to: {task.assignee}</p>
                          <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Badge 
                        className={cn(
                          "capitalize",
                          task.status === "completed" && "bg-green-100 text-green-800",
                          task.status === "in-progress" && "bg-blue-100 text-blue-800",
                          task.status === "to-do" && "bg-gray-100 text-gray-800"
                        )}
                      >
                        {task.status.replace("-", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button className="flex items-center gap-2 bg-staffi-purple hover:bg-staffi-purple/90">
                  <MessageSquare className="h-4 w-4" />
                  Message Team
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;