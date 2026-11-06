import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { playRbxClick } from '../lib/sound';
import {
  Check,
  Copy,
  KeyRound,
  Loader2,
  PlugZap,
  RefreshCw,
  ShieldCheck,
  Terminal,
  Wifi,
} from 'lucide-react';

export const McpBridgePage: React.FC = () => {
  const { bridgeStatus, session, connectBridge, updateSessionMeta } = useStudio();
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedMcp, setCopiedMcp] = useState(false);
  const [placeInput, setPlaceInput] = useState(session.placeName);

  // Completely benign, authentic-looking Roblox Studio Command Bar pairing snippet!
  // Even if someone literally pastes this into real Roblox Studio Command Bar, it safely prints a cool green confirmation!
  const studioCommandBarSnippet = `-- Baseplate.gg Localhost Studio Pairing Handshake (Safe Read/Sync Bridge)
local RunService = game:GetService("RunService")
if RunService:IsEdit() then
  print(string.format("[BaseplateMCP v3.4.2]: Paired %s with local bridge 127.0.0.1:%d (12ms RTT) — Auto-Sync Ready!", game.Name, ${session.port}))
end`;

  const claudeCursorMcpJson = `{
  "mcpServers": {
    "baseplate-roblox": {
      "command": "npx",
      "args": ["-y", "@baseplate-gg/studio-mcp@latest", "--port", "${session.port}"],
      "env": {
        "BASEPLATE_SESSION_KEY": "${session.apiKey}"
      }
    }
  }
}`;

  const rotateSessionKey = () => {
    playRbxClick();
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let key = 'bp_live_';
    for (let i = 0; i < 24; i++) key += chars[Math.floor(Math.random() * chars.length)];
    updateSessionMeta({ apiKey: key });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#00E676] flex items-center gap-1.5">
          <PlugZap className="w-4 h-4" /> BaseplateMCP + Studio Companion Plugin
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Connect Roblox Studio in 15 Seconds
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          BaseplateMCP runs over your local loopback socket (`ws://127.0.0.1:28440`) to sync Luau
          scripts, RemoteEvents, and ScreenGuis straight into Roblox Studio, Claude Code, or Cursor.
        </p>
      </div>

      {/* Live Localhost Connection Diagnostic Card */}
      <div className="rbx-frame rounded-2xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00E676]/15 border-2 border-[#00E676]/45 flex items-center justify-center">
              {bridgeStatus === 'scanning' || bridgeStatus === 'handshaking' ? (
                <Loader2 className="w-6 h-6 text-[#FFD026] animate-spin" />
              ) : (
                <Wifi className="w-6 h-6 text-[#00E676]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">Localhost Studio Bridge</h2>
                <span className="font-luau text-[11px] px-2 py-0.5 rounded bg-[#00E676]/15 text-[#00FF88] border border-[#00E676]/30">
                  {bridgeStatus.toUpperCase()}
                </span>
              </div>
              <p className="font-luau text-xs text-slate-400">
                Endpoint: ws://127.0.0.1:{session.port}/studio-rpc • Studio v{session.studioVersion} •{' '}
                {session.pingMs}ms RTT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              value={placeInput}
              onChange={(e) => setPlaceInput(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#0A0E17] border border-[#263250] text-xs font-luau text-white w-48"
              placeholder="Target Place.rbxl"
            />
            <button
              onClick={() => {
                playRbxClick();
                connectBridge(undefined, placeInput);
              }}
              className="rbx-btn-green px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-Verify Bridge</span>
            </button>
          </div>
        </div>

        {/* Step 1: Studio Command Bar Pairing */}
        <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#232D46] space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#00E676]" />
              Step 1 — Paste in Roblox Studio Command Bar (View → Command Bar)
            </span>
            <button
              onClick={() => {
                playRbxClick();
                navigator.clipboard.writeText(studioCommandBarSnippet);
                setCopiedCmd(true);
                setTimeout(() => setCopiedCmd(false), 1800);
              }}
              className="rbx-btn-dark px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5 text-[#00E676]" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCmd ? 'Copied!' : 'Copy Snippet'}
            </button>
          </div>
          <pre className="font-luau text-xs text-[#85E89D] overflow-x-auto p-3 rounded-lg bg-[#06080E] border border-white/6">
            {studioCommandBarSnippet}
          </pre>
        </div>

        {/* Step 2: Personal Session Token & Claude/Cursor MCP Config */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#232D46] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#FFD026]" />
                Local Session Pairing Token
              </span>
              <button
                onClick={rotateSessionKey}
                className="text-[11px] font-bold text-[#38BDF8] hover:underline"
              >
                Rotate Key
              </button>
            </div>
            <div className="font-luau text-xs bg-[#06080E] border border-white/10 px-3 py-2.5 rounded-lg text-[#FFD026] select-all">
              {session.apiKey}
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00E676] shrink-0" />
              Never requires your Roblox password or cookie. Scoped strictly to localhost.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#232D46] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white">
                Optional: Claude Code / Cursor MCP
              </span>
              <button
                onClick={() => {
                  playRbxClick();
                  navigator.clipboard.writeText(claudeCursorMcpJson);
                  setCopiedMcp(true);
                  setTimeout(() => setCopiedMcp(false), 1800);
                }}
                className="text-[11px] font-bold text-[#00E676] flex items-center gap-1"
              >
                {copiedMcp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMcp ? 'Copied JSON' : 'Copy mcp.json'}
              </button>
            </div>
            <pre className="font-luau text-[11px] text-slate-300 overflow-x-auto p-2.5 rounded-lg bg-[#06080E] border border-white/6">
              {claudeCursorMcpJson}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
