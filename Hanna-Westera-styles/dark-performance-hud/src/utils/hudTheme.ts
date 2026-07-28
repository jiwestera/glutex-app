export interface HudAccentPreset {
  name: string;
  hue: number;
}

export const HUD_ACCENT_PRESETS: HudAccentPreset[] = [
  { name: 'Cyan', hue: 189 },
  { name: 'Azure', hue: 215 },
  { name: 'Violet', hue: 265 },
  { name: 'Magenta', hue: 305 },
  { name: 'Pink', hue: 335 },
  { name: 'Teal', hue: 172 }
];

export const HUD_DEFAULT_HUE = 189;

const hslToHex = (h: number, s: number, l: number): string => {
  const sat = s / 100;
  const lig = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(lig, 1 - lig);
  const f = (n: number) => lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
};

const hexToRgbTriplet = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

export const hueToHex = (hue: number): string => hslToHex(hue, 100, 50);

export const applyHudAccentHue = (hue: number) => {
  const cyanHex = hslToHex(hue, 100, 50);
  const brightHex = hslToHex(hue, 100, 58);
  const voidGraphiteHex = hslToHex(hue, 34, 29);
  const panelGraphiteHex = hslToHex(hue, 62, 58);
  const glowHex = hslToHex(hue, 88, 60);

  const root = document.documentElement.style;
  root.setProperty('--hud-cyan', cyanHex);
  root.setProperty('--hud-cyan-bright', brightHex);
  root.setProperty('--hud-cyan-rgb', hexToRgbTriplet(cyanHex));
  root.setProperty('--hud-cyan-bright-rgb', hexToRgbTriplet(brightHex));

  // Light-mode ("graphite") surfaces derive from the same hue so the whole
  // app reads as one color family, not accent-color-plus-unrelated-tint.
  root.setProperty('--hud-void-graphite', voidGraphiteHex);
  root.setProperty('--hud-panel-graphite', `rgba(${hexToRgbTriplet(panelGraphiteHex)}, 0.22)`);
  root.setProperty('--hud-glow-rgb', hexToRgbTriplet(glowHex));
};
