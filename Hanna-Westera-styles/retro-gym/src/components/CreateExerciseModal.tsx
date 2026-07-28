import React, { useState } from 'react';
import { Plus, X, Dumbbell, Sparkles, AlertCircle } from 'lucide-react';
import { Exercise, TargetRegion, BodyGroup, EquipmentType, ExerciseCategory } from '../types';

interface CreateExerciseModalProps {
  onSave: (newExercise: Exercise) => void;
  onClose: () => void;
  initialBodyGroup?: string;
}

export const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({
  onSave,
  onClose,
  initialBodyGroup
}) => {
  const [name, setName] = useState('');
  const [bodyGroup, setBodyGroup] = useState<string>(initialBodyGroup || '-');
  const [targetRegion, setTargetRegion] = useState<string>('-');
  const [equipment, setEquipment] = useState<string>('-');
  const [category, setCategory] = useState<string>('-');
  const [biomechanicsType, setBiomechanicsType] = useState<string>('-');
  const [difficulty, setDifficulty] = useState<string>('-');
  const [description, setDescription] = useState('');
  const [setupInstruction, setSetupInstruction] = useState('');
  const [techniqueCue, setTechniqueCue] = useState('');
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
    'Full Body'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter an exercise name.');
      return;
    }

    const newExercise: Exercise = {
      id: `custom-${Date.now()}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: name.trim(),
      category: (category as ExerciseCategory) || ('-' as any),
      targetRegion: targetRegion.trim() || '-',
      bodyGroup: bodyGroup !== '-' ? (bodyGroup as BodyGroup) : undefined,
      equipment: (equipment as EquipmentType) || ('-' as any),
      description: description.trim() || 'Custom user-created exercise.',
      setupInstructions: setupInstruction.trim() ? [setupInstruction.trim()] : ['Set up comfortably with proper form.'],
      techniqueCues: techniqueCue.trim() ? [techniqueCue.trim()] : ['Maintain controlled movement and mind-muscle connection.'],
      commonMistakes: ['Rushing reps without controlled tempo.'],
      biomechanicsType: (biomechanicsType as Exercise['biomechanicsType']) || ('-' as any),
      difficulty: (difficulty as Exercise['difficulty']) || ('-' as any)
    };

    onSave(newExercise);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden max-w-2xl sm:max-w-3xl w-full relative shadow-2xl text-stone-900 my-auto max-h-[92vh] h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 p-6 sm:p-8 pb-4 bg-white shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-stone-500 text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-stone-900" />
              <span>Custom Exercise Creator</span>
            </div>
            <h2 className="text-2xl font-light text-stone-950 tracking-tight">
              Add New Custom Exercise
            </h2>
            <p className="text-xs text-stone-500">
              Save a custom movement to your personal library for routines & logs.
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
              <select
                value={bodyGroup}
                onChange={(e) => setBodyGroup(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 font-medium"
              >
                <option value="-">-</option>
                <option value="Glutes">Glutes</option>
                <option value="Legs">Legs</option>
                <option value="Chest">Chest</option>
                <option value="Back">Back</option>
                <option value="Arms">Arms & Shoulders</option>
                <option value="Full Body">Full Body</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Equipment
              </label>
              <select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 font-medium"
              >
                <option value="-">-</option>
                <option value="Dumbbell">Dumbbell</option>
                <option value="Barbell">Barbell</option>
                <option value="Cable">Cable</option>
                <option value="Machine">Machine</option>
                <option value="Smith Machine">Smith Machine</option>
                <option value="Bodyweight">Bodyweight</option>
                <option value="Resistance Band">Resistance Band</option>
                <option value="Kettlebell">Kettlebell</option>
              </select>
            </div>
          </div>

          {/* Target Region & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Primary Target Region
              </label>
              <select
                value={targetRegion}
                onChange={(e) => setTargetRegion(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 font-medium"
              >
                <option value="-">-</option>
                {targetRegionOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Category Focus
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 font-medium"
              >
                <option value="-">-</option>
                <option value="Shortened Peak">Shortened Peak</option>
                <option value="Stretch Focus">Stretch Focus</option>
                <option value="Compound Heavy">Compound Heavy</option>
                <option value="Abduction & Upper Shelf">Abduction & Upper Shelf</option>
                <option value="Mobility & Activation">Mobility & Activation</option>
                <option value="Upper Push">Upper Push</option>
                <option value="Upper Pull">Upper Pull</option>
                <option value="Arms & Shoulders">Arms & Shoulders</option>
                <option value="Legs Isolation">Legs Isolation</option>
                <option value="Full Body Conditioning">Full Body Conditioning</option>
              </select>
            </div>
          </div>

          {/* Biomechanics & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Biomechanics Profile
              </label>
              <select
                value={biomechanicsType}
                onChange={(e) => setBiomechanicsType(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 font-medium"
              >
                <option value="-">-</option>
                <option value="Shortened Position">Shortened Position</option>
                <option value="Stretch Position">Stretch Position</option>
                <option value="Mid-Range">Mid-Range</option>
                <option value="Abduction">Abduction</option>
                <option value="Activation">Activation</option>
                <option value="Push/Pull">Push/Pull</option>
                <option value="Isolation">Isolation</option>
                <option value="Compound">Compound</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 font-medium"
              >
                <option value="-">-</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
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
              <span>Save Custom Exercise</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
