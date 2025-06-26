
import React, { useState, useEffect } from "react";
import { Resume, JobApplication, JobPreferences } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
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
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [automationActive, setAutomationActive] = useState(false); // This state now refers to the general automation setting (can be used for background processes)
  const [isFindingJobs, setIsFindingJobs] = useState(false);
  const [searchStatus, setSearchStatus] = useState("idle"); // 'idle', 'searching', 'completed'
  const [foundJobsCount, setFoundJobsCount] = useState(0);
  const [searchStatusMessage, setSearchStatusMessage] = useState("Click to discover jobs");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [resumeData, applicationData, prefsData] = await Promise.all([
        Resume.list("-created_date"),
        JobApplication.list("-created_date", 10),
        JobPreferences.list("-created_date", 1)
      ]);

      setResumes(resumeData);
      setApplications(applicationData);
      setPreferences(prefsData[0] || null);
      if (prefsData[0]) {
        setAutomationActive(prefsData[0].auto_apply_enabled); // Use this for the automation toggle value
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const runJobDiscovery = async () => {
    setIsFindingJobs(true);
    setSearchStatus("searching");
    setFoundJobsCount(0); // Reset count at the start of a new search
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
      const pendingApps = await JobApplication.filter({ status: 'pending' });
      if (pendingApps.length > 0) {
        await Promise.all(pendingApps.map(app => JobApplication.delete(app.id)));
        console.log(`Cleared ${pendingApps.length} pending applications.`);
      }

      let allFoundJobs = [];
      const remainingApps = await JobApplication.list();
      const existingUrls = new Set(remainingApps.map(app => app.job_url));
      
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
          searchTasks.push({ name: 'Adzuna.com.au', url: `https://www.adzuna.com.au/jobs/search?q=${encodeURIComponent(jobTitle)}&loc=${encodeURIComponent(location)}`, location });
        }
      }

      for (const task of searchTasks) {
        try {
          setSearchStatusMessage(`Searching ${task.name}...`);
          console.log(`Searching: ${task.url}`);

          const scrapePrompt = `
            You are a highly advanced web scraping bot. Your task is to act like a human user to find and extract direct application links for jobs.

            **Your process must be:**
            1.  Navigate to the search results page: ${task.url}
            2.  From the list of results, identify individual job postings.
            3.  For each posting, find the direct link to the **final application page**. This is often labeled "Apply Now" or "Apply". This is your primary goal.
            4.  Extract the full, direct application URL.

            **CRITICAL LINK REQUIREMENTS:**
            *   **PRIORITIZE 'APPLY' LINKS:** The \`job_url\` you return MUST be the link a user clicks to start their application.
            *   **EXAMPLE OF A GOOD LINK (from Seek):** \`https://www.seek.com.au/job/84885169/apply?sol=...\`
            *   **DO NOT RETURN THE EXAMPLE LINK:** The link above is just an example of the *format*. You MUST find new, unique, real links from the webpage. Do not return the example link in your response.
            *   **DO NOT RETURN:** Links to search pages, incomplete URLs, or generic job detail pages.

            For each valid job you find with a direct **apply** link, extract the following:
            - job_title: The full title of the position.
            - company_name: The name of the hiring company.
            - job_url: The direct **apply** URL.
            - location: The location of the job.
            - salary_range: The salary if mentioned.
            - job_description: A brief summary of the job from the listing.
            - employment_type: The type of employment (e.g., Full-time, Contract).

            Return a JSON object with a single key "jobs" which is an array of these job objects. If you cannot find any valid **apply** links, return an empty "jobs" array.
          `;

          const scrapingResult = await InvokeLLM({
            prompt: scrapePrompt,
            add_context_from_internet: true,
            response_json_schema: {
              type: "object",
              properties: {
                jobs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      job_title: { type: "string" },
                      company_name: { type: "string" },
                      job_url: { type: "string" },
                      location: { type: "string" },
                      salary_range: { type: "string" },
                      job_description: { type: "string" },
                      employment_type: { type: "string" }
                    },
                    required: ["job_title", "company_name", "job_url", "location"]
                  }
                }
              }
            }
          });

          if (scrapingResult.jobs && scrapingResult.jobs.length > 0) {
            const freshJobs = scrapingResult.jobs.filter(job => {
                // Failsafe to prevent the AI from being lazy and returning the example URL
                const isExampleUrl = job.job_url.includes('84885169');
                if (isExampleUrl) {
                    console.warn("AI returned the example URL, filtering it out.");
                }
                const isRealUrl = job.job_url && job.job_url.startsWith('http');
                return !isExampleUrl && isRealUrl && !existingUrls.has(job.job_url);
            });
            allFoundJobs = allFoundJobs.concat(freshJobs);
            console.log(`Found ${freshJobs.length} valid jobs from ${task.name}`);
          }
        } catch (e) {
          console.error(`Error scraping ${task.url}:`, e);
        }
      }

      // Remove duplicates by URL
      const uniqueJobs = Array.from(new Map(allFoundJobs.map(job => [job.job_url, job])).values());

      // Limit to max applications per day
      const limitedJobs = uniqueJobs.slice(0, preferences.max_applications_per_day || 10);

      if (limitedJobs.length > 0) {
        const jobsToCreate = limitedJobs.map(job => ({
          ...job,
          status: 'pending',
          match_score: 85, // High match since based on exact preferences
          auto_applied: false
        }));

        await JobApplication.bulkCreate(jobsToCreate);
        setFoundJobsCount(jobsToCreate.length); // Set the count of newly found jobs
        console.log(`Created ${jobsToCreate.length} new job applications`);
      }

      await loadDashboardData(); // Reload data to show new jobs

    } catch (error) {
      console.error("Error during job discovery:", error);
    }

    setIsFindingJobs(false);
    setSearchStatus("completed");
    setTimeout(() => {
      setSearchStatus("idle");
      setSearchStatusMessage("Click to discover jobs");
      setFoundJobsCount(0); // Reset after 5 seconds to clear the count
    }, 5000); // Reset after 5 seconds
  };

  const handleToggleAutomation = (isActive) => {
    setAutomationActive(isActive);
    // Persist the toggle state
    if(preferences) {
      // Note: Removed await as per outline, assuming background persistence or not critical for immediate UI flow
      JobPreferences.update(preferences.id, { auto_apply_enabled: isActive });
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-slate-600 text-lg">
              {activeResume
                ? "Your job search is active and running smoothly."
                : "Upload your resume to start your automated job search."
              }
            </p>
          </div>

          <div className="flex items-center gap-4">
            {activeResume && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className={`w-2 h-2 rounded-full ${automationActive ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                <span className="text-sm font-medium text-slate-700">
                  Job Discovery {automationActive ? 'Active' : 'Paused'}
                </span>
              </div>
            )}
            <Link to={createPageUrl("Upload")}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-lg">
                <Upload className="w-4 h-4 mr-2" />
                Upload Resume
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Alert Banner */}
        {!activeResume && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 mb-1">No Active Resume</h3>
                <p className="text-amber-800 mb-4">
                  Upload your resume to start finding jobs that match your profile.
                </p>
                <Link to={createPageUrl("Upload")}>
                  <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                    Upload Resume Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={itemVariants}>
            <StatsCard
              title="Total Applications"
              value={applications.length}
              icon={Briefcase}
              trend={todayApplications.length > 0 ? `+${todayApplications.length} today` : null}
              color="emerald"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StatsCard
              title="Success Rate"
              value={applications.length > 0 ? `${Math.round((successfulApplications.length / applications.length) * 100)}%` : "0%"}
              icon={TrendingUp}
              trend={successfulApplications.length > 0 ? `${successfulApplications.length} interviews` : null}
              color="blue"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StatsCard
              title="Active Resume"
              value={activeResume ? "Ready" : "None"}
              icon={FileText}
              trend={activeResume ? "Last updated recently" : "Upload needed"}
              color={activeResume ? "green" : "amber"}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StatsCard
              title="Find New Jobs"
              value={
                searchStatus === 'searching' ? "Searching..." : 
                searchStatus === 'completed' ? `${foundJobsCount} New Jobs` : "Search Now"
              }
              icon={Target}
              trend={
                searchStatus === 'searching' ? searchStatusMessage :
                searchStatus === 'completed' ? "Click to view results" : "Click to discover jobs"
              }
              color="purple"
              clickable={searchStatus !== 'searching' && (activeResume && preferences)}
              onClick={
                searchStatus === 'completed' 
                  ? () => navigate(createPageUrl("Applications")) 
                  : (!isFindingJobs && activeResume && preferences ? runJobDiscovery : undefined)
              }
            />
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-3 flex justify-center">
             <div className="w-full max-w-md">
                <QuickActions
                  activeResume={activeResume}
                  preferences={preferences}
                  automationActive={automationActive}
                  onToggleAutomation={handleToggleAutomation}
                  isFindingJobs={isFindingJobs}
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
