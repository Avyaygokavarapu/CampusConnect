import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { useState } from "react";
import auroraImage from "@assets/generated_images/holographic_aurora_gradient.png";

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
    <GlassCard className="mb-4 border-neon-purple/30 bg-black/40 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-neon-purple/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <h3 className="text-xl md:text-2xl font-bold font-display text-white mb-6 leading-tight">
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
                className="w-full relative h-12 rounded-lg overflow-hidden group text-left"
                whileHover={!voted ? { scale: 1.02 } : {}}
                whileTap={!voted ? { scale: 0.98 } : {}}
              >
                {/* Background Bar */}
                <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-lg" />
                
                {/* Progress Bar (Liquid with Aurora Image) */}
                {voted && (
                  <motion.div
                    className="absolute inset-y-0 left-0 overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "circOut" }}
                  >
                     <div 
                        className="absolute inset-0 w-full h-full opacity-80"
                        style={{ 
                            backgroundImage: `url(${auroraImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'brightness(1.2) contrast(1.2)'
                        }} 
                     />
                     {/* Liquid Shimmer Effect Overlay */}
                     <div className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-gradient-x" style={{ backgroundSize: '200% 100%' }} />
                  </motion.div>
                )}

                {/* Text Content */}
                <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                  <span className={`font-medium transition-colors ${isSelected ? 'text-white' : 'text-foreground/80'}`}>
                    {option.text}
                  </span>
                  {voted && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-mono text-sm font-bold text-white drop-shadow-md"
                    >
                      {percentage}%
                    </motion.span>
                  )}
                </div>
                
                {/* Glow for leader */}
                {voted && isLeader && (
                   <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(76,207,255,0.3)] rounded-lg pointer-events-none" />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-between items-center text-xs font-mono text-muted-foreground/60 uppercase tracking-widest">
          <span>{totalVotes.toLocaleString()} votes</span>
          <span>{timeLeft} left</span>
        </div>
      </div>
    </GlassCard>
  );
}
