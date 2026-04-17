import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const Terms = () => {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pt-32 pb-20 px-4 transition-colors duration-500">
      <Helmet>
        <title>HHN | Terms of Service</title>
        <meta name="description" content="Legal terms and conditions for using the Hyperlocal Hiring Network." />
      </Helmet>
      
      <main className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="h-0.5 w-16 bg-primary rounded-full" />
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Governance</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic italic-safe leading-[0.9] mb-8">
            Terms of <span className="text-primary italic italic-safe">Service</span>
          </h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Effective Date: October 2024</p>
        </motion.div>

        <section className="space-y-16 text-slate-700 dark:text-slate-400 font-medium leading-relaxed">
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic italic-safe tracking-tight border-l-4 border-primary pl-6">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing the Hyperlocal Hiring Network (HHN), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform. Our mission is to bridge neighborhood gaps, but this requires mutual respect and adherence to localized laws.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic italic-safe tracking-tight border-l-4 border-primary pl-6">
              2. User Roles & Accountability
            </h2>
            <p>
              Candidates and Employers are responsible for the accuracy of the information provided in profiles and job postings. HHN acts as a matchmaking engine only and does not perform background verifications unless explicitly stated as a premium service.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase italic italic-safe tracking-tight border-l-4 border-primary pl-6">
              3. Geotagging & Privacy
            </h2>
            <p>
              Our platform relies on hyperlocal precision. By using our map-based features, you consent to the collection of anonymized location data to improve our matching algorithms within your 10km radius.
            </p>
          </div>

          <div className="space-y-6 px-10 py-12 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
             <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">Questions?</h3>
             <p className="text-xs font-bold leading-loose mb-8 italic">For any legal inquiries regarding our network governance, please contact our support portal via the main dashboard.</p>
             <button className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Contact Legal</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Terms;
