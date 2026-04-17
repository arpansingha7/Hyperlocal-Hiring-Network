import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Context } from "../../main";
import { Link, Navigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Job Seeker");

  const [loginMode, setLoginMode] = useState("password");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  const handlePasswordLogin = async (e) => {
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
      
      // Stitch Experience: Slight delay to ensure WOW factor and state sync
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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone) return toast.error("Please enter a phone number");
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/v1/user/send-otp",
        { phone, role },
        { withCredentials: true }
      );
      toast.success(data.message);
      setOtpSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/v1/user/verify-otp",
        { phone, role, otp },
        { withCredentials: true }
      );
      toast.success(data.message);
      setUser(data.user);
      
      setIsSyncing(true);
      setTimeout(() => {
        setIsAuthorized(true);
      }, 600);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized) return <Navigate to="/" />;

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden relative selection:bg-primary/30 selection:text-primary">
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
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4 px-2">Synchronizing <span className="text-primary italic">Profile</span></h2>
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
             <h1 className="text-6xl md:text-7xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter uppercase italic px-2">
                Log <span className="text-primary italic">In.</span>
             </h1>
          </div>

          <div className="flex bg-black/40 p-2 rounded-[1.5rem] mb-12 border border-white/5 mx-auto max-w-sm">
            {["password", "otp"].map(mode => (
              <button 
                key={mode}
                type="button"
                onClick={() => { setLoginMode(mode); setOtpSent(false); }}
                className={`flex-1 py-4 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${
                    loginMode === mode 
                    ? "bg-slate-800 text-primary shadow-xl scale-[1.02] border border-white/5" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {mode === "password" ? "Credentials" : "Snapshot OTP"}
              </button>
            ))}
          </div>

          <form onSubmit={loginMode === "password" ? handlePasswordLogin : (otpSent ? handleVerifyOtp : handleSendOtp)} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-6 block">Select Role</label>
              <div className="grid grid-cols-2 gap-4">
                {["Job Seeker", "Employer"].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-8 rounded-[2rem] border-2 transition-all group flex flex-col items-center gap-4 ${
                      role === r 
                      ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10" 
                      : "border-slate-200/50 dark:border-white/5 bg-slate-50 dark:bg-black/20 text-slate-500 hover:border-slate-300 dark:hover:border-white/10"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-3xl font-bold transition-transform group-hover:scale-110 ${role === r ? "text-primary rotate-12" : "text-slate-400"}`}>
                        {r === "Job Seeker" ? "person_search" : "storefront"}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${role === r ? "text-primary" : "text-slate-500"}`}>{r}</span>
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={loginMode + (otpSent ? 'otp' : 'init')}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="space-y-6"
                >
                    {loginMode === "password" ? (
                        <>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-6 block">Email Address</label>
                                <input
                                    className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                                    placeholder="your@email.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-6 block">Password</label>
                                <input
                                    className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-6 block">Phone Direct</label>
                                <input
                                    className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner disabled:opacity-50"
                                    placeholder="+91 0000000000"
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={otpSent}
                                    required
                                />
                            </div>
                            {otpSent && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-6 block">Verification String</label>
                                    <input
                                        className="w-full px-8 py-6 rounded-[1.5rem] bg-slate-100 dark:bg-slate-900 border border-primary/30 focus:border-primary outline-none font-black text-center text-3xl tracking-[0.8em] text-primary transition-all shadow-2xl"
                                        placeholder="000000"
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </motion.div>
                            )}
                        </>
                    )}
                </motion.div>
            </AnimatePresence>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:scale-[1.02] hover:shadow-primary/50 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 mt-10"
            >
                {loading && <span className="material-symbols-outlined animate-spin">refresh</span>}
                {loginMode === "password" ? "Login to Account" : (otpSent ? "Verify and Login" : "Send Login OTP")}
            </button>
          </form>

          <div className="mt-16 pt-10 border-t border-white/5 text-center">
            <p className="text-sm font-bold text-slate-500 italic">
                Awaiting access? <Link to="/register" className="text-primary hover:underline ml-2 uppercase tracking-widest font-black not-italic text-[10px]">Create Profile</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
