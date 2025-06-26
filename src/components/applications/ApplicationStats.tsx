import React from "react";
import { motion } from "framer-motion";
import StatsCard from "../dashboard/StatsCard";
import { Briefcase, TrendingUp, Clock, Target } from "lucide-react";

interface ApplicationStatsProps {
  applications: any[];
}

export default function ApplicationStats({ applications }: ApplicationStatsProps) {
  const pendingApplications = applications.filter((app: any) => app.status === 'pending').length;
  const interviewApplications = applications.filter((app: any) =>
  ['interview', 'offer', 'accepted'].includes(app.status)
  ).length;
  const todayApplications = applications.filter((app: any) =>
  new Date(app.created_date).toDateString() === new Date().toDateString()
  ).length;
  const averageMatchScore = applications.length > 0
  ? Math.round(applications.reduce((sum: number, app: any) => sum + (app.match_score || 0), 0) / applications.length)
  : 0;

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
        trend={todayApplications > 0 ? `+${todayApplications} today` : null}
        color="emerald"
          onClick={() => {}}
         />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <StatsCard
          title="Success Rate"
          value={applications.length > 0 ? `${Math.round((interviewApplications / applications.length) * 100)}%` : "0%"}
          icon={TrendingUp}
          trend={interviewApplications > 0 ? `${interviewApplications} interviews` : null}
          color="blue"
          onClick={() => {}}
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <StatsCard
          title="Pending"
          value={pendingApplications}
          icon={Clock}
          trend="Awaiting response"
          color="amber"
          onClick={() => {}}
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <StatsCard
          title="Avg Match Score"
          value={`${averageMatchScore}%`}
          icon={Target}
          trend="Based on resume fit"
          color="purple"
          onClick={() => {}}
        />
      </motion.div>
    </motion.div>
  );
}