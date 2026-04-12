import React from 'react';
import { WaitlistForm } from '../components/WaitlistForm';
import { Calendar, MapPin, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
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
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20 overflow-y-auto">
        <div className="w-full flex flex-col items-center">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm tracking-widest uppercase mb-6">
              Kindly Respond
            </span>
            <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">
              The Forever <span className="italic text-accent">Affair</span>
            </h1>
            <p className="text-lg text-secondary/70 leading-relaxed mb-8">
              We look forward to celebrating this special day with you. Please let us know if you will be joining us.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 border border-white/20">
                <Calendar className="w-4 h-4 text-accent" /> Saturday, June 14, 2026
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 border border-white/20">
                <MapPin className="w-4 h-4 text-accent" /> The Regency Grand Ballroom
              </div>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-3xl glass-card rounded-3xl p-8 md:p-12"
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-secondary/5 rounded-2xl">
                    <Heart className="w-6 h-6 text-accent fill-accent/20" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif">RSVP</h2>
                      <p className="text-sm text-secondary/60">Please complete the form below by May 1st.</p>
                    </div>
                  </div>
                  
                  <WaitlistForm onSuccess={() => setIsSubmitted(true)} />
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-4xl font-serif mb-4">Response Received</h2>
                  <p className="text-secondary/70 max-w-sm mx-auto mb-10 leading-relaxed">
                    Thank you for your response. We've saved your information and look forward to seeing you.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="flex items-center gap-2 mx-auto text-accent font-semibold hover:gap-3 transition-all"
                  >
                    Submit for another guest <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          <footer className="mt-16 text-center text-sm text-secondary/40 font-medium tracking-wide">
            &copy; 2026 The Forever Affair • With Love
          </footer>
        </div>
      </main>
    </div>
  );
};
