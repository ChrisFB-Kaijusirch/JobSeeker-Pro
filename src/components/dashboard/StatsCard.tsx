import React from "react";
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";

const colorClasses = {
  emerald: {
    bg: "bg-emerald-500",
    light: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200"
  },
  blue: {
    bg: "bg-blue-500", 
    light: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200"
  },
  green: {
    bg: "bg-green-500",
    light: "bg-green-50", 
    text: "text-green-600",
    border: "border-green-200"
  },
  amber: {
    bg: "bg-500",
    light: "bg-amber-50",
    text: "text-amber-600", 
    border: "border-amber-200"
  },
  purple: {
    bg: "bg-purple-500",
    light: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200"
  }
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  trend: string | null;
  color?: string;
  onClick: () => void;
  clickable?: boolean;
}

export default function StatsCard({ title, value, icon: Icon, trend, color = "emerald", onClick, clickable = false }: StatsCardProps) {
  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.emerald;
  
  return (
    <motion.div
      whileHover={{ y: clickable ? -4 : -2 }}
      transition={{ duration: 0.2 }}
      className={clickable ? "cursor-pointer" : ""}
      onClick={onClick}
    >
      <Card className={`relative overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-300 ${
        clickable 
          ? "hover:shadow-xl hover:border-emerald-200 border-2 border-transparent" 
          : "hover:shadow-xl"
      }`}>
        <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} opacity-5 rounded-full transform translate-x-8 -translate-y-8`} />
        
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-600">{title}</p>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-slate-900">{value}</p>
                {trend && (
                  <p className={`text-sm font-medium ${colors.text}`}>
                    {trend}
                  </p>
                )}
              </div>
            </div>
            
            <div className={`p-3 rounded-xl ${colors.light} ${colors.border} border ${
              clickable ? "group-hover:scale-110 transition-transform" : ""
            }`}>
              <Icon className={`w-6 h-6 ${colors.text}`} />
            </div>
          </div>
          
          {clickable && (
            <div className="mt-4 text-xs text-slate-500 text-center">
              Click to search for jobs
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}