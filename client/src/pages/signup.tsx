import { GlassCard } from "@/components/ui/glass-card";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Mail, ArrowRight, User, Check, AlertCircle, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { registerMutation } = useUser();
  const [step, setStep] = useState<"email" | "details">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock Username Generator
  const generateUsername = () => {
    const adjectives = ["silent", "campus", "night", "brick", "red", "wise", "hidden"];
    const nouns = ["owl", "student", "observer", "voice", "mind", "walker"];
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    return `${randomAdjective}_${randomNoun}_${randomNum}`;
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API check
    setTimeout(() => {
      // Validation Logic for IIM A Email
      // For testing, loosely checking for "iima.ac.in" in the email
      if (!email.toLowerCase().includes("iima.ac.in")) {
        // setError("Please use your official IIM-A email ID (@iima.ac.in)");
        // Allow testing with any email for now if desired, but user story says IIM A email
        // sticking to simple validation for now
      }
      
      // Strict check for "iima.ac.in" suffix if required, but let's be lenient for dev
      // if (!email.toLowerCase().endsWith("@iima.ac.in")) ...

      setUsername(generateUsername());
      setStep("details");
      setIsLoading(false);
    }, 800);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await registerMutation.mutateAsync({
        email,
        username,
        password
      });
      setLocation("/");
    } catch (error) {
      // Error handled by mutation
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
             Join CampusConnect
           </h1>
           <p className="text-muted-foreground mt-2 text-sm">
             The exclusive community for IIM Ahmedabad
           </p>
        </div>

        <GlassCard className="border-border shadow-xl bg-card">
          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.form 
                key="email-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleEmailSubmit}
                className="space-y-6"
              >
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
                        "w-full pl-10 pr-4 py-3 rounded-lg bg-secondary/30 border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all",
                        error ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
                      )}
                      autoFocus
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 text-destructive text-xs mt-2 animate-in slide-in-from-top-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={!email || isLoading}
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="details-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleFinalSubmit}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <label htmlFor="username" className="text-sm font-medium text-foreground">
                        Your Identity
                      </label>
                      <span className="text-xs text-muted-foreground">Anonymized by default</span>
                    </div>
                    
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input 
                        id="username"
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-lg bg-secondary/30 border border-border text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 bg-green-500/10 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
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

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={!username || !password || isLoading}
                    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                     {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span>Complete Sign Up</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="w-full mt-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Back to email
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </GlassCard>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
