import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

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
  author: string;
  isPrediction?: boolean; // New prop for prediction mode
}

export function PollCard({ question, options: initialOptions, totalVotes: initialTotal, timeLeft, author, isPrediction = false }: PollCardProps) {
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

  // Helper to calculate odds based on inverse probability
  // If no votes, default to 2.0x (50/50).
  const getOdds = (votes: number, total: number) => {
      if (total === 0) return "2.0x";
      const probability = votes / total;
      // Avoid division by zero or infinity, cap at reasonable max
      if (probability < 0.01) return "99x"; 
      const odds = (1 / probability).toFixed(2);
      return `${odds}x`;
  };

  return (
    <GlassCard className={cn("mb-4", isPrediction && "border-l-4 border-l-primary")}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground border border-border">
             {author.substring(0,2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground leading-none">@{author}</span>
                {isPrediction && (
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                        <TrendingUp className="w-3 h-3" /> Bet
                    </span>
                )}
            </div>
            <span className="text-xs text-muted-foreground">Ends in {timeLeft}</span>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-lg md:text-xl font-bold font-display text-foreground mb-4 leading-tight">
          {question}
        </h3>

        <div className="space-y-3">
          {options.map((option) => {
            const percentage = Math.round((option.votes / totalVotes) * 100) || 0;
            const isSelected = voted === option.id;
            const isLeader = Math.max(...options.map(o => o.votes)) === option.votes && totalVotes > 0;
            const odds = getOdds(option.votes, totalVotes);

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
                  
                  {/* Result Display: Percentage OR Odds */}
                  {voted ? (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-mono text-xs font-bold text-muted-foreground"
                    >
                      {percentage}%
                    </motion.span>
                  ) : isPrediction ? (
                      <span className="font-mono text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded">
                          Odds: {odds}
                      </span>
                  ) : null}
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between items-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span>{totalVotes.toLocaleString()} {isPrediction ? "bets" : "votes"}</span>
        </div>
      </div>
    </GlassCard>
  );
}
