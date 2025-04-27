
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { GlassPanel } from "@/components/dashboard/glass-panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import {
  Settings as SettingsIcon,
  Save,
  BellRing,
  Globe,
  Lock,
  Key,
  CreditCard,
  FileText,
  Building,
  Send,
  Users,
  BookOpen,
  PencilLine,
  Lightbulb,
  Hexagon,
  Mail,
  MessageSquare,
  Smartphone,
  Calendar,
  Award,
  Link
} from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");

  // Company settings form state
  const [companySettings, setCompanySettings] = useState({
    name: "Staffi Co.",
    website: "https://staffico.example.com",
    email: "contact@staffico.example.com",
    phone: "+1 (555) 234-5678",
    address: "789 Enterprise Blvd, Suite 400, San Francisco, CA 94107",
    industry: "Technology",
    size: "50-200",
    taxId: "98-7654321"
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    slack: true,
    browser: true,
    mobileApp: false,
    dailyDigest: true,
    weeklyReport: true
  });

  // Blockchain settings state
  const [blockchainSettings, setBlockchainSettings] = useState({
    enableBlockchain: true,
    network: "Ethereum Mainnet",
    enableNFTCertificates: true,
    automaticTokenDistribution: true,
    transparentPayroll: false
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    googleWorkspace: true,
    slack: true,
    microsoftTeams: false,
    zoom: true,
    jira: false,
    github: true
  });

  const handleCompanyUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Company Settings Updated",
      description: "Your company settings have been saved successfully.",
    });
  };

  const handleToggle = (setting: string, section: string) => {
    if (section === 'notifications') {
      setNotificationSettings({
        ...notificationSettings,
        [setting]: !notificationSettings[setting as keyof typeof notificationSettings]
      });
      toast({
        title: "Notification Setting Updated",
        description: `${setting.charAt(0).toUpperCase() + setting.slice(1)} notifications ${notificationSettings[setting as keyof typeof notificationSettings] ? 'disabled' : 'enabled'}.`,
      });
    } else if (section === 'blockchain') {
      setBlockchainSettings({
        ...blockchainSettings,
        [setting]: !blockchainSettings[setting as keyof typeof blockchainSettings]
      });
      toast({
        title: "Blockchain Setting Updated",
        description: `${setting.charAt(0).toUpperCase() + setting.slice(1).replace(/([A-Z])/g, ' $1')} ${blockchainSettings[setting as keyof typeof blockchainSettings] ? 'disabled' : 'enabled'}.`,
      });
    } else if (section === 'integrations') {
      setIntegrationSettings({
        ...integrationSettings,
        [setting]: !integrationSettings[setting as keyof typeof integrationSettings]
      });
      toast({
        title: "Integration Updated",
        description: `${setting.charAt(0).toUpperCase() + setting.slice(1).replace(/([A-Z])/g, ' $1')} integration ${integrationSettings[setting as keyof typeof integrationSettings] ? 'disconnected' : 'connected'}.`,
      });
    }
  };

  const handlePaymentMethodAdd = () => {
    toast({
      title: "Payment Method Added",
      description: "Your new payment method has been added successfully.",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500 mt-1">Configure your platform settings and preferences</p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 md:w-2/3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="blockchain">Web3</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature Summary */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <GlassPanel className="p-6" variant="light">
                <div className="flex flex-col">
                  <SettingsIcon className="h-8 w-8 text-staffi-purple mb-4" />
                  <h3 className="text-xl font-bold mb-2">Company Settings</h3>
                  <p className="text-gray-500 mb-4">Configure your organization's details and preferences</p>
                  
                  <div className="space-y-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Company Profile</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Contact Information</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Billing Details</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span className="text-sm">Advanced Settings</span>
                    </div>
                  </div>
                </div>
              </GlassPanel>

              <div className="grid grid-cols-1 gap-4 mt-4">
                <StatCard 
                  title="Subscription" 
                  value="Enterprise" 
                  subtitle="Active until Apr 25, 2026"
                  icon={<FileText className="w-5 h-5 text-staffi-purple" />} 
                  animate 
                  delay={1}
                  variant="accent" 
                />
              </div>
            </motion.div>

            {/* Settings Form */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Update your organization details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCompanyUpdate}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input 
                            id="companyName" 
                            value={companySettings.name} 
                            onChange={e => setCompanySettings({...companySettings, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input 
                            id="website" 
                            value={companySettings.website} 
                            onChange={e => setCompanySettings({...companySettings, website: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Contact Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={companySettings.email} 
                            onChange={e => setCompanySettings({...companySettings, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            value={companySettings.phone} 
                            onChange={e => setCompanySettings({...companySettings, phone: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address" 
                          value={companySettings.address} 
                          onChange={e => setCompanySettings({...companySettings, address: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry</Label>
                          <select 
                            id="industry"
                            className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md"
                            value={companySettings.industry}
                            onChange={e => setCompanySettings({...companySettings, industry: e.target.value})}
                          >
                            <option value="Technology">Technology</option>
                            <option value="Finance">Finance</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Education">Education</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Retail">Retail</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companySize">Company Size</Label>
                          <select 
                            id="companySize"
                            className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md"
                            value={companySettings.size}
                            onChange={e => setCompanySettings({...companySettings, size: e.target.value})}
                          >
                            <option value="1-10">1-10</option>
                            <option value="11-50">11-50</option>
                            <option value="50-200">50-200</option>
                            <option value="201-500">201-500</option>
                            <option value="501-1000">501-1000</option>
                            <option value="1000+">1000+</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="taxId">Tax ID / EIN</Label>
                          <Input 
                            id="taxId" 
                            value={companySettings.taxId} 
                            onChange={e => setCompanySettings({...companySettings, taxId: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button type="submit">
                        <Save className="w-4 h-4 mr-2" /> Update Company Info
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Billing & Payment Methods</CardTitle>
                  <CardDescription>Manage your billing information and payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-8 w-8 text-gray-500" />
                        <div>
                          <p className="font-medium">VISA ending in 4242</p>
                          <p className="text-sm text-gray-500">Expires: 04/2025</p>
                        </div>
                      </div>
                      <Badge>Default</Badge>
                    </div>

                    <Button variant="outline" onClick={handlePaymentMethodAdd}>
                      + Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="md:col-span-1">
              <GlassPanel className="p-6" variant="light">
                <div className="flex flex-col">
                  <BellRing className="h-8 w-8 text-staffi-purple mb-4" />
                  <h3 className="text-xl font-bold mb-2">Notification Center</h3>
                  <p className="text-gray-500 mb-4">Configure how and when you receive notifications</p>
                  
                  <div className="space-y-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Email Notifications</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">In-App Alerts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Integration Notifications</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span className="text-sm">Mobile Notifications</span>
                    </div>
                  </div>
                </div>
              </GlassPanel>

              <div className="grid grid-cols-1 gap-4 mt-4">
                <StatCard 
                  title="Notification Channels" 
                  value="4 Active" 
                  subtitle="Of 6 available channels"
                  icon={<Send className="w-5 h-5 text-staffi-purple" />} 
                  animate 
                  delay={1}
                  variant="accent" 
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Channels</CardTitle>
                  <CardDescription>Configure your notification delivery preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-4">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-500">Get notified via email</p>
                          </div>
                        </div>
                        <Switch 
                          checked={notificationSettings.email} 
                          onCheckedChange={() => handleToggle('email', 'notifications')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-4">
                          <MessageSquare className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Slack</p>
                            <p className="text-sm text-gray-500">Receive notifications in Slack</p>
                          </div>
                        </div>
                        <Switch 
                          checked={notificationSettings.slack} 
                          onCheckedChange={() => handleToggle('slack', 'notifications')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-4">
                          <Globe className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Browser Notifications</p>
                            <p className="text-sm text-gray-500">Get desktop alerts</p>
                          </div>
                        </div>
                        <Switch 
                          checked={notificationSettings.browser} 
                          onCheckedChange={() => handleToggle('browser', 'notifications')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-4">
                          <Smartphone className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Mobile App</p>
                            <p className="text-sm text-gray-500">Send to mobile device</p>
                          </div>
                        </div>
                        <Switch 
                          checked={notificationSettings.mobileApp} 
                          onCheckedChange={() => handleToggle('mobileApp', 'notifications')}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Notification Frequency</CardTitle>
                  <CardDescription>Configure how often you receive updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-4">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Daily Digest</p>
                            <p className="text-sm text-gray-500">Receive a summary each day</p>
                          </div>
                        </div>
                        <Switch 
                          checked={notificationSettings.dailyDigest} 
                          onCheckedChange={() => handleToggle('dailyDigest', 'notifications')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-4">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Weekly Report</p>
                            <p className="text-sm text-gray-500">Get a weekly activity summary</p>
                          </div>
                        </div>
                        <Switch 
                          checked={notificationSettings.weeklyReport} 
                          onCheckedChange={() => handleToggle('weeklyReport', 'notifications')}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button onClick={() => {
                        toast({
                          title: "Notification Settings Saved",
                          description: "Your notification preferences have been updated."
                        });
                      }}>
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="blockchain" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="md:col-span-1">
              <GlassPanel className="p-6" variant="light">
                <div className="flex flex-col">
                  <Hexagon className="h-8 w-8 text-staffi-purple mb-4" />
                  <h3 className="text-xl font-bold mb-2">Web3 Configuration</h3>
                  <p className="text-gray-500 mb-4">Configure your blockchain and Web3 settings</p>
                  
                  <div className="space-y-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Blockchain Networks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">NFT Certificate Settings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Web3 Identity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span className="text-sm">Smart Contracts</span>
                    </div>
                  </div>
                </div>
              </GlassPanel>

              <div className="grid grid-cols-1 gap-4 mt-4">
                <StatCard 
                  title="Connected Networks" 
                  value="2" 
                  subtitle="Ethereum, Polygon"
                  icon={<Hexagon className="w-5 h-5 text-staffi-purple" />} 
                  animate 
                  delay={1}
                  variant="accent" 
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Settings</CardTitle>
                  <CardDescription>Configure your blockchain and Web3 functionality</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-4">
                          <Hexagon className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Enable Blockchain Features</p>
                            <p className="text-sm text-gray-500">Enable all Web3 functionality</p>
                          </div>
                        </div>
                        <Switch 
                          checked={blockchainSettings.enableBlockchain} 
                          onCheckedChange={() => handleToggle('enableBlockchain', 'blockchain')}
                        />
                      </div>
                      
                      {blockchainSettings.enableBlockchain && (
                        <>
                          <div className="ml-9 pl-4 border-l border-gray-200">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-4">
                                  <Award className="h-5 w-5 text-gray-500" />
                                  <div>
                                    <p className="font-medium">NFT Certificates</p>
                                    <p className="text-sm text-gray-500">Issue certificates as NFTs</p>
                                  </div>
                                </div>
                                <Switch 
                                  checked={blockchainSettings.enableNFTCertificates} 
                                  onCheckedChange={() => handleToggle('enableNFTCertificates', 'blockchain')}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-4">
                                  <CreditCard className="h-5 w-5 text-gray-500" />
                                  <div>
                                    <p className="font-medium">Automatic Token Distribution</p>
                                    <p className="text-sm text-gray-500">Issue tokens for performance</p>
                                  </div>
                                </div>
                                <Switch 
                                  checked={blockchainSettings.automaticTokenDistribution} 
                                  onCheckedChange={() => handleToggle('automaticTokenDistribution', 'blockchain')}
                                />
                              </div>

                              <div className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-4">
                                  <FileText className="h-5 w-5 text-gray-500" />
                                  <div>
                                    <p className="font-medium">Transparent Payroll</p>
                                    <p className="text-sm text-gray-500">Record payroll on blockchain</p>
                                  </div>
                                </div>
                                <Switch 
                                  checked={blockchainSettings.transparentPayroll} 
                                  onCheckedChange={() => handleToggle('transparentPayroll', 'blockchain')}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="network">Default Network</Label>
                              <select 
                                id="network"
                                className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md"
                                value={blockchainSettings.network}
                                onChange={e => setBlockchainSettings({...blockchainSettings, network: e.target.value})}
                              >
                                <option value="Ethereum Mainnet">Ethereum Mainnet</option>
                                <option value="Ethereum Goerli">Ethereum Goerli (Testnet)</option>
                                <option value="Polygon Mainnet">Polygon Mainnet</option>
                                <option value="Polygon Mumbai">Polygon Mumbai (Testnet)</option>
                              </select>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button onClick={() => {
                        toast({
                          title: "Web3 Settings Saved",
                          description: "Your blockchain configurations have been updated."
                        });
                      }}>
                        Save Web3 Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="md:col-span-1">
              <GlassPanel className="p-6" variant="light">
                <div className="flex flex-col">
                  <Lightbulb className="h-8 w-8 text-staffi-purple mb-4" />
                  <h3 className="text-xl font-bold mb-2">Integrations</h3>
                  <p className="text-gray-500 mb-4">Connect with other services and platforms</p>
                  
                  <div className="space-y-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Productivity Tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Communication Platforms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <span className="text-sm">Project Management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Development Tools</span>
                    </div>
                  </div>
                </div>
              </GlassPanel>

              <div className="grid grid-cols-1 gap-4 mt-4">
                <StatCard 
                  title="Active Integrations" 
                  value="4" 
                  subtitle="Of 6 available services"
                  icon={<Link className="w-5 h-5 text-staffi-purple" />} 
                  animate 
                  delay={1}
                  variant="accent" 
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Services</CardTitle>
                  <CardDescription>Manage your integrated third-party services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2 border-b pb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22,12A10,10,0,1,1,12,2,10,10,0,0,1,22,12Z" />
                              <path fill="white" d="M12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Google Workspace</p>
                            <p className="text-sm text-gray-500">Connect with Google services</p>
                          </div>
                        </div>
                        <Switch 
                          checked={integrationSettings.googleWorkspace} 
                          onCheckedChange={() => handleToggle('googleWorkspace', 'integrations')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b pb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M5,22H19a3,3,0,0,0,3-3V5a3,3,0,0,0-3-3H5A3,3,0,0,0,2,5V19A3,3,0,0,0,5,22Z" />
                              <path fill="white" d="M16,11.25l-3.25-3v2.25h-7v1.5h7v2.25Z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Slack</p>
                            <p className="text-sm text-gray-500">Team communication platform</p>
                          </div>
                        </div>
                        <Switch 
                          checked={integrationSettings.slack} 
                          onCheckedChange={() => handleToggle('slack', 'integrations')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b pb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Z" />
                              <path fill="white" d="M16,10.5H13v-3H11v3H8v2h3v3h2v-3h3Z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Microsoft Teams</p>
                            <p className="text-sm text-gray-500">Microsoft collaboration tool</p>
                          </div>
                        </div>
                        <Switch 
                          checked={integrationSettings.microsoftTeams} 
                          onCheckedChange={() => handleToggle('microsoftTeams', 'integrations')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b pb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Z" />
                              <path fill="white" d="M10,16.5l6-4.5-6-4.5Z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Zoom</p>
                            <p className="text-sm text-gray-500">Video conferencing</p>
                          </div>
                        </div>
                        <Switch 
                          checked={integrationSettings.zoom} 
                          onCheckedChange={() => handleToggle('zoom', 'integrations')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b pb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M2,12A10,10,0,1,1,12,22,10,10,0,0,1,2,12Z" />
                              <path fill="white" d="M7,14l2.5-5,2.5,3L14.5,9,17,14Z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Jira</p>
                            <p className="text-sm text-gray-500">Project management tool</p>
                          </div>
                        </div>
                        <Switch 
                          checked={integrationSettings.jira} 
                          onCheckedChange={() => handleToggle('jira', 'integrations')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Z" />
                              <path fill="white" d="M7.5,12A1.5,1.5,0,1,1,9,10.5,1.5,1.5,0,0,1,7.5,12Zm4.5,0A1.5,1.5,0,1,1,13.5,10.5,1.5,1.5,0,0,1,12,12Zm4.5,0A1.5,1.5,0,1,1,18,10.5,1.5,1.5,0,0,1,16.5,12Z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">GitHub</p>
                            <p className="text-sm text-gray-500">Code repository</p>
                          </div>
                        </div>
                        <Switch 
                          checked={integrationSettings.github} 
                          onCheckedChange={() => handleToggle('github', 'integrations')}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                      <Button variant="outline">
                        Browse More Integrations
                      </Button>
                      
                      <Button onClick={() => {
                        toast({
                          title: "Integration Settings Saved",
                          description: "Your integration preferences have been updated."
                        });
                      }}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Settings;
