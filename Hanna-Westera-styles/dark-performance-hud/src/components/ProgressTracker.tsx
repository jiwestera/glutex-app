import React, { useState } from 'react';
import { Award, Calendar, Flame, TrendingUp, Dumbbell, Clock, ChevronDown, ChevronUp, Trash2, Eye, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { WorkoutLog, UnitSystem } from '../types';
import { getAllExercises } from '../utils/exerciseUtils';
import { InfoBall } from './InfoBall';
import { ConfirmModal } from './ConfirmModal';

interface ProgressTrackerProps {
  logs: WorkoutLog[];
  unit: UnitSystem;
  onDeleteLog?: (logId: string) => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ logs, unit, onDeleteLog }) => {
  const [expandedLogIds, setExpandedLogIds] = useState<string[]>([]);
  const [selectedLogForModal, setSelectedLogForModal] = useState<WorkoutLog | null>(null);
  const [logToDelete, setLogToDelete] = useState<WorkoutLog | null>(null);

  const allExercises = getAllExercises();

  const toggleExpand = (logId: string) => {
    setExpandedLogIds((prev) =>
      prev.includes(logId) ? prev.filter((id) => id !== logId) : [...prev, logId]
    );
  };

  // Compute personal records across all logs
  const personalRecordsMap = new Map<
    string,
    { exerciseName: string; maxWeight: number; maxReps: number; date: string }
  >();

  logs.forEach((log) => {
    log.exercises.forEach((ex) => {
      ex.sets.forEach((set) => {
        if (set.completed && set.weightKg > 0) {
          const current = personalRecordsMap.get(ex.exerciseId);
          if (!current || set.weightKg > current.maxWeight) {
            personalRecordsMap.set(ex.exerciseId, {
              exerciseName: ex.exerciseName,
              maxWeight: set.weightKg,
              maxReps: set.reps,
              date: new Date(log.date).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })
            });
          }
        }
      });
    });
  });

  const prList = Array.from(personalRecordsMap.values());

  const formatSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} mins`;
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-2 shadow-xs hud-corners">
          <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-widest">
            <span>Workouts Completed</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-4xl font-mono font-light glow-text-cyan tracking-tight">{logs.length}</p>
          <p className="text-xs text-stone-500">Total Saved Days in History</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-2 shadow-xs hud-corners hud-corners-lime">
          <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-widest">
            <span>Personal Records</span>
            <Award className="w-4 h-4 text-lime-400" />
          </div>
          <p className="text-4xl font-mono font-light glow-text-lime tracking-tight">{prList.length}</p>
          <p className="text-xs text-stone-500">Heavy Lifts Tracked</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-2 shadow-xs hud-corners">
          <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-widest">
            <span>Consistency</span>
            <Flame className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-4xl font-mono font-light glow-text-cyan tracking-tight">{logs.length > 0 ? 'Active' : '0'}</p>
          <p className="text-xs text-stone-500">Training Routine</p>
        </div>
      </div>

      {/* Personal Records Table */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs hud-corners hud-corners-lime">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-lime-400" />
            <h2 className="text-2xl font-light text-stone-950 tracking-tight">Glute Strength Records</h2>
            <InfoBall
              title="Progressive Overload PRs"
              content="Tracked from completed working sets. Increases in weight or reps at constant RPE reflect myofibrillar hypertrophy and progressive mechanical tension."
              size="xs"
            />
          </div>
        </div>

        {prList.length === 0 ? (
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-8 text-center text-stone-500 text-xs leading-relaxed">
            No personal records logged yet. Complete your first workout session to track your strength PRs!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prList.map((pr, idx) => (
              <div key={idx} className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Heavy Lift Record</span>
                <h4 className="text-sm font-semibold text-stone-950">{pr.exerciseName}</h4>
                <div className="text-xl font-mono font-light glow-text-lime">
                  {pr.maxWeight} {unit} <span className="text-xs text-stone-500 font-normal font-sans">x {pr.maxReps} reps</span>
                </div>
                <span className="text-[10px] text-stone-400 block pt-1">{pr.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workout History Timeline */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-stone-950 tracking-tight flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-stone-800" />
            <span>Session History ({logs.length})</span>
          </h2>
          <span className="text-xs text-stone-500 hidden sm:inline-block">
            Saved permanently so you can inspect past weights & reps
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-8 text-center text-stone-500 text-xs">
            Your saved workout logs will appear here after completing a workout session.
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => {
              const isExpanded = expandedLogIds.includes(log.id);
              const formattedDate = new Date(log.date).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div key={log.id} className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest bg-stone-200/70 px-2 py-0.5 rounded-md font-mono">
                          Session 0{log.dayNumber}
                        </span>
                        <span className="text-xs text-stone-400 font-mono">{formattedDate}</span>
                      </div>
                      <h3 className="text-base font-semibold text-stone-950 mt-1">{log.dayTitle}</h3>
                    </div>

                    <div className="flex items-center space-x-3 self-start sm:self-center">
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-stone-700 font-medium block font-mono">
                          <Clock className="w-3 h-3 inline mr-1 text-stone-400" />
                          {formatSeconds(log.durationSeconds)}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedLogForModal(log)}
                        className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white transition-colors flex items-center space-x-1.5 text-xs font-semibold cursor-pointer shadow-2xs"
                        title="Open full session details modal"
                      >
                        <Eye className="w-3.5 h-3.5 text-rose-300" />
                        <span>Open Session</span>
                      </button>

                      <button
                        onClick={() => toggleExpand(log.id)}
                        className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition-colors flex items-center space-x-1 text-xs font-medium cursor-pointer"
                        title={isExpanded ? 'Collapse sets breakdown' : 'Expand full sets breakdown'}
                      >
                        <span>{isExpanded ? 'Hide' : 'Quick View'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {onDeleteLog && (
                        <button
                          onClick={() => setLogToDelete(log)}
                          className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete log entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quick View: exercise names only, no set detail */}
                  {isExpanded && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-stone-200/60 animate-fadeIn">
                      {log.exercises.map((e, idx) => {
                        const matchedLibraryEx = allExercises.find(
                          (libEx) => libEx.id === e.exerciseId || libEx.name.toLowerCase() === e.exerciseName.toLowerCase()
                        );

                        return (
                          <div
                            key={idx}
                            className="bg-white px-3 py-1.5 rounded-full border border-stone-200/80 text-xs font-medium text-stone-800 flex items-center space-x-1.5"
                          >
                            <span>{e.exerciseName}</span>
                            {matchedLibraryEx && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-500 border border-stone-200">
                                {matchedLibraryEx.equipment}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {log.notes && (
                    <p className="text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-200/80 font-sans">
                      {log.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inspect Session Modal */}
      {selectedLogForModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scaleIn">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 text-stone-400 text-xs font-bold uppercase tracking-widest">
                  <span>Session Log Details</span>
                  <span>·</span>
                  <span>
                    {new Date(selectedLogForModal.date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <h3 className="text-xl font-light text-white mt-1">
                  Day {selectedLogForModal.dayNumber}: {selectedLogForModal.dayTitle}
                </h3>
              </div>

              <button
                onClick={() => setSelectedLogForModal(null)}
                className="p-2 rounded-full bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-stone-50/50">
              {/* Summary Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 space-y-0.5">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Duration</span>
                  <span className="text-base font-mono font-semibold glow-text-cyan flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>{formatSeconds(selectedLogForModal.durationSeconds)}</span>
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 space-y-0.5">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total Exercises</span>
                  <span className="text-base font-semibold text-stone-900 flex items-center space-x-1">
                    <Dumbbell className="w-4 h-4 text-stone-500" />
                    <span><span className="font-mono">{selectedLogForModal.exercises.length}</span> Exercises</span>
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 space-y-0.5">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Rating</span>
                  <span className="text-base font-mono font-semibold text-rose-700">
                    {selectedLogForModal.feelingRating ? `${selectedLogForModal.feelingRating} / 5` : 'Not rated'}
                  </span>
                </div>
              </div>

              {/* Logged Exercises List */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center space-x-2">
                  <Dumbbell className="w-4 h-4 text-stone-700" />
                  <span>Exercises Logged In This Session</span>
                </h4>

                {selectedLogForModal.exercises.map((e, idx) => {
                  const matchedLibraryEx = allExercises.find(
                    (libEx) => libEx.id === e.exerciseId || libEx.name.toLowerCase() === e.exerciseName.toLowerCase()
                  );

                  return (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3 shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-100 pb-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-stone-400 font-mono">0{idx + 1}</span>
                            <h5 className="text-sm font-semibold text-stone-950">{e.exerciseName}</h5>
                          </div>
                          {matchedLibraryEx && (
                            <span className="text-[10px] text-stone-500 block mt-0.5">
                              Target: <strong className="text-stone-700">{matchedLibraryEx.targetRegion}</strong> · {matchedLibraryEx.equipment}
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full self-start sm:self-center">
                          {e.sets.length} Sets Total
                        </span>
                      </div>

                      {/* Sets breakdown table/pills */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {e.sets.map((s, sIdx) => (
                          <div
                            key={sIdx}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                              s.completed
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                                : 'bg-stone-50 border-stone-200 text-stone-700'
                            }`}
                          >
                            <span className="font-bold text-stone-500 font-mono">Set {s.setNumber}</span>
                            <span className="font-semibold font-mono">
                              {s.weightKg > 0 ? `${s.weightKg} ${unit}` : 'Bodyweight'} × {s.reps} reps
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              s.completed ? 'bg-emerald-200/80 text-emerald-900' : 'bg-stone-200 text-stone-600'
                            }`}>
                              {s.completed ? 'Completed' : 'Logged'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedLogForModal.notes && (
                <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-widest block">Session Notes</span>
                  <p className="text-xs text-rose-950 font-sans leading-relaxed">
                    {selectedLogForModal.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-100 flex justify-end">
              <button
                onClick={() => setSelectedLogForModal(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white font-medium text-xs hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Close Session
              </button>
            </div>
          </div>
        </div>
      )}

      {logToDelete && (
        <ConfirmModal
          title="Delete Log Entry?"
          message={
            <>
              Delete <strong className="text-stone-900 font-semibold">{logToDelete.dayTitle}</strong> from{' '}
              <strong className="text-stone-900 font-semibold">
                {new Date(logToDelete.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </strong>? This will permanently remove it from your workout history.
            </>
          }
          confirmLabel="Yes, Delete"
          onCancel={() => setLogToDelete(null)}
          onConfirm={() => {
            if (onDeleteLog) {
              onDeleteLog(logToDelete.id);
            }
            setLogToDelete(null);
          }}
        />
      )}
    </div>
  );
};
