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
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none pb-6 pt-4 bg-gradient-to-t from-background via-background/90 to-transparent">
      <nav className="pointer-events-auto bg-card border border-border shadow-lg rounded-full px-2 py-2 flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;

          if (item.isFab) {
            return (
              <Link key={item.path} href={item.path}>
                <motion.div
                  className="mx-2 w-12 h-12 rounded-full bg-primary flex items-center justify-center cursor-pointer text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link key={item.path} href={item.path}>
              <div className="relative px-5 py-3 cursor-pointer group">
                <Icon
                  className={cn(
                    "w-6 h-6 transition-colors duration-200",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
