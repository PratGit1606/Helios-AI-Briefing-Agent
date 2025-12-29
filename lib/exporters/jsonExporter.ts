import type { ExportDataResponse } from '@/app/actions/exports';

export function exportToJSON(data: ExportDataResponse['data']): string {
  if (!data) return '{}';

  const { project, brief, artifacts, comments } = data;

  const exportObject = {
    metadata: {
      exportedAt: new Date().toISOString(),
      exportedBy: 'Helios AI Web Briefing Agent',
      version: '1.0'
    },
    project: {
      id: project.id,
      name: project.name,
      status: project.status,
      createdAt: project.createdAt,
      url: `/brief/${project.id}`
    },
    brief: {
      status: brief.isApproved ? 'approved' : 'draft',
      approvedAt: brief.approvedAt,
      content: {
        purpose: brief.purpose,
        audiences: {
          primary: brief.primaryAudience,
          secondary: brief.secondaryAudience
        },
        tone: brief.tone,
        sitemap: brief.sitemap,
        constraints: brief.constraints,
        assumptions: brief.assumptions.map(a => ({
          statement: a.text,
          confidence: a.confidence,
          requiresVerification: a.confidence === 'low'
        })),
        openQuestions: brief.openQuestions
      }
    },
    artifacts: artifacts.reduce((acc, artifact) => {
      acc[artifact.type] = artifact.content;
      return acc;
    }, {} as Record<string, unknown>),
    collaboration: {
      commentCount: comments.length,
      comments: comments.map(c => ({
        author: c.author,
        text: c.text,
        section: c.section,
        timestamp: c.createdAt
      }))
    },
    technical: {
      platform: 'ASU Drupal',
      framework: 'Webspark 2.0',
      accessibility: 'WCAG 2.1 AA',
      responsive: true,
      cms: 'Drupal'
    }
  };

  return JSON.stringify(exportObject, null, 2);
}