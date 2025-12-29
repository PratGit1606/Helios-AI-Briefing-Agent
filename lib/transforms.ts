import type { Project, Brief, Artifact } from '@/types/brief.types';
import type { Prisma } from '@prisma/client';

type PrismaProject = Prisma.ProjectGetPayload<{
  include: {
    brief: true;
    comments: true;
    artifacts: true;
  };
}>;

type PrismaBrief = Prisma.BriefGetPayload<Record<string, never>>;
type PrismaArtifact = Prisma.ArtifactGetPayload<Record<string, never>>;


export function transformBrief(prismaBrief: PrismaBrief): Brief {
  return {
    ...prismaBrief,
    sitemap: prismaBrief.sitemap as string[],
    constraints: prismaBrief.constraints as string[],
    assumptions: prismaBrief.assumptions as Array<{
      text: string;
      confidence: 'low' | 'medium' | 'high';
    }>,
    openQuestions: prismaBrief.openQuestions as string[]
  };
}


export function transformArtifact(prismaArtifact: PrismaArtifact): Artifact {
  return {
    ...prismaArtifact,
    content: prismaArtifact.content as Record<string, unknown>
  };
}


export function transformProject(prismaProject: PrismaProject): Project {
  if (!prismaProject.brief) {
    throw new Error('Project must have a brief');
  }

  return {
    ...prismaProject,
    brief: transformBrief(prismaProject.brief),
    artifacts: prismaProject.artifacts.map(transformArtifact),
    comments: prismaProject.comments
  };
}