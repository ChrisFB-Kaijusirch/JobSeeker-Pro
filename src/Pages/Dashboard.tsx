import React, { useState, useEffect } from "react";
import { JobApplication, Resume, JobPreferences } from "../types";
import { Resume as ResumeEntity, JobApplication as JobApplicationEntity, JobPreferences as JobPreferencesEntity } from "../entities/all";
import { InvokeLLM } from "../integrations/Core";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils";
import {
  FileText,
  Briefcase,
  Target,
  TrendingUp,
  Upload,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users
} from "lucide-react";
import { motion } from "framer-motion";

import StatsCard from "../components/dashboard/StatsCard";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [preferences, setPreferences] = useState<JobPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [automationActive, setAutomationActive] = useState(false);
  const [isFindingJobs, setIsFindingJobs] = useState(false);
  const [searchStatus, setSearchStatus] = useState<"idle" | "searching" | "completed">("idle");
  const [foundJobsCount, setFoundJobsCount] = useState(0);
  const [searchStatusMessage, setSearchStatusMessage] = useState("Click to discover jobs");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [resumeData, applicationData, prefsData] = await Promise.all([
        ResumeEntity.list("-created_date"),
        JobApplicationEntity.list("-created_date", 10),
        JobPreferencesEntity.list("-created_date", 1)
      ]);

      setResumes(resumeData);
      setApplications(applicationData);
      setPreferences(prefsData[0] || null);
      if (prefsData[0]) {
        setAutomationActive(prefsData[0].auto_apply_enabled);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const runJobDiscovery = async () => {
    setIsFindingJobs(true);
    setSearchStatus("searching");
    setFoundJobsCount(0);
    const activeResume = resumes.find(r => r.is_active);

    if (!activeResume || !preferences) {
      console.error("Cannot run job discovery without an active resume and preferences.");
      setIsFindingJobs(false);
      setSearchStatus("idle");
      setSearchStatusMessage("Missing resume or preferences");
      return;
    }

    try {
      // Clear all existing 'pending' applications before starting a new search
      console.log("Clearing previous pending applications...");
      const pendingApps = await JobApplicationEntity.filter({ status: 'pending' });
      if (pendingApps.length > 0) {
        await Promise.all(pendingApps.map((app: JobApplication) => JobApplicationEntity.delete(app.id)));
        console.log(`Cleared ${pendingApps.length} pending applications.`);
      }

      let allFoundJobs: JobApplication[] = [];
      const remainingApps = await JobApplicationEntity.list();
      const existingUrls = new Set(remainingApps.map((app: JobApplication) => app.job_url));
      
      const searchTasks = [];
      for (const jobTitle of preferences.preferred_job_titles) {
        // Remote job sites (location-independent)
        searchTasks.push({ name: 'RemoteOK', url: `https://remoteok.io/remote-${encodeURIComponent(jobTitle.replace(/\s+/g, '-'))}-jobs`, remote: true });
        searchTasks.push({ name: 'We Work Remotely', url: `https://weworkremotely.com/categories/remote-full-stack-programming-jobs`, remote: true });
        searchTasks.push({ name: 'AngelList Remote', url: `https://angel.co/jobs#find/f!%7B%22types%22%3A%5B%22full-time%22%5D%2C%22remote%22%3Atrue%7D`, remote: true });
        
        // Location-based job sites
        for (const location of preferences.locations) {
          searchTasks.push({ name: 'Seek.com.au', url: `https://www.seek.com.au/jobs?q=${encodeURIComponent(jobTitle)}&l=${encodeURIComponent(location)}`, location });
          searchTasks.push({ name: 'Indeed.com', url: `https://au.indeed.com/jobs?q=${encodeURIComponent(jobTitle)}&l=${encodeURIComponent(location)}`, location });
          searchTasks.push({ name: 'Jora.com', url: `https://au.jora.com/jobs?q=${encodeURIComponent(jobTitle)}&l=${encodeURIComponent(location)}`, location });
          searchTasks.push({ name: 'Adzuna.com.au', url: `https://www.adzuna.com.au/search?q=${encodeURIComponent(jobTitle)}&l=${encodeURIComponent(location)}`, location });
        }
      }

      // Process each search task
      for (const task of searchTasks) {
        try {
          setSearchStatusMessage(`Searching ${task.name}...`);
          
          const prompt = `I need you to scrape job listings from this URL: ${task.url}

Please extract job information and return it in this exact JSON format:
{
  "jobs": [
    {
      "job_title": "Job Title Here",
      "company": "Company Name",
      "job_url": "Direct URL to job posting",
      "location": "Location (or 'Remote' for remote jobs)",
      "employment_type": "Full-time/Part-time/Contract/Remote",
      "job_description": "Brief description of the role",
      "salary_range": "Salary if available or null",
      "source": "${task.name}"
    }
  ]
}

Important guidelines:
- Only return real, current job postings
- Ensure job_url leads to actual job postings
- For remote job sites, mark location as "Remote"
- Extract salary information if available
- Keep descriptions concise (under 200 characters)
- Return maximum 10 jobs per search
- Ensure all URLs are valid and working`;

          const scrapingResult = await InvokeLLM({ prompt });
          console.log(`Raw result from ${task.name}:`, scrapingResult);

          if (scrapingResult.jobs && scrapingResult.jobs.length > 0) {
            const freshJobs = scrapingResult.jobs.filter((job: any) => {
                // Failsafe to prevent the AI from being lazy and returning the example URL
                const isExampleUrl = job.job_url.includes('84885169');
                if (isExampleUrl) {
                  console.warn("Filtered out example URL:", job.job_url);
                }
                const isRealUrl = job.job_url.startsWith('http') && !job.job_url.includes('example.com');
                return !isExampleUrl && isRealUrl && !existingUrls.has(job.job_url);
            });
            allFoundJobs = allFoundJobs.concat(freshJobs);
            console.log(`Found ${freshJobs.length} valid jobs from ${task.name}`);
          }
        } catch (e) {
          console.error(`Error scraping ${task.name}:`, e);
        }
      }

      // Remove duplicates by URL
      const uniqueJobs = allFoundJobs.filter((job, index, self) => 
        index === self.findIndex((j) => j.job_url === job.job_url)
      );

      // Limit to max applications per day
      const limitedJobs = uniqueJobs.slice(0, preferences.max_applications_per_day || 10);

      if (limitedJobs.length > 0) {
        const jobsToCreate = limitedJobs.map(job => ({
          ...job,
          status: 'pending' as const,
          is_bookmarked: false,
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        }));

        await JobApplicationEntity.bulkCreate(jobsToCreate);
        setFoundJobsCount(jobsToCreate.length);
        console.log(`Created ${jobsToCreate.length} new job applications`);
      }

      setSearchStatus("completed");
      setSearchStatusMessage(`Found ${limitedJobs.length} new jobs`);
      await loadDashboardData(); // Refresh the dashboard data

    } catch (error) {
      console.error("Error during job discovery:", error);
      setSearchStatus("idle");
      setSearchStatusMessage("Search failed");
    }

    setIsFindingJobs(false);
  };

  const handleToggleAutomation = (isActive: boolean) => {
    setAutomationActive(isActive);
    // Persist the toggle state
    if(preferences) {
      JobPreferencesEntity.update(preferences.id, { auto_apply_enabled: isActive });
    }
  };

  const activeResume = resumes.find(r => r.is_active);
  const todayApplications = applications.filter(app =>
    new Date(app.created_date).toDateString() === new Date().toDateString()
  );
  const successfulApplications = applications.filter(app =>
    ['interview', 'offer', 'accepted'].includes(app.status)
  );

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
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleCardClick = (route: string) => {
    navigate(createPageUrl(route));
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Track your job applications and automate your job search
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={runJobDiscovery}
              disabled={isFindingJobs || !activeResume || !preferences}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isFindingJobs ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Discover Jobs
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Applications"
            value={applications.length.toString()}
            icon={Briefcase}
            trend={todayApplications.length > 0 ? `+${todayApplications.length} today` : null}
            color="blue"
            onClick={() => handleCardClick("Applications")}
          />

          <motion.div variants={itemVariants}>
            <StatsCard
              title="Success Rate"
              value={applications.length > 0 ? `${Math.round((successfulApplications.length / applications.length) * 100)}%` : "0%"}
              icon={TrendingUp}
              trend={successfulApplications.length > 0 ? `${successfulApplications.length} successful` : "No successful applications yet"}
              color="green"
              onClick={() => handleCardClick("Applications")}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StatsCard
              title="Active Resume"
              value={activeResume ? "Ready" : "None"}
              icon={FileText}
              trend={activeResume ? "Resume uploaded" : "Upload needed"}
              color={activeResume ? "green" : "red"}
              onClick={() => handleCardClick("Upload")}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StatsCard
              title="Automation"
              value={automationActive ? "Active" : "Inactive"}
              icon={automationActive ? CheckCircle2 : AlertTriangle}
              trend={preferences ? "Preferences set" : "Setup needed"}
              color={automationActive ? "green" : "gray"}
              onClick={() => handleCardClick("Preferences")}
            />
          </motion.div>
        </motion.div>

        {/* Job Discovery Status */}
        {(searchStatus === "searching" || foundJobsCount > 0) && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  {searchStatus === "searching" ? (
                    <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  <div>
                    <p className="font-medium text-slate-900">Job Discovery</p>
                    <p className="text-sm text-slate-600">{searchStatusMessage}</p>
                  </div>
                  {foundJobsCount > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {foundJobsCount} new jobs
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <QuickActions
            activeResume={activeResume}
            preferences={preferences}
            automationActive={automationActive}
            onToggleAutomation={handleToggleAutomation}
            isFindingJobs={isFindingJobs}
          />
        </motion.div>

        {/* Recent Applications */}
        {applications.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5" />
                  <span>Recent Applications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.slice(0, 5).map((app, index) => (
                    <div key={app.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">{app.job_title}</h3>
                        <p className="text-sm text-slate-600">{app.company} • {app.location}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant={
                            app.status === 'applied' ? 'default' :
                            app.status === 'interview' ? 'secondary' :
                            app.status === 'offer' ? 'outline' :
                            'destructive'
                          }
                        >
                          {app.status}
                        </Badge>
                        <Link
                          to={app.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Job
                        </Link>
                      </div>
                    </div>
                  ))}
                  {applications.length > 5 && (
                    <div className="text-center pt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleCardClick("Applications")}
                      >
                        View All Applications ({applications.length})
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Setup Guidance */}
        {(!activeResume || !preferences) && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Setup Required</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!activeResume && (
                    <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Upload className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="font-medium text-amber-800">Upload Your Resume</p>
                          <p className="text-sm text-amber-600">Upload a resume to start applying to jobs</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCardClick("Upload")}
                      >
                        Upload Resume
                      </Button>
                    </div>
                  )}
                  {!preferences && (
                    <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="font-medium text-amber-800">Set Your Preferences</p>
                          <p className="text-sm text-amber-600">Configure job preferences and automation settings</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCardClick("Preferences")}
                      >
                        Set Preferences
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
