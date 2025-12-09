import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Create() {
  const [text, setText] = useState("");
  const [, setLocation] = useLocation();
  const maxLength = 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would post data
    setLocation("/");
  };

  const progress = (text.length / maxLength) * 100;
  
  // Color shift based on length - using brand colors now
  const isNearLimit = progress > 90;
  const progressColor = isNearLimit ? "text-destructive" : "text-primary";
  const ringColor = isNearLimit ? "text-destructive" : "text-primary";

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-lg"
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="bg-card border border-border shadow-2xl rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-secondary/30">
            <h2 className="text-lg font-display font-bold text-foreground tracking-tight">Create Post</h2>
            <button 
              onClick={() => setLocation("/")}
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="relative mb-6">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-transparent text-xl font-sans text-foreground placeholder:text-muted-foreground/60 outline-none resize-none min-h-[120px] leading-relaxed selection:bg-primary/20"
                maxLength={maxLength}
                autoFocus
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              {/* Character Counter */}
              <div className="flex items-center gap-3">
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
              </div>

              <button
                type="submit"
                disabled={text.length === 0}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:bg-primary/90 hover:shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
              >
                <span>Post</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
