import { GlassCard } from "@/components/ui/glass-card";
import { Heart, Repeat, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
    <GlassCard className="mb-4 group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground border border-border">
             {author.substring(0,2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground leading-none">@{author}</span>
            <span className="text-xs text-muted-foreground">{timestamp}</span>
          </div>
        </div>
      </div>

      <p className="text-base md:text-lg font-normal leading-relaxed text-foreground mb-4 font-sans">
        {content}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex gap-6">
          <button 
            onClick={handleLike}
            className={cn(
              "flex items-center gap-2 transition-colors group/like text-sm",
              liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              animate={liked ? { scale: [1, 1.2, 1] } : {}}
            >
              <Heart className={cn("w-4 h-4", liked && "fill-current")} />
            </motion.div>
            <span className="font-medium">{likeCount}</span>
          </button>
          
          <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <Repeat className="w-4 h-4" />
            <span className="font-medium">{reposts}</span>
          </button>
        </div>
        
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </GlassCard>
  );
}
