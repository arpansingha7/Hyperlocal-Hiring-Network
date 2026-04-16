import React, { useContext } from 'react';
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter, FaDiscord } from "react-icons/fa";
import { motion } from "framer-motion";

function Footer() {
  const { isAuthorized, user } = useContext(Context);

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:rotate-12 transition-transform duration-500">
                <span className="material-symbols-outlined text-white text-2xl font-bold">work</span>
              </div>
              <h2 className="text-2xl font-black tracking-tighter uppercase italic">
                Hyperlocal <span className="text-primary">Hiring</span> Network (HHN)
              </h2>
            </Link>
            <p className="text-slate-400 font-bold leading-relaxed text-lg max-w-md">
              The heartbeat of your local neighborhood economy. We bridge the gap between local shops and skilled workers across India.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <FaGithub />, link: "#", label: "Github" },
                { icon: <FaLinkedin />, link: "#", label: "LinkedIn" },
                { icon: <FaTwitter />, link: "#", label: "Twitter" },
                { icon: <FaDiscord />, link: "#", label: "Discord" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.link}
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-slate-400 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-xl"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Discover</h4>
            <ul className="space-y-4">
              {["All Opportunities", "Featured Companies", "Success Stories", "Network Map"].map(item => (
                <li key={item}>
                  <Link to="#" className="text-sm font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employer Studio */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Studio</h4>
            <ul className="space-y-4">
              {["Post a Role", "Talent Search", "AI Matching", "Team Dashboard"].map(item => (
                <li key={item}>
                  <Link to="#" className="text-sm font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Stay Synced</h4>
            <div className="glass-card p-6 bg-white/5 border-white/10">
              <p className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest leading-relaxed">Join 500+ neighbors finding work every week.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="EMAIL ADDRESS" 
                  className="w-full bg-slate-800 border-none rounded-xl px-5 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-white text-sm">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-t border-b border-white/5 mb-12">
            {[
                { label: "Active Jobs", val: "12K+" },
                { label: "Success Rate", val: "94%" },
                { label: "Match Time", val: "24h" },
                { label: "Community", val: "50K+" }
            ].map((stat, i) => (
                <div key={i} className="text-center md:text-left">
                    <p className="text-2xl font-black italic uppercase italic leading-none mb-1 tracking-tighter">{stat.val}</p>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">{stat.label}</p>
                </div>
            ))}
        </div>

        {/* Legal & Meta */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Hyperlocal Hiring Network (HHN). Crafted with Passion.
          </p>
          <div className="flex gap-8">
            {["Terms", "Privacy", "Cookies", "API"].map(item => (
              <Link key={item} to="#" className="text-[10px] font-black text-slate-500 hover:text-primary transition-colors uppercase tracking-widest">{item}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
