
export interface Profile {
  fullName: string;
  phone: string;
  email: string;
  linkedin?: string;
  github?: string;
  leetcode?: string;
  website?: string;
  location?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
  grade: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  location?: string;
  description: string[]; // Bullet points
}

export interface SkillCategory {
  id: string;
  name: string;
  items: string;
}

export interface Project {
  id: string;
  title: string;
  githubLink?: string;
  demoLink?: string;
  description: string[];
}

export interface Achievement {
  id: string;
  description: string;
}

export enum TemplateType {
  ADMIN_CLASSICAL = 'ADMIN_CLASSICAL',
  MODERN_SIDEBAR = 'MODERN_SIDEBAR',
  MINIMALIST = 'MINIMALIST',
  EXECUTIVE_COLUMN = 'EXECUTIVE_COLUMN',
  CREATIVE_HEADER = 'CREATIVE_HEADER',
}

export interface FormattingSettings {
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  lineHeight: number;
  sectionSpacing: number;
  // New Customizations
  template: TemplateType;
  font: string; // 'sans', 'serif', 'mono'
  backgroundColor: string; // Hex code
  accentColor: string; // Hex code
}

export interface ResumeData {
  profile: Profile;
  education: Education[];
  experience: Experience[];
  skills: SkillCategory[];
  projects: Project[];
  achievements: Achievement[];
  settings?: FormattingSettings;
}

export interface User {
  _id?: string;
  username: string;
  password: string; // Stored simply for this demo
}

export interface ResumeVersion {
  _id?: string;
  id: string;
  name: string;
  timestamp: number;
  data: ResumeData;
  username: string;
}
