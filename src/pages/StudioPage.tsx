import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { GAME_BLUEPRINTS, ExplorerNode } from '../lib/templates';
import { BaseplateViewport3D } from '../components/BaseplateViewport3D';
import { PlayableRobloxGui } from '../components/PlayableRobloxGui';
import { LuauCodeViewer } from '../components/LuauCodeViewer';
import { compileValidRbxlx, triggerFileDownload } from '../lib/rbxlxExporter';
import { playRbxClick } from '../lib/sound';
import {
  AlertTriangle,
  Blocks,
  Box,
  ChevronDown,
  ChevronRight,
  Code2,
  Download,
  FileCode,
  Folder,
  Loader2,
  Radio,
  RefreshCw,
  Send,
  Sparkles,
  Terminal,
  Trash2,
  Wrench,
  Zap,
} from 'lucide-react';

interface ChatTurn {
  id: string;
  role: 'user' | 'agent';
  text: string;
  stats?: string;
}

const ExplorerTreeItem: React.FC<{ node: ExplorerNode; depth?: number }> = ({
  node,
  depth = 0,
}) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = !!(node.children && node.children.length > 0);

  const iconColor =
    node.className === 'Script'
      ? 'text-[#00E676]'
      : node.className === 'LocalScript'
        ? 'text-[#38BDF8]'
        : node.className === 'ModuleScript'
          ? 'text-[#FBBF24]'
          : node.className === 'RemoteEvent'
            ? 'text-[#F472B6]'
            : node.className === 'ScreenGui' || node.className === 'Frame'
              ? 'text-[#A78BFA]'
              : 'text-slate-300';

  return (
    <div>
      <div
        onClick={() => {
          if (hasChildren) setExpanded((e) => !e);
        }}
        style={{ paddingLeft: `${depth * 13 + 8}px` }}
        className="flex items-center justify-between gap-1.5 py-1 pr-2 rounded-md hover:bg-white/6 cursor-pointer text-xs select-none"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            )
          ) : (
            <span className="w-3.5 shrink-0" />
          )}

          {node.className === 'Script' ||
          node.className === 'LocalScript' ||
          node.className === 'ModuleScript' ? (
            <FileCode className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
          ) : node.className === 'RemoteEvent' ? (
            <Radio className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
          ) : hasChildren || node.className === 'Folder' ? (
            <Folder className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
          ) : (
            <Box className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} />
          )}

          <span className="truncate font-medium text-slate-200">{node.name}</span>
        </div>

        {node.isNew && (
          <span className="text-[9px] font-luau font-bold px-1.5 py-0.2 rounded bg-[#00E676]/15 text-[#00FF88] border border-[#00E676]/30 shrink-0">
            SYNC
          </span>
        )}
      </div>

      {hasChildren && expanded && (
        <div>
          {node.children!.map((child) => (
            <ExplorerTreeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const StudioPage: React.FC = () => {
  const {
    activeBlueprint,
    selectBlueprintById,
    isGenerating,
    generationStage,
    generationProgress,
    triggerSimulatedGeneration,
    consoleLogs,
    appendLog,
    clearLogs,
    session,
    runExportOrPrankFlow,
  } = useStudio();

  const [centerTab, setCenterTab] = useState<'viewport' | 'gui' | 'luau'>('viewport');
  const [chatInput, setChatInput] = useState('');
  const [justStreamed, setJustStreamed] = useState(false);
  const [hasSimWarning, setHasSimWarning] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatTurn[]>([
    {
      id: 'welcome',
      role: 'agent',
      text: `Connected to ${session.placeName} via BaseplateMCP (12ms). Describe any Roblox mechanic, UI, or full game loop — I'll plan the Server/Client architecture and Auto-Sync directly into your Explorer.`,
      stats: 'Luau-R3 • $0 Unlimited Compute',
    },
  ]);

  const handleSendPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isGenerating) return;
    playRbxClick();
    const userText = chatInput.trim();
    setChatInput('');

    setChatHistory((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: 'user', text: userText },
    ]);

    triggerSimulatedGeneration(userText, (builtBp) => {
      setJustStreamed(true);
      setChatHistory((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'agent',
          text: `Built & Auto-Synced "${builtBp.title}"! Injected ${builtBp.instancesCount} instances across Workspace, ReplicatedStorage, ServerScriptService, and StarterGui with --!strict type safety.`,
          stats: `${builtBp.scripts.length} Luau Modules • 0 Warnings • Synced in 41ms`,
        },
      ]);
    });
  };

  const handleExportRbxlx = () => {
    playRbxClick();
    runExportOrPrankFlow(() => {
      const srv = activeBlueprint.scripts[0];
      const cli = activeBlueprint.scripts[1] || activeBlueprint.scripts[0];
      const mod = activeBlueprint.scripts[2] || activeBlueprint.scripts[0];
      const xml = compileValidRbxlx({
        projectName: activeBlueprint.title,
        serverScriptName: srv.name.replace(/\.luau$/, ''),
        serverCode: srv.code,
        clientScriptName: cli.name.replace(/\.luau$/, ''),
        clientCode: cli.code,
        moduleScriptName: mod.name.replace(/\.luau$/, ''),
        moduleCode: mod.code,
        guiTitle: activeBlueprint.guiTitle,
        remoteName: 'BaseplatePrimaryRemote',
      });
      const safeFile = activeBlueprint.title.replace(/[^a-zA-Z0-9]+/g, '_') + '.rbxlx';
      triggerFileDownload(safeFile, xml, 'application/xml');
      appendLog('sync', `[Exporter]: Downloaded valid Roblox Studio XML Place "${safeFile}"!`);
    });
  };

  const handleAutoSyncButton = () => {
    playRbxClick();
    runExportOrPrankFlow(() => {
      appendLog(
        'sync',
        `[Auto-Sync]: Pushed ${activeBlueprint.instancesCount} instances to ${session.placeName} over ws://127.0.0.1:${session.port} (${session.pingMs}ms)`
      );
    });
  };

  const handleSimulateWarning = () => {
    playRbxClick();
    setHasSimWarning(true);
    appendLog(
      'warn',
      `14:41:02.881  Infinite yield possible on 'ReplicatedStorage:WaitForChild("LegacyShopRemote", 5)' — Stack Begin: StarterGui.MainClient:18`
    );
  };

  const handleAiAutoFix = () => {
    playRbxClick();
    setHasSimWarning(false);
    appendLog('luau', '[Luau-R3 Auto-Fix]: Patched missing RemoteEvent & updated WaitForChild timeout.');
    appendLog('sync', '[Auto-Sync]: Hot-reloaded StarterGui.MainClient (0 errors, 0 warnings).');
  };

  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-5 py-4 space-y-3">
      {/* Top Studio Ribbon Bar */}
      <div className="rbx-frame-subtle rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E676]" />
            <span className="text-sm font-black text-white">{activeBlueprint.title}</span>
          </div>

          {/* Preset Switcher */}
          <select
            value={GAME_BLUEPRINTS.some((b) => b.id === activeBlueprint.id) ? activeBlueprint.id : ''}
            onChange={(e) => {
              if (e.target.value) {
                playRbxClick();
                selectBlueprintById(e.target.value);
              }
            }}
            className="bg-[#0B0F19] border border-[#273352] rounded-xl px-3 py-1.5 text-xs font-bold text-slate-200 outline-none"
          >
            {!GAME_BLUEPRINTS.some((b) => b.id === activeBlueprint.id) && (
              <option value="">✨ Custom Prompt Build</option>
            )}
            {GAME_BLUEPRINTS.map((bp) => (
              <option key={bp.id} value={bp.id}>
                Template: {bp.title}
              </option>
            ))}
          </select>
        </div>

        {/* Center View Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#0A0E17] border border-[#232D46] p-1 rounded-xl">
          <button
            onClick={() => {
              playRbxClick();
              setCenterTab('viewport');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 ${
              centerTab === 'viewport' ? 'bg-[#00E676] text-[#041A0E]' : 'text-slate-300'
            }`}
          >
            <Box className="w-3.5 h-3.5" /> 3D Baseplate
          </button>
          <button
            onClick={() => {
              playRbxClick();
              setCenterTab('gui');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 ${
              centerTab === 'gui' ? 'bg-[#FFD026] text-[#140E00]' : 'text-slate-300'
            }`}
          >
            <Blocks className="w-3.5 h-3.5" /> ScreenGui Test
          </button>
          <button
            onClick={() => {
              playRbxClick();
              setCenterTab('luau');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 ${
              centerTab === 'luau' ? 'bg-[#38BDF8] text-[#04121F]' : 'text-slate-300'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> Luau Scripts ({activeBlueprint.scripts.length})
          </button>
        </div>

        {/* Right Action Buttons: Auto-Sync & Real .rbxlx Download */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoSyncButton}
            className="rbx-btn-blue px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Auto-Sync to Studio</span>
          </button>
          <button
            onClick={handleExportRbxlx}
            className="rbx-btn-green px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5"
            title="Downloads a real valid .rbxlx XML file that opens in Roblox Studio!"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .rbxlx</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Roblox Studio IDE Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* LEFT COLUMN: Roblox Studio Explorer Tree */}
        <div className="lg:col-span-3 rbx-frame-subtle rounded-2xl flex flex-col h-[480px] lg:h-[560px] overflow-hidden">
          <div className="px-3.5 py-2.5 bg-[#121828] border-b border-[#232D46] flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              Studio Explorer
            </span>
            <span className="font-luau text-[10px] text-[#00E676]">
              {activeBlueprint.instancesCount} instances
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {activeBlueprint.explorer.map((node) => (
              <ExplorerTreeItem key={node.id} node={node} />
            ))}
          </div>

          <div className="p-2.5 bg-[#0A0E17] border-t border-white/8 text-[11px] font-luau text-slate-400 flex items-center justify-between">
            <span>Server/Client Guard</span>
            <span className="text-[#00E676] font-semibold">VERIFIED</span>
          </div>
        </div>

        {/* CENTER COLUMN: 3D Baseplate Viewport / Playable ScreenGui / Luau Editor + Output Console */}
        <div className="lg:col-span-6 flex flex-col gap-3">
          <div className="h-[395px]">
            {centerTab === 'viewport' && (
              <BaseplateViewport3D
                worldProps={activeBlueprint.worldProps}
                accentHex={activeBlueprint.accentHex}
                projectTitle={activeBlueprint.title}
                isGenerating={isGenerating}
                onLog={(msg) => appendLog('info', msg)}
              />
            )}
            {centerTab === 'gui' && (
              <PlayableRobloxGui
                blueprint={activeBlueprint}
                onActionLog={(msg) => appendLog('sync', msg)}
              />
            )}
            {centerTab === 'luau' && (
              <LuauCodeViewer scripts={activeBlueprint.scripts} streamEffect={justStreamed} />
            )}
          </div>

          {/* Mirrored Roblox Studio Output Console (Lemonade.gg's Signature Feature!) */}
          <div className="rbx-frame-subtle rounded-2xl h-[152px] flex flex-col overflow-hidden">
            <div className="px-3.5 py-1.5 bg-[#121828] border-b border-[#232D46] flex items-center justify-between gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
                Studio Output Mirror (127.0.0.1:{session.port})
              </span>

              <div className="flex items-center gap-1.5">
                {hasSimWarning ? (
                  <button
                    onClick={handleAiAutoFix}
                    className="px-2.5 py-0.5 rounded bg-[#00E676] text-[#041A0E] text-[10px] font-black flex items-center gap-1 animate-pulse"
                  >
                    <Wrench className="w-3 h-3" /> Auto-Fix Warning with AI
                  </button>
                ) : (
                  <button
                    onClick={handleSimulateWarning}
                    className="px-2 py-0.5 rounded bg-[#1B2338] hover:bg-[#25304D] text-amber-300 text-[10px] font-bold flex items-center gap-1"
                    title="Test 1-click AI debugging of a Studio console warning"
                  >
                    <AlertTriangle className="w-3 h-3" /> Test Stacktrace Fix
                  </button>
                )}
                <button
                  onClick={() => {
                    playRbxClick();
                    clearLogs();
                  }}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Clear Output"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 font-luau text-[11px] space-y-1 bg-[#080B12]">
              {consoleLogs.map((entry) => {
                const color =
                  entry.level === 'sync'
                    ? 'text-[#00FF88]'
                    : entry.level === 'warn'
                      ? 'text-amber-400'
                      : entry.level === 'luau'
                        ? 'text-[#56D4FF]'
                        : 'text-slate-300';
                return (
                  <div key={entry.id} className={`${color} leading-snug`}>
                    <span className="text-slate-500 mr-2">{entry.timestamp}</span>
                    {entry.message}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Baseplate AI Agent Chat */}
        <div className="lg:col-span-3 rbx-frame-subtle rounded-2xl flex flex-col h-[520px] lg:h-[560px] overflow-hidden">
          <div className="px-3.5 py-2.5 bg-[#121828] border-b border-[#232D46] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00E676]" />
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Baseplate Agent
              </span>
            </div>
            <span className="text-[10px] font-luau px-2 py-0.5 rounded bg-[#00E676]/15 text-[#00FF88]">
              Luau-R3 Free
            </span>
          </div>

          {/* Chat Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
            {chatHistory.map((turn) => (
              <div
                key={turn.id}
                className={`p-3 rounded-xl border ${
                  turn.role === 'user'
                    ? 'bg-[#19233A] border-[#2E3E63] text-white ml-4'
                    : 'bg-[#0C111D] border-[#202A42] text-slate-200 mr-2'
                }`}
              >
                <p className="leading-relaxed">{turn.text}</p>
                {turn.stats && (
                  <div className="mt-2 pt-2 border-t border-white/8 font-luau text-[10px] text-[#00E676] flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {turn.stats}
                  </div>
                )}
              </div>
            ))}

            {/* Live Multi-Stage Compute Progress Card */}
            {isGenerating && (
              <div className="p-3 rounded-xl bg-[#0D1524] border border-[#00E676]/40 space-y-2">
                <div className="flex items-center gap-2 text-[#00FF88] font-bold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span>Thinking &amp; Syncing...</span>
                </div>
                <p className="font-luau text-[11px] text-slate-300">{generationStage}</p>
                <div className="w-full h-2 rounded-full bg-[#070A10] overflow-hidden">
                  <div
                    style={{ width: `${generationProgress}%` }}
                    className="h-full bg-gradient-to-r from-[#00E676] to-[#38BDF8] transition-all duration-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Prompt Input */}
          <form onSubmit={handleSendPrompt} className="p-2.5 bg-[#0C101B] border-t border-[#222C45] space-y-2">
            <textarea
              rows={2}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Baseplate Agent to build any game or edit @StarterGui..."
              className="w-full bg-[#121829] border border-[#283454] focus:border-[#00E676] rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 outline-none resize-none"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full rbx-btn-green py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Syncing to Studio...' : 'Generate & Auto-Sync'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
