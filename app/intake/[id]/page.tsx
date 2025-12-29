// app/intake/[id]/page.tsx
import { getProject } from '@/app/actions/projects';
import { getIntake } from '@/app/actions/intake';
import IntakeClient from '@/components/IntakeClient';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface IntakePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function IntakePage({ params }: IntakePageProps) {
  const { id: projectId } = await params;

  const projectResult = await getProject(projectId);

  if (!projectResult.success || !projectResult.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Project Not Found</h2>
          <Link href="/" className="mt-4 inline-block text-yellow-600 hover:text-yellow-700 font-semibold">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const project = projectResult.data;

  if (project.brief) {
    redirect(`/brief/${projectId}`);
  }

  const intakeResult = await getIntake(projectId);
  const existingIntake = intakeResult.success ? intakeResult.data ?? null : null;

  return (
    <IntakeClient 
      project={project} 
      existingIntake={existingIntake}
    />
  );
}