import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GAME_BLUEPRINTS } from '../lib/templates';
import { useStudio } from '../context/StudioContext';
import { assetUrl, playRbxClick } from '../lib/sound';
import { ArrowRight, Play, Radio, Users } from 'lucide-react';

const LIVE_TICKER = [
  '@Zeph Luau synced "AnimeAuraRollGui" (19 instances) • 4s ago',
  '@RbxMilo exported "TowerOfNeon_v4.rbxlx" • 9s ago',
  '@PixelForge generated "LagCompensatedSniper.server.luau" • 14s ago',
  '@KitsuneDev synced "PetHatchCapsules" (31 instances) • 22s ago',
];

export const ShowcasePage: React.FC = () => {
  const navigate = useNavigate();
  const { selectBlueprintById } = useStudio();
  const [filter, setFilter] = useState<'all' | 'pvp' | 'sim'>('all');

  const filtered = GAME_BLUEPRINTS.filter((bp) => {
    if (filter === 'pvp') return bp.id === 'blade-arena' || bp.id === 'tactical-rivals';
    if (filter === 'sim') return bp.id === 'pet-tycoon' || bp.id === 'desert-tycoon';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Live Community Sync Strip */}
      <div className="rbx-frame-subtle rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-extrabold text-[#00FF88]">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>LIVE CREATOR FEED</span>
        </div>
        <div className="flex flex-wrap gap-4 font-luau text-[11px] text-slate-300">
          {LIVE_TICKER.slice(0, 2).map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Community Real-Game Showcase
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Inspect full open-source Roblox Studio blueprints generated in seconds with Baseplate.gg.
          </p>
        </div>

        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All Genres (6)' },
            { id: 'pvp', label: 'PvP & Shooters' },
            { id: 'sim', label: 'Simulators & Tycoons' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playRbxClick();
                setFilter(tab.id as 'all' | 'pvp' | 'sim');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold ${
                filter === tab.id ? 'rbx-btn-green' : 'rbx-btn-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((bp) => (
          <div
            key={bp.id}
            className="rbx-frame rounded-2xl overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-52 overflow-hidden">
                <img
                  src={assetUrl(bp.image)}
                  alt={bp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-lg bg-[#090D16]/90 border border-white/15 text-[#00FF88]">
                  {bp.badge}
                </span>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="font-bold text-white bg-black/60 px-2.5 py-1 rounded-lg">
                    {bp.creator}
                  </span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-lg">
                    <Users className="w-3.5 h-3.5 text-[#00E676]" /> {bp.plays}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-2.5">
                <span className="text-xs font-extrabold text-[#38BDF8]">{bp.genre}</span>
                <h3 className="text-xl font-black text-white">{bp.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  &ldquo;{bp.prompt}&rdquo;
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-2">
              <span className="font-luau text-[11px] text-[#FFD026]">
                {bp.instancesCount} Studio Instances
              </span>
              <button
                onClick={() => {
                  playRbxClick();
                  selectBlueprintById(bp.id);
                  navigate('/studio');
                }}
                className="rbx-btn-green px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Remix in Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
