// app/actions/comments.ts
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { logger, Timer } from '@/lib/debug';

export interface AddCommentInput {
  projectId: string;
  author: string;
  text: string;
  section: string;
}

export interface UpdateCommentInput {
  commentId: string;
  text: string;
}

export async function addComment(input: AddCommentInput) {
  const timer = new Timer('addComment');
  const { projectId, author, text, section } = input;

  try {
    if (!author.trim() || !text.trim() || !section.trim()) {
      return {
        success: false,
        error: 'Author, text, and section are required'
      };
    }

    if (text.length > 2000) {
      return {
        success: false,
        error: 'Comment text must be 2000 characters or less'
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

    logger.info('addComment', 'Creating comment', { projectId, section, author });

    const comment = await prisma.comment.create({
      data: {
        projectId,
        author,
        text,
        section
      }
    });

    await prisma.changeLog.create({
      data: {
        projectId,
        action: 'Comment added',
        user: author,
        metadata: {
          commentId: comment.id,
          section
        }
      }
    });

    timer.end();
    logger.info('addComment', 'Comment created successfully', { 
      commentId: comment.id, 
      projectId 
    });

    revalidatePath(`/brief/${projectId}`);

    return {
      success: true,
      data: comment
    };
  } catch (error) {
    timer.end('Failed');
    logger.error('addComment', 'Error creating comment', { projectId, error });
    console.error('Error creating comment:', error);

    return {
      success: false,
      error: 'Failed to create comment'
    };
  }
}

export async function getComments(projectId: string) {
  const timer = new Timer('getComments');

  try {
    const comments = await prisma.comment.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });

    timer.end();
    logger.info('getComments', 'Comments retrieved', { 
      projectId, 
      count: comments.length 
    });

    return {
      success: true,
      data: comments
    };
  } catch (error) {
    timer.end('Failed');
    logger.error('getComments', 'Error fetching comments', { projectId, error });
    console.error('Error fetching comments:', error);

    return {
      success: false,
      error: 'Failed to fetch comments'
    };
  }
}

export async function getCommentsBySection(projectId: string, section: string) {
  const timer = new Timer('getCommentsBySection');

  try {
    const comments = await prisma.comment.findMany({
      where: { 
        projectId,
        section 
      },
      orderBy: { createdAt: 'desc' }
    });

    timer.end();

    return {
      success: true,
      data: comments
    };
  } catch (error) {
    timer.end('Failed');
    logger.error('getCommentsBySection', 'Error fetching comments', { 
      projectId, 
      section, 
      error 
    });
    console.error('Error fetching comments by section:', error);

    return {
      success: false,
      error: 'Failed to fetch comments'
    };
  }
}

export async function updateComment(input: UpdateCommentInput) {
  const timer = new Timer('updateComment');
  const { commentId, text } = input;

  try {
    if (!text.trim()) {
      return {
        success: false,
        error: 'Comment text cannot be empty'
      };
    }

    if (text.length > 2000) {
      return {
        success: false,
        error: 'Comment text must be 2000 characters or less'
      };
    }

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { text }
    });

    await prisma.changeLog.create({
      data: {
        projectId: comment.projectId,
        action: 'Comment updated',
        user: comment.author,
        metadata: {
          commentId: comment.id
        }
      }
    });

    timer.end();
    logger.info('updateComment', 'Comment updated', { commentId });

    revalidatePath(`/brief/${comment.projectId}`);

    return {
      success: true,
      data: comment
    };
  } catch (error) {
    timer.end('Failed');
    logger.error('updateComment', 'Error updating comment', { commentId, error });
    console.error('Error updating comment:', error);

    return {
      success: false,
      error: 'Failed to update comment'
    };
  }
}

export async function deleteComment(commentId: string) {
  const timer = new Timer('deleteComment');

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      return {
        success: false,
        error: 'Comment not found'
      };
    }

    await prisma.comment.delete({
      where: { id: commentId }
    });

    await prisma.changeLog.create({
      data: {
        projectId: comment.projectId,
        action: 'Comment deleted',
        user: comment.author,
        metadata: {
          commentId,
          section: comment.section
        }
      }
    });

    timer.end();
    logger.info('deleteComment', 'Comment deleted', { commentId });

    revalidatePath(`/brief/${comment.projectId}`);

    return {
      success: true
    };
  } catch (error) {
    timer.end('Failed');
    logger.error('deleteComment', 'Error deleting comment', { commentId, error });
    console.error('Error deleting comment:', error);

    return {
      success: false,
      error: 'Failed to delete comment'
    };
  }
}

export async function getCommentCountsBySection(projectId: string) {
  const timer = new Timer('getCommentCountsBySection');

  try {
    const comments = await prisma.comment.findMany({
      where: { projectId },
      select: { section: true }
    });

    const counts: Record<string, number> = {};
    comments.forEach(comment => {
      counts[comment.section] = (counts[comment.section] || 0) + 1;
    });

    timer.end();

    return {
      success: true,
      data: counts
    };
  } catch (error) {
    timer.end('Failed');
    logger.error('getCommentCountsBySection', 'Error counting comments', { 
      projectId, 
      error 
    });
    console.error('Error counting comments:', error);

    return {
      success: false,
      error: 'Failed to count comments'
    };
  }
}