const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

interface ApiOptions {
  method?: string;
  body?: any;
  token?: string | null;
}

async function apiRequest(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', body, token } = options;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method,
    headers,
  };
  
  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : {};
    
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
}

// Auth API
export const authApi = {
  signup: (email: string, password: string, name: string) =>
    apiRequest('/auth/signup', { method: 'POST', body: { email, password, name } }),

  login: (email: string, password: string) =>
    apiRequest('/auth/login', { method: 'POST', body: { email, password } }),
  
  me: (token: string) =>
    apiRequest('/auth/me', { token }),
};

// Betting API
export const bettingApi = {
  placeBet: (token: string, betData: any) =>
    apiRequest('/bets/place', { method: 'POST', body: betData, token }),
  
  getMyBets: (token: string) =>
    apiRequest('/bets/my-bets', { token }),
};

// Leaderboard API
export const leaderboardApi = {
  getLeaderboard: () =>
    apiRequest('/leaderboard'),
};

// Races API
export const racesApi = {
  getRaces: () =>
    apiRequest('/races'),
  
  getRace: (id: string) =>
    apiRequest(`/races/${id}`),
  
  getRaceDrivers: (raceId: string) =>
    apiRequest(`/races/${raceId}/drivers`),
};

// Drivers API
export const driversApi = {
  getDrivers: () =>
    apiRequest('/drivers'),
};

// Statistics API
export const statsApi = {
  getUserStats: (userId: string | number) =>
    apiRequest(`/stats/user/${userId}`),
};

// Admin API
export const adminApi = {
  // Races management
  createRace: (token: string, raceData: any) =>
    apiRequest('/admin/races', { method: 'POST', body: raceData, token }),
  
  updateRace: (token: string, id: string, updates: any) =>
    apiRequest(`/admin/races/${id}`, { method: 'PUT', body: updates, token }),
  
  deleteRace: (token: string, id: string) =>
    apiRequest(`/admin/races/${id}`, { method: 'DELETE', token }),
  
  // Drivers management
  createDriver: (token: string, driverData: any) =>
    apiRequest('/admin/drivers', { method: 'POST', body: driverData, token }),
  
  updateDriver: (token: string, id: string, updates: any) =>
    apiRequest(`/admin/drivers/${id}`, { method: 'PUT', body: updates, token }),
  
  deleteDriver: (token: string, id: string) =>
    apiRequest(`/admin/drivers/${id}`, { method: 'DELETE', token }),
  
  addDriverToRace: (token: string, raceId: string, driverData: any) =>
    apiRequest(`/admin/races/${raceId}/drivers`, { method: 'POST', body: driverData, token }),
  
  removeDriverFromRace: (token: string, raceId: string, driverId: string) =>
    apiRequest(`/admin/races/${raceId}/drivers/${driverId}`, { method: 'DELETE', token }),
  
  // Users management
  getUsers: (token: string) =>
    apiRequest('/admin/users', { token }),
  
  banUser: (token: string, userId: string, banned: boolean) =>
    apiRequest(`/admin/users/${userId}/ban`, { 
      method: 'PATCH', 
      body: { banned }, 
      token 
    }),
  
  updateUserRole: (token: string, userId: string, role: string) =>
    apiRequest(`/admin/users/${userId}/role`, { 
      method: 'PATCH', 
      body: { role }, 
      token 
    }),
  
  // Bets management
  getBets: (token: string) =>
    apiRequest('/admin/bets', { token }),
  
  settleBet: (token: string, betId: string, result: 'won' | 'lost') =>
    apiRequest(`/admin/bets/${betId}/settle`, { 
      method: 'PATCH', 
      body: { result }, 
      token 
    }),
  
  // Stats
  getStats: (token: string) =>
    apiRequest('/admin/stats', { token }),

  cleanDatabase: (token: string) =>
    apiRequest('/admin/import/clean', { method: 'POST', token }),

  importDrivers: (token: string) =>
    apiRequest('/admin/import/drivers', { method: 'POST', token }),

  importRaces: (token: string) =>
    apiRequest('/admin/import/races', { method: 'POST', token }),

  importAssociations: (token: string) =>
    apiRequest('/admin/import/associations', { method: 'POST', token }),
};