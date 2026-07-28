import React, { useState } from 'react';
import { Play, Info, Clock, Dumbbell, Shield, ChevronRight, ChevronUp, ChevronDown, RefreshCw, Activity, Sparkles, RotateCcw, Plus, Trash2, CalendarPlus, History, Pencil, MapPin, Building2, Home, Sliders, Check } from 'lucide-react';
import { WorkoutSplit, PlannedExercise, Exercise, UnitSystem, WorkoutLog, MobilityRoutine } from '../types';
import { getAllExercises, getLastLoggedForExercise, LocationPreset } from '../utils/exerciseUtils';
import { mobilityRoutines } from '../data/mobilityData';
import { ExerciseSwapModal } from './ExerciseSwapModal';
import { AddExerciseModal } from './AddExerciseModal';
import { AddDayModal } from './AddDayModal';
import { AddWarmupModal } from './AddWarmupModal';
import { GuidedWarmupModal } from './GuidedWarmupModal';
import { InfoBall } from './InfoBall';
import { ConfirmModal } from './ConfirmModal';

interface WorkoutPlanViewProps {
  split: WorkoutSplit;
  unit: UnitSystem;
  logs?: WorkoutLog[];
  allMobilityRoutines?: MobilityRoutine[];
  onStartWorkout: (dayNumber: number) => void;
  onSelectDaysTab: () => void;
  onOpenAICoach: () => void;
  onSwapExercise: (dayNumber: number, exerciseIndex: number, newExerciseId: string) => void;
  onAddExercise?: (dayNumber: number, planned: PlannedExercise) => void;
  onRemoveExercise?: (dayNumber: number, exerciseIndex: number) => void;
  onUpdateExercise?: (dayNumber: number, exerciseIndex: number, updatedFields: Partial<PlannedExercise>) => void;
  onReorderExercise?: (dayNumber: number, fromIndex: number, toIndex: number) => void;
  onAddExtraDay?: (title: string, focus: string) => void;
  onRemoveDay?: (dayNumber: number) => void;
  onResetSplitToDefault?: () => void;
  onRenameSplit?: (newTitle: string) => void;
  onAddWarmupToDay?: (dayNumber: number, routineId: string) => void;
  onRemoveWarmupFromDay?: (dayNumber: number, routineId: string) => void;
  onCreateCustomWarmup?: (routine: MobilityRoutine, attachToDayNumber?: number) => void;
  onApplyLocationPreset?: (preset: LocationPreset) => void;
  isCustomized?: boolean;
}

export const WorkoutPlanView: React.FC<WorkoutPlanViewProps> = ({
  split,
  unit,
  logs = [],
  allMobilityRoutines,
  onStartWorkout,
  onSelectDaysTab,
  onOpenAICoach,
  onSwapExercise,
  onAddExercise,
  onRemoveExercise,
  onUpdateExercise,
  onReorderExercise,
  onAddExtraDay,
  onRemoveDay,
  onResetSplitToDefault,
  onRenameSplit,
  onAddWarmupToDay,
  onRemoveWarmupFromDay,
  onCreateCustomWarmup,
  onApplyLocationPreset,
  isCustomized = false
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [selectedExerciseForDetail, setSelectedExerciseForDetail] = useState<Exercise | null>(null);
  const [isAddingExercise, setIsAddingExercise] = useState<boolean>(false);
  const [isAddingDay, setIsAddingDay] = useState<boolean>(false);
  const [isAddingWarmup, setIsAddingWarmup] = useState<boolean>(false);
  const [activeGuidedWarmup, setActiveGuidedWarmup] = useState<MobilityRoutine | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [customTitleInput, setCustomTitleInput] = useState<string>('');
  const [swappingTarget, setSwappingTarget] = useState<{
    dayNumber: number;
    exerciseIndex: number;
    exerciseId: string;
  } | null>(null);
  const [dayToDeleteConfirm, setDayToDeleteConfirm] = useState<number | null>(null);
  const [exerciseToRemove, setExerciseToRemove] = useState<{ dayNumber: number; exerciseIndex: number; name: string } | null>(null);
  const [warmupToRemove, setWarmupToRemove] = useState<{ dayNumber: number; routineId: string; name: string } | null>(null);
  const [isResetRoutineConfirmOpen, setIsResetRoutineConfirmOpen] = useState<boolean>(false);
  const [equipmentPreset, setEquipmentPreset] = useState<'all' | 'commercial' | 'home' | 'cable'>(() => {
    return (localStorage.getItem('glutex_location_preset') as any) || 'all';
  });
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState<boolean>(false);

  const locationLabels: Record<string, string> = {
    all: 'All Equipment',
    commercial: 'Commercial Gym',
    home: 'Home DBs & Bands',
    cable: 'Cable & Machine'
  };

  const totalDays = split.days.length;
  const baseDays = split.daysPerWeek;
  const extraDaysCount = totalDays - baseDays;

  const currentDay = split.days.find((d) => d.dayNumber === selectedDayNumber) || split.days[0];

  const availableMobilityRoutines = allMobilityRoutines && allMobilityRoutines.length > 0
    ? allMobilityRoutines
    : mobilityRoutines;

  const getExerciseDetails = (exerciseId: string): Exercise | undefined => {
    return getAllExercises().find((e) => e.id === exerciseId);
  };

  const getMobilityRoutine = (routineId: string) => {
    return availableMobilityRoutines.find((m) => m.id === routineId);
  };

  const getShortDayTitle = (fullTitle: string): string => {
    const parts = fullTitle.split(':').map((p) => p.trim());
    if (parts.length >= 2 && /^Day \d+$/i.test(parts[0])) {
      return parts[1];
    }
    return fullTitle.replace(/^Day \d+:\s*/, '').trim();
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Top Plan Header & Days Switcher */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs hud-corners">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3 sm:space-y-3.5">
            {extraDaysCount > 0 && (
              <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300/80 font-semibold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Customized: {baseDays}-Day Glute Base + {extraDaysCount} Extra Day{extraDaysCount > 1 ? 's' : ''} ({totalDays} Total Days)</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-stone-500 text-xs font-semibold uppercase tracking-widest leading-relaxed">
              <span>{totalDays} Sessions / Week Plan</span>
              <span className="text-stone-300 font-normal">·</span>
              <button
                onClick={onSelectDaysTab}
                className="text-stone-800 hover:text-stone-950 underline transition-colors cursor-pointer"
              >
                Change Frequency
              </button>
              {isCustomized && onResetSplitToDefault && (
                <>
                  <span className="text-stone-300 font-normal">·</span>
                  <button
                    onClick={() => setIsResetRoutineConfirmOpen(true)}
                    className="text-stone-600 hover:text-stone-900 underline flex items-center space-x-1 cursor-pointer"
                    title="Reset modified routine back to default"
                  >
                    <RotateCcw className="w-3 h-3 text-stone-500" />
                    <span>Reset Routine</span>
                  </button>
                </>
              )}
              <span className="text-stone-300 font-normal">·</span>

              {/* Location Symbol Popup Trigger */}
              <div className="relative inline-block normal-case tracking-normal">
                <button
                  onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all cursor-pointer border border-stone-200"
                  title="Setup Gym / Home Location Preset"
                >
                  <MapPin className="w-3.5 h-3.5 text-stone-900 shrink-0" />
                  <span>{locationLabels[equipmentPreset]}</span>
                  <ChevronDown className="w-3 h-3 text-stone-500" />
                </button>

                {isLocationMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setIsLocationMenuOpen(false)}
                    />
                    <div className="absolute left-0 mt-2 z-50 w-72 bg-white rounded-2xl border border-stone-200 shadow-xl p-2 space-y-1 animate-fadeIn">
                      <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 flex items-center justify-between">
                        <span>Setup Location Preset</span>
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      </div>
                      {[
                        { id: 'all', label: 'All Equipment', desc: 'Full Gym & All Exercises', icon: Dumbbell },
                        { id: 'commercial', label: 'Commercial Gym', desc: 'Barbells, Cables & Smith Machine', icon: Building2 },
                        { id: 'home', label: 'Home DBs & Bands', desc: 'Dumbbells, Bands & Bodyweight', icon: Home },
                        { id: 'cable', label: 'Cable & Machine', desc: 'Cables & Machine Focus', icon: Sliders }
                      ].map((preset) => {
                        const Icon = preset.icon;
                        const isActive = equipmentPreset === preset.id;
                        return (
                          <button
                            key={preset.id}
                            onClick={() => {
                              const newPreset = preset.id as LocationPreset;
                              setEquipmentPreset(newPreset);
                              localStorage.setItem('glutex_location_preset', newPreset);
                              setIsLocationMenuOpen(false);
                              if (onApplyLocationPreset) {
                                onApplyLocationPreset(newPreset);
                              }
                            }}
                            className={`w-full flex items-start space-x-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                              isActive ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-800'
                            }`}
                          >
                            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-rose-300' : 'text-stone-500'}`} />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold">{preset.label}</div>
                              <div className={`text-[10px] truncate ${isActive ? 'text-stone-300' : 'text-stone-500'}`}>
                                {preset.desc}
                              </div>
                            </div>
                            {isActive && <Check className="w-4 h-4 text-rose-300 shrink-0 self-center" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 group pt-1">
              {isEditingTitle ? (
                <div className="flex items-center space-x-2 my-1">
                  <input
                    type="text"
                    value={customTitleInput}
                    onChange={(e) => setCustomTitleInput(e.target.value)}
                    className="text-2xl sm:text-3xl font-light border-b-2 border-stone-900 bg-transparent text-stone-950 focus:outline-none px-1"
                    placeholder="Custom routine name..."
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      if (customTitleInput.trim() && onRenameSplit) {
                        onRenameSplit(customTitleInput.trim());
                      }
                      setIsEditingTitle(false);
                    }}
                    className="px-3 py-1 bg-stone-900 text-white rounded-lg text-xs font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingTitle(false)}
                    className="px-3 py-1 bg-stone-100 text-stone-700 rounded-lg text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-stone-950">
                    {split.name}
                  </h1>
                  {onRenameSplit && (
                    <button
                      onClick={() => {
                        setCustomTitleInput(split.name);
                        setIsEditingTitle(true);
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors opacity-70 group-hover:opacity-100"
                      title="Rename this workout routine"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl font-normal">
              {split.tagline}
            </p>
          </div>

          <button
            onClick={() => onStartWorkout(currentDay.dayNumber)}
            className="bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-800 dark:hover:bg-stone-700 dark:text-stone-100 dark:border dark:border-stone-700/60 font-semibold px-8 py-3.5 rounded-full shadow-sm flex items-center justify-center space-x-2 transition-all text-xs tracking-wider uppercase cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current text-white dark:text-stone-100" />
            <span>Start Session <span className="font-mono">{currentDay.dayNumber}</span></span>
          </button>
        </div>

        {/* Day Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-5 sm:pt-6 border-t border-stone-100 dark:border-stone-800">
          {split.days.map((day) => {
            const isSelected = day.dayNumber === selectedDayNumber;
            const isExtraDay = day.dayNumber > baseDays;
            const shortTitle = getShortDayTitle(day.title);

            return (
              <div key={day.dayNumber} className="relative group/tab flex">
                <button
                  type="button"
                  onClick={() => setSelectedDayNumber(day.dayNumber)}
                  className={`w-full p-2.5 sm:p-3 rounded-2xl font-medium transition-all border text-left cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs dark:bg-stone-100 dark:text-stone-950 dark:border-stone-100'
                      : 'border-stone-200 bg-white/90 text-stone-900 hover:text-stone-950 hover:border-stone-300 hover:bg-white dark:bg-stone-900/90 dark:border-stone-800 dark:text-stone-100 dark:hover:bg-stone-800 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full gap-1">
                    <span className={`text-xs font-bold font-mono ${isSelected ? 'text-white dark:text-stone-950' : 'text-stone-900 dark:text-stone-100'}`}>
                      Day {day.dayNumber}
                    </span>
                    {isExtraDay && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-amber-400 text-stone-950 font-extrabold'
                            : 'bg-amber-100 text-amber-900 border border-amber-200/80 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800'
                        }`}
                      >
                        EXTRA
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-medium leading-tight truncate mt-1 block ${
                      isSelected ? 'text-stone-300 dark:text-stone-800 font-semibold' : 'text-stone-600 dark:text-stone-300'
                    }`}
                    title={day.title}
                  >
                    {shortTitle}
                  </span>
                </button>

                {onRemoveDay && isExtraDay && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDayToDeleteConfirm(day.dayNumber);
                    }}
                    className="absolute -top-1.5 -right-1.5 p-1 bg-white border border-stone-200 text-stone-400 hover:text-rose-600 hover:border-rose-300 rounded-full transition-colors shadow-2xs cursor-pointer z-10"
                    title={`Delete extra day (${day.title})`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add Extra Day Button */}
          {onAddExtraDay && (
            <button
              type="button"
              onClick={() => setIsAddingDay(true)}
              className="p-2.5 sm:p-3 rounded-2xl font-semibold text-xs transition-all border-2 border-dashed border-stone-300 hover:border-stone-900 bg-stone-50 hover:bg-stone-100 text-stone-800 flex flex-col items-center justify-center gap-1 cursor-pointer min-h-[58px]"
              title="Add an additional non-glute or custom training day"
            >
              <CalendarPlus className="w-4 h-4 text-stone-900" />
              <span className="text-[11px] font-bold">+ Add Extra Day</span>
            </button>
          )}
        </div>
      </div>

      {/* Selected Day Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Workout List (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 sm:gap-4">
            <div className="w-full">
              <div className="flex items-center justify-between gap-2">
                <p className="text-stone-400 text-xs uppercase tracking-widest font-bold">Daily Routine</p>
                <button
                  onClick={() => {
                    const el = document.getElementById('warmup-protocol-section');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      el.classList.add('ring-2', 'ring-stone-900', 'transition-all');
                      setTimeout(() => el.classList.remove('ring-2', 'ring-stone-900'), 1500);
                    }
                  }}
                  className="sm:hidden text-xs font-medium px-3 py-1 rounded-full border border-stone-300 bg-white hover:bg-stone-100 text-stone-900 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs group shrink-0"
                  title="Navigate down to the warm-up section for this day"
                >
                  <Activity className="w-3.5 h-3.5 text-stone-700 group-hover:scale-110 transition-transform" />
                  <span>Warm Up</span>
                  <ChevronDown className="w-3 h-3 text-stone-500" />
                </button>
              </div>
              <h2 className="text-xl sm:text-2xl font-light text-stone-950 tracking-tight mt-0.5 leading-snug">
                {currentDay.title}
              </h2>
            </div>
            <div className="flex items-center space-x-2 shrink-0 flex-wrap gap-2 pt-1 sm:pt-0">
              <button
                onClick={() => {
                  const el = document.getElementById('warmup-protocol-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.classList.add('ring-2', 'ring-stone-900', 'transition-all');
                    setTimeout(() => el.classList.remove('ring-2', 'ring-stone-900'), 1500);
                  }
                }}
                className="hidden sm:flex text-xs font-semibold px-3 py-1 rounded-full border border-stone-300 bg-white hover:bg-stone-100 text-stone-900 transition-colors items-center space-x-1.5 cursor-pointer shadow-2xs group"
                title="Navigate down to the warm-up section for this day"
              >
                <Activity className="w-3.5 h-3.5 text-stone-700 group-hover:scale-110 transition-transform" />
                <span>Warm Up</span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              <span className="text-xs text-stone-500 font-medium flex items-center space-x-1.5 bg-stone-100 px-3 py-1 rounded-full border border-stone-200/80">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Est. <span className="font-mono">{currentDay.estimatedMinutes}</span> mins</span>
              </span>

              {onUpdateExercise && (
                <button
                  onClick={() => {
                    const hasRest = currentDay.exercises.some((e) => e.restSeconds > 0);
                    const targetRest = hasRest ? 0 : 90;
                    currentDay.exercises.forEach((_, idx) => {
                      onUpdateExercise(currentDay.dayNumber, idx, { restSeconds: targetRest });
                    });
                  }}
                  className="text-xs font-medium px-3 py-1 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors flex items-center space-x-1 cursor-pointer"
                  title="Remove rest targets for all exercises in this day, or restore default 90s rest"
                >
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>
                    {currentDay.exercises.some((e) => e.restSeconds > 0)
                      ? 'Remove All Rest'
                      : 'Restore Rest Targets'}
                  </span>
                </button>
              )}

              {onRemoveDay && currentDay.dayNumber > baseDays && (
                <button
                  type="button"
                  onClick={() => {
                    setDayToDeleteConfirm(currentDay.dayNumber);
                  }}
                  className="text-xs font-medium px-3 py-1 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors flex items-center space-x-1.5 cursor-pointer"
                  title="Remove this extra day from your routine"
                >
                  <Trash2 className="w-3.5 h-3.5 text-stone-400" />
                  <span>Delete Extra Day</span>
                </button>
              )}
            </div>
          </div>

          {/* Planned Exercises Cards */}
          <div className="space-y-4">
            {currentDay.exercises.map((item, index) => {
              const ex = getExerciseDetails(item.exerciseId);
              const lastLogged = getLastLoggedForExercise(item.exerciseId, logs);

              return (
                <div
                  key={index}
                  className="bg-white border border-stone-200 hover:border-stone-300 rounded-2xl p-4 sm:p-6 transition-all shadow-xs space-y-4"
                >
                  {/* Top section: Number & Reorder, Title, Badges, Info & Delete */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                      <div className="flex items-start space-x-2.5 sm:space-x-3 min-w-0">
                        {/* Number & Reorder Controls */}
                        <div className="flex flex-col items-center shrink-0 mt-0.5">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-100 border border-stone-200 text-stone-800 flex items-center justify-center font-bold font-mono text-xs">
                            {String(index + 1).padStart(2, '0')}
                          </div>

                          {onReorderExercise && currentDay.exercises.length > 1 && (
                            <div className="flex flex-col items-center mt-1 -space-y-1">
                              <button
                                disabled={index === 0}
                                onClick={() => onReorderExercise(currentDay.dayNumber, index, index - 1)}
                                className={`p-0.5 rounded transition-colors ${
                                  index === 0
                                    ? 'text-stone-200 cursor-not-allowed'
                                    : 'text-stone-400 hover:text-stone-950 hover:bg-stone-100 cursor-pointer'
                                }`}
                                title="Move exercise earlier in workout"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={index === currentDay.exercises.length - 1}
                                onClick={() => onReorderExercise(currentDay.dayNumber, index, index + 1)}
                                className={`p-0.5 rounded transition-colors ${
                                  index === currentDay.exercises.length - 1
                                    ? 'text-stone-200 cursor-not-allowed'
                                    : 'text-stone-400 hover:text-stone-950 hover:bg-stone-100 cursor-pointer'
                                }`}
                                title="Move exercise later in workout"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3
                            className="text-base sm:text-lg font-medium text-stone-950 hover:text-stone-700 transition-colors cursor-pointer leading-snug break-words"
                            onClick={() => ex && setSelectedExerciseForDetail(ex)}
                          >
                            {ex ? ex.name : item.exerciseId.replace(/-/g, ' ')}
                          </h3>

                          {/* Structured Badges: Row 1 (Muscle & Position), Row 2 (Equipment & History) */}
                          <div className="space-y-1.5 mt-2">
                            {/* Row 1: Target Muscle + Biomechanics Position */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {ex && (
                                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200 whitespace-nowrap">
                                  {ex.targetRegion}
                                </span>
                              )}
                              {ex && (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-900 text-stone-100 uppercase tracking-wider whitespace-nowrap">
                                  {ex.biomechanicsType}
                                </span>
                              )}
                            </div>

                            {/* Row 2: Equipment + Location Preset Mismatch Badge + Last Logged History */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {ex && (
                                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200 whitespace-nowrap">
                                  {ex.equipment}
                                </span>
                              )}
                              {ex && equipmentPreset === 'home' && !['Dumbbell', 'Resistance Band', 'Bodyweight'].includes(ex.equipment) && (
                                <button
                                  onClick={() =>
                                    setSwappingTarget({
                                      dayNumber: currentDay.dayNumber,
                                      exerciseIndex: index,
                                      exerciseId: item.exerciseId
                                    })
                                  }
                                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-950 border border-rose-300 flex items-center space-x-1 cursor-pointer hover:bg-rose-200 transition-colors"
                                  title="Requires gym equipment. Tap to swap for a Home DB/Band alternative."
                                >
                                  <Sparkles className="w-3 h-3 text-rose-700 shrink-0" />
                                  <span>Swap for Home Alt</span>
                                </button>
                              )}
                              {ex && equipmentPreset === 'cable' && !['Cable', 'Machine', 'Smith Machine', 'Resistance Band'].includes(ex.equipment) && (
                                <button
                                  onClick={() =>
                                    setSwappingTarget({
                                      dayNumber: currentDay.dayNumber,
                                      exerciseIndex: index,
                                      exerciseId: item.exerciseId
                                    })
                                  }
                                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300 flex items-center space-x-1 cursor-pointer hover:bg-indigo-200 transition-colors"
                                  title="Tap to swap for a Cable or Machine alternative."
                                >
                                  <Sparkles className="w-3 h-3 text-indigo-700 shrink-0" />
                                  <span>Swap for Cable/Machine</span>
                                </button>
                              )}
                              {lastLogged && (lastLogged.weightKg > 0 || lastLogged.reps > 0) && (
                                <span
                                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1 whitespace-nowrap"
                                  title="Remembered from previous workout"
                                >
                                  <History className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span>Last: <span className="font-mono">{lastLogged.weightKg}</span> {unit} × <span className="font-mono">{lastLogged.reps}</span> reps</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Header Action Icons */}
                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => ex && setSelectedExerciseForDetail(ex)}
                          className="text-stone-400 hover:text-stone-800 p-1.5 rounded-full hover:bg-stone-100 transition-colors"
                          title="View Technique Cues"
                        >
                          <Info className="w-4 h-4" />
                        </button>

                        {onRemoveExercise && currentDay.exercises.length > 1 && (
                          <button
                            onClick={() => {
                              const exerciseName = ex ? ex.name : item.exerciseId.replace(/-/g, ' ');
                              setExerciseToRemove({ dayNumber: currentDay.dayNumber, exerciseIndex: index, name: exerciseName });
                            }}
                            className="text-stone-300 hover:text-rose-600 p-1.5 rounded-full hover:bg-rose-50 transition-colors"
                            title="Remove exercise from day"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Swap Movement Action Button */}
                    <div className="pt-2 flex items-center border-t border-stone-100">
                      <button
                        onClick={() =>
                          setSwappingTarget({
                            dayNumber: currentDay.dayNumber,
                            exerciseIndex: index,
                            exerciseId: item.exerciseId
                          })
                        }
                        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs border border-stone-200 transition-colors cursor-pointer whitespace-nowrap"
                        title="Switch exercise for glute group or equipment (e.g. Barbell to Dumbbells)"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                        <span>Swap Movement / Equipment</span>
                      </button>
                    </div>
                  </div>

                {/* Sets, Reps, RPE, Rest Grid — telemetry readout */}
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200/80 text-xs divide-x divide-cyan-500/10">
                    <div className="flex flex-col justify-between items-center text-center min-w-0">
                      <div className="flex items-center justify-center h-5">
                        <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider whitespace-nowrap">Sets</span>
                      </div>
                      <div className="flex items-center justify-center h-7 mt-0.5">
                        <span className="font-semibold font-mono text-stone-900 text-xs sm:text-base leading-none whitespace-nowrap">{item.sets}</span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-center text-center min-w-0">
                      <div className="flex items-center justify-center h-5">
                        <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider whitespace-nowrap">Reps</span>
                      </div>
                      <div className="flex items-center justify-center h-7 mt-0.5">
                        <span className="font-semibold font-mono text-stone-900 text-xs sm:text-base leading-none whitespace-nowrap">{item.reps}</span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-center text-center min-w-0">
                      <div className="flex items-center justify-center space-x-1 h-5">
                        <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider whitespace-nowrap">RPE</span>
                        <InfoBall
                          title="RPE Scale Guide"
                          content="RPE (Rate of Perceived Exertion) measures intensity. RPE 8 = 2 reps left in reserve (RIR). RPE 9 = 1 rep in reserve. RPE 10 = absolute limit/failure."
                          size="xs"
                        />
                      </div>
                      <div className="flex items-center justify-center h-7 mt-0.5">
                        <span className="font-semibold font-mono glow-text-cyan text-xs sm:text-base leading-none whitespace-nowrap">{item.rpe}</span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-center text-center min-w-0">
                      <div className="flex items-center justify-center space-x-1 h-5">
                        <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider whitespace-nowrap">Rest</span>
                        <InfoBall
                          title="Rest Intervals"
                          content="Heavy compound thrusts and hinges require 90-120s rest for ATP re-synthesis. Isolation/abduction exercises use 60s for metabolic pump."
                          size="xs"
                        />
                      </div>
                      <div className="flex items-center justify-center h-7 mt-0.5">
                        {onUpdateExercise ? (
                          <button
                            onClick={() =>
                              onUpdateExercise(currentDay.dayNumber, index, {
                                restSeconds: item.restSeconds > 0 ? 0 : 90
                              })
                            }
                            className="hover:bg-stone-200/60 rounded-lg px-1.5 py-1 transition-colors cursor-pointer"
                            title={item.restSeconds > 0 ? "Click to remove rest for this exercise" : "Click to add 90s rest"}
                          >
                            <span className={`font-semibold font-mono text-xs sm:text-base leading-none whitespace-nowrap ${item.restSeconds === 0 ? 'text-rose-700' : 'text-stone-900'}`}>
                              {item.restSeconds > 0 ? `${item.restSeconds}s` : 'No Rest'}
                            </span>
                          </button>
                        ) : (
                          <span className={`font-semibold font-mono text-xs sm:text-base leading-none whitespace-nowrap ${item.restSeconds === 0 ? 'text-rose-700' : 'text-stone-900'}`}>
                            {item.restSeconds > 0 ? `${item.restSeconds}s` : 'No Rest'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="text-xs text-stone-700 dark:text-stone-200 bg-stone-800/80 p-3 rounded-xl border border-stone-700 font-sans leading-relaxed">
                      <span className="font-semibold text-stone-900 dark:text-stone-100 mr-1.5">Instruction:</span>
                      {item.notes}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add Exercise to Day Button */}
            <button
              onClick={() => setIsAddingExercise(true)}
              className="w-full py-4 px-6 rounded-2xl border-2 border-dashed border-stone-200 hover:border-stone-400 bg-stone-50 hover:bg-stone-100/70 text-stone-800 font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-2xs"
            >
              <Plus className="w-4 h-4 text-stone-900" />
              <span>Add Exercise (Legs, Chest, Back, Arms, Full Body)</span>
            </button>
          </div>
        </div>

        {/* Sidebar: Recommended Warmup & AI Coach Tip (Right 1 col) */}
        <div className="space-y-6">
          {/* Pre-Workout Warmup & Mobility */}
          <div id="warmup-protocol-section" className="bg-stone-100/80 border border-stone-200 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-stone-500 font-bold text-xs uppercase tracking-widest">
                <Activity className="w-3.5 h-3.5 text-stone-700" />
                <span>Warmup Routine</span>
              </div>

              <button
                onClick={() => setIsAddingWarmup(true)}
                className="text-[11px] font-semibold text-stone-900 bg-white hover:bg-stone-200 border border-stone-300 px-2.5 py-1 rounded-full transition-colors flex items-center space-x-1"
                title="Add preset or custom warm-up routine for this day"
              >
                <Plus className="w-3 h-3" />
                <span>Add Warmup</span>
              </button>
            </div>

            {currentDay.warmupMobilityIds.length === 0 ? (
              <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center space-y-2">
                <p className="text-xs text-stone-500">No warm-up routines attached to Day {currentDay.dayNumber}.</p>
                <button
                  onClick={() => setIsAddingWarmup(true)}
                  className="text-xs font-semibold text-stone-900 underline"
                >
                  + Add Warm-Up Routine
                </button>
              </div>
            ) : (
              currentDay.warmupMobilityIds.map((routineId) => {
                const routine = getMobilityRoutine(routineId);
                if (!routine) return null;

                return (
                  <div key={routine.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3 relative group/warmup">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                          {routine.category}
                        </span>
                        <h4 className="text-sm font-semibold text-stone-950">{routine.name}</h4>
                      </div>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <span className="text-xs text-stone-600 dark:text-stone-300 font-medium font-mono">{routine.durationMinutes} mins</span>
                        {onRemoveWarmupFromDay && (
                          <button
                            onClick={() => {
                              setWarmupToRemove({ dayNumber: currentDay.dayNumber, routineId: routine.id, name: routine.name });
                            }}
                            className="p-1 text-stone-300 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors ml-1 cursor-pointer"
                            title="Remove this warm-up routine from this day"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed">{routine.description}</p>
                    <ul className="text-xs text-stone-600 space-y-1.5 pt-1 border-t border-stone-100">
                      {routine.steps.slice(0, 4).map((s, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                          <span>{s.name} ({s.durationOrReps})</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={() => setActiveGuidedWarmup(routine)}
                      className="w-full mt-2 py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current text-white" />
                      <span>Start Guided Routine</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* AI Coach Suggestion Prompt */}
          <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 space-y-4 shadow-sm border border-stone-800">
            <div className="flex items-center space-x-2 text-stone-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Biomechanics Specialist</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed font-normal">
              Need custom exercise substitutions (e.g. home dumbbells, cable alternatives) or knee-friendly modifications for Day {currentDay.dayNumber}?
            </p>
            <button
              onClick={onOpenAICoach}
              className="w-full py-3 px-4 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs glow-border-cyan"
            >
              <span className="font-bold text-[#05070a]">Consult AI Coach</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5] text-[#05070a]" />
            </button>
          </div>
        </div>
      </div>

      {/* Exercise Detail Modal */}
      {selectedExerciseForDetail && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl text-stone-900">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                  {selectedExerciseForDetail.biomechanicsType} • {selectedExerciseForDetail.targetRegion}
                </span>
                <h3 className="text-2xl font-light text-stone-950 mt-0.5">
                  {selectedExerciseForDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedExerciseForDetail(null)}
                className="text-stone-400 hover:text-stone-900 p-1.5 rounded-full hover:bg-stone-100 text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {selectedExerciseForDetail.description}
            </p>

            <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest">
                Setup Instructions
              </h4>
              <ul className="text-xs text-stone-600 space-y-1.5 list-disc list-inside">
                {selectedExerciseForDetail.setupInstructions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest">
                Key Technique Cues
              </h4>
              <ul className="text-xs text-stone-600 space-y-1.5 list-disc list-inside">
                {selectedExerciseForDetail.techniqueCues.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
              <h4 className="text-xs font-bold text-rose-800 uppercase tracking-widest">
                Common Mistakes to Avoid
              </h4>
              <ul className="text-xs text-stone-600 space-y-1.5 list-disc list-inside">
                {selectedExerciseForDetail.commonMistakes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setSelectedExerciseForDetail(null)}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs tracking-wider uppercase rounded-xl"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

      {/* Exercise Swap Modal */}
      {swappingTarget && (
        <ExerciseSwapModal
          currentExerciseId={swappingTarget.exerciseId}
          onSelectExercise={(newExerciseId) => {
            onSwapExercise(swappingTarget.dayNumber, swappingTarget.exerciseIndex, newExerciseId);
            setSwappingTarget(null);
          }}
          onClose={() => setSwappingTarget(null)}
        />
      )}

      {/* Add Exercise Modal */}
      {isAddingExercise && (
        <AddExerciseModal
          dayTitle={currentDay.title}
          onAddExercise={(planned) => {
            if (onAddExercise) {
              onAddExercise(currentDay.dayNumber, planned);
            }
            setIsAddingExercise(false);
          }}
          onClose={() => setIsAddingExercise(false)}
        />
      )}

      {/* Add Day Modal */}
      {isAddingDay && (
        <AddDayModal
          nextDayNumber={split.days.length + 1}
          onAddDay={(title, focus) => {
            if (onAddExtraDay) {
              onAddExtraDay(title, focus);
              setSelectedDayNumber(split.days.length + 1);
            }
            setIsAddingDay(false);
          }}
          onClose={() => setIsAddingDay(false)}
        />
      )}

      {/* Add Warmup Modal */}
      {isAddingWarmup && (
        <AddWarmupModal
          existingRoutines={availableMobilityRoutines}
          currentWarmupIds={currentDay.warmupMobilityIds || []}
          dayNumber={currentDay.dayNumber}
          onClose={() => setIsAddingWarmup(false)}
          onSelectRoutine={(routineId) => {
            if (onAddWarmupToDay) {
              onAddWarmupToDay(currentDay.dayNumber, routineId);
            }
          }}
          onCreateCustomRoutine={(newRoutine) => {
            if (onCreateCustomWarmup) {
              onCreateCustomWarmup(newRoutine, currentDay.dayNumber);
            }
          }}
        />
      )}

      {/* Delete Extra Day Confirmation Modal */}
      {dayToDeleteConfirm !== null && (() => {
        const dayObj = split.days.find((d) => d.dayNumber === dayToDeleteConfirm);
        const dayTitle = dayObj ? dayObj.title : `Day ${dayToDeleteConfirm}`;
        return (
          <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                  <Trash2 className="w-6 h-6 text-rose-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-medium text-stone-950">Delete Extra Day?</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Are you sure you want to delete <span className="font-semibold text-stone-900">{dayTitle}</span>? All planned exercises for this day will be removed from your routine.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2 border-t border-stone-100">
                <button
                  onClick={() => setDayToDeleteConfirm(null)}
                  className="px-5 py-2.5 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  No, Cancel
                </button>
                <button
                  onClick={() => {
                    if (onRemoveDay) {
                      onRemoveDay(dayToDeleteConfirm);
                      if (selectedDayNumber >= dayToDeleteConfirm) {
                        setSelectedDayNumber(1);
                      }
                    }
                    setDayToDeleteConfirm(null);
                  }}
                  className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete Day</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Reset Routine Confirmation Modal */}
      {isResetRoutineConfirmOpen && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6 text-rose-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-medium text-stone-950">Reset Routine to Default?</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Are you sure you want to reset <span className="font-semibold text-stone-900">{split.name}</span> back to its original prebuilt layout? Any custom exercise swaps, extra days, or rest target changes will be restored to defaults.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-stone-100">
              <button
                onClick={() => setIsResetRoutineConfirmOpen(false)}
                className="px-5 py-2.5 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                No, Cancel
              </button>
              <button
                onClick={() => {
                  if (onResetSplitToDefault) {
                    onResetSplitToDefault();
                  }
                  setIsResetRoutineConfirmOpen(false);
                }}
                className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Yes, Reset Routine</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Guided Warmup Routine Modal */}
      {activeGuidedWarmup && (
        <GuidedWarmupModal
          routine={activeGuidedWarmup}
          onClose={() => setActiveGuidedWarmup(null)}
        />
      )}

      {exerciseToRemove && (
        <ConfirmModal
          title="Remove Exercise?"
          message={<>Remove <strong className="text-stone-900 font-semibold">{exerciseToRemove.name}</strong> from this day? This will update your saved routine.</>}
          confirmLabel="Yes, Remove"
          onCancel={() => setExerciseToRemove(null)}
          onConfirm={() => {
            if (onRemoveExercise) {
              onRemoveExercise(exerciseToRemove.dayNumber, exerciseToRemove.exerciseIndex);
            }
            setExerciseToRemove(null);
          }}
        />
      )}

      {warmupToRemove && (
        <ConfirmModal
          title="Remove Warm-Up?"
          message={<>Remove <strong className="text-stone-900 font-semibold">{warmupToRemove.name}</strong> from this day's warm-up?</>}
          confirmLabel="Yes, Remove"
          onCancel={() => setWarmupToRemove(null)}
          onConfirm={() => {
            if (onRemoveWarmupFromDay) {
              onRemoveWarmupFromDay(warmupToRemove.dayNumber, warmupToRemove.routineId);
            }
            setWarmupToRemove(null);
          }}
        />
      )}
    </div>
  );
};
