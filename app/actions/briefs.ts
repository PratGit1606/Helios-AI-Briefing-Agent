'use server';

import { prisma } from '@/lib/db';
import { generateBrief } from '@/lib/ai';
import { revalidatePath } from 'next/cache';
import { logger, Timer } from '@/lib/debug';

export interface GenerateBriefInput {
  projectId: string;
}

export async function generateBriefFromIntake(input: GenerateBriefInput) {
  const timer = new Timer('generateBriefFromIntake');
  const { projectId } = input;

  try {
    logger.info('generateBriefFromIntake', 'Starting brief generation', { projectId });

    const intake = await prisma.intake.findUnique({
      where: { projectId }
    });

    if (!intake) {
      timer.end('Failed - no intake');
      logger.warn('generateBriefFromIntake', 'Intake data not found', { projectId });
      return {
        success: false,
        error: 'Intake data not found. Please complete the stakeholder intake first.'
      };
    }

    const existingBrief = await prisma.brief.findUnique({
      where: { projectId }
    });

    if (existingBrief) {
      timer.end('Brief already exists');
      logger.info('generateBriefFromIntake', 'Brief already exists', { projectId });
      return {
        success: true,
        data: existingBrief,
        alreadyExists: true
      };
    }

    logger.info('generateBriefFromIntake', 'Calling OpenAI API');
    const briefData = await generateBrief({
      stakeholderDocuments: intake.stakeholderDocuments,
      boilerplateLanguage: intake.boilerplateLanguage
    });

    logger.info('generateBriefFromIntake', 'OpenAI response received', {
      hasAllFields: !!(briefData.purpose && briefData.primaryAudience && briefData.tone)
    });

    const brief = await prisma.brief.create({
      data: {
        projectId,
        purpose: briefData.purpose,
        primaryAudience: briefData.primaryAudience,
        secondaryAudience: briefData.secondaryAudience,
        tone: briefData.tone,
        sitemap: briefData.sitemap,
        constraints: briefData.constraints,
        assumptions: briefData.assumptions,
        openQuestions: briefData.openQuestions,
        isApproved: false
      }
    });

    await prisma.changeLog.create({
      data: {
        projectId,
        action: 'Brief generated via AI',
        user: 'System',
        metadata: {
          model: 'gpt-4-turbo-preview',
          sitemapPages: briefData.sitemap.length,
          constraints: briefData.constraints.length,
          assumptions: briefData.assumptions.length
        }
      }
    });

    timer.end();
    logger.info('generateBriefFromIntake', 'Brief created successfully', {
      briefId: brief.id,
      projectId
    });

    revalidatePath(`/brief/${projectId}`);

    return {
      success: true,
      data: brief
    };
  } catch (error) {
    timer.end('Failed');
    logger.error('generateBriefFromIntake', 'Error generating brief', { projectId, error });
    console.error('Error generating brief:', error);

    return {
      success: false,
      error: 'Failed to generate brief. Please try again.'
    };
  }
}

export async function getBrief(projectId: string) {
  const timer = new Timer('getBrief');

  try {
    const brief = await prisma.brief.findUnique({
      where: { projectId }
    });

    if (!brief) {
      timer.end('Not found');
      return {
        success: false,
        error: 'Brief not found'
      };
    }

    timer.end();
    logger.info('getBrief', 'Brief retrieved', { projectId, isApproved: brief.isApproved });

    return {
      success: true,
      data: brief
    };
  } catch (error) {
    timer.end('Failed');
    logger.error('getBrief', 'Error fetching brief', { projectId, error });
    console.error('Error fetching brief:', error);

    return {
      success: false,
      error: 'Failed to fetch brief'
    };
  }
}

export async function approveBrief(projectId: string) {
  const timer = new Timer('approveBrief');

  try {
    logger.info('approveBrief', 'Approving brief', { projectId });

    const brief = await prisma.brief.update({
      where: { projectId },
      data: {
        isApproved: true,
        approvedAt: new Date()
      }
    });

    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'approved',
        changeLog: {
          create: {
            action: 'Brief approved',
            user: 'System'
          }
        }
      }
    });

    timer.end();
    logger.info('approveBrief', 'Brief approved successfully', { projectId });

    revalidatePath(`/brief/${projectId}`);
    revalidatePath('/');

    return {
      success: true,
      data: brief
    };
  } catch (error) {
    timer.end('Failed');
    logger.error('approveBrief', 'Error approving brief', { projectId, error });
    console.error('Error approving brief:', error);

    return {
      success: false,
      error: 'Failed to approve brief'
    };
  }
}

export async function requestBriefChanges(projectId: string, feedback: string) {
  const timer = new Timer('requestBriefChanges');

  try {
    logger.info('requestBriefChanges', 'Changes requested', { projectId });

    await prisma.changeLog.create({
      data: {
        projectId,
        action: 'Changes requested',
        user: 'System',
        metadata: {
          feedback
        }
      }
    });

    timer.end();
    logger.info('requestBriefChanges', 'Change request logged', { projectId });

    revalidatePath(`/brief/${projectId}`);

    return {
      success: true
    };
  } catch (error) {
    timer.end('Failed');
    logger.error('requestBriefChanges', 'Error requesting changes', { projectId, error });
    console.error('Error requesting changes:', error);

    return {
      success: false,
      error: 'Failed to submit change request'
    };
  }
}