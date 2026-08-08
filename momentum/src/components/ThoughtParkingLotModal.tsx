import React, { useState } from 'react';
import { X, Plus, Check, Trash2, Bookmark, Sparkles, Loader2 } from 'lucide-react';
import { ParkedThought, Task } from '../types';

interface ThoughtParkingLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  thoughts: ParkedThought[];
  onAddThought: (text: string) => void;
  onToggleThought: (id: string) => void;
  onDeleteThought: (id: string) => void;
  onOrganizeDistractionIntoTask?: (task: Task) => void;
}

export const ThoughtParkingLotModal: React.FC<ThoughtParkingLotModalProps> = ({
  isOpen,
  onClose,
  thoughts,
  onAddThought,
  onToggleThought,
  onDeleteThought,
  onOrganizeDistractionIntoTask,
}) => {
  const [inputText, setInputText] = useState('');
  const [organizingThoughtId, setOrganizingThoughtId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const thoughtVal = inputText.trim();
    if (!thoughtVal) return;

    setIsSubmitting(true);
    const newThoughtId = Date.now().toString();
    onAddThought(thoughtVal);
    setInputText('');

    // Automatically organize distraction into To-Do list
    try {
      setOrganizingThoughtId(newThoughtId);
      const res = await fetch('/api/organize-distraction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thoughtText: thoughtVal }),
      });

      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.task && onOrganizeDistractionIntoTask) {
          const newTask: Task = {
            id: `task-ai-${Date.now()}`,
            title: data.task.title || `Focus Restart: Resume Study Session`,
            estimatedPomodoros: 1,
            completedPomodoros: 0,
            completed: false,
            priority: data.task.priority || 'High',
            microSteps: (data.task.microSteps || []).map((step: any, idx: number) => ({
              id: `step-ai-${Date.now()}-${idx}`,
              text: typeof step === 'string' ? step : step.text || 'Micro step',
              completed: false,
              suggestedMinutes: step.suggestedMinutes || 5,
            })),
            createdAt: new Date().toISOString(),
          };
          onOrganizeDistractionIntoTask(newTask);
          onToggleThought(newThoughtId);
        }
      } else {
        // Fallback
        if (onOrganizeDistractionIntoTask) {
          const fallbackTask: Task = {
            id: `task-fb-${Date.now()}`,
            title: `Focus Restart: Resume Study Session`,
            estimatedPomodoros: 1,
            completedPomodoros: 0,
            completed: false,
            priority: 'High',
            microSteps: [
              { id: `step-1`, text: `Take 1 deep breath & refocus desk`, completed: false, suggestedMinutes: 2 },
              { id: `step-2`, text: `Complete 1 micro-bullet for current study topic`, completed: false, suggestedMinutes: 5 },
            ],
            createdAt: new Date().toISOString(),
          };
          onOrganizeDistractionIntoTask(fallbackTask);
          onToggleThought(newThoughtId);
        }
      }
    } catch (e) {
      console.error('Error auto-organizing distraction:', e);
    } finally {
      setIsSubmitting(false);
      setOrganizingThoughtId(null);
    }
  };

  const handleOrganizeWithAI = async (thought: ParkedThought) => {
    setOrganizingThoughtId(thought.id);
    try {
      const res = await fetch('/api/organize-distraction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thoughtText: thought.text }),
      });

      const contentType = res.headers.get('content-type');
      if (!res.ok || !contentType || !contentType.includes('application/json')) {
        throw new Error(`Server status ${res.status}`);
      }

      const data = await res.json();
      if (data.task && onOrganizeDistractionIntoTask) {
        const newTask: Task = {
          id: `task-ai-${Date.now()}`,
          title: data.task.title || `Address distraction: ${thought.text}`,
          estimatedPomodoros: 1,
          completedPomodoros: 0,
          completed: false,
          priority: data.task.priority || 'Low',
          microSteps: (data.task.microSteps || []).map((step: any, idx: number) => ({
            id: `step-ai-${Date.now()}-${idx}`,
            text: typeof step === 'string' ? step : step.text || 'Micro step',
            completed: false,
            suggestedMinutes: step.suggestedMinutes || 5,
          })),
          createdAt: new Date().toISOString(),
        };

        onOrganizeDistractionIntoTask(newTask);
        onToggleThought(thought.id); // Mark thought as resolved/processed
      }
    } catch (e) {
      console.error('Failed to organize distraction:', e);
      // Fallback
      if (onOrganizeDistractionIntoTask) {
        const fallbackTask: Task = {
          id: `task-fb-${Date.now()}`,
          title: `Refocus: Process "${thought.text.slice(0, 25)}"`,
          estimatedPomodoros: 1,
          completedPomodoros: 0,
          completed: false,
          priority: 'Low',
          microSteps: [
            { id: `step-1`, text: `Jot quick note: ${thought.text}`, completed: false, suggestedMinutes: 3 },
            { id: `step-2`, text: `Deep breath & return to primary focus`, completed: false, suggestedMinutes: 5 },
          ],
          createdAt: new Date().toISOString(),
        };
        onOrganizeDistractionIntoTask(fallbackTask);
        onToggleThought(thought.id);
      }
    } finally {
      setOrganizingThoughtId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4A4A]/20 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5E0D5] animate-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF5E6] text-[#D4A373] flex items-center justify-center shadow-sm border border-[#F5E6D3]">
              <Bookmark className="w-5 h-5 fill-current stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-[#4A4A4A]">Thought Parking Lot</h3>
              <p className="text-xs text-[#A09B8E] mt-0.5">
                Park distracting thoughts here so you can refocus.
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

        {/* Input & Park Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-6">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. Check grocery list, message Alex..."
            className="flex-1 px-4 py-2.5 rounded-full border border-[#E5E0D5] bg-[#FDFCFB] text-sm text-[#4A4A4A] placeholder-[#C0BBAE] focus:outline-none focus:ring-2 focus:ring-[#D4A373]/40 focus:border-[#D4A373] transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSubmitting}
            className="px-4 py-2.5 rounded-full bg-[#E8B49B] text-white text-xs font-semibold hover:bg-[#d9a388] disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
            <span>{isSubmitting ? 'Organizing...' : 'Park & Organize'}</span>
          </button>
        </form>

        {/* Parked Thoughts List */}
        <div className="min-h-[140px] max-h-[240px] overflow-y-auto mb-6 px-1 space-y-2">
          {thoughts.length === 0 ? (
            <div className="h-[120px] flex items-center justify-center text-center">
              <p className="text-xs text-[#A09B8E] italic font-serif">
                Your mind is clear! No parked thoughts right now.
              </p>
            </div>
          ) : (
            thoughts.map((item) => {
              const isOrganizing = organizingThoughtId === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    item.resolved
                      ? 'bg-[#F5F2ED]/50 border-[#E5E0D5] opacity-60'
                      : 'bg-[#FDFCFB] border-[#E5E0D5] shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleThought(item.id)}
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                        item.resolved
                          ? 'bg-[#D99B38] border-[#D99B38] text-white'
                          : 'border-[#E5E0D5] hover:border-[#D99B38] bg-white'
                      }`}
                    >
                      {item.resolved && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                    <span
                      className={`text-xs text-[#4A4A4A] truncate ${
                        item.resolved ? 'line-through text-[#A09B8E]' : ''
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Auto-organize AI button */}
                    {!item.resolved && (
                      <button
                        onClick={() => handleOrganizeWithAI(item)}
                        disabled={isOrganizing}
                        className="px-2.5 py-1 rounded-xl bg-[#FDF5E6] hover:bg-[#F5E6D3] text-[#D4A373] text-[11px] font-semibold flex items-center gap-1 transition-colors border border-[#F5E6D3]"
                        title="Auto-organize into To-Do list with AI micro-steps"
                      >
                        {isOrganizing ? (
                          <Loader2 className="w-3 h-3 animate-spin text-[#D4A373]" />
                        ) : (
                          <Sparkles className="w-3 h-3 text-[#D4A373]" />
                        )}
                        <span>Auto-To-Do</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteThought(item.id)}
                      className="p-1 rounded-lg text-[#A09B8E] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      aria-label="Delete thought"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Tip */}
        <div className="pt-3 border-t border-[#E5E0D5] text-center">
          <p className="text-[11px] text-[#A09B8E] leading-relaxed italic">
            Tip: Click "Auto-To-Do" to turn a distracting thought into a structured micro-task!
          </p>
        </div>
      </div>
    </div>
  );
};
