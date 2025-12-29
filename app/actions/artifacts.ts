'use server';

import { prisma } from '@/lib/db';
import { generateArtifact } from '@/lib/ai';
import { revalidatePath } from 'next/cache';
import { logger, Timer } from '@/lib/debug';
import type { ArtifactType } from '@/lib/types';
import type { Prisma } from '@prisma/client';

export interface GenerateArtifactsInput {
  projectId: string;
}

export async function generateArtifacts(input: GenerateArtifactsInput) {
  const timer = new Timer('generateArtifacts');
  const { projectId } = input;

  try {
    logger.info('generateArtifacts', 'Starting artifact generation', { projectId });

    const brief = await prisma.brief.findUnique({
      where: { projectId }
    });

    if (!brief || !brief.isApproved) {
      timer.end('Failed - brief not approved');
      logger.warn('generateArtifacts', 'Brief not found or not approved', { projectId });
      return {
        success: false,
        error: 'Brief must be approved before generating artifacts.'
      };
    }

    const existingArtifacts = await prisma.artifact.findMany({
      where: { projectId }
    });

    if (existingArtifacts.length > 0) {
      timer.end('Artifacts already exist');
      logger.info('generateArtifacts', 'Artifacts already generated', { 
        projectId, 
        count: existingArtifacts.length 
      });
      return {
        success: true,
        data: existingArtifacts,
        alreadyExists: true
      };
    }

    const briefContent = {
      purpose: brief.purpose,
      primaryAudience: brief.primaryAudience,
      secondaryAudience: brief.secondaryAudience,
      tone: brief.tone,
      sitemap: brief.sitemap as string[],
      constraints: brief.constraints as string[],
      assumptions: brief.assumptions as Array<{ text: string; confidence: 'low' | 'medium' | 'high' }>,
      openQuestions: brief.openQuestions as string[]
    };

    const artifactTypes: ArtifactType[] = ['content', 'design', 'seo', 'assumptions'];
    const generatedArtifacts = [];

    for (const type of artifactTypes) {
      try {
        logger.info('generateArtifacts', `Generating ${type} artifact`, { projectId });
        
        const artifactContent = await generateArtifact({
          briefContent,
          artifactType: type as 'content' | 'design' | 'seo' | 'assumptions'
        });

        const artifact = await prisma.artifact.create({
          data: {
            projectId,
            type,
            content: artifactContent as Prisma.InputJsonValue
          }
        });

        generatedArtifacts.push(artifact);
        logger.info('generateArtifacts', `${type} artifact generated`, { 
          projectId, 
          artifactId: artifact.id 
        });
      } catch (error) {
        logger.error('generateArtifacts', `Failed to generate ${type} artifact`, { 
          projectId, 
          error 
        });
      }
    }

    const changeLogs = await prisma.changeLog.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const historyContent = {
      title: 'Change History',
      events: changeLogs.map(log => ({
        date: log.createdAt.toISOString(),
        action: log.action,
        user: log.user
      }))
    };

    const historyArtifact = await prisma.artifact.create({
      data: {
        projectId,
        type: 'history',
        content: historyContent as Prisma.InputJsonValue
      }
    });

    generatedArtifacts.push(historyArtifact);

    await prisma.changeLog.create({
      data: {
        projectId,
        action: 'Artifacts generated',
        user: 'System',
        metadata: {
          artifactCount: generatedArtifacts.length,
          types: generatedArtifacts.map(a => a.type)
        } as Prisma.InputJsonValue
      }
    });

    timer.end();
    logger.info('generateArtifacts', 'All artifacts generated successfully', { 
      projectId, 
      count: generatedArtifacts.length 
    });

    revalidatePath(`/brief/${projectId}`);

    return {
      success: true,
      data: generatedArtifacts
    };
  } catch (error) {
    timer.end('Failed');
    logger.error('generateArtifacts', 'Error generating artifacts', { projectId, error });
    console.error('Error generating artifacts:', error);

    return {
      success: false,
      error: 'Failed to generate artifacts. Please try again.'
    };
  }
}

export async function getArtifacts(projectId: string) {
  const timer = new Timer('getArtifacts');

  try {
    const artifacts = await prisma.artifact.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' }
    });

    timer.end();
    logger.info('getArtifacts', 'Artifacts retrieved', { 
      projectId, 
      count: artifacts.length 
    });

    return {
      success: true,
      data: artifacts
    };
  } catch (error) {
    timer.end('Failed');
    logger.error('getArtifacts', 'Error fetching artifacts', { projectId, error });
    console.error('Error fetching artifacts:', error);

    return {
      success: false,
      error: 'Failed to fetch artifacts'
    };
  }
}

export async function getArtifactByType(projectId: string, type: ArtifactType) {
  const timer = new Timer('getArtifactByType');

  try {
    const artifact = await prisma.artifact.findFirst({
      where: { 
        projectId,
        type 
      }
    });

    timer.end();

    if (!artifact) {
      return {
        success: false,
        error: 'Artifact not found'
      };
    }

    return {
      success: true,
      data: artifact
    };
  } catch (error) {
    timer.end('Failed');
    logger.error('getArtifactByType', 'Error fetching artifact', { projectId, type, error });
    console.error('Error fetching artifact:', error);

    return {
      success: false,
      error: 'Failed to fetch artifact'
    };
  }
}