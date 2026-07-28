import React, { useState, useMemo } from 'react';
import { RefreshCw, Search, Check, Dumbbell, Shield, Info, ArrowRight, X, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Exercise, EquipmentType, GluteRegion } from '../types';
import { getAllExercises, saveCustomExercise, getHiddenExerciseIds, hideExercise, unhideExercise } from '../utils/exerciseUtils';
import { CreateExerciseModal } from './CreateExerciseModal';

interface ExerciseSwapModalProps {
  currentExerciseId: string;
  onSelectExercise: (newExerciseId: string) => void;
  onClose: () => void;
}

export const ExerciseSwapModal: React.FC<ExerciseSwapModalProps> = ({
  currentExerciseId,
  onSelectExercise,
  onClose
}) => {
  const [allExercisesList, setAllExercisesList] = useState<Exercise[]>(() => getAllExercises());
  const [hiddenIds, setHiddenIds] = useState<string[]>(() => getHiddenExerciseIds());
  const [showHidden, setShowHidden] = useState<boolean>(false);

  const currentExercise = allExercisesList.find((e) => e.id === currentExerciseId);

  const [selectedEquipmentFilter, setSelectedEquipmentFilter] = useState<string>(() => {
    const preset = localStorage.getItem('glutex_location_preset');
    if (preset === 'home') return 'Dumbbell';
    if (preset === 'cable') return 'Cable';
    return 'All';
  });
  const [regionScopeFilter, setRegionScopeFilter] = useState<'same-region' | 'same-biomechanics' | 'all'>(
    'same-region'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);
  const [isCreatingCustom, setIsCreatingCustom] = useState<boolean>(false);

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

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return allExercisesList.filter((ex) => {
      const isHidden = hiddenIds.includes(ex.id);
      if (isHidden && !showHidden) return false;

      // Search text match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = ex.name.toLowerCase().includes(query);
        const matchesRegion = ex.targetRegion.toLowerCase().includes(query);
        const matchesEquip = ex.equipment.toLowerCase().includes(query);
        if (!matchesName && !matchesRegion && !matchesEquip) return false;
      }

      // Region scope filter
      if (currentExercise) {
        if (regionScopeFilter === 'same-region') {
          if (ex.targetRegion !== currentExercise.targetRegion) return false;
        } else if (regionScopeFilter === 'same-biomechanics') {
          if (ex.biomechanicsType !== currentExercise.biomechanicsType) return false;
        }
      }

      // Equipment filter
      if (selectedEquipmentFilter !== 'All') {
        if (selectedEquipmentFilter === 'Free Weights') {
          if (ex.equipment !== 'Barbell' && ex.equipment !== 'Dumbbell') return false;
        } else if (selectedEquipmentFilter === 'Bodyweight & Bands') {
          if (ex.equipment !== 'Bodyweight' && ex.equipment !== 'Resistance Band') return false;
        } else if (ex.equipment !== selectedEquipmentFilter) {
          return false;
        }
      }

      return true;
    });
  }, [allExercisesList, hiddenIds, showHidden, currentExercise, regionScopeFilter, selectedEquipmentFilter, searchQuery]);


  const handleSaveCustomExercise = (newEx: Exercise) => {
    saveCustomExercise(newEx);
    const updated = getAllExercises();
    setAllExercisesList(updated);
    onSelectExercise(newEx.id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden max-w-4xl sm:max-w-5xl w-full relative shadow-2xl text-stone-900 my-auto max-h-[92vh] h-[88vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-stone-100 p-6 sm:p-8 pb-4 bg-white shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-stone-500 text-[10px] font-bold uppercase tracking-widest">
              <RefreshCw className="w-3.5 h-3.5 text-stone-800" />
              <span>Exercise Swap & Equipment Switch</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-stone-950 tracking-tight">
              Replace {currentExercise ? currentExercise.name : 'Exercise'}
            </h2>
            {currentExercise && (
              <p className="text-xs text-stone-500 font-normal">
                Current: <span className="font-semibold text-stone-900">{currentExercise.name}</span> •{' '}
                <span className="text-stone-700">{currentExercise.targetRegion}</span> ({currentExercise.equipment})
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCreatingCustom(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs shadow-2xs transition-all cursor-pointer"
              title="Create a new custom exercise"
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
            {/* Top Row: Region & Mechanics Focus */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Filter By Target
              </span>
              <div className="flex bg-white p-1 rounded-full border border-stone-200 text-xs font-medium shadow-2xs">
                <button
                  onClick={() => setRegionScopeFilter('same-region')}
                  className={`px-3 py-1 rounded-full transition-all text-[11px] cursor-pointer ${
                    regionScopeFilter === 'same-region'
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Same Glute Region ({currentExercise?.targetRegion || 'Glutes'})
                </button>
                <button
                  onClick={() => setRegionScopeFilter('same-biomechanics')}
                  className={`px-3 py-1 rounded-full transition-all text-[11px] cursor-pointer ${
                    regionScopeFilter === 'same-biomechanics'
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Same Mechanics ({currentExercise?.biomechanicsType || 'Position'})
                </button>
                <button
                  onClick={() => setRegionScopeFilter('all')}
                  className={`px-3 py-1 rounded-full transition-all text-[11px] cursor-pointer ${
                    regionScopeFilter === 'all'
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All Exercises
                </button>
              </div>
            </div>

            {/* Middle Row: Quick Equipment Switch Buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">
                Equipment Type
              </span>
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
                {['All', 'Dumbbell', 'Barbell', 'Cable', 'Machine', 'Smith Machine', 'Bodyweight & Bands'].map(
                  (eq) => (
                    <button
                      key={eq}
                      onClick={() => setSelectedEquipmentFilter(eq)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border cursor-pointer ${
                        selectedEquipmentFilter === eq
                          ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {eq}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Search Bar & Show Hidden toggle */}
            <div className="flex items-center gap-2.5 pt-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search exercise name or keyword..."
                  className="w-full bg-white border border-stone-200/80 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400"
                />
              </div>

              <button
                onClick={() => setShowHidden((prev) => !prev)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                  showHidden
                    ? 'bg-rose-100 text-rose-950 border-rose-300'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                }`}
              >
                {showHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{showHidden ? 'Hide Hidden' : `Show Hidden (${hiddenIds.length})`}</span>
              </button>
            </div>
          </div>

          {/* Exercises List */}
          <div className="space-y-3 min-h-[180px]">
            {filteredExercises.length === 0 ? (
              <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200/80 text-stone-500 text-xs">
                No exercise matches found for these filters. Try selecting "All Equipment" or "All Exercises".
              </div>
            ) : (
              filteredExercises.map((ex) => {
                const isCurrent = ex.id === currentExerciseId;
                const isHidden = hiddenIds.includes(ex.id);

                return (
                  <div
                    key={ex.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-stone-100 border-stone-300'
                        : isHidden
                        ? 'bg-rose-50/30 border-dashed border-rose-300'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-900 text-white">
                          {ex.equipment}
                        </span>
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                          {ex.targetRegion}
                        </span>
                        <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200">
                          {ex.biomechanicsType}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-200 text-stone-800">
                            Current Choice
                          </span>
                        )}
                        {isHidden && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                            Hidden
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-medium text-stone-950">{ex.name}</h4>
                      <p className="text-xs text-stone-500 line-clamp-2">{ex.description}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 sm:self-center">
                      <button
                        onClick={(e) => handleToggleHide(ex.id, e)}
                        className={`p-2 rounded-full transition-colors cursor-pointer ${
                          isHidden
                            ? 'text-rose-800 hover:bg-rose-100'
                            : 'text-stone-300 hover:text-stone-700 hover:bg-stone-100'
                        }`}
                        title={isHidden ? 'Unhide exercise' : 'Hide exercise from routine selection'}
                      >
                        {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => setPreviewExercise(ex)}
                        className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                        title="View Technique Cues"
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          onSelectExercise(ex.id);
                          onClose();
                        }}
                        disabled={isCurrent}
                        className={`px-4 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer ${
                          isCurrent
                            ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                            : 'bg-stone-900 hover:bg-stone-800 text-white shadow-2xs'
                        }`}
                      >
                        <span>{isCurrent ? 'Selected' : 'Swap In'}</span>
                        {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sub Preview Modal if clicking Info */}
          {previewExercise && (
            <div className="bg-stone-900 text-stone-100 p-5 rounded-2xl space-y-3 border border-stone-800 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <h4 className="text-sm font-semibold">{previewExercise.name} - Technique Overview</h4>
                <button
                  onClick={() => setPreviewExercise(null)}
                  className="text-stone-400 hover:text-white text-xs cursor-pointer"
                >
                  Hide Cues
                </button>
              </div>
              <p className="text-xs text-stone-300">{previewExercise.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Setup</span>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-300">
                    {previewExercise.setupInstructions.slice(0, 2).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Cues</span>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-300">
                    {previewExercise.techniqueCues.slice(0, 2).map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="flex items-center justify-end border-t border-stone-100 p-6 sm:p-8 py-4 bg-stone-50/60 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-stone-200/80 hover:bg-stone-300 text-stone-700 text-xs font-semibold rounded-full uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Custom Exercise Creator Modal */}
      {isCreatingCustom && (
        <CreateExerciseModal
          onSave={handleSaveCustomExercise}
          onClose={() => setIsCreatingCustom(false)}
        />
      )}
    </div>
  );
};
