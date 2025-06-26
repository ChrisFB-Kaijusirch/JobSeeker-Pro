{
  "name": "JobApplication",
  "type": "object",
  "properties": {
    "job_title": {
      "type": "string",
      "description": "Title of the job applied for"
    },
    "company_name": {
      "type": "string",
      "description": "Name of the company"
    },
    "job_url": {
      "type": "string",
      "description": "URL to the job posting on Seek"
    },
    "job_description": {
      "type": "string",
      "description": "Full job description"
    },
    "salary_range": {
      "type": "string",
      "description": "Salary range if mentioned"
    },
    "location": {
      "type": "string",
      "description": "Job location"
    },
    "employment_type": {
      "type": "string",
      "enum": [
        "full_time",
        "part_time",
        "contract",
        "casual",
        "internship"
      ],
      "description": "Type of employment"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "applied",
        "reviewing",
        "interview",
        "rejected",
        "offer",
        "accepted"
      ],
      "default": "pending",
      "description": "Current application status"
    },
    "match_score": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "How well the job matches the resume (0-100)"
    },
    "auto_applied": {
      "type": "boolean",
      "default": false,
      "description": "Whether this was automatically applied to"
    },
    "application_date": {
      "type": "string",
      "format": "date",
      "description": "Date when application was submitted"
    },
    "notes": {
      "type": "string",
      "description": "Personal notes about this application"
    }
  },
  "required": [
    "job_title",
    "company_name",
    "job_url",
    "location"
  ]
}