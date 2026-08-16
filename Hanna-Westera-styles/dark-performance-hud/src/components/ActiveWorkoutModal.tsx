import React, { useState, useEffect, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Check, Clock, Plus, Trash2, Award, ArrowLeft, Volume2, VolumeX, Flame, RefreshCw, RotateCcw } from 'lucide-react';
import { WorkoutDay, LoggedExercise, LoggedSet, WorkoutLog, UnitSystem, PlannedExercise } from '../types';
import { getAllExercises, getLastLoggedForExercise, saveExerciseMemory } from '../utils/exerciseUtils';
import { playRestSound } from '../utils/restSound';
import { ExerciseSwapModal } from './ExerciseSwapModal';
import { AddExerciseModal } from './AddExerciseModal';
import { ConfirmModal } from './ConfirmModal';

interface ActiveWorkoutModalProps {
  day: WorkoutDay;
  splitId: string;
  unit: UnitSystem;
  previousLogs: WorkoutLog[];
  onFinishWorkout: (log: WorkoutLog) => void;
  onCancelWorkout: () => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  day,
  splitId,
  unit,
  previousLogs,
  onFinishWorkout,
  onCancelWorkout
}) => {
  // Elapsed workout time — derived from a fixed start timestamp (not an incrementing
  // counter) so it stays accurate even when the tab/screen is backgrounded. Mobile
  // browsers throttle setInterval heavily in the background, which previously made
  // the displayed duration undercount the real elapsed time.
  const workoutStartRef = useRef<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Active Exercises state with previous weight/reps auto-recalled
  const [loggedExercises, setLoggedExercises] = useState<LoggedExercise[]>(() => {
    const allExercises = getAllExercises();
    return day.exercises.map((planned) => {
      const exDetail = allExercises.find((e) => e.id === planned.exerciseId);
      const prevData = getLastLoggedForExercise(planned.exerciseId, previousLogs);

      // Default sets based on planned reps or remembered values
      const initialSets: LoggedSet[] = Array.from({ length: planned.sets }, (_, i) => {
        const prevSet = prevData?.sets?.[i] || prevData?.sets?.[0];
        const defaultWeight = prevSet ? prevSet.weightKg : (prevData?.weightKg || 0);
        const defaultReps = prevSet ? prevSet.reps : (parseInt(planned.reps) || 10);

        return {
          setNumber: i + 1,
          weightKg: defaultWeight,
          reps: defaultReps,
          completed: false
        };
      });

      return {
        exerciseId: planned.exerciseId,
        exerciseName: exDetail ? exDetail.name : planned.exerciseId.replace(/-/g, ' '),
        sets: initialSets
      };
    });
  });

  // Rest Timer State — counts down against a fixed end timestamp for the same
  // background-throttling reason as the workout timer above.
  const restEndTimeRef = useRef<number>(0);
  const [restTimerSeconds, setRestTimerSeconds] = useState<number>(0);
  const [restTimerActive, setRestTimerActive] = useState<boolean>(false);
  const [restTimerEnabled, setRestTimerEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Completion modal state
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [feelingRating, setFeelingRating] = useState<number>(5);
  const [workoutNotes, setWorkoutNotes] = useState<string>('');
  const [swappingExerciseIndex, setSwappingExerciseIndex] = useState<number | null>(null);
  const [isAddingLiveExercise, setIsAddingLiveExercise] = useState<boolean>(false);
  const [exerciseToRemove, setExerciseToRemove] = useState<{ index: number; name: string } | null>(null);
  const [setToRemove, setSetToRemove] = useState<{ exIdx: number; setIdx: number; setNumber: number } | null>(null);

  const handleAddLiveExercise = (planned: PlannedExercise) => {
    const ex = getAllExercises().find((e) => e.id === planned.exerciseId);
    const prevData = getLastLoggedForExercise(planned.exerciseId, previousLogs);

    setLoggedExercises((prev) => [
      ...prev,
      {
        exerciseId: planned.exerciseId,
        exerciseName: ex ? ex.name : planned.exerciseId.replace(/-/g, ' '),
        sets: Array.from({ length: Math.max(1, planned.sets || 3) }).map((_, idx) => {
          const prevSet = prevData?.sets?.[idx] || prevData?.sets?.[0];
          return {
            setNumber: idx + 1,
            weightKg: prevSet ? prevSet.weightKg : (prevData?.weightKg || 0),
            reps: prevSet ? prevSet.reps : (parseInt(planned.reps) || 10),
            completed: false
          };
        })
      }
    ]);
    setIsAddingLiveExercise(false);
  };


  // Workout duration timer — recomputed from wall-clock time on every tick and
  // whenever the tab regains focus, so it self-corrects instantly instead of
  // staying stuck at a throttled/paused count.
  useEffect(() => {
    const tick = () => {
      setElapsedSeconds(Math.floor((Date.now() - workoutStartRef.current) / 1000));
    };
    tick();
    const timer = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', tick);
    };
  }, []);

  // Rest countdown timer — same wall-clock approach against a fixed end timestamp.
  useEffect(() => {
    if (!restTimerActive) return;

    const tick = () => {
      const remaining = Math.max(0, Math.round((restEndTimeRef.current - Date.now()) / 1000));
      setRestTimerSeconds(remaining);
      if (remaining === 0) {
        setRestTimerActive(false);
        if (soundEnabled) {
          playRestSound();
        }
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [restTimerActive, soundEnabled]);

  // Warn before an accidental tab close/refresh loses the in-progress session.
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Android's system back gesture/button bypasses all in-page UI and would
  // otherwise close the app outright. Registering a listener here hands control
  // to us instead of the OS default: show the exit-confirmation (or, if it's
  // already open, treat a second back press as Cancel) rather than exiting.
  // No-ops harmlessly on web, where this plugin has no native back gesture to hook.
  useEffect(() => {
    const listenerPromise = CapacitorApp.addListener('backButton', () => {
      setShowExitConfirm((prev) => !prev);
    });
    return () => {
      listenerPromise.then((handle) => handle.remove());
    };
  }, []);

  const startRestTimer = (seconds: number) => {
    restEndTimeRef.current = Date.now() + seconds * 1000;
    setRestTimerSeconds(seconds);
    setRestTimerActive(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Find previous performance for progressive overload hint
  const getPreviousPerformance = (exerciseId: string) => {
    const prev = getLastLoggedForExercise(exerciseId, previousLogs);
    if (prev && (prev.weightKg > 0 || prev.reps > 0)) {
      return `${prev.weightKg}${unit} × ${prev.reps} reps`;
    }
    return null;
  };

  const handleDeleteExercise = (exIndex: number) => {
    setLoggedExercises((prev) => prev.filter((_, idx) => idx !== exIndex));
  };

  const handleSetChange = (
    exIndex: number,
    setIndex: number,
    field: 'weightKg' | 'reps' | 'completed',
    value: any
  ) => {
    setLoggedExercises((prev) => {
      const updated = [...prev];
      const ex = { ...updated[exIndex] };
      const sets = [...ex.sets];

      sets[setIndex] = {
        ...sets[setIndex],
        [field]: value
      };

      ex.sets = sets;
      updated[exIndex] = ex;

      // Save memory for this exercise
      saveExerciseMemory(ex.exerciseId, sets);

      return updated;
    });

    // If set was just checked complete, trigger rest timer if enabled and target rest > 0
    if (field === 'completed' && value === true && restTimerEnabled) {
      const currentEx = loggedExercises[exIndex];
      const planned = day.exercises.find((p) => p.exerciseId === currentEx?.exerciseId) || day.exercises[exIndex];
      const restTarget = planned ? planned.restSeconds : 0;
      if (restTarget > 0) {
        startRestTimer(restTarget);
      }
    }
  };

  const addSet = (exIndex: number) => {
    setLoggedExercises((prev) => {
      const updated = [...prev];
      const ex = { ...updated[exIndex] };
      const lastSet = ex.sets[ex.sets.length - 1];

      ex.sets = [
        ...ex.sets,
        {
          setNumber: ex.sets.length + 1,
          weightKg: lastSet ? lastSet.weightKg : 0,
          reps: lastSet ? lastSet.reps : 10,
          completed: false
        }
      ];

      updated[exIndex] = ex;
      return updated;
    });
  };

  const deleteSet = (exIndex: number, setIndex: number) => {
    setLoggedExercises((prev) => {
      const updated = [...prev];
      const ex = { ...updated[exIndex] };

      ex.sets = ex.sets
        .filter((_, idx) => idx !== setIndex)
        .map((set, idx) => ({ ...set, setNumber: idx + 1 }));

      updated[exIndex] = ex;
      return updated;
    });
  };

  const handleFinishClick = () => {
    setShowSummary(true);
  };

  const handleFinalSave = () => {
    // Persist last used weights & reps into memory map for future sessions
    loggedExercises.forEach((ex) => {
      saveExerciseMemory(ex.exerciseId, ex.sets);
    });

    const log: WorkoutLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
      splitId,
      dayNumber: day.dayNumber,
      dayTitle: day.title,
      durationSeconds: elapsedSeconds,
      exercises: loggedExercises,
      notes: workoutNotes,
      feelingRating
    };

    onFinishWorkout(log);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-50 text-stone-900 flex flex-col overflow-hidden">
      {/* Sticky Top Header */}
      <div className="bg-white border-b border-stone-200 px-3.5 sm:px-6 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0 shadow-2xs">
        {/* Top bar on mobile / Left section on desktop */}
        <div className="flex items-center justify-between min-w-0 gap-2 w-full sm:w-auto">
          <div className="flex items-center space-x-2.5 min-w-0">
            <button
              onClick={() => setShowExitConfirm(true)}
              className="p-1.5 sm:p-2 rounded-full bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors shrink-0 cursor-pointer"
              title="Exit Session"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block leading-tight">
                Active Session
              </span>
              <h2
                className="text-xs sm:text-base font-semibold text-stone-950 leading-tight mt-0.5 truncate"
                title={`Day ${day.dayNumber}: ${day.title.replace(/^Day \d+:\s*/, '')}`}
              >
                Day {day.dayNumber}: {day.title.replace(/^Day \d+:\s*/, '')}
              </h2>
            </div>
          </div>

          {/* Complete Session Button on Mobile */}
          <button
            onClick={handleFinishClick}
            className="sm:hidden bg-stone-900 hover:bg-stone-800 text-white font-medium text-[11px] px-3 py-1.5 rounded-full shadow-2xs uppercase tracking-wider transition-all shrink-0 whitespace-nowrap cursor-pointer"
          >
            Complete
          </button>
        </div>

        {/* Timers & Desktop Action */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t border-stone-100 pt-2 sm:border-t-0 sm:pt-0">
          <div className="flex items-center space-x-2">
            {/* Rest Timer ON/OFF Toggle */}
            <button
              onClick={() => setRestTimerEnabled(!restTimerEnabled)}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border text-xs font-semibold flex items-center space-x-1.5 transition-colors shrink-0 cursor-pointer ${
                restTimerEnabled
                  ? 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
              title={restTimerEnabled ? 'Auto rest timer is active' : 'Auto rest timer is disabled'}
            >
              <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span className="whitespace-nowrap">Rest: {restTimerEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Workout Elapsed Timer */}
            <div className="bg-stone-100 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-stone-200/80 font-mono text-xs sm:text-sm font-semibold glow-text-cyan flex items-center space-x-1.5 shrink-0">
              <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
          </div>

          {/* Complete Session Button on Desktop */}
          <button
            onClick={handleFinishClick}
            className="hidden sm:inline-flex bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs px-4 py-2 rounded-full shadow-2xs uppercase tracking-wider transition-all shrink-0 whitespace-nowrap cursor-pointer"
          >
            Complete Session
          </button>
        </div>
      </div>

      {/* Floating Rest Timer Bar */}
      {restTimerSeconds > 0 && (
        <div className="bg-stone-900 text-stone-100 px-6 py-3 flex items-center justify-between shadow-md text-xs font-medium border-b-2 border-cyan-400/60 animate-fadeIn glow-border-cyan">
          <div className="flex items-center space-x-3">
            <Clock className="w-4 h-4 text-cyan-300 animate-spin" />
            <span className="tracking-wide uppercase text-[10px] text-stone-400">Rest Period</span>
            <strong className="font-mono text-2xl glow-text-cyan tracking-tight">{formatTime(restTimerSeconds)}</strong>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                restEndTimeRef.current += 30 * 1000;
                setRestTimerSeconds((prev) => prev + 30);
              }}
              className="bg-stone-800 hover:bg-stone-700 px-2.5 py-1 rounded-full text-[10px] font-mono border border-cyan-500/30"
            >
              +30s
            </button>
            <button
              onClick={() => {
                setRestTimerSeconds(0);
                setRestTimerActive(false);
              }}
              className="bg-stone-800 hover:bg-stone-700 px-2.5 py-1 rounded-full text-[10px]"
            >
              Skip Rest
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 hover:bg-stone-800 rounded-full"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-stone-300" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
            </button>
          </div>
        </div>
      )}

      {/* Main Exercises Logging Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full">
        {loggedExercises.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
            <p className="text-stone-500 text-sm">All exercises removed from this session.</p>
            <p className="text-stone-400 text-xs">Your main split routine definition remains unchanged.</p>
          </div>
        ) : (
          loggedExercises.map((ex, exIdx) => {
            const planned = day.exercises.find((p) => p.exerciseId === ex.exerciseId) || day.exercises[exIdx];
            const prevPerformance = getPreviousPerformance(ex.exerciseId);

            return (
              <div
                key={exIdx}
                className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs hud-corners"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-lg font-medium text-stone-950">{ex.exerciseName}</h3>
                      <button
                        type="button"
                        onClick={() => setSwappingExerciseIndex(exIdx)}
                        className="p-1.5 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Swap exercise or change equipment"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setExerciseToRemove({ index: exIdx, name: ex.exerciseName })}
                        className="p-1.5 text-stone-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove exercise from this session (won't affect main routine)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-stone-500 mt-0.5">
                      <span>Target: <span className="font-mono">{planned?.reps || '10'}</span> reps (<span className="font-mono">{planned?.rpe || 'RPE 8'}</span>)</span>
                      <span>·</span>
                      <span>Rest: <span className="font-mono">{planned && planned.restSeconds > 0 ? `${planned.restSeconds}s` : 'None'}</span></span>
                    </div>
                  </div>

                {prevPerformance && (
                  <div className="text-[11px] bg-stone-100 border border-stone-200/80 text-stone-700 px-3 py-1 rounded-full font-medium self-start sm:self-auto flex items-center space-x-1">
                    <Flame className="w-3 h-3 text-stone-800" />
                    <span>Previous Best: <span className="font-mono">{prevPerformance}</span></span>
                  </div>
                )}
              </div>

              {/* Table of Sets */}
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-1.5 sm:gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 px-2">
                  <div className="col-span-2">Set</div>
                  <div className="col-span-3">Weight ({unit})</div>
                  <div className="col-span-3">Reps</div>
                  <div className="col-span-4 text-center">Done</div>
                </div>

                {ex.sets.map((set, setIdx) => (
                  <div
                    key={setIdx}
                    className={`grid grid-cols-12 gap-1.5 sm:gap-2 items-center p-2 rounded-2xl border transition-colors ${
                      set.completed
                        ? 'bg-stone-900 border-lime-400/50 text-white shadow-[0_0_16px_-4px_rgba(198,255,0,0.55)]'
                        : 'bg-stone-50 border-stone-200/80 text-stone-900'
                    }`}
                  >
                    <div className={`col-span-2 text-xs font-bold font-mono pl-1 sm:pl-2 ${set.completed ? 'text-lime-300' : 'text-stone-500'}`}>
                      0{set.setNumber}
                    </div>

                    <div className="col-span-3">
                      <input
                        type="number"
                        value={set.weightKg || ''}
                        onChange={(e) =>
                          handleSetChange(exIdx, setIdx, 'weightKg', parseFloat(e.target.value) || 0)
                        }
                        placeholder="0"
                        className={`w-full border rounded-xl px-2 py-1.5 text-xs text-center font-mono font-semibold focus:outline-none ${
                          set.completed
                            ? 'bg-stone-800 border-stone-700 text-white focus:border-lime-400'
                            : 'bg-white border-stone-200 text-stone-900 focus:border-stone-400'
                        }`}
                      />
                    </div>

                    <div className="col-span-3">
                      <input
                        type="number"
                        value={set.reps || ''}
                        onChange={(e) =>
                          handleSetChange(exIdx, setIdx, 'reps', parseInt(e.target.value) || 0)
                        }
                        placeholder="10"
                        className={`w-full border rounded-xl px-2 py-1.5 text-xs text-center font-mono font-semibold focus:outline-none ${
                          set.completed
                            ? 'bg-stone-800 border-stone-700 text-white focus:border-lime-400'
                            : 'bg-white border-stone-200 text-stone-900 focus:border-stone-400'
                        }`}
                      />
                    </div>

                    <div className="col-span-4 flex items-center justify-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleSetChange(exIdx, setIdx, 'completed', !set.completed)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                          set.completed
                            ? 'bg-lime-400 text-stone-950 shadow-[0_0_14px_-2px_rgba(198,255,0,0.8)] border-2 border-lime-300'
                            : 'border-2 border-stone-300 bg-white hover:border-stone-400 text-stone-300 hover:text-stone-500'
                        }`}
                        title={set.completed ? 'Mark set as incomplete' : 'Mark set as completed'}
                      >
                        <Check className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[3] ${set.completed ? 'text-stone-950' : 'opacity-40'}`} />
                      </button>

                      {ex.sets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setSetToRemove({ exIdx, setIdx, setNumber: set.setNumber })}
                          className={`p-1.5 rounded-lg shrink-0 transition-colors cursor-pointer ${
                            set.completed ? 'text-stone-400 hover:text-white hover:bg-stone-800' : 'text-stone-400 hover:text-rose-600 hover:bg-stone-100'
                          }`}
                          title="Delete set"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addSet(exIdx)}
                className="w-full py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold uppercase tracking-wider rounded-2xl flex items-center justify-center space-x-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Set</span>
              </button>
            </div>
          );
        }))}

        {/* Add Extra Exercise to Live Session Button */}
        <button
          onClick={() => setIsAddingLiveExercise(true)}
          className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-stone-200 hover:border-stone-400 bg-stone-50 hover:bg-stone-100/70 text-stone-900 font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4 text-stone-900" />
          <span>Add Extra Exercise to Live Session</span>
        </button>
      </div>

      {/* Summary / Save Modal */}
      {showSummary && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl text-stone-900 hud-corners-lime hud-corners">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto shadow-xs glow-border-lime">
                <Award className="w-6 h-6 text-lime-400" />
              </div>
              <h3 className="text-2xl font-light text-stone-950 tracking-tight">Session Finished</h3>
              <p className="text-xs text-stone-500">
                Duration: <span className="font-mono font-semibold glow-text-cyan">{formatTime(elapsedSeconds)}</span>
              </p>
            </div>

            {/* How did it feel rating */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block text-center">
                Perceived Effort & Feeling
              </label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeelingRating(star)}
                    className={`w-10 h-10 rounded-full font-mono font-semibold text-xs flex items-center justify-center transition-all ${
                      feelingRating === star
                        ? 'bg-stone-900 text-white shadow-xs glow-border-cyan'
                        : 'bg-stone-100 border border-stone-200 text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    {star}★
                  </button>
                ))}
              </div>
            </div>

            {/* Workout Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block">
                Session Notes & Achievements
              </label>
              <textarea
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                placeholder="e.g. Added weight on hip thrusts. Great glute max pump!"
                rows={3}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setShowSummary(false)}
                className="w-1/2 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs rounded-full uppercase tracking-wider"
              >
                Return
              </button>
              <button
                onClick={handleFinalSave}
                className="w-1/2 py-3 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded-full shadow-xs uppercase tracking-wider"
              >
                Save Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Swap Modal during Active Workout */}
      {swappingExerciseIndex !== null && loggedExercises[swappingExerciseIndex] && (
        <ExerciseSwapModal
          currentExerciseId={loggedExercises[swappingExerciseIndex].exerciseId}
          onSelectExercise={(newExerciseId) => {
            const newEx = getAllExercises().find((e) => e.id === newExerciseId);
            setLoggedExercises((prev) => {
              const updated = [...prev];
              updated[swappingExerciseIndex] = {
                ...updated[swappingExerciseIndex],
                exerciseId: newExerciseId,
                exerciseName: newEx ? newEx.name : newExerciseId.replace(/-/g, ' ')
              };
              return updated;
            });
            setSwappingExerciseIndex(null);
          }}
          onClose={() => setSwappingExerciseIndex(null)}
        />
      )}

      {/* Add Exercise Modal during Active Workout */}
      {isAddingLiveExercise && (
        <AddExerciseModal
          dayTitle={day.title}
          onAddExercise={handleAddLiveExercise}
          onClose={() => setIsAddingLiveExercise(false)}
        />
      )}

      {exerciseToRemove && (
        <ConfirmModal
          title="Remove Exercise?"
          message={<>Remove <strong className="text-stone-900 font-semibold">{exerciseToRemove.name}</strong> from this session? This won't affect your main routine.</>}
          confirmLabel="Yes, Remove"
          onCancel={() => setExerciseToRemove(null)}
          onConfirm={() => {
            handleDeleteExercise(exerciseToRemove.index);
            setExerciseToRemove(null);
          }}
        />
      )}

      {setToRemove && (
        <ConfirmModal
          title="Delete Set?"
          message={<>Delete set <strong className="text-stone-900 font-semibold">{setToRemove.setNumber}</strong>?</>}
          confirmLabel="Yes, Delete"
          onCancel={() => setSetToRemove(null)}
          onConfirm={() => {
            deleteSet(setToRemove.exIdx, setToRemove.setIdx);
            setSetToRemove(null);
          }}
        />
      )}

      {showExitConfirm && (
        <ConfirmModal
          title="Exit Session?"
          message="Are you sure you want to exit? This session hasn't been saved yet and all logged sets will be lost."
          confirmLabel="Exit Without Saving"
          onCancel={() => setShowExitConfirm(false)}
          onConfirm={() => {
            setShowExitConfirm(false);
            onCancelWorkout();
          }}
        />
      )}
    </div>
  );
};
