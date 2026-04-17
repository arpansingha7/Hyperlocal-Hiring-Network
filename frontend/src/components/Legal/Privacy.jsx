import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const Privacy = () => {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pt-32 pb-20 px-4 transition-colors duration-500">
      <Helmet>
        <title>HHN | Privacy Policy</title>
        <meta name="description" content="Privacy policy and data protection measures for the Hyperlocal Hiring Network." />
      </Helmet>
      
      <main className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="h-0.5 w-16 bg-primary rounded-full" />
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Security Vault</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic italic-safe leading-[0.9] mb-8">
            Privacy <span className="text-primary italic italic-safe">Protocol</span>
          </h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Version: 2.1.0 (Oct 2024)</p>
        </motion.div>

        <section className="space-y-20 text-slate-700 dark:text-slate-400 font-medium leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
             <div className="md:col-span-4">
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-4">Data Collection</h2>
                <div className="w-12 h-1 bg-primary/20 rounded-full" />
             </div>
             <div className="md:col-span-8">
                <p>
                  We collect information necessary to facilitate neighborhood hiring. This includes your name, verified mobile number, and your professional expertise. To power our 10km radius discovery, we utilize device geolocation only when you search for nearby opportunities.
                </p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
             <div className="md:col-span-4">
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-4">Data Usage</h2>
                <div className="w-12 h-1 bg-primary/20 rounded-full" />
             </div>
             <div className="md:col-span-8">
                <p>
                  Your information is used solely to match you with nearby vacancies or candidates. We never sell your data to third-party telemarketers. The platform uses AI to parse signatures and voice transcripts only for autofill purposes, and this data is handled in secure neural buffers.
                </p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
             <div className="md:col-span-4">
                <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-4">Your Rights</h2>
                <div className="w-12 h-1 bg-primary/20 rounded-full" />
             </div>
             <div className="md:col-span-8">
                <p>
                  You have the right to request a full dump of your data profile or permanent erasure from our network. As a hyperlocal platform, we honor "the right to be forgotten" across our neighborhood nodes.
                </p>
             </div>
          </div>

          <div className="p-12 glass transition-all hover:border-primary/30 rounded-[3rem] border border-white/10 flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-primary/10">
                <span className="material-symbols-outlined text-primary text-4xl font-bold">verified_user</span>
             </div>
             <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic italic-safe mb-6 tracking-tight">Encryption Grade Security</h3>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-sm mb-10 leading-relaxed">Every professional silhouette on HHN is protected by industry-standard TLS encryption and secure session hashing.</p>
             <button className="px-14 py-5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/30 active:scale-95 transition-all">Audit Security</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Privacy;
