import { GlassCard } from "@/components/ui/glass-card";
import { Heart, Repeat, MoreHorizontal, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface PostCardProps {
  content: string;
  timestamp: string;
  likes: number;
  reposts: number;
  author: string;
  id?: string; // Added ID for linking
}

export function PostCard({ content, timestamp, likes, reposts, author, id = "1" }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  const CardContent = (
    <GlassCard className="mb-4 group cursor-pointer hover:border-primary/30 transition-colors">
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
          
          <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">24</span> {/* Mock comment count */}
          </div>

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

  // If we are on the details page, we might render it without the link wrapper
  // But for the feed, we want it clickable
  // Ideally, we pass a prop `isLink` but for now let's wrap it conditionally or just always wrap
  // since nested links are bad, we need to make sure buttons inside don't trigger navigation
  // Handled by stopPropagation on buttons
  
  return (
    <Link href={`/post/${id}`}>
      {CardContent}
    </Link>
  );
}
