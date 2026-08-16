import { Exercise } from '../types';
import { exercisesData } from '../data/exercisesData';

const CUSTOM_EXERCISES_KEY = 'glute_app_custom_exercises';
const HIDDEN_EXERCISES_KEY = 'glute_app_hidden_exercises';

export const getCustomExercises = (): Exercise[] => {
  try {
    const saved = localStorage.getItem(CUSTOM_EXERCISES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Failed to load custom exercises:', err);
    return [];
  }
};

export const saveCustomExercise = (newExercise: Exercise): Exercise[] => {
  try {
    const current = getCustomExercises();
    const updated = [newExercise, ...current.filter((e) => e.id !== newExercise.id)];
    localStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save custom exercise:', err);
    return getCustomExercises();
  }
};

export const deleteCustomExercise = (id: string): Exercise[] => {
  try {
    const current = getCustomExercises();
    const updated = current.filter((e) => e.id !== id);
    localStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete custom exercise:', err);
    return getCustomExercises();
  }
};

export const getHiddenExerciseIds = (): string[] => {
  try {
    const saved = localStorage.getItem(HIDDEN_EXERCISES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Failed to load hidden exercises:', err);
    return [];
  }
};

export const hideExercise = (id: string): string[] => {
  try {
    const current = getHiddenExerciseIds();
    if (!current.includes(id)) {
      const updated = [...current, id];
      localStorage.setItem(HIDDEN_EXERCISES_KEY, JSON.stringify(updated));
      return updated;
    }
    return current;
  } catch (err) {
    console.error('Failed to hide exercise:', err);
    return getHiddenExerciseIds();
  }
};

export const unhideExercise = (id: string): string[] => {
  try {
    const current = getHiddenExerciseIds();
    const updated = current.filter((item) => item !== id);
    localStorage.setItem(HIDDEN_EXERCISES_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to unhide exercise:', err);
    return getHiddenExerciseIds();
  }
};

export const getAllExercises = (): Exercise[] => {
  const custom = getCustomExercises();
  return [...custom, ...exercisesData];
};

const EXERCISE_MEMORY_KEY = 'glute_app_exercise_memory';

export interface ExerciseMemoryData {
  lastWeightKg: number;
  lastReps: number;
  sets?: { weightKg: number; reps: number }[];
  lastLoggedDate?: string;
}

export const getExerciseMemoryMap = (): Record<string, ExerciseMemoryData> => {
  try {
    const saved = localStorage.getItem(EXERCISE_MEMORY_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (err) {
    console.error('Failed to load exercise memory:', err);
    return {};
  }
};

// Picks the best-performing set (highest reps, ties broken by higher weight) to use
// as next session's target — rather than whichever set happened to be logged first.
const pickBestSet = <T extends { weightKg: number; reps: number }>(sets: T[]): T => {
  return sets.reduce((best, current) => {
    if (current.reps > best.reps) return current;
    if (current.reps === best.reps && current.weightKg > best.weightKg) return current;
    return best;
  }, sets[0]);
};

export const saveExerciseMemory = (exerciseId: string, sets: { weightKg: number; reps: number }[]) => {
  try {
    if (!sets || sets.length === 0) return;
    const currentMap = getExerciseMemoryMap();
    const validSets = sets.filter((s) => s.weightKg > 0 || s.reps > 0);
    if (validSets.length === 0) return;

    // Use the best set's weight & reps as the baseline default for next session
    const bestSet = pickBestSet(validSets);
    currentMap[exerciseId] = {
      lastWeightKg: bestSet.weightKg,
      lastReps: bestSet.reps,
      sets: validSets.map(() => ({ weightKg: bestSet.weightKg, reps: bestSet.reps })),
      lastLoggedDate: new Date().toISOString()
    };

    localStorage.setItem(EXERCISE_MEMORY_KEY, JSON.stringify(currentMap));
  } catch (err) {
    console.error('Failed to save exercise memory:', err);
  }
};

export const getLastLoggedForExercise = (
  exerciseId: string,
  previousLogs: any[]
): { weightKg: number; reps: number; sets?: { weightKg: number; reps: number }[] } | null => {
  if (previousLogs && previousLogs.length > 0) {
    for (const log of previousLogs) {
      const foundEx = log.exercises?.find((e: any) => e.exerciseId === exerciseId);
      if (foundEx && foundEx.sets && foundEx.sets.length > 0) {
        const completedOrWeighted = foundEx.sets.filter((s: any) => s.completed || s.weightKg > 0);
        if (completedOrWeighted.length > 0) {
          // Best set (highest reps, ties broken by weight) becomes the benchmark for all sets
          const bestSet = pickBestSet(completedOrWeighted);
          return {
            weightKg: bestSet.weightKg,
            reps: bestSet.reps,
            sets: completedOrWeighted.map(() => ({ weightKg: bestSet.weightKg, reps: bestSet.reps }))
          };
        }
      }
    }
  }

  const memoryMap = getExerciseMemoryMap();
  if (memoryMap[exerciseId]) {
    const mem = memoryMap[exerciseId];
    return {
      weightKg: mem.lastWeightKg,
      reps: mem.lastReps,
      sets: mem.sets ? mem.sets.map(() => ({ weightKg: mem.lastWeightKg, reps: mem.lastReps })) : undefined
    };
  }

  return null;
};

export type LocationPreset = 'all' | 'commercial' | 'home' | 'cable';

const HOME_PRIMARY_MAP: Record<string, string> = {
  'barbell-hip-thrust': 'dumbbell-hip-thrust',
  'kas-glute-bridge': 'frog-pump',
  'smith-machine-hip-thrust': 'dumbbell-hip-thrust',
  'barbell-rdl': 'dumbbell-rdl',
  'cable-pull-through': 'dumbbell-rdl',
  'seated-machine-hip-abduction': 'banded-side-clamshell',
  'cable-standing-hip-abduction': 'lateral-band-walk',
  'cable-glute-kickback': 'dumbbell-kickback',
  'barbell-back-squat': 'dumbbell-sumo-squat',
  'leg-press-machine': 'dumbbell-walking-lunge',
  'leg-extension-machine': 'step-up-glute-bias',
  'lying-leg-curl': 'single-leg-dumbbell-rdl',
  'lat-pulldown-cable': 'single-arm-dumbbell-row',
  'seated-cable-row': 'single-arm-dumbbell-row',
  'barbell-bent-over-row': 'single-arm-dumbbell-row',
  'barbell-bench-press': 'incline-dumbbell-press',
  'cable-chest-fly': 'bodyweight-pushup',
  'cable-tricep-pushdown': 'dumbbell-overhead-press'
};

const HOME_FALLBACKS: Record<string, string[]> = {
  'dumbbell-hip-thrust': ['frog-pump', 'single-leg-dumbbell-rdl'],
  'frog-pump': ['dumbbell-hip-thrust', 'single-leg-dumbbell-rdl'],
  'dumbbell-rdl': ['single-leg-dumbbell-rdl', 'deficit-reverse-lunge'],
  'banded-side-clamshell': ['lateral-band-walk', 'side-lying-hip-abduction'],
  'lateral-band-walk': ['banded-side-clamshell', 'side-lying-hip-abduction'],
  'dumbbell-kickback': ['hyperextension-45-glute', 'banded-side-clamshell'],
  'dumbbell-sumo-squat': ['dumbbell-walking-lunge', 'step-up-glute-bias'],
  'dumbbell-walking-lunge': ['step-up-glute-bias', 'bulgarian-split-squat-glute'],
  'single-arm-dumbbell-row': ['bodyweight-pushup', 'incline-dumbbell-press']
};

const CABLE_PRIMARY_MAP: Record<string, string> = {
  'barbell-hip-thrust': 'smith-machine-hip-thrust',
  'kas-glute-bridge': 'cable-glute-kickback',
  'dumbbell-hip-thrust': 'smith-machine-hip-thrust',
  'frog-pump': 'smith-machine-hip-thrust',
  'barbell-rdl': 'cable-pull-through',
  'dumbbell-rdl': 'cable-pull-through',
  'single-leg-dumbbell-rdl': 'cable-pull-through',
  'bulgarian-split-squat-glute': 'leg-press-machine',
  'deficit-reverse-lunge': 'leg-press-machine',
  'step-up-glute-bias': 'leg-press-machine',
  'dumbbell-walking-lunge': 'leg-press-machine',
  'barbell-back-squat': 'leg-press-machine',
  'dumbbell-sumo-squat': 'leg-press-machine',
  'banded-side-clamshell': 'seated-machine-hip-abduction',
  'lateral-band-walk': 'cable-standing-hip-abduction',
  'side-lying-hip-abduction': 'seated-machine-hip-abduction',
  'dumbbell-kickback': 'cable-glute-kickback',
  'single-arm-dumbbell-row': 'seated-cable-row',
  'barbell-bent-over-row': 'seated-cable-row',
  'incline-dumbbell-press': 'cable-chest-fly',
  'barbell-bench-press': 'cable-chest-fly',
  'bodyweight-pushup': 'cable-chest-fly',
  'dumbbell-overhead-press': 'cable-tricep-pushdown',
  'dumbbell-bicep-curl': 'cable-tricep-pushdown'
};

const CABLE_FALLBACKS: Record<string, string[]> = {
  'smith-machine-hip-thrust': ['cable-glute-kickback', 'cable-pull-through'],
  'cable-pull-through': ['lying-leg-curl', 'seated-machine-hip-abduction'],
  'leg-press-machine': ['leg-extension-machine', 'lying-leg-curl'],
  'seated-machine-hip-abduction': ['cable-standing-hip-abduction', 'cable-glute-kickback'],
  'cable-standing-hip-abduction': ['seated-machine-hip-abduction', 'cable-glute-kickback'],
  'cable-glute-kickback': ['cable-standing-hip-abduction', 'smith-machine-hip-thrust']
};

const COMMERCIAL_PRIMARY_MAP: Record<string, string> = {
  'dumbbell-hip-thrust': 'barbell-hip-thrust',
  'smith-machine-hip-thrust': 'barbell-hip-thrust',
  'dumbbell-kickback': 'cable-glute-kickback',
  'lateral-band-walk': 'cable-standing-hip-abduction',
  'banded-side-clamshell': 'seated-machine-hip-abduction',
  'side-lying-hip-abduction': 'seated-machine-hip-abduction',
  'cable-pull-through': 'barbell-rdl',
  'dumbbell-sumo-squat': 'barbell-back-squat',
  'bodyweight-pushup': 'cable-chest-fly',
  'single-arm-dumbbell-row': 'lat-pulldown-cable'
};

export const transformSplitForLocation = (
  split: any,
  targetPreset: LocationPreset
): any => {
  if (!split || !split.days) return split;

  let primaryMap: Record<string, string> = {};
  let fallbackMap: Record<string, string[]> = {};

  if (targetPreset === 'home') {
    primaryMap = HOME_PRIMARY_MAP;
    fallbackMap = HOME_FALLBACKS;
  } else if (targetPreset === 'cable') {
    primaryMap = CABLE_PRIMARY_MAP;
    fallbackMap = CABLE_FALLBACKS;
  } else {
    // Commercial gym or all equipment
    primaryMap = COMMERCIAL_PRIMARY_MAP;
    fallbackMap = {};
  }

  return {
    ...split,
    days: split.days.map((day: any) => {
      const usedIdsInDay = new Set<string>();

      return {
        ...day,
        exercises: day.exercises.map((item: any) => {
          let targetId = primaryMap[item.exerciseId] || item.exerciseId;

          // Deduplicate if targetId is already present in this day
          if (usedIdsInDay.has(targetId)) {
            const fallbacks = fallbackMap[targetId] || [];
            const unusedFallback = fallbacks.find((fb) => !usedIdsInDay.has(fb));
            if (unusedFallback) {
              targetId = unusedFallback;
            } else if (!usedIdsInDay.has(item.exerciseId)) {
              targetId = item.exerciseId;
            }
          }

          usedIdsInDay.add(targetId);
          return {
            ...item,
            exerciseId: targetId
          };
        })
      };
    })
  };
};


