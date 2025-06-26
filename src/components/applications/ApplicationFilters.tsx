import React from "react";
import type { FilterOptions } from "../../types";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Filter, MapPin, DollarSign, Clock, X } from "lucide-react";

interface ApplicationFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (updater: (prev: FilterOptions) => FilterOptions) => void;
}

export default function ApplicationFilters({ filters, onFiltersChange }: ApplicationFiltersProps) {
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== "all" && value !== "").length;

  const clearAllFilters = () => {
    onFiltersChange(() => ({
      status: "all",
      employment_type: "all",
      auto_applied: "all",
      date_range: "all",
      remote_only: "all",
      bookmarked: "all",
      salary_min: "",
      salary_max: "",
      location_filter: ""
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <Select 
            value={filters.status} 
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-32 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select 
          value={filters.employment_type} 
          onValueChange={(value) => handleFilterChange('employment_type', value)}
        >
          <SelectTrigger className="w-32 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full_time">Full Time</SelectItem>
            <SelectItem value="part_time">Part Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
            <SelectItem value="freelance">Freelance</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-slate-500" />
          <Select 
            value={filters.remote_only} 
            onValueChange={(value) => handleFilterChange('remote_only', value)}
          >
            <SelectTrigger className="w-36 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="true">Remote Only</SelectItem>
              <SelectItem value="false">On-site</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select 
          value={filters.auto_applied} 
          onValueChange={(value) => handleFilterChange('auto_applied', value)}
        >
          <SelectTrigger className="w-36 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <SelectValue placeholder="Application" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Applications</SelectItem>
            <SelectItem value="true">Auto-applied</SelectItem>
            <SelectItem value="false">Manual</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.bookmarked} 
          onValueChange={(value) => handleFilterChange('bookmarked', value)}
        >
          <SelectTrigger className="w-32 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <SelectValue placeholder="Saved" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            <SelectItem value="true">Bookmarked</SelectItem>
            <SelectItem value="false">Not Saved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-slate-500" />
          <Input
            type="number"
            placeholder="Min salary"
            value={filters.salary_min || ""}
            onChange={(e) => handleFilterChange('salary_min', e.target.value)}
            className="w-28 bg-white/80 backdrop-blur-sm border-0 shadow-sm"
          />
          <span className="text-slate-400">-</span>
          <Input
            type="number"
            placeholder="Max salary"
            value={filters.salary_max || ""}
            onChange={(e) => handleFilterChange('salary_max', e.target.value)}
            className="w-28 bg-white/80 backdrop-blur-sm border-0 shadow-sm"
          />
        </div>

        <Input
          placeholder="Filter by location..."
          value={filters.location_filter || ""}
          onChange={(e) => handleFilterChange('location_filter', e.target.value)}
          className="w-40 bg-white/80 backdrop-blur-sm border-0 shadow-sm"
        />

        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="bg-slate-100 hover:bg-slate-200 border-0 gap-2"
          >
            <X className="w-3 h-3" />
            Clear All ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.status !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-500" 
                onClick={() => handleFilterChange('status', 'all')}
              />
            </Badge>
          )}
          {filters.employment_type !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Type: {filters.employment_type.replace('_', ' ')}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-500" 
                onClick={() => handleFilterChange('employment_type', 'all')}
              />
            </Badge>
          )}
          {filters.remote_only !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Location: {filters.remote_only === "true" ? "Remote" : filters.remote_only === "false" ? "On-site" : "Hybrid"}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-500" 
                onClick={() => handleFilterChange('remote_only', 'all')}
              />
            </Badge>
          )}
          {(filters.salary_min || filters.salary_max) && (
            <Badge variant="secondary" className="gap-1">
              Salary: {filters.salary_min ? `$${filters.salary_min}k` : 'Any'} - {filters.salary_max ? `$${filters.salary_max}k` : 'Any'}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-500" 
                onClick={() => {
                  handleFilterChange('salary_min', '');
                  handleFilterChange('salary_max', '');
                }}
              />
            </Badge>
          )}
          {filters.location_filter && (
            <Badge variant="secondary" className="gap-1">
              Location: {filters.location_filter}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-500" 
                onClick={() => handleFilterChange('location_filter', '')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}