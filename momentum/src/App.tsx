import React, { useState, useEffect } from 'react';
import { Sparkles, Video, Flower2 } from 'lucide-react';
import {
  ActiveModal,
  TimerMode,
  TimerStatus,
  Butterfly,
  Task,
  AmbientSound,
  CompletionChime,
  ParkedThought,
} from './types';
import { generateRewardButterfly } from './data/butterflies';
import { ButterflyVisual } from './components/ButterflyVisual';
import { RightDock } from './components/RightDock';
import { PomodoroModal } from './components/PomodoroModal';
import { RewardModal } from './components/RewardModal';
import { AIChatModal } from './components/AIChatModal';
import { ToDoModal } from './components/ToDoModal';
import { GardenModal } from './components/GardenModal';
import { SettingsModal } from './components/SettingsModal';
import { ThoughtParkingLotModal } from './components/ThoughtParkingLotModal';
import { startAmbientSound, stopAmbientSound, updateAmbientSoundVolume, playCompletionChime } from './utils/audioSynth';

export default function App() {
  // Navigation & Modal state
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // Butterflies & Garden state
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);
  const [rewardButterfly, setRewardButterfly] = useState<Butterfly | null>(null);

  // Focus Timer state
  const [goal, setGoal] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState<number>(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState<number>(15);
  const [timerMode, setTimerMode] = useState<TimerMode>('focus');
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('idle');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(25 * 60);
  const [autoStartBreak, setAutoStartBreak] = useState<boolean>(true);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(0);

  // Thought Parking Lot state
  const [parkedThoughts, setParkedThoughts] = useState<ParkedThought[]>([]);

  // AI Chat & Tasks state
  const [initialAIChatPrompt, setInitialAIChatPrompt] = useState<string>('');
  const [centralInput, setCentralInput] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);

  // Audio & Notification Settings
  const [ambientSound, setAmbientSound] = useState<AmbientSound>('none');
  const [ambientVolume, setAmbientVolume] = useState<number>(0.3);
  const [completionChime, setCompletionChime] = useState<CompletionChime>('softGong');
  const [chimeVolume, setChimeVolume] = useState<number>(0.6);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  // Handlers for Parked Thoughts
  const handleAddParkedThought = (text: string) => {
    setParkedThoughts((prev) => [
      { id: Date.now().toString(), text, createdAt: new Date().toISOString(), resolved: false },
      ...prev,
    ]);
  };

  const handleToggleParkedThought = (id: string) => {
    setParkedThoughts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, resolved: !t.resolved } : t))
    );
  };

  const handleDeleteParkedThought = (id: string) => {
    setParkedThoughts((prev) => prev.filter((t) => t.id !== id));
  };

  // Timer Countdown Effect
  useEffect(() => {
    let interval: any = null;

    if (timerStatus === 'running' && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerStatus === 'running' && timeLeftSeconds === 0) {
      // Session Complete!
      setTimerStatus('completed');

      // Play Chime
      playCompletionChime(completionChime, chimeVolume);

      // Desktop Notification if enabled
      if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(
          timerMode === 'focus' ? 'Focus Session Complete! 🦋' : 'Break Time Ended! 🌿',
          {
            body:
              timerMode === 'focus'
                ? `Great job focusing on "${goal}"! Unlocked a new specimen for your garden.`
                : 'Ready to dive back into your next focus session?',
          }
        );
      }

      if (timerMode === 'focus') {
        // Earn Reward Butterfly
        const earned = generateRewardButterfly(goal, durationMinutes);
        setRewardButterfly(earned);
        setCompletedSessionsCount((c) => c + 1);
      } else {
        // Break completed, switch back to focus
        setTimerMode('focus');
        setTimeLeftSeconds(durationMinutes * 60);
        setTimerStatus('idle');
      }
    }

    return () => clearInterval(interval);
  }, [
    timerStatus,
    timeLeftSeconds,
    timerMode,
    goal,
    durationMinutes,
    completionChime,
    chimeVolume,
    notificationsEnabled,
  ]);

  // Sync time left when duration or mode changes while idle
  useEffect(() => {
    if (timerStatus === 'idle') {
      if (timerMode === 'focus') setTimeLeftSeconds(durationMinutes * 60);
      else if (timerMode === 'shortBreak') setTimeLeftSeconds(shortBreakMinutes * 60);
      else if (timerMode === 'longBreak') setTimeLeftSeconds(longBreakMinutes * 60);
    }
  }, [durationMinutes, shortBreakMinutes, longBreakMinutes, timerMode, timerStatus]);

  // Sync ambient sound generator
  useEffect(() => {
    if (ambientSound !== 'none') {
      startAmbientSound(ambientSound, ambientVolume);
    } else {
      stopAmbientSound();
    }
    return () => {
      stopAmbientSound();
    };
  }, [ambientSound]);

  // Update ambient volume live without restarting the soundscape
  useEffect(() => {
    if (ambientSound !== 'none') {
      updateAmbientSoundVolume(ambientVolume);
    }
  }, [ambientSound, ambientVolume]);

  // Handle claiming reward butterfly
  const handleClaimReward = () => {
    if (rewardButterfly) {
      setButterflies((prev) => [rewardButterfly, ...prev]);
      setRewardButterfly(null);

      // Auto start break if enabled
      if (autoStartBreak) {
        const nextBreakMode = completedSessionsCount % 4 === 0 ? 'longBreak' : 'shortBreak';
        const breakMins = nextBreakMode === 'longBreak' ? longBreakMinutes : shortBreakMinutes;
        setTimerMode(nextBreakMode);
        setTimeLeftSeconds(breakMins * 60);
        setTimerStatus('running');
      } else {
        setTimerMode('focus');
        setTimeLeftSeconds(durationMinutes * 60);
        setTimerStatus('idle');
      }
    }
  };

  // Timer controls
  const handleStartTimer = () => setTimerStatus('running');
  const handlePauseTimer = () => setTimerStatus('paused');
  const handleResetTimer = () => {
    setTimerStatus('idle');
    if (timerMode === 'focus') setTimeLeftSeconds(durationMinutes * 60);
    else if (timerMode === 'shortBreak') setTimeLeftSeconds(shortBreakMinutes * 60);
    else if (timerMode === 'longBreak') setTimeLeftSeconds(longBreakMinutes * 60);
  };

  const handleModeChange = (mode: TimerMode) => {
    setTimerMode(mode);
    setTimerStatus('idle');
    if (mode === 'focus') setTimeLeftSeconds(durationMinutes * 60);
    else if (mode === 'shortBreak') setTimeLeftSeconds(shortBreakMinutes * 60);
    else if (mode === 'longBreak') setTimeLeftSeconds(longBreakMinutes * 60);
  };

  // Open AI Chat with a specific prompt goal
  const handleOpenAIChatForGoal = (taskGoal: string) => {
    setInitialAIChatPrompt(taskGoal);
    setActiveModal('chat');
  };

  // Handle central search submit
  const handleCentralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (centralInput.trim()) {
      handleOpenAIChatForGoal(centralInput.trim());
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F5F2ED] select-none font-sans text-[#4A4A4A]">
      {/* Background Soft Garden Glow Spots */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-40 w-32 h-32 bg-[#8BA888] rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-60 w-48 h-48 bg-[#D4A373] rounded-full blur-3xl" />
      </div>

      {/* Top Left Daily Progress Badge */}
      <div className="absolute top-8 left-10 z-20 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#E5E0D5] shadow-sm">
        <div className="w-7 h-7 flex items-center justify-center bg-[#8BA888] rounded-full text-white text-xs font-bold">
          🦋
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-widest text-[#A09B8E] font-bold">
            Sanctuary Progress
          </span>
          <span className="text-sm font-semibold text-[#4A4A4A] tracking-tight">
            {butterflies.length} Butterflies Earned
          </span>
        </div>
      </div>

      {/* Main Sanctuary Flying Butterflies Background Canvas */}
      <div className="absolute inset-0 pointer-events-auto overflow-hidden">
        {butterflies.map((bf) => (
          <div
            key={bf.id}
            onClick={() => setActiveModal('garden')}
            className="absolute cursor-pointer transition-transform duration-1000 hover:scale-125 z-0"
            style={{
              left: `${bf.x}%`,
              top: `${bf.y}%`,
            }}
            title={`Click to view ${bf.species} in garden`}
          >
            <ButterflyVisual
              primaryColor={bf.primaryColor}
              secondaryColor={bf.secondaryColor}
              size={bf.size || 52}
              wingPattern={bf.wingPattern}
              isFlapping={true}
            />
          </div>
        ))}
      </div>

      {/* Central Background Resting View */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
        {/* Large Display Title */}
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-light text-[#8BA888] tracking-wider mb-8 opacity-90 select-none">
          Momentum
        </h1>

        {/* Central Search / AI Prompt Capsule Bar */}
        <form
          onSubmit={handleCentralSubmit}
          className="pointer-events-auto flex items-center gap-3 bg-[#FDFCFB] backdrop-blur-md rounded-full px-6 py-3.5 shadow-xl shadow-[#8BA888]/10 border border-[#E5E0D5] w-full max-w-md transition-all hover:shadow-2xl hover:border-[#8BA888]"
        >
          <Sparkles className="w-5 h-5 text-[#8BA888]" />
          <input
            type="text"
            value={centralInput}
            onChange={(e) => setCentralInput(e.target.value)}
            placeholder="Ask Momentum AI or type a task..."
            className="flex-1 bg-transparent text-[#4A4A4A] placeholder-[#A09B8E] text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="p-1.5 rounded-full text-[#A09B8E] hover:text-[#4A4A4A] hover:bg-[#F5F2ED] transition-colors"
            title="Ask AI"
          >
            <Video className="w-5 h-5 stroke-[1.8]" />
          </button>
        </form>

        {/* Sanctuary Quick Badge */}
        <button
          onClick={() => setActiveModal('garden')}
          className="pointer-events-auto mt-6 px-4 py-2 rounded-full bg-[#FDFCFB] hover:bg-white text-[#4A4A4A] text-xs font-medium border border-[#E5E0D5] shadow-sm flex items-center gap-2 transition-all hover:scale-105"
        >
          <Flower2 className="w-4 h-4 text-[#8BA888]" />
          <span>{butterflies.length} Butterflies Flying in Garden</span>
        </button>
      </div>

      {/* Bottom Left Active Goal Badge */}
      <div className="absolute bottom-8 left-10 z-20 p-4 bg-[#FDFCFB] border border-[#E5E0D5] rounded-2xl flex items-center gap-4 shadow-sm">
        <div className="w-2 h-9 bg-[#8BA888] rounded-full" />
        <div>
          <p className="text-[9px] uppercase tracking-wider text-[#A09B8E] font-bold">
            Active Focus Goal
          </p>
          <p className="text-xs font-semibold text-[#4A4A4A]">{goal.trim() || 'No active focus goal yet'}</p>
        </div>
        <div className="ml-2 px-2.5 py-1 bg-[#F5F2ED] text-[#8BA888] rounded-lg text-[10px] font-bold">
          {completedSessionsCount} POMOS
        </div>
      </div>

      {/* Floating Modals */}
      <PomodoroModal
        isOpen={activeModal === 'timer'}
        onClose={() => setActiveModal(null)}
        goal={goal}
        setGoal={setGoal}
        durationMinutes={durationMinutes}
        setDurationMinutes={setDurationMinutes}
        shortBreakMinutes={shortBreakMinutes}
        setShortBreakMinutes={setShortBreakMinutes}
        longBreakMinutes={longBreakMinutes}
        setLongBreakMinutes={setLongBreakMinutes}
        timeLeftSeconds={timeLeftSeconds}
        timerStatus={timerStatus}
        timerMode={timerMode}
        autoStartBreak={autoStartBreak}
        setAutoStartBreak={setAutoStartBreak}
        onStart={handleStartTimer}
        onPause={handlePauseTimer}
        onReset={handleResetTimer}
        onModeChange={handleModeChange}
        onOpenAIChatForGoal={handleOpenAIChatForGoal}
      />

      <ToDoModal
        isOpen={activeModal === 'todo'}
        onClose={() => setActiveModal(null)}
        tasks={tasks}
        setTasks={setTasks}
        onSetFocusGoal={(goalTitle) => {
          setGoal(goalTitle);
          setActiveModal('timer');
        }}
      />

      <ThoughtParkingLotModal
        isOpen={activeModal === 'parkingLot'}
        onClose={() => setActiveModal(null)}
        thoughts={parkedThoughts}
        onAddThought={handleAddParkedThought}
        onToggleThought={handleToggleParkedThought}
        onDeleteThought={handleDeleteParkedThought}
      />

      <AIChatModal
        isOpen={activeModal === 'chat'}
        onClose={() => setActiveModal(null)}
        initialPrompt={initialAIChatPrompt}
      />

      <GardenModal
        isOpen={activeModal === 'garden'}
        onClose={() => setActiveModal(null)}
        butterflies={butterflies}
      />

      <SettingsModal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal(null)}
        durationMinutes={durationMinutes}
        setDurationMinutes={setDurationMinutes}
        shortBreakMinutes={shortBreakMinutes}
        setShortBreakMinutes={setShortBreakMinutes}
        longBreakMinutes={longBreakMinutes}
        setLongBreakMinutes={setLongBreakMinutes}
        autoStartBreak={autoStartBreak}
        setAutoStartBreak={setAutoStartBreak}
        completionChime={completionChime}
        setCompletionChime={setCompletionChime}
        ambientSound={ambientSound}
        setAmbientSound={setAmbientSound}
        ambientVolume={ambientVolume}
        setAmbientVolume={setAmbientVolume}
        chimeVolume={chimeVolume}
        setChimeVolume={setChimeVolume}
        notificationsEnabled={notificationsEnabled}
        setNotificationsEnabled={setNotificationsEnabled}
      />

      {/* Pop-Up Butterfly Reward Modal when session finishes */}
      <RewardModal butterfly={rewardButterfly} onClaim={handleClaimReward} />

      {/* Right-Side Circular Navigation Dock */}
      <RightDock
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        butterflyCount={butterflies.length}
        parkedThoughtsCount={parkedThoughts.filter((t) => !t.resolved).length}
      />
    </div>
  );
}
