import React, { useState } from 'react';
import { X, Calendar, Plus, Trash2, Sparkles, Check, Dumbbell, Clock } from 'lucide-react';
import { WorkoutSplit, WorkoutDay, PlannedExercise } from '../types';
import { exercisesData } from '../data/exercisesData';
import { DEFAULT_WARMUP_MOBILITY_IDS } from '../utils/exerciseUtils';
import { ConfirmModal } from './ConfirmModal';
import { HudSelect } from './HudSelect';

interface CreateCustomSplitModalProps {
  initialSplit?: WorkoutSplit | null;
  onSaveSplit: (split: WorkoutSplit) => void;
  onClose: () => void;
}

const DAY_FOCUS_PRESETS = [
  {
    id: 'glute-max',
    name: 'Glute Max Heavy & Shortened Peak',
    focus: 'Barbell Hip Thrusts, Kas Glute Bridge & Heavy Peak Tension',
    exerciseIds: ['barbell-hip-thrust', 'kas-glute-bridge', 'dumbbell-sumo-squat', 'cable-glute-kickback']
  },
  {
    id: 'glute-medius',
    name: 'Glute Medius & Upper Shelf Abduction',
    focus: 'Standing Cable Abduction, Seated Machine Abduction & Side Work',
    exerciseIds: ['cable-standing-hip-abduction', 'seated-machine-hip-abduction', 'cable-glute-kickback', 'banded-side-clamshell']
  },
  {
    id: 'glute-stretch',
    name: 'Glute Stretch & Hamstring Tie-in',
    focus: 'RDLs, Bulgarian Split Squats & Glute-Focused Hinges',
    exerciseIds: ['dumbbell-rdl', 'bulgarian-split-squat-glute', 'cable-pull-through', 'hyperextension-45-glute']
  },
  {
    id: 'upper-body',
    name: 'Upper Body Push & Pull',
    focus: 'Lat Pulldowns, Incline Press, Lateral Raises & Back Rows',
    exerciseIds: ['lat-pulldown-cable', 'incline-dumbbell-press', 'dumbbell-lateral-raise', 'seated-cable-row']
  },
  {
    id: 'quads-calves',
    name: 'Quads & Legs Isolation',
    focus: 'Leg Press, Hack Squats, Leg Extensions & Calves',
    exerciseIds: ['leg-press-machine', 'hack-squat-machine', 'leg-extension-machine']
  },
  {
    id: 'full-body',
    name: 'Full Body, Core & Conditioning',
    focus: 'Compound movements, Core Stability & Energy Burn',
    exerciseIds: ['barbell-hip-thrust', 'lat-pulldown-cable', 'dumbbell-rdl', 'plank-hold']
  }
];

export const CreateCustomSplitModal: React.FC<CreateCustomSplitModalProps> = ({
  initialSplit,
  onSaveSplit,
  onClose
}) => {
  const isEditing = !!initialSplit;

  const [splitName, setSplitName] = useState<string>(
    initialSplit?.name || 'Custom Glute & Hypertrophy Split'
  );
  const [tagline, setTagline] = useState<string>(
    initialSplit?.tagline || 'Customized training frequency tailored to your individual schedule.'
  );
  const [description, setDescription] = useState<string>(
    initialSplit?.description || 'Custom workout split designed for targeted glute development and optimal recovery.'
  );
  const [idealSchedule, setIdealSchedule] = useState<string>(
    initialSplit?.idealDaysSchedule || 'Flexible Weekly Schedule'
  );

  const [daysPerWeek, setDaysPerWeek] = useState<number>(
    initialSplit?.daysPerWeek || (initialSplit?.days ? initialSplit.days.length : 4)
  );

  // Day builder state
  const [days, setDays] = useState<WorkoutDay[]>(() => {
    if (initialSplit?.days && initialSplit.days.length > 0) {
      return initialSplit.days;
    }
    // Generate default initial days based on chosen daysPerWeek
    return Array.from({ length: 4 }).map((_, idx) => {
      const preset = DAY_FOCUS_PRESETS[idx % DAY_FOCUS_PRESETS.length];
      return {
        dayNumber: idx + 1,
        title: `Day ${idx + 1}: ${preset.name}`,
        focus: preset.focus,
        estimatedMinutes: 45,
        warmupMobilityIds: DEFAULT_WARMUP_MOBILITY_IDS,
        exercises: preset.exerciseIds.map((exId) => ({
          exerciseId: exId,
          sets: 3,
          reps: '10-12',
          rpe: 'RPE 8',
          restSeconds: 90
        }))
      };
    });
  });
  const [dayIndexToRemove, setDayIndexToRemove] = useState<number | null>(null);

  // Handle changing frequency slider/number
  const handleDaysPerWeekChange = (newCount: number) => {
    setDaysPerWeek(newCount);
    if (newCount > days.length) {
      // Add missing days
      const extraNeeded = newCount - days.length;
      const newDays = [...days];
      for (let i = 0; i < extraNeeded; i++) {
        const nextNum = newDays.length + 1;
        const preset = DAY_FOCUS_PRESETS[(nextNum - 1) % DAY_FOCUS_PRESETS.length];
        newDays.push({
          dayNumber: nextNum,
          title: `Day ${nextNum}: ${preset.name}`,
          focus: preset.focus,
          estimatedMinutes: 45,
          warmupMobilityIds: DEFAULT_WARMUP_MOBILITY_IDS,
          exercises: preset.exerciseIds.map((exId) => ({
            exerciseId: exId,
            sets: 3,
            reps: '10-12',
            rpe: 'RPE 8',
            restSeconds: 90
          }))
        });
      }
      setDays(newDays);
    } else if (newCount < days.length) {
      // Trim days
      setDays(days.slice(0, newCount));
    }
  };

  const handleUpdateDay = (index: number, updatedFields: Partial<WorkoutDay>) => {
    setDays((prev) =>
      prev.map((d, idx) => (idx === index ? { ...d, ...updatedFields } : d))
    );
  };

  const handleApplyPresetToDay = (dayIndex: number, presetId: string) => {
    const preset = DAY_FOCUS_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setDays((prev) =>
      prev.map((d, idx) => {
        if (idx === dayIndex) {
          return {
            ...d,
            title: `Day ${d.dayNumber}: ${preset.name}`,
            focus: preset.focus,
            exercises: preset.exerciseIds.map((exId) => ({
              exerciseId: exId,
              sets: 3,
              reps: '10-12',
              rpe: 'RPE 8',
              restSeconds: 90
            }))
          };
        }
        return d;
      })
    );
  };

  const handleAddDay = () => {
    const nextNum = days.length + 1;
    const preset = DAY_FOCUS_PRESETS[(nextNum - 1) % DAY_FOCUS_PRESETS.length];
    const newDay: WorkoutDay = {
      dayNumber: nextNum,
      title: `Day ${nextNum}: ${preset.name}`,
      focus: preset.focus,
      estimatedMinutes: 45,
      warmupMobilityIds: DEFAULT_WARMUP_MOBILITY_IDS,
      exercises: preset.exerciseIds.map((exId) => ({
        exerciseId: exId,
        sets: 3,
        reps: '10-12',
        rpe: 'RPE 8',
        restSeconds: 90
      }))
    };
    const updated = [...days, newDay];
    setDays(updated);
    setDaysPerWeek(updated.length);
  };

  const handleRemoveDay = (index: number) => {
    if (days.length <= 1) return; // Must have at least 1 day
    const updated = days
      .filter((_, idx) => idx !== index)
      .map((d, idx) => ({
        ...d,
        dayNumber: idx + 1,
        title: d.title.replace(/^Day \d+:\s*/, `Day ${idx + 1}: `)
      }));
    setDays(updated);
    setDaysPerWeek(updated.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const customSplitId = initialSplit?.id || `custom-split-${Date.now()}`;
    const finalSplit: WorkoutSplit = {
      id: customSplitId,
      daysPerWeek: daysPerWeek,
      name: splitName.trim() || `Custom ${daysPerWeek}-Day Split`,
      tagline: tagline.trim() || 'Custom user training frequency',
      description: description.trim() || 'Personalized training split with custom exercise structure.',
      weeklyVolumeNotes: `${daysPerWeek} training sessions per week tailored to your volume goals.`,
      idealDaysSchedule: idealSchedule.trim() || `${daysPerWeek} days per week`,
      days: days.map((d, idx) => ({
        ...d,
        dayNumber: idx + 1
      }))
    };

    onSaveSplit(finalSplit);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden max-w-3xl w-full relative shadow-2xl text-stone-900 my-auto max-h-[92vh] flex flex-col hud-corners">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 p-6 sm:p-8 pb-4 bg-white shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-stone-500 text-[10px] font-bold uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5 text-stone-900" />
              <span>{isEditing ? 'Edit Custom Split' : 'New Custom Frequency'}</span>
            </div>
            <h2 className="text-2xl font-light text-stone-950 tracking-tight">
              {isEditing ? 'Edit Custom Frequency Split' : 'Create Custom Frequency Split'}
            </h2>
            <p className="text-xs text-stone-500">
              Build your own custom training frequency split with custom days, titles, and exercise structures.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 p-2 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-white">
          {/* General Split Settings */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">
              Split Overview & Frequency
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Split Name
                </label>
                <input
                  type="text"
                  required
                  value={splitName}
                  onChange={(e) => setSplitName(e.target.value)}
                  placeholder="e.g., 7-Day High Frequency Glute Blitz"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Frequency (Days / Wk)
                </label>
                <HudSelect
                  value={String(daysPerWeek)}
                  onChange={(v) => handleDaysPerWeekChange(parseInt(v))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm bg-white font-medium cursor-pointer"
                  options={[1, 2, 3, 4, 5, 6, 7].map((num) => ({
                    value: String(num),
                    label: `${num} ${num === 1 ? 'Day / Week' : 'Days / Week'}`
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Short 1-line focus description"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-stone-900 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700 block">
                  Ideal Days Schedule
                </label>
                <input
                  type="text"
                  value={idealSchedule}
                  onChange={(e) => setIdealSchedule(e.target.value)}
                  placeholder="e.g. Mon / Tue / Thu / Fri"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:border-stone-900 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Days Structure Builder */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                  Configure Workout Days ({days.length} Sessions)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Customize the title, target focus, and initial exercises for each day in your split.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddDay}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-full text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Day</span>
              </button>
            </div>

            <div className="space-y-4 max-h-[42vh] overflow-y-auto pr-1">
              {days.map((day, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-3.5 relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-900 bg-stone-200/80 px-2.5 py-0.5 rounded-md font-mono">
                      Session 0{idx + 1}
                    </span>

                    <div className="flex items-center space-x-2">
                      <HudSelect
                        value=""
                        onChange={(v) => handleApplyPresetToDay(idx, v)}
                        placeholder="Load Day Preset..."
                        className="text-[11px] font-medium bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-stone-700 cursor-pointer"
                        panelClassName="left-auto right-0 w-64"
                        options={DAY_FOCUS_PRESETS.map((p) => ({ value: p.id, label: p.name }))}
                      />

                      {days.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setDayIndexToRemove(idx)}
                          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
                          title="Remove this day"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-600 block">
                        Day Title
                      </label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => handleUpdateDay(idx, { title: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-medium bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-600 block">
                        Target Focus Description
                      </label>
                      <input
                        type="text"
                        value={day.focus}
                        onChange={(e) => handleUpdateDay(idx, { focus: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-white"
                      />
                    </div>
                  </div>

                  {/* Planned Exercises Summary Chip List */}
                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                    <div className="flex items-center space-x-1.5">
                      <Dumbbell className="w-3.5 h-3.5 text-stone-400" />
                      <span>{day.exercises.length} Exercises Configured</span>
                    </div>
                    <span className="text-[10px] text-stone-500 dark:text-stone-300 font-medium">
                      Exercises can be added/swapped anytime in the Training Plan view.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end space-x-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Save & Select Split'}</span>
            </button>
          </div>
        </form>
      </div>

      {dayIndexToRemove !== null && (
        <ConfirmModal
          title="Remove Day?"
          message={<>Remove <strong className="text-stone-900 font-semibold">Day {dayIndexToRemove + 1}</strong> from this split?</>}
          confirmLabel="Yes, Remove"
          onCancel={() => setDayIndexToRemove(null)}
          onConfirm={() => {
            handleRemoveDay(dayIndexToRemove);
            setDayIndexToRemove(null);
          }}
        />
      )}
    </div>
  );
};
