import { AppLayout } from "@/components/layout/AppLayout";
import { PostCard } from "@/components/feed/PostCard";
import { Comment, CommentType } from "@/components/feed/Comment";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useRoute } from "wouter";

// Mock Data for the thread
const mockComments: CommentType[] = [
  {
    id: "c1",
    author: "logic_bomb",
    content: "Honestly, the architectural grid is a vibe. It feels grounded but still digital. Has anyone found the easter egg in the library section yet?",
    timestamp: "2h ago",
    votes: 45,
    replies: [
      {
        id: "c1-r1",
        author: "pixel_pioneer",
        content: "Wait, there's an easter egg? I've been scrolling for hours and missed it.",
        timestamp: "1h ago",
        votes: 12,
        replies: [
          {
            id: "c1-r1-r1",
            author: "logic_bomb",
            content: "Check the footer on the desktop view. Classic IIM-A move.",
            timestamp: "45m ago",
            votes: 8,
          }
        ]
      },
      {
        id: "c1-r2",
        author: "design_nerd",
        content: "The grid represents structure amidst chaos. Very meta for finals week.",
        timestamp: "30m ago",
        votes: 22,
      }
    ]
  },
  {
    id: "c2",
    author: "campus_ghost",
    content: "Is this platform actually anonymous or 'anonymous'? Asking for a friend who has... opinions.",
    timestamp: "3h ago",
    votes: 89,
    replies: [
        {
            id: "c2-r1",
            author: "admin_bot",
            content: "We use a double-blind hash for identity. Even we don't know who you are unless you break the Code of Conduct.",
            timestamp: "2h ago",
            votes: 150,
        }
    ]
  }
];

export default function PostDetails() {
  const [, params] = useRoute("/post/:id");
  const postId = params?.id;

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
            content="Just saw the future in a dream. It was made of chrome and silence. 🌌"
            timestamp="2m ago"
            likes={42}
            reposts={5}
            author="cyber_goth"
          />
        </motion.div>

        {/* Comment Input Area */}
        <GlassCard className="my-6 p-4 border-l-4 border-l-primary/40">
           <textarea 
             placeholder="Add to the discussion..." 
             className="w-full bg-transparent resize-none outline-none text-sm min-h-[60px]"
           />
           <div className="flex justify-end mt-2">
             <button className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-md hover:bg-primary/90 transition-colors">
               Reply
             </button>
           </div>
        </GlassCard>

        {/* Thread Section */}
        <div className="space-y-1 pb-20">
            <div className="flex items-center justify-between px-2 mb-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Discussion</h3>
                <div className="text-xs text-muted-foreground/60 border border-border px-2 py-1 rounded-md">
                    Sort by: <span className="text-foreground font-medium">Top</span>
                </div>
            </div>
            
            <div className="bg-card border border-border rounded-xl p-2 md:p-4 shadow-sm">
                {mockComments.map((comment, index) => (
                    <Comment 
                        key={comment.id} 
                        comment={comment} 
                        isLast={index === mockComments.length - 1}
                    />
                ))}
            </div>
        </div>
      </div>
    </AppLayout>
  );
}
