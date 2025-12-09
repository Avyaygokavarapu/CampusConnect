import { GlassCard } from "@/components/ui/glass-card";
import { Heart, Repeat, MoreHorizontal, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient"; // Import queryClient

interface PostCardProps {
  content: string;
  timestamp: string;
  likes: number;
  reposts: number;
  author: string;
  id?: string | number; // Added ID for linking
  isLiked?: boolean;
}

export function PostCard({ content, timestamp, likes, reposts, author, id = "1", isLiked = false }: PostCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);

  // Update state if props change (e.g. refetch)
  useEffect(() => {
    setLiked(isLiked);
    setLikeCount(likes);
  }, [isLiked, likes]);

  const likeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/posts/${id}/like`);
    },
    onMutate: async () => {
      // Snapshot the previous values
      const previousLiked = liked;
      const previousCount = likeCount;

      // Optimistic update
      const newLiked = !previousLiked;
      setLiked(newLiked);
      setLikeCount(newLiked ? previousCount + 1 : previousCount - 1);

      // Return context for rollback
      return { previousLiked, previousCount };
    },
    onSuccess: () => {
      // 1. Invalidate 'posts' list so the main feed updates
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      
      // 2. Invalidate specific post details if we are on that page
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${id}`] });
    },
    onError: (_err, _variables, context) => {
      // Revert if API fails
      if (context) {
        setLiked(context.previousLiked);
        setLikeCount(context.previousCount);
      }
    }
  });

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    likeMutation.mutate();
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

  return (
    <Link href={`/post/${id}`}>
      {CardContent}
    </Link>
  );
}
