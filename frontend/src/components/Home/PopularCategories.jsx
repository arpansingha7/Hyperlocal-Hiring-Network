import {
  MdOutlineDesignServices,
  MdOutlineWebhook,
  MdAccountBalance,
  MdOutlineAnimation,
} from "react-icons/md";
import { TbAppsFilled } from "react-icons/tb";
import { FaReact } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import { IoGameController } from "react-icons/io5";
import { motion } from "framer-motion";

const PopularCategories = () => {
  const categories = [
    {
      id: 1,
      title: "Construction & Technical",
      subTitle: "305 Local Sites",
      icon: <MdOutlineDesignServices />,
      color: "text-rose-500",
      bg: "bg-rose-100 dark:bg-rose-900/30",
    },
    {
      id: 2,
      title: "Delivery & Logistics",
      subTitle: "500 Open Roles",
      icon: <TbAppsFilled />,
      color: "text-sky-500",
      bg: "bg-sky-100 dark:bg-sky-900/30",
    },
    {
      id: 3,
      title: "Electric & Plumbing",
      subTitle: "200 Nearby Needs",
      icon: <MdOutlineWebhook />,
      color: "text-amber-500",
      bg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      id: 4,
      title: "Security Services",
      subTitle: "1000+ Locations",
      icon: <FaReact />,
      color: "text-emerald-500",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      id: 5,
      title: "Retail & Shops",
      subTitle: "150 Neighborhood Stores",
      icon: <MdAccountBalance />,
      color: "text-violet-500",
      bg: "bg-violet-100 dark:bg-violet-900/30",
    },
    {
      id: 6,
      title: "Healthcare & Care",
      subTitle: "867 Care Centers",
      icon: <GiArtificialIntelligence />,
      color: "text-fuchsia-500",
      bg: "bg-fuchsia-100 dark:bg-fuchsia-900/30",
    },
    {
      id: 7,
      title: "Driving & Transport",
      subTitle: "50 Open Routes",
      icon: <MdOutlineAnimation />,
      color: "text-orange-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      id: 8,
      title: "Salon & Beauty",
      subTitle: "80 Local Studios",
      icon: <IoGameController />,
      color: "text-teal-500",
      bg: "bg-teal-100 dark:bg-teal-900/30",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 mb-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-[10px] uppercase tracking-[0.4em]">
            Hiring Hotspots
          </div>
          <h3 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none mb-4">
             Top Job <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-orange-400 inline-block">Hubs</span>
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, i) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="glass-card p-10 flex flex-col items-center text-center group cursor-pointer border border-white/20 dark:border-white/5"
            >
              <div className={`w-20 h-20 rounded-[1.5rem] ${category.bg} ${category.color} flex items-center justify-center text-3xl mb-8 transition-transform group-hover:rotate-12 duration-500`}>
                {category.icon}
              </div>
              <div className="space-y-3">
                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{category.title}</h4>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-t border-slate-100 dark:border-slate-800 pt-4">{category.subTitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
