import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, RefreshCw, Wand2, Check, Dumbbell } from 'lucide-react';
import { UnitSystem } from '../types';
import { HudSelect } from './HudSelect';

interface AICoachPanelProps {
  daysPerWeek: number;
  unit: UnitSystem;
}

export const AICoachPanel: React.FC<AICoachPanelProps> = ({ daysPerWeek, unit }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'custom-generator'>('chat');

  // Chat state
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello! I'm **Coach Gluteus**, your AI biomechanics and strength specialist. Ask me anything about glute hypertrophy, exercise substitutions, fixing quad dominance during hip thrusts, or breaking a plateau!`
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Custom Split Generator State
  const [genLevel, setGenLevel] = useState<string>('Intermediate');
  const [genEquipment, setGenEquipment] = useState<string>('Full Gym (Barbell, Cables, Dumbbells, Machines)');
  const [genGoal, setGenGoal] = useState<string>('Maximal Glute Growth & Upper Shelf Density');
  const [genFocusAreas, setGenFocusAreas] = useState<string[]>(['Gluteus Maximus', 'Upper Shelf (Medius)']);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);
  const [isGenLoading, setIsGenLoading] = useState<boolean>(false);

  const presetQuestions = [
    'How do I fix quad dominance during barbell hip thrusts?',
    'What are the best dumbbell-only glute exercises for home?',
    'How can I break a weight plateau on Bulgarian Split Squat?',
    'Which mobility stretch releases tight hip flexors fast?'
  ];

  const handleSendChat = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || isChatLoading) return;

    // Append user message
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputPrompt('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          userContext: {
            daysPerWeek,
            unit
          }
        })
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setMessages((prev) => [...prev, { sender: 'ai', text: data.text }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: 'I encountered an issue connecting to the coach service. Please try again.' }
        ]);
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Unable to reach Coach Gluteus right now. Please check your connection.' }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleGenerateCustomSplit = async () => {
    setIsGenLoading(true);
    setGeneratedResult(null);

    try {
      const res = await fetch('/api/ai/generate-split', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          daysPerWeek,
          level: genLevel,
          goal: genGoal,
          equipment: genEquipment,
          focusAreas: genFocusAreas
        })
      });

      const data = await res.json();
      if (res.ok) {
        setGeneratedResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenLoading(false);
    }
  };

  const toggleFocusArea = (area: string) => {
    setGenFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Top Selector Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs hud-corners">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 hud-live-dot" />
              <span>Gemini Flash-Lite Intelligence</span>
            </div>
            <h1 className="text-3xl font-light text-stone-950 tracking-tight">AI Glute Specialist</h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-normal">
              Get personalized biomechanics advice or generate an AI-tailored glute routine.
            </p>
          </div>

          <div className="flex bg-stone-100 p-1 rounded-full border border-stone-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-5 py-2.5 rounded-full transition-all uppercase tracking-wider text-[11px] ${
                activeTab === 'chat'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Ask Coach
            </button>
            <button
              onClick={() => setActiveTab('custom-generator')}
              className={`px-5 py-2.5 rounded-full transition-all flex items-center space-x-1.5 uppercase tracking-wider text-[11px] ${
                activeTab === 'custom-generator'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Custom Generator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: AI Chat */}
      {activeTab === 'chat' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-4 sm:p-6 space-y-4 flex flex-col h-[80vh] max-h-[650px] sm:h-[550px] shadow-xs hud-corners">
          {/* Preset Prompts (only before the conversation gets going, so they don't crowd out the chat on mobile) */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-stone-100 shrink-0">
              {presetQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(q)}
                  className="max-w-full bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-stone-700 text-xs font-medium px-3.5 py-2 rounded-full transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-stone-900 text-cyan-300 flex items-center justify-center shrink-0 glow-border-cyan">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-stone-900 text-white rounded-tr-none border border-lime-400/40'
                      : 'bg-stone-50 border border-cyan-500/20 text-stone-800 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-stone-200 text-lime-500 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isChatLoading && (
              <div className="flex items-center space-x-3 text-stone-500 text-xs">
                <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Coach Gluteus is analyzing biomechanics...</span>
              </div>
            )}
          </div>

          {/* Input Field */}
          <div className="pt-3 border-t border-stone-100 flex items-center space-x-2 shrink-0">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="Ask about hip thrust cues, equipment subs, or mobility..."
              className="flex-1 bg-stone-50 border border-stone-200/80 rounded-full px-5 py-3 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-400"
            />
            <button
              onClick={() => handleSendChat()}
              disabled={isChatLoading || !inputPrompt.trim()}
              className="p-3 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-full shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Custom Split AI Generator */}
      {activeTab === 'custom-generator' && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-2xl font-light text-stone-950 tracking-tight flex items-center space-x-2">
              <Wand2 className="w-5 h-5 text-stone-800" />
              <span>Configure AI Custom Routine</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Training Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">Training Level</label>
                <HudSelect
                  value={genLevel}
                  onChange={setGenLevel}
                  className="w-full bg-stone-50 border border-stone-200/80 rounded-2xl px-4 py-3 text-xs text-stone-900"
                  options={[
                    { value: 'Beginner', label: 'Beginner (Mastering Form & Activation)' },
                    { value: 'Intermediate', label: 'Intermediate (Consistent Lifter)' },
                    { value: 'Advanced', label: 'Advanced (High Frequency & Intensity)' }
                  ]}
                />
              </div>

              {/* Equipment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">Equipment Available</label>
                <HudSelect
                  value={genEquipment}
                  onChange={setGenEquipment}
                  className="w-full bg-stone-50 border border-stone-200/80 rounded-2xl px-4 py-3 text-xs text-stone-900"
                  options={[
                    {
                      value: 'Full Gym (Barbell, Cables, Dumbbells, Machines)',
                      label: 'Full Gym (Barbell, Cables, Dumbbells, Machines)'
                    },
                    {
                      value: 'Dumbbells & Resistance Bands Only (Home Gym)',
                      label: 'Dumbbells & Resistance Bands Only (Home Gym)'
                    },
                    { value: 'Bodyweight & Mini Bands Only', label: 'Bodyweight & Mini Bands Only' }
                  ]}
                />
              </div>
            </div>

            {/* Target Focus Areas */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block uppercase tracking-wider">Focus Areas</label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Gluteus Maximus',
                  'Upper Shelf (Medius)',
                  'Glute-Ham Tie-In',
                  'Single-Leg Stability',
                  'Knee-Friendly Loading'
                ].map((area) => {
                  const isChecked = genFocusAreas.includes(area);
                  return (
                    <button
                      key={area}
                      onClick={() => toggleFocusArea(area)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                        isChecked
                          ? 'bg-stone-900 border-stone-900 text-white'
                          : 'bg-stone-50 border-stone-200/80 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleGenerateCustomSplit}
              disabled={isGenLoading}
              className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs tracking-wider uppercase rounded-full shadow-xs flex items-center justify-center space-x-2 transition-all"
            >
              {isGenLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Generating Custom AI Routine...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate AI {daysPerWeek}-Day Custom Split</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Result */}
          {generatedResult && (
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-stone-100 pb-4">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  AI Custom Split Generated
                </span>
                <h3 className="text-2xl font-light text-stone-950 mt-0.5">{generatedResult.splitTitle}</h3>
                <p className="text-xs text-stone-500 mt-1">{generatedResult.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedResult.days?.map((day: any, idx: number) => (
                  <div key={idx} className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Session <span className="font-mono">0{day.dayNumber}</span>: {day.title}</span>
                    <p className="text-xs text-stone-500">{day.focus}</p>

                    <div className="space-y-1.5 pt-2 border-t border-stone-200/60 text-xs">
                      {day.exercises?.map((ex: any, exIdx: number) => (
                        <div key={exIdx} className="flex justify-between text-stone-800">
                          <span>{ex.name}</span>
                          <span className="text-stone-500 font-mono text-[11px]">{ex.sets} sets x {ex.reps}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
