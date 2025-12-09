import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MessageSquare, ArrowBigUp, ArrowBigDown, MoreHorizontal, CornerDownRight } from "lucide-react";

export interface CommentType {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  votes: number;
  replies?: CommentType[];
  level?: number;
}

interface CommentProps {
  comment: CommentType;
  isLast?: boolean;
}

export function Comment({ comment, isLast }: CommentProps) {
  const [votes, setVotes] = useState(comment.votes);
  const [voteState, setVoteState] = useState<'up' | 'down' | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleVote = (type: 'up' | 'down') => {
    if (voteState === type) {
      setVoteState(null);
      setVotes(type === 'up' ? votes - 1 : votes + 1);
    } else {
      if (voteState === 'up') setVotes(votes - 2);
      if (voteState === 'down') setVotes(votes + 2);
      if (!voteState) setVotes(type === 'up' ? votes + 1 : votes - 1);
      setVoteState(type);
    }
  };

  const level = comment.level || 0;
  // Limit nesting visual indentation after a certain depth to prevent squishing
  const indentClass = level > 0 ? "ml-3 md:ml-6" : "";
  
  return (
    <div className={cn("relative", indentClass)}>
      {/* Thread Line */}
      {level > 0 && !isLast && (
        <div className="absolute left-[-12px] top-8 bottom-0 w-[2px] bg-border/50 hover:bg-primary/20 transition-colors cursor-pointer" 
             onClick={() => setIsCollapsed(!isCollapsed)}
        />
      )}
      
      {/* Corner connector for nested items */}
      {level > 0 && (
        <div className="absolute left-[-12px] top-0 h-6 w-3 border-b-2 border-l-2 border-border/50 rounded-bl-lg text-border/50" />
      )}

      <div className={cn(
        "py-3 pr-2 rounded-lg transition-colors",
        isCollapsed ? "opacity-60" : ""
      )}>
        {/* Comment Header */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-foreground border border-border">
            {comment.author.substring(0, 2).toUpperCase()}
          </div>
          <span className="text-xs font-bold text-foreground">@{comment.author}</span>
          <span className="text-[10px] text-muted-foreground">• {comment.timestamp}</span>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? <MoreHorizontal className="w-3 h-3" /> : null}
          </button>
        </div>

        {!isCollapsed && (
          <>
            <div className="pl-8">
              <p className="text-sm text-foreground/90 leading-relaxed mb-2">
                {comment.content}
              </p>

              {/* Action Bar */}
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center bg-secondary/30 rounded-full p-1 border border-border/50">
                   <button 
                     onClick={() => handleVote('up')}
                     className={cn("p-1 rounded hover:bg-background/80 hover:text-primary transition-colors", voteState === 'up' && "text-primary")}
                   >
                     <ArrowBigUp className={cn("w-4 h-4", voteState === 'up' && "fill-current")} />
                   </button>
                   <span className={cn("text-xs font-bold font-mono min-w-[20px] text-center", 
                     voteState === 'up' ? "text-primary" : voteState === 'down' ? "text-destructive" : ""
                   )}>
                     {votes}
                   </span>
                   <button 
                     onClick={() => handleVote('down')}
                     className={cn("p-1 rounded hover:bg-background/80 hover:text-destructive transition-colors", voteState === 'down' && "text-destructive")}
                   >
                     <ArrowBigDown className={cn("w-4 h-4", voteState === 'down' && "fill-current")} />
                   </button>
                </div>

                <button className="flex items-center gap-1.5 hover:bg-secondary/50 px-2 py-1 rounded-full transition-colors group">
                  <MessageSquare className="w-3.5 h-3.5 group-hover:text-foreground" />
                  <span className="text-xs font-medium group-hover:text-foreground">Reply</span>
                </button>
                
                <button className="hover:bg-secondary/50 p-1.5 rounded-full transition-colors">
                   <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Recursively render replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-2">
                {comment.replies.map((reply, index) => (
                  <Comment 
                    key={reply.id} 
                    comment={{...reply, level: level + 1}} 
                    isLast={index === comment.replies!.length - 1}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
