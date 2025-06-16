
import React, { useState, useCallback } from "react";
import { Resume } from "@/entities/all";
import { UploadFile, ExtractDataFromUploadedFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Upload as UploadIcon, 
  FileText, 
  ArrowLeft, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ResumeUploadZone from "../components/upload/ResumeUploadZone";
import ResumePreview from "../components/upload/ResumePreview";

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }
    setFile(selectedFile);
    setError(null);
  };

  const processResume = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(90, prev + 10));
      }, 200);

      const { file_url } = await UploadFile({ file });
      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsUploading(false);
      setIsProcessing(true);

      // Extract data from resume
      const result = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            skills: {
              type: "array",
              items: { type: "string" },
              description: "Technical and soft skills mentioned in the resume"
            },
            experience_years: {
              type: "number", 
              description: "Total years of work experience"
            },
            job_titles: {
              type: "array",
              items: { type: "string" },
              description: "Previous job titles and positions"
            },
            education: {
              type: "array",
              items: { type: "string" },
              description: "Education qualifications, degrees, certifications"
            },
            contact_info: {
              type: "object",
              properties: {
                email: { type: "string" },
                phone: { type: "string" },
                location: { type: "string" }
              },
              description: "Contact information from the resume"
            },
            summary: {
              type: "string",
              description: "Professional summary or objective"
            }
          }
        }
      });

      if (result.status === "success") {
        setExtractedData({
          file_url,
          parsed_content: "Resume successfully processed",
          ...result.output
        });
      } else {
        throw new Error(result.details || "Failed to process resume");
      }
    } catch (error) {
      setError(`Error processing resume: ${error.message}`);
    }
    
    setIsProcessing(false);
  };

  const saveResume = async (resumeData) => {
    setIsSaving(true);
    try {
      // Mark all existing resumes as inactive
      const existingResumes = await Resume.list();
      for (const resume of existingResumes) {
        if (resume.is_active) {
          await Resume.update(resume.id, { is_active: false });
        }
      }
      
      // Save new resume as active
      await Resume.create({
        ...resumeData,
        is_active: true
      });
      
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      setError("Error saving resume. Please try again.");
    }
    setIsSaving(false);
  };

  const resetUpload = () => {
    setFile(null);
    setExtractedData(null);
    setError(null);
    setUploadProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Upload Resume</h1>
            <p className="text-slate-600 mt-1">
              Upload your PDF resume to start automated job applications
            </p>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!extractedData ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="w-6 h-6 text-emerald-600" />
                    Select Your Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResumeUploadZone onFileSelect={handleFileSelect} />
                </CardContent>
              </Card>

              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-blue-600" />
                          <div>
                            <p className="font-medium text-slate-900">{file.name}</p>
                            <p className="text-sm text-slate-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={resetUpload}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {(isUploading || isProcessing) && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {isUploading ? "Uploading resume..." : "Processing with AI..."}
                          </div>
                          {isUploading && (
                            <Progress value={uploadProgress} className="h-2" />
                          )}
                        </div>
                      )}

                      {!isUploading && !isProcessing && (
                        <Button
                          onClick={processResume}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
                        >
                          <UploadIcon className="w-4 h-4" />
                          Process Resume
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResumePreview
                extractedData={extractedData}
                onSave={saveResume}
                onCancel={resetUpload}
                isSaving={isSaving}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
