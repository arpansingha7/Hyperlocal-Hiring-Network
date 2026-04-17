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
    <section className="relative min-h-[110vh] flex items-center justify-center overflow-hidden bg-white dark:bg-slate-900 pb-20 pt-48 px-4 sm:px-6 lg:px-8">
      {/* Dynamic Background Elements - Enhanced Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[140px] dark:bg-primary/5" 
        />
        <motion.div 
          animate={{ scale: [1.1, 1, 1.1], x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] dark:bg-indigo-500/5 transition-colors" 
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-5xl mb-24 relative"
        >
          {/* Floating Element 1 - Improved Position */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="hidden xl:flex absolute -left-28 top-20 items-center gap-4 glass-card-premium !p-5 rotate-[-8deg] shadow-2xl"
          >
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-500 text-2xl">verified</span>
            </div>
            <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trust Factor</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">Verified Roles</p>
            </div>
          </motion.div>

          {/* Floating Element 2 - Improved Position */}
          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="hidden xl:flex absolute -right-28 bottom-20 items-center gap-4 glass-card-premium !p-5 rotate-[10deg] shadow-2xl"
          >
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl font-bold">distance</span>
            </div>
            <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hyperlocal</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">5km Radius</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-3 px-8 py-3 mb-12 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-[0.4em] shadow-xl"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            {t("Direct Neighborhood Matching")}
          </motion.div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.9] mb-12 tracking-tight uppercase italic px-6">
            Connecting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-rose-600 dark:from-primary dark:via-orange-400 dark:to-rose-400 pb-2 px-4 inline-block">
                Local Workers
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed mb-16">
            The bridge between neighborhood shops and skilled workers. Find jobs, hire locals, and grow together in your own area.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link to="/job/getall" className="w-full sm:w-auto px-14 py-7 bg-primary text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                <span className="material-symbols-outlined">explore</span>
                {t("Explore All Roles")}
            </Link>
            <Link to="/register" className="w-full sm:w-auto px-14 py-7 glass-card border-none dark:bg-slate-800/50 text-slate-900 dark:text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3">
                <span className="material-symbols-outlined">person_add</span>
                {t("Join the Network")}
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full mt-12">
          {details.map((element, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -20, scale: 1.05 }}
              key={element.id}
              className={`glass-card-premium p-12 !rounded-[4rem] group border border-white/30 dark:border-slate-800/50 transition-all shadow-2xl shadow-slate-200/40 dark:shadow-none hover:shadow-primary/10`}
            >
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${element.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-[50px]`} />
              
              <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-xl mb-12 flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110 relative z-10 border border-white/10">
                {element.icon}
              </div>
              <h3 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 relative z-10 italic uppercase px-4">
                {element.title}
              </h3>
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] relative z-10 border-t border-slate-100 dark:border-slate-800 pt-5">
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
