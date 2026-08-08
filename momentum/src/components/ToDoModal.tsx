import React, { useState } from 'react';
import { X, Plus, Check, Sparkles, Trash2, ChevronDown, ChevronUp, Loader2, Clock } from 'lucide-react';
import { Task, PriorityLevel, MicroStep } from '../types';

interface ToDoModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onSetFocusGoal: (goalTitle: string) => void;
  onStartTimerForStep?: (goalTitle: string, durationMinutes: number) => void;
}

export const ToDoModal: React.FC<ToDoModalProps> = ({
  isOpen,
  onClose,
  tasks,
  setTasks,
  onSetFocusGoal,
  onStartTimerForStep,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState<number>(1);
  const [loadingStepTaskId, setLoadingStepTaskId] = useState<string | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [newStepText, setNewStepText] = useState<{ [taskId: string]: string }>({});

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

    setTasks((prev) => [newTask, ...prev]);
    setNewTitle('');
    setEstimatedPomodoros(1);
  };

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleGenerateMicroSteps = async (task: Task, forceRegenerate = false) => {
    // If steps already exist and not forcing regenerate, toggle expansion
    if (!forceRegenerate && task.microSteps && task.microSteps.length > 0) {
      setExpandedTaskId(expandedTaskId === task.id ? null : task.id);
      return;
    }

    setLoadingStepTaskId(task.id);
    let stepsToSet: MicroStep[] = [];

    try {
      const res = await fetch('/api/microsteps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle: task.title }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.steps && Array.isArray(data.steps)) {
          stepsToSet = data.steps.map((item: any, idx: number) => ({
            id: `step-${Date.now()}-${idx}`,
            text: typeof item === 'string' ? item : (item.text || item.title || 'Focus micro-step'),
            completed: false,
            suggestedMinutes: typeof item === 'object' && item.suggestedMinutes ? item.suggestedMinutes : 10,
          }));
        }
      }
    } catch (e) {
      console.warn('Microsteps API call fallback engaged:', e);
    }

    // Fallback if API returned empty or failed
    if (stepsToSet.length === 0) {
      stepsToSet = [
        { id: `step-${Date.now()}-1`, text: `Outline goals & gather materials for "${task.title}"`, completed: false, suggestedMinutes: 10 },
        { id: `step-${Date.now()}-2`, text: `Deep focus sprint on core part of task`, completed: false, suggestedMinutes: 15 },
        { id: `step-${Date.now()}-3`, text: `Review output, refine details & finalize`, completed: false, suggestedMinutes: 10 },
      ];
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, microSteps: stepsToSet } : t))
    );
    setExpandedTaskId(task.id);
    setLoadingStepTaskId(null);
  };

  const handleAddCustomStep = (taskId: string) => {
    const text = newStepText[taskId]?.trim();
    if (!text) return;

    const newStep: MicroStep = {
      id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text,
      completed: false,
      suggestedMinutes: 10,
    };

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, microSteps: [...(t.microSteps || []), newStep] }
          : t
      )
    );

    setNewStepText((prev) => ({ ...prev, [taskId]: '' }));
    setExpandedTaskId(taskId);
  };

  const toggleMicroStep = (taskId: string, stepId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSteps = (t.microSteps || []).map((s) =>
          s.id === stepId ? { ...s, completed: !s.completed } : s
        );
        return { ...t, microSteps: updatedSteps };
      })
    );
  };

  const priorityWeights: Record<PriorityLevel, number> = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  // Sort tasks strictly in order of importance: High -> Medium -> Low
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Uncompleted tasks before completed tasks
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // High importance (weight 3) before Low importance (weight 1)
    const priorityDiff = priorityWeights[b.priority] - priorityWeights[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Secondary sort: newer tasks first
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/20 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl h-[88vh] max-h-[680px] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5E0D5] animate-in zoom-in-95 duration-200 flex flex-col justify-between overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E5E0D5]">
          <div>
            <span className="text-[11px] font-bold tracking-[0.3em] text-[#D99B38] uppercase block mb-1">
              FOCUS PLANNER
            </span>
            <h3 className="text-2xl font-normal text-[#4A4A4A]">To-Do Planner</h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#A09B8E] hover:text-[#4A4A4A] hover:bg-[#F5F2ED] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Task Creation Form */}
        <form onSubmit={handleAddTask} className="my-4 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add a new study goal or task..."
              className="flex-1 px-4 py-3 rounded-2xl border border-[#E5E0D5] bg-[#FDFCFB] text-sm text-[#4A4A4A] placeholder-[#A09B8E] focus:outline-none focus:ring-2 focus:ring-[#D99B38]/40 focus:border-[#D99B38] transition-all"
            />
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="px-5 py-3 rounded-2xl bg-[#D4A373] text-white text-xs font-semibold hover:bg-[#c29364] disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Priority & Session Estimation */}
          <div className="flex items-center justify-between text-xs text-[#A09B8E] px-1">
            <div className="flex items-center gap-2">
              <span>Priority:</span>
              {(['Low', 'Medium', 'High'] as PriorityLevel[]).map((p) => (
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
                        : 'bg-[#FAF0D9] text-[#D99B38] font-semibold'
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
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Focus Session' : 'Focus Sessions'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {/* Filter Tabs & Importance Sort Indicator */}
        <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-2 mb-3 text-xs font-medium">
          <div className="flex items-center gap-2">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-xl capitalize transition-colors ${
                  filter === f
                    ? 'bg-[#D99B38] text-white font-semibold'
                    : 'text-[#A09B8E] hover:text-[#4A4A4A]'
                }`}
              >
                {f} ({tasks.filter((t) => (f === 'active' ? !t.completed : f === 'completed' ? t.completed : true)).length})
              </button>
            ))}
          </div>

          <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF0D9] text-[#D99B38] text-[11px] font-semibold border border-[#E8CF96]">
            🔥 Sorted by Importance (High → Low)
          </span>
        </div>

        {/* Task List Container */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-12 text-[#A09B8E] text-sm">
              No tasks here yet. Add one above to kickstart your focus!
            </div>
          ) : (
            sortedTasks.map((task) => {
              const isExpanded = expandedTaskId === task.id;
              const isStepLoading = loadingStepTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    task.completed
                      ? 'bg-[#F5F2ED]/50 border-[#E5E0D5] opacity-60'
                      : 'bg-[#FDFCFB] border-[#E5E0D5] shadow-sm hover:border-[#D99B38]/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          task.completed
                            ? 'bg-[#D99B38] border-[#D99B38] text-white'
                            : 'border-[#E5E0D5] hover:border-[#D99B38] bg-white'
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
                            {task.estimatedPomodoros} {task.estimatedPomodoros === 1 ? 'Session' : 'Sessions'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                              task.priority === 'High'
                                ? 'bg-rose-100 text-rose-700'
                                : task.priority === 'Medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Task Actions */}
                    <div className="flex items-center gap-1">
                      {/* AI Micro-step generator */}
                      <button
                        onClick={() => handleGenerateMicroSteps(task)}
                        disabled={isStepLoading}
                        className="p-1.5 rounded-xl bg-[#FAF0D9] hover:bg-[#EED7A1] text-[#D99B38] text-xs font-medium flex items-center gap-1 transition-colors"
                        title="Break into step-by-step learning micro-steps"
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

                  {/* Micro Steps Accordion with Step-by-Step Learning Guidance & Auto Timer */}
                  {((task.microSteps && task.microSteps.length > 0) || isExpanded) && (
                    <div className="mt-3 pt-3 border-t border-[#E5E0D5]">
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-[#D99B38]"
                        >
                          <span>
                            Step-by-Step Guidance ({task.microSteps ? task.microSteps.filter((s) => s.completed).length : 0}/
                            {task.microSteps ? task.microSteps.length : 0})
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {isExpanded && (
                          <button
                            onClick={() => handleGenerateMicroSteps(task, true)}
                            disabled={isStepLoading}
                            className="text-[11px] font-medium text-[#A09B8E] hover:text-[#D99B38] flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Regenerate</span>
                          </button>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="space-y-2 pl-1">
                          {task.microSteps && task.microSteps.map((step) => {
                            const min = step.suggestedMinutes || 10;
                            return (
                              <div
                                key={step.id}
                                className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[#E5E0D5]/70 flex items-center justify-between gap-2"
                              >
                                <label className="flex items-center gap-2 text-xs text-[#4A4A4A] cursor-pointer flex-1 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={step.completed}
                                    onChange={() => toggleMicroStep(task.id, step.id)}
                                    className="rounded text-[#D99B38] focus:ring-[#D99B38] accent-[#D99B38]"
                                  />
                                  <span
                                    className={step.completed ? 'line-through text-[#A09B8E]' : 'font-medium'}
                                  >
                                    {step.text}
                                  </span>
                                </label>

                                <button
                                  onClick={() => {
                                    if (onStartTimerForStep) {
                                      onStartTimerForStep(step.text, min);
                                    } else {
                                      onSetFocusGoal(step.text);
                                    }
                                    onClose();
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-[#D99B38] text-white hover:bg-[#C58A2B] text-[11px] font-semibold flex items-center gap-1 transition-colors whitespace-nowrap shadow-sm"
                                  title={`Auto-generate ${min}-min timer for this step`}
                                >
                                  <Clock className="w-3 h-3" />
                                  <span>Timer ({min}m)</span>
                                </button>
                              </div>
                            );
                          })}

                          {/* Inline Add Custom Micro-step */}
                          <div className="flex items-center gap-1.5 pt-1">
                            <input
                              type="text"
                              value={newStepText[task.id] || ''}
                              onChange={(e) =>
                                setNewStepText((prev) => ({ ...prev, [task.id]: e.target.value }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddCustomStep(task.id);
                                }
                              }}
                              placeholder="Add custom micro-step..."
                              className="flex-1 px-3 py-1.5 rounded-xl border border-[#E5E0D5] bg-white text-xs text-[#4A4A4A] focus:outline-none focus:ring-1 focus:ring-[#D99B38]"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddCustomStep(task.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-[#E5E0D5] text-[#4A4A4A] text-xs font-semibold hover:bg-[#D4A373] hover:text-white transition-colors"
                            >
                              Add
                            </button>
                          </div>
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
