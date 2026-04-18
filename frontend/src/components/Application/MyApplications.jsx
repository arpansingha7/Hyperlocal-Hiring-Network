import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../Layout/Loading";

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      return navigateTo("/");
    }
    
    const fetchApps = async () => {
      try {
        setLoading(true);
        const endpoint = user?.role === "Employer" 
          ? "/api/v1/application/employer/getall"
          : "/api/v1/application/jobseeker/getall";
          
        const { data } = await axios.get(endpoint, { withCredentials: true });
        setApplications(data.applications);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
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

  const getStatusBadge = (status) => {
    const s = status || "Pending";
    const styles = {
        Accepted: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        Rejected: "bg-red-500/10 text-red-500 border-red-500/20",
        Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20"
    };

    const statusLabels = {
        Accepted: "Shortlisted",
        Rejected: "Try Again",
        Pending: "Reviewing"
    };
    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${styles[s] || styles.Pending}`}>
            {statusLabels[s] || s}
        </span>
    );
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <main className="max-w-5xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic italic-safe">
            My <span className="text-primary italic italic-safe">Applications</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 uppercase tracking-[0.3em] text-[10px] italic italic-safe">
            {user?.role === "Employer" ? "Manage Your Hiring Process" : "Your Local Job Journey"}
          </p>
        </motion.div>

        {applications.length <= 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 glass-card border-dashed border-2"
          >
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-600">
                <span className="material-symbols-outlined text-4xl">inbox</span>
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic italic-safe mb-2">No Applications Yet</p>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Start exploring your neighborhood and apply for roles today!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            <AnimatePresence>
              {applications.map((element, index) => (
                <motion.div
                  key={element._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card overflow-hidden group hover:border-primary/30 transition-all"
                >
                  <div className="p-8 sm:p-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                      <div className="flex items-center gap-5">
                        <div className="h-16 w-16 bg-primary dark:bg-slate-800 text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
                          {element.name.charAt(0)}
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none italic italic-safe">{element.name}</h3>
                          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{element.email}</p>
                        </div>
                      </div>
                      <div className="flex md:flex-col items-center md:items-end gap-3">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:block">Current Status</p>
                         {getStatusBadge(element.status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Communication</label>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">phone</span>
                            <span className="font-black text-slate-900 dark:text-white text-sm tracking-tight">{element.phone}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Operational Zone</label>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                            <span className="font-black text-slate-900 dark:text-white text-sm tracking-tight truncate">{element.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Professional Pitch</label>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 italic italic-safe font-medium">
                        &ldquo;{element.coverLetter}&rdquo;
                      </p>
                    </div>

                    <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap justify-end gap-4">
                      {user?.role === "Employer" ? (
                        <>
                          <button 
                            onClick={() => updateStatus(element._id, "Rejected")} 
                            className="px-8 py-4 bg-white dark:bg-slate-900 text-red-500 border border-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5"
                          >
                            Decline Entry
                          </button>
                          <button 
                            onClick={() => updateStatus(element._id, "Accepted")} 
                            className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all"
                          >
                            Approve Candidate
                          </button>
                        </>
                      ) : (
                        <button 
                            onClick={() => deleteApplication(element._id)} 
                            className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-xl"
                        >
                            Withdraw From Pipeline
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyApplications;
