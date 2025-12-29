'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';


export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return {
      success: true,
      data: projects
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return {
      success: false,
      error: 'Failed to fetch projects'
    };
  }
}

export async function getProject(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        intake: true,
        brief: true,
        artifacts: true,
        comments: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        changeLog: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!project) {
      return {
        success: false,
        error: 'Project not found'
      };
    }

    return {
      success: true,
      data: project
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return {
      success: false,
      error: 'Failed to fetch project'
    };
  }
}


export async function createProject(name: string) {
  try {
    const project = await prisma.project.create({
      data: {
        name,
        status: 'draft',
        changeLog: {
          create: {
            action: 'Project created',
            user: 'System'
          }
        }
      }
    });

    revalidatePath('/');
    
    return {
      success: true,
      data: project
    };
  } catch (error) {
    console.error('Error creating project:', error);
    return {
      success: false,
      error: 'Failed to create project'
    };
  }
}

export async function updateProjectStatus(projectId: string, status: 'draft' | 'approved') {
  try {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: { 
        status,
        changeLog: {
          create: {
            action: `Project status changed to ${status}`,
            user: 'System'
          }
        }
      }
    });

    revalidatePath('/');
    revalidatePath(`/brief/${projectId}`);
    
    return {
      success: true,
      data: project
    };
  } catch (error) {
    console.error('Error updating project status:', error);
    return {
      success: false,
      error: 'Failed to update project status'
    };
  }
}


export async function deleteProject(projectId: string) {
  try {
    await prisma.project.delete({
      where: { id: projectId }
    });

    revalidatePath('/');
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting project:', error);
    return {
      success: false,
      error: 'Failed to delete project'
    };
  }
}

export async function updateProjectName(projectId: string, name: string) {
  if (!name.trim()) {
    return {
      success: false,
      error: 'Project name cannot be empty'
    };
  }

  try {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: name.trim(),
        changeLog: {
          create: {
            action: 'Project renamed',
            metadata: { name },
            user: 'System'
          }
        }
      }
    });

    revalidatePath('/');
    revalidatePath(`/brief/${projectId}`);
    revalidatePath(`/intake/${projectId}`);

    return {
      success: true,
      data: project
    };
  } catch (error) {
    console.error('Error updating project name:', error);
    return {
      success: false,
      error: 'Failed to update project name'
    };
  }
}
