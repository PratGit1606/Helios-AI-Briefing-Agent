import React from 'react';
import { FileText, ClipboardList, Palette, Search, AlertCircle, History, Lock } from 'lucide-react';
import type { TabType } from '@/types/brief.types';

interface BriefTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isApproved: boolean;
}

export default function BriefTabs({ activeTab, onTabChange, isApproved }: BriefTabsProps) {
  const tabs = [
    { id: 'brief' as TabType, label: 'Brief', icon: FileText, disabled: false },
    { id: 'content' as TabType, label: 'Content Planning', icon: ClipboardList, disabled: !isApproved },
    { id: 'design' as TabType, label: 'Design Inspiration', icon: Palette, disabled: !isApproved },
    { id: 'seo' as TabType, label: 'SEO Research', icon: Search, disabled: !isApproved },
    { id: 'assumptions' as TabType, label: 'Assumptions Log', icon: AlertCircle, disabled: !isApproved },
    { id: 'history' as TabType, label: 'Change History', icon: History, disabled: !isApproved },
  ];

  return (
    <div className="mb-6 border-b-2 border-gray-200">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              disabled={tab.disabled}
              className={`flex items-center gap-2 px-4 py-3 font-bold text-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'border-b-4 border-yellow-400 text-black'
                  : tab.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-black hover:border-b-4 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.disabled && <Lock className="w-3 h-3" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
