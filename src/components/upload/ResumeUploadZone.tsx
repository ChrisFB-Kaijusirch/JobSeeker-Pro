
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ResumeUploadZone({ onFileSelect }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
        dragActive 
          ? "border-emerald-400 bg-emerald-50" 
          : "border-slate-300 hover:border-emerald-300 hover:bg-emerald-50/50"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        className="hidden"
      />

      <motion.div
        animate={{ scale: dragActive ? 1.05 : 1 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
          <FileText className="w-10 h-10 text-emerald-600" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">
            Upload Your Resume
          </h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Drag and drop your PDF resume here, or click to browse and select your file.
          </p>
        </div>

        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-emerald-600 hover:bg-emerald-700 gap-2 px-6 py-3"
        >
          <Upload className="w-5 h-5" />
          Choose PDF File
        </Button>

        <div className="flex items-center gap-2 text-sm text-slate-500 justify-center">
          <AlertCircle className="w-4 h-4" />
          <span>Only PDF format is supported</span>
        </div>
      </motion.div>
    </div>
  );
}
