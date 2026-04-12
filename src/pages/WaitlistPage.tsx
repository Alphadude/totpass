import React from 'react';
import { WaitlistForm } from '../components/WaitlistForm';
import { Calendar, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WaitlistPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden font-sans text-secondary">
      {/* Hero Background */}
      <div 
        className="fixed inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: 'url("/hero-bg.png")' }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-primary/10 via-primary/60 to-primary" />

      {/* Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full flex flex-col items-center">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mb-12"
          >
            <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent font-bold text-[10px] tracking-[0.3em] uppercase mb-10 border border-accent/20">
              Kindly Respond
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-light mb-8 leading-tight tracking-tight">
              Grace & <span className="italic font-medium">Dedication</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-serif text-accent mb-8 tracking-wide">
              {/* Baby's Name */}
              Rion Chisom Raphael <span className="italic">Nwosu</span>
            </h2>
            <p className="text-lg md:text-xl text-secondary/70 font-light leading-relaxed mb-12 max-w-lg mx-auto italic">
              We invite you to join us for a special morning as we dedicate our little one to a life of love, faith, and purpose.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary/60">
              <div className="flex flex-col items-center gap-3">
                <div className="w-px h-8 bg-accent/30" />
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent/60" /> 
                  <span>Sunday, April 26, 2026</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-px h-8 bg-accent/30" />
                <div className="flex items-center gap-2 px-4 text-center">
                  <MapPin className="w-4 h-4 text-accent/60 shrink-0" /> 
                  <span>Gateway International Church (Altar of Mercy grounds, Ogbogoro Road, Rumuopirikom, Port Harcourt)</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-2xl glass-card rounded-3xl p-10 md:p-16 relative overflow-hidden"
          >
            {/* Subtle decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-accent/5 rounded-full -translate-x-16 -translate-y-16 blur-3xl" />
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative z-10"
                >
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-light mb-3">RSVP</h2>
                    <div className="w-12 h-px bg-accent/30 mx-auto" />
                  </div>
                  
                  <WaitlistForm onSuccess={() => setIsSubmitted(true)} />
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-accent/5 text-accent rounded-full flex items-center justify-center mx-auto mb-10 border border-accent/10">
                    <CheckCircle2 className="w-10 h-10 font-light" />
                  </div>
                  <h2 className="text-4xl font-serif font-light mb-6">Response Received</h2>
                  <p className="text-secondary/60 max-w-sm mx-auto mb-12 leading-relaxed italic">
                    Thank you for your response. We've saved your information and look forward to celebrating this special day together.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="group flex items-center gap-3 mx-auto text-[10px] font-bold uppercase tracking-[0.2em] text-accent hover:text-secondary transition-colors"
                  >
                    Submit for another guest <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          <footer className="mt-20 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-secondary/30">
            &copy; 2026 Grace & Dedication • With Love
          </footer>
        </div>
      </main>
    </div>
  );
};
