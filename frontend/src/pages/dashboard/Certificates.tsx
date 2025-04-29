
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { 
  Award, 
  Plus, 
  User, 
  Calendar, 
  CheckCircle2, 
  ExternalLink,
  Search,
  Filter,
  SlidersHorizontal
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CertificateCard } from "@/components/certificates/certificate-card";
import { useMetaMask } from '@/contexts/MetaMaskContext';

const Certificates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [newCertificate, setNewCertificate] = useState({
    skillTitle: '',
    description: '',
    employee: ''
  });
  const { isConnected, connect } = useMetaMask();
  
  // Mock certificates data
  const [certificates, setCertificates] = useState([
    {
      id: "cert-001",
      skillTitle: "React Advanced Development",
      description: "Mastery in React hooks, context API, and performance optimization",
      employee: "Sarah Williams",
      employeeWallet: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      issueDate: "2025-01-15",
      txHash: "0x2c91d318987dfbf2c7e3adb7c534a22a2f7fed9ba8834128f867a5c9dab535af",
      issuer: "STAFFI HR"
    },
    {
      id: "cert-002",
      skillTitle: "Project Management Professional",
      description: "Demonstrated excellence in project planning, execution, and team leadership",
      employee: "Mark Johnson",
      employeeWallet: "0x8E5d75D60224eA0c33d0041E75DE12e2a373d6B4",
      issueDate: "2025-02-20",
      txHash: "0x7c85d428f693a6a97b74b9bbd5e31ddf573b2b5c516c8076acef2170e7b26b1e",
      issuer: "STAFFI HR"
    },
    {
      id: "cert-003",
      skillTitle: "UI/UX Design Principles",
      description: "Expert knowledge of user interface design, user experience, and accessibility",
      employee: "Lisa Chen",
      employeeWallet: "0x3273E381070d397297C4b2C034CA4EB00f0F98B0",
      issueDate: "2025-03-05",
      txHash: "0x9a4f1b5f0d3dadba054a3e7091c0d1f4c2c0a06c2c77f7b56138d050e195e157",
      issuer: "STAFFI HR"
    },
    {
      id: "cert-004",
      skillTitle: "Data Analysis with Python",
      description: "Proficiency in data processing, visualization, and machine learning with Python",
      employee: "Alex Thompson",
      employeeWallet: "0x56D23E9B49D79BB2F52C29B5F9a07dB91f7D7D7D",
      issueDate: "2025-03-12",
      txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      issuer: "STAFFI HR"
    }
  ]);

  // Mock employee data
  const employees = [
    { id: "emp-001", name: "Sarah Williams", wallet: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" },
    { id: "emp-002", name: "Mark Johnson", wallet: "0x8E5d75D60224eA0c33d0041E75DE12e2a373d6B4" },
    { id: "emp-003", name: "Lisa Chen", wallet: "0x3273E381070d397297C4b2C034CA4EB00f0F98B0" },
    { id: "emp-004", name: "Alex Thompson", wallet: "0x56D23E9B49D79BB2F52C29B5F9a07dB91f7D7D7D" },
    { id: "emp-005", name: "Michael Brown", wallet: "0x8B3a7DC2E02396c2133F22ee9f8301E40d31552f" }
  ];
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterChange = (value: string) => {
    setFilterBy(value);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCertificate(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEmployeeSelect = (value: string) => {
    setNewCertificate(prev => ({ ...prev, employee: value }));
  };
  
  const handleMintCertificate = async () => {
    if (!isConnected) {
      toast("Wallet connection required", {
        description: "Please connect your MetaMask wallet to mint certificates.",
      });
      return;
    }
    
    if (!newCertificate.skillTitle || !newCertificate.employee) {
      toast("Required fields missing", {
        description: "Please fill in all required fields to continue.",
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Mock blockchain minting process with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedEmployee = employees.find(emp => emp.id === newCertificate.employee);
      if (!selectedEmployee) throw new Error("Employee not found");
      
      const newCert = {
        id: `cert-00${certificates.length + 1}`,
        skillTitle: newCertificate.skillTitle,
        description: newCertificate.description,
        employee: selectedEmployee.name,
        employeeWallet: selectedEmployee.wallet,
        issueDate: new Date().toISOString().split('T')[0],
        txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        issuer: "STAFFI HR"
      };
      
      setCertificates(prev => [newCert, ...prev]);
      
      toast("Certificate minted successfully!", {
        description: `The certificate for ${selectedEmployee.name} has been minted on the blockchain.`,
      });
      
      setNewCertificate({
        skillTitle: '',
        description: '',
        employee: ''
      });
      
    } catch (error) {
      console.error("Error minting certificate:", error);
      toast("Failed to mint certificate", {
        description: "There was an error minting the certificate. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  // Filter certificates based on search and filter options
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = 
      cert.skillTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.employee.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (filterBy === 'all') return matchesSearch;
    
    const isRecent = new Date(cert.issueDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
    
    return matchesSearch && (
      (filterBy === 'recent' && isRecent) ||
      (filterBy === 'technical' && 
        (cert.skillTitle.toLowerCase().includes('development') || 
         cert.skillTitle.toLowerCase().includes('programming') ||
         cert.skillTitle.toLowerCase().includes('data') ||
         cert.skillTitle.toLowerCase().includes('python')))
    );
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Skill Certifications</h1>
          <p className="text-gray-500">
            Mint and manage blockchain-verified skill certifications for your employees
          </p>
        </div>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Certificates</p>
                <p className="text-3xl font-bold">{certificates.length}</p>
              </div>
              <div className="p-3 rounded-full bg-staffi-purple/10">
                <Award className="h-8 w-8 text-staffi-purple" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Certified Employees</p>
                <p className="text-3xl font-bold">{new Set(certificates.map(c => c.employee)).size}</p>
              </div>
              <div className="p-3 rounded-full bg-staffi-blue/10">
                <User className="h-8 w-8 text-staffi-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Issued This Month</p>
                <p className="text-3xl font-bold">
                  {certificates.filter(c => {
                    const today = new Date();
                    const certDate = new Date(c.issueDate);
                    return certDate.getMonth() === today.getMonth() && 
                           certDate.getFullYear() === today.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Mint Certificate Card */}
        <Card className="shadow-lg border-t-4 border-t-staffi-purple">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Mint New Certificate
            </CardTitle>
            <CardDescription>
              Create a blockchain-verified skill certificate NFT for an employee
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skillTitle">Skill/Certificate Title*</Label>
                  <Input 
                    id="skillTitle" 
                    name="skillTitle"
                    placeholder="e.g., Advanced React Development"
                    value={newCertificate.skillTitle}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    placeholder="Provide details about this certification"
                    className="min-h-[100px]"
                    value={newCertificate.description}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">Select Employee*</Label>
                  <Select value={newCertificate.employee} onValueChange={handleEmployeeSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Employees</SelectLabel>
                        {employees.map(emp => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Certificate will be minted to employee's blockchain wallet address
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={handleMintCertificate}
                    className="w-full bg-staffi-purple hover:bg-staffi-purple-dark"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Minting on Blockchain...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Mint Certificate NFT
                      </>
                    )}
                  </Button>
                  
                  {!isConnected && (
                    <p className="text-xs text-amber-600 mt-2 flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Wallet connection required to mint certificates
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Certificates List */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-2xl font-semibold">Minted Certificates</h2>
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-60">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search certificates..." 
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              
              <Select value={filterBy} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Certificates</SelectItem>
                  <SelectItem value="recent">Recently Issued</SelectItem>
                  <SelectItem value="technical">Technical Skills</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="hidden md:inline">Advanced Filters</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Advanced Filters</DialogTitle>
                    <DialogDescription>
                      Filter certificates by multiple criteria
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input type="date" placeholder="From" />
                        <Input type="date" placeholder="To" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Certificate Categories</Label>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="rounded-full">Technical</Button>
                        <Button variant="outline" size="sm" className="rounded-full">Soft Skills</Button>
                        <Button variant="outline" size="sm" className="rounded-full">Management</Button>
                        <Button variant="outline" size="sm" className="rounded-full">Leadership</Button>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline">Reset</Button>
                    <Button>Apply Filters</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.length > 0 ? (
              filteredCertificates.map((cert, index) => (
                <CertificateCard key={cert.id} certificate={cert} delay={index * 0.1} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 rounded-full bg-gray-100 mb-4">
                  <Award className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">No certificates found</h3>
                <p className="text-gray-500 max-w-md">
                  {searchQuery || filterBy !== 'all' ? 
                    "Try adjusting your search or filter criteria" : 
                    "Start by minting a new certificate for your employees"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificates;