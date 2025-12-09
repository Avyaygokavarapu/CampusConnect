import { GlassCard } from "@/components/ui/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, Coins, X, Check } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";

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
  isPrediction?: boolean; 
}

export function PollCard({ question, options: initialOptions, totalVotes: initialTotal, timeLeft, author, isPrediction = false }: PollCardProps) {
  const { auracoins, spendCoins } = useUser();
  const [voted, setVoted] = useState<string | null>(null);
  const [options, setOptions] = useState(initialOptions);
  const [totalVotes, setTotalVotes] = useState(initialTotal);
  
  // Betting State
  const [showBetModal, setShowBetModal] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number>(10);

  const handleOptionClick = (id: string) => {
    if (voted) return;
    
    if (isPrediction) {
      setSelectedOptionId(id);
      setShowBetModal(true);
    } else {
      // Normal Poll Logic
      setVoted(id);
      setTotalVotes(prev => prev + 1);
      setOptions(prev => prev.map(opt => 
        opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt
      ));
    }
  };

  const confirmBet = () => {
    if (!selectedOptionId) return;

    if (spendCoins(betAmount)) {
      setVoted(selectedOptionId);
      setTotalVotes(prev => prev + 1); // In a real app, this would weight by bet amount
      setOptions(prev => prev.map(opt => 
        opt.id === selectedOptionId ? { ...opt, votes: opt.votes + 1 } : opt
      ));
      setShowBetModal(false);
      toast({
        title: "Bet Placed!",
        description: `You wagered ${betAmount} Auracoins on "${options.find(o => o.id === selectedOptionId)?.text}"`,
        variant: "default",
      });
    } else {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough Auracoins for this bet.",
        variant: "destructive",
      });
    }
  };

  // Helper to calculate odds based on inverse probability
  const getOdds = (votes: number, total: number) => {
      if (total === 0) return "2.0x";
      const probability = votes / total;
      if (probability < 0.01) return "99x"; 
      const odds = (1 / probability).toFixed(2);
      return `${odds}x`;
  };

  const potentialPayout = (Number(getOdds(options.find(o => o.id === selectedOptionId)?.votes || 0, totalVotes).replace('x','')) * betAmount).toFixed(0);

  return (
    <>
      <GlassCard className={cn("mb-4 relative", isPrediction && "border-l-4 border-l-primary")}>
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
                  onClick={() => handleOptionClick(option.id)}
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

      {/* Betting Modal */}
      <AnimatePresence>
        {showBetModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
              onClick={() => setShowBetModal(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full sm:max-w-md bg-card border-t sm:border border-border rounded-t-xl sm:rounded-xl p-6 pointer-events-auto relative z-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-bold text-lg">Place Your Bet</h3>
                <button onClick={() => setShowBetModal(false)} className="p-1 hover:bg-secondary rounded-full">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-6">
                 <div className="bg-secondary/30 p-4 rounded-lg border border-border/50">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Selected Outcome</span>
                    <p className="font-medium text-foreground mt-1">
                      {options.find(o => o.id === selectedOptionId)?.text}
                    </p>
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Wager Amount</label>
                      <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                        Balance: <Coins className="w-3 h-3 text-amber-500" /> {auracoins}
                      </span>
                    </div>
                    <div className="relative">
                      <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                      <input 
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg font-mono text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                        min={1}
                        max={auracoins}
                      />
                    </div>
                    <div className="flex gap-2">
                      {[10, 50, 100, "Max"].map((amt) => (
                        <button 
                          key={amt}
                          onClick={() => setBetAmount(amt === "Max" ? auracoins : Number(amt))}
                          className="flex-1 py-1 text-xs font-medium border border-border rounded hover:bg-secondary transition-colors"
                        >
                          {amt}
                        </button>
                      ))}
                    </div>
                 </div>

                 <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <span className="text-sm font-medium text-primary">Potential Payout</span>
                    <span className="font-mono font-bold text-lg text-primary flex items-center gap-1">
                      <Coins className="w-4 h-4" /> {potentialPayout}
                    </span>
                 </div>

                 <button 
                   onClick={confirmBet}
                   disabled={betAmount > auracoins || betAmount <= 0}
                   className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                 >
                   <span>Confirm Bet</span>
                   <Check className="w-4 h-4" />
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
