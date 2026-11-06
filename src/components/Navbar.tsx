import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStudio } from '../context/StudioContext';
import { playRbxClick, playRbxHover } from '../lib/sound';
import {
  Blocks,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Loader2,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Explore' },
  { to: '/studio', label: 'AI Studio' },
  { to: '/gui-forge', label: 'GUI Forge' },
  { to: '/mcp', label: 'BaseplateMCP' },
  { to: '/showcase', label: 'Showcase' },
  { to: '/docs', label: 'Docs' },
  { to: '/pricing', label: '$0 Forever' },
];

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const { bridgeStatus, session, soundOn, toggleSound, connectBridge } = useStudio();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090C13]/90 backdrop-blur-xl border-b-2 border-[#1D2538]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo: 3D Roblox Baseplate Stud Mark + Wordmark */}
        <Link
          to="/"
          onClick={() => playRbxClick()}
          className="flex items-center gap-2.5 group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#1FF788] to-[#00B859] border-2 border-[#05070C] shadow-[0_3px_0_#006B33] flex items-center justify-center group-hover:scale-105 transition">
            <div className="grid grid-cols-2 gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-[#05070C] shadow-xs" />
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-[#05070C] shadow-xs" />
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-[#05070C] shadow-xs" />
              <span className="w-2.5 h-2.5 rounded-full bg-white border border-[#05070C] shadow-xs" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white">
                baseplate<span className="text-[#00E676]">.gg</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#00E676]/15 text-[#00FF88] border border-[#00E676]/35">
                FREE
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 -mt-0.5 hidden sm:block">
              Roblox AI Studio & GUI Engine
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#111624] border-2 border-[#202940] p-1 rounded-xl">
          {NAV_LINKS.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onMouseEnter={() => playRbxHover()}
                onClick={() => playRbxClick()}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition ${
                  active
                    ? 'bg-[#00E676] text-[#041A0E] shadow-[0_2px_0_#00803E]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Live Studio Localhost Bridge Pill + Audio + Launch CTA */}
        <div className="flex items-center gap-2">
          {/* Live Roblox Studio Bridge Indicator */}
          <Link
            to="/mcp"
            onClick={(e) => {
              playRbxClick();
              if (bridgeStatus === 'disconnected') {
                e.preventDefault();
                connectBridge();
              }
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121827] border-2 border-[#242E47] hover:border-[#36466B] transition text-xs"
            title="Roblox Studio Localhost Auto-Sync Status"
          >
            {bridgeStatus === 'connected' ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00E676]" />
                </span>
                <span className="font-bold text-slate-200 max-w-[135px] truncate">
                  {session.placeName}
                </span>
                <span className="font-luau text-[10px] text-[#00E676] bg-[#00E676]/10 px-1.5 py-0.5 rounded">
                  {session.pingMs}ms
                </span>
              </>
            ) : bridgeStatus === 'scanning' || bridgeStatus === 'handshaking' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-[#FFD026] animate-spin" />
                <span className="font-bold text-[#FFD026]">Pairing Studio...</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-bold text-rose-300">Reconnect Studio</span>
              </>
            )}
          </Link>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              toggleSound();
              playRbxClick();
            }}
            className="rbx-btn-dark p-2 rounded-xl"
            title={soundOn ? 'Mute Roblox GUI SFX' : 'Unmute Roblox GUI SFX'}
          >
            {soundOn ? (
              <Volume2 className="w-4 h-4 text-[#00E676]" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Primary Roblox GUI CTA */}
          <Link
            to="/studio"
            onClick={() => playRbxClick()}
            className="rbx-btn-green px-3.5 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Studio</span>
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => {
              playRbxClick();
              setMobileOpen((v) => !v);
            }}
            className="lg:hidden rbx-btn-dark p-2 rounded-xl"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#1F273B] bg-[#0B0F19] px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => {
                  playRbxClick();
                  setMobileOpen(false);
                }}
                className={`px-3 py-2.5 rounded-xl text-xs font-extrabold border ${
                  pathname === item.to
                    ? 'bg-[#00E676] text-[#041A0E] border-[#05080E]'
                    : 'bg-[#121827] text-slate-200 border-[#232C44]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-[#00E676]" />
              Studio Bridge: {session.placeName} ({session.pingMs}ms)
            </span>
            <Blocks className="w-4 h-4 text-[#00E676]" />
          </div>
        </div>
      )}
    </header>
  );
};
