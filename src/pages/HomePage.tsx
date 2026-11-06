import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStudio } from '../context/StudioContext';
import { GAME_BLUEPRINTS } from '../lib/templates';
import { assetUrl, playRbxClick, playRbxHover } from '../lib/sound';
import { PlayableRobloxGui } from '../components/PlayableRobloxGui';
import { LuauCodeViewer } from '../components/LuauCodeViewer';
import {
  ArrowRight,
  Blocks,
  Check,
  ChevronDown,
  Code2,
  Cpu,
  Layers,
  Play,
  ShieldCheck,
  Sparkles,
  Terminal,
  Wand2,
  Wifi,
  X,
  Zap,
} from 'lucide-react';

const QUICK_PROMPTS = [
  'Build a Blade Ball deflect arena with katana shop GUI & parry physics',
  'Make a Pet Simulator with weighted triple egg hatching & floating cube pets',
  'Create a 99 Nights snowy cabin survival game with stalker AI & warmth bar',
  'Generate a 5v5 Rivals container FPS with raycast hitreg & loadout HUD',
  'Build an Emerald Factory Tycoon with glowing ore conveyors & rebirths',
];

const FAQS = [
  {
    q: 'What is Baseplate.gg and how does Auto-Sync work?',
    a: 'Baseplate.gg is an AI game creation agent and 9-Slice GUI platform built exclusively for Roblox Studio. Through our lightweight BaseplateMCP Studio companion bridge (localhost:28440), generated Luau scripts, RemoteEvents, and ScreenGuis inject directly into your open Studio Explorer hierarchy with zero manual copy-pasting.',
  },
  {
    q: 'Wait — how is Baseplate.gg actually 100% Free Forever?',
    a: 'Baseplate Labs is backed by the Open Luau & Indie Creator Compute Grant. There are zero credit walls, zero monthly tiers, and zero watermarks. Every creator gets unlimited access to Baseplate-Luau-R3, Forge-GUI-XL, and BaseplateMCP.',
  },
  {
    q: 'Does it generate working ScreenGui instances or just flat PNG mockups?',
    a: 'Both! Unlike flat image generators, Baseplate.gg builds real Roblox ScreenGui hierarchies complete with 9-Slice Frames, UICorner, UIStroke, UIGradient, TweenService button bounce scripts, and High-CTR 1920×1080 thumbnails.',
  },
  {
    q: 'Are my Roblox place files and scripts kept private?',
    a: 'Yes. BaseplateMCP communicates strictly over your local loopback interface (127.0.0.1) into your active Roblox Studio window. Your .rbxl place files stay on your machine and your Roblox account, and you keep 100% commercial DevEx rights.',
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    session,
    selectBlueprintById,
    triggerSimulatedGeneration,
  } = useStudio();

  const [promptInput, setPromptInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('Baseplate-Luau-R3');
  const [showcaseIdx, setShowcaseIdx] = useState(0);
  const [previewTab, setPreviewTab] = useState<'gui' | 'luau'>('gui');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const featuredBp = GAME_BLUEPRINTS[showcaseIdx] || GAME_BLUEPRINTS[0];

  const handleHeroGenerate = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    playRbxClick();
    const finalPrompt = (customText ?? promptInput).trim() || QUICK_PROMPTS[0];
    navigate('/studio');
    setTimeout(() => {
      triggerSimulatedGeneration(finalPrompt);
    }, 80);
  };

  const handleOpenTemplateInStudio = (bpId: string) => {
    playRbxClick();
    selectBlueprintById(bpId);
    navigate('/studio');
  };

  return (
    <div className="rbx-stud-grid min-h-screen">
      {/* HERO SECTION (Lemonade.gg Prompt Hero + ForgeGUI Studio Authority + Tactile Roblox GUI Styling) */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-20 overflow-hidden">
        {/* Ambient Emerald + Studio Blue Glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[780px] h-[360px] bg-[#00E676]/12 blur-[130px] rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
          {/* Creator Social Proof Badge (just like Lemonade.gg & ForgeGUI!) */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#121828]/95 border-2 border-[#25304D] shadow-[0_4px_0_#06080E]">
            <div className="flex -space-x-2">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00E676] to-[#0284C7] border-2 border-[#0B0F19] flex items-center justify-center text-[10px] font-black text-black">
                K
              </span>
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFD026] to-[#F97316] border-2 border-[#0B0F19] flex items-center justify-center text-[10px] font-black text-black">
                B
              </span>
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#8B5CF6] border-2 border-[#0B0F19] flex items-center justify-center text-[10px] font-black text-white">
                V
              </span>
            </div>
            <span className="text-xs font-extrabold text-slate-200">
              Join <span className="text-[#00E676]">740,000+</span> Roblox Creators
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline font-luau text-[11px] text-[#FFD026] font-bold">
              $0 Free Forever
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.04]">
            Build the Roblox game{' '}
            <span className="bg-gradient-to-r from-[#1FF788] via-[#38BDF8] to-[#00E676] bg-clip-text text-transparent">
              only you can imagine.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-300 font-medium leading-relaxed">
            Your all-in-one AI Studio agent that generates{' '}
            <span className="text-white font-bold">--!strict Luau systems</span>,{' '}
            <span className="text-white font-bold">9-Slice ScreenGuis</span>, and{' '}
            <span className="text-white font-bold">3D Baseplates</span> — auto-synced directly into
            Roblox Studio. <span className="text-[#00E676] font-extrabold">Zero credits. Free forever.</span>
          </p>

          {/* Interactive Prompt Command Box (Lemonade.gg + Roblox Studio GUI Hybrid) */}
          <form
            onSubmit={(e) => handleHeroGenerate(e)}
            className="max-w-3xl mx-auto rbx-frame rounded-2xl p-3 sm:p-4 text-left space-y-3"
          >
            <div className="flex items-center justify-between gap-2 text-[11px] font-luau text-slate-400 px-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-[#00E676]/15 text-[#00FF88] border border-[#00E676]/30 font-semibold">
                  @Workspace
                </span>
                <span className="px-2 py-0.5 rounded bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 font-semibold">
                  @StarterGui
                </span>
                <span className="px-2 py-0.5 rounded bg-[#F59E0B]/15 text-[#FBBF24] border border-[#F59E0B]/30 font-semibold">
                  @DataStoreService
                </span>
              </div>
              <span className="hidden sm:flex items-center gap-1.5 text-[#00E676]">
                <Wifi className="w-3.5 h-3.5" />
                Auto-Sync Ready ({session.pingMs}ms)
              </span>
            </div>

            <textarea
              rows={3}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Describe any Roblox game, combat mechanic, or GUI... e.g. 'Make a Blade Ball deflect arena with homing plasma orb physics and a katana crate shop GUI'"
              className="w-full bg-[#0A0E17] border-2 border-[#232D46] focus:border-[#00E676] rounded-xl p-3.5 text-sm sm:text-base text-white placeholder:text-slate-500 outline-none resize-none transition"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Multi-Model Selector (like ForgeGUI's "Every top AI model configured for game creators") */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    playRbxClick();
                    setSelectedModel(e.target.value);
                  }}
                  className="bg-[#121828] border-2 border-[#27324E] rounded-xl px-3 py-2 text-xs font-extrabold text-slate-200 outline-none"
                >
                  <option value="Baseplate-Luau-R3">⚡ Baseplate-Luau-R3 (Thinking • Free)</option>
                  <option value="Forge-GUI-9Slice">🎨 Forge-GUI-XL (ScreenGui + GFX • Free)</option>
                  <option value="StudWorld-3D">🧱 StudWorld-3D (Map + Props • Free)</option>
                </select>

                <span className="text-[11px] font-bold text-slate-400 hidden md:inline">
                  Unlimited Generations • 0 Credits
                </span>
              </div>

              <button
                type="submit"
                className="rbx-btn-green px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 ml-auto"
              >
                <Wand2 className="w-4 h-4" />
                <span>Generate &amp; Sync</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* One-Click Prompt Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto pt-1">
            {QUICK_PROMPTS.slice(0, 4).map((qp, i) => (
              <button
                key={i}
                onMouseEnter={() => playRbxHover()}
                onClick={() => handleHeroGenerate(undefined, qp)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#121726] hover:bg-[#192136] text-slate-300 hover:text-white border border-[#242F4B] transition truncate max-w-[290px]"
              >
                ✨ {qp}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* INFINITE LEMONADE.GG-STYLE GENRE SHOWCASE MARQUEE */}
      <section className="py-6 border-y-2 border-[#1A2236] bg-[#070A11] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-4 flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00E676]" />
            Real Playable Roblox Templates — Click any game to open in AI Studio
          </span>
          <Link
            to="/showcase"
            onClick={() => playRbxClick()}
            className="text-xs font-extrabold text-[#00E676] hover:underline flex items-center gap-1"
          >
            View All Creations <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="animate-marquee gap-4 px-4">
          {[...GAME_BLUEPRINTS, ...GAME_BLUEPRINTS].map((bp, idx) => (
            <div
              key={`${bp.id}-${idx}`}
              onClick={() => handleOpenTemplateInStudio(bp.id)}
              className="w-[300px] sm:w-[340px] shrink-0 mx-2 rbx-frame-subtle rounded-2xl overflow-hidden group cursor-pointer hover:border-[#00E676] transition"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={assetUrl(bp.image)}
                  alt={bp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent" />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#090D16]/90 border border-white/15 text-[#00FF88]">
                  {bp.badge}
                </span>
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-[#38BDF8]">{bp.genre}</p>
                    <h3 className="text-sm font-black text-white">{bp.title}</h3>
                  </div>
                  <span className="w-8 h-8 rounded-xl bg-[#00E676] text-[#041A0E] flex items-center justify-center shadow-md">
                    <Play className="w-4 h-4 fill-current" />
                  </span>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">{bp.creator}</span>
                <span className="font-luau text-[#FFD026]">{bp.instancesCount} Studio Instances</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE LIVE PREVIEW: PLAYABLE ROBLOX GUI + STRICT LUAU ENGINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#00E676] flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Interactive Engine Preview
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Test the generated ScreenGui &amp; Luau live.
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Switch between real blueprints below — click inside the Roblox GUI to test purchases,
              leaderstats updates, and strict server-side Luau scripts.
            </p>
          </div>

          {/* Blueprint Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {GAME_BLUEPRINTS.slice(0, 4).map((bp, i) => (
              <button
                key={bp.id}
                onClick={() => {
                  playRbxClick();
                  setShowcaseIdx(i);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition ${
                  showcaseIdx === i ? 'rbx-btn-green' : 'rbx-btn-dark'
                }`}
              >
                {bp.genre}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Prompt + Showcase Card */}
          <div className="lg:col-span-5 rbx-frame rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="relative h-52 rounded-xl overflow-hidden border-2 border-[#25304B]">
                <img
                  src={assetUrl(featuredBp.image)}
                  alt={featuredBp.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#090D16]/90 border border-white/15 text-[10px] font-black text-[#00E676]">
                  BUILT WITH BASEPLATE.GG
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-[#38BDF8]">{featuredBp.genre}</span>
                <h3 className="text-2xl font-black text-white mt-0.5">{featuredBp.title}</h3>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-[#232D46] space-y-1.5">
                <span className="text-[10px] font-luau uppercase tracking-wider text-slate-400">
                  Creator Prompt
                </span>
                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                  &ldquo;{featuredBp.prompt}&rdquo;
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400 font-luau">
                {featuredBp.instancesCount} instances • 0 warnings
              </div>
              <button
                onClick={() => handleOpenTemplateInStudio(featuredBp.id)}
                className="rbx-btn-blue px-4 py-2.5 rounded-xl text-xs flex items-center gap-2"
              >
                <span>Open Full Project in AI Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Live Switchable Playable Roblox ScreenGui / Strict Luau Code */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="flex items-center justify-between bg-[#111624] border-2 border-[#232D46] p-1.5 rounded-xl">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    playRbxClick();
                    setPreviewTab('gui');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 ${
                    previewTab === 'gui'
                      ? 'bg-[#00E676] text-[#041A0E]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Blocks className="w-3.5 h-3.5" />
                  Playable Roblox ScreenGui
                </button>
                <button
                  onClick={() => {
                    playRbxClick();
                    setPreviewTab('luau');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 ${
                    previewTab === 'luau'
                      ? 'bg-[#38BDF8] text-[#04121F]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Generated --!strict Luau
                </button>
              </div>
              <Link
                to="/gui-forge"
                onClick={() => playRbxClick()}
                className="text-xs font-bold text-[#FFD026] hover:underline pr-2 hidden sm:inline"
              >
                Customize in GUI Forge →
              </Link>
            </div>

            <div className="flex-1">
              {previewTab === 'gui' ? (
                <PlayableRobloxGui blueprint={featuredBp} />
              ) : (
                <LuauCodeViewer scripts={featuredBp.scripts} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STOP FIGHTING GENERIC CHATBOTS COMPARISON (Echoes Lemonade.gg's Iconic Pitch!) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Stop fighting generic AI chatbots in Studio.
          </h2>
          <p className="text-sm text-slate-400">
            General AI models hallucinate deprecated Roblox APIs and dump messy snippets. Baseplate.gg
            reads your live Explorer tree and syncs directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Old Way */}
          <div className="rbx-frame-subtle rounded-2xl p-6 border-rose-500/25 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-500/15 text-rose-400 text-xs font-extrabold">
              <X className="w-4 h-4" /> Generic Chatbots &amp; Paid Credit Tools
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-rose-400 shrink-0 mt-1" />
                <span>Zero awareness of your Explorer hierarchy or RemoteEvent names</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-rose-400 shrink-0 mt-1" />
                <span>Puts Server DataStore code inside client LocalScripts (instant exploit hole)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-rose-400 shrink-0 mt-1" />
                <span>Generates flat PNG pictures instead of real clickable Roblox ScreenGuis</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-rose-400 shrink-0 mt-1" />
                <span>Charges $20–$49/mo and locks you out when you run out of credits</span>
              </li>
            </ul>
          </div>

          {/* The Baseplate.gg Way */}
          <div className="rbx-frame rounded-2xl p-6 border-[#00E676]/45 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#00E676]/15 text-[#00FF88] text-xs font-extrabold">
              <Check className="w-4 h-4" /> The Baseplate.gg Studio Pipeline
            </div>
            <ul className="space-y-3 text-sm text-white font-medium">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#00E676] shrink-0 mt-1" />
                <span>Reads your live Roblox Studio Explorer via BaseplateMCP (12ms localhost sync)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#00E676] shrink-0 mt-1" />
                <span>Enforces --!strict Luau typechecking &amp; server-authoritative anti-cheat</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#00E676] shrink-0 mt-1" />
                <span>Injects complete 9-Slice ScreenGuis, UICorners, UIStrokes &amp; valid .rbxlx files</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#00E676] shrink-0 mt-1" />
                <span>100% Free Forever — $0/mo, unlimited prompts, 100% your Robux</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3-PILLAR FEATURE BENTO (BaseplateMCP + GUI Forge + Console Mirror) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rbx-frame rounded-2xl p-6 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#00E676]/15 border border-[#00E676]/40 flex items-center justify-center text-[#00E676]">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-white">One-Click Studio Auto-Sync</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Approve generated mechanics in your browser and watch scripts, RemoteEvents, and models
              appear in your Roblox Studio Explorer automatically.
            </p>
            <Link
              to="/mcp"
              onClick={() => playRbxClick()}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#00E676] pt-1"
            >
              Configure BaseplateMCP <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rbx-frame rounded-2xl p-6 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8]">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-white">9-Slice GUI &amp; High-CTR GFX</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Design simulator shops, pet inventories, health HUDs, and expressive R6 thumbnails with
              live Builder Sans &amp; Fredoka typography controls.
            </p>
            <Link
              to="/gui-forge"
              onClick={() => playRbxClick()}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#38BDF8] pt-1"
            >
              Launch GUI Forge <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rbx-frame rounded-2xl p-6 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#FFD026]/15 border border-[#FFD026]/40 flex items-center justify-center text-[#FFD026]">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-white">Mirrored Output Console</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Monitor live Roblox Studio print statements, stack traces, and warnings right inside
              Baseplate.gg — and fix any runtime error in one click.
            </p>
            <Link
              to="/studio"
              onClick={() => playRbxClick()}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#FFD026] pt-1"
            >
              Try Live Console Mirror <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FREQUENT QUESTIONS (ForgeGUI-inspired clean accordion) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white">Frequent Questions</h2>
          <p className="text-sm text-slate-400">
            Everything you need to know before connecting your Roblox Studio session.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="rbx-frame-subtle rounded-2xl overflow-hidden">
                <button
                  onClick={() => {
                    playRbxClick();
                    setOpenFaq(isOpen ? null : idx);
                  }}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-sm sm:text-base font-extrabold text-white">{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#00E676] transition-transform shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/6 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Final Bottom Banner */}
        <div className="mt-12 rbx-frame rounded-3xl p-8 text-center space-y-4 bg-gradient-to-b from-[#152238] to-[#0D1322]">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#00FF88] bg-[#00E676]/15 px-3 py-1 rounded-full border border-[#00E676]/30">
            <ShieldCheck className="w-4 h-4" /> $0.00 Forever • No Credit Card • Instant .rbxlx Export
          </div>
          <h3 className="text-2xl sm:text-4xl font-black text-white">
            Ready to turn an empty Baseplate into a front-page hit?
          </h3>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/studio"
              onClick={() => playRbxClick()}
              className="rbx-btn-green px-7 py-3.5 rounded-2xl text-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Start Creating in AI Studio — It&apos;s Free!
            </Link>
            <Link
              to="/mcp"
              onClick={() => playRbxClick()}
              className="rbx-btn-dark px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2"
            >
              Pair Local Studio Plugin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
