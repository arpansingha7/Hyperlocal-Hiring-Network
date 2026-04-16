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

  const { isAuthorized, setIsAuthorized } = useContext(Context);

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
      setIsAuthorized(true);
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
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized) return <Navigate to="/" />;

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
       {/* Background Aesthetics */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[120px] animate-blob" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full filter blur-[120px] animate-blob animation-delay-4000" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-card p-8 sm:p-12">
          <div className="text-center mb-10">
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20 transition-transform hover:rotate-6"
            >
              <span className="material-symbols-outlined text-white text-3xl">login</span>
            </motion.div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 uppercase">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">Access your hyperlocal dashboard</p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl mb-10 shadow-inner">
            <button 
                type="button" 
                onClick={() => { setLoginMode("password"); setOtpSent(false); }} 
                className={`flex-1 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${loginMode === "password" ? "bg-white dark:bg-slate-700 shadow-xl text-primary" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
            >
                Secure Password
            </button>
            <button 
                type="button" 
                onClick={() => setLoginMode("otp")} 
                className={`flex-1 py-3 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${loginMode === "otp" ? "bg-white dark:bg-slate-700 shadow-xl text-primary" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
            >
                OTP Instant Login
            </button>
          </div>

          <form onSubmit={loginMode === "password" ? handlePasswordLogin : (otpSent ? handleVerifyOtp : handleSendOtp)} className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Identify Your Profile</label>
              <div className="grid grid-cols-2 gap-4">
                {["Job Seeker", "Employer"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 font-black transition-all uppercase tracking-widest text-[10px] ${role === r ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-primary/50'}`}
                  >
                    <span className="material-symbols-outlined text-xl mb-1">{r === "Job Seeker" ? 'engineering' : 'storefront'}</span>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {loginMode === "password" ? (
                <motion.div 
                    key="password-mode"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Official email</label>
                    <input
                      type="email"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all"
                      placeholder="arpan@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Password</label>
                    <input
                      type="password"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                    key="otp-mode"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Phone Number</label>
                    <input
                      type="text"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all disabled:opacity-50"
                      placeholder="+91 0000000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={otpSent}
                      required
                    />
                  </div>

                  {otpSent && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                    >
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">6-Digit Security OTP</label>
                      <input
                        type="text"
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-black text-center text-2xl tracking-[1em] indent-[0.5em] text-primary transition-all"
                        placeholder="••••••"
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-primary text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 tracking-widest uppercase"
            >
              {loading && <span className="material-symbols-outlined animate-spin text-xl">refresh</span>}
              {loginMode === "password" ? "Secure Login" : (otpSent ? "Verify Identity" : "Get OTP Code")}
            </button>
          </form>

          <footer className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/50 text-center">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                New to Hyperlocal? <Link to="/register" className="text-primary hover:underline ml-1">Join the Network</Link>
            </p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
