import React, { useState } from 'react';
import { 
  Users, Share2, Link as LinkIcon, Copy, Check, ShieldCheck, 
  Globe, Plus, Sparkles, X, UserPlus, Clock, ArrowRight, 
  ExternalLink, Trash2, Key, RefreshCw
} from 'lucide-react';
import { Project, AuthUser } from '../../types/builder';

interface ShareCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  currentUser: AuthUser | null;
  onSwitchWorkspace?: (newProject: Project) => void;
}

export const ShareCanvasModal: React.FC<ShareCanvasModalProps> = ({
  isOpen,
  onClose,
  project,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'share' | 'workspaces' | 'join'>('share');
  const [shareRole, setShareRole] = useState<'editor' | 'viewer'>('editor');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerRole, setPartnerRole] = useState<'editor' | 'viewer'>('editor');
  const [collaborators, setCollaborators] = useState<Array<{ id: string; name: string; email: string; role: string; status: 'online' | 'idle' }>>([
    {
      id: 'c1',
      name: currentUser?.name || 'Stephen Gershen (You)',
      email: currentUser?.email || 'stephen.gershen@gmail.com',
      role: 'Owner',
      status: 'online',
    },
    {
      id: 'c2',
      name: 'Sarah Lin',
      email: 'sarah.lin@partnerstudio.design',
      role: 'Partner Editor',
      status: 'online',
    },
    {
      id: 'c3',
      name: 'Alex Rivera',
      email: 'alex.rivera@leadmobile.io',
      role: 'Reviewer',
      status: 'idle',
    },
  ]);

  // Saved user canvases
  const [userCanvases, setUserCanvases] = useState<Array<{ id: string; name: string; screensCount: number; updatedAt: string; isCurrent: boolean }>>(() => {
    return [
      {
        id: 'canvas_personal_1',
        name: `${currentUser?.name ? currentUser.name.split(' ')[0] : 'Stephen'}'s Main Workspace`,
        screensCount: project.screens.length,
        updatedAt: 'Just now',
        isCurrent: true,
      },
      {
        id: 'canvas_partner_collab',
        name: 'Shared Partner Sprint Canvas',
        screensCount: 4,
        updatedAt: '2 hours ago',
        isCurrent: false,
      },
      {
        id: 'canvas_gaming_proto',
        name: 'Esports & Gaming Prototype',
        screensCount: 5,
        updatedAt: 'Yesterday',
        isCurrent: false,
      },
    ];
  });

  const [newCanvasName, setNewCanvasName] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinSuccessNotice, setJoinSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  // Generate shareable link
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://oneseventech.app';
  const shareCode = `17-${project.id.slice(-6).toUpperCase()}-${shareRole.toUpperCase()}`;
  const shareableUrl = `${origin}/?canvas=${encodeURIComponent(project.id)}&code=${shareCode}&access=${shareRole}#shared`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(shareCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleInvitePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerEmail.trim()) return;

    const newCollab = {
      id: `c_${Date.now()}`,
      name: partnerEmail.split('@')[0],
      email: partnerEmail.trim(),
      role: partnerRole === 'editor' ? 'Invited Editor' : 'Invited Viewer',
      status: 'online' as const,
    };
    setCollaborators(prev => [...prev, newCollab]);
    setPartnerEmail('');
  };

  const handleCreateNewCanvas = () => {
    if (!newCanvasName.trim()) return;
    const newId = `canvas_${Date.now()}`;
    const newEntry = {
      id: newId,
      name: newCanvasName.trim(),
      screensCount: 2,
      updatedAt: 'Just now',
      isCurrent: true,
    };
    setUserCanvases(prev => [newEntry, ...prev.map(c => ({ ...c, isCurrent: false }))]);
    setNewCanvasName('');
  };

  const handleJoinCanvas = () => {
    if (!joinCodeInput.trim()) return;
    setJoinSuccessNotice(`✓ Successfully joined shared canvas "${joinCodeInput.trim()}"!`);
    setTimeout(() => {
      setJoinSuccessNotice(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-fadeIn select-none">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl border border-violet-500/25 bg-[#0C0A18] shadow-2xl shadow-violet-950/70 overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-violet-500/15 px-6 py-4 bg-[#090714]/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6B39F4] to-[#8B5CF6] text-white shadow-lg shadow-violet-600/35">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Share Canvas & Partner Collaboration</h2>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                  Live Multi-User
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generate a shareable link for partners, manage individual canvases, or invite team access.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-violet-500/20 bg-[#16122C] text-slate-400 hover:bg-[#241C44] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-violet-500/15 bg-[#090714]/60 px-6 pt-2">
          <button
            onClick={() => setActiveTab('share')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'share'
                ? 'border-violet-500 text-violet-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LinkIcon className="h-3.5 w-3.5" />
            <span>Shareable Link & Access</span>
          </button>

          <button
            onClick={() => setActiveTab('workspaces')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'workspaces'
                ? 'border-violet-500 text-violet-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>My Canvases ({userCanvases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('join')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'join'
                ? 'border-violet-500 text-violet-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            <span>Join Partner Canvas</span>
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* TAB 1: SHARE LINK & ACCESS */}
          {activeTab === 'share' && (
            <div className="space-y-5">
              
              {/* Share link block */}
              <div className="rounded-2xl border border-violet-500/30 bg-[#16122C]/70 p-4 space-y-3 shadow-lg shadow-violet-950/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-violet-400" />
                    <span className="text-xs font-bold text-white">Instant Shareable Canvas Link</span>
                  </div>

                  <div className="flex items-center gap-1 bg-[#0E0B1C] rounded-xl p-0.5 border border-violet-500/20 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setShareRole('editor')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        shareRole === 'editor' ? 'bg-violet-600 text-white font-bold' : 'text-slate-400'
                      }`}
                    >
                      Can Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShareRole('viewer')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        shareRole === 'viewer' ? 'bg-violet-600 text-white font-bold' : 'text-slate-400'
                      }`}
                    >
                      Can View
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareableUrl}
                    className="flex-1 rounded-xl border border-violet-500/25 bg-[#0C0A18] px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none select-all truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] hover:from-[#5B2FE3] hover:to-[#7C3AED] px-4 py-2 text-xs font-bold text-white shadow-md shadow-violet-600/30 border border-violet-400/30 transition-all active:scale-95 shrink-0"
                  >
                    {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    Anyone with this link gets instant partner access to this canvas
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="text-violet-400 hover:underline font-mono text-[10px]"
                  >
                    {copiedCode ? 'Code Copied!' : `Share Code: ${shareCode}`}
                  </button>
                </div>
              </div>

              {/* Invite Partner by Email */}
              <div className="rounded-2xl border border-violet-500/20 bg-[#120F24]/60 p-4 space-y-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-violet-400" />
                  Direct Partner Access Grant
                </span>

                <form onSubmit={handleInvitePartner} className="flex gap-2">
                  <input
                    type="email"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    placeholder="partner@company.com"
                    className="flex-1 rounded-xl border border-violet-500/25 bg-[#0C0A18] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                  <select
                    value={partnerRole}
                    onChange={(e) => setPartnerRole(e.target.value as any)}
                    className="rounded-xl border border-violet-500/25 bg-[#0C0A18] px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button
                    type="submit"
                    className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] hover:from-[#5B2FE3] hover:to-[#7C3AED] px-4 py-2 text-xs font-bold text-white transition-all shadow-sm border border-violet-400/30 shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Grant</span>
                  </button>
                </form>
              </div>

              {/* Active collaborators list */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Active Canvas Collaborators ({collaborators.length})
                </span>

                <div className="divide-y divide-violet-500/15 rounded-2xl border border-violet-500/20 bg-[#100D22]/60 overflow-hidden">
                  {collaborators.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-[#1C1635] border border-violet-500/30 font-bold text-white text-xs">
                          {c.name.charAt(0)}
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#100D22] ${
                              c.status === 'online' ? 'bg-emerald-400' : 'bg-amber-400'
                            }`}
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{c.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{c.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-[#181335] px-2.5 py-0.5 text-[10px] font-semibold text-violet-300 border border-violet-500/25">
                          {c.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MY CANVASES */}
          {activeTab === 'workspaces' && (
            <div className="space-y-5">
              
              {/* Create new canvas input */}
              <div className="rounded-2xl border border-violet-500/20 bg-[#120F24]/60 p-4 space-y-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Plus className="h-4 w-4 text-violet-400" />
                  Create Separate Canvas Workspace
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCanvasName}
                    onChange={(e) => setNewCanvasName(e.target.value)}
                    placeholder="e.g. Stephen's Grocery Mobile App"
                    className="flex-1 rounded-xl border border-violet-500/25 bg-[#0C0A18] px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCreateNewCanvas}
                    className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] hover:from-[#5B2FE3] hover:to-[#7C3AED] px-4 py-2 text-xs font-bold text-white transition-all shadow-sm border border-violet-400/30 shrink-0"
                  >
                    <span>Create Canvas</span>
                  </button>
                </div>
              </div>

              {/* List of user's canvases */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Your Available Canvases
                </span>

                <div className="space-y-2">
                  {userCanvases.map((c) => (
                    <div
                      key={c.id}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                        c.isCurrent
                          ? 'border-violet-500/80 bg-[#1A1435] ring-1 ring-violet-500/50 shadow-md shadow-violet-950/40'
                          : 'border-violet-500/15 bg-[#100D22]/60 hover:border-violet-500/40'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{c.name}</span>
                          {c.isCurrent && (
                            <span className="rounded bg-violet-600/25 text-violet-300 border border-violet-500/35 px-1.5 py-0.2 text-[9px] font-bold">
                              Current Active
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {c.screensCount} Artboards · Modified {c.updatedAt}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!c.isCurrent && (
                          <button
                            type="button"
                            onClick={() => {
                              setUserCanvases(prev => prev.map(item => ({ ...item, isCurrent: item.id === c.id })));
                            }}
                            className="rounded-xl bg-[#16122C] hover:bg-violet-600 border border-violet-500/25 px-3 py-1.5 text-[11px] font-bold text-slate-200 hover:text-white transition-all"
                          >
                            Switch to Canvas
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: JOIN PARTNER CANVAS */}
          {activeTab === 'join' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-violet-500/30 bg-[#141028]/70 p-5 space-y-4 shadow-xl shadow-violet-950/40">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-violet-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Join Partner's Canvas via Code or Link</h3>
                    <p className="text-xs text-slate-400">
                      Paste a shareable link or code provided by your teammate or client.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value)}
                    placeholder="e.g. 17-8492-EDITOR or https://oneseventech.app/?canvas=..."
                    className="w-full rounded-xl border border-violet-500/25 bg-[#0C0A18] px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
                  />

                  {joinSuccessNotice && (
                    <div className="text-emerald-400 text-xs font-semibold py-1 animate-fadeIn">
                      {joinSuccessNotice}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleJoinCanvas}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6B39F4] to-[#8B5CF6] hover:from-[#5B2FE3] hover:to-[#7C3AED] py-2.5 text-xs font-bold text-white shadow-md shadow-violet-600/35 border border-violet-400/30 transition-all active:scale-95"
                  >
                    <span>Connect & Load Partner Canvas</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
