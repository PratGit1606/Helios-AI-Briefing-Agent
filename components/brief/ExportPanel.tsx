'use client';

import React, { useState } from 'react';
import { Download, FileText, FileJson, Loader2, CheckCircle } from 'lucide-react';
import { getExportData, logExport } from '@/app/actions/exports';
import { exportToMarkdown } from '@/lib/exporters/markdownExporter';
import { exportToPDF } from '@/lib/exporters/pdfExporter';
import { exportToJSON } from '@/lib/exporters/jsonExporter';
import { saveAs } from 'file-saver';

interface ExportPanelProps {
  projectId: string;
  projectName: string;
}

type ExportFormat = 'markdown' | 'pdf' | 'json';

export default function ExportPanel({ projectId, projectName }: ExportPanelProps) {
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [lastExported, setLastExported] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setExporting(format);
    setLastExported(null);

    try {
      const result = await getExportData(projectId);

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch export data');
      }

      const data = result.data;
      const timestamp = new Date().toISOString().split('T')[0];
      const sanitizedName = projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

      switch (format) {
        case 'markdown': {
          const markdown = exportToMarkdown(data);
          const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
          saveAs(blob, `${sanitizedName}_brief_${timestamp}.md`);
          break;
        }

        case 'pdf': {
          const doc = exportToPDF(data);
          doc.save(`${sanitizedName}_brief_${timestamp}.pdf`);
          break;
        }

        case 'json': {
          const json = exportToJSON(data);
          const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
          saveAs(blob, `${sanitizedName}_brief_${timestamp}.json`);
          break;
        }
      }

      await logExport(projectId, format);

      setLastExported(format);
      setTimeout(() => setLastExported(null), 3000);

    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
      alert(`Failed to export as ${format}. Please try again.`);
    } finally {
      setExporting(null);
    }
  };

  const exports = [
    {
      format: 'markdown' as ExportFormat,
      icon: FileText,
      title: 'Export for Copy',
      description: 'Markdown format - Easy to paste into docs, wikis, or Notion',
      color: 'blue'
    },
    {
      format: 'pdf' as ExportFormat,
      icon: FileText,
      title: 'Export for Design',
      description: 'PDF format - Formatted brief with ASU branding for stakeholders',
      color: 'red'
    },
    {
      format: 'json' as ExportFormat,
      icon: FileJson,
      title: 'Export for Development',
      description: 'JSON format - Structured data for developers and CMS integration',
      color: 'green'
    }
  ];

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-6 h-6 text-yellow-400" />
        <div>
          <h3 className="font-bold text-black text-lg">Export Options</h3>
          <p className="text-sm text-gray-600">Download brief in various formats</p>
        </div>
      </div>

      <div className="space-y-4">
        {exports.map((exp) => {
          const Icon = exp.icon;
          const isExporting = exporting === exp.format;
          const isSuccess = lastExported === exp.format;

          return (
            <button
              key={exp.format}
              onClick={() => handleExport(exp.format)}
              disabled={!!exporting}
              className={`w-full text-left p-4 rounded-lg border-2 transition group ${
                isSuccess
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 hover:border-yellow-400 hover:bg-yellow-50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isSuccess
                    ? 'bg-green-100'
                    : exp.color === 'blue'
                    ? 'bg-blue-100 group-hover:bg-blue-200'
                    : exp.color === 'red'
                    ? 'bg-red-100 group-hover:bg-red-200'
                    : 'bg-green-100 group-hover:bg-green-200'
                }`}>
                  {isExporting ? (
                    <Loader2 className="w-6 h-6 text-gray-700 animate-spin" />
                  ) : isSuccess ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Icon className={`w-6 h-6 ${
                      exp.color === 'blue'
                        ? 'text-blue-600'
                        : exp.color === 'red'
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`} />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-black mb-1">{exp.title}</h4>
                  <p className="text-sm text-gray-600">{exp.description}</p>
                  
                  {isExporting && (
                    <p className="text-xs text-gray-500 mt-2">Generating {exp.format}...</p>
                  )}
                  
                  {isSuccess && (
                    <p className="text-xs text-green-600 font-semibold mt-2">
                      ✓ Downloaded successfully!
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <Download className={`w-5 h-5 transition ${
                    isSuccess ? 'text-green-600' : 'text-gray-400 group-hover:text-yellow-400'
                  }`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <h4 className="text-sm font-bold text-black mb-2">💡 Export Tips</h4>
        <ul className="text-xs text-gray-700 space-y-1">
          <li>• <strong>Markdown</strong> is best for documentation and collaborative editing</li>
          <li>• <strong>PDF</strong> is ideal for presentations and stakeholder reviews</li>
          <li>• <strong>JSON</strong> is perfect for technical handoffs and CMS imports</li>
        </ul>
      </div>
    </div>
  );
}