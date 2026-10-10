'use client';

import { validateProgress } from '@/lib/progress';
import { saveProgress, triggerCelebrationConfetti } from '@/lib/storage';
import { useProgress } from '@/lib/useProgress';
import { UserProgressState } from '@/types';
import {
  AlertTriangle,
  Check,
  Copy,
  Database,
  Download,
  FileJson,
  RotateCcw,
  Sparkles,
  Upload,
  X
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Modal } from './Modal';

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
  const currentProgress = useProgress();

  if (!isOpen) return null;

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

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(currentJsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setImportStatus({ success: false, message: 'Could not copy. Download the JSON file instead.' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportText(content);
    };
    reader.onerror = () => setImportStatus({ success: false, message: 'Could not read the selected file.' });
    reader.readAsText(file);
    e.target.value = '';
  };

  const executeImport = (rawContent: string) => {
    try {
      const parsed = JSON.parse(rawContent);
      const validatedState = validateProgress(parsed, true);
      if (!saveProgress(validatedState)) throw new Error('Browser storage is unavailable or full. Your progress was not restored.');
      triggerCelebrationConfetti();
      setImportStatus({
        success: true,
        message: `Successfully restored ${Object.values(validatedState.completedTopics).filter(Boolean).length} completed topics and ${Object.keys(validatedState.notes).length} notes!`,
      });
    } catch (err: unknown) {
      setImportStatus({
        success: false,
        message: `Failed to import JSON: ${err instanceof Error ? err.message : 'Malformed backup file'}`,
      });
    }
  };

  const handleResetAll = () => {
    const emptyState: UserProgressState = {
      completedTopics: {},
      bookmarkedTopics: {},
      notes: {},
      quizScores: {},
      theme: currentProgress.theme,
      hasCelebrated100: false,
    };
    if (!saveProgress(emptyState)) {
      setImportStatus({ success: false, message: 'Could not reset progress. Browser storage is unavailable.' });
      return;
    }
    setConfirmReset(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} label="Backup and restore progress" className="flex items-center justify-center">
      <div className="relative w-full max-w-xl max-h-[90dvh] overflow-y-auto rounded-2xl bg-surface border border-line shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-inset">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-cyan-ink" />
            <h3 className="font-bold text-ink text-base">Backup, Sync & Data Migration</h3>
          </div>
          <button
            aria-label="Close backup and restore"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-subtle transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-line bg-inset px-6 pt-3 gap-2">
          <button
            onClick={() => {
              setActiveTab('export');
              setImportStatus(null);
            }}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-cyan-line text-cyan-ink'
                : 'border-transparent text-muted hover:text-ink'
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
                ? 'border-emerald-line text-emerald-ink'
                : 'border-transparent text-muted hover:text-ink'
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
                ? 'border-rose-line text-rose-ink'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Data
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {importStatus && (
            <div role="status"
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                importStatus.success
                  ? 'bg-emerald-tint border border-emerald-line text-emerald-ink'
                  : 'bg-rose-tint border border-rose-line text-rose-ink'
              }`}
            >
              {importStatus.success ? (
                <Sparkles className="w-4 h-4 text-emerald-ink shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-ink shrink-0" />
              )}
              <span>{importStatus.message}</span>
            </div>
          )}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <p className="text-xs text-muted leading-relaxed">
                Download a portable JSON snapshot containing your completed topics, bookmarks, quiz scores, and personal study notes. No cloud login required — your data stays 100% private.
              </p>

              <div className="bg-inset rounded-xl p-3 border border-line font-mono text-xs text-muted max-h-36 overflow-y-auto">
                <pre>{currentJsonString}</pre>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleExportDownload}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download JSON File
                </button>
                <button
                  onClick={handleCopyJson}
                  className="py-2.5 px-4 rounded-xl bg-subtle hover:bg-selected text-body font-semibold text-xs transition flex items-center justify-center gap-2 border border-line"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-ink" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <p className="text-xs text-muted leading-relaxed">
                Restore previously exported progress from another browser or device. Upload a JSON file or paste backup contents below:
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button type="button"
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-line hover:border-emerald-line bg-inset rounded-xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2"
              >
                <FileJson className="w-8 h-8 text-emerald-ink" />
                <span className="text-xs font-semibold text-body">
                  Click to select backup .json file
                </span>
                <span className="text-xs text-muted">Supports all platform roadmap exports</span>
              </button>

              <div>
                <label htmlFor="backup-json" className="text-xs font-semibold text-muted mb-1.5 block">
                  Or paste JSON directly:
                </label>
                <textarea
                  id="backup-json"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste JSON backup text here..."
                  rows={4}
                  className="w-full bg-inset border border-line rounded-xl p-3 text-ink font-mono text-xs focus-visible:outline-2 focus-visible:outline-focus focus:ring-2 focus:ring-emerald-500 placeholder:text-muted"
                />
              </div>

              <button
                onClick={() => executeImport(importText)}
                disabled={!importText.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Upload className="w-4 h-4" />
                Restore Progress
              </button>
              <p className="text-xs text-muted">Restoring replaces your current topics, notes, scores, and flashcard reviews. Export a backup first to keep them.</p>
            </div>
          )}

          {activeTab === 'reset' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-tint border border-rose-line text-rose-ink text-xs leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-rose-ink">
                  <AlertTriangle className="w-4 h-4" />
                  Irreversible Local Data Reset
                </div>
                <p>
                  This will clear all completed topics, quiz scores, bookmarks, personal notes, and flashcard reviews stored in your browser. Make sure you have exported a JSON backup first if you want to keep your progress.
                </p>
              </div>

              {!confirmReset ? (
                <button
                  onClick={() => setConfirmReset(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-tint border border-rose-line hover:bg-rose-tint text-rose-ink font-semibold text-xs transition"
                >
                  I understand, proceed to clear data
                </button>
              ) : (
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleResetAll}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition shadow-sm"
                  >
                    Confirm & Wipe All Progress
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="w-full py-2 px-4 rounded-xl bg-subtle text-body font-semibold text-xs hover:bg-selected transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
