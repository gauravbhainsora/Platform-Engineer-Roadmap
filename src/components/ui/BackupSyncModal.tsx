'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Upload,
  Copy,
  Check,
  AlertTriangle,
  RotateCcw,
  Database,
  FileJson,
  Sparkles
} from 'lucide-react';
import { getStoredProgress, saveProgress, triggerCelebrationConfetti } from '@/lib/storage';
import { UserProgressState } from '@/types';

interface BackupSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BackupSyncModal({ isOpen, onClose }: BackupSyncModalProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import' | 'reset'>('export');
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentProgress = getStoredProgress();
  const currentJsonString = JSON.stringify(currentProgress, null, 2);

  const handleExportDownload = () => {
    const blob = new Blob([currentJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `platform-engineer-roadmap-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(currentJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportText(content);
      executeImport(content);
    };
    reader.readAsText(file);
  };

  const executeImport = (rawContent: string) => {
    try {
      const parsed = JSON.parse(rawContent);
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Invalid JSON root object');
      }

      const validatedState: UserProgressState = {
        completedTopics: parsed.completedTopics || {},
        bookmarkedTopics: parsed.bookmarkedTopics || {},
        notes: parsed.notes || {},
        quizScores: parsed.quizScores || {},
        theme: parsed.theme || 'dark',
        hasCelebrated100: !!parsed.hasCelebrated100,
      };

      saveProgress(validatedState);
      triggerCelebrationConfetti();
      setImportStatus({
        success: true,
        message: `Successfully restored ${Object.keys(validatedState.completedTopics).length} completed topics and ${Object.keys(validatedState.notes).length} notes!`,
      });
    } catch (err: any) {
      setImportStatus({
        success: false,
        message: `Failed to import JSON: ${err.message || 'Malformed backup file'}`,
      });
    }
  };

  const handleResetAll = () => {
    const emptyState: UserProgressState = {
      completedTopics: {},
      bookmarkedTopics: {},
      notes: {},
      quizScores: {},
      theme: 'dark',
      hasCelebrated100: false,
    };
    saveProgress(emptyState);
    setConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Backup, Sync & Data Migration</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 pt-3 gap-2">
          <button
            onClick={() => {
              setActiveTab('export');
              setImportStatus(null);
            }}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Export Backup
          </button>
          <button
            onClick={() => {
              setActiveTab('import');
              setImportStatus(null);
            }}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Import & Restore
          </button>
          <button
            onClick={() => {
              setActiveTab('reset');
              setImportStatus(null);
            }}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'reset'
                ? 'border-rose-400 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Data
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {activeTab === 'export' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Download a portable JSON snapshot containing your completed topics, bookmarks, quiz scores, and personal study notes. No cloud login required — your data stays 100% private.
              </p>

              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80 font-mono text-[11px] text-slate-400 max-h-36 overflow-y-auto">
                <pre>{currentJsonString}</pre>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleExportDownload}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
                >
                  <Download className="w-4 h-4" />
                  Download JSON File
                </button>
                <button
                  onClick={handleCopyJson}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-2 border border-slate-700"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Restore previously exported progress from another browser or device. Upload a JSON file or paste backup contents below:
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-950/40 rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2"
              >
                <FileJson className="w-8 h-8 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-300">
                  Click to select backup .json file
                </span>
                <span className="text-[10px] text-slate-500">Supports all platform roadmap exports</span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 mb-1.5 block">
                  Or paste JSON directly:
                </label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste JSON backup text here..."
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-600"
                />
              </div>

              {importStatus && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    importStatus.success
                      ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {importStatus.success ? (
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{importStatus.message}</span>
                </div>
              )}

              <button
                onClick={() => executeImport(importText)}
                disabled={!importText.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Upload className="w-4 h-4" />
                Restore Progress
              </button>
            </div>
          )}

          {activeTab === 'reset' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300 text-xs leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  Irreversible Local Data Reset
                </div>
                <p>
                  This will clear all completed topics, quiz scores, bookmarked items, and personal notes stored in your browser. Make sure you have exported a JSON backup first if you want to keep your progress.
                </p>
              </div>

              {!confirmReset ? (
                <button
                  onClick={() => setConfirmReset(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-950 border border-rose-500/40 hover:bg-rose-900/50 text-rose-200 font-semibold text-xs transition"
                >
                  I understand, proceed to clear data
                </button>
              ) : (
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleResetAll}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-lg shadow-rose-600/20"
                  >
                    Confirm & Wipe All Progress
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="w-full py-2 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
