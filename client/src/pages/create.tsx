import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { X, Send, BarChart2, FileText, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PostType = 'text' | 'poll';

interface PollOption {
  id: string;
  text: string;
}

export default function Create() {
  const [postType, setPostType] = useState<PostType>('text');
  const [text, setText] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' }
  ]);
  const [, setLocation] = useLocation();
  const maxLength = 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would post data based on postType
    setLocation("/");
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, { id: Date.now().toString(), text: '' }]);
    }
  };

  const removePollOption = (id: string) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter(opt => opt.id !== id));
    }
  };

  const updatePollOption = (id: string, text: string) => {
    setPollOptions(pollOptions.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const progress = (text.length / maxLength) * 100;
  
  // Color shift based on length - using brand colors now
  const isNearLimit = progress > 90;
  const progressColor = isNearLimit ? "text-destructive" : "text-primary";
  const ringColor = isNearLimit ? "text-destructive" : "text-primary";

  const isPollValid = pollQuestion.length > 0 && pollOptions.every(opt => opt.text.trim().length > 0);
  const isTextValid = text.length > 0;
  const isValid = postType === 'text' ? isTextValid : isPollValid;

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-lg"
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="bg-card border border-border shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-secondary/30 shrink-0">
            <h2 className="text-lg font-display font-bold text-foreground tracking-tight">Create Post</h2>
            <button 
              onClick={() => setLocation("/")}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pt-6 pb-2 shrink-0">
             <div className="flex p-1 bg-secondary rounded-lg mb-4">
               <button
                 onClick={() => setPostType('text')}
                 className={cn(
                   "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
                   postType === 'text' 
                     ? "bg-card text-primary shadow-sm" 
                     : "text-muted-foreground hover:text-foreground"
                 )}
               >
                 <FileText className="w-4 h-4" />
                 <span>Text</span>
               </button>
               <button
                 onClick={() => setPostType('poll')}
                 className={cn(
                   "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all",
                   postType === 'poll' 
                     ? "bg-card text-primary shadow-sm" 
                     : "text-muted-foreground hover:text-foreground"
                 )}
               >
                 <BarChart2 className="w-4 h-4" />
                 <span>Poll</span>
               </button>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 pb-6 flex flex-col overflow-hidden">
            <div className="overflow-y-auto pr-2 -mr-2 flex-1">
              <AnimatePresence mode="wait">
                {postType === 'text' ? (
                  <motion.div
                    key="text-input"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="relative mb-2"
                  >
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="What's on your mind?"
                      className="w-full bg-transparent text-xl font-sans text-foreground placeholder:text-muted-foreground/60 outline-none resize-none min-h-[150px] leading-relaxed selection:bg-primary/20"
                      maxLength={maxLength}
                      autoFocus
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="poll-input"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 pb-4"
                  >
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Question</label>
                      <input
                        value={pollQuestion}
                        onChange={(e) => setPollQuestion(e.target.value)}
                        placeholder="Ask the community..."
                        className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-lg font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                        maxLength={80}
                        autoFocus
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Options</label>
                      {pollOptions.map((option, index) => (
                        <div key={option.id} className="flex gap-2">
                          <input
                            value={option.text}
                            onChange={(e) => updatePollOption(option.id, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="flex-1 bg-card border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                            maxLength={40}
                          />
                          {pollOptions.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removePollOption(option.id)}
                              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      
                      {pollOptions.length < 4 && (
                        <button
                          type="button"
                          onClick={addPollOption}
                          className="w-full py-2 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Option</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border mt-auto shrink-0">
              {/* Character Counter (Only for text posts) */}
              <div className="flex items-center gap-3">
                 {postType === 'text' && (
                   <div className="relative w-8 h-8 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-muted"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={87.96}
                        strokeDashoffset={87.96 - (progress / 100) * 87.96}
                        className={`transition-all duration-300 ${ringColor}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className={cn("absolute text-[10px] font-mono font-bold", progressColor)}>
                      {maxLength - text.length}
                    </span>
                  </div>
                 )}
                 {postType === 'poll' && (
                    <span className="text-xs text-muted-foreground font-medium">
                        {pollOptions.length}/4 Options
                    </span>
                 )}
              </div>

              <button
                type="submit"
                disabled={!isValid}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 hover:shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
              >
                <span>{postType === 'text' ? 'Post' : 'Create Poll'}</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
