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
            className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">
            Submit <span className="text-primary underline decoration-primary/20 underline-offset-8">Application</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 uppercase tracking-[0.3em] text-[10px]">
            Pitch yourself to your next hyperlocal team
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
            <div className="glass-card p-8 sm:p-12 space-y-10">
              <form onSubmit={handleApplication} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Full Identification</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Arpan Singha"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Contact Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="arpan@example.com"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Direct Phone</label>
                    <input
                      type="number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 0000000000"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Physical Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="City, State, Country"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Your Value Pitch</label>
                    <span className="text-[10px] font-bold text-primary uppercase animate-pulse">AI Assisted</span>
                  </div>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Express why you are the perfect fit for this role..."
                    className="w-full px-6 py-5 h-64 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner resize-none whitespace-pre-line"
                    required
                  />
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex justify-end">
                  <button type="submit" className="px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-primary hover:text-white transition-all active:scale-[0.98]">
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
            <div className="glass-card p-10 bg-primary/5 border border-primary/20 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full filter blur-[40px] group-hover:bg-primary/20 transition-all duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <span className="material-symbols-outlined text-2xl font-bold">auto_awesome</span>
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight uppercase italic leading-none">Groq AI</h3>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">Smart Pitch Assistant</p>
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-10 leading-relaxed italic">
                    "Struggling to find the right words? Our Llama3 powered AI will craft a high-impact cover letter based on your unique skills."
                </p>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Core Expertise</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g. Project Ops, Retail, Sales"
                      className="w-full px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-primary/20 font-bold focus:border-primary outline-none shadow-sm"
                    />
                  </div>

                  <button
                    onClick={generateAICoverLetter}
                    disabled={isGenerating}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:brightness-110 disabled:opacity-50 transition-all"
                  >
                    {isGenerating ? (
                        <span className="material-symbols-outlined animate-spin text-xl">refresh</span>
                    ) : (
                        <span className="material-symbols-outlined text-xl">bolt</span>
                    )}
                    {isGenerating ? 'Synthesizing...' : 'Generate Pitch'}
                  </button>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-primary/10">
                <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Real-time Generation
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
