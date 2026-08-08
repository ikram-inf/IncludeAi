import React from 'react';
import { X, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { TimerMode, TimerStatus } from '../types';

interface PomodoroModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: string;
  setGoal: (goal: string) => void;
  durationMinutes: number;
  setDurationMinutes: (mins: number) => void;
  shortBreakMinutes: number;
  setShortBreakMinutes: (mins: number) => void;
  longBreakMinutes: number;
  setLongBreakMinutes: (mins: number) => void;
  timeLeftSeconds: number;
  timerStatus: TimerStatus;
  timerMode: TimerMode;
  autoStartBreak: boolean;
  setAutoStartBreak: (val: boolean) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onModeChange: (mode: TimerMode) => void;
  onOpenAIChatForGoal?: (goal: string) => void;
}

export const PomodoroModal: React.FC<PomodoroModalProps> = ({
  isOpen,
  onClose,
  goal,
  setGoal,
  durationMinutes,
  setDurationMinutes,
  shortBreakMinutes,
  setShortBreakMinutes,
  longBreakMinutes,
  setLongBreakMinutes,
  timeLeftSeconds,
  timerStatus,
  timerMode,
  autoStartBreak,
  setAutoStartBreak,
  onStart,
  onPause,
  onReset,
  onModeChange,
  onOpenAIChatForGoal,
}) => {
  if (!isOpen) return null;

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const presets = [10, 25, 50, 75, 100];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/20 backdrop-blur-[2px] transition-all">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#4A4A4A]/5 border border-[#E5E0D5]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-[#A09B8E] hover:text-[#4A4A4A] hover:bg-[#F5F2ED] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow Label */}
          <span className="text-[11px] font-bold tracking-[0.3em] text-[#8BA888] uppercase mb-1">
            ONE THING AT A TIME
          </span>

          {/* Main Title */}
          <h2 className="text-3xl font-normal text-[#4A4A4A] mb-6 tracking-wide">
            {timerMode === 'focus' ? 'Focus timer' : timerMode === 'shortBreak' ? 'Short break' : 'Long break'}
          </h2>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F5F2ED] rounded-2xl mb-6 text-xs font-medium border border-[#E5E0D5]">
            <button
              onClick={() => onModeChange('focus')}
              className={`px-4 py-2 rounded-xl transition-all ${
                timerMode === 'focus'
                  ? 'bg-[#8BA888] text-white shadow-sm font-semibold'
                  : 'text-[#4A4A4A] hover:text-stone-900'
              }`}
            >
              Focus ({durationMinutes}m)
            </button>
            <button
              onClick={() => onModeChange('shortBreak')}
              className={`px-4 py-2 rounded-xl transition-all ${
                timerMode === 'shortBreak'
                  ? 'bg-[#8BA888] text-white shadow-sm font-semibold'
                  : 'text-[#4A4A4A] hover:text-stone-900'
              }`}
            >
              Short Break ({shortBreakMinutes}m)
            </button>
            <button
              onClick={() => onModeChange('longBreak')}
              className={`px-4 py-2 rounded-xl transition-all ${
                timerMode === 'longBreak'
                  ? 'bg-[#8BA888] text-white shadow-sm font-semibold'
                  : 'text-[#4A4A4A] hover:text-stone-900'
              }`}
            >
              Long Break ({longBreakMinutes}m)
            </button>
          </div>

          {/* Focus Goal Input */}
          {timerMode === 'focus' && (
            <div className="w-full max-w-sm mb-5 relative group">
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="What are you focusing on?"
                className="w-full px-5 py-3 rounded-2xl border border-[#E5E0D5] bg-[#FDFCFB] text-[#4A4A4A] placeholder-[#A09B8E] text-center text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#8BA888]/40 focus:border-[#8BA888] transition-all"
              />
              {goal.trim() && onOpenAIChatForGoal && (
                <button
                  type="button"
                  onClick={() => onOpenAIChatForGoal(goal)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8BA888] hover:text-[#7A9677] bg-[#F5F2ED] hover:bg-[#E5E0D5] px-2.5 py-1 rounded-xl flex items-center gap-1 transition-colors"
                  title="Ask Momentum AI to break this task down"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Break down</span>
                </button>
              )}
            </div>
          )}

          {/* Duration Adjuster */}
          {timerStatus === 'idle' && (
            <div className="flex items-center gap-2 mb-6 text-sm text-[#A09B8E]">
              <span>Focus length</span>
              <input
                type="number"
                min="10"
                max="100"
                value={durationMinutes}
                onChange={(e) => {
                  const val = Math.max(10, Math.min(100, Number(e.target.value) || 10));
                  setDurationMinutes(val);
                }}
                className="w-16 px-2 py-1 text-center border border-[#E5E0D5] rounded-xl font-medium text-[#4A4A4A] bg-[#FDFCFB] focus:outline-none focus:ring-2 focus:ring-[#8BA888]"
              />
              <span>minutes</span>

              {/* Quick Presets */}
              <div className="flex items-center gap-1 ml-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => setDurationMinutes(p)}
                    className={`px-2 py-0.5 text-xs rounded-lg transition-colors ${
                      durationMinutes === p
                        ? 'bg-[#8BA888] text-white font-medium'
                        : 'bg-[#F5F2ED] text-[#4A4A4A] hover:bg-[#E5E0D5]'
                    }`}
                  >
                    {p}m
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Big Countdown Timer Display */}
          <div className="text-8xl font-light tracking-tighter text-[#4A4A4A] font-mono my-2 select-none">
            {formattedTime}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-3 mt-6 mb-8">
            {timerStatus === 'running' ? (
              <button
                onClick={onPause}
                className="px-8 py-3.5 rounded-full bg-[#D4A373] text-white font-semibold text-sm hover:bg-[#c29364] transition-all flex items-center gap-2 shadow-sm active:scale-95"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={onStart}
                className="px-8 py-3.5 rounded-full bg-[#8BA888] text-white font-semibold text-sm hover:bg-[#7A9677] transition-all flex items-center gap-2 shadow-sm active:scale-95"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>{timerStatus === 'paused' ? 'Resume' : 'Start session'}</span>
              </button>
            )}

            <button
              onClick={onReset}
              className="px-8 py-3.5 rounded-full bg-white border border-[#E5E0D5] text-[#4A4A4A] font-semibold text-sm hover:bg-[#FDFCFB] transition-all shadow-sm"
              title="Reset timer"
              aria-label="Reset timer"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

          {/* Auto-start break option toggle */}
          <div className="flex items-center gap-2 mb-6 text-xs text-[#4A4A4A] bg-[#F5F2ED] px-4 py-2 rounded-xl border border-[#E5E0D5]">
            <input
              type="checkbox"
              id="autoStartBreakToggle"
              checked={autoStartBreak}
              onChange={(e) => setAutoStartBreak(e.target.checked)}
              className="rounded text-[#8BA888] focus:ring-[#8BA888] accent-[#8BA888]"
            />
            <label htmlFor="autoStartBreakToggle" className="cursor-pointer">
              Start break automatically when study session ends
            </label>
          </div>

          {/* Footnote guidance */}
          <p className="text-xs text-[#A09B8E] max-w-sm leading-relaxed">
            Choose a focus length of 10, 25, 50, 75, or 100 minutes. When time is up, your completed session earns a fluttering butterfly for your sanctuary.
          </p>
        </div>
      </div>
    </div>
  );
};
