'use server';

import { prisma } from '@/lib/db';
import { logger, Timer } from '@/lib/debug';

export interface ExportDataResponse {
  success: boolean;
  data?: {
    project: {
      id: string;
      name: string;
      status: string;
      createdAt: Date;
    };
    brief: {
      purpose: string;
      primaryAudience: string;
      secondaryAudience: string;
      tone: string;
      sitemap: string[];
      constraints: string[];
      assumptions: Array<{ text: string; confidence: string }>;
      openQuestions: string[];
      isApproved: boolean;
      approvedAt: Date | null;
    };
    artifacts: Array<{
      type: string;
      content: Record<string, unknown>;
    }>;
    comments: Array<{
      author: string;
      text: string;
      section: string;
      createdAt: Date;
    }>;
  };
  error?: string;
}

export async function getExportData(projectId: string): Promise<ExportDataResponse> {
  const timer = new Timer('getExportData');

  try {
    logger.info('getExportData', 'Fetching export data', { projectId });

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        brief: true,
        artifacts: {
          orderBy: { createdAt: 'asc' }
        },
        comments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) {
      return {
        success: false,
        error: 'Project not found'
      };
    }

    if (!project.brief) {
      return {
        success: false,
        error: 'No brief found for this project'
      };
    }

    const exportData = {
      project: {
        id: project.id,
        name: project.name,
        status: project.status,
        createdAt: project.createdAt
      },
      brief: {
        purpose: project.brief.purpose,
        primaryAudience: project.brief.primaryAudience,
        secondaryAudience: project.brief.secondaryAudience,
        tone: project.brief.tone,
        sitemap: project.brief.sitemap as string[],
        constraints: project.brief.constraints as string[],
        assumptions: project.brief.assumptions as Array<{ text: string; confidence: string }>,
        openQuestions: project.brief.openQuestions as string[],
        isApproved: project.brief.isApproved,
        approvedAt: project.brief.approvedAt
      },
      artifacts: project.artifacts.map(a => ({
        type: a.type,
        content: a.content as Record<string, unknown>
      })),
      comments: project.comments.map(c => ({
        author: c.author,
        text: c.text,
        section: c.section,
        createdAt: c.createdAt
      }))
    };

    await prisma.changeLog.create({
      data: {
        projectId,
        action: 'Export data retrieved',
        user: 'System',
        metadata: {
          briefExists: !!project.brief,
          artifactCount: project.artifacts.length,
          commentCount: project.comments.length
        }
      }
    });

    timer.end();
    logger.info('getExportData', 'Export data retrieved successfully', { projectId });

    return {
      success: true,
      data: exportData
    };
  } catch (error) {
    timer.end('Failed');
    logger.error('getExportData', 'Error fetching export data', { projectId, error });
    console.error('Error fetching export data:', error);

    return {
      success: false,
      error: 'Failed to fetch export data'
    };
  }
}

export async function logExport(projectId: string, format: 'markdown' | 'pdf' | 'json') {
  try {
    await prisma.changeLog.create({
      data: {
        projectId,
        action: `Brief exported as ${format.toUpperCase()}`,
        user: 'System',
        metadata: { format }
      }
    });

    return { success: true };
  } catch (error) {
    logger.error('logExport', 'Error logging export', { projectId, format, error });
    return { success: false };
  }
}