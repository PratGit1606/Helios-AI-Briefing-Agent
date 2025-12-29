import type { ExportDataResponse } from '@/app/actions/exports';

export function exportToMarkdown(data: ExportDataResponse['data']): string {
  if (!data) return '';

  const { project, brief, artifacts, comments } = data;

  let markdown = `# ${project.name}\n\n`;
  markdown += `**Status:** ${project.status}\n`;
  markdown += `**Created:** ${new Date(project.createdAt).toLocaleDateString()}\n`;
  
  if (brief.isApproved && brief.approvedAt) {
    markdown += `**Approved:** ${new Date(brief.approvedAt).toLocaleDateString()}\n`;
  }
  
  markdown += `\n---\n\n`;

  markdown += `## Purpose\n\n${brief.purpose}\n\n`;

  markdown += `## Target Audiences\n\n`;
  markdown += `### Primary Audience\n${brief.primaryAudience}\n\n`;
  markdown += `### Secondary Audience\n${brief.secondaryAudience}\n\n`;

  markdown += `## Tone & Voice\n\n${brief.tone}\n\n`;

  markdown += `## Sitemap\n\n`;
  brief.sitemap.forEach(page => {
    markdown += `- ${page}\n`;
  });
  markdown += `\n`;

  markdown += `## Constraints\n\n`;
  brief.constraints.forEach(constraint => {
    markdown += `- ✓ ${constraint}\n`;
  });
  markdown += `\n`;

  markdown += `## Assumptions\n\n`;
  brief.assumptions.forEach(assumption => {
    const emoji = assumption.confidence === 'high' ? '🟢' : 
                  assumption.confidence === 'medium' ? '🟡' : '🔴';
    markdown += `- ${emoji} **[${assumption.confidence.toUpperCase()}]** ${assumption.text}\n`;
  });
  markdown += `\n`;

  markdown += `## Open Questions\n\n`;
  brief.openQuestions.forEach(question => {
    markdown += `- ⚠️ ${question}\n`;
  });
  markdown += `\n`;

  if (artifacts.length > 0) {
    markdown += `---\n\n## Artifacts\n\n`;
    
    artifacts.forEach(artifact => {
      markdown += `### ${artifact.type.toUpperCase()}\n\n`;
      markdown += `\`\`\`json\n${JSON.stringify(artifact.content, null, 2)}\n\`\`\`\n\n`;
    });
  }

  if (comments.length > 0) {
    markdown += `---\n\n## Comments\n\n`;
    
    comments.forEach(comment => {
      markdown += `**${comment.author}** _(${comment.section})_\n`;
      markdown += `> ${comment.text}\n`;
      markdown += `_${new Date(comment.createdAt).toLocaleDateString()}_\n\n`;
    });
  }

  return markdown;
}