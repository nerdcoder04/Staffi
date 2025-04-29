import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Upload, 
  ExternalLink, 
  Plus, 
  X, 
  Award, 
  FileImage, 
  Hexagon,
  Link,
  FileCheck,
  Medal,
  BadgeCheck
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import React from 'react';

interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate?: string;
  type: string;
  file: string;
  thumbnailUrl: string;
  status: 'active' | 'expired' | 'pending';
  blockchainData?: {
    verified: boolean;
    network: string;
    transactionId: string;
    explorerUrl: string;
  };
  description: string;
  skills: string[];
  icon: React.ReactNode;
}

const NFTCard = ({ certificate, onClick }: { certificate: Certificate, onClick: () => void }) => {
  // Create a reference for mouse move effect
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse move animation effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transition = 'transform 0.1s';
    };
    
    const handleMouseLeave = () => {
      if (!card) return;
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      card.style.transition = 'transform 0.5s';
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  // Get background gradient based on certificate type
  const getBackgroundGradient = () => {
    switch(certificate.type) {
      case 'Technical Certification':
        return 'from-blue-500/20 via-purple-500/20 to-indigo-500/20';
      case 'Professional Certification':
        return 'from-emerald-500/20 via-teal-500/20 to-green-500/20';
      case 'Methodology':
        return 'from-orange-500/20 via-amber-500/20 to-yellow-500/20';
      case 'Design':
        return 'from-pink-500/20 via-rose-500/20 to-red-500/20';
      default:
        return 'from-indigo-500/20 via-purple-500/20 to-staffi-purple/20';
    }
  };
  
  // Currency symbol based on blockchain
  const getCurrencySymbol = () => {
    if (!certificate.blockchainData) return '';
    
    switch(certificate.blockchainData.network) {
      case 'Ethereum': return 'ETH';
      case 'Polygon': return 'MATIC';
      case 'Mumbai': return 'MATIC';
      default: return '';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className={cn(
        "overflow-hidden border-0 shadow-lg relative h-full",
        "bg-gradient-to-br", 
        getBackgroundGradient(),
        "hover:shadow-xl transition-all duration-300"
      )}>
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/80 dark:bg-black/30 z-0"></div>
        
        {/* NFT Certification visual elements */}
        <div className="absolute top-3 right-3 z-10">
          {certificate.blockchainData?.verified && (
            <Badge className="bg-indigo-100 text-indigo-800 border border-indigo-300 flex items-center gap-1">
              <Hexagon className="h-3 w-3" /> Verified NFT
            </Badge>
          )}
        </div>
        
        <div className="absolute -left-6 -bottom-6 opacity-20 z-0">
          <Hexagon className="h-28 w-28 text-staffi-purple" strokeWidth={0.5} />
        </div>
        
        {/* Card Content */}
        <div className="relative z-10">
          <CardHeader className="pb-2 pt-6 flex flex-row items-start">
            <div className="mr-4 mt-1 p-2 bg-white/80 rounded-full shadow-sm">
              {certificate.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold line-clamp-2">{certificate.name}</h3>
              <p className="text-sm text-gray-600">Issued by {certificate.issuer}</p>
            </div>
          </CardHeader>
          
          <CardContent className="pb-5">
            <div className="flex flex-wrap gap-2 mt-2 mb-3">
              {certificate.skills.slice(0, 3).map((skill, idx) => (
                <Badge 
                  key={idx} 
                  variant="outline"
                  className="bg-white/50 text-xs"
                >
                  {skill}
                </Badge>
              ))}
              {certificate.skills.length > 3 && (
                <Badge variant="outline" className="bg-white/50 text-xs">
                  +{certificate.skills.length - 3} more
                </Badge>
              )}
            </div>
            
            <div className="flex justify-between items-center text-xs text-gray-600 mt-3 mb-1">
              <div className="flex items-center">
                {certificate.blockchainData?.network && (
                  <Badge variant="outline" className="text-[10px] py-0 h-5 bg-white/50 flex items-center">
                    <span className="mr-1">
                      {getCurrencySymbol()}
                    </span>
                    {certificate.blockchainData.network}
                  </Badge>
                )}
              </div>
              <span>Issued: {new Date(certificate.issuedDate).toLocaleDateString()}</span>
            </div>
            
            {certificate.blockchainData?.verified && (
              <div className="flex justify-end mt-3">
                <Button 
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 px-2 flex items-center text-indigo-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (certificate.blockchainData?.explorerUrl) {
                      window.open(certificate.blockchainData.explorerUrl, '_blank');
                    }
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View on Blockchain
                </Button>
              </div>
            )}
          </CardContent>
        </div>
        
        {/* Holographic effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"></div>
      </Card>
    </motion.div>
  );
};

const Certificates = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [newCertificate, setNewCertificate] = useState({
    name: '',
    issuer: '',
    issuedDate: '',
    expiryDate: '',
    type: 'Technical Certification',
    file: null as File | null,
    skills: '',
    description: ''
  });
  
  const [filterType, setFilterType] = useState<string | null>(null);
  
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: 1,
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      issuedDate: "2024-01-15",
      expiryDate: "2027-01-15",
      type: "Technical Certification",
      file: "certificate1.pdf",
      thumbnailUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDI2fHxjb2RpbmclMjBjZXJ0aWZpY2F0ZXxlbnwwfHx8fDE2MzQ2Njk5MzA&ixlib=rb-4.0.3&q=80&w=2000",
      status: 'active',
      blockchainData: {
        verified: true,
        network: 'Polygon',
        transactionId: '0x7c5e9a2d4c3b2a1e8f7d6c5b4a3d2e1f',
        explorerUrl: 'https://polygonscan.com/tx/0x7c5e9a2d4c3b2a1e8f7d6c5b4a3d2e1f'
      },
      description: "Advanced certification for designing distributed systems on AWS.",
      skills: ["AWS", "Cloud Architecture", "Infrastructure", "Security"],
      icon: <FileCheck className="h-5 w-5 text-blue-600" />
    },
    {
      id: 2,
      name: "Project Management Professional (PMP)",
      issuer: "Project Management Institute",
      issuedDate: "2023-06-10",
      expiryDate: "2026-06-10",
      type: "Professional Certification",
      file: "certificate2.pdf",
      thumbnailUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDMwfHxidXNpbmVzcyUyMGRvY3VtZW50fGVufDB8fHx8MTYzNDY3MDIyOA&ixlib=rb-4.0.3&q=80&w=2000",
      status: 'active',
      blockchainData: {
        verified: true,
        network: 'Ethereum',
        transactionId: '0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
        explorerUrl: 'https://etherscan.io/tx/0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4'
      },
      description: "Globally recognized certification for project management professionals.",
      skills: ["Project Management", "Leadership", "Risk Management", "Agile"],
      icon: <Award className="h-5 w-5 text-green-600" />
    },
    {
      id: 3,
      name: "Agile Scrum Master",
      issuer: "Scrum Alliance",
      issuedDate: "2023-09-22",
      type: "Methodology",
      file: "certificate3.pdf",
      thumbnailUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDEyfHxjb2RlfGVufDB8fHx8MTYzNDY2OTg5NQ&ixlib=rb-4.0.3&q=80&w=2000",
      status: 'active',
      blockchainData: {
        verified: true,
        network: 'Mumbai',
        transactionId: '0xf1e2d3c4b5a6f1e2d3c4b5a6f1e2d3c4',
        explorerUrl: 'https://mumbai.polygonscan.com/tx/0xf1e2d3c4b5a6f1e2d3c4b5a6f1e2d3c4'
      },
      description: "Certification for implementing agile methodologies and leading Scrum teams.",
      skills: ["Agile", "Scrum", "Sprint Planning", "Team Leadership"],
      icon: <BadgeCheck className="h-5 w-5 text-amber-600" />  // Updated to use BadgeCheck instead of Certificate
    },
    {
      id: 4,
      name: "UI/UX Design Fundamentals",
      issuer: "Design Academy",
      issuedDate: "2022-11-05",
      type: "Design",
      file: "certificate4.pdf",
      thumbnailUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDl8fGRlc2lnbnxlbnwwfHx8fDE2MzQ2NzAxNTQ&ixlib=rb-4.0.3&q=80&w=2000",
      status: 'active',
      blockchainData: {
        verified: false,
        network: '',
        transactionId: '',
        explorerUrl: ''
      },
      description: "Comprehensive training in user interface and experience design principles.",
      skills: ["UI Design", "UX Research", "Figma", "Prototyping"],
      icon: <Medal className="h-5 w-5 text-rose-600" />
    }
  ]);

  const handleOpenUploadDialog = () => {
    setIsUploadDialogOpen(true);
    setNewCertificate({
      name: '',
      issuer: '',
      issuedDate: '',
      expiryDate: '',
      type: 'Technical Certification',
      file: null,
      skills: '',
      description: ''
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewCertificate({
        ...newCertificate,
        file: e.target.files[0]
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCertificate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCertificate.file) {
      toast.error("Please select a certificate file to upload");
      return;
    }

    if (!newCertificate.name || !newCertificate.issuer || !newCertificate.issuedDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create a new certificate entry
    const skillsArray = newCertificate.skills.split(',').map(s => s.trim()).filter(Boolean);
    
    // Select an appropriate icon based on certificate type
    let icon;
    switch (newCertificate.type) {
      case 'Technical Certification':
        icon = <FileCheck className="h-5 w-5 text-blue-600" />;
        break;
      case 'Professional Certification':
        icon = <Award className="h-5 w-5 text-green-600" />;
        break;
      case 'Methodology':
        icon = <BadgeCheck className="h-5 w-5 text-amber-600" />;
        break;
      case 'Design':
        icon = <Medal className="h-5 w-5 text-rose-600" />;
        break;
      default:
        icon = <Hexagon className="h-5 w-5 text-staffi-purple" />;
    }

    const newCertificateEntry: Certificate = {
      id: Math.max(0, ...certificates.map(c => c.id)) + 1,
      name: newCertificate.name,
      issuer: newCertificate.issuer,
      issuedDate: newCertificate.issuedDate,
      expiryDate: newCertificate.expiryDate || undefined,
      type: newCertificate.type,
      file: URL.createObjectURL(newCertificate.file),
      thumbnailUrl: URL.createObjectURL(newCertificate.file),
      status: 'active',
      skills: skillsArray,
      description: newCertificate.description || `Certificate in ${newCertificate.name}`,
      icon,
      blockchainData: {
        verified: false, // New uploads start unverified
        network: '',
        transactionId: '',
        explorerUrl: ''
      }
    };

    setCertificates([...certificates, newCertificateEntry]);
    setIsUploadDialogOpen(false);
    toast.success("Certificate uploaded successfully. It will be verified on the blockchain soon.");
  };

  const handleViewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsViewDialogOpen(true);
  };

  const handleDeleteCertificate = (certificateId: number) => {
    setCertificates(certificates.filter(cert => cert.id !== certificateId));
    setIsViewDialogOpen(false);
    toast.success("Certificate deleted");
  };

  const handleShareCertificate = () => {
    if (selectedCertificate) {
      // Generate a shareable link (this would be implemented with your actual sharing mechanism)
      const shareableLink = `https://staffi.app/certificates/public/${selectedCertificate.id}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(shareableLink)
        .then(() => toast.success("Public certificate link copied to clipboard"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  // Filter certificates by type
  const filteredCertificates = filterType 
    ? certificates.filter(cert => cert.type === filterType)
    : certificates;

  // Stats for the certificate types
  const certificateStats = {
    total: certificates.length,
    verified: certificates.filter(cert => cert.blockchainData?.verified).length,
    byType: {
      'Technical Certification': certificates.filter(cert => cert.type === 'Technical Certification').length,
      'Professional Certification': certificates.filter(cert => cert.type === 'Professional Certification').length,
      'Methodology': certificates.filter(cert => cert.type === 'Methodology').length,
      'Design': certificates.filter(cert => cert.type === 'Design').length,
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">My Blockchain Certificates</h2>
          <p className="text-gray-600">Permanent, verifiable proof of your skills and achievements</p>
        </div>
        
        <div className="flex gap-3">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-4">Filter By</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] p-2 gap-1">
                    <li>
                      <button
                        onClick={() => setFilterType(null)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm",
                          !filterType && "bg-staffi-purple/10 text-staffi-purple font-medium"
                        )}
                      >
                        All Certificates ({certificateStats.total})
                      </button>
                    </li>
                    {Object.entries(certificateStats.byType).map(([type, count]) => (
                      <li key={type}>
                        <button
                          onClick={() => setFilterType(type)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-md text-sm",
                            filterType === type && "bg-staffi-purple/10 text-staffi-purple font-medium"
                          )}
                        >
                          {type} ({count})
                        </button>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <Button 
            onClick={handleOpenUploadDialog}
            className="bg-staffi-purple hover:bg-staffi-purple/90"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Certificate
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm border border-staffi-purple/10 hover:shadow-md transition-shadow">
          <CardContent className="pt-6 px-4 flex flex-col items-center text-center">
            <Award className="h-8 w-8 text-staffi-purple mb-2" />
            <h3 className="text-lg font-semibold">{certificateStats.total}</h3>
            <p className="text-sm text-gray-600">Total Certificates</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border border-indigo-500/10 hover:shadow-md transition-shadow">
          <CardContent className="pt-6 px-4 flex flex-col items-center text-center">
            <Hexagon className="h-8 w-8 text-indigo-500 mb-2" />
            <h3 className="text-lg font-semibold">{certificateStats.verified}</h3>
            <p className="text-sm text-gray-600">Blockchain Verified</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border border-green-500/10 hover:shadow-md transition-shadow">
          <CardContent className="pt-6 px-4 flex flex-col items-center text-center">
            <FileCheck className="h-8 w-8 text-green-500 mb-2" />
            <h3 className="text-lg font-semibold">{Object.values(certificateStats.byType)[0] || 0}</h3>
            <p className="text-sm text-gray-600">Technical Certs</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm border border-amber-500/10 hover:shadow-md transition-shadow">
          <CardContent className="pt-6 px-4 flex flex-col items-center text-center">
            <Medal className="h-8 w-8 text-amber-500 mb-2" />
            <h3 className="text-lg font-semibold">{Object.values(certificateStats.byType)[1] || 0}</h3>
            <p className="text-sm text-gray-600">Professional Certs</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Certificate NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertificates.map((certificate) => (
          <NFTCard 
            key={certificate.id}
            certificate={certificate}
            onClick={() => handleViewCertificate(certificate)}
          />
        ))}
        
        {filteredCertificates.length === 0 && (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-16 bg-white rounded-lg shadow-sm">
            <FileImage className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No Certificates Found</h3>
            <p className="text-gray-500 mb-6">
              {filterType ? `No ${filterType} certificates found` : 'Upload your first certificate to get started'}
            </p>
            <Button 
              onClick={handleOpenUploadDialog}
              className="bg-staffi-purple hover:bg-staffi-purple/90"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Certificate
            </Button>
          </div>
        )}
      </div>
      
      {/* Upload Certificate Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Upload Certificate</DialogTitle>
            <DialogDescription>
              Upload and add a new certificate to your profile. Certificates can be verified on the blockchain for permanent proof of your achievements.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUploadCertificate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="file">Certificate File</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  id="file" 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                />
                {!newCertificate.file ? (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400">PDF, JPG or PNG (max. 5MB)</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FileImage className="h-5 w-5 text-staffi-purple" />
                    <span className="text-sm font-medium">{newCertificate.file.name}</span>
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewCertificate({...newCertificate, file: null});
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Certificate Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="e.g., AWS Certified Solutions Architect"
                  value={newCertificate.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="issuer">Issuing Organization</Label>
                <Input 
                  id="issuer" 
                  name="issuer" 
                  placeholder="e.g., Amazon Web Services"
                  value={newCertificate.issuer}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issuedDate">Issue Date</Label>
                <Input 
                  id="issuedDate" 
                  name="issuedDate" 
                  type="date" 
                  value={newCertificate.issuedDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <Input 
                  id="expiryDate" 
                  name="expiryDate" 
                  type="date" 
                  value={newCertificate.expiryDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Certificate Type</Label>
              <select
                id="type"
                name="type"
                className="w-full p-2 border rounded-md"
                value={newCertificate.type}
                onChange={handleInputChange}
              >
                <option value="Technical Certification">Technical Certification</option>
                <option value="Professional Certification">Professional Certification</option>
                <option value="Methodology">Methodology</option>
                <option value="Design">Design</option>
                <option value="Compliance">Compliance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Input 
                id="skills" 
                name="skills" 
                placeholder="e.g., Cloud Computing, AWS, Security"
                value={newCertificate.skills}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <textarea
                id="description"
                name="description"
                className="w-full p-2 border rounded-md min-h-[80px]"
                placeholder="Brief description of what this certificate represents"
                value={newCertificate.description}
                onChange={handleInputChange}
              />
            </div>
            
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-staffi-purple hover:bg-staffi-purple/90"
              >
                Upload Certificate
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* View Certificate Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedCertificate && (
            <>
              <DialogHeader>
                <DialogTitle>
                  <span className="flex items-center gap-2">
                    {selectedCertificate.name}
                    {selectedCertificate.blockchainData?.verified && (
                      <Badge className="bg-indigo-100 text-indigo-800 h-6">Blockchain Verified</Badge>
                    )}
                  </span>
                </DialogTitle>
                <DialogDescription>
                  {selectedCertificate.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="relative rounded-lg overflow-hidden bg-gray-50 shadow-inner h-72 flex items-center justify-center">
                  <img 
                    src={selectedCertificate.thumbnailUrl} 
                    alt={selectedCertificate.name} 
                    className="object-contain max-h-full max-w-full" 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">Certificate Details</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Type</span>
                          <span>{selectedCertificate.type}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Issuer</span>
                          <span>{selectedCertificate.issuer}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Issue Date</span>
                          <span>{new Date(selectedCertificate.issuedDate).toLocaleDateString()}</span>
                        </div>
                        {selectedCertificate.expiryDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Expiry Date</span>
                            <span>{new Date(selectedCertificate.expiryDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold">Skills</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCertificate.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedCertificate.blockchainData?.verified && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Blockchain Verification</h3>
                      <div className="space-y-4">
                        <div className="rounded-lg border p-4 bg-indigo-50/50">
                          <div className="flex items-center mb-3">
                            <Hexagon className="h-5 w-5 mr-2 text-indigo-600" />
                            <h4 className="font-medium">Verified on {selectedCertificate.blockchainData.network}</h4>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Transaction ID</span>
                              <span className="font-mono text-xs">{selectedCertificate.blockchainData.transactionId.slice(0, 8)}...{selectedCertificate.blockchainData.transactionId.slice(-6)}</span>
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-2 text-indigo-700 border-indigo-200 bg-indigo-50 hover:bg-indigo-100"
                              onClick={() => window.open(selectedCertificate.blockchainData?.explorerUrl, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View on {selectedCertificate.blockchainData.network} Explorer
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            className="w-full"
                            onClick={handleShareCertificate}
                          >
                            <Link className="h-4 w-4 mr-2" />
                            Share Public Certificate Link
                          </Button>
                          <p className="text-xs text-gray-500 mt-1 text-center">
                            Share this certificate with anyone, even if they don't have a STAFFI account
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <DialogFooter className="pt-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteCertificate(selectedCertificate.id)}
                  >
                    Delete Certificate
                  </Button>
                  <div className="flex-1"></div>
                  <Button 
                    className="bg-staffi-purple hover:bg-staffi-purple/90 flex items-center gap-2"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = selectedCertificate.file;
                      link.download = `${selectedCertificate.name}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      toast.success('Certificate downloaded successfully');
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Certificates;
