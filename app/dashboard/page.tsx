import { prisma } from '@/lib/db';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const counts = {
    Artifact: await prisma.artifact.count(),
    Brief: await prisma.brief.count(),
    ChangeLog: await prisma.changeLog.count(),
    Comment: await prisma.comment.count(),
    Intake: await prisma.intake.count(),
    Project: await prisma.project.count(),
    ChangeRequest: await prisma.changeRequest.count()
  };

  return <DashboardClient counts={counts} />;
}
