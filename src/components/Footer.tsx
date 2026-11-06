import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useStudio } from '../context/StudioContext';
import { playRbxClick } from '../lib/sound';
import { Cpu, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setDirectorOpen } = useStudio();
  const tapCountRef = useRef(0);

  // Triple-clicking the release version badge also opens the hidden Prank Director Panel (great on mobile!)
  const handleSecretVersionTap = () => {
    tapCountRef.current += 1;
    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      playRbxClick();
      setDirectorOpen(true);
    }
    setTimeout(() => {
      tapCountRef.current = 0;
    }, 900);
  };

  return (
    <footer className="border-t-2 border-[#1B2235] bg-[#070A10] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00E676] border-2 border-[#05070C] flex items-center justify-center font-black text-[#041A0E]">
                B
              </div>
              <span className="text-lg font-black text-white">
                baseplate<span className="text-[#00E676]">.gg</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The all-in-one AI game creation agent &amp; 9-Slice GUI forge built exclusively for
              Roblox Studio developers. Powered by the Open Luau Creator Compute Grant.
            </p>
            <div className="inline-flex items-center gap-2 text-[11px] font-luau bg-[#101624] border border-[#222D48] px-3 py-1.5 rounded-lg text-[#00E676]">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
              All 64 H200 Luau Clusters Operational
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-semibold">
              <li>
                <Link to="/studio" className="hover:text-[#00E676] transition">
                  AI Studio Workspace
                </Link>
              </li>
              <li>
                <Link to="/gui-forge" className="hover:text-[#00E676] transition">
                  9-Slice GUI &amp; GFX Forge
                </Link>
              </li>
              <li>
                <Link to="/mcp" className="hover:text-[#00E676] transition">
                  BaseplateMCP &amp; Studio Plugin
                </Link>
              </li>
              <li>
                <Link to="/showcase" className="hover:text-[#00E676] transition">
                  Real-Game Showcase
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-3">
              Resources
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-semibold">
              <li>
                <Link to="/docs" className="hover:text-[#00E676] transition">
                  Creator Documentation
                </Link>
              </li>
              <li>
                <Link to="/docs" className="hover:text-[#00E676] transition">
                  Luau-R3 Security Guardrails
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#00E676] transition">
                  Why It&apos;s $0 Forever
                </Link>
              </li>
              <li>
                <Link to="/mcp" className="hover:text-[#00E676] transition">
                  Localhost Port 28440 Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-3">
              Creator Trust
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00E676] shrink-0" />
                Zero server access required — code stays inside your local Roblox Studio session.
              </p>
              <p className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#38BDF8] shrink-0" />
                100% Commercial Ownership — keep 100% of your DevEx &amp; Robux revenue.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © 2026 Baseplate Labs Inc. Independent creator tool — not affiliated with or endorsed by
            Roblox Corporation.
          </p>
          <button
            onClick={handleSecretVersionTap}
            className="font-luau text-slate-500 hover:text-slate-300 transition select-none"
            title="Build Release"
          >
            Build v3.4.2-luau-r3 • BaseplateMCP Protocol 1.8
          </button>
        </div>
      </div>
    </footer>
  );
};
