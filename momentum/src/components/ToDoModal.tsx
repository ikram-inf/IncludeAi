import React, { useState } from 'react';
import { X, Plus, Check, Sparkles, Play, Trash2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Task, PriorityLevel } from '../types';

interface ToDoModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onSetFocusGoal: (goalTitle: string) => void;
}

export const ToDoModal: React.FC<ToDoModalProps> = ({
  isOpen,
  onClose,
  tasks,
  setTasks,
  onSetFocusGoal,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState<number>(1);
  const [loadingStepTaskId, setLoadingStepTaskId] = useState<string | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  if (!isOpen) return null;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      estimatedPomodoros,
      completedPomodoros: 0,
      completed: false,
      priority,
      microSteps: [],
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTitle('');
    setEstimatedPomodoros(1);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleGenerateMicroSteps = async (task: Task) => {
    setLoadingStepTaskId(task.id);
    try {
      const res = await fetch('/api/microsteps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle: task.title }),
      });
      const data = await res.json();
      if (data.steps && Array.isArray(data.steps)) {
        const generatedSteps = data.steps.map((text: string, idx: number) => ({
          id: `step-${Date.now()}-${idx}`,
          text,
          completed: false,
        }));

        setTasks(prev =>
          prev.map(t =>
            t.id === task.id ? { ...t, microSteps: generatedSteps } : t
          )
        );
        setExpandedTaskId(task.id);
      }
    } catch (e) {
      console.error('Failed to generate micro-steps:', e);
    } finally {
      setLoadingStepTaskId(null);
    }
  };

  const toggleMicroStep = (taskId: string, stepId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== taskId) return t;
        const updatedSteps = t.microSteps.map(s =>
          s.id === stepId ? { ...s, completed: !s.completed } : s
        );
        return { ...t, microSteps: updatedSteps };
      })
    );
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/20 backdrop-blur-[2px]">
      <div className="relative w-full max-w-xl h-[85vh] max-h-[640px] bg-white rounded-3xl p-6 shadow-2xl border border-[#E5E0D5] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D5]">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#8BA888] uppercase">
              FOCUS MOMENTUM PLANNER
            </span>
            <h3 className="text-2xl font-normal text-[#4A4A4A]">To-Do List</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full text-[#A09B8E] hover:text-[#4A4A4A] hover:bg-[#F5F2ED] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Add Task Input */}
        <form onSubmit={handleAddTask} className="mt-4 mb-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What task would you like to achieve?"
              className="flex-1 px-4 py-2.5 rounded-2xl border border-[#E5E0D5] bg-[#FDFCFB] text-sm text-[#4A4A4A] placeholder-[#A09B8E] focus:outline-none focus:ring-2 focus:ring-[#8BA888]"
            />
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="px-5 py-2.5 rounded-2xl bg-[#8BA888] text-white font-medium text-sm hover:bg-[#7A9677] disabled:bg-stone-300 transition-colors flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add</span>
            </button>
          </div>

          {/* Priority & Pomodoro Estimation */}
          <div className="flex items-center justify-between text-xs text-[#A09B8E] px-1">
            <div className="flex items-center gap-2">
              <span>Priority:</span>
              {(['Low', 'Medium', 'High'] as PriorityLevel[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-2.5 py-1 rounded-xl transition-colors ${
                    priority === p
                      ? p === 'High'
                        ? 'bg-rose-100 text-rose-800 font-semibold'
                        : p === 'Medium'
                        ? 'bg-amber-100 text-amber-800 font-semibold'
                        : 'bg-[#F5F2ED] text-[#8BA888] font-semibold'
                      : 'bg-[#F5F2ED] text-[#A09B8E] hover:bg-[#E5E0D5]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span>Sessions:</span>
              <select
                value={estimatedPomodoros}
                onChange={(e) => setEstimatedPomodoros(Number(e.target.value))}
                className="bg-[#FDFCFB] border border-[#E5E0D5] rounded-lg px-2 py-0.5 text-xs text-[#4A4A4A]"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>
                    {num} 🍅
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E5E0D5] pb-2 mb-3 text-xs font-medium">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-xl capitalize transition-colors ${
                filter === f
                  ? 'bg-[#8BA888] text-white font-semibold'
                  : 'text-[#A09B8E] hover:text-[#4A4A4A]'
              }`}
            >
              {f} ({tasks.filter(t => (f === 'active' ? !t.completed : f === 'completed' ? t.completed : true)).length})
            </button>
          ))}
        </div>

        {/* Task List Container */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-[#A09B8E] text-sm">
              No tasks here yet. Add one above to kickstart your focus!
            </div>
          ) : (
            filteredTasks.map(task => {
              const isExpanded = expandedTaskId === task.id;
              const isStepLoading = loadingStepTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    task.completed
                      ? 'bg-[#F5F2ED]/50 border-[#E5E0D5] opacity-60'
                      : 'bg-[#FDFCFB] border-[#E5E0D5] shadow-sm hover:border-[#8BA888]/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Custom Checkbox */}
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          task.completed
                            ? 'bg-[#8BA888] border-[#8BA888] text-white'
                            : 'border-[#E5E0D5] hover:border-[#8BA888] bg-white'
                        }`}
                        aria-label="Toggle task completion"
                      >
                        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="flex-1">
                        <span
                          className={`text-sm font-medium ${
                            task.completed ? 'line-through text-[#A09B8E]' : 'text-[#4A4A4A]'
                          }`}
                        >
                          {task.title}
                        </span>

                        <div className="flex items-center gap-2 mt-1 text-xs text-[#A09B8E]">
                          <span className="px-2 py-0.5 rounded-md bg-[#F5F2ED] text-[#4A4A4A] font-medium">
                            {task.estimatedPomodoros} 🍅
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                              task.priority === 'High'
                                ? 'bg-rose-100 text-rose-700'
                                : task.priority === 'Medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Task Actions */}
                    <div className="flex items-center gap-1">
                      {/* Set active goal */}
                      <button
                        onClick={() => {
                          onSetFocusGoal(task.title);
                          onClose();
                        }}
                        className="p-1.5 rounded-xl bg-[#F5F2ED] hover:bg-[#E5E0D5] text-[#8BA888] text-xs font-medium flex items-center gap-1 transition-colors"
                        title="Focus on this now"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">Focus</span>
                      </button>

                      {/* AI Micro-step generator */}
                      <button
                        onClick={() => handleGenerateMicroSteps(task)}
                        disabled={isStepLoading}
                        className="p-1.5 rounded-xl bg-[#F5F2ED] hover:bg-[#E5E0D5] text-[#8BA888] text-xs font-medium flex items-center gap-1 transition-colors"
                        title="Break into micro-steps"
                      >
                        {isStepLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        <span className="hidden sm:inline">Micro-steps</span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded-xl text-[#A09B8E] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Micro Steps Accordion */}
                  {task.microSteps && task.microSteps.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#E5E0D5]">
                      <button
                        onClick={() =>
                          setExpandedTaskId(isExpanded ? null : task.id)
                        }
                        className="flex items-center gap-1 text-xs font-semibold text-[#8BA888] mb-2"
                      >
                        <span>
                          Micro Steps ({task.microSteps.filter(s => s.completed).length}/
                          {task.microSteps.length})
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="space-y-1.5 pl-2">
                          {task.microSteps.map(step => (
                            <label
                              key={step.id}
                              className="flex items-center gap-2 text-xs text-[#4A4A4A] cursor-pointer hover:text-stone-900"
                            >
                              <input
                                type="checkbox"
                                checked={step.completed}
                                onChange={() => toggleMicroStep(task.id, step.id)}
                                className="rounded text-[#8BA888] focus:ring-[#8BA888] accent-[#8BA888]"
                              />
                              <span
                                className={step.completed ? 'line-through text-[#A09B8E]' : ''}
                              >
                                {step.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
