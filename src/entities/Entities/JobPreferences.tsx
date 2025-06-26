{
  "name": "JobPreferences",
  "type": "object",
  "properties": {
    "preferred_job_titles": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Job titles to search for"
    },
    "locations": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Preferred job locations"
    },
    "salary_min": {
      "type": "number",
      "description": "Minimum salary expectation"
    },
    "salary_max": {
      "type": "number",
      "description": "Maximum salary expectation"
    },
    "employment_types": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "full_time",
          "part_time",
          "contract",
          "casual",
          "internship"
        ]
      },
      "description": "Preferred employment types"
    },
    "keywords_include": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Keywords that must be included in job descriptions"
    },
    "keywords_exclude": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Keywords to avoid in job descriptions"
    },
    "auto_apply_enabled": {
      "type": "boolean",
      "default": false,
      "description": "Whether to automatically apply to matching jobs"
    },
    "max_applications_per_day": {
      "type": "number",
      "default": 5,
      "description": "Maximum number of applications to submit per day"
    }
  },
  "required": [
    "preferred_job_titles",
    "locations"
  ]
}