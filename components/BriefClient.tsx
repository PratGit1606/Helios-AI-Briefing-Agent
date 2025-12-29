// components/brief/BriefClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateArtifacts, getArtifacts } from '@/app/actions/artifacts';
import { approveBrief } from '@/app/actions/briefs';
import type { Project, TabType } from '@/types/brief.types';

import BriefHeader from './brief/BriefHeader';
import BriefTabs from './brief/BriefTabs';
import BriefSidebar from './brief/BriefSidebar';
import ApprovalModal from './brief/ApprovalModal';

import BriefTab from './brief/tabs/BriefTabs';
import ContentTab from './brief/tabs/ContentTab';
import DesignTab from './brief/tabs/DesignTab';
import SEOTab from './brief/tabs/SEOTab';
import AssumptionsTab from './brief/tabs/AssumptionsTab';
import HistoryTab from './brief/tabs/HistoryTab';
import ExportPanel from './brief/ExportPanel';

import { getChangeRequests } from '@/app/actions/changeRequests';



interface BriefClientProps {
  project: Project;
}

export default function BriefClient({ project }: BriefClientProps) {
  const router = useRouter();
  const [isApproving, setIsApproving] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('brief');
  const [isGeneratingArtifacts, setIsGeneratingArtifacts] = useState(false);
  const [artifacts, setArtifacts] = useState(project.artifacts || []);
  const [artifactError, setArtifactError] = useState<string | null>(null);
  const [changeRequests, setChangeRequests] = useState<any[]>([]);


  const brief = project.brief;

  useEffect(() => {
    const handleGenerateArtifacts = async () => {
      setIsGeneratingArtifacts(true);
      setArtifactError(null);

      try {
        const result = await generateArtifacts({ projectId: project.id });

        if (!result.success) {
          throw new Error(result.error || 'Failed to generate artifacts');
        }

        const artifactsResult = await getArtifacts(project.id);
        if (artifactsResult.success && artifactsResult.data) {
          setArtifacts(artifactsResult.data);
        }
      } catch (error) {
        console.error('Error generating artifacts:', error);
        setArtifactError(error instanceof Error ? error.message : 'Failed to generate artifacts');
      } finally {
        setIsGeneratingArtifacts(false);
      }
    };

    if (brief.isApproved && artifacts.length === 0 && !isGeneratingArtifacts) {
      handleGenerateArtifacts();
    }
  }, [brief.isApproved, artifacts.length, isGeneratingArtifacts, project.id]);

  useEffect(() => {
    const fetchChangeRequests = async () => {
      const result = await getChangeRequests(project.id);
      if (result.success && result.data) {
        setChangeRequests(result.data);
      }
    };

    fetchChangeRequests();
  }, [project.id]);

  const handleApproveBrief = async () => {
    setIsApproving(true);

    try {
      const result = await approveBrief(project.id);

      if (!result.success) {
        throw new Error(result.error || 'Failed to approve brief');
      }

      router.refresh();
    } catch (error) {
      console.error('Error approving brief:', error);
      alert(error instanceof Error ? error.message : 'Failed to approve brief');
    } finally {
      setIsApproving(false);
      setShowApproveModal(false);
    }
  };

  const getArtifactByType = (type: string) => {
    return artifacts.find(a => a.type === type);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BriefHeader
        brief={brief}
        onNavigateHome={() => router.push('/')}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-black mb-1">{project.name}</h2>
          <p className="text-sm text-gray-600">Generated brief based on stakeholder input</p>
        </div>

        <BriefTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isApproved={brief.isApproved}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {activeTab === 'brief' && (
              <BriefTab
                brief={brief}
                projectId={project.id}
                onApprove={() => setShowApproveModal(true)}
                isApproving={isApproving}
                changeRequests={changeRequests}
              />
            )}

            {activeTab === 'content' && (
              <ContentTab
                artifact={getArtifactByType('content')}
                isGenerating={isGeneratingArtifacts}
                error={artifactError}
                briefSitemap={brief.sitemap}
              />
            )}

            {activeTab === 'design' && (
              <DesignTab
                artifact={getArtifactByType('design')}
                isGenerating={isGeneratingArtifacts}
                error={artifactError}
              />
            )}

            {activeTab === 'seo' && (
              <SEOTab
                artifact={getArtifactByType('seo')}
                isGenerating={isGeneratingArtifacts}
                error={artifactError}
              />
            )}

            {activeTab === 'assumptions' && (
              <AssumptionsTab
                artifact={getArtifactByType('assumptions')}
                isGenerating={isGeneratingArtifacts}
                error={artifactError}
              />
            )}

            {activeTab === 'history' && (
              <HistoryTab
                artifact={getArtifactByType('history')}
                isGenerating={isGeneratingArtifacts}
                error={artifactError}
              />
            )}
          </div>

          <BriefSidebar
            comments={project.comments}
            activeTab={activeTab}
            isApproved={brief.isApproved}
            projectId={project.id}
          />
        </div>
        <div className="mt-8">
          <ExportPanel
            projectId={project.id}
            projectName={project.name}
          />
        </div>
      </main>

      {showApproveModal && (
        <ApprovalModal
          isApproving={isApproving}
          onConfirm={handleApproveBrief}
          onCancel={() => setShowApproveModal(false)}
        />
      )}
    </div>
  );
}