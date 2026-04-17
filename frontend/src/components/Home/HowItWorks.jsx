import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Create Profile",
      subTitle: "Simple Sign-up",
      description: "Sign up and create your worker profile with your location to see all available jobs near your home.",
      icon: <FaUserPlus />,
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      id: 2,
      title: "Find Local Jobs",
      subTitle: "Nearby Discovery",
      description: "Find local work on our interactive map or post a new vacancy in your area with accurate GPS location.",
      icon: <MdFindInPage />,
      color: "bg-primary/10 text-primary",
    },
    {
      id: 3,
      title: "Start Working",
      subTitle: "Fast Contact",
      description: "Apply for jobs instantly and contact local business owners directly through our secure hiring system.",
      icon: <IoMdSend />,
      color: "bg-emerald-500/10 text-emerald-500",
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden bg-white dark:bg-slate-900">
      {/* Decorative BG */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]"
          >
            Operational Workflow
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 uppercase italic italic-safe tracking-tighter leading-none"
          >
             How <span className="text-primary italic italic-safe inline-block">HHN</span> Works
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]"
          >
            Efficiency at the speed of Neighborhood.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((element, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              key={element.id}
              className="glass-card p-10 flex flex-col items-center text-center group"
            >
              <div className={`w-20 h-20 rounded-[1.5rem] ${element.color} flex items-center justify-center text-3xl shadow-2xl mb-10 transition-transform group-hover:rotate-12 group-hover:scale-110`}>
                {element.icon}
              </div>
              <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">{element.subTitle}</p>
              <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-6 uppercase italic italic-safe tracking-tight">{element.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-6">
                {element.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
