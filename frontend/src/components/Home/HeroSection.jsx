import { FaBuilding, FaSuitcase, FaUsers, FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const { t } = useTranslation();
  
  const details = [
    {
      id: 1,
      title: "1,23,441",
      subTitle: t("Live Jobs"),
      icon: <FaSuitcase className="text-4xl text-blue-500" />,
    },
    {
      id: 2,
      title: "91,220",
      subTitle: t("Companies"),
      icon: <FaBuilding className="text-4xl text-indigo-500" />,
    },
    {
      id: 3,
      title: "2,34,200",
      subTitle: t("Job Seekers"),
      icon: <FaUsers className="text-4xl text-purple-500" />,
    },
    {
      id: 4,
      title: "1,03,761",
      subTitle: t("Employers"),
      icon: <FaUserPlus className="text-4xl text-pink-500" />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white dark:bg-slate-900 pb-20 pt-32 px-4 sm:px-6 lg:px-8">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob dark:bg-primary/5"></div>
      <div className="absolute top-0 -right-20 w-[500px] h-[500px] bg-blue-400/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-2000 dark:bg-blue-600/5"></div>
      <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-purple-400/10 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-blob animation-delay-4000 dark:bg-purple-600/5"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mb-16 px-4"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-md text-primary font-black text-xs uppercase tracking-widest"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            🚀 The #1 Hyperlocal Hiring Network
          </motion.div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tighter">
            Find an opportunity that <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-blue-600 dark:from-primary dark:via-indigo-400 dark:to-blue-400">
                suits your passion
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed">
            Discover thousands of local roles tailored to your exact skills.
            Connect instantly with top employers eager for neighborhood talent.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full px-4"
        >
          {details.map((element) => (
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              key={element.id}
              className="group p-8 rounded-[2.5rem] bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none backdrop-blur-sm transition-all"
            >
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-inner mb-8 flex items-center justify-center transition-transform group-hover:rotate-6 group-hover:scale-110">
                {element.icon}
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                {element.title}
              </h3>
              <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.15em] text-[10px]">
                {element.subTitle}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
