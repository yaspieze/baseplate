import React, { useState } from 'react';
import { playRbxClick } from '../lib/sound';
import { BookOpen, Code2, Cpu, Lock, PlugZap } from 'lucide-react';

const DOC_SECTIONS = [
  {
    id: 'quickstart',
    title: '1. Quickstart & Workflow',
    icon: BookOpen,
    body: `Baseplate.gg combines a browser-based multi-model game creation studio with a real-time localhost companion bridge for Roblox Studio.

1. Open /studio or describe your game idea directly on the Explore prompt bar.
2. Baseplate-Luau-R3 plans your project hierarchy across Workspace, ReplicatedStorage, ServerScriptService, and StarterGui.
3. Preview the 3D Baseplate world, test RemoteEvents inside the live playable ScreenGui simulator, or download a standalone .rbxlx XML Place file that opens directly in Roblox Studio.`,
  },
  {
    id: 'guardrails',
    title: '2. Luau-R3 Security & Anti-Exploit Guardrails',
    icon: Lock,
    body: `General-purpose chatbots routinely place DataStoreService calls inside LocalScripts or trust client-reported currency amounts.

Baseplate-Luau-R3 enforces strict compiler guardrails on every prompt:
• Every generated script begins with --!strict and explicit Luau type annotations.
• Server-side cooldown maps (workspace:GetServerTimeNow()) and distance sanity checks protect every RemoteEvent.
• Server logic is strictly isolated inside ServerScriptService, never exposed to client-replicated containers.`,
  },
  {
    id: 'mcp',
    title: '3. BaseplateMCP Localhost Protocol (Port 28440)',
    icon: PlugZap,
    body: `BaseplateMCP binds exclusively to your local loopback interface (ws://127.0.0.1:28440/studio-rpc).

• Zero cloud hosting of your .rbxl place files — your assets remain inside Roblox Studio on your computer.
• Bidirectional Console Mirror streams print(), warn(), and stack traces into your browser so the AI agent can patch runtime issues in one click.
• Compatible with Claude Code, Cursor, and Windsurf via standard Model Context Protocol JSON.`,
  },
  {
    id: 'gui',
    title: '4. 9-Slice ScreenGui & Builder Sans Spec',
    icon: Cpu,
    body: `Unlike image-only generators that output flat PNG mockups, Baseplate GUI Forge emits both High-CTR 1920×1080 promotional thumbnails AND functional Roblox UI trees:

• Native UICorner, UIStroke, UIGradient, and UIGridLayout hierarchies.
• Live support for Enum.Font.BuilderSans, Enum.Font.FredokaOne, Enum.Font.GothamBlack, and Enum.Font.RobotoMono.
• Pre-wired TweenService spring bounce feedback on every TextButton.`,
  },
];

export const DocsPage: React.FC = () => {
  const [activeId, setActiveId] = useState('quickstart');
  const current = DOC_SECTIONS.find((s) => s.id === activeId) || DOC_SECTIONS[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <aside className="md:col-span-4 rbx-frame-subtle rounded-2xl p-4 space-y-2 self-start">
          <div className="px-2 pb-2 border-b border-white/10 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#00E676]">
            <Code2 className="w-4 h-4" /> Baseplate Docs v3.4
          </div>
          {DOC_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const active = sec.id === activeId;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  playRbxClick();
                  setActiveId(sec.id);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2.5 transition ${
                  active
                    ? 'bg-[#00E676] text-[#041A0E]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{sec.title}</span>
              </button>
            );
          })}
        </aside>

        <main className="md:col-span-8 rbx-frame rounded-2xl p-6 sm:p-8 space-y-5">
          <span className="font-luau text-xs text-[#38BDF8]">docs.baseplate.gg / {current.id}</span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{current.title}</h1>
          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
            {current.body}
          </div>
        </main>
      </div>
    </div>
  );
};
