
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { JobApplication } from "../../entities/all";
import { 
  ExternalLink, 
  Building2, 
  MapPin, 
  Clock,
  Target,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Globe,
  Search,
  Bookmark,
  BookmarkPlus
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

const statusColors = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  applied: "bg-blue-100 text-blue-800 border-blue-200", 
  reviewing: "bg-purple-100 text-purple-800 border-purple-200",
  interview: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  offer: "bg-green-100 text-green-800 border-green-200",
  accepted: "bg-green-200 text-green-900 border-green-300"
};

const employmentTypeColors = {
  full_time: "bg-blue-50 text-blue-700 border-blue-200",
  part_time: "bg-purple-50 text-purple-700 border-purple-200",
  contract: "bg-orange-50 text-orange-700 border-orange-200",
  casual: "bg-pink-50 text-pink-700 border-pink-200",
  internship: "bg-green-50 text-green-700 border-green-200"
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
    if (hostname.includes('remoteok.io')) return 'RemoteOK';
    if (hostname.includes('weworkremotely.com')) return 'We Work Remotely';
    if (hostname.includes('angel.co')) return 'AngelList';
    if (hostname.includes('flexjobs.com')) return 'FlexJobs';
    if (hostname.includes('remote.co')) return 'Remote.co';
    
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
  'Workforce Australia': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'RemoteOK': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'We Work Remotely': 'bg-violet-50 text-violet-700 border-violet-200',
  'AngelList': 'bg-slate-50 text-slate-700 border-slate-200',
  'FlexJobs': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Remote.co': 'bg-teal-50 text-teal-700 border-teal-200',
  'default': 'bg-gray-50 text-gray-700 border-gray-200'
};

export default function ApplicationCard({ application, index }) {
  const handleApply = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Update status to applied and set application date
      await JobApplication.update(application.id, {
        status: 'applied',
        application_date: new Date().toISOString().split('T')[0]
      });
      
      // Open job URL in new tab
      window.open(application.job_url, '_blank', 'noopener,noreferrer');
      
      // Reload page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error updating application status:", error);
      // Still open the job URL even if update fails
      window.open(application.job_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const newBookmarkStatus = !application.is_bookmarked;
      await JobApplication.update(application.id, {
        is_bookmarked: newBookmarkStatus
      });
      
      // Reload page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error updating bookmark status:", error);
    }
  };

  const jobSource = getJobSource(application.job_url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <Card className="group border-0 shadow-md bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Main Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {application.job_title}
                  </h3>
                  <div className="flex items-center gap-4 text-slate-600 mt-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium">{application.company_name}</span>
                    </div>
                    {jobSource && (
                      <Badge 
                        variant="outline" 
                        className={`${jobSourceColors[jobSource] || jobSourceColors.default} text-xs font-medium`}
                      >
                        <Globe className="w-3 h-3 mr-1" />
                        {jobSource}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {application.status === 'pending' ? (
                    <Badge variant="outline" className="text-slate-600">
                      {formatDistanceToNow(new Date(application.created_date), { addSuffix: true })}
                    </Badge>
                  ) : (
                    <Badge className={`${statusColors[application.status]} border font-medium`}>
                      {application.status.replace('_', ' ')}
                    </Badge>
                  )}
                  {application.match_score && application.match_score >= 70 && (
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                      Great Match
                    </Badge>
                  )}
                  {(application.location?.toLowerCase().includes('remote') || 
                    application.employment_type?.toLowerCase().includes('remote') ||
                    application.job_description?.toLowerCase().includes('remote')) && (
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      🏠 Remote
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{application.location}</span>
                </div>
                
                {application.employment_type && (
                  <Badge 
                    variant="outline" 
                    className={`${employmentTypeColors[application.employment_type]} text-xs font-medium`}
                  >
                    <Briefcase className="w-3 h-3 mr-1" />
                    {application.employment_type.replace('_', ' ')}
                  </Badge>
                )}
                
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{format(new Date(application.created_date), "MMM d, yyyy")}</span>
                </div>
                
                {application.match_score && (
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium text-emerald-600">
                      {application.match_score}% match
                    </span>
                  </div>
                )}
              </div>

              {application.salary_range && (
                <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                  <DollarSign className="w-4 h-4" />
                  <span>{application.salary_range}</span>
                </div>
              )}

              {application.job_description && (
                <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                  {application.job_description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={`opacity-70 group-hover:opacity-100 transition-all ${
                  application.is_bookmarked 
                    ? 'text-amber-600 hover:text-amber-700' 
                    : 'text-slate-400 hover:text-amber-600'
                }`}
                title={application.is_bookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
              >
                {application.is_bookmarked ? (
                  <BookmarkPlus className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </Button>
              
              {application.status === 'pending' ? (
                <Button 
                  onClick={handleApply}
                  className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Apply Now
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                  className="opacity-70 group-hover:opacity-100 transition-opacity"
                >
                  <a 
                    href={application.job_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Job
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
