import React, { useState, useEffect } from 'react';
import { X, Play, Pause, SkipForward, SkipBack, RotateCcw, CheckCircle2, Shield, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { MobilityRoutine, MobilityStep } from '../types';

interface GuidedWarmupModalProps {
  routine: MobilityRoutine;
  onClose: () => void;
}

export const GuidedWarmupModal: React.FC<GuidedWarmupModalProps> = ({ routine, onClose }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const getSecondsFromStep = (step: MobilityStep): number => {
    if (!step) return 30;
    const match = step.durationOrReps.match(/(\d+)\s*s/i) || step.durationOrReps.match(/(\d+)\s*sec/i);
    if (match) return parseInt(match[1], 10);
    return 30; // sensible default
  };

  const currentStep = routine.steps[activeStepIndex];
  const [stepTimerSeconds, setStepTimerSeconds] = useState<number>(() => getSecondsFromStep(currentStep));

  // Reset timer when step index changes
  useEffect(() => {
    if (currentStep) {
      setStepTimerSeconds(getSecondsFromStep(currentStep));
      setIsTimerRunning(true);
    }
  }, [activeStepIndex, routine]);

  // Play audio chime
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      // Audio context error ignore
    }
  };

  // Timer interval countdown
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && stepTimerSeconds > 0 && !isCompleted) {
      interval = setInterval(() => {
        setStepTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (stepTimerSeconds === 0 && isTimerRunning && !isCompleted) {
      playChime();
      if (activeStepIndex < routine.steps.length - 1) {
        setActiveStepIndex((prev) => prev + 1);
      } else {
        setIsTimerRunning(false);
        setIsCompleted(true);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, stepTimerSeconds, activeStepIndex, routine, isCompleted, soundEnabled]);

  const handleNextStep = () => {
    if (activeStepIndex < routine.steps.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      setIsTimerRunning(false);
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex((prev) => prev - 1);
    }
  };

  const handleResetStep = () => {
    setStepTimerSeconds(getSecondsFromStep(currentStep));
    setIsTimerRunning(true);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-stone-900 text-stone-100 border border-stone-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 space-y-6 relative shadow-2xl mv-glow-pink my-auto"
      >
        {/* Header - Sticky at top of modal scroll */}
        <div className="sticky -top-5 sm:-top-8 -mx-5 sm:-mx-8 px-5 sm:px-8 pt-5 sm:pt-8 pb-4 bg-stone-900/95 backdrop-blur-sm z-20 flex items-center justify-between border-b border-stone-800">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
              {routine.category} • {routine.durationMinutes} mins
            </span>
            <h2 className="text-lg sm:text-2xl font-normal mv-gradient-text mt-0.5">{routine.name}</h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
              title={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-full text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
              title="Close Routine"
            >
              <span>Exit</span>
              <X className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Step Progress Chips */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1">
          {routine.steps.map((step, idx) => {
            const isCurrent = idx === activeStepIndex && !isCompleted;
            const isDone = idx < activeStepIndex || isCompleted;

            return (
              <button
                key={idx}
                onClick={() => {
                  setIsCompleted(false);
                  setActiveStepIndex(idx);
                }}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all shrink-0 cursor-pointer flex items-center space-x-1.5 ${
                  isCurrent
                    ? 'bg-white text-stone-950 font-bold shadow-xs'
                    : isDone
                    ? 'bg-stone-800 text-emerald-400 border border-emerald-500/30'
                    : 'bg-stone-800/60 text-stone-400 hover:bg-stone-800'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> : null}
                <span>
                  Step {idx + 1}: {step.name.length > 18 ? step.name.substring(0, 16) + '...' : step.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Completed Celebration View */}
        {isCompleted ? (
          <div className="py-8 text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mv-glow-gold">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-normal mv-gradient-text-gold">Routine Completed!</h3>
              <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
                Great work! Your hips and glutes are fully activated and primed for maximum power and injury prevention.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3.5 bg-white hover:bg-stone-100 text-stone-950 font-semibold text-xs tracking-wider uppercase rounded-full shadow-lg transition-all cursor-pointer"
            >
              Finish & Return
            </button>
          </div>
        ) : (
          /* Active Step View */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Step Details */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Step {activeStepIndex + 1} of {routine.steps.length}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-200 border border-stone-700">
                  {currentStep.targetArea}
                </span>
              </div>

              <h3 className="text-xl font-medium text-stone-100">{currentStep.name}</h3>

              <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800 space-y-1.5">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                  Technique & Cues
                </span>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                  {currentStep.instructions}
                </p>
              </div>

              <div className="bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-widest block">
                  Key Activation Benefit
                </span>
                <p className="text-xs text-stone-200 font-sans font-medium leading-relaxed">
                  {currentStep.keyBenefit}
                </p>
              </div>
            </div>

            {/* Right 1 Col: Timer & Controls */}
            <div className="bg-stone-950/90 p-6 rounded-2xl border border-stone-800 flex flex-col items-center justify-between text-center space-y-5">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                Recommended Duration
              </span>

              <div className="relative w-36 h-36 rounded-full border-2 border-stone-700 flex flex-col items-center justify-center bg-stone-900 shadow-inner mv-glow-cyan">
                <span className="text-4xl font-serif mv-gradient-text">
                  {stepTimerSeconds}s
                </span>
                <span className="text-[10px] text-stone-400 font-mono mt-1">
                  {currentStep.durationOrReps}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePrevStep}
                  disabled={activeStepIndex === 0}
                  className="p-3 bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:hover:bg-stone-800 text-stone-200 font-bold rounded-full transition-colors cursor-pointer"
                  title="Previous Step"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-4 bg-white text-stone-950 font-bold rounded-full shadow-md hover:bg-stone-100 transition-colors cursor-pointer"
                  title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
                >
                  {isTimerRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button
                  onClick={handleResetStep}
                  className="p-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-full transition-colors cursor-pointer"
                  title="Reset Step Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleNextStep}
                  className="p-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-full transition-colors cursor-pointer"
                  title="Next Step"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-xs font-semibold py-2 px-4 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-300 transition-colors cursor-pointer"
              >
                Exit Routine
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
