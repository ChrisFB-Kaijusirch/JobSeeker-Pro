
import React, { useState, useEffect } from "react";
import { JobApplication, Resume, JobPreferences } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  ExternalLink,
  Building2,
  MapPin,
  Clock,
  Briefcase,
  Target,
  TrendingUp,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { InvokeLLM } from "@/integrations/Core";

import ApplicationCard from "../components/applications/ApplicationCard";
import ApplicationFilters from "../components/applications/ApplicationFilters";
import ApplicationStats from "../components/applications/ApplicationStats";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    employment_type: "all",
    auto_applied: "all"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isFindingJobs, setIsFindingJobs] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, filters]);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await JobApplication.list("-created_date");
      setApplications(data);
    } catch (error) {
      console.error("Error loading applications:", error);
    }
    setIsLoading(false);
  };

  const filterApplications = () => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    // Employment type filter
    if (filters.employment_type !== "all") {
      filtered = filtered.filter(app => app.employment_type === filters.employment_type);
    }

    // Auto-applied filter
    if (filters.auto_applied !== "all") {
      const isAutoApplied = filters.auto_applied === "true";
      filtered = filtered.filter(app => app.auto_applied === isAutoApplied);
    }

    setFilteredApplications(filtered);
  };

  const runJobDiscovery = async () => {
    setIsFindingJobs(true);
    
    try {
      // Get active resume and preferences
      const [resumeData, prefsData] = await Promise.all([
        Resume.list("-created_date"),
        JobPreferences.list("-created_date", 1)
      ]);
      
      const activeResume = resumeData.find(r => r.is_active);
      const preferences = prefsData[0];

      if (!activeResume || !preferences) {
        console.error("Cannot run job discovery without an active resume and preferences.");
        setIsFindingJobs(false);
        return;
      }

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
        for (const location of preferences.locations) {
          searchTasks.push({ name: 'Seek.com.au', url: `https://www.seek.com.au/jobs?q=${encodeURIComponent(jobTitle)}&l=${encodeURIComponent(location)}` });
          searchTasks.push({ name: 'Indeed.com', url: `https://au.indeed.com/jobs?q=${encodeURIComponent(jobTitle)}&l=${encodeURIComponent(location)}` });
          searchTasks.push({ name: 'Jora.com', url: `https://au.jora.com/jobs?q=${encodeURIComponent(jobTitle)}&l=${encodeURIComponent(location)}` });
          searchTasks.push({ name: 'Adzuna.com.au', url: `https://www.adzuna.com.au/jobs/search?q=${encodeURIComponent(jobTitle)}&loc=${encodeURIComponent(location)}` });
        }
      }

      for (const task of searchTasks) {
        try {
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
        console.log(`Created ${jobsToCreate.length} new job applications`);
      }
      
      await loadApplications(); // Reload data to show new jobs

    } catch (error) {
      console.error("Error during job discovery:", error);
    } finally {
      setIsFindingJobs(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Job Applications
            </h1>
            <p className="text-slate-600 text-lg">
              Track and manage all your job applications in one place
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-slate-600">
              {applications.length} Total Applications
            </Badge>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <ApplicationStats applications={applications} />

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search jobs, companies, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-0 shadow-sm"
            />
          </div>
          <ApplicationFilters filters={filters} onFiltersChange={setFilters} />
        </motion.div>

        {/* Applications List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {isLoading ? (
            <div className="grid gap-4">
              {Array(5).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredApplications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {searchTerm || Object.values(filters).some(f => f !== "all")
                  ? "No applications match your search"
                  : "No applications yet"
                }
              </h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                {searchTerm || Object.values(filters).some(f => f !== "all")
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "Upload your resume and set your preferences to start automatically applying for jobs."
                }
              </p>
              {!searchTerm && !Object.values(filters).some(f => f !== "all") && (
                <Button
                  onClick={runJobDiscovery}
                  disabled={isFindingJobs}
                  className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                >
                  {isFindingJobs ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Finding Jobs...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4" />
                      Find Jobs Now
                    </>
                  )}
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {filteredApplications.map((application, index) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
