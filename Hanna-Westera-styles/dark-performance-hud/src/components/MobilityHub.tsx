import React, { useState } from 'react';
import { Activity, Play, Clock } from 'lucide-react';
import { mobilityRoutines } from '../data/mobilityData';
import { MobilityRoutine } from '../types';
import { GuidedWarmupModal } from './GuidedWarmupModal';
import { InfoBall } from './InfoBall';

interface MobilityHubProps {
  customWarmups?: MobilityRoutine[];
}

export const MobilityHub: React.FC<MobilityHubProps> = ({ customWarmups = [] }) => {
  const allRoutines = [...mobilityRoutines, ...customWarmups];
  const [activeGuidedRoutine, setActiveGuidedRoutine] = useState<MobilityRoutine | null>(null);

  const startRoutine = (routine: MobilityRoutine) => {
    setActiveGuidedRoutine(routine);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Hero Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs hud-corners">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-widest">
          <Activity className="w-3.5 h-3.5 text-stone-800" />
          <span>Hip Mobility & Activation Suite</span>
          <InfoBall
            title="Activation Science"
            content="Unlocks tight psoas muscles, corrects anterior pelvic tilt, and primes gluteus maximus & medius neuromuscular firing prior to heavy loading."
            size="xs"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-light text-stone-950 tracking-tight">
          Mobility & Mind-Muscle Prep
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm max-w-3xl leading-relaxed font-normal">
          Targeted warm-ups and hip mobility routines to optimize glute recruitment before lifting.
        </p>
      </div>

      {/* Guided Active Routine Overlay Modal */}
      {activeGuidedRoutine && (
        <GuidedWarmupModal
          routine={activeGuidedRoutine}
          onClose={() => setActiveGuidedRoutine(null)}
        />
      )}

      {/* Routine Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allRoutines.map((routine) => {
          return (
            <div
              key={routine.id}
              className="bg-white border border-stone-200 hover:border-stone-300 rounded-3xl p-6 space-y-5 transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200/80 shrink-0">
                    {routine.category}
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs text-stone-500 font-medium shrink-0">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-mono">{routine.durationMinutes}</span><span>&nbsp;mins</span>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-light text-stone-950 tracking-tight">{routine.name}</h3>
                  <InfoBall
                    title={routine.name}
                    content={routine.description}
                    size="xs"
                  />
                </div>

                {/* Steps List */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    <span>Routine Flow ({routine.steps.length} Steps):</span>
                    <InfoBall
                      title="Step Cues"
                      content="Execute each dynamic movement slowly without forcing deep pain ranges. Focus on conscious glute contraction at peak positions."
                      size="xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-xs text-stone-700">
                    {routine.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 py-2 border-b border-stone-200/60 last:border-none">
                        <span className="font-medium text-stone-900 text-xs sm:text-sm leading-snug">{step.name}</span>
                        <span className="text-stone-600 font-mono text-xs sm:text-sm font-semibold shrink-0 whitespace-nowrap text-right">
                          {step.durationOrReps}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => startRoutine(routine)}
                className="w-full mt-4 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs tracking-wider uppercase rounded-full shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Guided Routine</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
