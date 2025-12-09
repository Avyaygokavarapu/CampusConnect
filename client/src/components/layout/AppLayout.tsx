import React from "react";
import { BottomNav } from "@/components/nav/BottomNav";
import bgImage from "@assets/generated_images/dark_holographic_neon_fluid_shapes_background.png";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen w-full relative bg-background text-foreground overflow-x-hidden selection:bg-neon-pink selection:text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Dimmer */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 scale-110 animate-pulse-slow"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] z-20 pointer-events-none mix-blend-overlay" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 pb-32 pt-6 px-4 max-w-xl mx-auto min-h-screen flex flex-col">
        {/* Header/Logo Area */}
        <header className="flex justify-between items-center mb-8 py-4 sticky top-0 z-50 mix-blend-screen backdrop-blur-sm -mx-4 px-4 bg-background/5">
           <h1 className="text-2xl font-bold font-display tracking-tighter uppercase italic bg-gradient-to-r from-neon-pink to-neon-blue bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,62,246,0.5)]">
             Neon Dream
           </h1>
           <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 backdrop-blur-md" />
        </header>

        {children}
      </main>

      <BottomNav />
    </div>
  );
}
