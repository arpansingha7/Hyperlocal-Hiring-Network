import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Context } from "../../main";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Job Seeker");

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  const startVoiceSetup = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return toast.error("Your browser does not support Voice Recognition. Please use Chrome/Edge.");
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      toast.success("AI Listening...", { icon: '🎙️' });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      if(event.error !== 'no-speech') {
        toast.error("Microphone access failed.");
      }
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setIsProcessing(true);
      const loadingToast = toast.loading("AI parsing your signature...");
      
      try {
        const { data } = await axios.post("/api/v1/user/ai-voice-setup", { transcript });
        const parsed = data.data;
        
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.role) {
           const parsedRole = parsed.role.toLowerCase().includes("employer") ? "Employer" : "Job Seeker";
           setRole(parsedRole);
        }
        
        toast.success("Magic auto-fill complete!", { id: loadingToast });
      } catch (error) {
        toast.error("AI parsing encountered an error.", { id: loadingToast });
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.start();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/v1/user/register",
        { name, phone, email, role, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setUser(data.user);
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      // Smart state synchronization
      setIsSyncing(true);
      setTimeout(() => {
        setIsAuthorized(true);
      }, 600);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized) return <Navigate to={"/"} />;

  return (
    <div className="bg-background min-h-screen pt-32 pb-20 overflow-x-hidden relative selection:bg-primary/30 selection:text-primary">
      <Helmet>
        <title>HHN | Create Your Professional Profile</title>
        <meta name="description" content="Join the Hyperlocal Hiring Network and connect with opportunities in your neighborhood." />
      </Helmet>
      {/* Background Aesthetics */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] animate-blob animation-delay-4000" />
      </div>

      <AnimatePresence>
        {isSyncing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/80 dark:bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-10"
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1], rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 border-t-2 border-primary rounded-full mb-10 shadow-[0_0_40px_rgba(239,108,0,0.4)]"
            />
            <h2 className="text-4xl font-black text-white uppercase italic italic-safe tracking-tighter mb-4">Initializing <span className="text-primary italic italic-safe">Network</span></h2>
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Your professional silhouette is being rendered...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          {/* Left: Branding & Messaging */}
          <div className="lg:w-5/12 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 dark:border-white/10 text-slate-500 dark:text-white font-black text-[10px] uppercase tracking-[0.4em] mb-12 shadow-2xl"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Verified Registration Hub
            </motion.div>
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.9] mb-10 tracking-tighter uppercase italic italic-safe px-2">
              Neighborhood <br />
              <span className="text-primary italic italic-safe">Network.</span>
            </h1>
            <p className="text-xl text-slate-500 font-bold max-w-lg leading-relaxed mb-16 mx-auto lg:mx-0">
                Join our curated neighborhood network where professional roles meet local talent. Every connection is a step toward localized growth.
            </p>
            
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={startVoiceSetup}
              className={`glass-auth p-10 flex items-center gap-8 cursor-pointer rounded-[2.5rem] group transition-all relative overflow-hidden ${isRecording ? 'border-primary ring-4 ring-primary/20' : 'shadow-2xl'}`}
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${isRecording ? 'bg-red-500 animate-pulse scale-110' : 'bg-primary'}`}>
                <span className="material-symbols-outlined text-white text-4xl font-bold">{isRecording ? 'mic' : 'mic_none'}</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase italic italic-safe">Smart Voice Setup</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-loose">
                  {isRecording ? "Processing spoken signature..." : "Auto-fill your profile with one breath."}
                </p>
              </div>
              {isProcessing && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-[shimmer_2s_infinite]" />
              )}
            </motion.div>
          </div>

          {/* Right: Registration Form */}
          <div className="lg:w-7/12 w-full">
            <motion.form 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleRegister} 
              className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 sm:p-20 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.8)] space-y-16 relative group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-20" />
              
              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] pl-8 block">Network Standing</label>
                <div className="grid grid-cols-2 gap-6">
                  {["Job Seeker", "Employer"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex flex-col items-center gap-4 p-10 rounded-[2.5rem] border-2 transition-all group ${role === r ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10' : 'border-white/5 bg-black/20 text-slate-500 hover:border-white/10'}`}
                    >
                      <span className={`material-symbols-outlined text-4xl font-bold transition-transform group-hover:scale-110 ${role === r ? 'text-primary rotate-12' : 'text-slate-600'}`}>
                        {r === "Job Seeker" ? 'person_search' : 'business_center'}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${role === r ? 'text-primary' : 'text-slate-500'}`}>{r}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] pl-6 block">Full Name</label>
                  <input className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                    placeholder="" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] pl-6 block">Official Email</label>
                  <input className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                    placeholder="" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] pl-6 block">Direct Mobile</label>
                  <input className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                    placeholder="" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] pl-6 block">Password</label>
                  <div className="relative">
                    <input className="w-full px-8 py-5 rounded-[1.5rem] bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner pr-16"
                      placeholder="" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
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

              <div className="pt-10">
                <button type="submit" disabled={loading} className="w-full bg-primary text-white py-6 rounded-[2.5rem] font-black text-[10px] shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-95 transition-all tracking-[0.5em] uppercase flex items-center justify-center gap-4">
                  {loading && <span className="material-symbols-outlined animate-spin">refresh</span>}
                  Initialize Profile
                </button>
                <div className="mt-12 pt-10 border-t border-white/5 text-center">
                    <p className="text-sm font-bold text-slate-500 italic italic-safe">
                        Established member? <Link to="/login" className="text-primary hover:underline font-black not-italic ml-2 uppercase tracking-widest text-[10px]">Log In</Link>
                    </p>
                </div>
              </div>
            </motion.form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
