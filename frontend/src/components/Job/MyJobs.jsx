import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import Loading from "../Layout/Loading";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthorized, user, isLoading } = useContext(Context);

  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "/api/v1/job/getmyjobs",
          { withCredentials: true }
        );
        setMyJobs(data.myJobs);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch jobs");
        setMyJobs([]);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading && isAuthorized && user?.role === "Employer") {
      fetchJobs();
    }
  }, [isLoading, isAuthorized, user]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthorized || (user && user.role !== "Employer")) {
      navigateTo("/");
    }
  }, [isAuthorized, user, isLoading, navigateTo]);

  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    try {
      const res = await axios.put(`/api/v1/job/update/${jobId}`, updatedJob, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setEditingMode(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const res = await axios.delete(`/api/v1/job/delete/${jobId}`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: value } : job
      )
    );
  };

  if (loading || isLoading) return <Loading />;

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <main className="max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
        >
          <div className="flex items-center gap-4 mb-2">
            <span className="h-0.5 w-12 bg-primary rounded-full" />
            <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Employer Dashboard</p>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic italic-safe">
            Your Active <span className="text-primary">Listings</span>
          </h1>
        </motion.div>

        {myJobs.length <= 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 glass-card border-dashed border-2"
          >
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">work_history</span>
            <p className="text-xl font-black text-slate-900 dark:text-white uppercase italic italic-safe tracking-tight">No active listings found</p>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">Start by posting your first opportunity.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            <AnimatePresence>
              {myJobs.map((element, index) => (
                <motion.div
                  key={element._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card overflow-hidden group border-l-8 ${element.expired ? "border-slate-300 dark:border-slate-700" : "border-primary"}`}
                >
                  <div className="p-8 sm:p-12">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                      <div className="space-y-4 w-full md:w-2/3">
                        <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block">Position Title</label>
                        <input
                          type="text"
                          disabled={editingMode !== element._id}
                          value={element.title}
                          onChange={(e) => handleInputChange(element._id, "title", e.target.value)}
                          className={`w-full text-3xl md:text-4xl font-black tracking-tighter uppercase italic italic-safe bg-transparent border-none outline-none focus:text-primary transition-colors ${editingMode === element._id ? "text-primary underline decoration-primary/20" : "text-slate-900 dark:text-white"}`}
                        />
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        {editingMode === element._id ? (
                          <>
                            <button onClick={() => handleUpdateJob(element._id)} className="h-14 w-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-110 active:scale-95 transition-all">
                              <span className="material-symbols-outlined font-black">check</span>
                            </button>
                            <button onClick={handleDisableEdit} className="h-14 w-14 bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all">
                              <span className="material-symbols-outlined font-black">close</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleEnableEdit(element._id)} className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-primary hover:text-white transition-all active:scale-95">
                              Modify Details
                            </button>
                            <button onClick={() => handleDeleteJob(element._id)} className="px-8 py-4 bg-white dark:bg-slate-800 text-red-500 border border-red-500/10 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-red-500 hover:text-white transition-all active:scale-95">
                              Retract
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Industry</label>
                        <select
                          value={element.category}
                          onChange={(e) => handleInputChange(element._id, "category", e.target.value)}
                          disabled={editingMode !== element._id}
                          className="w-full bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-xl font-bold text-sm text-slate-900 dark:text-white border border-transparent focus:border-primary outline-none appearance-none"
                        >
                          <option>Construction & Technical</option>
                          <option>Retail & Shops</option>
                          <option>Delivery & Logistics</option>
                          <option>Healthcare & Care</option>
                          <option>Security & Guarding</option>
                          <option>Salon & Beauty</option>
                          <option>Driving & Transport</option>
                          <option>Electric & Plumbing</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Location (City/Country)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            disabled={editingMode !== element._id}
                            value={element.city}
                            onChange={(e) => handleInputChange(element._id, "city", e.target.value)}
                            className="w-1/2 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-xl font-bold text-sm text-slate-900 dark:text-white border border-transparent focus:border-primary outline-none shadow-inner"
                          />
                          <input
                            type="text"
                            disabled={editingMode !== element._id}
                            value={element.country}
                            onChange={(e) => handleInputChange(element._id, "country", e.target.value)}
                            className="w-1/2 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-xl font-bold text-sm text-slate-900 dark:text-white border border-transparent focus:border-primary outline-none shadow-inner"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Monthly Salary</label>
                        <div className="flex gap-2 items-center">
                          {element.fixedSalary ? (
                            <div className="relative w-full">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-black text-xs">₹</span>
                                <input
                                type="number"
                                disabled={editingMode !== element._id}
                                value={element.fixedSalary}
                                onChange={(e) => handleInputChange(element._id, "fixedSalary", e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 pl-7 pr-3 py-3 rounded-xl font-black text-sm text-slate-900 dark:text-white border border-transparent focus:border-primary outline-none shadow-inner"
                                />
                            </div>
                          ) : (
                            <div className="flex gap-2 w-full">
                              <input
                                type="number"
                                disabled={editingMode !== element._id}
                                value={element.salaryFrom}
                                onChange={(e) => handleInputChange(element._id, "salaryFrom", e.target.value)}
                                className="w-1/2 bg-slate-50 dark:bg-slate-800/50 px-3 py-3 rounded-xl font-black text-xs text-slate-900 dark:text-white border border-transparent focus:border-primary outline-none shadow-inner"
                              />
                              <input
                                type="number"
                                disabled={editingMode !== element._id}
                                value={element.salaryTo}
                                onChange={(e) => handleInputChange(element._id, "salaryTo", e.target.value)}
                                className="w-1/2 bg-slate-50 dark:bg-slate-800/50 px-3 py-3 rounded-xl font-black text-xs text-slate-900 dark:text-white border border-transparent focus:border-primary outline-none shadow-inner"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Listing Status</label>
                        <select
                          value={element.expired}
                          onChange={(e) => handleInputChange(element._id, "expired", e.target.value === "true")}
                          disabled={editingMode !== element._id}
                          className={`w-full px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border border-transparent focus:border-primary outline-none appearance-none transition-colors ${element.expired ? "bg-slate-100 dark:bg-slate-800/50 text-slate-400" : "bg-emerald-500/10 text-emerald-500"}`}
                        >
                          <option value={false}>ACTIVE</option>
                          <option value={true}>EXPIRED</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Full Description</label>
                        <textarea
                          rows={6}
                          value={element.description}
                          disabled={editingMode !== element._id}
                          onChange={(e) => handleInputChange(element._id, "description", e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800/50 px-6 py-4 rounded-[2rem] font-medium text-sm text-slate-600 dark:text-slate-400 border border-transparent focus:border-primary outline-none shadow-inner resize-none transition-all"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Operational Zone</label>
                        <textarea
                          value={element.location}
                          rows={6}
                          disabled={editingMode !== element._id}
                          onChange={(e) => handleInputChange(element._id, "location", e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800/50 px-6 py-4 rounded-[2rem] font-medium text-sm text-slate-600 dark:text-slate-400 border border-transparent focus:border-primary outline-none shadow-inner resize-none transition-all"
                        />
                      </div>
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

export default MyJobs;
