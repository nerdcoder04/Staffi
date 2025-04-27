import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Award, 
  Calendar, 
  CheckCircle, 
  XCircle,
  FileText,
  ExternalLink,
  Clock,
  FileCheck,
  Shield,
  Users,
  FileCheck2 as CertificateIcon,
  Lightbulb,
  Medal,
  Code,
  Check as VerifiedIcon
} from 'lucide-react';
import StaffiButton from '@/components/ui/staffi-button';
import { cn } from '@/lib/utils';

interface Certificate {
  id: number;
  name: string;
  type: string;
  issueDate: string;
  expiryDate?: string;
  issuedBy: string;
  status: string;
  assignedTo: string;
  document?: string;
  color: string;
  blockchain: {
    verified: boolean;
    hash: string;
    network: string;
  };
  skills: string[];
  description: string;
}

const Certificates: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: 1,
      name: 'Certified Scrum Master',
      type: 'Professional Certification',
      issueDate: '2023-01-15',
      expiryDate: '2025-01-15',
      issuedBy: 'Scrum Alliance',
      status: 'Active',
      assignedTo: 'John Doe',
      color: '#2ecc71',
      blockchain: {
        verified: true,
        hash: 'a1b2c3d4e5f6',
        network: 'Ethereum',
      },
      skills: ['Agile', 'Scrum', 'Project Management'],
      description: 'Certification for Scrum methodology.',
    },
    {
      id: 2,
      name: 'AWS Certified Cloud Practitioner',
      type: 'Technical Certification',
      issueDate: '2022-11-20',
      issuedBy: 'Amazon Web Services',
      status: 'Active',
      assignedTo: 'Jane Smith',
      color: '#3498db',
      blockchain: {
        verified: false,
        hash: 'f1e2d3c4b5a6',
        network: 'None',
      },
      skills: ['Cloud Computing', 'AWS', 'Cloud Services'],
      description: 'Certification for AWS cloud services.',
    },
    {
      id: 3,
      name: 'Project Management Professional',
      type: 'Professional Certification',
      issueDate: '2023-05-10',
      expiryDate: '2026-05-10',
      issuedBy: 'PMI',
      status: 'Active',
      assignedTo: 'Alice Johnson',
      color: '#e74c3c',
      blockchain: {
        verified: true,
        hash: '9876543210abcdef',
        network: 'Hyperledger Fabric',
      },
      skills: ['Project Management', 'Leadership', 'Planning'],
      description: 'Certification for project management professionals.',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const { toast } = useToast();

  const handleCertificateClick = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setOpenDialog(true);
  };

  const handleDownload = () => {
    if (selectedCertificate?.document) {
      toast({
        title: "Download Started",
        description: `Downloading ${selectedCertificate.name} document.`,
      });
    } else {
      toast({
        title: "No Document",
        description: "No document available for this certificate.",
        variant: "destructive",
      });
    }
  };

  const handleBlockchainVerification = () => {
    if (selectedCertificate?.blockchain.verified) {
      toast({
        title: "Blockchain Verified",
        description: `Certificate ${selectedCertificate.name} is verified on the ${selectedCertificate.blockchain.network} blockchain.`,
      });
    } else {
      toast({
        title: "Blockchain Not Verified",
        description: "This certificate has not been verified on the blockchain.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Certificates</h1>
        <div className="space-x-2">
          <Button variant="outline" className="flex items-center">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button className="bg-staffi-purple text-white hover:bg-staffi-purple-dark flex items-center">
            <Plus className="mr-2 h-4 w-4" /> Add Certificate
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => handleCertificateClick(certificate)}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{certificate.name}</CardTitle>
                  <CertificateIcon className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">
                    <p>Type: {certificate.type}</p>
                    <p>Issued By: {certificate.issuedBy}</p>
                    <Badge className="mt-2 bg-green-100 text-green-800">{certificate.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="active">
          <div>Active Certificates Content</div>
        </TabsContent>
        <TabsContent value="expired">
          <div>Expired Certificates Content</div>
        </TabsContent>
      </Tabs>

      {/* Certificate Details Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedCertificate?.name}</DialogTitle>
            <DialogDescription>
              {selectedCertificate?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="certificate-type" className="text-right">
                Type
              </Label>
              <Input id="certificate-type" value={selectedCertificate?.type || ''} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="issued-by" className="text-right">
                Issued By
              </Label>
              <Input id="issued-by" value={selectedCertificate?.issuedBy || ''} className="col-span-3" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="issue-date" className="text-right">
                Issue Date
              </Label>
              <Input id="issue-date" value={selectedCertificate?.issueDate || ''} className="col-span-3" readOnly />
            </div>
            {selectedCertificate?.expiryDate && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expiry-date" className="text-right">
                  Expiry Date
                </Label>
                <Input id="expiry-date" value={selectedCertificate?.expiryDate || ''} className="col-span-3" readOnly />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skills" className="text-right">
                Skills
              </Label>
              <Input id="skills" value={selectedCertificate?.skills.join(', ') || ''} className="col-span-3" readOnly />
            </div>
            {selectedCertificate?.blockchain && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="blockchain" className="text-right">
                  Blockchain
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  {selectedCertificate.blockchain.verified ? (
                    <VerifiedIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span>{selectedCertificate.blockchain.network}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpenDialog(false)}>
              Close
            </Button>
            <Button type="button" onClick={handleDownload}>
              Download
            </Button>
            {selectedCertificate?.blockchain && (
              <Button type="button" variant="outline" onClick={handleBlockchainVerification}>
                Verify on Blockchain
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Certificates;
