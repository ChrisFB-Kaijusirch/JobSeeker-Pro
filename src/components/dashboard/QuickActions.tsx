import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { 
  Upload, 
  Settings, 
  Play, 
  Pause, 
  FileText, 
  Target,
  AlertCircle,
  CheckCircle2,
  Zap,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

interface QuickActionsProps {
activeResume: any;
preferences: any;
automationActive: boolean;
onToggleAutomation: (isActive: boolean) => void;
isFindingJobs: boolean;
}

export default function QuickActions({
  activeResume,
  preferences,
  automationActive,
  onToggleAutomation,
  isFindingJobs
}: QuickActionsProps) {
  const actions = [
    {
      title: "Upload New Resume",
      description: "Update your resume to improve job matching",
      icon: Upload,
      href: createPageUrl("Upload"),
      variant: "default"
    },
    {
      title: "Set Preferences", 
      description: "Configure job search criteria and filters",
      icon: Settings,
      href: createPageUrl("Preferences"),
      variant: "outline"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Automation Control */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Zap className="w-5 h-5 text-emerald-600" />
            Job Discovery
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 mb-1">Daily Search</p>
                <p className="text-sm text-slate-600">
                  {automationActive 
                    ? "Automatically finds new jobs daily"
                    : "Manual search only"
                  }
                </p>
              </div>
              <Button
                variant={automationActive ? "destructive" : "default"}
                size="sm"
                onClick={() => onToggleAutomation(!automationActive)}
                disabled={!activeResume || !preferences}
                className="gap-2 w-28"
              >
                {automationActive ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Disable
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Enable
                  </>
                )}
              </Button>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">How it works</p>
                  <p className="text-blue-800">
                    Click "Find New Jobs" above to discover positions that match your profile. 
                    Jobs are scored by AI and added to your Applications list for review.
                  </p>
                </div>
              </div>
            </div>
            
            {(!activeResume || !preferences) && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900 mb-1">Setup Required</p>
                  <p className="text-amber-800">
                    {!activeResume && "Upload a resume and "}
                    {!preferences && "set your job preferences "}
                    to enable job discovery.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Overview */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-lg font-bold text-slate-900">Setup Status</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-900">Resume</span>
              </div>
              {activeResume ? (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-amber-600 border-amber-300">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Missing
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-900">Job Preferences</span>
              </div>
              {preferences ? (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Configured
                </Badge>
              ) : (
                <Badge variant="outline" className="text-amber-600 border-amber-300">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Needed
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-lg font-bold text-slate-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {actions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={action.href}>
                  <Button
                  variant={action.variant as "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"}
                  className="w-full justify-start gap-3 h-auto p-4 text-left"
                  >
                    <action.icon className="w-5 h-5" />
                    <div>
                      <p className="font-medium">{action.title}</p>
                      <p className="text-sm opacity-70">{action.description}</p>
                    </div>
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}