// components/IntakeClient.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Lightbulb } from 'lucide-react';
import { saveIntake } from '@/app/actions/intake';
import { generateBriefFromIntake } from '@/app/actions/briefs';

interface Project {
    id: string;
    name: string;
    status: string;
    createdAt: Date;
}

interface Intake {
    id: string;
    projectId: string;
    stakeholderDocuments: string;
    boilerplateLanguage: string;
}

interface IntakeClientProps {
    project: Project;
    existingIntake: Intake | null;
}

export default function IntakeClient({ project, existingIntake }: IntakeClientProps) {
    const router = useRouter();
    const [stakeholderDocs, setStakeholderDocs] = useState(
        existingIntake?.stakeholderDocuments || ''
    );
    const [boilerplate, setBoilerplate] = useState(
        existingIntake?.boilerplateLanguage || ''
    );
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateBrief = async () => {
        if (!stakeholderDocs.trim() || !boilerplate.trim()) {
            setError('Both stakeholder documents and boilerplate language are required.');
            return;
        }

        setError(null);
        setIsGenerating(true);

        try {
            const saveResult = await saveIntake({
                projectId: project.id,
                stakeholderDocuments: stakeholderDocs,
                boilerplateLanguage: boilerplate
            });

            if (!saveResult.success) {
                throw new Error(saveResult.error || 'Failed to save intake data');
            }

            // 2. Generate brief using AI
            const generateResult = await generateBriefFromIntake({
                projectId: project.id
            });

            if (!generateResult.success) {
                throw new Error(generateResult.error || 'Failed to generate brief');
            }

            // 3. Navigate to brief page
            router.push(`/brief/${project.id}`);

        } catch (err) {
            console.error('Error generating brief:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-black border-b-4 border-yellow-400 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-yellow-400">Helios</h1>
                        <p className="text-sm text-gray-300">Stakeholder Intake</p>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm font-semibold transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Projects
                    </button>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="ml-4 bg-black text-[#FFC627] px-6 py-3 rounded-lg font-bold
             hover:bg-[#FFC627] hover:text-black transition shadow-lg"
                    >
                        Access Dashboard
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-black mb-2">
                            Project: {project.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                            Provide stakeholder input to generate your website brief using AI.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                            <p className="text-sm font-semibold text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* Stakeholder Documents */}
                        <div>
                            <label className="block text-sm font-bold text-black mb-2">
                                Stakeholder Documents (Content Intent)
                                <span className="text-red-600 ml-1">*</span>
                            </label>
                            <p className="text-sm text-gray-600 mb-3">
                                Enter stakeholder documents, requirements, or notes that describe what content should be created.
                                Include target audiences, key goals, and any specific features or pages needed.
                            </p>
                            <textarea
                                value={stakeholderDocs}
                                onChange={(e) => setStakeholderDocs(e.target.value)}
                                disabled={isGenerating}
                                className="text-black w-full h-48 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 disabled:bg-gray-100 disabled:cursor-not-allowed font-mono text-sm"
                                placeholder="Example: We need a website that showcases ASU's innovative programs and research. The site should highlight our commitment to accessibility and inclusion, make it easy for prospective students to find information about programs, and provide clear pathways for different audiences (students, faculty, alumni)..."
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                {stakeholderDocs.length} characters
                            </p>
                        </div>

                        {/* Boilerplate Language */}
                        <div className="border-t-2 border-gray-200 pt-8">
                            <label className="block text-sm font-bold text-black mb-2">
                                Boilerplate Language (Tone Anchor)
                                <span className="text-red-600 ml-1">*</span>
                            </label>
                            <p className="text-sm text-gray-600 mb-3">
                                Enter existing brand language, style guides, or tone examples to anchor the voice.
                                This helps the AI understand your organization&apos;s communication style.
                            </p>
                            <textarea
                                value={boilerplate}
                                onChange={(e) => setBoilerplate(e.target.value)}
                                disabled={isGenerating}
                                className="text-black w-full h-48 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 disabled:bg-gray-100 disabled:cursor-not-allowed font-mono text-sm"
                                placeholder="Example: We are Arizona State University - a place where innovation meets impact. Our voice is bold yet approachable, confident yet inclusive. We believe in breaking barriers, championing access, and designing the future. We communicate with clarity over jargon, action over promises..."
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                {boilerplate.length} characters
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleGenerateBrief}
                            disabled={isGenerating || !stakeholderDocs.trim() || !boilerplate.trim()}
                            className="flex items-center gap-3 bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-500 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-400"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating Brief...
                                </>
                            ) : (
                                'Generate Draft Brief'
                            )}
                        </button>
                    </div>

                    {isGenerating && (
                        <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-900">
                                <span className="font-bold">AI is working...</span> This may take 10-30 seconds.
                                We&apos;re analyzing your input and generating a comprehensive website brief.
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-8 bg-white rounded-lg border-2 border-gray-200 shadow-lg p-6">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-black mb-4">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        Tips for Better Results
                    </h3>          <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-400 font-bold">•</span>
                            <span><strong>Be specific</strong> about target audiences and their needs</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-400 font-bold">•</span>
                            <span><strong>Include constraints</strong> like accessibility requirements or technical limitations</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-400 font-bold">•</span>
                            <span><strong>Mention key pages</strong> or features you know you need</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-400 font-bold">•</span>
                            <span><strong>Use tone examples</strong> from existing marketing materials or brand guidelines</span>
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    );
}