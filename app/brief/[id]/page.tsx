import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import BriefClient from '@/components/BriefClient';
import type { Project } from '@/types/brief.types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BriefPage({ params }: PageProps) {
  const { id } = await params;

  const projectData = await prisma.project.findUnique({
    where: { id },
    include: {
      brief: true,
      comments: {
        orderBy: { createdAt: 'desc' }
      },
      artifacts: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!projectData) {
    notFound();
  }

  if (!projectData.brief) {
    redirect(`/intake/${id}`);
  }

  const project: Project = {
    ...projectData,
    brief: {
      ...projectData.brief,
      sitemap: projectData.brief.sitemap as string[],
      constraints: projectData.brief.constraints as string[],
      assumptions: projectData.brief.assumptions as Array<{
        text: string;
        confidence: 'low' | 'medium' | 'high';
      }>,
      openQuestions: projectData.brief.openQuestions as string[]
    },
    artifacts: projectData.artifacts.map(artifact => ({
      ...artifact,
      content: artifact.content as Record<string, unknown>
    })),
    comments: projectData.comments
  };

  return <BriefClient project={project} />;
}