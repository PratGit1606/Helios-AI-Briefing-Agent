import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import BriefClient from '@/components/BriefClient';
import type { Project } from '@/types/brief.types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BriefPage({ params }: PageProps) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
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

  if (!project) {
    notFound();
  }

  if (!project.brief) {
    redirect(`/intake/${id}`);
  }

  return <BriefClient project={project as Project} />;
}