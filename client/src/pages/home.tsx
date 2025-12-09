import { AppLayout } from "@/components/layout/AppLayout";
import { PostCard } from "@/components/feed/PostCard";
import { PollCard } from "@/components/feed/PollCard";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
        >
          <PostCard 
            content="Just saw the future in a dream. It was made of chrome and silence. 🌌"
            timestamp="2m ago"
            likes={42}
            reposts={5}
            author="cyber_goth"
          />
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
        >
          <PollCard 
            question="What is the best aesthetic for 2025?"
            options={[
              { id: "1", text: "Solarpunk 🌱", votes: 124 },
              { id: "2", text: "Dark Futurism 🌑", votes: 432 },
              { id: "3", text: "Y2K Glitch 👾", votes: 89 },
            ]}
            totalVotes={645}
            timeLeft="22h"
          />
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
        >
          <PostCard 
            content="The algorithm is feeling particularly moody today. Anyone else getting weird recommendations?"
            timestamp="15m ago"
            likes={128}
            reposts={32}
            author="glitch_witch"
          />
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
        >
          <PollCard 
             question="Should we upload our consciousness?"
             options={[
               { id: "a", text: "Yes, immediately 🧠", votes: 200 },
               { id: "b", text: "No, stay organic 🥩", votes: 150 },
             ]}
             totalVotes={350}
             timeLeft="4h"
          />
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
        >
          <PostCard 
            content="Trying to debug my own thoughts like 01001011 001... 😵‍💫"
            timestamp="1h ago"
            likes={892}
            reposts={104}
            author="null_ptr"
          />
        </motion.div>
      </div>
    </AppLayout>
  );
}
