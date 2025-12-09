import React from "react";
import { BottomNav } from "@/components/nav/BottomNav";
import { useUser } from "@/context/UserContext";
import { Coins } from "lucide-react";
import { motion } from "framer-motion";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { auracoins } = useUser();

  return (
    <div className="min-h-screen w-full relative bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Subtle Architectural Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, 
             backgroundSize: '40px 40px' 
           }} 
      />

      {/* Main Content Area */}
      <main className="relative z-10 pb-32 pt-6 px-4 max-w-xl mx-auto min-h-screen flex flex-col">
        {/* Header/Logo Area */}
        <header className="flex justify-between items-center mb-8 py-4 sticky top-0 z-50 bg-background/80 backdrop-blur-md -mx-4 px-4 border-b border-border/50">
           <div className="flex items-center gap-3">
             {/* Abstract Logo mark representing IIM-A Arches */}
             <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-full" />
             </div>
             <h1 className="text-xl font-bold font-display tracking-tight text-foreground">
               CampusConnect<span className="text-primary">@IIMA</span>
             </h1>
           </div>
           
           <div className="flex items-center gap-3">
             {/* Auracoins Balance */}
             <div className="flex items-center gap-1.5 bg-amber-100/50 border border-amber-200 px-2.5 py-1 rounded-full text-amber-700 font-mono text-sm">
                <Coins className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                <motion.span 
                  key={auracoins}
                  initial={{ scale: 1.2, color: "#d97706" }}
                  animate={{ scale: 1, color: "#b45309" }}
                  className="font-bold"
                >
                  {auracoins}
                </motion.span>
             </div>
             
             <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-medium">
               ST
             </div>
           </div>
        </header>

        {children}
      </main>

      <BottomNav />
    </div>
  );
}
