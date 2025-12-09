import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { useState } from "react";

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollCardProps {
  question: string;
  options: PollOption[];
  totalVotes: number;
  timeLeft: string;
}

export function PollCard({ question, options: initialOptions, totalVotes: initialTotal, timeLeft }: PollCardProps) {
  const [voted, setVoted] = useState<string | null>(null);
  const [options, setOptions] = useState(initialOptions);
  const [totalVotes, setTotalVotes] = useState(initialTotal);

  const handleVote = (id: string) => {
    if (voted) return;
    setVoted(id);
    setTotalVotes(prev => prev + 1);
    setOptions(prev => prev.map(opt => 
      opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt
    ));
  };

  return (
    <GlassCard className="mb-4">
      <div className="relative z-10">
        <h3 className="text-lg md:text-xl font-bold font-display text-foreground mb-4 leading-tight">
          {question}
        </h3>

        <div className="space-y-3">
          {options.map((option) => {
            const percentage = Math.round((option.votes / totalVotes) * 100) || 0;
            const isSelected = voted === option.id;
            const isLeader = Math.max(...options.map(o => o.votes)) === option.votes && totalVotes > 0;

            return (
              <motion.button
                key={option.id}
                onClick={() => handleVote(option.id)}
                disabled={!!voted}
                className={cn(
                  "w-full relative h-12 rounded-lg overflow-hidden group text-left border transition-all duration-200",
                  voted && isSelected ? "border-primary" : "border-border bg-secondary/30 hover:bg-secondary/50"
                )}
                whileTap={!voted ? { scale: 0.99 } : {}}
              >
                
                {/* Progress Bar (Solid Brand Color) */}
                {voted && (
                  <motion.div
                    className={cn(
                      "absolute inset-y-0 left-0 opacity-10",
                      isSelected ? "bg-primary opacity-20" : "bg-muted-foreground opacity-10"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                  />
                )}
                
                {/* Leader indicator line */}
                {voted && isLeader && (
                   <motion.div 
                     className="absolute bottom-0 left-0 h-[2px] bg-primary z-20"
                     initial={{ width: 0 }}
                     animate={{ width: `${percentage}%` }}
                   />
                )}

                {/* Text Content */}
                <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                  <span className={cn(
                    "font-medium text-sm transition-colors",
                    isSelected ? 'text-primary font-semibold' : 'text-foreground'
                  )}>
                    {option.text}
                  </span>
                  {voted && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-mono text-xs font-bold text-muted-foreground"
                    >
                      {percentage}%
                    </motion.span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between items-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span>{totalVotes.toLocaleString()} votes</span>
          <span>{timeLeft} left</span>
        </div>
      </div>
    </GlassCard>
  );
}

// Helper to avoid circular dependency since I'm rewriting the whole file
import { cn } from "@/lib/utils";
