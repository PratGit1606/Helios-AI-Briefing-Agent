// app/actions/intake.ts
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface SaveIntakeInput {
  projectId: string;
  stakeholderDocuments: string;
  boilerplateLanguage: string;
}

export async function saveIntake(input: SaveIntakeInput) {
  try {
    const { projectId, stakeholderDocuments, boilerplateLanguage } = input;

    // Validate input
    if (!stakeholderDocuments.trim() || !boilerplateLanguage.trim()) {
      return {
        success: false,
        error: 'Both stakeholder documents and boilerplate language are required'
      };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return {
        success: false,
        error: 'Project not found'
      };
    }

    const intake = await prisma.intake.upsert({
      where: { projectId },
      create: {
        projectId,
        stakeholderDocuments,
        boilerplateLanguage
      },
      update: {
        stakeholderDocuments,
        boilerplateLanguage
      }
    });

    // Log the change
    await prisma.changeLog.create({
      data: {
        projectId,
        action: 'Intake data saved',
        user: 'System',
        metadata: {
          documentsLength: stakeholderDocuments.length,
          boilerplateLength: boilerplateLanguage.length
        }
      }
    });

    revalidatePath(`/brief/${projectId}`);
    
    return {
      success: true,
      data: intake
    };
  } catch (error) {
    console.error('Error saving intake:', error);
    return {
      success: false,
      error: 'Failed to save intake data'
    };
  }
}


export async function getIntake(projectId: string) {
  try {
    const intake = await prisma.intake.findUnique({
      where: { projectId }
    });

    if (!intake) {
      return {
        success: false,
        error: 'Intake data not found'
      };
    }

    return {
      success: true,
      data: intake
    };
  } catch (error) {
    console.error('Error fetching intake:', error);
    return {
      success: false,
      error: 'Failed to fetch intake data'
    };
  }
}