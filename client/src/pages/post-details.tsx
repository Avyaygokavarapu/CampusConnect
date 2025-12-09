import { AppLayout } from "@/components/layout/AppLayout";
import { PostCard } from "@/components/feed/PostCard";
import { Comment, CommentType } from "@/components/feed/Comment";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

// Define locally as it's not exported from home.tsx
interface PostWithAuthor {
  id: number;
  content: string;
  author: string;
  likes: number;
  createdAt: string;
  type: "text" | "poll";
  pollId?: number;
  isLiked?: boolean;
}

// Interface for raw comment from API
interface RawComment {
  id: number;
  content: string;
  author: string;
  postId: number;
  parentId: number | null;
  likes: number;
  createdAt: string;
}

export default function PostDetails() {
  const [, params] = useRoute("/post/:id");
  const postId = params?.id ? parseInt(params.id) : null;
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");

  const { data: post, isLoading: isPostLoading } = useQuery<PostWithAuthor>({
    queryKey: [`/api/posts/${postId}`],
    enabled: !!postId,
  });

  const { data: comments = [], isLoading: isCommentsLoading } = useQuery<RawComment[]>({
    queryKey: [`/api/posts/${postId}/comments`],
    enabled: !!postId,
  });

  const postCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", `/api/posts/${postId}/comments`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/comments`] });
      setCommentText("");
      toast({ title: "Comment posted!" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to post comment", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    postCommentMutation.mutate(commentText);
  };

  // Build comment tree from flat list
  const buildCommentTree = (flatComments: RawComment[]): CommentType[] => {
    const commentMap = new Map<number, CommentType>();
    const roots: CommentType[] = [];

    // First pass: create CommentType objects
    flatComments.forEach(c => {
      commentMap.set(c.id, {
        id: c.id,
        author: c.author,
        content: c.content,
        timestamp: formatDistanceToNow(new Date(c.createdAt), { addSuffix: true }),
        votes: c.likes,
        postId: c.postId,
        replies: []
      });
    });

    // Second pass: link parents and children
    flatComments.forEach(c => {
      const comment = commentMap.get(c.id)!;
      if (c.parentId === null) {
        roots.push(comment);
      } else {
        const parent = commentMap.get(c.parentId);
        if (parent) {
          parent.replies?.push(comment);
        } else {
          // If parent not found (shouldn't happen with consistent data), treat as root
          roots.push(comment);
        }
      }
    });

    // Sort by newest first (optional, or by votes)
    return roots.sort((a, b) => b.id - a.id);
  };

  const commentTree = buildCommentTree(comments);

  if (isPostLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!post) {
    return (
      <AppLayout>
        <div className="text-center py-8">
          <h2 className="text-xl font-bold">Post not found</h2>
          <Link href="/" className="text-primary hover:underline mt-2 inline-block">
            Return to Feed
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4 pl-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Link>

        {/* Main Post */}
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <PostCard 
            id={post.id}
            content={post.content}
            timestamp={formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            likes={post.likes}
            reposts={0} // Not implemented yet
            author={post.author}
            isLiked={post.isLiked}
          />
        </motion.div>

        {/* Comment Input Area */}
        <GlassCard className="my-6 p-4 border-l-4 border-l-primary/40">
           <textarea 
             placeholder="Add to the discussion..." 
             className="w-full bg-transparent resize-none outline-none text-sm min-h-[60px]"
             value={commentText}
             onChange={(e) => setCommentText(e.target.value)}
           />
           <div className="flex justify-end mt-2">
             <button 
                onClick={handlePostComment}
                disabled={postCommentMutation.isPending || !commentText.trim()}
                className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {postCommentMutation.isPending ? "Posting..." : "Reply"}
             </button>
           </div>
        </GlassCard>

        {/* Thread Section */}
        <div className="space-y-1 pb-20">
            <div className="flex items-center justify-between px-2 mb-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Discussion ({comments.length})</h3>
                <div className="text-xs text-muted-foreground/60 border border-border px-2 py-1 rounded-md">
                    Sort by: <span className="text-foreground font-medium">Top</span>
                </div>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-2 md:p-4 shadow-sm">
                {isCommentsLoading ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                ) : commentTree.length > 0 ? (
                    commentTree.map((comment, index) => (
                        <Comment 
                            key={comment.id} 
                            comment={comment} 
                            isLast={index === commentTree.length - 1}
                            postId={post.id}
                        />
                    ))
                ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                        No comments yet. Be the first to share your thoughts!
                    </div>
                )}
            </div>
        </div>
      </div>
    </AppLayout>
  );
}
