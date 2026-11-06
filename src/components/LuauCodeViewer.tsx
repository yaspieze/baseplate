import React, { useState, useEffect } from 'react';
import { LuauScriptFile } from '../lib/templates';
import { Check, Copy, FileCode2, Shield } from 'lucide-react';
import { playRbxClick } from '../lib/sound';

interface Props {
  scripts: LuauScriptFile[];
  streamEffect?: boolean;
}

function highlightLuauLine(line: string): React.ReactNode {
  if (line.trimStart().startsWith('--')) {
    return <span className="text-[#6E80A3] italic">{line}</span>;
  }

  // Split comments at end of line
  const commentIdx = line.indexOf('--');
  const codePart = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
  const commentPart = commentIdx >= 0 ? line.slice(commentIdx) : '';

  const tokenRegex =
    /("[^"]*"|\b(?:local|function|return|end|if|then|else|elseif|for|in|do|while|not|and|or|export|type|true|false|nil)\b|\b(?:game|workspace|script|Instance|Vector3|CFrame|Color3|UDim2|TweenInfo|Enum|math|table|os|pcall|tostring|print|require|RaycastParams)\b|\b\d+(?:\.\d+)?\b)/g;

  const parts = codePart.split(tokenRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (part.startsWith('"')) {
          return (
            <span key={i} className="text-[#85E89D]">
              {part}
            </span>
          );
        }
        if (
          /^(local|function|return|end|if|then|else|elseif|for|in|do|while|not|and|or|export|type|true|false|nil)$/.test(
            part
          )
        ) {
          return (
            <span key={i} className="text-[#FF7B89] font-semibold">
              {part}
            </span>
          );
        }
        if (
          /^(game|workspace|script|Instance|Vector3|CFrame|Color3|UDim2|TweenInfo|Enum|math|table|os|pcall|tostring|print|require|RaycastParams)$/.test(
            part
          )
        ) {
          return (
            <span key={i} className="text-[#56D4FF]">
              {part}
            </span>
          );
        }
        if (/^\d+(\.\d+)?$/.test(part)) {
          return (
            <span key={i} className="text-[#F8C555]">
              {part}
            </span>
          );
        }
        return (
          <span key={i} className="text-[#E6EDF7]">
            {part}
          </span>
        );
      })}
      {commentPart && <span className="text-[#6E80A3] italic">{commentPart}</span>}
    </>
  );
}

export const LuauCodeViewer: React.FC<Props> = ({ scripts, streamEffect = false }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [visibleChars, setVisibleChars] = useState<number>(99999);

  const currentScript = scripts[activeIdx] || scripts[0];

  useEffect(() => {
    setActiveIdx(0);
  }, [scripts]);

  useEffect(() => {
    if (!streamEffect) {
      setVisibleChars(99999);
      return;
    }
    setVisibleChars(40);
    const total = currentScript.code.length;
    const timer = setInterval(() => {
      setVisibleChars((prev) => {
        if (prev >= total) {
          clearInterval(timer);
          return total;
        }
        return prev + 28;
      });
    }, 18);
    return () => clearInterval(timer);
  }, [currentScript.code, streamEffect]);

  const displayedText = currentScript.code.slice(0, visibleChars);
  const lines = displayedText.split('\n');

  const copyCode = () => {
    playRbxClick();
    navigator.clipboard.writeText(currentScript.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-col h-full min-h-[380px] rounded-xl border-2 border-[#232C43] bg-[#0B0F19] overflow-hidden">
      {/* Studio Script Tabs */}
      <div className="flex items-center justify-between gap-2 bg-[#111726] border-b border-[#222B42] px-2 pt-1.5">
        <div className="flex items-center gap-1 overflow-x-auto">
          {scripts.map((s, idx) => {
            const active = idx === activeIdx;
            const badgeColor =
              s.type === 'Server'
                ? 'text-[#00E676]'
                : s.type === 'Client'
                  ? 'text-[#38BDF8]'
                  : 'text-[#FBBF24]';
            return (
              <button
                key={s.id}
                onClick={() => {
                  playRbxClick();
                  setActiveIdx(idx);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-t-lg text-xs font-luau border-t border-x transition ${
                  active
                    ? 'bg-[#0B0F19] border-[#2A3552] text-white font-semibold'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode2 className={`w-3.5 h-3.5 ${badgeColor}`} />
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 pb-1.5 pr-1 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-luau px-2 py-0.5 rounded bg-[#00E676]/12 text-[#00E676] border border-[#00E676]/30">
            <Shield className="w-3 h-3" /> --!strict
          </span>
          <button
            onClick={copyCode}
            className="rbx-btn-dark px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00E676]" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Luau'}
          </button>
        </div>
      </div>

      {/* Studio Explorer Path Breadcrumb */}
      <div className="px-4 py-1.5 bg-[#0E1320] border-b border-white/6 text-[11px] font-luau text-slate-400 flex items-center justify-between">
        <span>game.{currentScript.path.replace(/\//g, '.')}</span>
        <span className="text-[#38BDF8]">Luau-R3 • 0 Type Errors</span>
      </div>

      {/* Code Lines */}
      <div className="flex-1 overflow-auto p-3 font-luau text-xs leading-relaxed">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-white/[0.03]">
                <td className="select-none pr-4 text-right text-[#465370] w-9 align-top">
                  {idx + 1}
                </td>
                <td className="whitespace-pre font-luau">{highlightLuauLine(line)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
