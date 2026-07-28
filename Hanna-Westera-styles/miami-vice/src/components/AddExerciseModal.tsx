import React, { useState, useMemo } from 'react';
import { Plus, Search, Dumbbell, Info, Check, X, Layers, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Exercise, PlannedExercise, BodyGroup } from '../types';
import { getAllExercises, saveCustomExercise, getHiddenExerciseIds, hideExercise, unhideExercise } from '../utils/exerciseUtils';
import { CreateExerciseModal } from './CreateExerciseModal';

interface AddExerciseModalProps {
  onAddExercise: (planned: PlannedExercise) => void;
  onClose: () => void;
  dayTitle?: string;
}

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  onAddExercise,
  onClose,
  dayTitle
}) => {
  const [allExercisesList, setAllExercisesList] = useState<Exercise[]>(() => getAllExercises());
  const [hiddenIds, setHiddenIds] = useState<string[]>(() => getHiddenExerciseIds());
  const [showHidden, setShowHidden] = useState<boolean>(false);

  const [selectedBodyGroup, setSelectedBodyGroup] = useState<string>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<string>(() => {
    const preset = localStorage.getItem('glutex_location_preset');
    if (preset === 'home') return 'Dumbbell';
    if (preset === 'cable') return 'Cable';
    return 'All';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isCreatingCustom, setIsCreatingCustom] = useState<boolean>(false);

  // Planned Exercise default values
  const [sets, setSets] = useState<number>(3);
  const [reps, setReps] = useState<string>('8-12');
  const [rpe, setRpe] = useState<string>('RPE 8');
  const [restSeconds, setRestSeconds] = useState<number>(90);
  const [notes, setNotes] = useState<string>('');

  const bodyGroups = ['All', 'Glutes', 'Legs', 'Chest', 'Back', 'Arms', 'Full Body'];
  const equipmentTypes = ['All', 'Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Smith Machine', 'Kettlebell'];

  const handleToggleHide = (exId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (hiddenIds.includes(exId)) {
      const updated = unhideExercise(exId);
      setHiddenIds(updated);
    } else {
      const updated = hideExercise(exId);
      setHiddenIds(updated);
    }
  };

  // Filter exercises based on body group, equipment, search query, and hidden state
  const filteredExercises = useMemo(() => {
    return allExercisesList.filter((ex) => {
      const isHidden = hiddenIds.includes(ex.id);
      if (isHidden && !showHidden) return false;

      // Body Group match
      if (selectedBodyGroup !== 'All') {
        const bg = selectedBodyGroup;
        if (bg === 'Glutes') {
          if (!ex.targetRegion.includes('Glute') && !ex.targetRegion.includes('Hamstring')) return false;
        } else if (bg === 'Legs') {
          if (ex.bodyGroup !== 'Legs' && !ex.targetRegion.includes('Quad') && !ex.targetRegion.includes('Leg')) return false;
        } else if (bg === 'Chest') {
          if (ex.bodyGroup !== 'Chest' && !ex.targetRegion.includes('Chest')) return false;
        } else if (bg === 'Back') {
          if (ex.bodyGroup !== 'Back' && !ex.targetRegion.includes('Back')) return false;
        } else if (bg === 'Arms') {
          if (ex.bodyGroup !== 'Arms' && !ex.targetRegion.includes('Arm') && !ex.targetRegion.includes('Shoulder')) return false;
        } else if (bg === 'Full Body') {
          if (ex.bodyGroup !== 'Full Body' && !ex.targetRegion.includes('Full Body')) return false;
        }
      }

      // Equipment match
      if (selectedEquipment !== 'All') {
        if (ex.equipment !== selectedEquipment) return false;
      }

      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = ex.name.toLowerCase().includes(query);
        const matchesRegion = ex.targetRegion.toLowerCase().includes(query);
        const matchesCat = ex.category.toLowerCase().includes(query);
        const matchesEquip = ex.equipment.toLowerCase().includes(query);
        if (!matchesName && !matchesRegion && !matchesCat && !matchesEquip) return false;
      }

      return true;
    });
  }, [allExercisesList, hiddenIds, showHidden, selectedBodyGroup, selectedEquipment, searchQuery]);


  const handleSaveCustomExercise = (newEx: Exercise) => {
    saveCustomExercise(newEx);
    const updated = getAllExercises();
    setAllExercisesList(updated);
    setSelectedExercise(newEx);
  };

  const handleConfirmAdd = () => {
    if (!selectedExercise) return;
    onAddExercise({
      exerciseId: selectedExercise.id,
      sets: Math.max(1, sets),
      reps: reps.trim() || '8-12',
      rpe: rpe.trim() || 'RPE 8',
      restSeconds: Math.max(0, restSeconds),
      notes: notes.trim() || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden max-w-4xl sm:max-w-5xl w-full relative shadow-2xl mv-glow-cyan text-stone-900 my-auto max-h-[92vh] h-[88vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-stone-100 p-6 sm:p-8 pb-4 bg-white shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-stone-500 text-[10px] font-bold uppercase tracking-widest">
              <Plus className="w-3.5 h-3.5 text-stone-900" />
              <span>Add Exercise to Day</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-normal mv-gradient-text tracking-tight">
              Select & Customize Exercise
            </h2>
            {dayTitle && (
              <p className="text-xs text-stone-500 font-normal">
                Adding to: <span className="font-semibold text-stone-900">{dayTitle}</span>
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCreatingCustom(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs shadow-2xs transition-all cursor-pointer"
              title="Create a new custom exercise not currently in the library"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-300" />
              <span>Create Custom +</span>
            </button>

            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-900 p-2 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 py-5 space-y-5 bg-white">
          {/* Filter Controls Bar */}
          <div className="space-y-3.5 bg-stone-50/80 p-4 sm:p-5 rounded-2xl border border-stone-200/80">
            {/* Category / Body Group Pills */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">
                Muscle Group / Category
              </span>
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
                {bodyGroups.map((group) => (
                  <button
                    key={group}
                    onClick={() => setSelectedBodyGroup(group)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
                      selectedBodyGroup === group
                        ? 'bg-stone-900 text-white border-stone-900 font-semibold shadow-2xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment Pills & Search & Show Hidden Toggle */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1 items-stretch sm:items-center justify-between">
              <div className="flex-1 relative min-w-[240px]">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search exercise name or keyword..."
                  className="w-full bg-white border border-stone-200/80 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400"
                />
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar shrink-0">
                {equipmentTypes.slice(0, 5).map((eq) => (
                  <button
                    key={eq}
                    onClick={() => setSelectedEquipment(eq)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-medium whitespace-nowrap transition-all border cursor-pointer ${
                      selectedEquipment === eq
                        ? 'bg-stone-800 text-white border-stone-800 font-semibold'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {eq}
                  </button>
                ))}

                <button
                  onClick={() => setShowHidden((prev) => !prev)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium whitespace-nowrap transition-all border cursor-pointer ${
                    showHidden
                      ? 'bg-rose-100 text-rose-950 border-rose-300'
                      : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'
                  }`}
                  title="Show or hide exercises marked as hidden"
                >
                  {showHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{showHidden ? 'Hide Hidden' : `Show Hidden (${hiddenIds.length})`}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Exercises Scrollable List */}
          <div className="space-y-2.5 min-h-[180px]">
            {filteredExercises.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200/80 text-stone-500 text-xs">
                No exercises match your filters. Try selecting "All" or typing a different search query.
              </div>
            ) : (
              filteredExercises.map((ex) => {
                const isSelected = selectedExercise?.id === ex.id;
                const isHidden = hiddenIds.includes(ex.id);

                return (
                  <div
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                        : isHidden
                        ? 'bg-rose-50/30 text-stone-700 border-dashed border-rose-300 hover:border-rose-400'
                        : 'bg-white text-stone-900 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            isSelected ? 'bg-stone-800 text-stone-200' : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {ex.equipment}
                        </span>
                        <span
                          className={`text-[9px] font-semibold px-2.5 py-0.5 rounded-full ${
                            isSelected ? 'bg-stone-800 text-stone-300' : 'bg-stone-50 text-stone-600 border border-stone-200'
                          }`}
                        >
                          {ex.targetRegion}
                        </span>
                        {isHidden && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                            Hidden
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-medium">{ex.name}</h4>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={(e) => handleToggleHide(ex.id, e)}
                        className={`p-2 rounded-full transition-colors ${
                          isSelected
                            ? 'text-stone-400 hover:text-white hover:bg-stone-800'
                            : isHidden
                            ? 'text-rose-800 hover:bg-rose-100'
                            : 'text-stone-300 hover:text-stone-700 hover:bg-stone-100'
                        }`}
                        title={isHidden ? 'Unhide exercise' : 'Hide exercise from routine selection'}
                      >
                        {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-white text-stone-900 border-white'
                            : 'border-stone-300 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Selected Exercise Set Configuration Form */}
          {selectedExercise && (
            <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-stone-900">
                  Target Volume for <span className="font-bold underline">{selectedExercise.name}</span>:
                </span>
                <span className="text-[10px] sm:text-xs text-stone-500 font-mono">
                  {selectedExercise.equipment} • {selectedExercise.targetRegion}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                    Sets
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={sets}
                    onChange={(e) => setSets(parseInt(e.target.value) || 1)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-center font-semibold text-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                    Target Reps
                  </label>
                  <input
                    type="text"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    placeholder="8-12"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-center font-semibold text-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                    Target RPE
                  </label>
                  <input
                    type="text"
                    value={rpe}
                    onChange={(e) => setRpe(e.target.value)}
                    placeholder="RPE 8"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-center font-semibold text-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                    Rest (sec)
                  </label>
                  <input
                    type="number"
                    step="15"
                    value={restSeconds}
                    onChange={(e) => setRestSeconds(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-center font-semibold text-stone-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="flex items-center justify-between border-t border-stone-100 p-6 sm:p-8 py-4 bg-stone-50/60 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-200/80 hover:bg-stone-300 text-stone-700 text-xs font-semibold rounded-full uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmAdd}
            disabled={!selectedExercise}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${
              selectedExercise
                ? 'bg-stone-900 hover:bg-stone-800 text-white shadow-md'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Add To Day</span>
          </button>
        </div>
      </div>

      {/* Custom Exercise Creator Modal */}
      {isCreatingCustom && (
        <CreateExerciseModal
          initialBodyGroup={selectedBodyGroup !== 'All' ? selectedBodyGroup : undefined}
          onSave={handleSaveCustomExercise}
          onClose={() => setIsCreatingCustom(false)}
        />
      )}
    </div>
  );
};
