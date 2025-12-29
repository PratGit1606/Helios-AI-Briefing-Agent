export type ProjectStatus = 'draft' | 'approved';

export type ArtifactType = 'content' | 'design' | 'seo' | 'assumptions' | 'history';

export interface Assumption {
  text: string;
  confidence: 'low' | 'medium' | 'high';
}

export interface ContentArtifact {
  title: string;
  items: Array<{
    page: string;
    component: string;
    rationale: string;
  }>;
}

export interface DesignArtifact {
  title: string;
  items: Array<{
    type: string;
    style: string;
    reference: string;
  }>;
}

export interface SEOArtifact {
  title: string;
  keywords: Array<{
    term: string;
    volume: string;
    difficulty: 'Low' | 'Medium' | 'High';
  }>;
  metadata: string;
}

export interface HistoryArtifact {
  title: string;
  events: Array<{
    date: string;
    action: string;
    user: string;
  }>;
}