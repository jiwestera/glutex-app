import React, { useState, useEffect } from 'react';
import { Header, DarkModePreference } from './components/Header';
import { DaysPerWeekSelector } from './components/DaysPerWeekSelector';
import { WorkoutPlanView } from './components/WorkoutPlanView';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { MobilityHub } from './components/MobilityHub';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { ProgressTracker } from './components/ProgressTracker';
import { AICoachPanel } from './components/AICoachPanel';

import { prebuiltSplits } from './data/prebuiltSplits';
import { mobilityRoutines } from './data/mobilityData';
import { WorkoutSplit, WorkoutLog, UnitSystem, PlannedExercise, MobilityRoutine } from './types';
import { transformSplitForLocation, LocationPreset } from './utils/exerciseUtils';
import { applyHudAccentHue, HUD_DEFAULT_HUE } from './utils/hudTheme';

// Safely reads & parses a JSON value from localStorage. A future app update that
// changes a data shape (or any storage corruption) must never crash the whole app
// on load — fall back to the caller's default instead so the user's other data
// (still sitting in localStorage) stays reachable.
function loadJSON<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch (err) {
    console.error(`Failed to load "${key}" from storage:`, err);
    return fallback;
  }
}

export default function App() {
  // Dark Mode preference: 'auto' | 'dark' | 'light'
  const [darkModePreference, setDarkModePreference] = useState<DarkModePreference>(() => {
    const saved = localStorage.getItem('glute_app_dark_mode_pref');
    if (saved === 'dark' || saved === 'light' || saved === 'auto') return saved as DarkModePreference;
    return 'auto';
  });

  // Derived actual isDarkMode boolean
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('glute_app_dark_mode_pref');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync dark mode preference & device prefers-color-scheme
  useEffect(() => {
    localStorage.setItem('glute_app_dark_mode_pref', darkModePreference);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      let dark = false;
      if (darkModePreference === 'auto') {
        dark = mediaQuery.matches;
      } else {
        dark = darkModePreference === 'dark';
      }
      setIsDarkMode(dark);
      if (dark) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    };

    updateTheme();

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (darkModePreference === 'auto') {
        setIsDarkMode(e.matches);
        if (e.matches) {
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [darkModePreference]);

  // Days per week selection (2, 3, 4, 5, or 6)
  const [daysPerWeek, setDaysPerWeek] = useState<number>(() => {
    const saved = localStorage.getItem('glute_app_days');
    return saved ? parseInt(saved) : 3;
  });

  // Location / Equipment Preset filter state
  const [locationPreset, setLocationPreset] = useState<LocationPreset>(() => {
    return (localStorage.getItem('glutex_location_preset') as LocationPreset) || 'all';
  });

  const handleSelectLocationPreset = (preset: LocationPreset) => {
    setLocationPreset(preset);
    localStorage.setItem('glutex_location_preset', preset);
  };

  // HUD accent color hue (0-360)
  const [hudAccentHue, setHudAccentHue] = useState<number>(() => {
    const saved = localStorage.getItem('glutex_hud_accent_hue');
    return saved ? parseInt(saved) : HUD_DEFAULT_HUE;
  });

  useEffect(() => {
    localStorage.setItem('glutex_hud_accent_hue', hudAccentHue.toString());
    applyHudAccentHue(hudAccentHue);
  }, [hudAccentHue]);

  // Unit system (kg/lbs)
  const [unit, setUnit] = useState<UnitSystem>(() => {
    const saved = localStorage.getItem('glute_app_unit');
    return (saved as UnitSystem) || 'kg';
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('workout');

  // Workout Logs state
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(() =>
    loadJSON<WorkoutLog[]>('glute_app_logs', [])
  );

  // Custom Splits Overrides state
  const [customSplits, setCustomSplits] = useState<Record<number, WorkoutSplit>>(() =>
    loadJSON<Record<number, WorkoutSplit>>('glute_app_custom_splits', {})
  );

  // User Created Custom Frequency Splits state
  const [userCreatedSplits, setUserCreatedSplits] = useState<WorkoutSplit[]>(() =>
    loadJSON<WorkoutSplit[]>('glute_app_user_created_splits', [])
  );

  // Active Selected Split ID
  const [activeSplitId, setActiveSplitId] = useState<string>(() => {
    return localStorage.getItem('glute_app_active_split_id') || `split-${daysPerWeek}`;
  });

  // Custom Warmup Routines state
  const [customWarmups, setCustomWarmups] = useState<MobilityRoutine[]>(() =>
    loadJSON<MobilityRoutine[]>('glute_app_custom_warmups', [])
  );

  // Active Workout Day (if modal open)
  const [activeWorkoutDayNumber, setActiveWorkoutDayNumber] = useState<number | null>(null);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('glute_app_days', daysPerWeek.toString());
  }, [daysPerWeek]);

  useEffect(() => {
    localStorage.setItem('glute_app_unit', unit);
  }, [unit]);

  useEffect(() => {
    localStorage.setItem('glute_app_logs', JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  useEffect(() => {
    localStorage.setItem('glute_app_custom_splits', JSON.stringify(customSplits));
  }, [customSplits]);

  useEffect(() => {
    localStorage.setItem('glute_app_user_created_splits', JSON.stringify(userCreatedSplits));
  }, [userCreatedSplits]);

  useEffect(() => {
    localStorage.setItem('glute_app_active_split_id', activeSplitId);
  }, [activeSplitId]);

  useEffect(() => {
    localStorage.setItem('glute_app_custom_warmups', JSON.stringify(customWarmups));
  }, [customWarmups]);

  const allMobilityRoutines = [...mobilityRoutines, ...customWarmups];
  const allAvailableSplits = [...prebuiltSplits, ...userCreatedSplits];

  const activeSplitBase: WorkoutSplit =
    allAvailableSplits.find((s) => s.id === activeSplitId) ||
    allAvailableSplits.find((s) => s.daysPerWeek === daysPerWeek) ||
    prebuiltSplits[1];

  const rawCustomSplit = customSplits[daysPerWeek];
  const isCustomized = !!rawCustomSplit;

  let activeSplit: WorkoutSplit = rawCustomSplit || transformSplitForLocation(activeSplitBase, locationPreset);

  const baseDaysCount = activeSplitBase.daysPerWeek;
  const totalDaysCount = activeSplit.days.length;
  const extraDaysCount = totalDaysCount - baseDaysCount;

  // Format dynamic split name if extra days exist and split name has not been custom renamed
  if (extraDaysCount > 0) {
    const nameWithoutSuffix = activeSplit.name.replace(/\s*\(\+\d+\s*Extra Day[s]?\)/i, '');
    activeSplit = {
      ...activeSplit,
      name: `${nameWithoutSuffix} (+${extraDaysCount} Extra Day${extraDaysCount > 1 ? 's' : ''})`
    };
  }

  const handleRenameSplit = (newTitle: string) => {
    setCustomSplits((prev) => {
      const currentBase = prev[daysPerWeek]
        ? JSON.parse(JSON.stringify(prev[daysPerWeek]))
        : JSON.parse(JSON.stringify(activeSplitBase));

      return {
        ...prev,
        [daysPerWeek]: {
          ...currentBase,
          name: newTitle
        }
      };
    });
  };

  const handleSwapExercise = (dayNumber: number, exerciseIndex: number, newExerciseId: string) => {
    setCustomSplits((prev) => {
      const currentBase = prev[daysPerWeek]
        ? JSON.parse(JSON.stringify(prev[daysPerWeek]))
        : JSON.parse(JSON.stringify(activeSplitBase));

      const updatedDays = currentBase.days.map((day: any) => {
        if (day.dayNumber === dayNumber) {
          const updatedExercises = [...day.exercises];
          updatedExercises[exerciseIndex] = {
            ...updatedExercises[exerciseIndex],
            exerciseId: newExerciseId
          };
          return { ...day, exercises: updatedExercises };
        }
        return day;
      });

      return {
        ...prev,
        [daysPerWeek]: {
          ...currentBase,
          days: updatedDays
        }
      };
    });
  };

  const handleAddExerciseToDay = (dayNumber: number, planned: PlannedExercise) => {
    setCustomSplits((prev) => {
      const currentBase = prev[daysPerWeek]
        ? JSON.parse(JSON.stringify(prev[daysPerWeek]))
        : JSON.parse(JSON.stringify(activeSplitBase));

      const updatedDays = currentBase.days.map((day: any) => {
        if (day.dayNumber === dayNumber) {
          return {
            ...day,
            exercises: [...day.exercises, planned]
          };
        }
        return day;
      });

      return {
        ...prev,
        [daysPerWeek]: {
          ...currentBase,
          days: updatedDays
        }
      };
    });
  };

  const handleRemoveExerciseFromDay = (dayNumber: number, exerciseIndex: number) => {
    setCustomSplits((prev) => {
      const currentBase = prev[daysPerWeek]
        ? JSON.parse(JSON.stringify(prev[daysPerWeek]))
        : JSON.parse(JSON.stringify(activeSplitBase));

      const updatedDays = currentBase.days.map((day: any) => {
        if (day.dayNumber === dayNumber) {
          const updatedExercises = day.exercises.filter((_: any, idx: number) => idx !== exerciseIndex);
          return { ...day, exercises: updatedExercises };
        }
        return day;
      });

      return {
        ...prev,
        [daysPerWeek]: {
          ...currentBase,
          days: updatedDays
        }
      };
    });
  };

  const handleUpdateExerciseInDay = (dayNumber: number, exerciseIndex: number, updatedFields: Partial<PlannedExercise>) => {
    setCustomSplits((prev) => {
      const currentBase = prev[daysPerWeek]
        ? JSON.parse(JSON.stringify(prev[daysPerWeek]))
        : JSON.parse(JSON.stringify(activeSplitBase));

      const updatedDays = currentBase.days.map((day: any) => {
        if (day.dayNumber === dayNumber) {
          const updatedExercises = day.exercises.map((ex: any, idx: number) => {
            if (idx === exerciseIndex) {
              return { ...ex, ...updatedFields };
            }
            return ex;
          });
          return { ...day, exercises: updatedExercises };
        }
        return day;
      });

      return {
        ...prev,
        [daysPerWeek]: {
          ...currentBase,
          days: updatedDays
        }
      };
    });
  };

  const handleReorderExerciseInDay = (dayNumber: number, fromIndex: number, toIndex: number) => {
    setCustomSplits((prev) => {
      const currentBase = prev[daysPerWeek]
        ? JSON.parse(JSON.stringify(prev[daysPerWeek]))
        : JSON.parse(JSON.stringify(activeSplitBase));

      const updatedDays = currentBase.days.map((day: any) => {
        if (day.dayNumber === dayNumber) {
          const exercises = [...day.exercises];
          if (fromIndex >= 0 && fromIndex < exercises.length && toIndex >= 0 && toIndex < exercises.length) {
            const [moved] = exercises.splice(fromIndex, 1);
            exercises.splice(toIndex, 0, moved);
          }
          return { ...day, exercises };
        }
        return day;
      });

      return {
        ...prev,
        [daysPerWeek]: {
          ...currentBase,
          days: updatedDays
        }
      };
    });
  };

  const handleAddExtraDay = (title: string, focus: string) => {
    setCustomSplits((prev) => {
      const currentBase = prev[daysPerWeek]
        ? JSON.parse(JSON.stringify(prev[daysPerWeek]))
        : JSON.parse(JSON.stringify(activeSplitBase));

      const newDayNum = currentBase.days.length + 1;
      const newDay = {
        dayNumber: newDayNum,
        title: `Day ${newDayNum}: ${title}`,
        focus: focus || 'Non-Glute Focus / Custom Day',
        estimatedMinutes: 45,
        warmupMobilityIds: ['pre-glute-activation'],
        exercises: []
      };

      return {
        ...prev,
        [daysPerWeek]: {
          ...currentBase,
          days: [...currentBase.days, newDay]
        }
      };
    });
  };

  const handleRemoveDay = (dayNumber: number) => {
    // Default days cannot be deleted
    if (dayNumber <= activeSplitBase.days.length) {
      return;
    }

    setCustomSplits((prev) => {
      const currentBase = prev[daysPerWeek]
        ? JSON.parse(JSON.stringify(prev[daysPerWeek]))
        : JSON.parse(JSON.stringify(activeSplitBase));

      if (currentBase.days.length <= activeSplitBase.days.length) return prev;

      const filteredDays = currentBase.days
        .filter((d: any) => d.dayNumber !== dayNumber)
        .map((d: any, idx: number) => ({
          ...d,
          dayNumber: idx + 1,
          title: d.title.replace(/^Day \d+:\s*/, `Day ${idx + 1}: `)
        }));

      return {
        ...prev,
        [daysPerWeek]: {
          ...currentBase,
          days: filteredDays
        }
      };
    });
  };

  const handleApplyLocationPreset = (preset: LocationPreset) => {
    localStorage.setItem('glutex_location_preset', preset);
    setCustomSplits((prev) => {
      // Transform the base split (or current split) to the chosen location preset
      const sourceSplit = activeSplitBase;
      const transformed = transformSplitForLocation(sourceSplit, preset);
      return {
        ...prev,
        [daysPerWeek]: transformed
      };
    });
  };

  const handleResetSplitToDefault = () => {
    const preset = (localStorage.getItem('glutex_location_preset') as LocationPreset) || 'all';
    if (preset === 'all' || preset === 'commercial') {
      setCustomSplits((prev) => {
        const updated = { ...prev };
        delete updated[daysPerWeek];
        return updated;
      });
    } else {
      setCustomSplits((prev) => {
        const transformed = transformSplitForLocation(activeSplitBase, preset);
        return {
          ...prev,
          [daysPerWeek]: transformed
        };
      });
    }
  };

  const handleAddWarmupToDay = (dayNumber: number, routineId: string) => {
    setCustomSplits((prev) => {
      const currentBase = prev[daysPerWeek]
        ? JSON.parse(JSON.stringify(prev[daysPerWeek]))
        : JSON.parse(JSON.stringify(activeSplitBase));

      const updatedDays = currentBase.days.map((day: any) => {
        if (day.dayNumber === dayNumber) {
          const existing = day.warmupMobilityIds || [];
          if (!existing.includes(routineId)) {
            return { ...day, warmupMobilityIds: [...existing, routineId] };
          }
        }
        return day;
      });

      return {
        ...prev,
        [daysPerWeek]: {
          ...currentBase,
          days: updatedDays
        }
      };
    });
  };

  const handleRemoveWarmupFromDay = (dayNumber: number, routineId: string) => {
    setCustomSplits((prev) => {
      const currentBase = prev[daysPerWeek]
        ? JSON.parse(JSON.stringify(prev[daysPerWeek]))
        : JSON.parse(JSON.stringify(activeSplitBase));

      const updatedDays = currentBase.days.map((day: any) => {
        if (day.dayNumber === dayNumber) {
          const existing = day.warmupMobilityIds || [];
          return {
            ...day,
            warmupMobilityIds: existing.filter((id: string) => id !== routineId)
          };
        }
        return day;
      });

      return {
        ...prev,
        [daysPerWeek]: {
          ...currentBase,
          days: updatedDays
        }
      };
    });
  };

  const handleCreateCustomWarmup = (routine: MobilityRoutine, attachToDayNumber?: number) => {
    setCustomWarmups((prev) => [...prev, routine]);
    if (attachToDayNumber !== undefined) {
      handleAddWarmupToDay(attachToDayNumber, routine.id);
    }
  };

  const handleSaveCustomSplit = (newSplit: WorkoutSplit) => {
    setUserCreatedSplits((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === newSplit.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newSplit;
        return updated;
      }
      return [...prev, newSplit];
    });
    setActiveSplitId(newSplit.id);
    setDaysPerWeek(newSplit.daysPerWeek);
  };

  const handleDeleteCustomSplit = (splitId: string) => {
    setUserCreatedSplits((prev) => prev.filter((s) => s.id !== splitId));
    if (activeSplitId === splitId) {
      setActiveSplitId('split-3');
      setDaysPerWeek(3);
    }
  };

  const handleSelectDays = (days: number, splitId?: string) => {
    setDaysPerWeek(days);
    if (splitId) {
      setActiveSplitId(splitId);
    } else {
      const found = allAvailableSplits.find((s) => s.daysPerWeek === days);
      if (found) setActiveSplitId(found.id);
    }
  };

  const handleFinishWorkout = (log: WorkoutLog) => {
    setWorkoutLogs((prev) => [log, ...prev]);
    setActiveWorkoutDayNumber(null);
    setActiveTab('progress');
  };

  const handleDeleteLog = (logId: string) => {
    setWorkoutLogs((prev) => prev.filter((l) => l.id !== logId));
  };

  const handleClearEverything = () => {
    localStorage.clear();
    setDaysPerWeek(3);
    setUnit('kg');
    setWorkoutLogs([]);
    setCustomSplits({});
    setUserCreatedSplits([]);
    setActiveSplitId('split-3');
    setCustomWarmups([]);
    setActiveWorkoutDayNumber(null);
    setActiveTab('workout');
    window.location.reload();
  };

  const activeDay = activeWorkoutDayNumber
    ? activeSplit.days.find((d) => d.dayNumber === activeWorkoutDayNumber) || null
    : null;

  return (
    <div className="min-h-screen bg-[#12161c] dark:bg-[#05070a] text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-stone-900 selection:text-white transition-colors duration-200">
      {/* Header Bar */}
      <Header
        daysPerWeek={daysPerWeek}
        totalDays={activeSplit.days.length}
        unit={unit}
        onToggleUnit={setUnit}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasActiveWorkout={activeWorkoutDayNumber !== null}
        onOpenActiveWorkout={() => {
          if (!activeWorkoutDayNumber) setActiveWorkoutDayNumber(1);
        }}
        workoutStreak={workoutLogs.length}
        onClearEverything={handleClearEverything}
        isDarkMode={isDarkMode}
        darkModePreference={darkModePreference}
        onSelectDarkModePreference={setDarkModePreference}
        locationPreset={locationPreset}
        onSelectLocationPreset={handleSelectLocationPreset}
        hudAccentHue={hudAccentHue}
        onSelectHudAccentHue={setHudAccentHue}
        onSelectDays={(days) => {
          setDaysPerWeek(days);
          setActiveSplitId(`split-${days}`);
        }}
      />

      {/* Main Tab View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'workout' && (
          <WorkoutPlanView
            split={activeSplit}
            unit={unit}
            logs={workoutLogs}
            allMobilityRoutines={allMobilityRoutines}
            onStartWorkout={(dayNum) => setActiveWorkoutDayNumber(dayNum)}
            onSelectDaysTab={() => setActiveTab('frequency')}
            onOpenAICoach={() => setActiveTab('ai-coach')}
            onSwapExercise={handleSwapExercise}
            onAddExercise={handleAddExerciseToDay}
            onRemoveExercise={handleRemoveExerciseFromDay}
            onUpdateExercise={handleUpdateExerciseInDay}
            onReorderExercise={handleReorderExerciseInDay}
            onAddExtraDay={handleAddExtraDay}
            onRemoveDay={handleRemoveDay}
            onResetSplitToDefault={handleResetSplitToDefault}
            onRenameSplit={handleRenameSplit}
            onAddWarmupToDay={handleAddWarmupToDay}
            onRemoveWarmupFromDay={handleRemoveWarmupFromDay}
            onCreateCustomWarmup={handleCreateCustomWarmup}
            onApplyLocationPreset={handleApplyLocationPreset}
            isCustomized={isCustomized}
          />
        )}

        {activeTab === 'frequency' && (
          <DaysPerWeekSelector
            currentDays={daysPerWeek}
            activeSplitId={activeSplitId}
            userCreatedSplits={userCreatedSplits}
            onSelectDays={handleSelectDays}
            onContinueToWorkout={() => setActiveTab('workout')}
            onSaveCustomSplit={handleSaveCustomSplit}
            onDeleteCustomSplit={handleDeleteCustomSplit}
          />
        )}

        {activeTab === 'mobility' && <MobilityHub customWarmups={customWarmups} />}

        {activeTab === 'library' && <ExerciseLibrary />}

        {activeTab === 'progress' && <ProgressTracker logs={workoutLogs} unit={unit} onDeleteLog={handleDeleteLog} />}

        {activeTab === 'ai-coach' && <AICoachPanel daysPerWeek={daysPerWeek} unit={unit} />}
      </main>

      {/* Footer with Trademark */}
      <footer className="border-t border-stone-200/80 bg-stone-100/50 py-6 px-4 text-center">
        <p className="text-xs text-stone-500 font-medium tracking-wide">
          © 2026 Hanna Westera™ · All Rights Reserved
        </p>
      </footer>

      {/* Live Interactive Workout Modal */}
      {activeDay && (
        <ActiveWorkoutModal
          day={activeDay}
          splitId={activeSplit.id}
          unit={unit}
          previousLogs={workoutLogs}
          onFinishWorkout={handleFinishWorkout}
          onCancelWorkout={() => setActiveWorkoutDayNumber(null)}
        />
      )}
    </div>
  );
}
