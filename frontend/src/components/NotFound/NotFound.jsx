import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center p-6 overflow-hidden relative">
      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 dark:bg-primary/2 rounded-full blur-[150px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-2xl glass-card p-12 sm:p-20 text-center relative z-10"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-32 h-32 mx-auto bg-primary/10 dark:bg-primary/20 text-primary rounded-[2.5rem] flex items-center justify-center rotate-12 mb-12 border border-primary/20 shadow-2xl"
        >
          <span className="material-symbols-outlined text-[5rem] font-bold">explore_off</span>
        </motion.div>

        <h1 className="text-9xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 italic italic-safe uppercase opacity-10 leading-none">
          404
        </h1>
        
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 uppercase italic italic-safe tracking-tighter leading-tight">
          Neighborhood <span className="text-primary">Not Found</span>
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-12 max-w-md mx-auto font-bold uppercase tracking-widest text-xs leading-relaxed">
          The hyperlocal sector you're searching for is currently offline or unreachable in our network matrix.
        </p>

        <Link to="/" className="inline-flex items-center gap-3 bg-primary text-white font-black text-sm px-12 py-6 rounded-[2rem] shadow-2xl shadow-primary/30 hover:brightness-110 active:scale-95 transition-all outline-none uppercase tracking-widest">
          <span className="material-symbols-outlined text-xl">hub</span>
          Return to Hub
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
