import React, { useState } from 'react';
import {
  Dumbbell,
  Flame,
  Calendar,
  Sparkles,
  Activity,
  Trash2,
  AlertTriangle,
  Moon,
  Sun,
  Settings,
  X,
  Check,
  Laptop,
  MapPin,
  SlidersHorizontal,
  RotateCcw,
  Palette
} from 'lucide-react';
import { UnitSystem } from '../types';
import { LocationPreset } from '../utils/exerciseUtils';
import { HUD_ACCENT_PRESETS, hueToHex } from '../utils/hudTheme';

export type DarkModePreference = 'auto' | 'dark' | 'light';

interface HeaderProps {
  daysPerWeek: number;
  totalDays?: number;
  unit: UnitSystem;
  onToggleUnit: (unit: UnitSystem) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasActiveWorkout: boolean;
  onOpenActiveWorkout: () => void;
  workoutStreak: number;
  onClearEverything: () => void;
  isDarkMode: boolean;
  darkModePreference: DarkModePreference;
  onSelectDarkModePreference: (pref: DarkModePreference) => void;
  locationPreset: LocationPreset;
  onSelectLocationPreset: (preset: LocationPreset) => void;
  hudAccentHue: number;
  onSelectHudAccentHue: (hue: number) => void;
  onSelectDays: (days: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  daysPerWeek,
  totalDays,
  unit,
  onToggleUnit,
  activeTab,
  onTabChange,
  hasActiveWorkout,
  onOpenActiveWorkout,
  workoutStreak,
  onClearEverything,
  isDarkMode,
  darkModePreference,
  onSelectDarkModePreference,
  locationPreset,
  onSelectLocationPreset,
  hudAccentHue,
  onSelectHudAccentHue,
  onSelectDays
}) => {
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const actualDays = totalDays ?? daysPerWeek;
  const extraDays = actualDays - daysPerWeek;

  // Toggle quick dark mode
  const handleQuickDarkModeToggle = () => {
    if (isDarkMode) {
      onSelectDarkModePreference('light');
    } else {
      onSelectDarkModePreference('dark');
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-stone-200/60 text-stone-900 sticky top-0 z-30 shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer shrink-0" onClick={() => onTabChange('workout')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-stone-900 logo-dumbbell-circle flex items-center justify-center shadow-sm shrink-0">
              <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-white logo-dumbbell-icon transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center space-x-2 sm:space-x-2.5">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-[0.18em] text-stone-800 dark:text-stone-100 leading-none">
                  GLUTE<span className="font-bold glow-text-cyan">X</span>
                </h1>
                {extraDays > 0 ? (
                  <span
                    className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300"
                    title={`${daysPerWeek}-Day Base Routine + ${extraDays} Extra Day(s)`}
                  >
                    <span className="font-mono">{daysPerWeek}+{extraDays}</span>&nbsp;Days/Wk
                  </span>
                ) : (
                  <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700 border border-stone-300/50">
                    <span className="font-mono">{actualDays}</span>&nbsp;Days/Wk
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium tracking-wide hidden md:block mt-0.5">
                Biomechanics & Hypertrophy System
              </p>
            </div>
          </div>

          {/* Quick Info & Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            {hasActiveWorkout && (
              <button
                onClick={onOpenActiveWorkout}
                className="animate-pulse bg-emerald-50 border border-emerald-300 text-emerald-800 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 animate-spin hud-live-dot" />
                <span className="hidden min-[400px]:inline">Active</span>
                <span className="hidden min-[520px]:inline">Session</span>
              </button>
            )}

            {/* Streak */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700 shadow-2xs shrink-0">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-mono">{workoutStreak}</span><span>&nbsp;Streak</span>
            </div>

            {/* Direct Dark Mode Quick Toggle */}
            <button
              onClick={handleQuickDarkModeToggle}
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-700 transition-all cursor-pointer shadow-2xs flex items-center justify-center shrink-0"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-600" />
              )}
            </button>

            {/* Unit Switcher */}
            <div className="flex items-center bg-stone-200/60 p-0.5 rounded-full border border-stone-300/60 text-[11px] sm:text-xs font-medium shrink-0">
              <button
                onClick={() => onToggleUnit('kg')}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full transition-all cursor-pointer ${
                  unit === 'kg'
                    ? 'bg-stone-900 text-white font-semibold shadow-2xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                kg
              </button>
              <button
                onClick={() => onToggleUnit('lbs')}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full transition-all cursor-pointer ${
                  unit === 'lbs'
                    ? 'bg-stone-900 text-white font-semibold shadow-2xs'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                lbs
              </button>
            </div>

            {/* Options Menu Button */}
            <button
              onClick={() => setIsOptionsOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 sm:px-3 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all cursor-pointer shadow-xs shrink-0"
              title="Open App Options & Preferences"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
              <span className="hidden min-[480px]:inline">Options</span>
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="flex space-x-2 overflow-x-auto no-scrollbar pb-3 pt-1 border-t border-stone-200/60">
          {[
            { id: 'workout', label: 'Training Plan', icon: Calendar },
            { id: 'frequency', label: 'Frequency Split', icon: Dumbbell },
            { id: 'mobility', label: 'Mobility & Prep', icon: Activity },
            { id: 'library', label: 'Exercise Library', icon: Flame },
            { id: 'progress', label: 'Progress & PRs', icon: Flame },
            { id: 'ai-coach', label: 'AI Glute Coach', icon: Sparkles, badge: 'AI' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-4 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap border cursor-pointer ${
                  isActive
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200/80 bg-white/80 text-stone-600 hover:text-stone-950 hover:bg-white hover:border-stone-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                      isActive ? 'bg-stone-700 text-stone-100' : 'bg-stone-100 text-stone-800 border border-stone-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* OPTIONS MENU MODAL */}
      {isOptionsOpen && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white hud-modal-solid border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150 text-left max-h-[90vh] overflow-y-auto hud-corners">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-900">
                  <Settings className="w-5 h-5 text-stone-800" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-stone-950">App Options & Settings</h3>
                  <p className="text-xs text-stone-500">Customize display, equipment, and training preferences</p>
                </div>
              </div>
              <button
                onClick={() => setIsOptionsOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section 1: Dark Mode & Appearance */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center space-x-2">
                  <Moon className="w-3.5 h-3.5 text-stone-700" />
                  <span>Display Theme</span>
                </label>
                {darkModePreference === 'auto' && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Device Sync Active ({isDarkMode ? 'Dark' : 'Light'})
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onSelectDarkModePreference('light')}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-2xl border text-xs font-medium transition-all cursor-pointer ${
                    darkModePreference === 'light'
                      ? 'border-stone-900 bg-stone-900 text-white font-semibold shadow-xs'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectDarkModePreference('dark')}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-2xl border text-xs font-medium transition-all cursor-pointer ${
                    darkModePreference === 'dark'
                      ? 'border-stone-900 bg-stone-900 text-white font-semibold shadow-xs'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Dark</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectDarkModePreference('auto')}
                  className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-2xl border text-xs font-medium transition-all cursor-pointer ${
                    darkModePreference === 'auto'
                      ? 'border-stone-900 bg-stone-900 text-white font-semibold shadow-xs'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5 text-stone-500" />
                  <span>Device Auto</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-500 leading-snug">
                When set to <strong>Device Auto</strong>, GLUTE<strong>X</strong> automatically opens in Dark Mode if your device or browser has Dark Mode turned on.
              </p>
            </div>

            {/* Section 1.5: HUD Accent Color */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center space-x-2">
                  <Palette className="w-3.5 h-3.5 text-stone-700" />
                  <span>Accent Color</span>
                </label>
                <span
                  className="w-6 h-6 rounded-full border border-stone-200 shrink-0"
                  style={{ backgroundColor: hueToHex(hudAccentHue), boxShadow: `0 0 10px -1px ${hueToHex(hudAccentHue)}` }}
                  title={`Current hue: ${hudAccentHue}°`}
                />
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {HUD_ACCENT_PRESETS.map((preset) => {
                  const isActive = hudAccentHue === preset.hue;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => onSelectHudAccentHue(preset.hue)}
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        isActive ? 'border-stone-900 scale-110' : 'border-stone-200 hover:border-stone-400'
                      }`}
                      title={preset.name}
                    >
                      <span
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: hueToHex(preset.hue) }}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5">
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={hudAccentHue}
                  onChange={(e) => onSelectHudAccentHue(parseInt(e.target.value))}
                  className="hud-hue-slider"
                />
                <p className="text-[11px] text-stone-500 leading-snug">
                  Pick a preset or drag the slider for any hue. Applies live across borders, glows, and highlights.
                </p>
              </div>
            </div>

            {/* Section 2: Weight Unit System */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block">
                Weight Measurement System
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onToggleUnit('kg')}
                  className={`py-2.5 px-4 rounded-2xl border text-xs font-medium transition-all cursor-pointer text-center ${
                    unit === 'kg'
                      ? 'border-stone-900 bg-stone-900 text-white font-semibold shadow-xs'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  Kilograms (kg)
                </button>
                <button
                  type="button"
                  onClick={() => onToggleUnit('lbs')}
                  className={`py-2.5 px-4 rounded-2xl border text-xs font-medium transition-all cursor-pointer text-center ${
                    unit === 'lbs'
                      ? 'border-stone-900 bg-stone-900 text-white font-semibold shadow-xs'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  Pounds (lbs)
                </button>
              </div>
            </div>

            {/* Section 3: Gym Location & Equipment Filter */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-stone-700" />
                <span>Equipment & Location Filter</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'All Equipment', desc: 'Full commercial gym & specialty machines' },
                  { id: 'commercial', label: 'Commercial Gym', desc: 'Standard barbell, cable & machines' },
                  { id: 'home_cable', label: 'Home Gym (Cable)', desc: 'Rack, barbell, dumbbells & cables' },
                  { id: 'home_dumbbells', label: 'Dumbbells & Bands', desc: 'Minimal home equipment setup' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectLocationPreset(item.id as LocationPreset)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      locationPreset === item.id
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <p className="text-xs font-semibold">{item.label}</p>
                    <p className={`text-[10px] mt-0.5 ${locationPreset === item.id ? 'text-stone-300' : 'text-stone-500'}`}>
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 4: Training Frequency Days */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block">
                Training Frequency (Days per Week)
              </label>
              <div className="flex items-center space-x-2">
                {[2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => onSelectDays(num)}
                    className={`flex-1 py-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                      daysPerWeek === num
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    {num} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Section 5: Clear Data & Footer */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsOptionsOpen(false);
                  setIsClearModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-2xl border border-rose-300 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Data & Reset</span>
              </button>

              <button
                type="button"
                onClick={() => setIsOptionsOpen(false)}
                className="w-full sm:w-auto px-6 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer text-center"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal for Clear Everything */}
      {isClearModalOpen && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white hud-modal-solid border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150 text-left hud-corners-lime hud-corners">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-medium text-stone-950">Clear Everything?</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  <strong className="text-rose-700 font-semibold block mb-1">
                    ⚠️ Warning: This action cannot be undone!
                  </strong>
                  This will permanently wipe all logged workout history, personal records (PRs), custom movements,
                  warmups, and reset your split routines and preferences back to factory defaults.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                className="px-5 py-2.5 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsClearModalOpen(false);
                  onClearEverything();
                }}
                className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Clear Everything</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
