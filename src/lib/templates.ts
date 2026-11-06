export type RbxClass =
  | 'Workspace'
  | 'ReplicatedStorage'
  | 'ServerScriptService'
  | 'StarterGui'
  | 'StarterPack'
  | 'Lighting'
  | 'Folder'
  | 'Model'
  | 'Part'
  | 'SpawnLocation'
  | 'Script'
  | 'LocalScript'
  | 'ModuleScript'
  | 'RemoteEvent'
  | 'ScreenGui'
  | 'Frame'
  | 'TextButton'
  | 'UICorner'
  | 'UIStroke';

export interface ExplorerNode {
  id: string;
  name: string;
  className: RbxClass;
  isNew?: boolean;
  children?: ExplorerNode[];
}

export interface LuauScriptFile {
  id: string;
  name: string;
  path: string;
  type: 'Server' | 'Client' | 'Module';
  code: string;
}

export interface WorldProp {
  id: string;
  label: string;
  x: number; // -6 to 6 grid units
  z: number; // -6 to 6 grid units
  w: number;
  h: number;
  d: number;
  color: string;
  glow?: boolean;
  animated?: 'float' | 'spin' | 'pulse';
}

export interface GuiShopItem {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  price: number;
  statBoost: string;
  accent: string;
  emoji: string;
}

export interface GameBlueprint {
  id: string;
  title: string;
  genre: string;
  badge: string;
  image: string;
  creator: string;
  plays: string;
  instancesCount: number;
  prompt: string;
  accentHex: string;
  guiTheme: 'neon-cyber' | 'simulator-gold' | 'tactical-crimson' | 'emerald-tycoon' | 'survival-night' | 'obby- vibrant';
  guiTitle: string;
  currencyName: string;
  startingCurrency: number;
  actionButtonLabel: string;
  guiItems: GuiShopItem[];
  worldProps: WorldProp[];
  explorer: ExplorerNode[];
  scripts: LuauScriptFile[];
}

export const GAME_BLUEPRINTS: GameBlueprint[] = [
  {
    id: 'blade-arena',
    title: 'Cyber Katana Deflect Arena',
    genre: 'Blade Dodge PvP',
    badge: 'REAL-GAME • 60 FPS',
    image: 'gfx/blade-arena.jpg',
    creator: '@KairoLabs',
    plays: '1.8M+ visits',
    instancesCount: 24,
    prompt: 'Build a competitive Blade Ball deflect arena with homing plasma orb physics, parry cooldowns, katana skin shop GUI, and win streak leaderboards.',
    accentHex: '#00E676',
    guiTheme: 'neon-cyber',
    guiTitle: 'KATANA CRATE & ABILITIES',
    currencyName: 'Parry Coins',
    startingCurrency: 2450,
    actionButtonLabel: '+250 Test Parry Kill',
    guiItems: [
      { id: 'k1', name: 'Cyan Void Katana', rarity: 'Legendary', price: 800, statBoost: '+18% Deflect Curve', accent: '#00F0FF', emoji: '⚔️' },
      { id: 'k2', name: 'Crimson Ronin Edge', rarity: 'Mythic', price: 1600, statBoost: '2x Dash Reset', accent: '#FF2E54', emoji: '🗡️' },
      { id: 'k3', name: 'Rapture Blink Step', rarity: 'Epic', price: 550, statBoost: '0.4s Invulnerability', accent: '#A855F7', emoji: '⚡' },
      { id: 'k4', name: 'Overdrive Time Freeze', rarity: 'Mythic', price: 2200, statBoost: '3.0s Arena Freeze', accent: '#FFB800', emoji: '❄️' },
    ],
    worldProps: [
      { id: 'p1', label: 'DeflectCoreOrb', x: 0, z: 0, w: 1.6, h: 1.6, d: 1.6, color: '#00F0FF', glow: true, animated: 'float' },
      { id: 'p2', label: 'BlueSamuraiSpawn', x: -4, z: 0, w: 2.2, h: 0.4, d: 2.2, color: '#00B8FF', glow: true },
      { id: 'p3', label: 'CrimsonSpawnPad', x: 4, z: 0, w: 2.2, h: 0.4, d: 2.2, color: '#FF2E54', glow: true },
      { id: 'p4', label: 'ArenaPillar_NW', x: -4.5, z: -4.5, w: 1.2, h: 4.2, d: 1.2, color: '#1E293B' },
      { id: 'p5', label: 'ArenaPillar_NE', x: 4.5, z: -4.5, w: 1.2, h: 4.2, d: 1.2, color: '#1E293B' },
      { id: 'p6', label: 'ArenaPillar_SW', x: -4.5, z: 4.5, w: 1.2, h: 4.2, d: 1.2, color: '#1E293B' },
      { id: 'p7', label: 'ArenaPillar_SE', x: 4.5, z: 4.5, w: 1.2, h: 4.2, d: 1.2, color: '#1E293B' },
    ],
    explorer: [
      {
        id: 'ws',
        name: 'Workspace',
        className: 'Workspace',
        children: [
          { id: 'ws-bp', name: 'CyberArenaBaseplate', className: 'Part', isNew: true },
          { id: 'ws-orb', name: 'HomingPlasmaSphere', className: 'Part', isNew: true },
          { id: 'ws-spawns', name: 'ArenaSpawns', className: 'Folder', isNew: true },
        ],
      },
      {
        id: 'rs',
        name: 'ReplicatedStorage',
        className: 'ReplicatedStorage',
        children: [
          {
            id: 'rs-rem',
            name: 'CombatRemotes',
            className: 'Folder',
            isNew: true,
            children: [
              { id: 'rs-r1', name: 'RequestParry', className: 'RemoteEvent', isNew: true },
              { id: 'rs-r2', name: 'SyncOrbTarget', className: 'RemoteEvent', isNew: true },
              { id: 'rs-r3', name: 'PurchaseAbility', className: 'RemoteEvent', isNew: true },
            ],
          },
          { id: 'rs-cfg', name: 'DeflectPhysicsConfig', className: 'ModuleScript', isNew: true },
        ],
      },
      {
        id: 'sss',
        name: 'ServerScriptService',
        className: 'ServerScriptService',
        children: [
          { id: 'sss-main', name: 'OrbHomingServer.server', className: 'Script', isNew: true },
          { id: 'sss-data', name: 'StreakDataStore.server', className: 'Script', isNew: true },
        ],
      },
      {
        id: 'sg',
        name: 'StarterGui',
        className: 'StarterGui',
        children: [
          {
            id: 'sg-hud',
            name: 'KatanaShopScreenGui',
            className: 'ScreenGui',
            isNew: true,
            children: [
              { id: 'sg-f', name: 'MainFrame', className: 'Frame', isNew: true },
              { id: 'sg-c', name: 'UICorner', className: 'UICorner', isNew: true },
              { id: 'sg-s', name: 'UIStroke', className: 'UIStroke', isNew: true },
              { id: 'sg-cli', name: 'ParryClientController.client', className: 'LocalScript', isNew: true },
            ],
          },
        ],
      },
    ],
    scripts: [
      {
        id: 'srv',
        name: 'OrbHomingServer.server.luau',
        path: 'ServerScriptService/OrbHomingServer.server.luau',
        type: 'Server',
        code: `--!strict
-- Generated by Baseplate.gg Luau-R3 Engine • Auto-Synced via Localhost:28440
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Remotes = ReplicatedStorage:WaitForChild("CombatRemotes")
local RequestParry = Remotes:WaitForChild("RequestParry") :: RemoteEvent
local SyncOrbTarget = Remotes:WaitForChild("SyncOrbTarget") :: RemoteEvent
local Config = require(ReplicatedStorage:WaitForChild("DeflectPhysicsConfig"))

local orbPart: BasePart = workspace:WaitForChild("HomingPlasmaSphere") :: BasePart
local currentTarget: Player? = nil
local currentSpeed: number = Config.BaseOrbSpeed
local parryWindowByUserId: { [number]: number } = {}

local function pickNearestAliveTarget(exclude: Player?): Player?
	local bestPlayer: Player? = nil
	local shortestDist = math.huge
	for _, player in Players:GetPlayers() do
		if player ~= exclude and player.Character then
			local root = player.Character:FindFirstChild("HumanoidRootPart") :: BasePart?
			local hum = player.Character:FindFirstChildOfClass("Humanoid")
			if root and hum and hum.Health > 0 then
				local dist = (root.Position - orbPart.Position).Magnitude
				if dist < shortestDist then
					shortestDist = dist
					bestPlayer = player
				end
			end
		end
	end
	return bestPlayer
end

RequestParry.OnServerEvent:Connect(function(player: Player, lookVector: Vector3)
	local now = workspace:GetServerTimeNow()
	local lastAttempt = parryWindowByUserId[player.UserId] or 0
	if (now - lastAttempt) < Config.ParryCooldown then
		return -- Server-authoritative cooldown guard
	end
	parryWindowByUserId[player.UserId] = now

	if currentTarget == player and player.Character then
		local root = player.Character:FindFirstChild("HumanoidRootPart") :: BasePart?
		if root and (root.Position - orbPart.Position).Magnitude <= Config.MaxParryRadius then
			currentSpeed = math.min(currentSpeed * Config.AccelerationFactor, Config.MaxOrbSpeed)
			currentTarget = pickNearestAliveTarget(player)
			orbPart.AssemblyLinearVelocity = lookVector.Unit * currentSpeed
			SyncOrbTarget:FireAllClients(currentTarget, currentSpeed, true)
		end
	end
end)

RunService.Heartbeat:Connect(function(dt: number)
	if not currentTarget or not currentTarget.Parent then
		currentTarget = pickNearestAliveTarget(nil)
		if currentTarget then
			SyncOrbTarget:FireAllClients(currentTarget, currentSpeed, false)
		end
		return
	end
	local char = currentTarget.Character
	local root = char and char:FindFirstChild("HumanoidRootPart") :: BasePart?
	if root then
		local desiredDir = (root.Position - orbPart.Position).Unit
		orbPart.CFrame = CFrame.new(orbPart.Position + desiredDir * currentSpeed * dt)
	end
end)`,
      },
      {
        id: 'cli',
        name: 'ParryClientController.client.luau',
        path: 'StarterGui/KatanaShopScreenGui/ParryClientController.client.luau',
        type: 'Client',
        code: `--!strict
local UserInputService = game:GetService("UserInputService")
local TweenService = game:GetService("TweenService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Camera = workspace.CurrentCamera

local Remotes = ReplicatedStorage:WaitForChild("CombatRemotes")
local RequestParry = Remotes:WaitForChild("RequestParry") :: RemoteEvent
local SyncOrbTarget = Remotes:WaitForChild("SyncOrbTarget") :: RemoteEvent

local gui = script.Parent :: ScreenGui
local mainFrame = gui:WaitForChild("MainFrame") :: Frame

local function triggerParryInput()
	local lookVec = Camera and Camera.CFrame.LookVector or Vector3.new(0, 0, -1)
	RequestParry:FireServer(lookVec)
	TweenService:Create(Camera, TweenInfo.new(0.09, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, true), {
		FieldOfView = 76
	}):Play()
end

UserInputService.InputBegan:Connect(function(input: InputObject, processed: boolean)
	if processed then return end
	if input.KeyCode == Enum.KeyCode.F or input.UserInputType == Enum.UserInputType.MouseButton1 then
		triggerParryInput()
	end
end)

SyncOrbTarget.OnClientEvent:Connect(function(targetPlayer: Player?, speed: number, wasDeflected: boolean)
	if wasDeflected then
		mainFrame.UIStroke.Color = Color3.fromRGB(0, 240, 255)
	end
end)`,
      },
      {
        id: 'mod',
        name: 'DeflectPhysicsConfig.luau',
        path: 'ReplicatedStorage/DeflectPhysicsConfig.luau',
        type: 'Module',
        code: `--!strict
export type PhysicsSettings = {
	BaseOrbSpeed: number,
	MaxOrbSpeed: number,
	AccelerationFactor: number,
	ParryCooldown: number,
	MaxParryRadius: number,
}

local DeflectPhysicsConfig: PhysicsSettings = table.freeze({
	BaseOrbSpeed = 48,
	MaxOrbSpeed = 340,
	AccelerationFactor = 1.14,
	ParryCooldown = 0.48,
	MaxParryRadius = 18.5,
})

return DeflectPhysicsConfig`,
      },
    ],
  },
  {
    id: 'pet-tycoon',
    title: 'Sky Island Pet Odyssey',
    genre: 'Pet Simulator & Egg RNG',
    badge: 'HIGH-CTR GUI + DATASTORE',
    image: 'gfx/pet-tycoon.jpg',
    creator: '@BloxMint',
    plays: '4.2M+ visits',
    instancesCount: 31,
    prompt: 'Create a colorful Pet Simulator with weighted triple egg hatching, floating cube pets that orbit the player, 9-slice Pet Inventory GUI, and DataStore saving.',
    accentHex: '#FFB800',
    guiTheme: 'simulator-gold',
    guiTitle: 'MYTHIC PET INVENTORY',
    currencyName: 'Star Gems',
    startingCurrency: 8500,
    actionButtonLabel: '+1,000 Collect Rainbow Fountain',
    guiItems: [
      { id: 'pt1', name: 'Solar Golden Dragon', rarity: 'Mythic', price: 3200, statBoost: 'x45 Coin Multiplier', accent: '#FFB800', emoji: '🐉' },
      { id: 'pt2', name: 'Crystal Frost Kitsune', rarity: 'Legendary', price: 1850, statBoost: 'x24 Gem Magnet', accent: '#38BDF8', emoji: '🦊' },
      { id: 'pt3', name: 'Rainbow Star Slime', rarity: 'Epic', price: 650, statBoost: 'x9 Hatch Luck', accent: '#EC4899', emoji: '🌈' },
      { id: 'pt4', name: 'Triple Auto-Hatch Pass', rarity: 'Legendary', price: 2400, statBoost: '3x Instant Open', accent: '#00E676', emoji: '🥚' },
    ],
    worldProps: [
      { id: 'pt-f', label: 'RainbowGemFountain', x: 0, z: -1, w: 2.6, h: 2.4, d: 2.6, color: '#FFB800', glow: true, animated: 'pulse' },
      { id: 'pt-e1', label: 'MythicEggPedestal_1', x: -3.5, z: 2, w: 1.4, h: 1.8, d: 1.4, color: '#38BDF8', glow: true, animated: 'float' },
      { id: 'pt-e2', label: 'SolarEggPedestal_2', x: 0, z: 3, w: 1.4, h: 1.8, d: 1.4, color: '#F59E0B', glow: true, animated: 'float' },
      { id: 'pt-e3', label: 'VoidEggPedestal_3', x: 3.5, z: 2, w: 1.4, h: 1.8, d: 1.4, color: '#EC4899', glow: true, animated: 'float' },
      { id: 'pt-path', label: 'StudRainbowBridge', x: 0, z: -4.2, w: 5.5, h: 0.35, d: 1.8, color: '#22C55E' },
    ],
    explorer: [
      {
        id: 'ws2',
        name: 'Workspace',
        className: 'Workspace',
        children: [
          { id: 'ws2-f', name: 'RainbowCoinFountain', className: 'Model', isNew: true },
          { id: 'ws2-eggs', name: 'EggCapsules', className: 'Folder', isNew: true },
          { id: 'ws2-pets', name: 'ActivePlayerPets', className: 'Folder', isNew: true },
        ],
      },
      {
        id: 'rs2',
        name: 'ReplicatedStorage',
        className: 'ReplicatedStorage',
        children: [
          { id: 'rs2-rem', name: 'HatchEggFunction', className: 'RemoteEvent', isNew: true },
          { id: 'rs2-tbl', name: 'PetRarityWeights', className: 'ModuleScript', isNew: true },
        ],
      },
      {
        id: 'sss2',
        name: 'ServerScriptService',
        className: 'ServerScriptService',
        children: [
          { id: 'sss2-h', name: 'PetOrbitAndHatch.server', className: 'Script', isNew: true },
        ],
      },
      {
        id: 'sg2',
        name: 'StarterGui',
        className: 'StarterGui',
        children: [
          { id: 'sg2-inv', name: 'PetInventoryGui', className: 'ScreenGui', isNew: true },
        ],
      },
    ],
    scripts: [
      {
        id: 'srv2',
        name: 'PetOrbitAndHatch.server.luau',
        path: 'ServerScriptService/PetOrbitAndHatch.server.luau',
        type: 'Server',
        code: `--!strict
-- Generated by Baseplate.gg Luau-R3 Engine • Session Save + Weighted RNG
local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local PetStore = DataStoreService:GetDataStore("Baseplate_PetOdyssey_v3")
local HatchRemote = ReplicatedStorage:WaitForChild("HatchEggFunction") :: RemoteEvent
local RarityTable = require(ReplicatedStorage:WaitForChild("PetRarityWeights"))

local profiles: { [number]: { Gems: number, EquippedPets: { string } } } = {}

local function rollWeightedPet(luckMultiplier: number): string
	local totalWeight = 0
	for _, entry in RarityTable.Pool do
		totalWeight += entry.Weight * (entry.IsRare and luckMultiplier or 1)
	end
	local roll = math.random() * totalWeight
	local cursor = 0
	for _, entry in RarityTable.Pool do
		cursor += entry.Weight * (entry.IsRare and luckMultiplier or 1)
		if roll <= cursor then
			return entry.PetId
		end
	end
	return RarityTable.Pool[1].PetId
end

Players.PlayerAdded:Connect(function(player: Player)
	local ok, saved = pcall(function()
		return PetStore:GetAsync("u_" .. tostring(player.UserId))
	end)
	profiles[player.UserId] = (ok and saved) or { Gems = 8500, EquippedPets = { "RainbowSlime" } }
end)

HatchRemote.OnServerEvent:Connect(function(player: Player, eggTier: string)
	local profile = profiles[player.UserId]
	if not profile or profile.Gems < RarityTable.EggCost then return end
	profile.Gems -= RarityTable.EggCost
	local wonPet = rollWeightedPet(1.5)
	table.insert(profile.EquippedPets, wonPet)
	HatchRemote:FireClient(player, wonPet, profile.Gems)
end)`,
      },
      {
        id: 'cli2',
        name: 'PetFollowClient.client.luau',
        path: 'StarterGui/PetInventoryGui/PetFollowClient.client.luau',
        type: 'Client',
        code: `--!strict
local RunService = game:GetService("RunService")
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer

-- Smooth spring-interpolated circular pet orbit around HumanoidRootPart
RunService.RenderStepped:Connect(function()
	local char = LocalPlayer.Character
	local root = char and char:FindFirstChild("HumanoidRootPart") :: BasePart?
	local folder = workspace:FindFirstChild("ActivePlayerPets")
	if not root or not folder then return end

	local myPets = folder:GetChildren()
	local t = os.clock()
	for i, petModel in myPets do
		if petModel:IsA("BasePart") then
			local angle = (i / math.max(#myPets, 1)) * math.pi * 2 + t * 1.4
			local bob = math.sin(t * 3.5 + i) * 0.65
			local targetPos = root.Position + Vector3.new(math.cos(angle) * 5.2, 1.5 + bob, math.sin(angle) * 5.2)
			petModel.CFrame = petModel.CFrame:Lerp(CFrame.lookAt(targetPos, root.Position), 0.14)
		end
	end
end)`,
      },
      {
        id: 'mod2',
        name: 'PetRarityWeights.luau',
        path: 'ReplicatedStorage/PetRarityWeights.luau',
        type: 'Module',
        code: `--!strict
return table.freeze({
	EggCost = 650,
	Pool = {
		{ PetId = "RainbowStarSlime", Weight = 68.0, IsRare = false },
		{ PetId = "CrystalFrostKitsune", Weight = 26.5, IsRare = true },
		{ PetId = "SolarGoldenDragon", Weight = 5.5, IsRare = true },
	},
})`,
      },
    ],
  },
  {
    id: 'tactical-rivals',
    title: 'Bloxy Cargo Rivals 5v5',
    genre: 'Tactical Arena FPS',
    badge: 'RAYCAST HITREG • ZERO LAG',
    image: 'gfx/tactical-rivals.jpg',
    creator: '@ValkyrieRBX',
    plays: '3.1M+ visits',
    instancesCount: 29,
    prompt: 'Make a fast-paced 5v5 container yard shooter like Rivals with server-verified raycast hit detection, recoil spring viewmodels, killstreak banners, and weapon loadout GUI.',
    accentHex: '#3385FF',
    guiTheme: 'tactical-crimson',
    guiTitle: 'TACTICAL LOADOUT ARMORY',
    currencyName: 'Valor Credits',
    startingCurrency: 4200,
    actionButtonLabel: '+400 Round MVP Bonus',
    guiItems: [
      { id: 'rv1', name: 'Solar Pulse Rifle', rarity: 'Legendary', price: 1450, statBoost: '780 RPM • Laser Sight', accent: '#FF6B2B', emoji: '🔫' },
      { id: 'rv2', name: 'Phantom Blink Knife', rarity: 'Mythic', price: 2100, statBoost: '+14% Sprint Speed', accent: '#3385FF', emoji: '🔪' },
      { id: 'rv3', name: 'Kinetic Jump Pad', rarity: 'Epic', price: 700, statBoost: 'Vertical Container Boost', accent: '#00E676', emoji: '🚀' },
      { id: 'rv4', name: 'Med-Stim Syringe', rarity: 'Rare', price: 450, statBoost: '+65 Instant HP', accent: '#F43F5E', emoji: '💉' },
    ],
    worldProps: [
      { id: 'rv-c1', label: 'BlueCargoContainer', x: -2.8, z: -1.5, w: 2.0, h: 2.5, d: 4.4, color: '#2563EB' },
      { id: 'rv-c2', label: 'OrangeCargoContainer', x: 2.8, z: 1.5, w: 2.0, h: 2.5, d: 4.4, color: '#EA580C' },
      { id: 'rv-c3', label: 'MidCoverCrate', x: 0, z: 0, w: 1.6, h: 1.3, d: 1.6, color: '#EAB308' },
      { id: 'rv-s1', label: 'TeamAlphaSpawn', x: -4.8, z: 4.2, w: 2.0, h: 0.3, d: 2.0, color: '#38BDF8', glow: true },
      { id: 'rv-s2', label: 'TeamBravoSpawn', x: 4.8, z: -4.2, w: 2.0, h: 0.3, d: 2.0, color: '#F43F5E', glow: true },
    ],
    explorer: [
      {
        id: 'ws3',
        name: 'Workspace',
        className: 'Workspace',
        children: [
          { id: 'ws3-m', name: 'BloxyCargoYard', className: 'Model', isNew: true },
          { id: 'ws3-h', name: 'HitboxIgnoreFolder', className: 'Folder', isNew: true },
        ],
      },
      {
        id: 'sss3',
        name: 'ServerScriptService',
        className: 'ServerScriptService',
        children: [
          { id: 'sss3-ray', name: 'LagCompensatedRaycast.server', className: 'Script', isNew: true },
        ],
      },
      {
        id: 'sg3',
        name: 'StarterGui',
        className: 'StarterGui',
        children: [
          { id: 'sg3-hud', name: 'RivalsLoadoutHUD', className: 'ScreenGui', isNew: true },
        ],
      },
    ],
    scripts: [
      {
        id: 'srv3',
        name: 'LagCompensatedRaycast.server.luau',
        path: 'ServerScriptService/LagCompensatedRaycast.server.luau',
        type: 'Server',
        code: `--!strict
-- Server-verified Raycast weapon validator with headshot multiplier
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local FireWeapon = ReplicatedStorage:WaitForChild("FireWeapon") :: RemoteEvent

FireWeapon.OnServerEvent:Connect(function(shooter: Player, origin: Vector3, direction: Vector3)
	local char = shooter.Character
	local head = char and char:FindFirstChild("Head") :: BasePart?
	if not head or (head.Position - origin).Magnitude > 9.5 then
		return -- Reject spoofed origin positions
	end

	local params = RaycastParams.new()
	params.FilterType = Enum.RaycastFilterType.Exclude
	params.FilterDescendantsInstances = { char }

	local result = workspace:Raycast(origin, direction.Unit * 350, params)
	if result and result.Instance then
		local enemyModel = result.Instance:FindFirstAncestorOfClass("Model")
		local hum = enemyModel and enemyModel:FindFirstChildOfClass("Humanoid")
		if hum and hum.Health > 0 then
			local dmg = (result.Instance.Name == "Head") and 54 or 22
			hum:TakeDamage(dmg)
			FireWeapon:FireClient(shooter, result.Position, result.Instance.Name == "Head", dmg)
		end
	end
end)`,
      },
      {
        id: 'cli3',
        name: 'SpringViewmodel.client.luau',
        path: 'StarterGui/RivalsLoadoutHUD/SpringViewmodel.client.luau',
        type: 'Client',
        code: `--!strict
local UserInputService = game:GetService("UserInputService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Camera = workspace.CurrentCamera
local FireWeapon = ReplicatedStorage:WaitForChild("FireWeapon") :: RemoteEvent

UserInputService.InputBegan:Connect(function(input, gpe)
	if gpe then return end
	if input.UserInputType == Enum.UserInputType.MouseButton1 and Camera then
		FireWeapon:FireServer(Camera.CFrame.Position, Camera.CFrame.LookVector)
	end
end)`,
      },
      {
        id: 'mod3',
        name: 'WeaponStats.luau',
        path: 'ReplicatedStorage/WeaponStats.luau',
        type: 'Module',
        code: `--!strict
return table.freeze({
	SolarPulseRifle = { FireRate = 0.085, Spread = 0.012, MagSize = 30 },
	PhantomKnife = { MeleeDamage = 75, DashBoost = 1.14 },
})`,
      },
    ],
  },
  {
    id: 'desert-tycoon',
    title: 'Emerald Oasis Factory Tycoon',
    genre: 'Automation Tycoon',
    badge: 'CONVEYOR + REBIRTHS',
    image: 'gfx/desert-tycoon.jpg',
    creator: '@StudFoundry',
    plays: '2.7M+ visits',
    instancesCount: 27,
    prompt: 'Build an automated Emerald Oasis Factory Tycoon with glowing ore droppers, upgraders, step-on purchase buttons, rebirth multipliers, and cash HUD.',
    accentHex: '#10B981',
    guiTheme: 'emerald-tycoon',
    guiTitle: 'FACTORY UPGRADE TERMINAL',
    currencyName: 'Emerald Cash',
    startingCurrency: 15000,
    actionButtonLabel: '+2,500 Sell Refined Ore',
    guiItems: [
      { id: 'ty1', name: 'Quantum Emerald Dropper', rarity: 'Legendary', price: 4500, statBoost: '+$850/sec Ore Rate', accent: '#10B981', emoji: '🏭' },
      { id: 'ty2', name: 'Plasma Conveyor Upgrader', rarity: 'Epic', price: 2800, statBoost: '3.5x Ore Value', accent: '#06B6D4', emoji: '⚡' },
      { id: 'ty3', name: 'Auto-Collector Drone', rarity: 'Rare', price: 1200, statBoost: 'Zero Overflow Loss', accent: '#F59E0B', emoji: '🤖' },
      { id: 'ty4', name: 'Oasis Rebirth Tier II', rarity: 'Mythic', price: 12000, statBoost: 'Permanent 5x Income', accent: '#A855F7', emoji: '♻️' },
    ],
    worldProps: [
      { id: 'ty-c', label: 'EmeraldConveyorLine', x: 0, z: 0, w: 5.8, h: 0.45, d: 1.3, color: '#10B981', glow: true },
      { id: 'ty-d1', label: 'DropperTower_Mk1', x: -2.4, z: -1.1, w: 1.3, h: 2.6, d: 1.3, color: '#2563EB' },
      { id: 'ty-u1', label: 'LaserUpgraderGate', x: 0.4, z: 0, w: 0.8, h: 2.0, d: 1.8, color: '#00F582', glow: true, animated: 'pulse' },
      { id: 'ty-f', label: 'RefineryCollector', x: 3.3, z: 0, w: 2.0, h: 2.8, d: 2.2, color: '#F59E0B', glow: true },
    ],
    explorer: [
      {
        id: 'ws4',
        name: 'Workspace',
        className: 'Workspace',
        children: [
          { id: 'ws4-t', name: 'TycoonPlots', className: 'Folder', isNew: true },
        ],
      },
      {
        id: 'sss4',
        name: 'ServerScriptService',
        className: 'ServerScriptService',
        children: [
          { id: 'sss4-t', name: 'TycoonPlotManager.server', className: 'Script', isNew: true },
        ],
      },
      {
        id: 'sg4',
        name: 'StarterGui',
        className: 'StarterGui',
        children: [
          { id: 'sg4-hud', name: 'TycoonManagerGui', className: 'ScreenGui', isNew: true },
        ],
      },
    ],
    scripts: [
      {
        id: 'srv4',
        name: 'TycoonPlotManager.server.luau',
        path: 'ServerScriptService/TycoonPlotManager.server.luau',
        type: 'Server',
        code: `--!strict
local CollectionService = game:GetService("CollectionService")

for _, conveyor in CollectionService:GetTagged("TycoonConveyor") do
	if conveyor:IsA("BasePart") then
		conveyor.AssemblyLinearVelocity = conveyor.CFrame.LookVector * 18
	end
end`,
      },
      {
        id: 'cli4',
        name: 'TycoonCashCounter.client.luau',
        path: 'StarterGui/TycoonManagerGui/TycoonCashCounter.client.luau',
        type: 'Client',
        code: `--!strict
local TweenService = game:GetService("TweenService")
print("[Baseplate Auto-Sync]: Tycoon animated number ticker active.")`,
      },
      {
        id: 'mod4',
        name: 'RebirthFormula.luau',
        path: 'ReplicatedStorage/RebirthFormula.luau',
        type: 'Module',
        code: `--!strict
return function(rebirthCount: number): number
	return math.floor(10000 * (2.35 ^ rebirthCount))
end`,
      },
    ],
  },
  {
    id: 'horror-survival',
    title: '99 Nights: Pine Cabin',
    genre: 'Co-op Horror Survival',
    badge: 'FUTURE LIGHTING + AI',
    image: 'gfx/horror-survival.jpg',
    creator: '@NocturneDev',
    plays: '5.6M+ visits',
    instancesCount: 33,
    prompt: 'Create a 99 Nights snowy forest survival game with campfire warmth decay, battery flashlight system, night creature pathfinding AI, and crafting GUI.',
    accentHex: '#A855F7',
    guiTheme: 'survival-night',
    guiTitle: 'CABIN SURVIVAL CRAFTING',
    currencyName: 'Pine Logs & Scrap',
    startingCurrency: 920,
    actionButtonLabel: '+150 Chop Pine Firewood',
    guiItems: [
      { id: 'hr1', name: 'UV Halogen Lantern', rarity: 'Legendary', price: 420, statBoost: 'Repels Stalker 18s', accent: '#A855F7', emoji: '🏮' },
      { id: 'hr2', name: 'Reinforced Cabin Barricade', rarity: 'Epic', price: 280, statBoost: '+450 Door Durability', accent: '#F59E0B', emoji: '🪵' },
      { id: 'hr3', name: 'Thermal Campfire Core', rarity: 'Mythic', price: 750, statBoost: '2x Warmth Radius', accent: '#EF4444', emoji: '🔥' },
      { id: 'hr4', name: 'Lithium Battery Pack', rarity: 'Common', price: 110, statBoost: '+100% Flashlight', accent: '#38BDF8', emoji: '🔋' },
    ],
    worldProps: [
      { id: 'hr-cab', label: 'LogCabinShelter', x: 1.5, z: -1.5, w: 3.4, h: 2.8, d: 3.0, color: '#78350F' },
      { id: 'hr-fire', label: 'WarmthCampfire', x: -1.6, z: 1.4, w: 1.2, h: 0.9, d: 1.2, color: '#F97316', glow: true, animated: 'pulse' },
      { id: 'hr-t1', label: 'SnowPine_01', x: -4.2, z: -3.5, w: 1.3, h: 4.2, d: 1.3, color: '#1E3A2F' },
      { id: 'hr-t2', label: 'SnowPine_02', x: 4.5, z: 3.2, w: 1.3, h: 4.5, d: 1.3, color: '#1E3A2F' },
    ],
    explorer: [
      {
        id: 'ws5',
        name: 'Workspace',
        className: 'Workspace',
        children: [
          { id: 'ws5-c', name: 'SnowyCabin', className: 'Model', isNew: true },
          { id: 'ws5-ai', name: 'NightStalkerNPC', className: 'Model', isNew: true },
        ],
      },
      {
        id: 'sss5',
        name: 'ServerScriptService',
        className: 'ServerScriptService',
        children: [
          { id: 'sss5-p', name: 'StalkerPathfinding.server', className: 'Script', isNew: true },
        ],
      },
    ],
    scripts: [
      {
        id: 'srv5',
        name: 'StalkerPathfinding.server.luau',
        path: 'ServerScriptService/StalkerPathfinding.server.luau',
        type: 'Server',
        code: `--!strict
local PathfindingService = game:GetService("PathfindingService")
local Lighting = game:GetService("Lighting")

Lighting.ClockTime = 0.5
Lighting.Brightness = 0.35

local function computeStalkerPath(npcRoot: BasePart, targetPos: Vector3)
	local path = PathfindingService:CreatePath({ AgentRadius = 2.5, AgentCanJump = true })
	path:ComputeAsync(npcRoot.Position, targetPos)
	return path:GetWaypoints()
end`,
      },
      {
        id: 'cli5',
        name: 'FlashlightBattery.client.luau',
        path: 'StarterGui/SurvivalHUD/FlashlightBattery.client.luau',
        type: 'Client',
        code: `--!strict
local UserInputService = game:GetService("UserInputService")
print("[Baseplate Auto-Sync]: Volumetric SpotLight toggle bound to Enum.KeyCode.F")`,
      },
      {
        id: 'mod5',
        name: 'NightCycleConfig.luau',
        path: 'ReplicatedStorage/NightCycleConfig.luau',
        type: 'Module',
        code: `--!strict
return table.freeze({ NightLengthSeconds = 180, CampfireDecayPerSec = 1.25 })`,
      },
    ],
  },
  {
    id: 'obby-tower',
    title: 'Neon Stud Sky Tower',
    genre: 'Timed Parkour Obby',
    badge: 'CHECKPOINTS + COILS',
    image: 'gfx/obby-tower.jpg',
    creator: '@ObbyCraft',
    plays: '6.9M+ visits',
    instancesCount: 22,
    prompt: 'Generate a procedural Neon Sky Tower Obby like Tower of Hell with rotating laser bars, stage checkpoints, gravity/speed coils shop GUI, and global timer.',
    accentHex: '#22D3EE',
    guiTheme: 'neon-cyber',
    guiTitle: 'TOWER MODIFIERS & COILS',
    currencyName: 'Stage Tokens',
    startingCurrency: 1200,
    actionButtonLabel: '+200 Beat Tower Stage',
    guiItems: [
      { id: 'ob1', name: 'Fusion Gravity Coil', rarity: 'Legendary', price: 450, statBoost: '+65% Jump Height', accent: '#38BDF8', emoji: '🌀' },
      { id: 'ob2', name: 'Low-Ping Double Jump', rarity: 'Mythic', price: 900, statBoost: 'Mid-Air Vault', accent: '#00E676', emoji: '👟' },
      { id: 'ob3', name: 'Server Invincibility Mutator', rarity: 'Epic', price: 600, statBoost: 'No Killbricks (2m)', accent: '#FFB800', emoji: '🛡️' },
      { id: 'ob4', name: '2x Tower Timer Extend', rarity: 'Rare', price: 250, statBoost: '+120 Seconds', accent: '#EC4899', emoji: '⏱️' },
    ],
    worldProps: [
      { id: 'ob-p1', label: 'NeonJumpPad_1', x: -3.5, z: 2.5, w: 2.0, h: 0.4, d: 2.0, color: '#22C55E', glow: true },
      { id: 'ob-p2', label: 'NeonJumpPad_2', x: -1.0, z: 0.5, w: 2.0, h: 1.4, d: 2.0, color: '#06B6D4', glow: true },
      { id: 'ob-p3', label: 'NeonJumpPad_3', x: 1.8, z: -1.2, w: 2.0, h: 2.5, d: 2.0, color: '#A855F7', glow: true },
      { id: 'ob-top', label: 'CrownFinishPortal', x: 4.0, z: -3.2, w: 2.4, h: 3.8, d: 2.4, color: '#FACC15', glow: true, animated: 'float' },
    ],
    explorer: [
      {
        id: 'ws6',
        name: 'Workspace',
        className: 'Workspace',
        children: [
          { id: 'ws6-s', name: 'ProceduralTowerStages', className: 'Folder', isNew: true },
        ],
      },
      {
        id: 'sss6',
        name: 'ServerScriptService',
        className: 'ServerScriptService',
        children: [
          { id: 'sss6-t', name: 'TowerRoundGenerator.server', className: 'Script', isNew: true },
        ],
      },
    ],
    scripts: [
      {
        id: 'srv6',
        name: 'TowerRoundGenerator.server.luau',
        path: 'ServerScriptService/TowerRoundGenerator.server.luau',
        type: 'Server',
        code: `--!strict
local CollectionService = game:GetService("CollectionService")

for _, killPart in CollectionService:GetTagged("NeonKillBrick") do
	if killPart:IsA("BasePart") then
		killPart.Touched:Connect(function(hit: BasePart)
			local hum = hit.Parent and hit.Parent:FindFirstChildOfClass("Humanoid")
			if hum and not hit.Parent:GetAttribute("InvincibleMutator") then
				hum.Health = 0
			end
		end)
	end
end`,
      },
      {
        id: 'cli6',
        name: 'TowerProgressBar.client.luau',
        path: 'StarterGui/TowerGui/TowerProgressBar.client.luau',
        type: 'Client',
        code: `--!strict
local RunService = game:GetService("RunService")
print("[Baseplate Auto-Sync]: Live altitude meter initialized.")`,
      },
      {
        id: 'mod6',
        name: 'StagePool.luau',
        path: 'ReplicatedStorage/StagePool.luau',
        type: 'Module',
        code: `--!strict
return table.freeze({ TotalHeightStuds = 320, RoundTime = 480 })`,
      },
    ],
  },
];

// Dynamically synthesizes a custom, ultra-believable Roblox Studio blueprint for ANY prompt a friend types!
export function synthesizeBlueprintFromPrompt(rawPrompt: string): GameBlueprint {
  const clean = rawPrompt.trim();
  const lower = clean.toLowerCase();

  // Check if it closely matches one of the 6 rich presets ONLY if they clicked a preset prompt directly
  const exactPreset = GAME_BLUEPRINTS.find((b) => b.prompt.toLowerCase() === lower);
  if (exactPreset) return exactPreset;

  // Extract meaningful title words
  const stopWords = new Set(['make', 'build', 'create', 'generate', 'a', 'an', 'the', 'with', 'and', 'for', 'roblox', 'game', 'system', 'in', 'like', 'that', 'has', 'please', 'me']);
  const words = clean
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w.toLowerCase()));

  const keyNouns = words.slice(0, 3).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  const pascalSystem = (keyNouns.join('') || 'CustomExperience').replace(/[^a-zA-Z0-9]/g, '');
  const displayTitle = keyNouns.length > 0 ? `${keyNouns.join(' ')} System` : 'Custom Baseplate Experience';

  // Detect genre & palette from prompt keywords
  const isHorror = /horror|scary|monster|night|zombie|survival|ghost|escape|doors/.test(lower);
  const isShooter = /gun|fps|shoot|sniper|rivals|weapon|war|pvp|sword|combat|fight|katana|knife|murder/.test(lower);
  const isTycoon = /tycoon|factory|dropper|conveyor|cash|money|stand|lemonade|farm|garden|business/.test(lower);
  const isObby = /obby|parkour|tower|jump|lava|stage|speed/.test(lower);

  const baseVisual = isHorror
    ? GAME_BLUEPRINTS[4]
    : isShooter
      ? GAME_BLUEPRINTS[2]
      : isTycoon
        ? GAME_BLUEPRINTS[3]
        : isObby
          ? GAME_BLUEPRINTS[5]
          : GAME_BLUEPRINTS[1];

  const currency = isHorror
    ? 'Survival Souls'
    : isShooter
      ? 'Elimination Credits'
      : isTycoon
        ? 'Tycoon Cash'
        : 'Creator Gems';

  const primaryEntity = keyNouns[0] || 'CoreUnit';
  const secondaryEntity = keyNouns[1] || 'UpgradeModule';

  return {
    id: `custom-${Date.now()}`,
    title: displayTitle,
    genre: isHorror ? 'Survival AI' : isShooter ? 'Combat System' : isTycoon ? 'Economy & Tycoon' : 'Custom Luau Experience',
    badge: 'CUSTOM AI BUILD • STRICT LUAU',
    image: baseVisual.image,
    creator: '@LocalStudioSession',
    plays: 'Synced to Studio',
    instancesCount: 26,
    prompt: clean,
    accentHex: baseVisual.accentHex,
    guiTheme: baseVisual.guiTheme,
    guiTitle: `${displayTitle.toUpperCase()} GUI`,
    currencyName: currency,
    startingCurrency: 5000,
    actionButtonLabel: `+500 Test ${primaryEntity} Event`,
    guiItems: [
      { id: 'c1', name: `Mythic ${primaryEntity} Boost`, rarity: 'Mythic', price: 1800, statBoost: '3.0x Server Multiplier', accent: '#FFB800', emoji: '⚡' },
      { id: 'c2', name: `Elite ${secondaryEntity}`, rarity: 'Legendary', price: 950, statBoost: '+45% Action Speed', accent: '#00E676', emoji: '🔥' },
      { id: 'c3', name: `Auto-${primaryEntity} Pass`, rarity: 'Epic', price: 650, statBoost: 'Automated Loop', accent: '#38BDF8', emoji: '🤖' },
      { id: 'c4', name: `${pascalSystem} VIP Crate`, rarity: 'Legendary', price: 1250, statBoost: '0.5% Secret Drop', accent: '#A855F7', emoji: '🎁' },
    ],
    worldProps: [
      { id: 'cp1', label: `${primaryEntity}Core`, x: 0, z: 0, w: 2.2, h: 2.2, d: 2.2, color: baseVisual.accentHex, glow: true, animated: 'float' },
      { id: 'cp2', label: `${secondaryEntity}Pad_A`, x: -3.4, z: 2.2, w: 2.0, h: 0.5, d: 2.0, color: '#38BDF8', glow: true },
      { id: 'cp3', label: `${secondaryEntity}Pad_B`, x: 3.4, z: 2.2, w: 2.0, h: 0.5, d: 2.0, color: '#00E676', glow: true },
      { id: 'cp4', label: `${pascalSystem}Terminal`, x: 0, z: -3.5, w: 3.2, h: 2.4, d: 1.4, color: '#F59E0B', glow: true },
    ],
    explorer: [
      {
        id: 'c-ws',
        name: 'Workspace',
        className: 'Workspace',
        children: [
          { id: 'c-bp', name: 'Baseplate', className: 'Part' },
          { id: 'c-map', name: `${pascalSystem}World`, className: 'Model', isNew: true },
          { id: 'c-sp', name: `${primaryEntity}SpawnZone`, className: 'SpawnLocation', isNew: true },
        ],
      },
      {
        id: 'c-rs',
        name: 'ReplicatedStorage',
        className: 'ReplicatedStorage',
        children: [
          {
            id: 'c-rem-f',
            name: `${pascalSystem}Remotes`,
            className: 'Folder',
            isNew: true,
            children: [
              { id: 'c-rem1', name: `Trigger${primaryEntity}Action`, className: 'RemoteEvent', isNew: true },
              { id: 'c-rem2', name: `Sync${pascalSystem}State`, className: 'RemoteEvent', isNew: true },
            ],
          },
          { id: 'c-cfg', name: `${pascalSystem}Config`, className: 'ModuleScript', isNew: true },
        ],
      },
      {
        id: 'c-sss',
        name: 'ServerScriptService',
        className: 'ServerScriptService',
        children: [
          { id: 'c-srv', name: `${pascalSystem}Manager.server`, className: 'Script', isNew: true },
        ],
      },
      {
        id: 'c-sg',
        name: 'StarterGui',
        className: 'StarterGui',
        children: [
          {
            id: 'c-gui',
            name: `${pascalSystem}ScreenGui`,
            className: 'ScreenGui',
            isNew: true,
            children: [
              { id: 'c-fr', name: 'MainContainer', className: 'Frame', isNew: true },
              { id: 'c-uc', name: 'UICorner', className: 'UICorner', isNew: true },
              { id: 'c-us', name: 'UIStroke', className: 'UIStroke', isNew: true },
              { id: 'c-loc', name: `${pascalSystem}Client.client`, className: 'LocalScript', isNew: true },
            ],
          },
        ],
      },
    ],
    scripts: [
      {
        id: 'c-s1',
        name: `${pascalSystem}Manager.server.luau`,
        path: `ServerScriptService/${pascalSystem}Manager.server.luau`,
        type: 'Server',
        code: `--!strict
-- Prompt: "${clean.replace(/"/g, "'")}"
-- Generated by Baseplate.gg Luau-R3 Agent • Auto-Synced to Roblox Studio
local Players = game:GetService("Players")
local DataStoreService = game:GetService("DataStoreService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Store = DataStoreService:GetDataStore("${pascalSystem}_LiveStore_v1")
local Remotes = ReplicatedStorage:WaitForChild("${pascalSystem}Remotes")
local ActionRemote = Remotes:WaitForChild("Trigger${primaryEntity}Action") :: RemoteEvent
local SyncRemote = Remotes:WaitForChild("Sync${pascalSystem}State") :: RemoteEvent
local Config = require(ReplicatedStorage:WaitForChild("${pascalSystem}Config"))

export type SessionProfile = {
	Balance: number,
	Level: number,
	Unlocked: { [string]: boolean },
	LastActionTick: number,
}

local activeProfiles: { [number]: SessionProfile } = {}

Players.PlayerAdded:Connect(function(player: Player)
	local leaderstats = Instance.new("Folder")
	leaderstats.Name = "leaderstats"
	leaderstats.Parent = player

	local cashStat = Instance.new("IntValue")
	cashStat.Name = "${currency}"
	cashStat.Value = Config.StartingBalance
	cashStat.Parent = leaderstats

	local ok, saved = pcall(function()
		return Store:GetAsync("Player_" .. player.UserId)
	end)

	local data: SessionProfile = (ok and saved) or {
		Balance = Config.StartingBalance,
		Level = 1,
		Unlocked = {},
		LastActionTick = 0,
	}
	activeProfiles[player.UserId] = data
	cashStat.Value = data.Balance
	SyncRemote:FireClient(player, data)
end)

ActionRemote.OnServerEvent:Connect(function(player: Player, actionId: string)
	local profile = activeProfiles[player.UserId]
	if not profile then return end

	local now = workspace:GetServerTimeNow()
	if (now - profile.LastActionTick) < Config.ActionDebounce then
		return -- Server rate-limit protection
	end
	profile.LastActionTick = now

	local cost = Config.ItemCosts[actionId]
	if cost then
		if profile.Balance < cost then return end
		profile.Balance -= cost
		profile.Unlocked[actionId] = true
	else
		profile.Balance += Config.BaseReward * profile.Level
	end

	local ls = player:FindFirstChild("leaderstats")
	local stat = ls and ls:FindFirstChild("${currency}") :: IntValue?
	if stat then stat.Value = profile.Balance end

	SyncRemote:FireClient(player, profile)
end)

Players.PlayerRemoving:Connect(function(player: Player)
	local profile = activeProfiles[player.UserId]
	if profile then
		pcall(function()
			Store:SetAsync("Player_" .. player.UserId, profile)
		end)
		activeProfiles[player.UserId] = nil
	end
end)`,
      },
      {
        id: 'c-s2',
        name: `${pascalSystem}Client.client.luau`,
        path: `StarterGui/${pascalSystem}ScreenGui/${pascalSystem}Client.client.luau`,
        type: 'Client',
        code: `--!strict
local TweenService = game:GetService("TweenService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Remotes = ReplicatedStorage:WaitForChild("${pascalSystem}Remotes")
local ActionRemote = Remotes:WaitForChild("Trigger${primaryEntity}Action") :: RemoteEvent
local SyncRemote = Remotes:WaitForChild("Sync${pascalSystem}State") :: RemoteEvent

local screenGui = script.Parent :: ScreenGui
local container = screenGui:WaitForChild("MainContainer") :: Frame

local bounceInfo = TweenInfo.new(0.14, Enum.EasingStyle.Back, Enum.EasingDirection.Out)

for _, child in container:GetDescendants() do
	if child:IsA("TextButton") then
		local defaultSize = child.Size
		child.MouseButton1Click:Connect(function()
			ActionRemote:FireServer(child.Name)
			child.Size = UDim2.new(defaultSize.X.Scale * 0.94, 0, defaultSize.Y.Scale * 0.94, 0)
			TweenService:Create(child, bounceInfo, { Size = defaultSize }):Play()
		end)
	end
end

SyncRemote.OnClientEvent:Connect(function(updatedState)
	print("[${pascalSystem}]: Synced balance ->", updatedState.Balance)
end)`,
      },
      {
        id: 'c-s3',
        name: `${pascalSystem}Config.luau`,
        path: `ReplicatedStorage/${pascalSystem}Config.luau`,
        type: 'Module',
        code: `--!strict
return table.freeze({
	SystemName = "${displayTitle}",
	StartingBalance = 5000,
	BaseReward = 500,
	ActionDebounce = 0.25,
	ItemCosts = {
		["c1"] = 1800,
		["c2"] = 950,
		["c3"] = 650,
		["c4"] = 1250,
	},
})`,
      },
    ],
  };
}
