'use client';

import { useState } from 'react';
import ModelNavbar from './ModelSidebar';
import ModelTable from './ModelTable';

const MODELS = [
  'Artifact',
  'Brief',
  'ChangeLog',
  'Comment',
  'Intake',
  'Project',
  'ChangeRequest',
] as const;

type ModelName = typeof MODELS[number];

export default function DashboardClient({
  counts,
}: {
  counts: Record<string, number>;
}) {
  const [activeModel, setActiveModel] = useState<ModelName>('Project');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ModelNavbar
        models={MODELS}
        counts={counts}
        active={activeModel}
        onSelect={model => setActiveModel(model as ModelName)}
      />

      <main className="flex-1 p-8">
        <ModelTable model={activeModel} />
      </main>
    </div>
  );
}
