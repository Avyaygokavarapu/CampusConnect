import { Link, useLocation } from "wouter";
import { Home, Flame, Plus, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, path: "/", label: "Home" },
    { icon: Flame, path: "/trending", label: "Trending" },
    { icon: Plus, path: "/create", label: "Create", isFab: true },
    { icon: User, path: "/profile", label: "Profile" },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="glass-card flex items-center gap-2 p-2 rounded-full pointer-events-auto shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border-white/10 bg-black/60 backdrop-blur-2xl">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;

          if (item.isFab) {
            return (
              <Link key={item.path} href={item.path}>
                <motion.div
                  className="mx-2 w-14 h-14 rounded-full bg-gradient-to-tr from-neon-pink to-neon-blue flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(255,62,246,0.4)] text-white"
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-7 h-7" />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link key={item.path} href={item.path}>
              <div className="relative px-5 py-3 cursor-pointer group">
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-white/10 rounded-full blur-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-6 h-6 transition-colors duration-300 relative z-10",
                    isActive
                      ? "text-neon-blue drop-shadow-[0_0_8px_rgba(76,207,255,0.8)]"
                      : "text-muted-foreground group-hover:text-white"
                  )}
                />
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
