
import React, { useState, useEffect } from "react";
import { JobPreferences } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Target,
  MapPin,
  DollarSign,
  Save,
  Plus,
  X,
  Briefcase,
  Zap,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

import PreferenceSection from "../components/preferences/PreferenceSection";

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState({
    preferred_job_titles: [],
    locations: [],
    salary_min: '',
    salary_max: '',
    employment_types: [],
    keywords_include: [],
    keywords_exclude: [],
    auto_apply_enabled: false,
    max_applications_per_day: 5
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setIsLoading(true);
    try {
      const existing = await JobPreferences.list("-created_date", 1);
      if (existing.length > 0) {
        setPreferences({
          ...existing[0],
          salary_min: existing[0].salary_min || '',
          salary_max: existing[0].salary_max || ''
        });
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false); // Reset success state at the start of a new save attempt
    try {
      // Prepare data with proper type conversion
      const saveData = {
        ...preferences,
        salary_min: preferences.salary_min === '' ? null : parseFloat(preferences.salary_min),
        salary_max: preferences.salary_max === '' ? null : parseFloat(preferences.salary_max)
      };

      // Remove null values to avoid validation errors if backend expects fields to be absent for "no value"
      if (saveData.salary_min === null) delete saveData.salary_min;
      if (saveData.salary_max === null) delete saveData.salary_max;

      const existing = await JobPreferences.list("-created_date", 1);
      if (existing.length > 0) {
        await JobPreferences.update(existing[0].id, saveData);
      } else {
        await JobPreferences.create(saveData);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
    setIsSaving(false);
  };

  const addArrayItem = (field, value) => {
    if (value.trim() && !preferences[field].includes(value.trim())) {
      setPreferences(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeArrayItem = (field, index) => {
    setPreferences(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const toggleEmploymentType = (type) => {
    setPreferences(prev => ({
      ...prev,
      employment_types: prev.employment_types.includes(type)
        ? prev.employment_types.filter(t => t !== type)
        : [...prev.employment_types, type]
    }));
  };

  const employmentTypeOptions = [
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "casual", label: "Casual" },
    { value: "internship", label: "Internship" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Job Search Preferences
          </h1>
          <p className="text-slate-600 text-lg">
            Configure your criteria for automated job applications
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Preferences */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Titles */}
            <PreferenceSection
              icon={Target}
              title="Job Titles"
              description="What positions are you looking for?"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {preferences.preferred_job_titles.map((title, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-2"
                    >
                      {title}
                      <button
                        onClick={() => removeArrayItem('preferred_job_titles', index)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add job title (e.g., Software Engineer)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addArrayItem('preferred_job_titles', e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input');
                      addArrayItem('preferred_job_titles', input.value);
                      input.value = '';
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </PreferenceSection>

            {/* Locations */}
            <PreferenceSection
              icon={MapPin}
              title="Locations"
              description="Where would you like to work?"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {preferences.locations.map((location, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 gap-2"
                    >
                      {location}
                      <button
                        onClick={() => removeArrayItem('locations', index)}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add location (e.g., Sydney, Melbourne, Remote)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addArrayItem('locations', e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input');
                      addArrayItem('locations', input.value);
                      input.value = '';
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </PreferenceSection>

            {/* Salary Range */}
            <PreferenceSection
              icon={DollarSign}
              title="Salary Range"
              description="What's your expected salary range?"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary_min">Minimum ($)</Label>
                  <Input
                    id="salary_min"
                    type="number"
                    placeholder="50000"
                    value={preferences.salary_min}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      salary_min: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary_max">Maximum ($)</Label>
                  <Input
                    id="salary_max"
                    type="number"
                    placeholder="100000"
                    value={preferences.salary_max}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      salary_max: e.target.value
                    }))}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Leave blank if you don't want to specify salary requirements
              </p>
            </PreferenceSection>

            {/* Employment Types */}
            <PreferenceSection
              icon={Briefcase}
              title="Employment Types"
              description="What type of employment are you seeking?"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {employmentTypeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={preferences.employment_types.includes(option.value) ? "default" : "outline"}
                    onClick={() => toggleEmploymentType(option.value)}
                    className="justify-start"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </PreferenceSection>

            {/* Keywords */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Include Keywords */}
              <PreferenceSection
                title="Must Include"
                description="Keywords that must appear in job descriptions"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {preferences.keywords_include.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 gap-2"
                      >
                        {keyword}
                        <button
                          onClick={() => removeArrayItem('keywords_include', index)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add keyword"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem('keywords_include', e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        const input = e.target.parentElement.querySelector('input');
                        addArrayItem('keywords_include', input.value);
                        input.value = '';
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </PreferenceSection>

              {/* Exclude Keywords */}
              <PreferenceSection
                title="Must Exclude"
                description="Keywords to avoid in job descriptions"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {preferences.keywords_exclude.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200 gap-2"
                      >
                        {keyword}
                        <button
                          onClick={() => removeArrayItem('keywords_exclude', index)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add keyword"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addArrayItem('keywords_exclude', e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        const input = e.target.parentElement.querySelector('input');
                        addArrayItem('keywords_exclude', input.value);
                        input.value = '';
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </PreferenceSection>
            </div>
          </div>

          {/* Automation Settings Sidebar */}
          <div>
            <PreferenceSection
              icon={Zap}
              title="Automation Settings"
              description="Configure how the system applies for jobs"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto_apply">Auto Apply</Label>
                    <p className="text-sm text-slate-500 mt-1">
                      Automatically apply to matching jobs
                    </p>
                  </div>
                  <Switch
                    id="auto_apply"
                    checked={preferences.auto_apply_enabled}
                    onCheckedChange={(checked) => setPreferences(prev => ({
                      ...prev,
                      auto_apply_enabled: checked
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_apps">Daily Application Limit</Label>
                  <Input
                    id="max_apps"
                    type="number"
                    min="1"
                    max="20"
                    value={preferences.max_applications_per_day}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      max_applications_per_day: parseInt(e.target.value) || 5
                    }))}
                  />
                  <p className="text-xs text-slate-500">
                    Maximum applications per day (1-20)
                  </p>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={isSaving || saveSuccess}
                  className={`w-full gap-2 transition-colors ${
                    saveSuccess
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Save className="w-4 h-4" />
                      </motion.div>
                      Saving...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Preferences Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </div>
            </PreferenceSection>
          </div>
        </div>
      </div>
    </div>
  );
}
