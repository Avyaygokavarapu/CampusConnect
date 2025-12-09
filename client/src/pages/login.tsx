import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Mail, ArrowRight, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

export default function Login() {
  const [, setLocation] = useLocation();
  const { loginMutation } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await loginMutation.mutateAsync({ username: email, password });
      setLocation("/");
    } catch (error) {
      // Error handled by mutation toast
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden">
       {/* Background Grid */}
       <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, 
             backgroundSize: '40px 40px' 
           }} 
      />

      <motion.div 
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-4 shadow-lg shadow-primary/20">
              <div className="w-6 h-6 border-2 border-white rounded-full" />
           </div>
           <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
             Welcome Back
           </h1>
           <p className="text-muted-foreground mt-2 text-sm">
             Enter your credentials to login
           </p>
        </div>

        <GlassCard className="border-border shadow-xl bg-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Institute Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input 
                    id="email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="username@iima.ac.in"
                    className={cn(
                      "w-full pl-10 pr-4 py-3 rounded-lg bg-secondary/30 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all",
                    )}
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input 
                    id="password"
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary/30 border border-border text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={!email || !password || isLoading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </GlassCard>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
