import { FaBuilding, FaSuitcase, FaUsers, FaUserPlus } from "react-icons/fa";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  
  const details = [
    {
      id: 1,
      title: "1,23,441",
      subTitle: t("Live Jobs"),
      icon: <FaSuitcase className="text-3xl text-primary" />,
      color: "from-primary/20",
    },
    {
      id: 2,
      title: "91,220",
      subTitle: t("Companies"),
      icon: <FaBuilding className="text-3xl text-indigo-500" />,
      color: "from-indigo-500/20",
    },
    {
      id: 3,
      title: "2,34,200",
      subTitle: t("Job Seekers"),
      icon: <FaUsers className="text-3xl text-purple-500" />,
      color: "from-purple-500/20",
    },
    {
      id: 4,
      title: "1,03,761",
      subTitle: t("Employers"),
      icon: <FaUserPlus className="text-3xl text-pink-500" />,
      color: "from-pink-500/20",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-slate-900 pb-20 pt-32 px-4 sm:px-6 lg:px-8">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] dark:bg-primary/10" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[100px] dark:bg-indigo-500/10" 
        />
        <motion.div 
          animate={{ scale: [0.8, 1, 0.8], x: [0, 30, 0], y: [0, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 left-1/3 w-[700px] h-[400px] bg-sky-500/10 rounded-full blur-[150px]" 
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-5xl mb-24 relative"
        >
          {/* Floating Element */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="hidden lg:flex absolute -left-20 top-0 items-center gap-3 glass-card p-4 rotate-[-10deg]"
          >
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trust Factor</p>
                <p className="text-xs font-black text-slate-900 dark:text-white">Verified Roles</p>
            </div>
          </motion.div>

          {/* Floating Element 2 */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="hidden lg:flex absolute -right-20 bottom-0 items-center gap-3 glass-card p-4 rotate-[12deg]"
          >
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hyperlocal</p>
                <p className="text-xs font-black text-slate-900 dark:text-white">5km Radius</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-6 py-2.5 mb-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-[0.3em]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {t("Direct Neighborhood Matching")}
          </motion.div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.95] mb-10 tracking-tighter uppercase italic">
            Connecting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-600 to-red-600 dark:from-primary dark:via-orange-400 dark:to-red-400">
                Local Workers
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-bold max-w-3xl mx-auto leading-relaxed mb-12">
            The bridge between neighborhood shops and skilled workers. Find jobs, hire locals, and grow together in your own area.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/job/getall" className="w-full sm:w-auto px-12 py-6 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                {t("Explore All Roles")}
            </Link>
            <Link to="/register" className="w-full sm:w-auto px-12 py-6 glass dark:bg-slate-800/50 text-slate-900 dark:text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95">
                {t("Join the Network")}
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {details.map((element, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -15, scale: 1.05 }}
              key={element.id}
              className={`glass-card-premium p-10 !rounded-[3rem] bg-white/40 dark:bg-slate-800/20 border border-white/30 dark:border-slate-800/50 backdrop-blur-xl transition-all shadow-2xl shadow-slate-200/50 dark:shadow-none`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${element.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-[40px]`} />
              
              <div className="w-16 h-16 bg-white dark:bg-slate-700/50 rounded-[1.25rem] shadow-2xl mb-10 flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110 relative z-10 border border-white/50 dark:border-white/10">
                {element.icon}
              </div>
              <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-[1.2rem] mb-4 relative z-10 italic uppercase -mr-[1.2rem]">
                {element.title.split(',').join('')}
              </h3>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] relative z-10 border-t border-slate-100 dark:border-slate-800 pt-4">
                {element.subTitle}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
