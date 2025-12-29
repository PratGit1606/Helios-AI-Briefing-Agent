import { getProjects } from './actions/projects';
import LandingClient from '@/components/LandingClient';

export default async function LandingPage() {
  const result = await getProjects();

  if (!result.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Projects</h2>
          <p className="text-gray-600">{result.error}</p>
        </div>
      </div>
    );
  }

  return <LandingClient projects={result.data ?? []} />;
}