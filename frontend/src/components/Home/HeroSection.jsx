import { FaBuilding, FaSuitcase, FaUsers, FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";

const HeroSection = () => {
  const details = [
    {
      id: 1,
      title: "1,23,441",
      subTitle: "Live Jobs",
      icon: <FaSuitcase className="text-4xl text-blue-500 mb-4" />,
    },
    {
      id: 2,
      title: "91,220",
      subTitle: "Companies",
      icon: <FaBuilding className="text-4xl text-indigo-500 mb-4" />,
    },
    {
      id: 3,
      title: "2,34,200",
      subTitle: "Job Seekers",
      icon: <FaUsers className="text-4xl text-purple-500 mb-4" />,
    },
    {
      id: 4,
      title: "1,03,761",
      subTitle: "Employers",
      icon: <FaUserPlus className="text-4xl text-pink-500 mb-4" />,
    },
  ];

  /* Stagger animations for cards */
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60 } },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pb-20 pt-32 px-4">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob dark:bg-blue-600/20"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 dark:bg-purple-600/20"></div>
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 dark:bg-indigo-600/20"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mb-16"
        >
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 backdrop-blur-sm text-blue-700 dark:text-blue-300 font-bold text-sm tracking-wide shadow-sm">
            🚀 The #1 Hyperlocal Hiring Network
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-6">
            Find an opportunity that <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">suits your passion</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium">
            Discover thousands of local roles tailored to your exact skills.
            Connect instantly with top employers eager for neighborhood talent.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full"
        >
          {details.map((element) => (
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              key={element.id}
              className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-white/50 dark:border-slate-700 flex flex-col items-center text-center transition-all"
            >
              <div className="p-4 bg-white dark:bg-slate-700 rounded-2xl shadow-sm mb-6 border border-slate-100 dark:border-slate-600">
                {element.icon}
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                {element.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider text-sm">
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
