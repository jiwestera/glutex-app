import React, { useState } from 'react';
import { Plus, X, Calendar, Dumbbell, Sparkles } from 'lucide-react';

interface AddDayModalProps {
  onAddDay: (title: string, focus: string) => void;
  onClose: () => void;
  nextDayNumber: number;
}

export const AddDayModal: React.FC<AddDayModalProps> = ({
  onAddDay,
  onClose,
  nextDayNumber
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('upper');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customFocus, setCustomFocus] = useState<string>('');

  const presets = [
    {
      id: 'upper',
      title: 'Upper Body & Arms Hypertrophy',
      focus: 'Chest, Back, Shoulders, Biceps & Triceps',
      desc: 'Non-glute day focusing on upper body pushing, pulling, and arm development.'
    },
    {
      id: 'push-pull',
      title: 'Chest, Back & Shoulders Focus',
      focus: 'Lat Pulldowns, Incline Press, Lateral Raises',
      desc: 'Balanced upper body strength & muscular symmetry.'
    },
    {
      id: 'quads-calves',
      title: 'Quads & Calves (Non-Glute Legs)',
      focus: 'Leg Press, Hack Squat, Leg Extensions & Calves',
      desc: 'Isolate quadriceps and lower leg development without glute exhaustion.'
    },
    {
      id: 'core-conditioning',
      title: 'Full Body, Core & Conditioning',
      focus: 'Full Body Movements, Core Stability & Cardio',
      desc: 'Overall athletic fitness, abdominal work, and energy burn.'
    },
    {
      id: 'custom',
      title: 'Custom Freestyle Day',
      focus: 'User Selected Focus',
      desc: 'Create your own custom workout day title and add any exercises from the library.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPreset === 'custom') {
      const finalTitle = customTitle.trim() || `Custom Non-Glute Day`;
      const finalFocus = customFocus.trim() || `Freestyle exercise selection`;
      onAddDay(finalTitle, finalFocus);
    } else {
      const preset = presets.find((p) => p.id === selectedPreset);
      if (preset) {
        onAddDay(preset.title, preset.focus);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden max-w-2xl w-full relative shadow-2xl text-stone-900 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-100 p-6 sm:p-8 pb-4 bg-white shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-stone-500 text-[10px] font-bold uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5 text-stone-900" />
              <span>Expand Workout Routine</span>
            </div>
            <h2 className="text-2xl font-light text-stone-950 tracking-tight">
              Add Day <span className="font-mono">{nextDayNumber}</span> to Plan
            </h2>
            <p className="text-xs text-stone-500">
              Add a non-glute focused day or custom freestyle training day to your split.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 p-2 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 py-5 space-y-4 bg-white">
          <div className="space-y-2.5">
            {presets.map((p) => {
              const isSelected = selectedPreset === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPreset(p.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-white text-stone-900 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-semibold">{p.title}</h4>
                      <p
                        className={`text-[11px] font-mono mt-0.5 ${
                          isSelected ? 'text-stone-300' : 'text-stone-500'
                        }`}
                      >
                        {p.focus}
                      </p>
                      <p
                        className={`text-[10px] mt-1.5 ${
                          isSelected ? 'text-stone-400' : 'text-stone-500'
                        }`}
                      >
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom inputs if custom preset selected */}
          {selectedPreset === 'custom' && (
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3 animate-fadeIn">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Custom Day Title
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Upper Body & Abs or Cardio Finisher"
                  className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Day Focus / Notes
                </label>
                <input
                  type="text"
                  value={customFocus}
                  onChange={(e) => setCustomFocus(e.target.value)}
                  placeholder="e.g. Chest, Lats, Core & Mobility"
                  className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400 font-medium"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-full uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-stone-900 hover:bg-stone-800 transition-all shadow-md flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Day <span className="font-mono">{nextDayNumber}</span></span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
