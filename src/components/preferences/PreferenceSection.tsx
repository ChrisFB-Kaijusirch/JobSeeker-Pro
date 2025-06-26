import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { motion } from "framer-motion";

interface PreferenceSectionProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function PreferenceSection({ icon: Icon, title, description, children }: PreferenceSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-3 text-lg">
            {Icon && (
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Icon className="w-5 h-5 text-emerald-600" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-slate-900">{title}</h3>
              {description && (
                <p className="text-sm text-slate-500 font-normal mt-1">{description}</p>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}