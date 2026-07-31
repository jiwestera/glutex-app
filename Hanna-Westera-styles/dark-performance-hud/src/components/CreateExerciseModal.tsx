import React, { useState } from 'react';
import { Plus, X, Dumbbell, Sparkles, AlertCircle } from 'lucide-react';
import { Exercise, TargetRegion, BodyGroup, EquipmentType, ExerciseCategory } from '../types';
import { HudSelect } from './HudSelect';

interface CreateExerciseModalProps {
  onSave: (newExercise: Exercise) => void;
  onClose: () => void;
  initialBodyGroup?: string;
  existingExercise?: Exercise;
}

export const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({
  onSave,
  onClose,
  initialBodyGroup,
  existingExercise
}) => {
  const isEditing = !!existingExercise;

  const [name, setName] = useState(existingExercise?.name || '');
  const [bodyGroup, setBodyGroup] = useState<string>(existingExercise?.bodyGroup || initialBodyGroup || '-');
  const [targetRegion, setTargetRegion] = useState<string>(existingExercise?.targetRegion || '-');
  const [equipment, setEquipment] = useState<string>(existingExercise?.equipment || '-');
  const [category, setCategory] = useState<string>(existingExercise?.category || '-');
  const [biomechanicsType, setBiomechanicsType] = useState<string>(existingExercise?.biomechanicsType || '-');
  const [difficulty, setDifficulty] = useState<string>(existingExercise?.difficulty || '-');
  const [defaultRestSeconds, setDefaultRestSeconds] = useState<number>(existingExercise?.defaultRestSeconds ?? 60);
  const [description, setDescription] = useState(existingExercise?.description || '');
  const [setupInstruction, setSetupInstruction] = useState(existingExercise?.setupInstructions?.[0] || '');
  const [techniqueCue, setTechniqueCue] = useState(existingExercise?.techniqueCues?.[0] || '');
  const [error, setError] = useState('');

  const targetRegionOptions = [
    'Gluteus Maximus',
    'Gluteus Medius',
    'Gluteus Minimus',
    'Hamstrings & Tie-in',
    'Quads & Hip Flexors',
    'Legs & Calves',
    'Chest',
    'Back & Lats',
    'Shoulders & Arms',
    'Abs & Core',
    'Full Body'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter an exercise name.');
      return;
    }

    const newExercise: Exercise = {
      id: existingExercise?.id || `custom-${Date.now()}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: name.trim(),
      category: (category as ExerciseCategory) || ('-' as any),
      targetRegion: targetRegion.trim() || '-',
      bodyGroup: bodyGroup !== '-' ? (bodyGroup as BodyGroup) : undefined,
      equipment: (equipment as EquipmentType) || ('-' as any),
      description: description.trim() || 'Custom user-created exercise.',
      setupInstructions: setupInstruction.trim() ? [setupInstruction.trim()] : ['Set up comfortably with proper form.'],
      techniqueCues: techniqueCue.trim() ? [techniqueCue.trim()] : ['Maintain controlled movement and mind-muscle connection.'],
      commonMistakes: existingExercise?.commonMistakes || ['Rushing reps without controlled tempo.'],
      biomechanicsType: (biomechanicsType as Exercise['biomechanicsType']) || ('-' as any),
      difficulty: (difficulty as Exercise['difficulty']) || ('-' as any),
      defaultRestSeconds: Math.max(0, defaultRestSeconds)
    };

    onSave(newExercise);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden max-w-2xl sm:max-w-3xl w-full relative shadow-2xl text-stone-900 my-auto max-h-[92vh] h-[85vh] flex flex-col hud-corners">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 p-6 sm:p-8 pb-4 bg-white shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-stone-500 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-stone-900" />
              <span>Custom Exercise Creator</span>
            </div>
            <h2 className="text-2xl font-light text-stone-950 tracking-tight">
              {isEditing ? 'Edit Custom Exercise' : 'Add New Custom Exercise'}
            </h2>
            <p className="text-xs text-stone-500">
              {isEditing
                ? 'Update this movement in your personal library.'
                : 'Save a custom movement to your personal library for routines & logs.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 p-2 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 py-5 bg-white space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Exercise Name */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
              Exercise Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Deficit Bulgarian Split Squat or Incline Cable Fly"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400 font-medium"
            />
          </div>

          {/* Body Group & Equipment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Body Group
              </label>
              <HudSelect
                value={bodyGroup}
                onChange={setBodyGroup}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 font-medium"
                options={[
                  { value: '-', label: '-' },
                  { value: 'Glutes', label: 'Glutes' },
                  { value: 'Legs', label: 'Legs' },
                  { value: 'Chest', label: 'Chest' },
                  { value: 'Back', label: 'Back' },
                  { value: 'Arms', label: 'Arms & Shoulders' },
                  { value: 'Core', label: 'Core' },
                  { value: 'Full Body', label: 'Full Body' }
                ]}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Equipment
              </label>
              <HudSelect
                value={equipment}
                onChange={setEquipment}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 font-medium"
                options={[
                  { value: '-', label: '-' },
                  { value: 'Dumbbell', label: 'Dumbbell' },
                  { value: 'Barbell', label: 'Barbell' },
                  { value: 'Cable', label: 'Cable' },
                  { value: 'Machine', label: 'Machine' },
                  { value: 'Smith Machine', label: 'Smith Machine' },
                  { value: 'Bodyweight', label: 'Bodyweight' },
                  { value: 'Resistance Band', label: 'Resistance Band' },
                  { value: 'Kettlebell', label: 'Kettlebell' }
                ]}
              />
            </div>
          </div>

          {/* Target Region & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Primary Target Region
              </label>
              <HudSelect
                value={targetRegion}
                onChange={setTargetRegion}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 font-medium"
                options={[
                  { value: '-', label: '-' },
                  ...targetRegionOptions.map((opt) => ({ value: opt, label: opt }))
                ]}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Category Focus
              </label>
              <HudSelect
                value={category}
                onChange={setCategory}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 font-medium"
                options={[
                  { value: '-', label: '-' },
                  { value: 'Shortened Peak', label: 'Shortened Peak' },
                  { value: 'Stretch Focus', label: 'Stretch Focus' },
                  { value: 'Compound Heavy', label: 'Compound Heavy' },
                  { value: 'Abduction & Upper Shelf', label: 'Abduction & Upper Shelf' },
                  { value: 'Mobility & Activation', label: 'Mobility & Activation' },
                  { value: 'Upper Push', label: 'Upper Push' },
                  { value: 'Upper Pull', label: 'Upper Pull' },
                  { value: 'Arms & Shoulders', label: 'Arms & Shoulders' },
                  { value: 'Legs Isolation', label: 'Legs Isolation' },
                  { value: 'Core & Stability', label: 'Core & Stability' },
                  { value: 'Full Body Conditioning', label: 'Full Body Conditioning' }
                ]}
              />
            </div>
          </div>

          {/* Biomechanics & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Biomechanics Profile
              </label>
              <HudSelect
                value={biomechanicsType}
                onChange={setBiomechanicsType}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 font-medium"
                options={[
                  { value: '-', label: '-' },
                  { value: 'Shortened Position', label: 'Shortened Position' },
                  { value: 'Stretch Position', label: 'Stretch Position' },
                  { value: 'Mid-Range', label: 'Mid-Range' },
                  { value: 'Abduction', label: 'Abduction' },
                  { value: 'Activation', label: 'Activation' },
                  { value: 'Push/Pull', label: 'Push/Pull' },
                  { value: 'Isolation', label: 'Isolation' },
                  { value: 'Compound', label: 'Compound' }
                ]}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Difficulty
              </label>
              <HudSelect
                value={difficulty}
                onChange={setDifficulty}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 font-medium"
                options={[
                  { value: '-', label: '-' },
                  { value: 'Beginner', label: 'Beginner' },
                  { value: 'Intermediate', label: 'Intermediate' },
                  { value: 'Advanced', label: 'Advanced' }
                ]}
              />
            </div>
          </div>

          {/* Default Rest Period */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
              Default Rest Period (seconds)
            </label>
            <input
              type="number"
              min="0"
              step="5"
              value={defaultRestSeconds}
              onChange={(e) => setDefaultRestSeconds(parseInt(e.target.value) || 0)}
              placeholder="60"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400 font-mono font-medium"
            />
            <p className="text-[10px] text-stone-400 mt-1">
              Used as the starting rest time whenever this exercise is added to a workout day.
            </p>
          </div>

          {/* Description & Cues */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
              Short Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of setup and execution..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400 font-medium resize-none"
            />
          </div>

          {/* Setup / Key Technique Cue */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
              Key Technique Cue
            </label>
            <input
              type="text"
              value={techniqueCue}
              onChange={(e) => setTechniqueCue(e.target.value)}
              placeholder="e.g. Pause 1s at peak contraction, keep chin tucked"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400 font-medium"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-stone-900 hover:bg-stone-800 transition-all shadow-md flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Save Custom Exercise'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
