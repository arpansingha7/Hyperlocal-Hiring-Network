import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Context } from "../../main";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [skills, setSkills] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { id } = useParams();

  const handleApplication = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/v1/application/post",
        { name, email, phone, address, coverLetter, jobId: id },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post application");
    }
  };

  const generateAICoverLetter = async () => {
    if (!skills) {
      toast.error("Please enter some skills to generate a targeted cover letter.");
      return;
    }
    setIsGenerating(true);
    try {
      const { data } = await axios.post(
        "/api/v1/application/ai-generate-cover-letter",
        { jobId: id, userName: name || user?.name, skills },
        { withCredentials: true }
      );
      if (data.success && data.coverLetter) {
        setCoverLetter(data.coverLetter);
        toast.success("AI Cover Letter Generated!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "AI Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!isAuthorized || (user && user.role === "Employer")) {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <main className="max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
        >
          <div className="flex items-center gap-4 mb-2">
            <span className="h-0.5 w-12 bg-primary rounded-full" />
            <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Talent Pipeline</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic italic-safe">
            Submit <span className="text-primary underline decoration-primary/20 underline-offset-8 italic-safe">Application</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mt-4 uppercase tracking-[0.3em] text-[10px] max-w-lg leading-relaxed">
            Pitch your expertise to neighborhood teams and secure your next role through our direct connection network.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form Area */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 space-y-8"
          >
            <div className="glass-card p-10 sm:p-14 space-y-12">
              <form onSubmit={handleApplication} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder=""
                      className="w-full px-6 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-black text-sm text-slate-900 dark:text-white transition-all shadow-inner uppercase tracking-wider"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=""
                      className="w-full px-6 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-black text-sm text-slate-900 dark:text-white transition-all shadow-inner uppercase tracking-wider"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block">Direct Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 00000 00000"
                      className="w-full px-6 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-black text-sm text-slate-900 dark:text-white transition-all shadow-inner uppercase tracking-wider"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block">Physical Residence</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="City, State, Country"
                      className="w-full px-6 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-black text-sm text-slate-900 dark:text-white transition-all shadow-inner uppercase tracking-wider"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block">Cover Letter / Introduction</label>
                    <div className="flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                         <span className="text-[10px] font-black text-primary uppercase tracking-widest">AI Assisted</span>
                    </div>
                  </div>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Briefly describe your experience and availability..."
                    className="w-full px-7 py-6 h-72 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-sm text-slate-900 dark:text-white transition-all shadow-inner resize-none whitespace-pre-line"
                    required
                  />
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center sm:text-left">By submitting, you agree to our direct contact terms.</p>
                  <button type="submit" className="w-full sm:w-auto px-14 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-primary hover:text-white transition-all active:scale-95">
                    Deliver Application
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* AI Side Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="glass-card p-12 bg-primary/5 border border-primary/20 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/10 rounded-full filter blur-[50px] group-hover:bg-primary/20 transition-all duration-1000" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 bg-primary rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-primary/40 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <span className="material-symbols-outlined text-3xl font-bold">auto_awesome</span>
                  </div>
                  <div>
                    <h3 className="font-black text-2xl text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">Groq AI</h3>
                    <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-1.5 leading-none">Neural Assistant</p>
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-12 leading-relaxed italic italic-safe border-l-2 border-primary/30 pl-5">
                    "Finding the right narrative is key. Our Llama 3 engine creates high-impact cover letters built around your specific expertise."
                </p>

                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] block px-1">Expertise Tags</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g. React, UX Design, Ops"
                      className="w-full px-6 py-5 rounded-[1.5rem] bg-white dark:bg-slate-900 border border-primary/10 font-black text-[10px] uppercase tracking-widest focus:border-primary outline-none shadow-sm transition-all"
                    />
                  </div>

                  <button
                    onClick={generateAICoverLetter}
                    disabled={isGenerating}
                    className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:brightness-110 disabled:opacity-50 transition-all active:scale-95"
                  >
                    {isGenerating ? (
                        <span className="material-symbols-outlined animate-spin text-xl">refresh</span>
                    ) : (
                        <span className="material-symbols-outlined text-xl">bolt</span>
                    )}
                    {isGenerating ? 'Synthesizing...' : 'Generate Pitch'}
                  </button>
                </div>

                <div className="mt-14 pt-10 border-t border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-${200 + i*100}`} />
                        ))}
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Trusted by 2.4k users</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Application;
