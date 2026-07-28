import React, { useState } from 'react';
import { Search, Filter, Info, Dumbbell, Shield, Sparkles, Plus, Eye, EyeOff } from 'lucide-react';
import { Exercise, GluteRegion, EquipmentType, ExerciseCategory } from '../types';
import { getAllExercises, saveCustomExercise, getHiddenExerciseIds, hideExercise, unhideExercise } from '../utils/exerciseUtils';
import { CreateExerciseModal } from './CreateExerciseModal';
import { InfoBall } from './InfoBall';
import { HudSelect } from './HudSelect';

export const ExerciseLibrary: React.FC = () => {
  const [exercisesList, setExercisesList] = useState<Exercise[]>(() => getAllExercises());
  const [hiddenIds, setHiddenIds] = useState<string[]>(() => getHiddenExerciseIds());
  const [showHidden, setShowHidden] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBiomechanics, setSelectedBiomechanics] = useState<string>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('All');
  const [isCreatingCustom, setIsCreatingCustom] = useState<boolean>(false);

  const [activeModalExercise, setActiveModalExercise] = useState<Exercise | null>(null);

  const filteredExercises = exercisesList.filter((ex) => {
    const isHidden = hiddenIds.includes(ex.id);
    if (isHidden && !showHidden) return false;

    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion = selectedRegion === 'All' || ex.targetRegion === selectedRegion;
    const matchesCategory = selectedCategory === 'All' || ex.category === selectedCategory;
    const matchesBiomechanics = selectedBiomechanics === 'All' || ex.biomechanicsType === selectedBiomechanics;
    const matchesEquipment = selectedEquipment === 'All' || ex.equipment === selectedEquipment;

    return matchesSearch && matchesRegion && matchesCategory && matchesBiomechanics && matchesEquipment;
  });

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

  const handleSaveCustomExercise = (newEx: Exercise) => {
    saveCustomExercise(newEx);
    setExercisesList(getAllExercises());
    setActiveModalExercise(newEx);
  };


  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs hud-corners">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
              Biomechanics & Technique Index
            </span>
            <h1 className="text-3xl sm:text-4xl font-light text-stone-950 tracking-tight mt-0.5">Exercise Library</h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl font-normal">
              Master setups, lines of pull, and peak tension cues across glutes, legs, chest, back, arms, and full body movements.
            </p>
          </div>

          <button
            onClick={() => setIsCreatingCustom(true)}
            className="self-start sm:self-center flex items-center space-x-2 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs uppercase tracking-wider shadow-md transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4 text-rose-300" />
            <span>Create Custom Movement +</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercise..."
              className="w-full bg-stone-50 border border-stone-200/80 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400"
            />
          </div>

          {/* Body Group / Target Region Filter */}
          <div>
            <HudSelect
              value={selectedRegion}
              onChange={setSelectedRegion}
              className="w-full bg-stone-50 border border-stone-200/80 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-stone-400 font-medium"
              options={[
                { value: 'All', label: 'All Target Regions' },
                { value: 'Gluteus Maximus', label: 'Glutes (Maximus)', group: 'Body Groups' },
                { value: 'Gluteus Medius', label: 'Glutes (Medius & Upper Shelf)', group: 'Body Groups' },
                { value: 'Quads & Hip Flexors', label: 'Legs (Quads)', group: 'Body Groups' },
                { value: 'Hamstrings & Tie-in', label: 'Legs (Hamstrings)', group: 'Body Groups' },
                { value: 'Legs & Calves', label: 'Legs (Calves & Lower)', group: 'Body Groups' },
                { value: 'Chest', label: 'Chest', group: 'Body Groups' },
                { value: 'Back & Lats', label: 'Back & Lats', group: 'Body Groups' },
                { value: 'Shoulders & Arms', label: 'Arms & Shoulders', group: 'Body Groups' },
                { value: 'Full Body', label: 'Full Body', group: 'Body Groups' }
              ]}
            />
          </div>

          {/* Category Filter */}
          <div>
            <HudSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              className="w-full bg-stone-50 border border-stone-200/80 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-stone-400 font-medium"
              options={[
                { value: 'All', label: 'All Categories' },
                { value: 'Compound Heavy', label: 'Compound Heavy' },
                { value: 'Stretch Focus', label: 'Stretch Focus' },
                { value: 'Shortened Peak', label: 'Shortened Peak' },
                { value: 'Abduction & Upper Shelf', label: 'Abduction & Upper Shelf' },
                { value: 'Mobility & Activation', label: 'Mobility & Activation' },
                { value: 'Upper Push', label: 'Upper Push' },
                { value: 'Upper Pull', label: 'Upper Pull' },
                { value: 'Arms & Shoulders', label: 'Arms & Shoulders' },
                { value: 'Legs Isolation', label: 'Legs Isolation' },
                { value: 'Full Body Conditioning', label: 'Full Body Conditioning' }
              ]}
            />
          </div>

          {/* Biomechanics Filter */}
          <div>
            <HudSelect
              value={selectedBiomechanics}
              onChange={setSelectedBiomechanics}
              className="w-full bg-stone-50 border border-stone-200/80 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-stone-400"
              options={[
                { value: 'All', label: 'All Mechanics' },
                { value: 'Shortened Position', label: 'Shortened Position (Peak)' },
                { value: 'Stretch Position', label: 'Stretch Position' },
                { value: 'Abduction', label: 'Abduction (Upper Shelf)' },
                { value: 'Activation', label: 'Activation & Warmup' }
              ]}
            />
          </div>

          {/* Equipment Filter */}
          <div>
            <HudSelect
              value={selectedEquipment}
              onChange={setSelectedEquipment}
              className="w-full bg-stone-50 border border-stone-200/80 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-stone-400"
              options={[
                { value: 'All', label: 'All Equipment' },
                { value: 'Barbell', label: 'Barbell' },
                { value: 'Dumbbell', label: 'Dumbbell' },
                { value: 'Cable', label: 'Cable' },
                { value: 'Machine', label: 'Machine' },
                { value: 'Resistance Band', label: 'Resistance Band' }
              ]}
            />
          </div>
        </div>

        {/* Hidden Exercises Menu Switcher */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-center space-x-2 text-stone-500 font-medium">
            <span>Showing <span className="font-mono glow-text-cyan">{filteredExercises.length}</span> movements</span>
            {hiddenIds.length > 0 && (
              <span className="text-stone-400">(<span className="font-mono">{hiddenIds.length}</span> hidden)</span>
            )}
          </div>

          <button
            onClick={() => setShowHidden((prev) => !prev)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-medium transition-all ${
              showHidden
                ? 'bg-rose-100 text-rose-950 border border-rose-300'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            {showHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showHidden ? 'Hide Hidden Exercises' : `Show Hidden Exercises (${hiddenIds.length})`}</span>
          </button>
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((ex) => {
          const isHidden = hiddenIds.includes(ex.id);
          return (
            <div
              key={ex.id}
              className={`bg-white border rounded-3xl p-6 space-y-4 transition-all shadow-xs flex flex-col justify-between relative ${
                isHidden
                  ? 'border-dashed border-rose-300 bg-rose-50/20 opacity-80'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-stone-900 text-stone-100">
                      {ex.biomechanicsType}
                    </span>
                    <InfoBall
                      title={ex.name}
                      content={ex.description}
                      size="xs"
                    />
                    {isHidden && (
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        Hidden
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">{ex.equipment}</span>
                    <button
                      onClick={(e) => handleToggleHide(ex.id, e)}
                      className={`p-1.5 rounded-full transition-colors ${
                        isHidden
                          ? 'text-rose-800 hover:bg-rose-100'
                          : 'text-stone-300 hover:text-stone-700 hover:bg-stone-100'
                      }`}
                      title={isHidden ? 'Unhide exercise' : 'Hide exercise from routine selection'}
                    >
                      {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-stone-950 pt-1">{ex.name}</h3>
                <span className="text-xs font-semibold text-stone-500 block">{ex.targetRegion}</span>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {ex.description}
                </p>
              </div>

              <button
                onClick={() => setActiveModalExercise(ex)}
                className="w-full mt-3 py-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-xs font-semibold rounded-2xl flex items-center justify-center space-x-2 transition-colors uppercase tracking-wider"
              >
                <Info className="w-3.5 h-3.5 text-stone-600" />
                <span>Technique Cues</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Exercise Detail Modal */}
      {activeModalExercise && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl text-stone-900">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  {activeModalExercise.biomechanicsType} • {activeModalExercise.targetRegion}
                </span>
                <h3 className="text-2xl font-light text-stone-950 mt-0.5">{activeModalExercise.name}</h3>
              </div>
              <button
                onClick={() => setActiveModalExercise(null)}
                className="text-stone-400 hover:text-stone-900 p-1.5 rounded-full hover:bg-stone-100 text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {activeModalExercise.description}
            </p>

            <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest">
                Setup Instructions
              </h4>
              <ul className="text-xs text-stone-600 space-y-1.5 list-disc list-inside">
                {activeModalExercise.setupInstructions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest">
                Key Technique Cues
              </h4>
              <ul className="text-xs text-stone-600 space-y-1.5 list-disc list-inside">
                {activeModalExercise.techniqueCues.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
              <h4 className="text-xs font-bold text-rose-800 uppercase tracking-widest">
                Common Mistakes
              </h4>
              <ul className="text-xs text-stone-600 space-y-1.5 list-disc list-inside">
                {activeModalExercise.commonMistakes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setActiveModalExercise(null)}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded-full uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Custom Exercise Modal */}
      {isCreatingCustom && (
        <CreateExerciseModal
          onSave={handleSaveCustomExercise}
          onClose={() => setIsCreatingCustom(false)}
        />
      )}
    </div>
  );
};
