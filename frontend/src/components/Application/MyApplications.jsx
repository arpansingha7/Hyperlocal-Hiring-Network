import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      return navigateTo("/");
    }
    
    const fetchApps = async () => {
      try {
        const endpoint = user?.role === "Employer" 
          ? "/api/v1/application/employer/getall"
          : "/api/v1/application/jobseeker/getall";
          
        const { data } = await axios.get(endpoint, { withCredentials: true });
        setApplications(data.applications);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch applications");
      }
    };
    
    fetchApps();
  }, [isAuthorized, user, navigateTo]);

  const deleteApplication = async (id) => {
    try {
      const { data } = await axios.delete(`/api/v1/application/delete/${id}`, {
        withCredentials: true,
      });
      toast.success(data.message);
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const { data } = await axios.put(`/api/v1/application/status/${id}`, { status }, {
        withCredentials: true,
      });
      toast.success(data.message);
      setApplications((prev) => prev.map((app) => app._id === id ? { ...app, status } : app));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring" } }
  };

  const getStatusBadge = (status) => {
    const s = status || "Pending";
    if (s === "Accepted") return <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest animate-pulse border border-emerald-200 dark:border-emerald-800">Accepted</span>;
    if (s === "Rejected") return <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-red-200 dark:border-red-800">Rejected</span>;
    return <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-amber-200 dark:border-amber-800">Pending</span>;
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
            {user?.role === "Employer" ? "Application Pipeline" : "My Applications"}
          </h1>
          <p className="text-slate-500 font-medium">Review and manage your hiring operations</p>
        </div>

        {applications.length <= 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700">inventory_2</span>
            <p className="mt-4 text-slate-500 font-medium">No applications found in the pipeline.</p>
          </div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
            <AnimatePresence>
              {applications.map((element) => (
                <motion.div
                  variants={itemVariants}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                  layout
                  key={element._id}
                  className="bg-white dark:bg-slate-900 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none"
                >
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black border border-primary/20">
                        {element.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{element.name}</p>
                        <p className="text-xs text-slate-500">{element.email}</p>
                      </div>
                    </div>
                    <div>{getStatusBadge(element.status)}</div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Phone</p>
                        <p className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-slate-400">call</span> {element.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Address</p>
                        <p className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span> {element.address}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Cover Letter</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">{element.coverLetter}</p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                      {user?.role === "Employer" ? (
                        <>
                          <button onClick={() => updateStatus(element._id, "Rejected")} className="px-5 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl transition-all border border-red-200 dark:border-red-800/50">
                            Reject
                          </button>
                          <button onClick={() => updateStatus(element._id, "Accepted")} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/25">
                            Accept Candidate
                          </button>
                        </>
                      ) : (
                        <button onClick={() => deleteApplication(element._id)} className="px-5 py-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800/50 text-sm font-bold rounded-xl transition-all">
                          Withdraw Application
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
