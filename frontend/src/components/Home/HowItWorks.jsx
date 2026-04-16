import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h3 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-slate-900 dark:text-white mb-4"
          >
            How <span className="text-blue-600 dark:text-blue-500">Career Connect</span> Works
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto"
          >
            Follow these simple steps to hyper-charge your regional hiring and find the perfect match right around the corner.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:shadow-slate-200/80 transition-shadow"
          >
            <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm border border-blue-200 dark:border-blue-800/50">
              <FaUserPlus />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Create Account</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Quickly sign up on Career Connect and create your authenticated digital profile to get started immediately.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:shadow-slate-200/80 transition-shadow"
          >
            <div className="w-20 h-20 mx-auto bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm border border-indigo-200 dark:border-indigo-800/50">
              <MdFindInPage />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Find or Post Jobs</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Job seekers can find robust roles utilizing our Map Views, and employers can precisely geo-pin job openings.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 text-center shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:shadow-slate-200/80 transition-shadow"
          >
            <div className="w-20 h-20 mx-auto bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm border border-purple-200 dark:border-purple-800/50">
              <IoMdSend />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Apply / Recruit</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Applicants seamlessly shoot over digital resumes, allowing recruiters to acquire the neighborhood's best-fit talent.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
