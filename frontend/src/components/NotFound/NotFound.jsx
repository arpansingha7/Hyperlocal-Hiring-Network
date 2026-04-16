import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-background-light dark:bg-background-dark flex items-center justify-center p-6 overflow-hidden relative">
      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 dark:bg-primary/2 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-primary/5 text-center relative z-10"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-32 h-32 mx-auto bg-primary/10 dark:bg-primary/20 text-primary rounded-[2rem] flex items-center justify-center rotate-12 mb-8 border border-primary/20 shadow-inner"
        >
          <span className="material-symbols-outlined text-[5rem]">location_off</span>
        </motion.div>

        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-500 tracking-tighter mb-4">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-200 mb-4 tracking-tight">
          Oops! You've strayed off the map.
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 max-w-md mx-auto font-medium">
          The hyperlocal sector you are looking for does not exist or has been relocated by the system.
        </p>

        <Link to="/" className="inline-flex items-center gap-2 bg-primary text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-primary/30 hover:brightness-110 active:scale-95 transition-all outline-none focus:ring-4 focus:ring-primary/20">
          <span className="material-symbols-outlined">home</span>
          Return to Hub
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
