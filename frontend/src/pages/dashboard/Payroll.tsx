
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { 
  Wallet, 
  Download, 
  Filter, 
  ChevronUp, 
  ChevronDown,
  AlertCircle,
  CreditCard,
  PieChart,
  BarChart4,
  ArrowUpRight,
  CheckCircle,
  Calendar,
  Search,
  Eye,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import StaffiButton from '@/components/ui/staffi-button';

const Payroll = () => {
  const [activeTab, setActiveTab] = useState('payslips');
  const [sortConfig, setSortConfig] = useState({ key: 'period', direction: 'desc' });
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  const paymentTransactions = [
    {
      id: 1,
      employeeId: "EMP001",
      employee: "Sarah Williams",
      position: "HR Manager",
      period: "April 2023",
      paymentDate: "Apr 30, 2023",
      grossAmount: 4500,
      deductions: 1350,
      netAmount: 3150,
      status: "Paid"
    },
    {
      id: 2,
      employeeId: "EMP002",
      employee: "John Smith",
      position: "Software Engineer",
      period: "April 2023",
      paymentDate: "Apr 30, 2023",
      grossAmount: 5200,
      deductions: 1560,
      netAmount: 3640,
      status: "Paid"
    },
    {
      id: 3,
      employeeId: "EMP003",
      employee: "Emily Johnson",
      position: "UI/UX Designer",
      period: "April 2023",
      paymentDate: "Apr 30, 2023",
      grossAmount: 4100,
      deductions: 1230,
      netAmount: 2870,
      status: "Paid"
    },
    {
      id: 4,
      employeeId: "EMP004",
      employee: "Michael Brown",
      position: "Product Manager",
      period: "April 2023",
      paymentDate: "Apr 30, 2023",
      grossAmount: 5800,
      deductions: 1740,
      netAmount: 4060,
      status: "Paid"
    },
    {
      id: 5,
      employeeId: "EMP005",
      employee: "Jessica Davis",
      position: "Marketing Specialist",
      period: "April 2023",
      paymentDate: "Apr 30, 2023",
      grossAmount: 3900,
      deductions: 1170,
      netAmount: 2730,
      status: "Paid"
    },
    {
      id: 6,
      employeeId: "EMP001",
      employee: "Sarah Williams",
      position: "HR Manager",
      period: "March 2023",
      paymentDate: "Mar 31, 2023",
      grossAmount: 4500,
      deductions: 1350,
      netAmount: 3150,
      status: "Paid"
    },
    {
      id: 7,
      employeeId: "EMP002",
      employee: "John Smith",
      position: "Software Engineer",
      period: "March 2023",
      paymentDate: "Mar 31, 2023",
      grossAmount: 5200,
      deductions: 1560,
      netAmount: 3640,
      status: "Paid"
    }
  ];

  const payrollStats = [
    { name: "Total Salary", amount: 128350, change: 4.5, icon: CreditCard },
    { name: "Total Tax", amount: 38505, change: 2.1, icon: PieChart },
    { name: "Average Salary", amount: 4595, change: 3.2, icon: BarChart4 }
  ];

  const upcomingPayrolls = [
    { 
      id: 1,
      name: "May 2023 Payroll",
      dueDate: "May 31, 2023",
      status: "Scheduled",
      employees: 28,
      estimatedAmount: 128700
    },
    { 
      id: 2,
      name: "June 2023 Payroll",
      dueDate: "Jun 30, 2023",
      status: "Pending",
      employees: 28,
      estimatedAmount: 129500
    }
  ];

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getSortIcon = (name) => {
    if (sortConfig.key === name) {
      return sortConfig.direction === 'asc' 
        ? <ChevronUp className="h-4 w-4 text-gray-500" /> 
        : <ChevronDown className="h-4 w-4 text-gray-500" />;
    }
    return null;
  };

  const sortedTransactions = [...paymentTransactions]
    .filter(transaction => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        transaction.employee.toLowerCase().includes(query) ||
        transaction.position.toLowerCase().includes(query) ||
        transaction.period.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const handleRunPayroll = () => {
    setDialogMode('run');
    setShowDialog(true);
  };

  const handleViewPayslip = (transaction) => {
    setSelectedTransaction(transaction);
    setDialogMode('view');
    setShowDialog(true);
  };

  const handlePayrollAction = (action, payroll) => {
    if (action === 'preview') {
      toast({
        title: "Payroll Preview",
        description: `Previewing ${payroll.name}`,
      });
    } else if (action === 'schedule') {
      setSelectedTransaction(payroll);
      setDialogMode('schedule');
      setShowDialog(true);
    }
  };

  const handleDialogAction = () => {
    switch (dialogMode) {
      case 'run':
        toast({
          title: "Success",
          description: "Payroll has been initiated successfully",
        });
        break;
      case 'schedule':
        toast({
          title: "Success",
          description: `${selectedTransaction.name} has been scheduled successfully`,
        });
        break;
      case 'view':
        // Just close the dialog
        break;
      default:
        break;
    }
    setShowDialog(false);
  };

  const handleFilterClick = () => {
    toast({
      title: "Filter Options",
      description: "Filter options will be available soon",
    });
  };

  const handleExportClick = () => {
    toast({
      title: "Export Started",
      description: "Exporting payroll data to CSV",
    });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-500 mt-1">View and manage payroll information</p>
        </div>
        <StaffiButton 
          className="w-full md:w-auto transition-all hover:scale-105"
          onClick={handleRunPayroll}
        >
          <Wallet className="mr-1 h-4 w-4" />
          Run Payroll
        </StaffiButton>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {payrollStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <AspectRatio ratio={16/5}>
              <div className="h-full w-full bg-white p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(stat.amount)}</h3>
                    <div className="flex items-center mt-1 text-xs">
                      <div className={cn(
                        "flex items-center",
                        stat.change > 0 ? "text-green-600" : "text-red-600"
                      )}>
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        <span>{Math.abs(stat.change)}% </span>
                      </div>
                      <span className="text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className="bg-staffi-purple/10 p-2 rounded-full">
                    <stat.icon className="h-5 w-5 text-staffi-purple" />
                  </div>
                </div>
              </div>
            </AspectRatio>
          </Card>
        ))}
      </div>

      {/* Upcoming Payrolls */}
      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-0">
          <CardTitle>Upcoming Payrolls</CardTitle>
          <CardDescription>Scheduled payments for the next periods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-2">
            {upcomingPayrolls.map((payroll) => (
              <Card key={payroll.id} className="border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{payroll.name}</h4>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span>Due: {payroll.dueDate}</span>
                      <span className="mx-2">•</span>
                      <span>{payroll.employees} Employees</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-right">
                      <span className="text-sm text-gray-500">Estimated amount</span>
                      <p className="font-medium text-gray-900">{formatCurrency(payroll.estimatedAmount)}</p>
                    </div>
                    <div className="mt-2 flex gap-2 justify-end w-full">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs h-8 border-gray-200 shadow-sm"
                        onClick={() => handlePayrollAction('preview', payroll)}
                      >
                        Preview
                      </Button>
                      <StaffiButton
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => handlePayrollAction('schedule', payroll)}
                      >
                        {payroll.status === "Scheduled" ? "Edit Schedule" : "Schedule"}
                      </StaffiButton>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payroll History */}
      <Card className="border-0 shadow-md animate-scale-in">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>View all past payroll transactions</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-9 h-9 w-[200px] rounded-md border border-gray-200 bg-white text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-staffi-purple"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-9 border-gray-200 shadow-sm"
                onClick={handleFilterClick}
              >
                <Filter className="mr-1 h-3 w-3" />
                Filter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-9 border-gray-200 shadow-sm"
                onClick={handleExportClick}
              >
                <Download className="mr-1 h-3 w-3" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead 
                    className="w-[120px] cursor-pointer"
                    onClick={() => requestSort('period')}
                  >
                    <div className="flex items-center">
                      Period {getSortIcon('period')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => requestSort('employee')}
                  >
                    <div className="flex items-center">
                      Employee {getSortIcon('employee')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => requestSort('paymentDate')}
                  >
                    <div className="flex items-center">
                      Date {getSortIcon('paymentDate')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => requestSort('grossAmount')}
                  >
                    <div className="flex items-center justify-end">
                      Gross Amount {getSortIcon('grossAmount')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => requestSort('deductions')}
                  >
                    <div className="flex items-center justify-end">
                      Deductions {getSortIcon('deductions')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => requestSort('netAmount')}
                  >
                    <div className="flex items-center justify-end">
                      Net Amount {getSortIcon('netAmount')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.length > 0 ? (
                  sortedTransactions.map((transaction) => (
                    <TableRow 
                      key={transaction.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewPayslip(transaction)}
                    >
                      <TableCell className="font-medium">{transaction.period}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.employee}</div>
                          <div className="text-gray-500 text-xs">{transaction.position}</div>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.paymentDate}</TableCell>
                      <TableCell className="text-right">{formatCurrency(transaction.grossAmount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(transaction.deductions)}</TableCell>
                      <TableCell className="font-medium text-right">{formatCurrency(transaction.netAmount)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <div className="rounded-full w-2 h-2 bg-green-500 mr-2"></div>
                          <span className="text-sm">{transaction.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-7 border-gray-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewPayslip(transaction);
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-7 border-gray-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast({
                                title: "Downloading Payslip",
                                description: `Downloading payslip for ${transaction.employee}`,
                              });
                            }}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Slip
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <FileSpreadsheet className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-gray-500">No transactions found</p>
                        <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className={cn(
          "sm:max-w-md", 
          dialogMode === 'view' && "sm:max-w-2xl"
        )}>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'run' && 'Run Payroll'}
              {dialogMode === 'schedule' && 'Schedule Payroll'}
              {dialogMode === 'view' && 'Payslip Details'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'run' && 'Process payroll for the current period'}
              {dialogMode === 'schedule' && (selectedTransaction ? selectedTransaction.name : 'Schedule upcoming payroll')}
              {dialogMode === 'view' && (selectedTransaction ? `${selectedTransaction.employee} - ${selectedTransaction.period}` : '')}
            </DialogDescription>
          </DialogHeader>
          
          {dialogMode === 'run' && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="payrollPeriod" className="text-right text-sm font-medium">
                  Payroll Period
                </label>
                <input
                  id="payrollPeriod"
                  className="col-span-3 h-10 rounded-md border border-gray-300 px-3"
                  placeholder="e.g. April 2023"
                  defaultValue="May 2023"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="paymentDate" className="text-right text-sm font-medium">
                  Payment Date
                </label>
                <input
                  id="paymentDate"
                  type="date"
                  className="col-span-3 h-10 rounded-md border border-gray-300 px-3"
                  defaultValue="2023-05-31"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <label className="text-right text-sm font-medium pt-2">
                  Options
                </label>
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="includeBonus" className="rounded" />
                    <label htmlFor="includeBonus" className="text-sm">Include bonuses</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="includeOvertime" className="rounded" defaultChecked />
                    <label htmlFor="includeOvertime" className="text-sm">Include overtime</label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {dialogMode === 'schedule' && selectedTransaction && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="payrollName" className="text-right text-sm font-medium">
                  Payroll Name
                </label>
                <input
                  id="payrollName"
                  className="col-span-3 h-10 rounded-md border border-gray-300 px-3"
                  defaultValue={selectedTransaction.name}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="scheduledDate" className="text-right text-sm font-medium">
                  Payment Date
                </label>
                <input
                  id="scheduledDate"
                  type="date"
                  className="col-span-3 h-10 rounded-md border border-gray-300 px-3"
                  defaultValue={selectedTransaction.dueDate.replace(/(\w+) (\d+), (\d+)/, "$3-$1-$2").toLowerCase()}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <label htmlFor="notes" className="text-right text-sm font-medium pt-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  className="col-span-3 h-20 rounded-md border border-gray-300 p-3"
                  placeholder="Any notes about this payroll run..."
                />
              </div>
            </div>
          )}
          
          {dialogMode === 'view' && selectedTransaction && (
            <div className="py-4">
              <div className="border rounded-lg p-6 bg-gray-50">
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-xl">{selectedTransaction.period} Payslip</h3>
                    <p className="text-sm text-gray-500">Payment Date: {selectedTransaction.paymentDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Printing Payslip",
                          description: `Printing payslip for ${selectedTransaction.employee}`,
                        });
                      }}
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Downloading Payslip",
                          description: `Downloading payslip for ${selectedTransaction.employee}`,
                        });
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Employee Information</h4>
                    <div className="mt-2 space-y-1">
                      <p className="font-medium">{selectedTransaction.employee}</p>
                      <p className="text-sm">{selectedTransaction.position}</p>
                      <p className="text-sm">Employee ID: {selectedTransaction.employeeId}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Payment Information</h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">Payment Method: Direct Deposit</p>
                      <p className="text-sm">Account: ****6789</p>
                      <p className="text-sm">Status: <span className="text-green-600">{selectedTransaction.status}</span></p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Earnings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base Salary</span>
                      <span className="font-medium">{formatCurrency(selectedTransaction.grossAmount * 0.9)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Overtime</span>
                      <span className="font-medium">{formatCurrency(selectedTransaction.grossAmount * 0.1)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-2">
                      <span>Gross Earnings</span>
                      <span>{formatCurrency(selectedTransaction.grossAmount)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Deductions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Income Tax</span>
                      <span className="font-medium">{formatCurrency(selectedTransaction.deductions * 0.6)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Social Security</span>
                      <span className="font-medium">{formatCurrency(selectedTransaction.deductions * 0.25)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Retirement Contribution</span>
                      <span className="font-medium">{formatCurrency(selectedTransaction.deductions * 0.15)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t border-gray-200 pt-2 mt-2">
                      <span>Total Deductions</span>
                      <span>{formatCurrency(selectedTransaction.deductions)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-200 p-3 rounded-md flex justify-between items-center">
                  <span className="font-semibold">Net Pay</span>
                  <span className="font-bold text-xl">{formatCurrency(selectedTransaction.netAmount)}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              {dialogMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {dialogMode !== 'view' && (
              <Button 
                type="button" 
                onClick={handleDialogAction}
              >
                {dialogMode === 'run' ? 'Process Payroll' : 'Save Schedule'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payroll;
