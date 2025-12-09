import { GlassCard } from "@/components/ui/glass-card";
import { Heart, Repeat, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface PostCardProps {
  content: string;
  timestamp: string;
  likes: number;
  reposts: number;
  author: string;
}

export function PostCard({ content, timestamp, likes, reposts, author }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <GlassCard className="mb-4 group border-white/5 bg-black/20 hover:bg-black/40">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue p-[1px]">
             <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center text-xs font-bold text-white">
               {author.substring(0,2).toUpperCase()}
             </div>
          </div>
          <span className="text-sm font-medium text-muted-foreground">@{author}</span>
        </div>
        <span className="text-xs text-muted-foreground/60 font-mono">{timestamp}</span>
      </div>

      <p className="text-lg md:text-xl font-medium leading-relaxed text-foreground/90 font-display tracking-wide mb-6">
        {content}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <div className="flex gap-6">
          <button 
            onClick={handleLike}
            className="flex items-center gap-2 text-muted-foreground hover:text-neon-pink transition-colors group/like"
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={liked ? { scale: [1, 1.2, 1], color: "#FF3EF6" } : {}}
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            </motion.div>
            <span className="text-xs font-mono">{likeCount}</span>
          </button>
          
          <button className="flex items-center gap-2 text-muted-foreground hover:text-neon-green transition-colors">
            <Repeat className="w-5 h-5" />
            <span className="text-xs font-mono">{reposts}</span>
          </button>
        </div>
        
        <button className="text-muted-foreground hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </GlassCard>
  );
}
