import { ResumeData, User, ResumeVersion } from '../types';

const API_URL = '/api';

async function api<T>(action: string, body: Record<string, any>): Promise<T> {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, ...body })
    });
    if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
    }
    const json = await res.json();
    if (!json.success) {
        throw new Error(`API error: ${json.message}`);
    }
    return json.data;
}


export const StorageService = {
  // --- Auth Methods ---
  register: async (user: User): Promise<boolean> => {
    return await api('register', user);
  },

  login: async (user: User): Promise<boolean> => {
    return await api('login', user);
  },

  // --- Resume Data Methods ---
  getVersions: async (username: string): Promise<ResumeVersion[]> => {
    return await api('getVersions', { username });
  },

  saveNewVersion: async (username: string, name: string, data: ResumeData): Promise<ResumeVersion> => {
    return await api('saveNewVersion', { username, name, data });
  },

  updateVersion: async (username: string, versionId: string, name: string, data: ResumeData): Promise<ResumeVersion | null> => {
    return await api('updateVersion', { username, versionId, name, data });
  },

  deleteVersion: async (username: string, versionId: string): Promise<boolean> => {
    return await api('deleteVersion', { username, versionId });
  },
};