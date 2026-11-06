import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  GAME_BLUEPRINTS,
  GameBlueprint,
  synthesizeBlueprintFromPrompt,
} from '../lib/templates';
import {
  playStudioSyncChime,
  playPrankRevealSound,
  setSoundMuted,
} from '../lib/sound';

export type BridgeStatus = 'disconnected' | 'scanning' | 'handshaking' | 'connected';
export type LatencyMode = 'realistic' | 'dramatic' | 'fast';

export interface ConsoleEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'sync' | 'warn' | 'luau';
  message: string;
}

export interface StudioSessionInfo {
  username: string;
  placeName: string;
  studioVersion: string;
  port: number;
  pingMs: number;
  apiKey: string;
  syncedInstances: number;
}

export interface PrankSettings {
  armedOnExport: boolean;
  bannerTitle: string;
  bannerBody: string;
  creatorCredit: string;
}

interface StudioContextValue {
  bridgeStatus: BridgeStatus;
  bridgeStepLabel: string;
  session: StudioSessionInfo;
  connectBridge: (customUser?: string, customPlace?: string) => void;
  disconnectBridge: () => void;
  updateSessionMeta: (partial: Partial<StudioSessionInfo>) => void;

  activeBlueprint: GameBlueprint;
  selectBlueprintById: (id: string) => void;
  runCustomPromptBuild: (prompt: string) => GameBlueprint;

  isGenerating: boolean;
  generationStage: string;
  generationProgress: number;
  triggerSimulatedGeneration: (promptText?: string, onDone?: (bp: GameBlueprint) => void) => void;

  consoleLogs: ConsoleEntry[];
  appendLog: (level: ConsoleEntry['level'], message: string) => void;
  clearLogs: () => void;

  soundOn: boolean;
  toggleSound: () => void;

  latencyMode: LatencyMode;
  setLatencyMode: (mode: LatencyMode) => void;

  directorOpen: boolean;
  setDirectorOpen: (open: boolean) => void;

  prankSettings: PrankSettings;
  setPrankSettings: React.Dispatch<React.SetStateAction<PrankSettings>>;
  prankModalVisible: boolean;
  setPrankModalVisible: (v: boolean) => void;
  exportProgressModal: { active: boolean; percent: number; step: string };
  runExportOrPrankFlow: (onRealExport: () => void) => void;
}

const StudioContext = createContext<StudioContextValue | null>(null);

function nowStamp(): string {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  const ms = String(d.getMilliseconds()).padStart(3, '0');
  return `${hh}:${mm}:${ss}.${ms}`;
}

function randomApiKey(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let out = 'bp_live_';
  for (let i = 0; i < 24; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bridgeStatus, setBridgeStatus] = useState<BridgeStatus>('connected');
  const [bridgeStepLabel, setBridgeStepLabel] = useState<string>('Synced • 127.0.0.1:28440');

  const [session, setSession] = useState<StudioSessionInfo>({
    username: '@CreatorStudio_Dev',
    placeName: 'Baseplate_Place1.rbxl',
    studioVersion: '0.649.0.6490782',
    port: 28440,
    pingMs: 12,
    apiKey: randomApiKey(),
    syncedInstances: 24,
  });

  const [activeBlueprint, setActiveBlueprint] = useState<GameBlueprint>(GAME_BLUEPRINTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);

  const [soundOn, setSoundOn] = useState(true);
  const [latencyMode, setLatencyMode] = useState<LatencyMode>('realistic');
  const [directorOpen, setDirectorOpen] = useState(false);

  const [prankSettings, setPrankSettings] = useState<PrankSettings>({
    armedOnExport: false,
    bannerTitle: 'WAIT... YOU ACTUALLY BELIEVED IT?! 😂',
    bannerBody:
      'Bro really thought a 100% FREE AI just built an entire front-page Roblox game in 4 seconds! Smile for the video — you just got pranked on Baseplate.gg!',
    creatorCredit: 'Prank Mode Active • Press ESC to return to Studio',
  });
  const [prankModalVisible, setPrankModalVisible] = useState(false);
  const [exportProgressModal, setExportProgressModal] = useState({
    active: false,
    percent: 0,
    step: '',
  });

  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([
    {
      id: 'init-1',
      timestamp: nowStamp(),
      level: 'info',
      message: '[BaseplateMCP v3.4.2]: Localhost WebSocket bridge bound on ws://127.0.0.1:28440/studio-rpc',
    },
    {
      id: 'init-2',
      timestamp: nowStamp(),
      level: 'sync',
      message: '[Auto-Sync]: Connected to RobloxStudioBeta.exe (Baseplate_Place1.rbxl • 12ms RTT)',
    },
    {
      id: 'init-3',
      timestamp: nowStamp(),
      level: 'luau',
      message: 'Luau-R3 Strict Typechecker active — Server/Client container guardrails enabled.',
    },
  ]);

  const appendLog = useCallback((level: ConsoleEntry['level'], message: string) => {
    setConsoleLogs((prev) => [
      ...prev.slice(-60),
      { id: `${Date.now()}-${Math.random()}`, timestamp: nowStamp(), level, message },
    ]);
  }, []);

  const clearLogs = useCallback(() => setConsoleLogs([]), []);

  // Subtle realistic localhost ping jitter every 2.8s when connected
  useEffect(() => {
    if (bridgeStatus !== 'connected') return;
    const timer = setInterval(() => {
      setSession((prev) => ({
        ...prev,
        pingMs: Math.max(8, Math.min(21, prev.pingMs + Math.floor(Math.random() * 5) - 2)),
      }));
    }, 2800);
    return () => clearInterval(timer);
  }, [bridgeStatus]);

  // Secret keyboard shortcut Shift + P for the YouTuber / Prank Director Panel!
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (!isInput && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        setDirectorOpen((v) => !v);
      }
      if (e.key === 'Escape') {
        setPrankModalVisible(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundOn((prev) => {
      const next = !prev;
      setSoundMuted(!next);
      return next;
    });
  }, []);

  const connectBridge = useCallback(
    (customUser?: string, customPlace?: string) => {
      setBridgeStatus('scanning');
      setBridgeStepLabel('Scanning 127.0.0.1:28440–28445...');
      appendLog('info', '[Bridge]: Probing local loopback ports 28440..28445 for RobloxStudioBeta.exe...');

      setTimeout(() => {
        setBridgeStatus('handshaking');
        setBridgeStepLabel('Handshaking Studio Plugin v3.4...');
        appendLog('info', '[Bridge]: Found Baseplate Companion Plugin on port 28440 — verifying place lock...');
      }, 950);

      setTimeout(() => {
        const nextUser = customUser || session.username;
        const nextPlace = customPlace || session.placeName;
        setSession((prev) => ({
          ...prev,
          username: nextUser,
          placeName: nextPlace,
          pingMs: 11 + Math.floor(Math.random() * 5),
        }));
        setBridgeStatus('connected');
        setBridgeStepLabel(`Synced • ${nextPlace}`);
        appendLog(
          'sync',
          `[Auto-Sync]: Session paired with ${nextUser} -> ${nextPlace} (12ms RTT, --!strict ready)`
        );
        playStudioSyncChime();
      }, 2250);
    },
    [appendLog, session.placeName, session.username]
  );

  const disconnectBridge = useCallback(() => {
    setBridgeStatus('disconnected');
    setBridgeStepLabel('Studio Disconnected');
    appendLog('warn', '[Bridge]: Localhost WebSocket session closed by user.');
  }, [appendLog]);

  const updateSessionMeta = useCallback((partial: Partial<StudioSessionInfo>) => {
    setSession((prev) => ({ ...prev, ...partial }));
  }, []);

  const selectBlueprintById = useCallback(
    (id: string) => {
      const found = GAME_BLUEPRINTS.find((b) => b.id === id);
      if (found) {
        setActiveBlueprint(found);
        appendLog('sync', `[Workspace]: Loaded blueprint "${found.title}" (${found.instancesCount} instances).`);
      }
    },
    [appendLog]
  );

  const runCustomPromptBuild = useCallback((prompt: string): GameBlueprint => {
    const bp = synthesizeBlueprintFromPrompt(prompt);
    setActiveBlueprint(bp);
    return bp;
  }, []);

  const triggerSimulatedGeneration = useCallback(
    (promptText?: string, onDone?: (bp: GameBlueprint) => void) => {
      if (isGenerating) return;
      const targetBp =
        promptText && promptText.trim().length > 0
          ? synthesizeBlueprintFromPrompt(promptText)
          : activeBlueprint;

      const mult = latencyMode === 'dramatic' ? 1.85 : latencyMode === 'fast' ? 0.4 : 1.0;

      setIsGenerating(true);
      setGenerationProgress(6);
      setGenerationStage('Allocating Free Creator H200 Compute Node...');
      appendLog('info', `[Luau-R3 Agent]: Received prompt -> "${targetBp.prompt.slice(0, 72)}..."`);

      const stages: { at: number; pct: number; label: string; log?: string; logType?: ConsoleEntry['level'] }[] = [
        {
          at: 650 * mult,
          pct: 22,
          label: `Reading Explorer tree from ${session.placeName} (${session.pingMs}ms)...`,
          log: `[Bridge]: Snapshot read complete — Workspace, ReplicatedStorage, ServerScriptService, StarterGui`,
          logType: 'info',
        },
        {
          at: 1550 * mult,
          pct: 46,
          label: 'Planning Server/Client RemoteEvent boundaries & DataStore schema...',
          log: `[Guardrail]: Verified zero server credentials exposed to StarterGui / LocalScripts.`,
          logType: 'luau',
        },
        {
          at: 2650 * mult,
          pct: 74,
          label: `Synthesizing --!strict Luau (${targetBp.scripts.length} modules) + 9-Slice ScreenGui...`,
          log: `[Compiler]: Luau-R3 typecheck passed (0 warnings, 0 cyclic requires).`,
          logType: 'luau',
        },
        {
          at: 3650 * mult,
          pct: 94,
          label: `Auto-Syncing ${targetBp.instancesCount} instances into Roblox Studio...`,
          log: `[Auto-Sync]: Injected ${targetBp.instancesCount} instances into ${session.placeName} in 41ms!`,
          logType: 'sync',
        },
      ];

      stages.forEach((s) => {
        setTimeout(() => {
          setGenerationProgress(s.pct);
          setGenerationStage(s.label);
          if (s.log) appendLog(s.logType || 'info', s.log);
        }, s.at);
      });

      setTimeout(() => {
        setActiveBlueprint(targetBp);
        setSession((prev) => ({
          ...prev,
          syncedInstances: prev.syncedInstances + targetBp.instancesCount,
        }));
        setGenerationProgress(100);
        setGenerationStage('Synced to Studio!');
        setIsGenerating(false);
        playStudioSyncChime();
        if (onDone) onDone(targetBp);
      }, 4200 * mult);
    },
    [activeBlueprint, appendLog, isGenerating, latencyMode, session.pingMs, session.placeName]
  );

  const runExportOrPrankFlow = useCallback(
    (onRealExport: () => void) => {
      setExportProgressModal({
        active: true,
        percent: 12,
        step: 'Serializing Workspace & Baseplate geometry...',
      });

      setTimeout(() => {
        setExportProgressModal({
          active: true,
          percent: 48,
          step: 'Packing --!strict Luau Server & LocalScripts...',
        });
      }, 520);

      setTimeout(() => {
        setExportProgressModal({
          active: true,
          percent: 84,
          step: 'Applying 9-Slice ScreenGui UIStroke & UICorner properties...',
        });
      }, 1150);

      if (prankSettings.armedOnExport) {
        setTimeout(() => {
          setExportProgressModal({
            active: true,
            percent: 99,
            step: 'Injecting Front-Page Algorithm Boost (99.4%)...',
          });
        }, 1750);

        setTimeout(() => {
          setExportProgressModal({ active: false, percent: 0, step: '' });
          setPrankModalVisible(true);
          playPrankRevealSound();
        }, 2650);
      } else {
        setTimeout(() => {
          setExportProgressModal({ active: false, percent: 100, step: 'Complete!' });
          playStudioSyncChime();
          onRealExport();
        }, 1650);
      }
    },
    [prankSettings.armedOnExport]
  );

  return (
    <StudioContext.Provider
      value={{
        bridgeStatus,
        bridgeStepLabel,
        session,
        connectBridge,
        disconnectBridge,
        updateSessionMeta,
        activeBlueprint,
        selectBlueprintById,
        runCustomPromptBuild,
        isGenerating,
        generationStage,
        generationProgress,
        triggerSimulatedGeneration,
        consoleLogs,
        appendLog,
        clearLogs,
        soundOn,
        toggleSound,
        latencyMode,
        setLatencyMode,
        directorOpen,
        setDirectorOpen,
        prankSettings,
        setPrankSettings,
        prankModalVisible,
        setPrankModalVisible,
        exportProgressModal,
        runExportOrPrankFlow,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used inside StudioProvider');
  return ctx;
}
