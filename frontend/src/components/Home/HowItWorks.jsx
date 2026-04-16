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
            className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 uppercase italic tracking-tighter"
          >
             How <span className="text-primary italic">HHN</span> Works
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto text-lg leading-relaxed"
          >
            A high-velocity pipeline designed to eliminate geography-based hiring friction.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card p-12 relative group flex flex-col items-center text-center"
            >
              <div className="absolute top-0 right-10 -translate-y-1/2 text-9xl font-black text-slate-50 dark:text-white/5 pointer-events-none group-hover:text-primary/10 transition-colors">
                0{step.id}
              </div>
              
              <div className={`w-24 h-24 rounded-[2rem] ${step.color} flex items-center justify-center text-5xl mb-10 shadow-2xl transition-transform group-hover:rotate-12 duration-500`}>
                {step.icon}
              </div>
              
              <div className="space-y-4">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.35em]">{step.subTitle}</p>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{step.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              <motion.div 
                className="mt-10 w-12 h-1 bg-primary/20 rounded-full overflow-hidden"
              >
                <motion.div 
                   className="h-full bg-primary w-0"
                   whileInView={{ w: "100%" }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.5, duration: 1 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
