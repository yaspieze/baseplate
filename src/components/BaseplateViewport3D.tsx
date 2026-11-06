import React, { useRef, useEffect, useState } from 'react';
import { WorldProp } from '../lib/templates';
import { Play, Square, RotateCcw, Eye, Sparkles } from 'lucide-react';
import { playRbxClick, playRbxCoin } from '../lib/sound';

interface Props {
  worldProps: WorldProp[];
  accentHex: string;
  projectTitle: string;
  isGenerating?: boolean;
  onLog?: (msg: string) => void;
}

export const BaseplateViewport3D: React.FC<Props> = ({
  worldProps,
  accentHex,
  projectTitle,
  isGenerating = false,
  onLog,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [yaw, setYaw] = useState(0.68);
  const [pitch, setPitch] = useState(0.56);
  const [zoom, setZoom] = useState(1.0);
  const [isPlaytesting, setIsPlaytesting] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [fps, setFps] = useState(60);

  const dragRef = useRef<{ dragging: boolean; lastX: number; lastY: number }>({
    dragging: false,
    lastX: 0,
    lastY: 0,
  });

  useEffect(() => {
    const fpsTimer = setInterval(() => {
      setFps(59 + Math.round(Math.random() * 1));
    }, 1400);
    return () => clearInterval(fpsTimer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const startClock = performance.now();

    const projectPoint = (
      wx: number,
      wy: number,
      wz: number,
      cx: number,
      cy: number,
      scale: number
    ) => {
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const rx = wx * cosY - wz * sinY;
      const rz = wx * sinY + wz * cosY;

      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const ry = wy * cosP - rz * sinP;
      const depth = wy * sinP + rz * cosP;

      return {
        sx: cx + rx * scale,
        sy: cy - ry * scale,
        depth,
      };
    };

    const shadeHex = (hex: string, factor: number): string => {
      const clean = hex.replace('#', '');
      const full =
        clean.length === 3
          ? clean
              .split('')
              .map((c) => c + c)
              .join('')
          : clean;
      const num = parseInt(full, 16) || 0x3385ff;
      const r = Math.min(255, Math.max(0, Math.round(((num >> 16) & 255) * factor)));
      const g = Math.min(255, Math.max(0, Math.round(((num >> 8) & 255) * factor)));
      const b = Math.min(255, Math.max(0, Math.round((num & 255) * factor)));
      return `rgb(${r}, ${g}, ${b})`;
    };

    const drawBox3D = (
      bx: number,
      by: number,
      bz: number,
      bw: number,
      bh: number,
      bd: number,
      color: string,
      cx: number,
      cy: number,
      scale: number,
      glow?: boolean,
      strokeColor = 'rgba(8,12,20,0.75)'
    ) => {
      const hw = bw / 2;
      const hd = bd / 2;
      const corners = [
        projectPoint(bx - hw, by, bz - hd, cx, cy, scale), // 0 bottom
        projectPoint(bx + hw, by, bz - hd, cx, cy, scale), // 1
        projectPoint(bx + hw, by, bz + hd, cx, cy, scale), // 2
        projectPoint(bx - hw, by, bz + hd, cx, cy, scale), // 3
        projectPoint(bx - hw, by + bh, bz - hd, cx, cy, scale), // 4 top
        projectPoint(bx + hw, by + bh, bz - hd, cx, cy, scale), // 5
        projectPoint(bx + hw, by + bh, bz + hd, cx, cy, scale), // 6
        projectPoint(bx - hw, by + bh, bz + hd, cx, cy, scale), // 7
      ];

      if (glow) {
        const centerBottom = projectPoint(bx, by + 0.05, bz, cx, cy, scale);
        const grad = ctx.createRadialGradient(
          centerBottom.sx,
          centerBottom.sy,
          2,
          centerBottom.sx,
          centerBottom.sy,
          scale * Math.max(bw, bd) * 1.35
        );
        grad.addColorStop(0, `${color}55`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerBottom.sx, centerBottom.sy, scale * Math.max(bw, bd) * 1.35, 0, Math.PI * 2);
        ctx.fill();
      }

      const faces = [
        { idx: [0, 1, 5, 4], shade: 0.72 },
        { idx: [1, 2, 6, 5], shade: 0.84 },
        { idx: [2, 3, 7, 6], shade: 0.68 },
        { idx: [3, 0, 4, 7], shade: 0.78 },
        { idx: [4, 5, 6, 7], shade: 1.12 }, // top face brightest
      ];

      // Painter sort faces of this box
      faces
        .map((f) => ({
          ...f,
          avgDepth: f.idx.reduce((acc, idx) => acc + corners[idx].depth, 0) / 4,
        }))
        .sort((a, b) => a.avgDepth - b.avgDepth)
        .forEach((face) => {
          ctx.beginPath();
          face.idx.forEach((ptIdx, k) => {
            const p = corners[ptIdx];
            if (k === 0) ctx.moveTo(p.sx, p.sy);
            else ctx.lineTo(p.sx, p.sy);
          });
          ctx.closePath();
          ctx.fillStyle = shadeHex(color, face.shade);
          ctx.fill();
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 1.25;
          ctx.stroke();
        });

      return projectPoint(bx, by + bh + 0.45, bz, cx, cy, scale);
    };

    const render = (now: number) => {
      const elapsed = (now - startClock) / 1000;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== Math.floor(rect.width * dpr) || canvas.height !== Math.floor(rect.height * dpr)) {
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
      }
      ctx.save();
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      const cx = w * 0.5;
      const cy = h * 0.57;
      const scale = Math.min(w, h) * 0.056 * zoom;

      // Studio Future Skybox Gradient
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#090E1A');
      sky.addColorStop(0.55, '#111A2E');
      sky.addColorStop(1, '#0A0E17');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Draw 3D Roblox Baseplate Slab (-7..7)
      drawBox3D(0, -0.7, 0, 14, 0.7, 14, '#2A3348', cx, cy, scale, false, '#141A29');

      // Draw Baseplate Grid & Circular Studs
      ctx.strokeStyle = 'rgba(255,255,255,0.065)';
      ctx.lineWidth = 1;
      for (let g = -7; g <= 7; g += 1) {
        const a = projectPoint(g, 0.01, -7, cx, cy, scale);
        const b = projectPoint(g, 0.01, 7, cx, cy, scale);
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();

        const c = projectPoint(-7, 0.01, g, cx, cy, scale);
        const d = projectPoint(7, 0.01, g, cx, cy, scale);
        ctx.beginPath();
        ctx.moveTo(c.sx, c.sy);
        ctx.lineTo(d.sx, d.sy);
        ctx.stroke();
      }

      // Draw authentic circular Roblox Stud bumps on Baseplate
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      for (let gx = -6.5; gx <= 6.5; gx += 1) {
        for (let gz = -6.5; gz <= 6.5; gz += 1) {
          const sp = projectPoint(gx, 0.02, gz, cx, cy, scale);
          ctx.beginPath();
          ctx.ellipse(sp.sx, sp.sy, scale * 0.16, scale * 0.1, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Center Roblox SpawnLocation Pad
      drawBox3D(0, 0, 0, 2.2, 0.16, 2.2, '#475569', cx, cy, scale, false);
      const spawnDecal = projectPoint(0, 0.18, 0, cx, cy, scale);
      ctx.strokeStyle = accentHex;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(spawnDecal.sx, spawnDecal.sy, scale * 0.55, scale * 0.34, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Prepare world props + optional R6 Playtest Character
      type RenderableItem = {
        id: string;
        label: string;
        x: number;
        y: number;
        z: number;
        w: number;
        h: number;
        d: number;
        color: string;
        glow?: boolean;
        depth: number;
        isPlayer?: boolean;
      };

      const renderList: RenderableItem[] = worldProps.map((p, idx) => {
        let py = 0.02;
        if (p.animated === 'float') {
          py = 0.55 + Math.sin(elapsed * 2.6 + idx) * 0.32;
        } else if (p.animated === 'pulse') {
          py = 0.02 + Math.abs(Math.sin(elapsed * 3.0)) * 0.12;
        }
        const proj = projectPoint(p.x, py, p.z, cx, cy, scale);
        return {
          id: p.id,
          label: p.label,
          x: p.x,
          y: py,
          z: p.z,
          w: p.w,
          h: p.h,
          d: p.d,
          color: p.color,
          glow: p.glow,
          depth: proj.depth,
        };
      });

      if (isPlaytesting) {
        const px = Math.cos(elapsed * 1.45) * 3.1;
        const pz = Math.sin(elapsed * 1.45) * 3.1;
        const hop = Math.abs(Math.sin(elapsed * 6.5)) * 0.35;
        const pProj = projectPoint(px, hop, pz, cx, cy, scale);
        renderList.push({
          id: 'r6-avatar',
          label: 'LocalPlayer (R6)',
          x: px,
          y: hop,
          z: pz,
          w: 0.9,
          h: 1.9,
          d: 0.6,
          color: '#00E676',
          glow: true,
          depth: pProj.depth,
          isPlayer: true,
        });
      }

      // Sort back-to-front by camera depth
      renderList.sort((a, b) => a.depth - b.depth);

      renderList.forEach((item) => {
        if (item.isPlayer) {
          // Draw blocky R6 Roblox Character (Legs + Torso + Yellow Head!)
          drawBox3D(item.x, item.y, item.z, 0.75, 0.75, 0.45, '#1D4ED8', cx, cy, scale); // legs
          drawBox3D(item.x, item.y + 0.75, item.z, 0.95, 0.85, 0.5, '#00E676', cx, cy, scale, true); // torso
          const headTop = drawBox3D(item.x, item.y + 1.62, item.z, 0.62, 0.62, 0.62, '#FACC15', cx, cy, scale); // blocky yellow head
          if (showLabels) {
            ctx.font = '700 11px Montserrat, sans-serif';
            ctx.fillStyle = '#00FF88';
            ctx.textAlign = 'center';
            ctx.fillText('▶ Playtest Avatar', headTop.sx, headTop.sy - 4);
          }
        } else {
          const labelPt = drawBox3D(
            item.x,
            item.y,
            item.z,
            item.w,
            item.h,
            item.d,
            item.color,
            cx,
            cy,
            scale,
            item.glow
          );

          if (showLabels) {
            ctx.font = '600 10px "JetBrains Mono", monospace';
            const textW = ctx.measureText(item.label).width + 12;
            ctx.fillStyle = 'rgba(9, 13, 22, 0.82)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(labelPt.sx - textW / 2, labelPt.sy - 14, textW, 18, 5);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#E2E8F0';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, labelPt.sx, labelPt.sy - 2);
          }
        }
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [yaw, pitch, zoom, worldProps, accentHex, isPlaytesting, showLabels]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragRef.current = { dragging: true, lastX: e.clientX, lastY: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
    setYaw((prev) => prev + dx * 0.009);
    setPitch((prev) => Math.max(0.22, Math.min(1.15, prev + dy * 0.007)));
  };

  const handlePointerUp = () => {
    dragRef.current.dragging = false;
  };

  const togglePlaytest = () => {
    playRbxClick();
    setIsPlaytesting((prev) => {
      const next = !prev;
      if (next) {
        playRbxCoin();
        onLog?.(`[Studio PlaySolo]: Spawned LocalPlayer R6 rig into "${projectTitle}" (60.0 FPS)`);
      } else {
        onLog?.('[Studio PlaySolo]: Ended simulation — restored edit-time Explorer state.');
      }
      return next;
    });
  };

  return (
    <div className="relative w-full h-full min-h-[360px] select-none overflow-hidden rounded-xl border-2 border-[#232C43] bg-[#0A0E17]">
      {/* Roblox Studio MicroProfiler + Play Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={togglePlaytest}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider ${
              isPlaytesting ? 'rbx-btn-gold' : 'rbx-btn-green'
            }`}
          >
            {isPlaytesting ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {isPlaytesting ? 'Stop (Shift+F5)' : 'Play Solo (F5)'}
          </button>

          <button
            onClick={() => {
              playRbxClick();
              setShowLabels((s) => !s);
            }}
            className="rbx-btn-dark px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
            title="Toggle Explorer Instance Gizmos"
          >
            <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden sm:inline">{showLabels ? 'Gizmos: ON' : 'Gizmos: OFF'}</span>
          </button>

          <button
            onClick={() => {
              playRbxClick();
              setYaw(0.68);
              setPitch(0.56);
              setZoom(1.0);
            }}
            className="rbx-btn-dark p-1.5 rounded-lg text-xs"
            title="Reset Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
          </button>
        </div>

        {/* Authentic Roblox MicroProfiler Pill */}
        <div className="font-luau text-[11px] bg-[#090D16]/90 border border-[#242F49] px-3 py-1.5 rounded-lg text-slate-300 flex items-center gap-3 backdrop-blur-md">
          <span className="flex items-center gap-1.5 text-[#00E676] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
            {fps}.0 FPS
          </span>
          <span className="text-slate-500">|</span>
          <span>GPU: 2.1ms</span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-[#38BDF8]">Physics: 240Hz</span>
        </div>
      </div>

      {/* Interactive 3D Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={(e) => {
          setZoom((z) => Math.max(0.65, Math.min(1.65, z - e.deltaY * 0.0008)));
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Generating Overlay Shimmer */}
      {isGenerating && (
        <div className="absolute inset-0 bg-[#080B12]/70 backdrop-blur-xs flex flex-col items-center justify-center z-20 p-6 text-center">
          <div className="rbx-frame px-6 py-5 rounded-2xl max-w-md flex flex-col items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#00E676]/15 border border-[#00E676]/50 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#00E676] animate-spin" />
            </div>
            <p className="font-bold text-base text-white">Rebuilding 3D Baseplate Instances...</p>
            <p className="font-luau text-xs text-[#00E676]">Injecting CFrames, PointLights & SpawnLocations</p>
          </div>
        </div>
      )}

      {/* Bottom Viewport Help */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-400 pointer-events-none">
        <span className="bg-[#090D16]/80 border border-white/10 px-2.5 py-1 rounded-md">
          Drag to Orbit 3D Baseplate • Scroll to Zoom
        </span>
        <span className="font-luau bg-[#090D16]/80 border border-white/10 px-2.5 py-1 rounded-md text-slate-300">
          Lighting.Technology = Enum.Technology.Future
        </span>
      </div>
    </div>
  );
};
