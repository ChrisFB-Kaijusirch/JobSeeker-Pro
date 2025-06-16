// Base API URL and key
const API_BASE_URL = 'https://app.base44.com/api/apps/684625ec7844c991c15bf07f';
const API_KEY = '34f188620dd84096a4d4f82526a9422f';

// Base class for all entities
class BaseEntity {
  static async request(endpoint: string, method = 'GET', data?: any) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'api_key': API_KEY,
        'Content-Type': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
}

// Resume entity
export class Resume extends BaseEntity {
  static async list(sortBy = "-created_date", limit = 0) {
    const endpoint = `/entities/Resume?sort=${sortBy}${limit ? `&limit=${limit}` : ''}`;
    return this.request(endpoint);
  }

  static async get(id: string) {
    return this.request(`/entities/Resume/${id}`);
  }

  static async create(data: any) {
    return this.request('/entities/Resume', 'POST', data);
  }

  static async update(id: string, data: any) {
    return this.request(`/entities/Resume/${id}`, 'PUT', data);
  }

  static async delete(id: string) {
    return this.request(`/entities/Resume/${id}`, 'DELETE');
  }

  static async filter(criteria: any) {
    const queryParams = Object.entries(criteria)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');
    
    return this.request(`/entities/Resume?${queryParams}`);
  }
}

// JobApplication entity
export class JobApplication extends BaseEntity {
  static async list(sortBy = "-created_date", limit = 0) {
    const endpoint = `/entities/JobApplication?sort=${sortBy}${limit ? `&limit=${limit}` : ''}`;
    return this.request(endpoint);
  }

  static async get(id: string) {
    return this.request(`/entities/JobApplication/${id}`);
  }

  static async create(data: any) {
    return this.request('/entities/JobApplication', 'POST', data);
  }

  static async bulkCreate(dataArray: any[]) {
    const promises = dataArray.map(data => this.create(data));
    return Promise.all(promises);
  }

  static async update(id: string, data: any) {
    return this.request(`/entities/JobApplication/${id}`, 'PUT', data);
  }

  static async delete(id: string) {
    return this.request(`/entities/JobApplication/${id}`, 'DELETE');
  }

  static async filter(criteria: any) {
    const queryParams = Object.entries(criteria)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');
    
    return this.request(`/entities/JobApplication?${queryParams}`);
  }
}

// JobPreferences entity
export class JobPreferences extends BaseEntity {
  static async list(sortBy = "-created_date", limit = 0) {
    const endpoint = `/entities/JobPreferences?sort=${sortBy}${limit ? `&limit=${limit}` : ''}`;
    return this.request(endpoint);
  }

  static async get(id: string) {
    return this.request(`/entities/JobPreferences/${id}`);
  }

  static async create(data: any) {
    return this.request('/entities/JobPreferences', 'POST', data);
  }

  static async update(id: string, data: any) {
    return this.request(`/entities/JobPreferences/${id}`, 'PUT', data);
  }

  static async delete(id: string) {
    return this.request(`/entities/JobPreferences/${id}`, 'DELETE');
  }
}