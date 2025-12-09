import { AppLayout } from "@/components/layout/AppLayout";
import { PostCard } from "@/components/feed/PostCard";
import { PollCard } from "@/components/feed/PollCard";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { PollOption } from "@shared/schema";
import { Loader2 } from "lucide-react";

interface PostWithAuthor {
  id: number;
  content: string;
  author: string;
  likes: number;
  reposts: number;
  createdAt: string;
  isLiked?: boolean;
}

interface PollWithAuthor {
  id: number;
  question: string;
  author: string;
  options: PollOption[];
  totalVotes: number;
  isPrediction: boolean;
  expiresAt: string;
  createdAt: string;
}

export default function Home() {
  const { data: posts, isLoading: loadingPosts } = useQuery<PostWithAuthor[]>({ 
    queryKey: ["/api/posts"] 
  });
  
  const { data: polls, isLoading: loadingPolls } = useQuery<PollWithAuthor[]>({ 
    queryKey: ["/api/polls"] 
  });

  if (loadingPosts || loadingPolls) {
    return (
      <AppLayout>
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const allItems = [
    ...(posts || []).map(p => ({ type: 'post' as const, data: p, createdAt: new Date(p.createdAt) })),
    ...(polls || []).map(p => ({ type: 'poll' as const, data: p, createdAt: new Date(p.createdAt) }))
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <AppLayout>
      <div className="space-y-6">
        {allItems.map((item, index) => (
          <motion.div
            key={`${item.type}-${item.data.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {item.type === 'post' ? (
              <PostCard 
                id={item.data.id.toString()}
                content={(item.data as PostWithAuthor).content}
                timestamp={formatDistanceToNow(new Date((item.data as PostWithAuthor).createdAt), { addSuffix: true })}
                likes={(item.data as PostWithAuthor).likes}
                reposts={(item.data as PostWithAuthor).reposts}
                author={(item.data as PostWithAuthor).author}
                isLiked={(item.data as PostWithAuthor).isLiked}
              />
            ) : (
              <PollCard 
                question={(item.data as PollWithAuthor).question}
                options={(item.data as PollWithAuthor).options.map(o => ({
                  id: o.id.toString(),
                  text: o.text,
                  votes: o.votes
                }))}
                totalVotes={(item.data as PollWithAuthor).totalVotes}
                timeLeft={formatDistanceToNow(new Date((item.data as PollWithAuthor).expiresAt), { addSuffix: true })}
                author={(item.data as PollWithAuthor).author}
                isPrediction={(item.data as PollWithAuthor).isPrediction}
              />
            )}
          </motion.div>
        ))}

        {allItems.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No posts yet. Be the first to share something!
          </div>
        )}
      </div>
    </AppLayout>
  );
}
