import React, { useState } from 'react';
import { Activity, Plus, Trash2, Check, Sparkles, X } from 'lucide-react';
import { MobilityRoutine, MobilityStep } from '../types';

interface AddWarmupModalProps {
  existingRoutines: MobilityRoutine[];
  currentWarmupIds: string[];
  dayNumber: number;
  onClose: () => void;
  onSelectRoutine: (routineId: string) => void;
  onCreateCustomRoutine: (newRoutine: MobilityRoutine) => void;
}

export const AddWarmupModal: React.FC<AddWarmupModalProps> = ({
  existingRoutines,
  currentWarmupIds,
  dayNumber,
  onClose,
  onSelectRoutine,
  onCreateCustomRoutine
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');

  // Custom Warmup Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MobilityRoutine['category']>('Pre-Workout Activation');
  const [durationMinutes, setDurationMinutes] = useState<number>(5);
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<MobilityStep[]>([
    {
      name: '',
      durationOrReps: '45 seconds',
      instructions: '',
      keyBenefit: 'Wakes up targeted muscle group',
      targetArea: 'Glutes & Hips'
    }
  ]);

  const handleAddStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        name: '',
        durationOrReps: '45 seconds',
        instructions: '',
        keyBenefit: 'Warmup activation',
        targetArea: 'Hips / Glutes'
      }
    ]);
  };

  const handleUpdateStep = (index: number, field: keyof MobilityStep, value: string) => {
    setSteps((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, [field]: value } : s))
    );
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRoutine: MobilityRoutine = {
      id: `custom-warmup-${Date.now()}`,
      name: name.trim(),
      category,
      durationMinutes: Math.max(1, durationMinutes),
      description: description.trim() || 'Custom warm-up routine designed for optimal priming.',
      steps: steps.map((s) => ({
        name: s.name.trim() || 'Warm-Up Exercise',
        durationOrReps: s.durationOrReps.trim() || '45s',
        instructions: s.instructions.trim() || 'Perform smoothly with good form.',
        keyBenefit: s.keyBenefit.trim() || 'Muscle readiness & joint prep',
        targetArea: s.targetArea.trim() || 'Lower Body'
      }))
    };

    onCreateCustomRoutine(newRoutine);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden max-w-3xl sm:max-w-4xl w-full relative shadow-2xl text-stone-900 my-auto max-h-[92vh] h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 p-6 sm:p-8 pb-4 bg-white shrink-0">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-widest text-stone-500 mb-1">
              <Activity className="w-3.5 h-3.5 text-stone-700" />
              <span>Day {dayNumber} Warm-Up & Mobility</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-light text-stone-950">
              Add Warm-Up Routine
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 p-2 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-stone-200 px-6 sm:px-8 bg-white shrink-0">
          <button
            onClick={() => setActiveTab('preset')}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold tracking-wide uppercase transition-colors border-b-2 cursor-pointer ${
              activeTab === 'preset'
                ? 'border-stone-900 text-stone-950'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Choose from Library
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold tracking-wide uppercase transition-colors border-b-2 flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === 'custom'
                ? 'border-stone-900 text-stone-950'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Create Custom Warmup</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 py-5 bg-white">
          {/* Tab 1: Select Preset Routine */}
          {activeTab === 'preset' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-500">
                Select a warm-up or activation routine to attach to Day {dayNumber}:
              </p>

            <div className="grid grid-cols-1 gap-3">
              {existingRoutines.map((routine) => {
                const isAlreadyAdded = currentWarmupIds.includes(routine.id);

                return (
                  <div
                    key={routine.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isAlreadyAdded
                        ? 'bg-stone-50 border-stone-200 opacity-80'
                        : 'bg-white border-stone-200 hover:border-stone-400 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                            {routine.category}
                          </span>
                          <span className="text-xs text-stone-600 dark:text-stone-300 font-medium font-mono">
                            {routine.durationMinutes} mins
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-stone-950">{routine.name}</h4>
                        <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                          {routine.description}
                        </p>
                      </div>

                      <button
                        disabled={isAlreadyAdded}
                        onClick={() => {
                          onSelectRoutine(routine.id);
                          onClose();
                        }}
                        className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 ${
                          isAlreadyAdded
                            ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                            : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs'
                        }`}
                      >
                        {isAlreadyAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Day</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-100 flex flex-wrap gap-2">
                      {routine.steps.map((step, idx) => (
                        <span key={idx} className="text-[10px] text-stone-600 bg-stone-100/70 px-2 py-0.5 rounded-md">
                          • {step.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Create Custom Warmup Form */}
        {activeTab === 'custom' && (
          <form onSubmit={handleSaveCustom} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Warm-Up Routine Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ankle Dorsiflexion & Glute Band Prep"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:border-stone-900"
                >
                  <option value="Pre-Workout Activation">Pre-Workout Activation</option>
                  <option value="Hip Mobility & Flow">Hip Mobility & Flow</option>
                  <option value="Post-Workout Cool Down">Post-Workout Cool Down</option>
                  <option value="Deactivation & Release">Deactivation & Release</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 5)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Description / Purpose
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Targeted mobility for ankle stiffness and glute med activation before squats."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900 resize-none"
              />
            </div>

            {/* Steps Section */}
            <div className="space-y-3 pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Warm-Up Movements ({steps.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="text-xs text-stone-900 font-semibold hover:underline flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Exercise Step</span>
                </button>
              </div>

              {steps.map((step, idx) => (
                <div key={idx} className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      Step {idx + 1}
                    </span>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStep(idx)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Remove step"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="Exercise Name (e.g. 90/90 Hip Switches)"
                        value={step.name}
                        onChange={(e) => handleUpdateStep(idx, 'name', e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Reps / Time (e.g. 10 reps)"
                        value={step.durationOrReps}
                        onChange={(e) => handleUpdateStep(idx, 'durationOrReps', e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Brief Instructions (e.g. Keep heel flat on floor and drive knee forward)"
                    value={step.instructions}
                    onChange={(e) => handleUpdateStep(idx, 'instructions', e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-900 focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                <span>Save & Attach to Day {dayNumber}</span>
              </button>
            </div>
          </form>
        )}
        </div>
      </div>
    </div>
  );
};
