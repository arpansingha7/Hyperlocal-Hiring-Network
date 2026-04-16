import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Context } from "../../main";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Job Seeker");

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { isAuthorized, setIsAuthorized } = useContext(Context);

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
      toast.success("Listening... Speak your name, email, phone, etc.", { duration: 4000 });
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      setIsRecording(false);
      if(event.error !== 'no-speech') {
        toast.error("Microphone error: " + event.error);
      }
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setIsProcessing(true);
      toast.loading("AI is parsing your voice...", { id: "ai-parse" });
      
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
        
        toast.success("Form magically auto-filled!", { id: "ai-parse" });
      } catch (error) {
        toast.error("AI parsing failed.", { id: "ai-parse" });
      } finally {
        setIsProcessing(false);
      }
    };

    recognition.start();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/v1/user/register",
        { name, phone, email, role, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (isAuthorized) return <Navigate to={"/"} />;

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pt-28 pb-12 overflow-x-hidden">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-16"
        >
          {/* Left: Branding & Messaging */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-[0.4em] mb-10 w-fit"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Registration Hub
            </motion.div>
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.9] mb-10 tracking-tighter uppercase italic">
              Start your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-orange-400 italic">Hyperlocal</span> <br />
              Journey.
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-bold max-w-lg leading-relaxed mb-12">
                Join the neighborhood network that values your skills. Connect with local business owners and grow together.
            </p>
            
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={startVoiceSetup}
              className={`glass-card p-10 flex items-center gap-8 cursor-pointer border-dashed border-primary/30 group transition-all relative overflow-hidden ${isRecording ? 'border-primary bg-primary/5 ring-8 ring-primary/5 shadow-2xl shadow-primary/20' : ''}`}
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${isRecording ? 'bg-red-500 animate-pulse scale-110 rotate-12' : 'bg-primary'}`}>
                <span className="material-symbols-outlined text-white text-4xl font-bold">{isRecording ? 'mic' : 'mic_none'}</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase italic">AI Voice Setup</h3>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {isRecording ? "Listening to your voice..." : "Auto-fill this entire form instantly."}
                </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -mr-10 -mt-10" />
            </motion.div>
          </div>

          {/* Right: Registration Form */}
          <div className="lg:w-1/2">
            <motion.form 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleRegister} 
              className="glass-card-premium !p-8 sm:!p-12 space-y-12"
            >
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Select Your Entry Role</label>
                <div className="grid grid-cols-2 gap-4">
                  {["Job Seeker", "Employer"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all group ${role === r ? 'border-primary bg-primary/5 shadow-inner' : 'border-slate-100 dark:border-slate-800 hover:border-primary/30'}`}
                    >
                      <span className={`material-symbols-outlined text-3xl ${role === r ? 'text-primary' : 'text-slate-400'}`}>
                        {r === "Job Seeker" ? 'person_search' : 'business_center'}
                      </span>
                      <span className={`text-xs font-black uppercase tracking-widest ${role === r ? 'text-primary' : 'text-slate-500'}`}>{r}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Full Name</label>
                  <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all"
                    placeholder="Arpan Singha" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Email Address</label>
                  <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all"
                    placeholder="arpan@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Mobile Number</label>
                  <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all"
                    placeholder="+91 9999999999" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Secure Password</label>
                  <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all"
                    placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="w-full bg-primary text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all tracking-widest uppercase">
                  Create My Profile
                </button>
                <p className="text-center text-xs font-bold text-slate-500 dark:text-slate-400 mt-8">
                  By joining, you agree to our <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
                </p>
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/50 text-center">
                    <p className="text-sm font-bold text-slate-500">
                        Member of the network? <Link to="/login" className="text-primary hover:underline">Log in here</Link>
                    </p>
                </div>
              </div>
            </motion.form>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Register;
