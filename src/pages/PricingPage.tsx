import React from 'react';
import { Link } from 'react-router-dom';
import { playRbxClick } from '../lib/sound';
import { Check, Crown, HeartHandshake, Sparkles, X } from 'lucide-react';

export const PricingPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00E676]/15 border border-[#00E676]/35 text-xs font-extrabold text-[#00FF88]">
          <HeartHandshake className="w-4 h-4" /> Open Luau &amp; Indie Creator Compute Grant
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white">
          $0.00 Forever. Zero Credit Limits.
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Every teenager, student, and indie Roblox studio deserves top-tier AI tooling without hitting
          a $29/mo paywall after 5 prompts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Other Paid AI Tools */}
        <div className="rbx-frame-subtle rounded-3xl p-7 flex flex-col justify-between opacity-85">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Typical Paid Roblox AI Tools
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-300">$29–$49</span>
              <span className="text-sm text-slate-500">/ month + credit top-ups</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-400 pt-2">
              <li className="flex items-center gap-2.5">
                <X className="w-4 h-4 text-rose-400 shrink-0" /> 3–5 credits burned per GUI image
              </li>
              <li className="flex items-center gap-2.5">
                <X className="w-4 h-4 text-rose-400 shrink-0" /> Weekend-only queues on free tiers
              </li>
              <li className="flex items-center gap-2.5">
                <X className="w-4 h-4 text-rose-400 shrink-0" /> Public watermarks unless subscribed
              </li>
              <li className="flex items-center gap-2.5">
                <X className="w-4 h-4 text-rose-400 shrink-0" /> Flat PNGs with zero Luau ScreenGui code
              </li>
            </ul>
          </div>
        </div>

        {/* Baseplate.gg Creator Edition */}
        <div className="rbx-frame rounded-3xl p-7 border-[#00E676] flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#00FF88] flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#FFD026]" /> Baseplate.gg Full Studio Pass
              </span>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-[#00E676] text-[#041A0E]">
                FREE FOREVER
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-white">$0</span>
              <span className="text-sm font-bold text-[#00E676]">/ forever • Unlimited prompts</span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-white font-medium pt-2">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#00E676] shrink-0" /> Unlimited Baseplate-Luau-R3 &amp; Thinking builds
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#00E676] shrink-0" /> Unlimited 9-Slice ScreenGui &amp; 1920×1080 GFX
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#00E676] shrink-0" /> Full BaseplateMCP Studio Auto-Sync &amp; .rbxlx Export
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#00E676] shrink-0" /> 100% Private Creations &amp; 100% Commercial DevEx Rights
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <Link
              to="/studio"
              onClick={() => playRbxClick()}
              className="w-full rbx-btn-green py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Studio Now — $0 Forever</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
