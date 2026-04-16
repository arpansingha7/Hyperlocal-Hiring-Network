import { FaMicrosoft, FaApple } from "react-icons/fa";
import { SiTesla } from "react-icons/si";
import { motion } from "framer-motion";

const PopularCompanies = () => {
  const companies = [
    {
      id: 1,
      title: "Microsoft",
      location: "Millennium City Centre",
      openPositions: 10,
      icon: <FaMicrosoft />,
      color: "text-blue-600",
      hoverRing: "group-hover:ring-blue-500/50"
    },
    {
      id: 2,
      title: "Tesla",
      location: "Millennium City Centre",
      openPositions: 5,
      icon: <SiTesla />,
      color: "text-slate-800 dark:text-white",
      hoverRing: "group-hover:ring-slate-500/50"
    },
    {
      id: 3,
      title: "Apple",
      location: "Millennium City Centre",
      openPositions: 20,
      icon: <FaApple />,
      color: "text-slate-900 dark:text-slate-200",
      hoverRing: "group-hover:ring-slate-400/50"
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
          <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Top Global <span className="font-outline-transparent text-blue-600">Companies</span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
            These titans of industry are actively recruiting talent in your area. Join their forces today.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {companies.map((company, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              key={company.id} 
              className={`bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-between group transition-all hover:bg-white dark:hover:bg-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-2 ring-1 ring-transparent ${company.hoverRing}`}
            >
              <div className="flex items-start justify-between mb-8">
                <div className={`text-6xl ${company.color} transition-transform group-hover:scale-110`}>
                  {company.icon}
                </div>
                <div className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">local_fire_department</span> Hot
                </div>
              </div>
              
              <div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{company.title}</h4>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-6">
                  <span className="material-symbols-outlined text-[16px]">location_on</span> {company.location}
                </p>
                <div className="w-full bg-blue-100 hover:bg-blue-600 dark:bg-blue-900/40 dark:hover:bg-blue-600 text-blue-700 hover:text-white dark:text-blue-400 outline-none flex items-center justify-center py-3 rounded-xl font-bold transition-colors cursor-pointer">
                  {company.openPositions} Open Positions
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCompanies;
