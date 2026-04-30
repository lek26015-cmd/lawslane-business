"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  FileText, 
  Scale, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  Briefcase,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ChevronRight,
  ShieldCheck
} from "lucide-react"
import { cn } from "@/lib/utils"

const CircularProgress = ({ value, label }: { value: number; label: string }) => {
  const radius = 60;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  let colorClass = "text-emerald-500";
  if (value < 50) colorClass = "text-destructive";
  else if (value < 80) colorClass = "text-amber-500";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
          className={cn(colorClass)}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold text-slate-800 dark:text-slate-100">{value}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{label}</span>
      </div>
    </div>
  );
};

export function ComplianceDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tasks = [
    {
      id: 1,
      title: "Commercial License Renewal",
      dueDate: "Oct 15, 2026",
      status: "Urgent",
      description: "Your business operating license expires in 5 days.",
    },
    {
      id: 2,
      title: "Annual Tax Filing",
      dueDate: "Nov 01, 2026",
      status: "Warning",
      description: "Prepare documentation and submit end-of-year tax returns.",
    },
    {
      id: 3,
      title: "Data Privacy Audit (PDPA)",
      dueDate: "Dec 15, 2026",
      status: "Warning",
      description: "Ensure full compliance with recent PDPA legal amendments.",
    },
    {
      id: 4,
      title: "Employee Handbook Review",
      dueDate: "Dec 10, 2026",
      status: "Good",
      description: "Scheduled annual review of internal HR policies.",
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Urgent": return <AlertCircle className="w-3.5 h-3.5 mr-1" />;
      case "Warning": return <AlertTriangle className="w-3.5 h-3.5 mr-1" />;
      case "Good": return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      default: return null;
    }
  }
  
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Urgent": return "destructive";
      case "Warning": return "secondary"; 
      case "Good": return "outline";
      default: return "default";
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex flex-col", 
        isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Lawslane</span>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="mb-4 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Main Menu
          </div>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md bg-primary/5 text-primary">
            <ShieldCheck className="w-5 h-5" />
            Compliance Status
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Overview Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <FileText className="w-5 h-5" />
            Legal Documents
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Briefcase className="w-5 h-5" />
            My Lawyers
          </a>
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Settings className="w-5 h-5" />
            Company Settings
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="lg:hidden mr-2 -ml-2" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Compliance Hub</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-slate-500 hidden sm:flex">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-500 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border border-white dark:border-slate-900" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-medium text-sm ml-2">
              SME
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Legal Health Score Card */}
              <Card className="lg:col-span-1 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Legal Health Score</CardTitle>
                  <CardDescription>Your overall business compliance rating</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center flex-1 pt-6 pb-8">
                  <CircularProgress value={68} label="Needs Attention" />
                  <div className="mt-8 text-sm text-center px-2">
                    <p className="text-slate-600 dark:text-slate-400">
                      Your score is slightly low. You have <span className="font-semibold text-destructive">1 urgent</span> matter that requires immediate legal attention.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Regulatory Deadlines List */}
              <Card className="lg:col-span-2 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                 <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="space-y-1">
                      <CardTitle className="text-lg text-slate-800 dark:text-slate-100">Regulatory Deadlines</CardTitle>
                      <CardDescription>Upcoming corporate tasks and requirements</CardDescription>
                    </div>
                 </CardHeader>
                 <CardContent className="pt-6">
                    <div className="space-y-4">
                      {tasks.map(task => (
                        <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group">
                          <div className="flex items-start gap-4 mb-4 sm:mb-0">
                            <div className={cn("mt-0.5 p-2.5 rounded-lg shrink-0", 
                              task.status === "Urgent" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : 
                              task.status === "Warning" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" : 
                              "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                            )}>
                              <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <h4 className="font-semibold text-slate-800 dark:text-slate-100">{task.title}</h4>
                                <Badge 
                                  variant={getBadgeVariant(task.status) as any} 
                                  className={cn("text-[10px] uppercase tracking-wider font-bold",
                                    task.status === "Warning" && "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800",
                                    task.status === "Good" && "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                                  )}
                                >
                                  {getStatusIcon(task.status)}
                                  {task.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 leading-snug max-w-md">{task.description}</p>
                              <div className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 mr-2"></span>
                                Due by {task.dueDate}
                              </div>
                            </div>
                          </div>
                          
                          {(task.status === "Urgent" || task.status === "Warning") && (
                            <Button 
                              size="sm" 
                              className={cn(
                                "w-full sm:w-auto gap-2 shadow-sm font-medium transition-all shrink-0",
                                task.status === "Urgent" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90"
                              )}
                            >
                              <Briefcase className="w-4 h-4" />
                              Find a Lawyer
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                 </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
