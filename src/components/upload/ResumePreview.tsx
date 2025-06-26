import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  X, 
  User, 
  Briefcase, 
  GraduationCap, 
  Mail,
  Phone,
  MapPin,
  Save,
  Edit3
} from "lucide-react";
import { motion } from "framer-motion";

export default function ResumePreview({ extractedData, onSave, onCancel, isSaving }) {
  const [editedData, setEditedData] = useState(extractedData);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(editedData);
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setEditedData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), ""]
    }));
  };

  const removeArrayItem = (field, index) => {
    setEditedData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              Resume Processed Successfully
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2"
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? "View Mode" : "Edit Mode"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <User className="w-5 h-5" />
              Contact Information
            </div>
            
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={editedData.contact_info?.email || ''}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editedData.contact_info?.phone || ''}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editedData.contact_info?.location || ''}
                    onChange={(e) => handleContactChange('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {editedData.contact_info?.email && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span>{editedData.contact_info.email}</span>
                  </div>
                )}
                {editedData.contact_info?.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>{editedData.contact_info.phone}</span>
                  </div>
                )}
                {editedData.contact_info?.location && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{editedData.contact_info.location}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Briefcase className="w-5 h-5" />
              Experience
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={editedData.experience_years || ''}
                  onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value))}
                  placeholder="5"
                />
              </div>
            ) : (
              <p className="text-slate-600">
                <span className="font-semibold text-emerald-600">{editedData.experience_years || 0}</span> years of experience
              </p>
            )}
          </div>

          {/* Job Titles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Previous Job Titles</h3>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('job_titles')}
                >
                  Add Title
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                {editedData.job_titles?.map((title, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={title}
                      onChange={(e) => handleArrayChange('job_titles', index, e.target.value)}
                      placeholder="Job title"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem('job_titles', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {editedData.job_titles?.map((title, index) => (
                  <Badge key={index} variant="outline" className="text-slate-700">
                    {title}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('skills')}
                >
                  Add Skill
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                {editedData.skills?.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={skill}
                      onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                      placeholder="Skill name"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem('skills', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {editedData.skills?.map((skill, index) => (
                  <Badge key={index} className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Education */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <GraduationCap className="w-5 h-5" />
              Education
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                {editedData.education?.map((edu, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={edu}
                      onChange={(e) => handleArrayChange('education', index, e.target.value)}
                      placeholder="Education qualification"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem('education', index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('education')}
                >
                  Add Education
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {editedData.education?.map((edu, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-slate-700">{edu}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-700 gap-2"
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
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Save Resume
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}