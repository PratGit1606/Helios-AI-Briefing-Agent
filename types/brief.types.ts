export interface Assumption {
  text: string;
  confidence: 'low' | 'medium' | 'high';
}

export interface Brief {
  id: string;
  projectId: string;
  purpose: string;
  primaryAudience: string;
  secondaryAudience: string;
  tone: string;
  sitemap: string[];
  constraints: string[];
  assumptions: Assumption[];
  openQuestions: string[];
  isApproved: boolean;
  approvedAt: Date | null;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  section: string;
  createdAt: Date;
}

export interface Artifact {
  id: string;
  type: string;
  content: Record<string, unknown> | null;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  brief: Brief;
  comments: Comment[];
  artifacts: Artifact[];
}

export type TabType = 'brief' | 'content' | 'design' | 'seo' | 'assumptions' | 'history';

export interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled: boolean;
}