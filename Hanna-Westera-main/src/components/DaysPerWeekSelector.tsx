import React, { useState } from 'react';
import { Calendar, Check, Info, ArrowRight, ShieldCheck, Zap, Plus, Edit2, Trash2 } from 'lucide-react';
import { prebuiltSplits } from '../data/prebuiltSplits';
import { WorkoutSplit } from '../types';
import { CreateCustomSplitModal } from './CreateCustomSplitModal';
import { InfoBall } from './InfoBall';

interface DaysPerWeekSelectorProps {
  currentDays: number;
  activeSplitId?: string;
  userCreatedSplits?: WorkoutSplit[];
  onSelectDays: (days: number, splitId?: string) => void;
  onContinueToWorkout: () => void;
  onSaveCustomSplit?: (split: WorkoutSplit) => void;
  onDeleteCustomSplit?: (splitId: string) => void;
}

export const DaysPerWeekSelector: React.FC<DaysPerWeekSelectorProps> = ({
  currentDays,
  activeSplitId,
  userCreatedSplits = [],
  onSelectDays,
  onContinueToWorkout,
  onSaveCustomSplit,
  onDeleteCustomSplit
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSplit, setEditingSplit] = useState<WorkoutSplit | null>(null);

  // Combine prebuilt splits with user created custom splits
  const allAvailableSplits = [...prebuiltSplits, ...userCreatedSplits];

  // Determine active selected split
  const activeSplit =
    allAvailableSplits.find((s) => s.id === activeSplitId) ||
    allAvailableSplits.find((s) => s.daysPerWeek === currentDays) ||
    prebuiltSplits[1];

  const handleOpenCreateModal = () => {
    setEditingSplit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (e: React.MouseEvent, split: WorkoutSplit) => {
    e.stopPropagation();
    setEditingSplit(split);
    setIsModalOpen(true);
  };

  const handleDeleteSplit = (e: React.MouseEvent, splitId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this custom frequency split?')) {
      if (onDeleteCustomSplit) {
        onDeleteCustomSplit(splitId);
      }
    }
  };

  const handleSaveModalSplit = (split: WorkoutSplit) => {
    if (onSaveCustomSplit) {
      onSaveCustomSplit(split);
    }
    // Select this split
    onSelectDays(split.daysPerWeek, split.id);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-8 px-4">
      {/* Hero Banner */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5 text-stone-700" />
              <span>Customize Training Frequency</span>
              <InfoBall
                title="Frequency Algorithm"
                content="Select a frequency or build a custom split. The system automatically balances weekly set volume, muscle recovery windows, and movement patterns."
                size="xs"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-light text-stone-950 tracking-tight flex items-center gap-2">
              Select Weekly Frequency
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-normal">
              Choose your ideal training schedule or build a custom split with personalized exercise templates.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="self-start sm:self-center px-5 py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs tracking-wider uppercase rounded-full shadow-md transition-all shrink-0 flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Custom Split</span>
          </button>
        </div>
      </div>

      {/* Frequency Cards Grid (Standard + Custom) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest">
            Available Frequency Plans ({allAvailableSplits.length})
          </h2>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="text-xs font-semibold text-stone-900 hover:text-stone-700 flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Custom Split</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {allAvailableSplits.map((split) => {
            const isSelected = activeSplit?.id === split.id;
            const isUserCreated = userCreatedSplits.some((s) => s.id === split.id);

            return (
              <div
                key={split.id}
                onClick={() => onSelectDays(split.daysPerWeek, split.id)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-stone-900 border-stone-900 text-white shadow-md'
                    : 'bg-white border-stone-200 hover:border-stone-300 text-stone-900 hover:bg-stone-50/50 shadow-xs'
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-stone-950 border border-stone-700 text-stone-100 text-[9px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-2xs">
                    Active
                  </div>
                )}

                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className={`text-3xl font-light ${isSelected ? 'text-white' : 'text-stone-950'}`}>
                      0{split.daysPerWeek}
                    </span>
                    <div className="flex items-center space-x-1">
                      {isUserCreated && (
                        <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-stone-800 text-amber-300 border border-amber-500/30' : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}>
                          Custom
                        </span>
                      )}
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-stone-400' : 'text-stone-400'}`}>
                        Days / Wk
                      </span>
                    </div>
                  </div>

                  <h3 className={`text-sm font-medium mb-1 leading-snug line-clamp-2 ${isSelected ? 'text-stone-100' : 'text-stone-900'}`}>
                    {split.name.replace(/^\d-Day\s*/, '')}
                  </h3>

                  <p className={`text-xs line-clamp-2 leading-relaxed ${isSelected ? 'text-stone-400' : 'text-stone-500'}`}>
                    {split.tagline}
                  </p>
                </div>

                <div className={`mt-4 pt-3 flex items-center justify-between text-xs border-t ${
                  isSelected ? 'border-stone-800' : 'border-stone-100'
                }`}>
                  <span className={isSelected ? 'text-stone-400' : 'text-stone-400'}>
                    {split.days.length} Sessions
                  </span>

                  <div className="flex items-center space-x-1.5">
                    {isUserCreated && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => handleOpenEditModal(e, split)}
                          className={`p-1 rounded-md hover:bg-stone-800 transition-colors ${isSelected ? 'text-stone-300 hover:text-white' : 'text-stone-400 hover:text-stone-900 hover:bg-stone-100'}`}
                          title="Edit Custom Split"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteSplit(e, split.id)}
                          className={`p-1 rounded-md hover:bg-stone-800 transition-colors ${isSelected ? 'text-stone-300 hover:text-rose-400' : 'text-stone-400 hover:text-rose-600 hover:bg-stone-100'}`}
                          title="Delete Custom Split"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-white text-stone-950' : 'border border-stone-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Overview of Selected Frequency */}
      {activeSplit && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="px-3 py-0.5 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {activeSplit.daysPerWeek} Days / Week
                </span>
                <span className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                  Schedule: {activeSplit.idealDaysSchedule}
                </span>
              </div>
              <h2 className="text-2xl font-light text-stone-950 tracking-tight">{activeSplit.name}</h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">{activeSplit.description}</p>
            </div>

            <button
              onClick={onContinueToWorkout}
              className="bg-stone-900 hover:bg-stone-800 text-white font-medium px-6 py-3.5 rounded-full shadow-xs flex items-center justify-center space-x-2 transition-all text-xs tracking-wider uppercase whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>View Training Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Key Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-stone-900 text-xs font-bold uppercase tracking-widest">
                <div className="flex items-center space-x-2">
                  <Zap className="w-3.5 h-3.5 text-stone-700" />
                  <span>Weekly Volume</span>
                </div>
                <InfoBall
                  title="Weekly Set Volume"
                  content={activeSplit.weeklyVolumeNotes}
                  size="xs"
                />
              </div>
              <p className="text-xs text-stone-600 font-normal truncate">
                {activeSplit.days.reduce((acc, d) => acc + d.exercises.length * 3, 0)} total working sets across split
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-stone-900 text-xs font-bold uppercase tracking-widest">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
                  <span>Recovery Matrix</span>
                </div>
                <InfoBall
                  title="Recovery Science"
                  content={activeSplit.daysPerWeek <= 3
                    ? "72-hour recovery windows optimize myofibrillar protein synthesis and allow maximum load progression on primary lifts."
                    : "48-hour recovery windows optimize total weekly muscle volume while managing systemic CNS fatigue."
                  }
                  size="xs"
                />
              </div>
              <p className="text-xs text-stone-600 font-normal truncate">
                {activeSplit.daysPerWeek <= 3 ? '72h recovery between sessions' : '48h recovery between sessions'}
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-stone-900 text-xs font-bold uppercase tracking-widest">
                <div className="flex items-center space-x-2">
                  <Info className="w-3.5 h-3.5 text-stone-700" />
                  <span>Target Regions</span>
                </div>
                <InfoBall
                  title="Biomechanical Targeting"
                  content="Includes shortened position peak thrusts (gluteus maximus), lengthened stretch hinges (upper/lower tie-in), and lateral abduction (gluteus medius/minimus)."
                  size="xs"
                />
              </div>
              <p className="text-xs text-stone-600 font-normal truncate">
                Peak shortened, stretch-hinge & abduction mix
              </p>
            </div>
          </div>

          {/* Workout Days Preview List */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">
              {activeSplit.daysPerWeek}-Day Structure
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSplit.days.map((day) => (
                <div key={day.dayNumber} className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-stone-900 uppercase tracking-widest">
                      Session 0{day.dayNumber}
                    </span>
                    <span className="text-xs text-stone-600 dark:text-stone-300 font-medium font-mono">{day.estimatedMinutes} mins</span>
                  </div>
                  <h4 className="text-sm font-semibold text-stone-950">{day.title}</h4>
                  <p className="text-xs text-stone-500 line-clamp-1">{day.focus}</p>
                  <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-200/60 font-mono">
                    {day.exercises.length} Exercises • Primary: {day.exercises[0]?.exerciseId ? day.exercises[0].exerciseId.replace(/-/g, ' ') : 'Custom exercises'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Creating/Editing Custom Split */}
      {isModalOpen && (
        <CreateCustomSplitModal
          initialSplit={editingSplit}
          onSaveSplit={handleSaveModalSplit}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSplit(null);
          }}
        />
      )}
    </div>
  );
};
