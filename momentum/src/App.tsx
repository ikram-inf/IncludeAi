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
import { INITIAL_BUTTERFLIES, generateRewardButterfly } from './data/butterflies';
import { ButterflyVisual } from './components/ButterflyVisual';
import { FloatingButterfliesCanvas } from './components/FloatingButterfliesCanvas';
import { RightDock } from './components/RightDock';
import { PomodoroModal } from './components/PomodoroModal';
import { RewardModal } from './components/RewardModal';
import { AIChatModal } from './components/AIChatModal';
import { ToDoModal } from './components/ToDoModal';
import { GardenModal } from './components/GardenModal';
import { SettingsModal } from './components/SettingsModal';
import { ThoughtParkingLotModal } from './components/ThoughtParkingLotModal';
import { WatchAndLearnModal } from './components/WatchAndLearnModal';
import { startAmbientSound, stopAmbientSound, playCompletionChime } from './utils/audioSynth';

export default function App() {
  // Navigation & Modal state
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // Butterflies & Garden state
  const [butterflies, setButterflies] = useState<Butterfly[]>(INITIAL_BUTTERFLIES);
  const [rewardButterfly, setRewardButterfly] = useState<Butterfly | null>(null);

  // Focus Timer state
  const [goal, setGoal] = useState<string>('Deep Focus Session');
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

  const handleOrganizeDistractionIntoTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
    setActiveModal('todo');
  };

  const handleStartTimerForStep = (stepGoalTitle: string, stepDurationMinutes: number) => {
    setGoal(stepGoalTitle);
    setDurationMinutes(stepDurationMinutes);
    setTimeLeftSeconds(stepDurationMinutes * 60);
    setTimerMode('focus');
    setTimerStatus('running');
    setActiveModal('timer');
  };

  // Timer Countdown Effect - Fixed to prevent getting stuck at 00:00:00
  useEffect(() => {
    let interval: any = null;

    if (timerStatus === 'running' && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerStatus === 'running' && timeLeftSeconds <= 0) {
      // Session Complete!
      playCompletionChime(completionChime, chimeVolume);

      if (timerMode === 'focus') {
        // Earn Reward Butterfly
        const earned = generateRewardButterfly(goal, durationMinutes);
        setRewardButterfly(earned);
        setCompletedSessionsCount((c) => c + 1);

        if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(`New Butterfly Earned: ${earned.species}! 🦋`, {
            body: `Great job focusing on "${goal}"! You unlocked a ${earned.rarity} "${earned.species}" for your garden.`,
          });
        }

        // Determine break mode
        const nextBreakMode = (completedSessionsCount + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
        const nextBreakMins = nextBreakMode === 'longBreak' ? longBreakMinutes : shortBreakMinutes;

        setTimerMode(nextBreakMode);
        setTimeLeftSeconds(nextBreakMins * 60);

        if (autoStartBreak) {
          setTimerStatus('running');
        } else {
          setTimerStatus('idle');
        }
      } else {
        // Break completed, switch back to focus session
        if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('Break Time Ended! 🌿', {
            body: 'Ready to dive back into your next focus session?',
          });
        }
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
    shortBreakMinutes,
    longBreakMinutes,
    autoStartBreak,
    completedSessionsCount,
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

  // Sync Ambient Audio state
  useEffect(() => {
    if (ambientSound !== 'none') {
      startAmbientSound(ambientSound, ambientVolume);
    } else {
      stopAmbientSound();
    }
  }, [ambientSound, ambientVolume]);

  // Timer Control Handlers
  const handleStartTimer = () => setTimerStatus('running');
  const handlePauseTimer = () => setTimerStatus('paused');
  const handleResetTimer = () => {
    setTimerStatus('idle');
    if (timerMode === 'focus') setTimeLeftSeconds(durationMinutes * 60);
    else if (timerMode === 'shortBreak') setTimeLeftSeconds(shortBreakMinutes * 60);
    else if (timerMode === 'longBreak') setTimeLeftSeconds(longBreakMinutes * 60);
  };

  const handleClaimReward = () => {
    if (rewardButterfly) {
      setButterflies((prev) => [rewardButterfly, ...prev]);
      setRewardButterfly(null);
      setActiveModal('garden');
    }
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
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAF6EE] select-none font-sans text-[#4A4A4A]">
      
      {/* Background Soft Curved Concentric Ring Visual (Matching User Reference Image) */}
      <div className="absolute top-1/2 -right-32 sm:-right-16 -translate-y-1/2 w-[600px] h-[600px] sm:w-[750px] sm:h-[750px] rounded-full border-[30px] border-[#F2EDE2] pointer-events-none opacity-60 z-0" />
      <div className="absolute top-1/2 -right-48 sm:-right-28 -translate-y-1/2 w-[750px] h-[750px] sm:w-[900px] sm:h-[900px] rounded-full border-[18px] border-[#ECE6D8] pointer-events-none opacity-40 z-0" />

      {/* Freely Roaming Butterflies Background Canvas */}
      <FloatingButterfliesCanvas
        butterflies={butterflies}
        onSelectButterfly={() => setActiveModal('garden')}
      />

      {/* Top Left Sanctuary Progress Badge */}
      <div className="absolute top-8 left-10 z-20 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#E5E0D5] shadow-sm">
        <div className="w-7 h-7 flex items-center justify-center bg-[#D99B38] rounded-full text-white text-xs font-bold">
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

      {/* Central Resting View */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
        {/* Large Display Title */}
        <h1 className="text-7xl sm:text-8xl md:text-9xl font-serif font-light text-[#A29381] tracking-wide mb-8 opacity-90 select-none">
          Momentum
        </h1>

        {/* Central Search Bar with Video Icon Button */}
        <form
          onSubmit={handleCentralSubmit}
          className="pointer-events-auto flex items-center gap-3 bg-[#FDFCFB] backdrop-blur-md rounded-full px-6 py-3 shadow-lg shadow-[#A29381]/10 border border-[#E5E0D5] w-full max-w-md transition-all hover:shadow-xl hover:border-[#D99B38]"
        >
          <Sparkles className="w-5 h-5 text-[#D99B38]" />
          <input
            type="text"
            value={centralInput}
            onChange={(e) => setCentralInput(e.target.value)}
            placeholder="Ask Momentum AI or type a task..."
            className="flex-1 bg-transparent text-[#4A4A4A] placeholder-[#A09B8E] text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setActiveModal('watchAndLearn')}
            className="p-2 rounded-full text-[#A09B8E] hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Watch and Learn (YouTube Educational Channels)"
          >
            <Video className="w-5 h-5 stroke-[2]" />
          </button>
        </form>

        {/* Sanctuary Quick Badge */}
        <button
          onClick={() => setActiveModal('garden')}
          className="pointer-events-auto mt-6 px-4 py-2 rounded-full bg-[#FDFCFB] hover:bg-white text-[#4A4A4A] text-xs font-medium border border-[#E5E0D5] shadow-sm flex items-center gap-2 transition-all hover:scale-105"
        >
          <Flower2 className="w-4 h-4 text-[#D99B38]" />
          <span>{butterflies.length} Butterflies Flying in Meadow</span>
        </button>
      </div>

      {/* Bottom Left Active Goal Badge */}
      <div className="absolute bottom-8 left-10 z-20 p-4 bg-[#FDFCFB] border border-[#E5E0D5] rounded-2xl flex items-center gap-4 shadow-sm">
        <div className="w-2 h-9 bg-[#D99B38] rounded-full" />
        <div>
          <p className="text-[9px] uppercase tracking-wider text-[#A09B8E] font-bold">
            Active Focus Goal
          </p>
          <p className="text-xs font-semibold text-[#4A4A4A]">{goal}</p>
        </div>
        <div className="ml-2 px-2.5 py-1 bg-[#FAF0D9] text-[#D99B38] rounded-lg text-[10px] font-bold">
          {completedSessionsCount} Sessions
        </div>
      </div>

      {/* Modals */}
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
        onStartTimerForStep={handleStartTimerForStep}
      />

      <ThoughtParkingLotModal
        isOpen={activeModal === 'parkingLot'}
        onClose={() => setActiveModal(null)}
        thoughts={parkedThoughts}
        onAddThought={handleAddParkedThought}
        onToggleThought={handleToggleParkedThought}
        onDeleteThought={handleDeleteParkedThought}
        onOrganizeDistractionIntoTask={handleOrganizeDistractionIntoTask}
      />

      <AIChatModal
        isOpen={activeModal === 'chat'}
        onClose={() => setActiveModal(null)}
        initialPrompt={initialAIChatPrompt}
        onOpenWatchAndLearn={() => setActiveModal('watchAndLearn')}
      />

      <GardenModal
        isOpen={activeModal === 'garden'}
        onClose={() => setActiveModal(null)}
        butterflies={butterflies}
      />

      <WatchAndLearnModal
        isOpen={activeModal === 'watchAndLearn'}
        onClose={() => setActiveModal(null)}
        initialSearchQuery={centralInput}
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

      {/* Pop-Up Butterfly Reward Modal */}
      <RewardModal butterfly={rewardButterfly} onClaim={handleClaimReward} />

      {/* Right-Side Navigation Dock */}
      <RightDock
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        butterflyCount={butterflies.length}
        parkedThoughtsCount={parkedThoughts.filter((t) => !t.resolved).length}
      />
    </div>
  );
}
