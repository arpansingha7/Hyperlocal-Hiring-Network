import { FaMicrosoft, FaApple } from "react-icons/fa";
import { SiTesla } from "react-icons/si";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PopularCompanies = () => {
  const companies = [
    {
      id: 1,
      title: "Tata Group",
      location: "Gurugram / Mumbai",
      openPositions: "100+",
      icon: <FaMicrosoft />,
      color: "text-blue-600",
      hoverRing: "group-hover:ring-blue-500/50"
    },
    {
      id: 2,
      title: "Reliance Retail",
      location: "Delhi NCR / Pan India",
      openPositions: "500+",
      icon: <SiTesla />,
      color: "text-emerald-600",
      hoverRing: "group-hover:ring-emerald-500/50"
    },
    {
      id: 3,
      title: "Swiggy / Zomato",
      location: "Active Everywhere",
      openPositions: "Limited Slots",
      icon: <FaApple />,
      color: "text-orange-600",
      hoverRing: "group-hover:ring-orange-500/50"
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none mb-6">
            Elite Hiring <span className="text-primary italic px-2 inline-block">Allies</span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-black uppercase tracking-[0.4em] text-[10px]">
            Direct pipelines to neighborhood powerhouses.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {companies.map((company, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              key={company.id} 
              className="glass-card-premium !p-10 group"
            >
              <div className="flex items-start justify-between mb-10">
                <div className={`w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-4xl ${company.color} transition-transform group-hover:rotate-12`}>
                  {company.icon}
                </div>
                <div className="badge-desi flex items-center gap-1.5 border-primary/30">
                  <span className="material-symbols-outlined text-[10px] animate-pulse">local_fire_department</span> Hot
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-2 uppercase italic tracking-tight">{company.title}</h4>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 flex items-center gap-2 uppercase tracking-widest border-t border-slate-100 dark:border-slate-800/50 pt-4">
                    <span className="material-symbols-outlined text-sm">location_on</span> {company.location}
                  </p>
                </div>
                
                <Link to="/job/getall" className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-primary group-hover:shadow-2xl shadow-primary/20 active:scale-95">
                  {company.openPositions} Opportunities
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCompanies;
