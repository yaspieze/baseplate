// Compiles a genuinely valid Roblox Studio XML Place File (.rbxlx) that opens directly in Roblox Studio!

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export interface RbxlxExportPayload {
  projectName: string;
  serverScriptName: string;
  serverCode: string;
  clientScriptName: string;
  clientCode: string;
  moduleScriptName: string;
  moduleCode: string;
  guiTitle: string;
  remoteName: string;
}

export function compileValidRbxlx(payload: RbxlxExportPayload): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<roblox xmlns:xmime="http://www.w3.org/2005/05/xmlmime" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.roblox.com/roblox.xsd" version="4">
  <External>null</External>
  <External>nil</External>
  <Item class="Workspace" referent="RBX1000">
    <Properties>
      <string name="Name">Workspace</string>
    </Properties>
    <Item class="Part" referent="RBX1001">
      <Properties>
        <bool name="Anchored">true</bool>
        <string name="Name">Baseplate</string>
        <Vector3 name="Position"><X>0</X><Y>-8</Y><Z>0</Z></Vector3>
        <Vector3 name="Size"><X>512</X><Y>16</Y><Z>512</Z></Vector3>
        <Color3uint8 name="Color3uint8">4284702562</Color3uint8>
        <token name="TopSurface">1</token>
      </Properties>
    </Item>
    <Item class="SpawnLocation" referent="RBX1002">
      <Properties>
        <bool name="Anchored">true</bool>
        <string name="Name">SpawnLocation</string>
        <Vector3 name="Position"><X>0</X><Y>0.5</Y><Z>0</Z></Vector3>
        <Vector3 name="Size"><X>12</X><Y>1</Y><Z>12</Z></Vector3>
      </Properties>
    </Item>
  </Item>
  <Item class="ReplicatedStorage" referent="RBX2000">
    <Properties>
      <string name="Name">ReplicatedStorage</string>
    </Properties>
    <Item class="Folder" referent="RBX2001">
      <Properties>
        <string name="Name">BaseplateRemotes</string>
      </Properties>
      <Item class="RemoteEvent" referent="RBX2002">
        <Properties>
          <string name="Name">${escapeXml(payload.remoteName)}</string>
        </Properties>
      </Item>
    </Item>
    <Item class="ModuleScript" referent="RBX2003">
      <Properties>
        <string name="Name">${escapeXml(payload.moduleScriptName)}</string>
        <ProtectedString name="Source">${escapeXml(payload.moduleCode)}</ProtectedString>
      </Properties>
    </Item>
  </Item>
  <Item class="ServerScriptService" referent="RBX3000">
    <Properties>
      <string name="Name">ServerScriptService</string>
    </Properties>
    <Item class="Script" referent="RBX3001">
      <Properties>
        <string name="Name">${escapeXml(payload.serverScriptName)}</string>
        <ProtectedString name="Source">${escapeXml(payload.serverCode)}</ProtectedString>
      </Properties>
    </Item>
  </Item>
  <Item class="StarterGui" referent="RBX4000">
    <Properties>
      <string name="Name">StarterGui</string>
    </Properties>
    <Item class="ScreenGui" referent="RBX4001">
      <Properties>
        <string name="Name">${escapeXml(payload.guiTitle.replace(/\s+/g, ''))}Gui</string>
        <bool name="ResetOnSpawn">false</bool>
        <bool name="IgnoreGuiInset">true</bool>
      </Properties>
      <Item class="Frame" referent="RBX4002">
        <Properties>
          <string name="Name">MainFrame</string>
          <UDim2 name="Position"><XS>0.5</XS><XO>-220</XO><YS>0.5</YS><YO>-150</YO></UDim2>
          <UDim2 name="Size"><XS>0</XS><XO>440</XO><YS>0</YS><YO>300</YO></UDim2>
          <Color3uint8 name="Color3uint8">4279506976</Color3uint8>
        </Properties>
        <Item class="UICorner" referent="RBX4003">
          <Properties>
            <UDim name="CornerRadius"><S>0</S><O>16</O></UDim>
          </Properties>
        </Item>
        <Item class="UIStroke" referent="RBX4004">
          <Properties>
            <float name="Thickness">3</float>
          </Properties>
        </Item>
        <Item class="TextLabel" referent="RBX4005">
          <Properties>
            <string name="Name">HeaderTitle</string>
            <string name="Text">${escapeXml(payload.guiTitle)}</string>
            <UDim2 name="Size"><XS>1</XS><XO>0</XO><YS>0</YS><YO>52</YO></UDim2>
            <float name="TextSize">24</float>
          </Properties>
        </Item>
      </Item>
      <Item class="LocalScript" referent="RBX4006">
        <Properties>
          <string name="Name">${escapeXml(payload.clientScriptName)}</string>
          <ProtectedString name="Source">${escapeXml(payload.clientCode)}</ProtectedString>
        </Properties>
      </Item>
    </Item>
  </Item>
</roblox>`;
}

export function triggerFileDownload(filename: string, content: string, mime = 'application/xml') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
