'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Pencil, Trash2, X } from 'lucide-react';
import { createProject, deleteProject, updateProjectName } from '@/app/actions/projects';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'Good morning. Let’s build something meaningful.';
  if (hour >= 11 && hour < 17) return 'Good afternoon. This feels like a good idea already.';
  if (hour >= 17 && hour < 22) return 'Good evening. Let’s get a clean brief started.';
  return 'It’s late. Probably the best time to start.';
}

interface Project {
  id: string;
  name: string;
  status: string;
  createdAt: Date;
}

interface LandingClientProps {
  projects: Project[];
}

export default function LandingClient({ projects }: LandingClientProps) {
  const router = useRouter();
  const [projectName, setProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCreate = async () => {
    if (!projectName.trim()) return;
    setIsCreating(true);
    const result = await createProject(projectName.trim());
    setIsCreating(false);
    if (result.success && result.data) {
      router.push(`/intake/${result.data.id}`);
    }
  };

  const handleRename = async () => {
    if (!activeProject) return;
    await updateProjectName(activeProject.id, renameValue);
    setShowRenameModal(false);
  };

  const handleDelete = async () => {
    if (!activeProject) return;
    await deleteProject(activeProject.id);
    setShowDeleteModal(false);
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="min-h-screen bg-[#1F1F1D] text-neutral-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FFC627]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#FFC627]/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute top-6 left-6 flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-[#FFC627]">
            Helios
          </span>
          <span className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
            AI Web Briefing Agent
          </span>
        </div>
        <div className="pl-0.5 border-l-4 border-[#FFC627]">
          <p className="ml-3 text-xs text-neutral-400 max-w-xs">
            Governed planning tool for website creation
          </p>
        </div>
      </div>

      <main className="flex flex-col items-center justify-center pt-44 px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">
          {getGreeting()}
        </h2>

        <p className="text-neutral-400 text-lg mb-10">
          Name your website brief to begin.
        </p>

        <div className="w-full max-w-3xl bg-neutral-900/80 backdrop-blur rounded-2xl border border-neutral-700 flex items-center px-5 py-4 shadow-2xl">
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Give this project a name"
            className="flex-1 bg-transparent outline-none text-neutral-100 placeholder-neutral-500"
            autoFocus
          />
        </div>

        <p className="mt-4 text-sm text-neutral-500">
          Press Enter to continue. You can rename this later.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
          {[
            'WIL Accelerator',
            'Work+Life Certificate Design',
            'ASN Tutoring Website Rebrand',
          ].map((example) => (
            <button
              key={example}
              onClick={() => setProjectName(example)}
              className="px-4 py-2 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 hover:border-[#FFC627] hover:text-[#FFC627] transition"
            >
              {example}
            </button>
          ))}
        </div>
      </main>

      <section className="max-w-5xl mx-auto mt-32 px-6 pb-32 relative z-10">
        <h2 className="text-xs uppercase tracking-wide text-neutral-400 mb-4">
          Recent work
        </h2>

        <div className="bg-neutral-900/70 backdrop-blur rounded-2xl border border-neutral-800">
          {projects.length === 0 ? (
            <div className="px-6 py-20 text-center text-neutral-400">
              No briefs yet.
            </div>
          ) : (
            <div className="divide-y divide-neutral-800">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => router.push(`/brief/${project.id}`)}
                  className="px-6 py-5 flex items-center justify-between hover:bg-neutral-800/60 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-neutral-400" />
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-xs text-neutral-400">
                        {formatDate(project.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        project.status === 'approved'
                          ? 'bg-green-900/40 text-green-300'
                          : 'bg-yellow-900/40 text-yellow-300'
                      }`}
                    >
                      {project.status}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveProject(project);
                        setRenameValue(project.name);
                        setShowRenameModal(true);
                      }}
                      className="p-2 rounded hover:bg-neutral-700"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveProject(project);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 rounded hover:bg-neutral-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showRenameModal && activeProject && (
        <Modal title="Rename Project" onClose={() => setShowRenameModal(false)}>
          <input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            className="w-full border border-neutral-600 bg-neutral-900 text-neutral-100 rounded-lg px-4 py-2 mb-4"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              onClick={() => setShowRenameModal(false)}
              className="flex-1 border border-neutral-500 rounded-lg px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleRename}
              className="flex-1 bg-[#FFC627] text-black rounded-lg px-4 py-2 font-bold"
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {showDeleteModal && activeProject && (
        <Modal title="Delete Project" onClose={() => setShowDeleteModal(false)}>
          <p className="text-sm text-neutral-300 mb-6">
            Are you sure you want to delete <strong>{activeProject.name}</strong>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 border border-neutral-500 rounded-lg px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 rounded-lg px-4 py-2 font-bold"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}
