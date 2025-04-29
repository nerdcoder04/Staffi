import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, User, Calendar, MessageSquare, 
  Clock, ChevronRight, Plus, Search, Filter,
  Building, UserPlus
} from 'lucide-react';
import { GlassPanel } from "@/components/dashboard/glass-panel";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// Define our types for better TypeScript support
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
  team?: string; // Make the team property optional
}

interface Team {
  id: number;
  name: string;
  members: TeamMember[];
  projects: Project[];
}

// Mock data for teams and projects
const initialTeams: Team[] = [
  {
    id: 1,
    name: "Product Development",
    members: [
      { id: 1, name: "Sarah Wilson", role: "Product Manager", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
      { id: 2, name: "Michael Chen", role: "Senior Developer", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36" },
      { id: 3, name: "Aisha Patel", role: "UX Designer", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956" },
      { id: 4, name: "Carlos Rodriguez", role: "Frontend Developer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" }
    ],
    projects: [
      { id: 101, name: "Mobile App Redesign", status: "in-progress", progress: 65, deadline: "2025-05-15" },
      { id: 102, name: "Dashboard Analytics", status: "completed", progress: 100, deadline: "2025-04-01" }
    ]
  },
  {
    id: 2,
    name: "Marketing",
    members: [
      { id: 5, name: "Emma Johnson", role: "Marketing Director", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4" },
      { id: 6, name: "David Kim", role: "Content Strategist", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e" },
      { id: 7, name: "Sophia Martinez", role: "Social Media Manager", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80" }
    ],
    projects: [
      { id: 103, name: "Q2 Campaign", status: "in-progress", progress: 40, deadline: "2025-06-30" },
      { id: 104, name: "Brand Guidelines", status: "review", progress: 85, deadline: "2025-05-10" }
    ]
  },
  {
    id: 3,
    name: "HR & Operations",
    members: [
      { id: 8, name: "Thomas Lee", role: "HR Manager", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" },
      { id: 9, name: "Olivia Taylor", role: "Talent Acquisition", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956" },
      { id: 10, name: "James Wilson", role: "Operations Lead", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61" }
    ],
    projects: [
      { id: 105, name: "Employee Onboarding", status: "in-progress", progress: 75, deadline: "2025-05-20" },
      { id: 106, name: "New Benefits Program", status: "review", progress: 90, deadline: "2025-05-30" }
    ]
  }
];

const initialProjects: Project[] = [
  ...initialTeams[0].projects,
  ...initialTeams[1].projects,
  ...initialTeams[2].projects,
  { id: 107, name: "Blockchain Integration", status: "in-progress", progress: 30, deadline: "2025-07-15", team: "Cross-functional" },
  { id: 108, name: "AI Insights Dashboard", status: "planning", progress: 10, deadline: "2025-08-01", team: "Innovation" }
];

interface TeamDetailsProps {
  team: Team;
  onClose: () => void;
  onAddMember: (teamId: number, newMember: Omit<TeamMember, 'id'>) => void;
}

const TeamDetails = ({ team, onClose, onAddMember }: TeamDetailsProps) => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.role) {
      onAddMember(team.id, newMember);
      setNewMember({
        name: '',
        role: '',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
      });
      setIsAddMemberOpen(false);
      toast.success(`${newMember.name} added to ${team.name}`);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{team.name}</h2>
          <p className="text-gray-500">{team.members.length} team members</p>
        </div>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>

      <Tabs defaultValue="members">
        <TabsList className="mb-4">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="projects">Team Projects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="space-y-4">
          {team.members.map((member: TeamMember) => (
            <Card key={member.id} className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                  <AvatarImage src={`${member.avatar}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`} alt={member.name} />
                  <AvatarFallback>{member.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-medium">{member.name}</h3>
                  <p className="text-gray-500">{member.role}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact
                </Button>
              </div>
            </Card>
          ))}
          
          <Card className="p-4 flex items-center justify-center border-dashed">
            <Button variant="ghost" className="flex items-center" onClick={() => setIsAddMemberOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </Card>

          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>Add a new member to the {team.name} team.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    placeholder="John Doe" 
                    value={newMember.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input 
                    id="role" 
                    name="role"
                    placeholder="Software Engineer" 
                    value={newMember.role}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>Cancel</Button>
                <Button onClick={handleAddMember}>Add Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          {team.projects.map((project: Project) => (
            <Card key={project.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{project.name}</h3>
                  <Badge className={cn(
                    project.status === "completed" && "bg-green-100 text-green-800",
                    project.status === "in-progress" && "bg-blue-100 text-blue-800",
                    project.status === "review" && "bg-amber-100 text-amber-800",
                    project.status === "planning" && "bg-purple-100 text-purple-800"
                  )}>
                    {project.status === "in-progress" ? "In Progress" : 
                     project.status === "completed" ? "Completed" : 
                     project.status === "review" ? "In Review" : "Planning"}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex -space-x-2">
                    {team.members.slice(0, 3).map((member: TeamMember) => (
                      <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                        <AvatarImage src={`${member.avatar}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`} />
                        <AvatarFallback className="text-[10px]">{member.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                    ))}
                    {team.members.length > 3 && (
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-xs font-medium border-2 border-white">
                        +{team.members.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          <Card className="p-4 flex items-center justify-center border-dashed">
            <Button variant="ghost" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const People = () => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("teams");
  const [isNewTeamDialogOpen, setIsNewTeamDialogOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    department: "",
    memberCount: "",
    projectStatus: ""
  });
  
  const form = useForm({
    defaultValues: {
      name: "",
      description: ""
    }
  });

  // Filter teams based on search term
  const filteredTeams = teams.filter(team => {
    let matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.members.some(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Apply additional filters
    if (filters.department && team.name.toLowerCase() !== filters.department.toLowerCase()) {
      return false;
    }
    
    if (filters.memberCount) {
      const count = parseInt(filters.memberCount);
      if (!isNaN(count) && team.members.length < count) {
        return false;
      }
    }
    
    if (filters.projectStatus) {
      const hasMatchingProject = team.projects.some(project => 
        project.status === filters.projectStatus
      );
      if (!hasMatchingProject) {
        return false;
      }
    }
    
    return matchesSearch;
  });
  
  // Filter projects based on search term
  const filteredProjects = projects.filter(project => {
    let matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.team && project.team.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply status filter if on projects tab
    if (filters.projectStatus && project.status !== filters.projectStatus) {
      return false;
    }
    
    return matchesSearch;
  });
  
  // Group projects by status
  const projectsByStatus = {
    "in-progress": filteredProjects.filter(p => p.status === "in-progress"),
    "review": filteredProjects.filter(p => p.status === "review"),
    "planning": filteredProjects.filter(p => p.status === "planning"),
    "completed": filteredProjects.filter(p => p.status === "completed")
  };

  // Add a new team
  const handleAddTeam = (data: { name: string, description: string }) => {
    const newTeam: Team = {
      id: Math.max(...teams.map(t => t.id)) + 1,
      name: data.name,
      members: [],
      projects: []
    };
    
    setTeams([...teams, newTeam]);
    setIsNewTeamDialogOpen(false);
    form.reset();
    toast.success(`Team "${data.name}" created successfully!`);
  };

  // Add a new member to a team
  const handleAddMember = (teamId: number, newMember: Omit<TeamMember, 'id'>) => {
    setTeams(prevTeams => {
      return prevTeams.map(team => {
        if (team.id === teamId) {
          const memberId = Math.max(...team.members.map(m => m.id), 0) + 1;
          return {
            ...team,
            members: [...team.members, { id: memberId, ...newMember }]
          };
        }
        return team;
      });
    });
  };

  // Apply filters
  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
    toast.success("Filters applied successfully");
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      department: "",
      memberCount: "",
      projectStatus: ""
    });
    setIsFilterOpen(false);
    toast.success("Filters reset");
  };

  // Show all projects dialog
  const [isAllProjectsOpen, setIsAllProjectsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">People & Teams</h1>
            <p className="text-gray-500 mt-1">Manage your teams, projects, and team members</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search teams or projects..." 
                className="pl-9 w-[280px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="bg-staffi-purple hover:bg-staffi-purple/90"
              onClick={() => setIsNewTeamDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Team
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="teams" className="space-y-6" onValueChange={setSelectedTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="teams" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Teams
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Projects
              </TabsTrigger>
            </TabsList>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex"
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          
          {/* Teams View */}
          <TabsContent value="teams" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <motion.div
                  key={team.id}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="cursor-pointer"
                  onClick={() => setSelectedTeam(team)}
                >
                  <GlassPanel className="p-5 h-full" variant="light">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg">{team.name}</h3>
                        <Badge variant="outline" className="bg-staffi-purple/10 text-staffi-purple border-staffi-purple/20">
                          {team.members.length} members
                        </Badge>
                      </div>
                      
                      <div className="flex -space-x-3">
                        {team.members.slice(0, 5).map((member) => (
                          <Avatar key={member.id} className="border-2 border-white">
                            <AvatarImage src={`${member.avatar}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        ))}
                        {team.members.length > 5 && (
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-sm font-medium border-2 border-white">
                            +{team.members.length - 5}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-500 mb-2">Current Projects</h4>
                        <div className="space-y-2">
                          {team.projects.map((project) => (
                            <div key={project.id} className="flex items-center justify-between text-sm">
                              <span>{project.name}</span>
                              <div className="flex items-center">
                                <div className="w-16 h-1.5 bg-gray-100 rounded-full mr-2 overflow-hidden">
                                  <div 
                                    className={cn(
                                      "h-full rounded-full", 
                                      project.status === "completed" ? "bg-green-500" : 
                                      project.status === "in-progress" ? "bg-blue-500" : 
                                      "bg-amber-500"
                                    )}
                                    style={{ width: `${project.progress}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">{project.progress}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-between text-staffi-purple"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTeam(team);
                          }}
                        >
                          View Team Details
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          {/* Projects View */}
          <TabsContent value="projects">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* In Progress Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-blue-600 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    In Progress
                  </h3>
                  <Badge variant="outline">{projectsByStatus["in-progress"].length}</Badge>
                </div>
                
                {projectsByStatus["in-progress"].map((project) => (
                  <Card key={project.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <h3 className="font-medium">{project.name}</h3>
                      <Progress value={project.progress} className="h-1.5" />
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{project.team || "Mixed Team"}</span>
                        <span>{new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </Card>
                ))}
                
                <Button 
                  variant="ghost" 
                  className="w-full border border-dashed"
                  onClick={() => setIsAllProjectsOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  View All Projects
                </Button>
              </div>
              
              {/* In Review Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-amber-600 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                    In Review
                  </h3>
                  <Badge variant="outline">{projectsByStatus["review"].length}</Badge>
                </div>
                
                {projectsByStatus["review"].map((project) => (
                  <Card key={project.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <h3 className="font-medium">{project.name}</h3>
                      <Progress value={project.progress} className="h-1.5" />
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{project.team || "Mixed Team"}</span>
                        <span>{new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Planning Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-purple-600 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                    Planning
                  </h3>
                  <Badge variant="outline">{projectsByStatus["planning"].length}</Badge>
                </div>
                
                {projectsByStatus["planning"].map((project) => (
                  <Card key={project.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <h3 className="font-medium">{project.name}</h3>
                      <Progress value={project.progress} className="h-1.5" />
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{project.team || "Mixed Team"}</span>
                        <span>{new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Completed Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-green-600 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Completed
                  </h3>
                  <Badge variant="outline">{projectsByStatus["completed"].length}</Badge>
                </div>
                
                {projectsByStatus["completed"].map((project) => (
                  <Card key={project.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <h3 className="font-medium">{project.name}</h3>
                      <Progress value={project.progress} className="h-1.5" />
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{project.team || "Mixed Team"}</span>
                        <span>{new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Team Details Dialog */}
      <Dialog open={!!selectedTeam} onOpenChange={(open) => !open && setSelectedTeam(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Team Details</DialogTitle>
            <DialogDescription>
              View team members and projects for {selectedTeam?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedTeam && <TeamDetails 
            team={selectedTeam} 
            onClose={() => setSelectedTeam(null)} 
            onAddMember={handleAddMember}
          />}
        </DialogContent>
      </Dialog>

      {/* New Team Dialog */}
      <Dialog open={isNewTeamDialogOpen} onOpenChange={setIsNewTeamDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Enter the details for your new team
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddTeam)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>Team Name</Label>
                    <FormControl>
                      <Input placeholder="Enter team name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <Label>Description (Optional)</Label>
                    <FormControl>
                      <Textarea 
                        placeholder="Briefly describe the team's purpose" 
                        {...field}
                        className="min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsNewTeamDialogOpen(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Team</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Filter Sheet */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Options</SheetTitle>
            <SheetDescription>
              Apply filters to narrow down your search results
            </SheetDescription>
          </SheetHeader>
          
          <div className="py-6 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="department">Department/Team</Label>
              <Input
                id="department"
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                placeholder="Filter by department name"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="memberCount">Minimum Members</Label>
              <Input
                id="memberCount"
                type="number"
                value={filters.memberCount}
                onChange={(e) => setFilters({ ...filters, memberCount: e.target.value })}
                placeholder="Minimum team size"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="projectStatus">Project Status</Label>
              <select
                id="projectStatus"
                className="w-full p-2 border rounded-md"
                value={filters.projectStatus}
                onChange={(e) => setFilters({ ...filters, projectStatus: e.target.value })}
              >
                <option value="">All Statuses</option>
                <option value="in-progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="planning">Planning</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="w-full" onClick={resetFilters}>
                Reset Filters
              </Button>
              <Button 
                className="w-full bg-staffi-purple hover:bg-staffi-purple/90" 
                onClick={() => applyFilters(filters)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* All Projects Dialog */}
      <Dialog open={isAllProjectsOpen} onOpenChange={setIsAllProjectsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>All Projects</DialogTitle>
            <DialogDescription>
              Overview of all current projects across all teams
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{project.name}</h3>
                      <Badge className={cn(
                        project.status === "completed" && "bg-green-100 text-green-800",
                        project.status === "in-progress" && "bg-blue-100 text-blue-800",
                        project.status === "review" && "bg-amber-100 text-amber-800",
                        project.status === "planning" && "bg-purple-100 text-purple-800"
                      )}>
                        {project.status === "in-progress" ? "In Progress" : 
                        project.status === "completed" ? "Completed" : 
                        project.status === "review" ? "In Review" : "Planning"}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div>
                        <div><span className="font-medium">Team:</span> {project.team || "Mixed Team"}</div>
                        <div><span className="font-medium">Deadline:</span> {new Date(project.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsAllProjectsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default People;