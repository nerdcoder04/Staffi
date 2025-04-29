import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Lock, Bell, LogOut } from "lucide-react";
import { GlassPanel } from "@/components/dashboard/glass-panel";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    leaveRequests: true,
    projectUpdates: true,
    teamAnnouncements: true,
    certificateReminders: false
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.new !== password.confirm) {
      toast.error("New passwords don't match!");
      return;
    }
    
    if (password.new.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    // Reset fields and show success message
    toast.success("Password changed successfully");
    setPassword({
      current: '',
      new: '',
      confirm: ''
    });
  };
  
  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast.success(`Notification preference updated`);
  };
  
  const handleLogout = () => {
    toast.success("Logging out...");
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Lock className="h-5 w-5 text-staffi-purple" />
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={password.current}
                onChange={(e) => setPassword({...password, current: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password.new}
                  onChange={(e) => setPassword({...password, new: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={password.confirm}
                  onChange={(e) => setPassword({...password, confirm: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                type="submit"
                className="bg-staffi-purple hover:bg-staffi-purple/90"
              >
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Notification Preferences */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Bell className="h-5 w-5 text-staffi-purple" />
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <Switch 
                checked={notifications.email}
                onCheckedChange={() => handleNotificationToggle('email')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Push Notifications</h4>
                <p className="text-sm text-gray-500">Receive updates via browser notifications</p>
              </div>
              <Switch 
                checked={notifications.push}
                onCheckedChange={() => handleNotificationToggle('push')}
              />
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Notification Categories</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Leave Request Updates</p>
                  </div>
                  <Switch 
                    checked={notifications.leaveRequests}
                    onCheckedChange={() => handleNotificationToggle('leaveRequests')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Project Updates</p>
                  </div>
                  <Switch 
                    checked={notifications.projectUpdates}
                    onCheckedChange={() => handleNotificationToggle('projectUpdates')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Team Announcements</p>
                  </div>
                  <Switch 
                    checked={notifications.teamAnnouncements}
                    onCheckedChange={() => handleNotificationToggle('teamAnnouncements')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Certificate Reminders</p>
                  </div>
                  <Switch 
                    checked={notifications.certificateReminders}
                    onCheckedChange={() => handleNotificationToggle('certificateReminders')}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <GlassPanel className="p-5" variant="light">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium">Log Out</h3>
                  <p className="text-sm text-gray-500">Sign out from your account</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="bg-white border-red-200 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </GlassPanel>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
