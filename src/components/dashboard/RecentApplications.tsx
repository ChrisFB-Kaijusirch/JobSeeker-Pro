
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { format, formatDistanceToNow } from "date-fns";
import { 
  ExternalLink, 
  Building2, 
  MapPin, 
  Clock,
  ArrowRight,
  Briefcase,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "../ui/skeleton";

const statusColors = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  applied: "bg-blue-100 text-blue-800 border-blue-200", 
  reviewing: "bg-purple-100 text-purple-800 border-purple-200",
  interview: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  offer: "bg-green-100 text-green-800 border-green-200",
  accepted: "bg-green-200 text-green-900 border-green-300"
};

const getJobSource = (url: string) => {
  if (!url) return null;
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    
    // Map common job sites to their display names
    if (hostname.includes('seek.com')) return 'Seek';
    if (hostname.includes('indeed.com')) return 'Indeed';
    if (hostname.includes('adzuna.com')) return 'Adzuna';
    if (hostname.includes('careerone.com')) return 'CareerOne';
    if (hostname.includes('careerjet.com')) return 'CareerJet';
    if (hostname.includes('jobactive.gov.au')) return 'JobActive';
    if (hostname.includes('linkedin.com')) return 'LinkedIn';
    if (hostname.includes('jora.com')) return 'Jora';
    if (hostname.includes('workforceaustralia.gov.au')) return 'Workforce Australia';
    
    // Fallback: capitalize first part of domain
    const parts = hostname.replace('www.', '').split('.');
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  } catch (e) {
    return 'External Site';
  }
};

// Add job source colors for better visual distinction
const jobSourceColors = {
  'Seek': 'bg-pink-50 text-pink-700 border-pink-200',
  'Indeed': 'bg-blue-50 text-blue-700 border-blue-200',
  'Adzuna': 'bg-orange-50 text-orange-700 border-orange-200',
  'CareerOne': 'bg-green-50 text-green-700 border-green-200',
  'CareerJet': 'bg-purple-50 text-purple-700 border-purple-200',
  'JobActive': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'LinkedIn': 'bg-blue-50 text-blue-700 border-blue-200',
  'Jora': 'bg-teal-50 text-teal-700 border-teal-200',
  'Workforce Australia': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'External Site': 'bg-gray-50 text-gray-700 border-gray-200',
  'default': 'bg-gray-50 text-gray-700 border-gray-200'
};

interface RecentApplicationsProps {
  applications: any[];
  isLoading: boolean;
}

export default function RecentApplications({ applications, isLoading }: RecentApplicationsProps) {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-100 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-emerald-600" />
            </div>
            <CardTitle className="text-xl font-bold text-slate-900">
              Recent Applications
            </CardTitle>
          </div>
          <Link to={createPageUrl("Applications")}>
            <Button variant="outline" size="sm" className="gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-4 border border-slate-200 rounded-xl">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Applications Yet</h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                Upload your resume and set your preferences to start automatically applying for jobs.
              </p>
              <Link to={createPageUrl("Upload")}>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {applications.map((application: any, index: number) => {
                const jobSource = getJobSource(application.job_url);
                return (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-5 border border-slate-200 rounded-xl hover:border-emerald-200 hover:shadow-md transition-all duration-300 bg-white"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {application.job_title}
                      </h4>
                      <div className="flex items-center gap-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          <span className="font-medium">{application.company_name}</span>
                        </div>
                        {jobSource && (
                          <Badge 
                            variant="outline" 
                            className={`${jobSourceColors[jobSource as keyof typeof jobSourceColors] || jobSourceColors.default} text-xs font-medium`}
                          >
                            <Globe className="w-3 h-3 mr-1" />
                            {jobSource}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {application.status === 'pending' ? (
                      <Badge variant="outline" className="text-slate-600 border border-slate-200">
                        {formatDistanceToNow(new Date(application.created_date), { addSuffix: true })}
                      </Badge>
                    ) : (
                      <Badge className={`${statusColors[application.status as keyof typeof statusColors]} border font-medium`}>
                        {application.status.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{application.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{format(new Date(application.created_date), "MMM d, yyyy")}</span>
                    </div>
                    {application.match_score && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-emerald-600">
                          {application.match_score}% match
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {application.auto_applied && (
                        <Badge variant="outline" className="text-xs">
                          Auto-applied
                        </Badge>
                      )}
                      {application.salary_range && (
                        <span className="text-sm font-medium text-slate-700">
                          {application.salary_range}
                        </span>
                      )}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      asChild
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <a 
                        href={application.job_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Job
                      </a>
                    </Button>
                  </div>
                </motion.div>
                )
              })}
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
