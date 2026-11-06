import React, { useState, useEffect } from 'react';
import { GameBlueprint, GuiShopItem } from '../lib/templates';
import { playRbxClick, playRbxCoin } from '../lib/sound';
import { Check, Coins, MessageSquare, ShieldCheck, Sparkles, X } from 'lucide-react';

export type RbxFontPreset = 'FredokaOne' | 'BuilderSans' | 'GothamBlack' | 'RobotoMono';

interface Props {
  blueprint: GameBlueprint;
  fontPreset?: RbxFontPreset;
  cornerRadius?: number;
  strokeThickness?: number;
  customHeader?: string;
  onActionLog?: (msg: string) => void;
}

export const PlayableRobloxGui: React.FC<Props> = ({
  blueprint,
  fontPreset = 'FredokaOne',
  cornerRadius = 18,
  strokeThickness = 3,
  customHeader,
  onActionLog,
}) => {
  const [balance, setBalance] = useState(blueprint.startingCurrency);
  const [ownedIds, setOwnedIds] = useState<Record<string, boolean>>({});
  const [equippedId, setEquippedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [windowOpen, setWindowOpen] = useState(true);

  useEffect(() => {
    setBalance(blueprint.startingCurrency);
    setOwnedIds({});
    setEquippedId(null);
    setWindowOpen(true);
  }, [blueprint.id, blueprint.startingCurrency]);

  const fontClass =
    fontPreset === 'FredokaOne'
      ? 'font-fredoka'
      : fontPreset === 'RobotoMono'
        ? 'font-luau'
        : 'font-builder';

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleBuyOrEquip = (item: GuiShopItem) => {
    if (ownedIds[item.id]) {
      playRbxClick();
      setEquippedId(item.id);
      triggerToast(`Equipped ${item.name}!`);
      onActionLog?.(`[RemoteEvent]: EquipItem("${item.id}") -> Equipped on LocalPlayer`);
      return;
    }

    if (balance < item.price) {
      playRbxClick();
      triggerToast(`Need ${(item.price - balance).toLocaleString()} more ${blueprint.currencyName}!`);
      onActionLog?.(`[Warn]: Insufficient ${blueprint.currencyName} for "${item.name}"`);
      return;
    }

    playRbxCoin();
    const nextBal = balance - item.price;
    setBalance(nextBal);
    setOwnedIds((prev) => ({ ...prev, [item.id]: true }));
    setEquippedId(item.id);
    triggerToast(`Purchased ${item.name}! (${item.statBoost})`);
    onActionLog?.(
      `[RemoteEvent]: PurchaseItem("${item.id}") -> Approved! New ${blueprint.currencyName}: ${nextBal.toLocaleString()}`
    );
  };

  const handleEarnTestCurrency = () => {
    playRbxCoin();
    const bonus = Math.max(150, Math.round(blueprint.startingCurrency * 0.2));
    setBalance((b) => b + bonus);
    triggerToast(`+${bonus.toLocaleString()} ${blueprint.currencyName}!`);
    onActionLog?.(`[ServerScriptService]: Awarded +${bonus} ${blueprint.currencyName} to leaderstats`);
  };

  return (
    <div
      className={`relative w-full h-full min-h-[390px] rounded-xl overflow-hidden border-2 border-[#252F48] rbx-stud-surface bg-[#0C1220] p-4 flex flex-col justify-between select-none ${fontClass}`}
    >
      {/* Authentic Roblox In-Game Topbar (Unibar + Leaderstats!) */}
      <div className="flex items-start justify-between gap-3 z-10">
        {/* Top-Left Roblox Experience Controls */}
        <div className="flex items-center gap-2">
          <div
            onClick={() => {
              playRbxClick();
              setWindowOpen(true);
            }}
            className="w-9 h-9 rounded-xl bg-[#121621]/90 border border-white/15 flex items-center justify-center cursor-pointer hover:bg-[#1B2233] transition"
            title="Roblox Experience Menu"
          >
            {/* Iconic tilted square motif */}
            <div className="w-4 h-4 border-[3px] border-white rotate-12 rounded-[2px]" />
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#121621]/90 border border-white/15 flex items-center justify-center text-white/85">
            <MessageSquare className="w-4 h-4" />
          </div>
          <button
            onClick={handleEarnTestCurrency}
            className="rbx-btn-gold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Coins className="w-3.5 h-3.5" />
            {blueprint.actionButtonLabel}
          </button>
        </div>

        {/* Top-Right Authentic Roblox `leaderstats` Panel */}
        <div className="bg-[#0E131F]/92 border border-white/15 rounded-xl px-3 py-2 min-w-[185px] backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 pb-1 border-b border-white/10">
            <span>Players</span>
            <span>{blueprint.currencyName}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-bold text-white pt-1.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00E676]" />
              You
            </span>
            <span className="text-[#FFD026] font-luau">{balance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Center Playable 9-Slice Roblox ScreenGui Window */}
      <div className="my-auto py-3 flex items-center justify-center z-10">
        {windowOpen ? (
          <div
            style={{
              borderRadius: `${cornerRadius}px`,
              borderWidth: `${strokeThickness}px`,
            }}
            className="w-full max-w-xl bg-gradient-to-b from-[#1A233A] to-[#101626] border-[#06080E] shadow-[0_10px_0_#06080E,0_20px_45px_rgba(0,0,0,0.65)] overflow-hidden transition-all"
          >
            {/* Glossy Roblox Simulator Header Banner */}
            <div className="relative px-5 py-3.5 bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#06B6D4] border-b-[3px] border-[#06080E] flex items-center justify-between">
              <div className="absolute inset-x-2 top-1 h-2.5 rounded-full bg-white/25 pointer-events-none" />
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#FFE033] drop-shadow" />
                <h3 className="text-lg sm:text-xl font-extrabold tracking-wide text-white rbx-stroke-sm uppercase">
                  {customHeader || blueprint.guiTitle}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-[#090D16]/85 border-2 border-[#06080E] rounded-xl px-3 py-1 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-[#FFD026]" />
                  <span className="text-xs sm:text-sm font-extrabold text-[#FFD026]">
                    {balance.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => {
                    playRbxClick();
                    setWindowOpen(false);
                  }}
                  className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#FF4D6A] to-[#D91B3B] border-2 border-[#06080E] shadow-[0_3px_0_#7A091D] active:translate-y-0.5 flex items-center justify-center text-white"
                  title="Close ScreenGui"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* 2x2 Interactive Roblox UIGridLayout Cards */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {blueprint.guiItems.map((item) => {
                const isOwned = !!ownedIds[item.id];
                const isEquipped = equippedId === item.id;
                return (
                  <div
                    key={item.id}
                    style={{ borderRadius: `${Math.max(10, cornerRadius - 4)}px` }}
                    className={`relative p-3.5 bg-[#131B2E] border-2 transition-transform hover:-translate-y-0.5 ${
                      isEquipped
                        ? 'border-[#00E676] shadow-[0_0_20px_rgba(0,230,118,0.2)]'
                        : 'border-[#293554]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          style={{ backgroundColor: `${item.accent}22`, borderColor: item.accent }}
                          className="w-11 h-11 rounded-xl border-2 flex items-center justify-center text-2xl shrink-0"
                        >
                          {item.emoji}
                        </div>
                        <div>
                          <span
                            style={{ color: item.accent }}
                            className="text-[10px] font-extrabold uppercase tracking-wider block"
                          >
                            {item.rarity}
                          </span>
                          <h4 className="text-sm font-extrabold text-white leading-tight">
                            {item.name}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-white/8">
                      <span className="text-[11px] font-semibold text-slate-300">
                        {item.statBoost}
                      </span>

                      <button
                        onClick={() => handleBuyOrEquip(item)}
                        className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 ${
                          isEquipped
                            ? 'rbx-btn-blue'
                            : isOwned
                              ? 'rbx-btn-dark'
                              : 'rbx-btn-green'
                        }`}
                      >
                        {isEquipped ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> Equipped
                          </>
                        ) : isOwned ? (
                          'Equip'
                        ) : (
                          <>${item.price.toLocaleString()}</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              playRbxClick();
              setWindowOpen(true);
            }}
            className="rbx-btn-blue px-5 py-3 rounded-2xl text-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Re-open {blueprint.guiTitle}
          </button>
        )}
      </div>

      {/* Live Toast + Bottom ScreenGui Status */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 z-10">
        <span className="flex items-center gap-1.5 bg-[#090D16]/85 border border-white/10 px-2.5 py-1 rounded-lg">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
          Interactive ScreenGui • Click buttons to test RemoteEvents!
        </span>
        {toast && (
          <span className="bg-[#00E676] text-[#041A0E] font-extrabold px-3 py-1 rounded-lg shadow-lg animate-bounce">
            {toast}
          </span>
        )}
      </div>
    </div>
  );
};
