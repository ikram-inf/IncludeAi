import React from 'react';
import { X, Settings, Bell, Volume2, Play } from 'lucide-react';
import { AmbientSound, CompletionChime } from '../types';
import { playCompletionChime } from '../utils/audioSynth';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  durationMinutes: number;
  setDurationMinutes: (val: number) => void;
  shortBreakMinutes: number;
  setShortBreakMinutes: (val: number) => void;
  longBreakMinutes: number;
  setLongBreakMinutes: (val: number) => void;
  autoStartBreak: boolean;
  setAutoStartBreak: (val: boolean) => void;
  completionChime: CompletionChime;
  setCompletionChime: (chime: CompletionChime) => void;
  ambientSound: AmbientSound;
  setAmbientSound: (sound: AmbientSound) => void;
  ambientVolume: number;
  setAmbientVolume: (vol: number) => void;
  chimeVolume: number;
  setChimeVolume: (vol: number) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (val: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  durationMinutes,
  setDurationMinutes,
  shortBreakMinutes,
  setShortBreakMinutes,
  longBreakMinutes,
  setLongBreakMinutes,
  autoStartBreak,
  setAutoStartBreak,
  completionChime,
  setCompletionChime,
  ambientSound,
  setAmbientSound,
  ambientVolume,
  setAmbientVolume,
  chimeVolume,
  setChimeVolume,
  notificationsEnabled,
  setNotificationsEnabled,
}) => {
  if (!isOpen) return null;

  const handleRequestNotificationPermission = async () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(!notificationsEnabled);
      } else {
        const result = await Notification.requestPermission();
        if (result === 'granted') {
          setNotificationsEnabled(true);
        } else {
          setNotificationsEnabled(false);
        }
      }
    } else {
      setNotificationsEnabled(!notificationsEnabled);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/20 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[88vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5E0D5] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E5E0D5] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF8E7] text-[#D4A373] border border-[#F5E6D3] flex items-center justify-center shadow-sm">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-normal text-[#4A4A4A]">Timer & Sensory Settings</h3>
              <p className="text-xs text-[#A09B8E] mt-0.5">
                Tailor your focus rhythm and sound environment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#A09B8E] hover:text-[#4A4A4A] hover:bg-[#F5F2ED] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* SECTION 1: FOCUS & BREAK DURATIONS (MINUTES) */}
        <div className="mb-6 space-y-2">
          <label className="text-[10px] font-bold text-[#D4A373] uppercase tracking-widest block">
            Focus & Break Durations (Minutes)
          </label>

          <div className="grid grid-cols-3 gap-3">
            {/* Focus Duration */}
            <div className="p-3 bg-[#FDFCFB] border border-[#E5E0D5] rounded-2xl">
              <span className="text-[11px] text-[#A09B8E] block mb-1">Focus</span>
              <input
                type="number"
                min="1"
                max="180"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Math.max(1, Number(e.target.value) || 1))}
                className="w-full px-3 py-1.5 border border-[#E5E0D5] rounded-xl text-center font-semibold text-[#4A4A4A] bg-white focus:outline-none focus:ring-2 focus:ring-[#D99B38]"
              />
            </div>

            {/* Short Break */}
            <div className="p-3 bg-[#FDFCFB] border border-[#E5E0D5] rounded-2xl">
              <span className="text-[11px] text-[#A09B8E] block mb-1">Short Break</span>
              <input
                type="number"
                min="2"
                max="10"
                value={shortBreakMinutes}
                onChange={(e) => setShortBreakMinutes(Math.max(2, Math.min(10, Number(e.target.value) || 2)))}
                className="w-full px-3 py-1.5 border border-[#E5E0D5] rounded-xl text-center font-semibold text-[#4A4A4A] bg-white focus:outline-none focus:ring-2 focus:ring-[#D99B38]"
              />
            </div>

            {/* Long Break */}
            <div className="p-3 bg-[#FDFCFB] border border-[#E5E0D5] rounded-2xl">
              <span className="text-[11px] text-[#A09B8E] block mb-1">Long Break</span>
              <input
                type="number"
                min="15"
                max="25"
                value={longBreakMinutes}
                onChange={(e) => setLongBreakMinutes(Math.max(10, Math.min(25, Number(e.target.value) || 10)))}
                className="w-full px-3 py-1.5 border border-[#E5E0D5] rounded-xl text-center font-semibold text-[#4A4A4A] bg-white focus:outline-none focus:ring-2 focus:ring-[#D99B38]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: FLOW AUTOMATION */}
        <div className="mb-6 space-y-2">
          <label className="text-[10px] font-bold text-[#D4A373] uppercase tracking-widest block">
            Flow Automation
          </label>

          <div className="p-4 rounded-2xl bg-[#FDFCFB] border border-[#E5E0D5] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#4A4A4A] block">Auto-Start Break</span>
              <span className="text-[11px] text-[#A09B8E]">
                Automatically start break timer when focus ends
              </span>
            </div>

            <button
              type="button"
              onClick={() => setAutoStartBreak(!autoStartBreak)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                autoStartBreak ? 'bg-[#D99B38]' : 'bg-[#E5E0D5]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoStartBreak ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* SECTION 3: GENTLE AUDIO & SOUNDSCAPES */}
        <div className="mb-6 space-y-3">
          <label className="text-[10px] font-bold text-[#D4A373] uppercase tracking-widest block">
            Gentle Audio & Soundscapes
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Completion Chime */}
            <div>
              <label className="text-[11px] text-[#A09B8E] block mb-1">Completion Chime</label>
              <div className="relative flex items-center">
                <select
                  value={completionChime}
                  onChange={(e) => {
                    const val = e.target.value as CompletionChime;
                    setCompletionChime(val);
                    playCompletionChime(val, chimeVolume);
                  }}
                  className="w-full px-3 py-2.5 bg-[#FDFCFB] border border-[#E5E0D5] rounded-2xl text-xs font-medium text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#D99B38]"
                >
                  <option value="softGong">Soft Tibetan Gong</option>
                  <option value="singingBowl">Resonant Singing Bowl</option>
                  <option value="gentleBell">Gentle Crystal Bell</option>
                  <option value="chime">Soothing Major Chime</option>
                  <option value="none">Off (Silent)</option>
                </select>
                {completionChime !== 'none' && (
                  <button
                    type="button"
                    onClick={() => playCompletionChime(completionChime, chimeVolume)}
                    className="absolute right-2 p-1 text-[#D99B38] hover:text-[#C58A2B]"
                    title="Test chime"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                )}
              </div>
            </div>

            {/* Background Ambient */}
            <div>
              <label className="text-[11px] text-[#A09B8E] block mb-1">Background Ambient</label>
              <select
                value={ambientSound}
                onChange={(e) => setAmbientSound(e.target.value as AmbientSound)}
                className="w-full px-3 py-2.5 bg-[#FDFCFB] border border-[#E5E0D5] rounded-2xl text-xs font-medium text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#D99B38]"
              >
                <option value="none">Off (Silent)</option>
                <option value="rain">Gentle Rain</option>
                <option value="forest">Forest Breeze</option>
                <option value="brownNoise">Brown Noise</option>
                <option value="cafe">Soft Cafe</option>
              </select>
            </div>
          </div>

          {/* Volume Control Sliders */}
          <div className="p-4 rounded-2xl bg-[#FDFCFB] border border-[#E5E0D5] space-y-3">
            {/* Chime Volume */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#4A4A4A] font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#D99B38]" />
                  Chime Volume
                </span>
                <span className="text-stone-500">{Math.round(chimeVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={chimeVolume}
                onChange={(e) => setChimeVolume(parseFloat(e.target.value))}
                className="w-full accent-[#D99B38] cursor-pointer"
              />
            </div>

            {/* Ambient Sound Volume if enabled */}
            {ambientSound !== 'none' && (
              <div className="pt-2 border-t border-[#E5E0D5]/60">
                <div className="flex items-center justify-between text-xs text-[#4A4A4A] font-medium mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-[#D99B38]" />
                    Ambient Sound Volume
                  </span>
                  <span className="text-stone-500">{Math.round(ambientVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={ambientVolume}
                  onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                  className="w-full accent-[#D99B38] cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: NOTIFICATIONS */}
        <div className="mb-6 space-y-2">
          <label className="text-[10px] font-bold text-[#D4A373] uppercase tracking-widest block">
            Notifications & Alerts
          </label>

          <div className="p-4 rounded-2xl bg-[#FDFCFB] border border-[#E5E0D5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#FAF0D9] text-[#D99B38]">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#4A4A4A] block">Desktop Notifications</span>
                <span className="text-[11px] text-[#A09B8E]">
                  Show browser alerts when focus sessions or breaks complete
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRequestNotificationPermission}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                notificationsEnabled ? 'bg-[#D99B38]' : 'bg-[#E5E0D5]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save & Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-[#D99B38] text-white text-xs font-bold hover:bg-[#C58A2B] transition-colors shadow-sm"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};
