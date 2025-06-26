{
  "name": "Resume",
  "type": "object",
  "properties": {
    "file_url": {
      "type": "string",
      "description": "URL to the uploaded DOCX resume file"
    },
    "parsed_content": {
      "type": "string",
      "description": "Extracted text content from the resume"
    },
    "skills": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Extracted skills from resume"
    },
    "experience_years": {
      "type": "number",
      "description": "Years of experience extracted from resume"
    },
    "job_titles": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Previous job titles from resume"
    },
    "education": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Education qualifications"
    },
    "contact_info": {
      "type": "object",
      "properties": {
        "email": {
          "type": "string"
        },
        "phone": {
          "type": "string"
        },
        "location": {
          "type": "string"
        }
      }
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Whether this resume is currently active for job applications"
    }
  },
  "required": [
    "file_url"
  ]
}