import React, { useState, useEffect, useRef } from 'react';
import { Header, DarkModePreference } from './components/Header';
import { DaysPerWeekSelector } from './components/DaysPerWeekSelector';
import { WorkoutPlanView } from './components/WorkoutPlanView';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { MobilityHub } from './components/MobilityHub';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { ProgressTracker } from './components/ProgressTracker';

// Lazy-loaded: pulls in react-markdown + remark-breaks, which most sessions
// never need if the user doesn't visit this tab. Keeping it out of the main
// bundle shrinks the JS the app has to parse before first paint.
const AICoachPanel = React.lazy(() =>
  import('./components/AICoachPanel').then((m) => ({ default: m.AICoachPanel }))
);

import { prebuiltSplits } from './data/prebuiltSplits';
import { mobilityRoutines } from './data/mobilityData';
import { WorkoutSplit, WorkoutLog, UnitSystem, PlannedExercise, MobilityRoutine } from './types';
import { transformSplitForLocation, LocationPreset, getLocalOnlySyncFields, applyLocalOnlySyncFields, DEFAULT_WARMUP_MOBILITY_IDS } from './utils/exerciseUtils';
import { applyHudAccentHue, HUD_DEFAULT_HUE } from './utils/hudTheme';
import {
  subscribeToAuthState,
  signInWithEmail,
  signUpWithEmail,
  signOutOfSync,
  pullSyncedData,
  pushSyncedData,
  SyncUser,
  SyncedData
} from './utils/firebaseSync';
import { SyncStatus } from './components/SyncPanel';
import { loadJSON, saveJSON, loadString, saveString } from './utils/storage';
import { useAndroidBackButton } from './utils/useAndroidBackButton';
import { getRestSoundSettings, saveRestSoundSettings } from './utils/restSound';

export default function App() {
  // Dark Mode preference: 'auto' | 'dark' | 'light'
  const [darkModePreference, setDarkModePreference] = useState<DarkModePreference>(() => {
    const saved = loadString('glute_app_dark_mode_pref', 'auto');
    if (saved === 'dark' || saved === 'light' || saved === 'auto') return saved as DarkModePreference;
    return 'auto';
  });

  // Derived actual isDarkMode boolean
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = loadString('glute_app_dark_mode_pref', 'auto');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync dark mode preference & device prefers-color-scheme
  useEffect(() => {
    saveString('glute_app_dark_mode_pref', darkModePreference);

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
    const saved = loadString('glute_app_days', '');
    return saved ? parseInt(saved) : 3;
  });

  // Location / Equipment Preset filter state
  const [locationPreset, setLocationPreset] = useState<LocationPreset>(() => {
    return (loadString('glutex_location_preset', '') as LocationPreset) || 'all';
  });

  const handleSelectLocationPreset = (preset: LocationPreset) => {
    setLocationPreset(preset);
    saveString('glutex_location_preset', preset);
  };

  // HUD accent color hue (0-360)
  const [hudAccentHue, setHudAccentHue] = useState<number>(() => {
    const saved = loadString('glutex_hud_accent_hue', '');
    return saved ? parseInt(saved) : HUD_DEFAULT_HUE;
  });

  useEffect(() => {
    saveString('glutex_hud_accent_hue', hudAccentHue.toString());
    applyHudAccentHue(hudAccentHue);
  }, [hudAccentHue]);

  // Unit system (kg/lbs)
  const [unit, setUnit] = useState<UnitSystem>(() => {
    const saved = loadString('glute_app_unit', '');
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
    return loadString('glute_app_active_split_id', '') || `split-${daysPerWeek}`;
  });

  // Custom Warmup Routines state
  const [customWarmups, setCustomWarmups] = useState<MobilityRoutine[]>(() =>
    loadJSON<MobilityRoutine[]>('glute_app_custom_warmups', [])
  );

  // Active Workout Day (if modal open)
  const [activeWorkoutDayNumber, setActiveWorkoutDayNumber] = useState<number | null>(null);

  // Save preferences
  useEffect(() => {
    saveString('glute_app_days', daysPerWeek.toString());
  }, [daysPerWeek]);

  useEffect(() => {
    saveString('glute_app_unit', unit);
  }, [unit]);

  useEffect(() => {
    saveJSON('glute_app_logs', workoutLogs);
  }, [workoutLogs]);

  useEffect(() => {
    saveJSON('glute_app_custom_splits', customSplits);
  }, [customSplits]);

  useEffect(() => {
    saveJSON('glute_app_user_created_splits', userCreatedSplits);
  }, [userCreatedSplits]);

  useEffect(() => {
    saveString('glute_app_active_split_id', activeSplitId);
  }, [activeSplitId]);

  useEffect(() => {
    saveJSON('glute_app_custom_warmups', customWarmups);
  }, [customWarmups]);

  // Optional cross-device cloud sync (Firebase). Entirely inactive unless a
  // Firebase project is configured via VITE_FIREBASE_* env vars -- see
  // utils/firebaseSync.ts. Nothing here runs or affects local-only usage.
  const [syncUser, setSyncUser] = useState<SyncUser | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const hasHydratedFromCloud = useRef(false);

  // Mirrors the latest synced state into a ref so the auth-state callback
  // (registered once on mount) can read current values instead of the stale
  // ones captured in its closure at mount time.
  const syncedStateRef = useRef({ workoutLogs, customSplits, userCreatedSplits, customWarmups, activeSplitId });
  useEffect(() => {
    syncedStateRef.current = { workoutLogs, customSplits, userCreatedSplits, customWarmups, activeSplitId };
  }, [workoutLogs, customSplits, userCreatedSplits, customWarmups, activeSplitId]);

  const buildSyncPayload = (): SyncedData => ({
    ...syncedStateRef.current,
    ...getLocalOnlySyncFields(),
    restSoundSettings: getRestSoundSettings()
  });

  const applyCloudData = (data: SyncedData) => {
    setWorkoutLogs(data.workoutLogs || []);
    setCustomSplits(data.customSplits || {});
    setUserCreatedSplits(data.userCreatedSplits || []);
    setCustomWarmups(data.customWarmups || []);
    if (data.activeSplitId) setActiveSplitId(data.activeSplitId);
    if (data.restSoundSettings) saveRestSoundSettings(data.restSoundSettings);
    applyLocalOnlySyncFields({
      customExercises: data.customExercises || [],
      hiddenExerciseIds: data.hiddenExerciseIds || [],
      exerciseMemory: data.exerciseMemory || {}
    });
  };

  // Local data worth protecting with a confirmation before a cloud pull would
  // silently discard it (e.g. workouts logged before ever signing in, or
  // hidden-exercise/exercise-memory choices made without logging a full
  // workout yet -- applyCloudData overwrites both of those too).
  const hasMeaningfulLocalData = () => {
    const localOnly = getLocalOnlySyncFields();
    return (
      syncedStateRef.current.workoutLogs.length > 0 ||
      Object.keys(syncedStateRef.current.customSplits).length > 0 ||
      syncedStateRef.current.userCreatedSplits.length > 0 ||
      syncedStateRef.current.customWarmups.length > 0 ||
      localOnly.customExercises.length > 0 ||
      localOnly.hiddenExerciseIds.length > 0 ||
      Object.keys(localOnly.exerciseMemory).length > 0
    );
  };

  const [pendingCloudOverwrite, setPendingCloudOverwrite] = useState<{ uid: string; data: SyncedData } | null>(null);

  // Neither choice here is a safe default to pick on the user's behalf (both
  // discard one side's data), so back just gets swallowed while this is open
  // instead of exiting the app -- the user still has to tap Use Cloud/Keep
  // Local themselves.
  useAndroidBackButton(() => {}, !!pendingCloudOverwrite);

  // Bumped on every auth transition so an in-flight pull/push from a
  // superseded sign-in (e.g. user signs out of A and into B before A's async
  // work finishes) can detect it's stale and bail out instead of applying its
  // result on top of a newer account's session.
  const authGenerationRef = useRef(0);

  // Pulls cloud data (or pushes local data up as the first sync) then flips
  // hasHydratedFromCloud once that's genuinely settled. Used both on sign-in
  // and to retry from an error state -- it never blindly pushes without first
  // confirming there's nothing on the cloud it would be stomping.
  const hydrateOrPushInitial = async (uid: string, generation: number) => {
    setSyncStatus('syncing');
    try {
      const cloudData = await pullSyncedData(uid);
      if (authGenerationRef.current !== generation) return; // superseded by a newer sign-in/out
      if (cloudData) {
        if (hasMeaningfulLocalData()) {
          // Don't silently discard local-only work -- let the user choose.
          setPendingCloudOverwrite({ uid, data: cloudData });
          setSyncStatus('idle');
          return;
        }
        applyCloudData(cloudData);
      } else {
        await pushSyncedData(uid, buildSyncPayload());
        if (authGenerationRef.current !== generation) return;
      }
      hasHydratedFromCloud.current = true;
      setSyncStatus('synced');
    } catch (err) {
      if (authGenerationRef.current !== generation) return;
      console.error('Cloud sync failed:', err);
      setSyncStatus('error');
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (user) => {
      authGenerationRef.current += 1;
      const generation = authGenerationRef.current;
      if (!user) {
        setSyncUser(null);
        setSyncStatus('idle');
        hasHydratedFromCloud.current = false;
        return;
      }
      setSyncUser(user);
      await hydrateOrPushInitial(user.uid, generation);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushNow = (uid: string) => {
    setSyncStatus('syncing');
    return pushSyncedData(uid, buildSyncPayload())
      .then(() => setSyncStatus('synced'))
      .catch((err) => {
        console.error('Cloud sync push failed:', err);
        setSyncStatus('error');
      });
  };

  // Auto-push on change, debounced so a burst of edits (e.g. logging several
  // sets in a row) doesn't fire a write per keystroke. Skipped until the
  // initial pull/push above has resolved, so it can't race and stomp a
  // just-pulled cloud copy with stale local data.
  useEffect(() => {
    if (!syncUser || !hasHydratedFromCloud.current) return;
    const timeout = setTimeout(() => pushNow(syncUser.uid), 1500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workoutLogs, customSplits, userCreatedSplits, customWarmups, syncUser]);

  // Safety-net push: custom exercises, hidden-exercise choices, and per-exercise
  // weight/rep memory live only in localStorage, not the React state watched
  // above, so edits to those alone would otherwise never trigger a sync. This
  // periodic push is a simple backstop rather than wiring change notifications
  // through every localStorage writer.
  useEffect(() => {
    if (!syncUser) return;
    const interval = setInterval(() => {
      if (hasHydratedFromCloud.current) pushNow(syncUser.uid);
    }, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncUser]);

  const handleManualSync = () => {
    if (!syncUser) return;
    if (!hasHydratedFromCloud.current) {
      // Never successfully hydrated (first sync attempt failed, etc) -- retry
      // the pull-first flow instead of pushing potentially-incomplete local
      // data over whatever's already on the cloud.
      hydrateOrPushInitial(syncUser.uid, authGenerationRef.current);
      return;
    }
    pushNow(syncUser.uid);
  };

  const resolvePendingCloudOverwrite = (choice: 'useCloud' | 'keepLocal') => {
    if (!pendingCloudOverwrite) return;
    const { uid, data } = pendingCloudOverwrite;
    if (choice === 'useCloud') {
      applyCloudData(data);
    }
    // 'keepLocal' -- leave local state as-is; the next auto-push will upload
    // it, making this device's data the new cloud copy going forward.
    hasHydratedFromCloud.current = true;
    setSyncStatus('synced');
    setPendingCloudOverwrite(null);
  };

  const allMobilityRoutines = [...mobilityRoutines, ...customWarmups];
  const allAvailableSplits = [...prebuiltSplits, ...userCreatedSplits];

  const activeSplitBase: WorkoutSplit =
    allAvailableSplits.find((s) => s.id === activeSplitId) ||
    allAvailableSplits.find((s) => s.daysPerWeek === daysPerWeek) ||
    prebuiltSplits[1];

  // A customSplits[daysPerWeek] entry is a local-edit overlay scoped to whichever
  // split was active when the edit was made (it's a clone that keeps that split's
  // id). If the user has since selected a *different* split for this day count
  // (e.g. saved a new AI-generated split), that stale overlay must not mask it.
  const rawCustomSplit = customSplits[daysPerWeek];
  const isCustomSplitStillValid = !!rawCustomSplit && rawCustomSplit.id === activeSplitBase.id;
  const isCustomized = isCustomSplitStillValid;

  let activeSplit: WorkoutSplit = isCustomSplitStillValid
    ? rawCustomSplit
    : transformSplitForLocation(activeSplitBase, locationPreset);

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
        warmupMobilityIds: DEFAULT_WARMUP_MOBILITY_IDS,
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
        syncUser={syncUser}
        syncStatus={syncStatus}
        onSyncSignIn={signInWithEmail}
        onSyncSignUp={signUpWithEmail}
        onSyncSignOut={signOutOfSync}
        onManualSync={handleManualSync}
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

        {activeTab === 'ai-coach' && (
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center py-24 text-stone-400 text-xs uppercase tracking-widest">
                Loading AI Coach...
              </div>
            }
          >
            <AICoachPanel
              daysPerWeek={daysPerWeek}
              unit={unit}
              onSaveGeneratedSplit={handleSaveCustomSplit}
              onViewSavedSplit={() => setActiveTab('frequency')}
            />
          </React.Suspense>
        )}
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

      {/* Cloud data found on sign-in while this device already has local data --
          let the user pick a side instead of silently discarding either. */}
      {pendingCloudOverwrite && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white hud-modal-solid border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-left hud-corners">
            <div className="space-y-1.5">
              <h3 className="text-xl font-medium text-stone-950">This account already has cloud data</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                This device also has workout data that hasn't been synced yet. Choose which one to keep —
                the other will be replaced.
              </p>
            </div>
            <div className="flex flex-col space-y-2.5">
              <button
                type="button"
                onClick={() => resolvePendingCloudOverwrite('useCloud')}
                className="w-full py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Use Cloud Data (replace this device's data)
              </button>
              <button
                type="button"
                onClick={() => resolvePendingCloudOverwrite('keepLocal')}
                className="w-full py-3 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Keep This Device's Data (replace the cloud copy)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
