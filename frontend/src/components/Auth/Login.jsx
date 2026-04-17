import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Context } from "../../main";
import { Link, Navigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Job Seeker");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/v1/user/login",
        { email, password, role },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setUser(data.user);
      
      setIsSyncing(true);
      setTimeout(() => {
        setIsAuthorized(true);
      }, 600);
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized) return <Navigate to="/" />;

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden relative selection:bg-primary/30 selection:text-primary">
      <Helmet>
        <title>HHN | Secure Access Portal</title>
        <meta name="description" content="Securely log in to the Hyperlocal Hiring Network." />
      </Helmet>
      {/* Background Aesthetics */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-blob" />
        <div className="absolute top-1/2 -right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] animate-blob animation-delay-2000" />
      </div>

      <AnimatePresence>
        {isSyncing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/80 dark:bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center text-center p-10"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 border-t-2 border-primary rounded-full mb-10 shadow-[0_0_30px_rgba(239,108,0,0.3)]"
            />
            <h2 className="text-4xl font-black text-white uppercase italic italic-safe tracking-tighter mb-4 px-2">Synchronizing <span className="text-primary italic italic-safe">Profile</span></h2>
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Connecting to the local network...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="glass-auth rounded-[3rem] p-10 sm:p-16 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />
          
          <div className="text-center mb-16 relative">
             <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-10">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Secure Access Portal
             </div>
             <h1 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter uppercase italic italic-safe px-2">
                Log <span className="text-primary italic italic-safe">In.</span>
             </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-6 block text-center sm:text-left">Identify Your Role</label>
              <div className="grid grid-cols-1 xs:grid-cols-3 gap-4">
                {["Job Seeker", "Employer", "Admin"].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-6 rounded-[2rem] border-2 transition-all group flex flex-col items-center gap-3 ${
                      role === r 
                      ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10" 
                      : "border-slate-200/50 dark:border-white/5 bg-slate-50 dark:bg-black/20 text-slate-500 hover:border-slate-300 dark:hover:border-white/10"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-2xl font-bold transition-transform group-hover:scale-110 ${role === r ? "text-primary rotate-12" : "text-slate-400"}`}>
                        {r === "Job Seeker" ? "person_search" : r === "Employer" ? "storefront" : "shield_person"}
                    </span>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${role === r ? "text-primary" : "text-slate-500"}`}>{r}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-6 block">Email Address</label>
                    <input
                        className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                        placeholder="network@origin.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-6 block">Secure Access Key</label>
                    <div className="relative">
                        <input
                            className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner pr-16"
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined font-black">
                                {showPassword ? "visibility_off" : "visibility"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:scale-[1.02] hover:shadow-primary/50 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 mt-10"
            >
                {loading && <span className="material-symbols-outlined animate-spin">refresh</span>}
                Access Terminal
            </button>
          </form>

          <div className="mt-16 pt-10 border-t border-white/5 text-center">
            <p className="text-sm font-bold text-slate-500 italic italic-safe">
                Awaiting access? <Link to="/register" className="text-primary hover:underline ml-2 uppercase tracking-widest font-black not-italic text-[10px]">Create Profile</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
