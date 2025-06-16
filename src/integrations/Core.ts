/**
 * Core integration functions for AI and file operations
 */

// Base API URL and key
const API_BASE_URL = 'https://app.base44.com/api/apps/684625ec7844c991c15bf07f';
const API_KEY = '34f188620dd84096a4d4f82526a9422f';

/**
 * Invokes the LLM (Language Learning Model) with the given parameters
 * @param options Configuration options for the LLM request
 * @returns The LLM response
 */
export async function InvokeLLM({ 
  prompt, 
  add_context_from_internet = false, 
  response_json_schema = null 
}: {
  prompt: string;
  add_context_from_internet?: boolean;
  response_json_schema?: any;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/invoke`, {
      method: 'POST',
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        add_context_from_internet,
        response_json_schema
      })
    });

    if (!response.ok) {
      throw new Error(`LLM invocation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.output || data;
  } catch (error) {
    console.error('Error invoking LLM:', error);
    throw error;
  }
}

/**
 * Uploads a file to the server
 * @param options File upload options
 * @returns Upload result including the file URL
 */
export async function UploadFile({ file }: { file: File }) {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        'api_key': API_KEY,
        // Don't set Content-Type here, it will be set automatically with the boundary
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`File upload failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Extracts data from an uploaded file using AI
 * @param options Options for data extraction
 * @returns Extracted data according to the provided schema
 */
export async function ExtractDataFromUploadedFile({ 
  file_url, 
  json_schema 
}: {
  file_url: string;
  json_schema: any;
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/extract`, {
      method: 'POST',
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        file_url,
        json_schema
      })
    });

    if (!response.ok) {
      throw new Error(`Data extraction failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error extracting data from file:', error);
    throw error;
  }
}