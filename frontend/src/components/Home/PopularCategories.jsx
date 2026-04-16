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
          <div className="inline-block px-4 py-1 mb-4 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-widest">
            Local Job Markets
          </div>
          <h3 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
            Popular Job <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Categories</span>
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              key={category.id} 
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className={`w-14 h-14 ${category.bg} ${category.color} rounded-2xl flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                {category.title}
              </p>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {category.subTitle}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
