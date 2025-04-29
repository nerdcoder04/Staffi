import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, User, Mail, Phone, Building, Briefcase } from "lucide-react";
import { GlassPanel } from "@/components/dashboard/glass-panel";
import { toast } from 'sonner';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    phone: '+1 (555) 123-4567',
    role: 'Product Manager',
    department: 'Product Development',
    joinDate: 'April 15, 2023',
    employeeId: 'EMP-2023-042',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Experienced product manager with a passion for user-centered design and agile methodologies. Leading the development of innovative solutions that solve real customer problems.'
  });
  
  const [editProfile, setEditProfile] = useState({...profile});
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setProfile({...editProfile});
      toast.success('Profile updated successfully');
    }
    setIsEditing(!isEditing);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditProfile(prev => ({...prev, [name]: value}));
  };
  
  const handleCancelEdit = () => {
    setEditProfile({...profile});
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <GlassPanel className="p-6" variant="light">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="relative">
            <Avatar className="w-24 h-24 border-2 border-white shadow-lg">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="outline" className="bg-staffi-purple/10 text-staffi-purple border-staffi-purple/20">
                  {profile.role}
                </Badge>
                <Badge variant="outline" className="bg-staffi-blue/10 text-staffi-blue border-staffi-blue/20">
                  {profile.department}
                </Badge>
              </div>
            </div>
            
            <p className="text-gray-600">{profile.bio}</p>
            
            <div className="pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleEditToggle}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </div>
      </GlassPanel>
      
      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        value={editProfile.name}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={editProfile.email}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        value={editProfile.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={editProfile.bio}
                      onChange={handleInputChange}
                      className="w-full h-24 p-3 border rounded-md"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                  <Button 
                    onClick={handleEditToggle}
                    className="bg-staffi-purple hover:bg-staffi-purple/90"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-gray-400" />
                    {profile.name}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {profile.email}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {profile.phone}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Bio</p>
                  <p className="mt-1 text-sm">{profile.bio}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Employment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Employment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Job Title</p>
                <p className="flex items-center gap-2 mt-1">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  {profile.role}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p className="flex items-center gap-2 mt-1">
                  <Building className="h-4 w-4 text-gray-400" />
                  {profile.department}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Employee ID</p>
                <p className="mt-1">{profile.employeeId}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Join Date</p>
                <p className="mt-1">{profile.joinDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;