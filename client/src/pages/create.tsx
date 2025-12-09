import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { X } from "lucide-react";

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
  
  // Color shift based on length
  const progressColor = progress > 90 ? "text-neon-pink" : progress > 50 ? "text-neon-purple" : "text-neon-blue";

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-lg"
        initial={{ scale: 0.9, opacity: 0, rotateX: 10 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        <GlassCard className="border-neon-pink/20 shadow-[0_0_50px_rgba(255,62,246,0.1)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-display font-bold text-white tracking-wide uppercase">Broadcast</h2>
            <button 
              onClick={() => setLocation("/")}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative mb-8">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What is happening in the void?"
                className="w-full bg-transparent text-2xl md:text-3xl font-display font-bold text-white placeholder:text-white/20 outline-none resize-none min-h-[150px] leading-tight"
                maxLength={maxLength}
                autoFocus
              />
            </div>

            <div className="flex justify-between items-center">
              {/* Circular Progress Indicator */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-white/5"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={125.6}
                    strokeDashoffset={125.6 - (progress / 100) * 125.6}
                    className={`transition-all duration-300 ${progressColor}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className={`absolute text-xs font-mono font-bold ${progressColor}`}>
                  {maxLength - text.length}
                </span>
              </div>

              <button
                type="submit"
                disabled={text.length === 0}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold tracking-wide shadow-[0_0_20px_rgba(255,62,246,0.4)] hover:shadow-[0_0_30px_rgba(255,62,246,0.6)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                TRANSMIT
              </button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
