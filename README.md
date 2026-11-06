# Baseplate.gg — Roblox AI Studio Agent & 9-Slice GUI Forge

Official web workspace client for **Baseplate.gg** (`v3.4.2-luau-r3`), powered by the Open Luau & Indie Creator Compute Grant.

## Core Capabilities

- **Luau-R3 Agentic Studio (`/studio`)** — Generates `--!strict` server-authoritative Luau systems, `RemoteEvent` hierarchies, and 3D Baseplate prototypes with live mirrored Studio Output Console diagnostics.
- **9-Slice ScreenGui & High-CTR GFX Forge (`/gui-forge`)** — Interactive Roblox `ScreenGui` builder with live `Enum.Font` (`BuilderSans`, `FredokaOne`, `GothamBlack`, `RobotoMono`), `UICorner`, and `UIStroke` inspector controls.
- **BaseplateMCP Bridge (`/mcp`)** — Localhost loopback synchronization (`ws://127.0.0.1:28440/studio-rpc`) for Roblox Studio, Claude Code, and Cursor.
- **Direct `.rbxlx` Place Export** — Client-side XML serializer producing valid Roblox Studio `.rbxlx` place bundles.

## Development

```bash
npm install
npm run dev
npm run build
```
