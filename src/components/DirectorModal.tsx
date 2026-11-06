import React, { useState } from 'react';
import { useStudio, LatencyMode } from '../context/StudioContext';
import { playRbxClick } from '../lib/sound';
import { Loader2, PartyPopper, Settings2, Sparkles, Wifi, X } from 'lucide-react';

export const DirectorModal: React.FC = () => {
  const {
    directorOpen,
    setDirectorOpen,
    session,
    connectBridge,
    disconnectBridge,
    bridgeStatus,
    latencyMode,
    setLatencyMode,
    prankSettings,
    setPrankSettings,
    prankModalVisible,
    setPrankModalVisible,
    exportProgressModal,
  } = useStudio();

  const [tempUser, setTempUser] = useState(session.username);
  const [tempPlace, setTempPlace] = useState(session.placeName);

  return (
    <>
      {/* 1. Realistic Export / Studio Sync Progress Modal */}
      {exportProgressModal.active && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rbx-frame max-w-md w-full rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00E676]/15 border border-[#00E676]/40 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-[#00E676] animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Syncing Place Bundle to Studio...
                </h3>
                <p className="font-luau text-xs text-[#00E676]">
                  Target: {session.placeName} ({session.pingMs}ms)
                </p>
              </div>
            </div>

            <div className="w-full h-4 rounded-xl bg-[#090C13] border-2 border-[#232D46] overflow-hidden p-0.5">
              <div
                style={{ width: `${exportProgressModal.percent}%` }}
                className="h-full rounded-lg bg-gradient-to-r from-[#00E676] to-[#38BDF8] transition-all duration-300"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-luau text-slate-300">
              <span>{exportProgressModal.step}</span>
              <span className="font-bold text-white">{exportProgressModal.percent}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Optional Prank Reveal Modal (ONLY fires if armed in Shift+P Director Panel!) */}
      {prankModalVisible && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-gradient-to-b from-[#1E2946] to-[#101628] border-4 border-[#05070C] rounded-3xl shadow-[0_12px_0_#05070C,0_25px_70px_rgba(0,230,118,0.35)] overflow-hidden font-fredoka">
            <div className="bg-gradient-to-r from-[#FFD026] via-[#FF9900] to-[#FF4D6A] px-6 py-4 border-b-4 border-[#05070C] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#181000] font-extrabold text-lg">
                <PartyPopper className="w-6 h-6" />
                <span>SYSTEM ALERT • STUDIO SYNC 99.9%</span>
              </div>
              <button
                onClick={() => setPrankModalVisible(false)}
                className="w-8 h-8 rounded-xl bg-[#090D16] text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              <div className="text-5xl">😂🎬</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white rbx-stroke leading-tight">
                {prankSettings.bannerTitle}
              </h2>
              <p className="font-builder text-sm sm:text-base text-slate-200 leading-relaxed">
                {prankSettings.bannerBody}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 font-builder">
                <button
                  onClick={() => {
                    playRbxClick();
                    setPrankModalVisible(false);
                  }}
                  className="rbx-btn-green px-6 py-3 rounded-xl text-sm"
                >
                  Okay You Got Me 💀
                </button>
              </div>
              <p className="font-luau text-[11px] text-slate-400 pt-2">
                {prankSettings.creatorCredit}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Hidden YouTuber / Prank Director Panel (Shift + P or Triple-Click Footer Build Badge) */}
      {directorOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rbx-frame max-w-lg w-full rounded-2xl overflow-hidden">
            <div className="px-5 py-4 bg-[#141B2D] border-b border-[#26324F] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-[#00E676]" />
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Secret Director &amp; Prank Controls (Shift + P)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Hidden from friends! Spoof their Roblox username, Place file, or arm a prank popup.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDirectorOpen(false)}
                className="rbx-btn-dark p-1.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {/* Spoof Friend's Studio Connection */}
              <div className="p-3.5 rounded-xl bg-[#0C101B] border border-[#222C46] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white flex items-center gap-1.5">
                    <Wifi className="w-4 h-4 text-[#00E676]" />
                    Spoof Live Roblox Studio Session
                  </span>
                  <span className="font-luau text-[11px] text-[#00E676]">Status: {bridgeStatus}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Friend&apos;s Roblox Handle
                    </label>
                    <input
                      value={tempUser}
                      onChange={(e) => setTempUser(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#13192B] border border-[#2A3656] text-white font-luau"
                      placeholder="@FriendUsername"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Spoofed Studio Place File
                    </label>
                    <input
                      value={tempPlace}
                      onChange={(e) => setTempPlace(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#13192B] border border-[#2A3656] text-white font-luau"
                      placeholder="MyGame_v2.rbxl"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      playRbxClick();
                      connectBridge(tempUser, tempPlace);
                      setDirectorOpen(false);
                    }}
                    className="rbx-btn-green px-3.5 py-2 rounded-lg text-xs"
                  >
                    Simulate Live Handshake Now
                  </button>
                  <button
                    onClick={() => {
                      playRbxClick();
                      disconnectBridge();
                    }}
                    className="rbx-btn-dark px-3.5 py-2 rounded-lg text-xs"
                  >
                    Simulate Disconnected
                  </button>
                </div>
              </div>

              {/* AI Latency Realism Selector */}
              <div className="p-3.5 rounded-xl bg-[#0C101B] border border-[#222C46] space-y-2">
                <span className="font-extrabold text-white block">
                  Simulated H200 Compute &amp; Studio Sync Delay
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'fast', label: 'Fast (1.5s)' },
                      { id: 'realistic', label: 'Realistic (4.2s)' },
                      { id: 'dramatic', label: 'Dramatic (7.8s)' },
                    ] as { id: LatencyMode; label: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        playRbxClick();
                        setLatencyMode(opt.id);
                      }}
                      className={`py-2 px-2 rounded-lg font-bold border ${
                        latencyMode === opt.id
                          ? 'bg-[#00E676] text-[#041A0E] border-black'
                          : 'bg-[#141B2D] text-slate-300 border-[#283453]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Prank Reveal Arming */}
              <div className="p-3.5 rounded-xl bg-[#0C101B] border border-[#222C46] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-extrabold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#FFD026]" />
                      Arm 99% Prank Popup on Export / Sync
                    </span>
                    <span className="text-[11px] text-slate-400">
                      OFF = downloads a real valid .rbxlx Roblox Studio file! ON = triggers prank reveal at 99%!
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      playRbxClick();
                      setPrankSettings((p) => ({ ...p, armedOnExport: !p.armedOnExport }));
                    }}
                    className={`px-3 py-1.5 rounded-lg font-extrabold shrink-0 ${
                      prankSettings.armedOnExport ? 'rbx-btn-gold' : 'rbx-btn-dark'
                    }`}
                  >
                    {prankSettings.armedOnExport ? 'ARMED 🔥' : 'OFF (Stealth)'}
                  </button>
                </div>

                {prankSettings.armedOnExport && (
                  <div className="space-y-2 pt-1">
                    <input
                      value={prankSettings.bannerTitle}
                      onChange={(e) =>
                        setPrankSettings((p) => ({ ...p, bannerTitle: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#13192B] border border-[#2A3656] text-white"
                      placeholder="Prank Headline"
                    />
                    <textarea
                      rows={2}
                      value={prankSettings.bannerBody}
                      onChange={(e) =>
                        setPrankSettings((p) => ({ ...p, bannerBody: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#13192B] border border-[#2A3656] text-white"
                      placeholder="Prank Message"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
