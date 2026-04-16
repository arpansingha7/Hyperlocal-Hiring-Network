import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Dashboard = () => {
    const { user, isAuthorized } = useContext(Context);
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            if (!isAuthorized || user?.role !== "Admin") return;
            try {
                const [statsRes, usersRes] = await Promise.all([
                    axios.get("/api/v1/admin/stats", { withCredentials: true }),
                    axios.get("/api/v1/admin/users", { withCredentials: true })
                ]);
                setStats(statsRes.data.stats);
                setUsers(usersRes.data.users);
            } catch (err) {
                toast.error("Failed to fetch admin telemetry");
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, [isAuthorized, user]);

    if (!isAuthorized || user?.role !== "Admin") {
        return <Navigate to="/" />;
    }

    if (loading) return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            />
      </div>
    );

    return (
        <div className="bg-white dark:bg-slate-900 min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
            {/* Background Aesthetics */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-16">

                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-8 h-0.5 bg-primary rounded-full" />
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">System Oversight</p>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                        Admin <span className="text-primary underline decoration-primary/20 underline-offset-8 decoration-8">Terminal</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold mt-4 uppercase tracking-widest text-xs">Platform Health & Global Telemetry</p>
                </motion.header>

                {/* Telemetry Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: "Total Users", val: stats?.totalUsers, icon: "groups", color: "text-blue-500" },
                        { label: "Employers", val: stats?.employers, icon: "storefront", color: "text-primary" },
                        { label: "Job Seekers", val: stats?.jobSeekers, icon: "engineering", color: "text-purple-500" },
                        { label: "Live Nodes", val: stats?.totalJobs, icon: "sensors", color: "text-emerald-500" }
                    ].map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card group p-10 hover:-translate-y-2 transition-all shadow-2xl flex flex-col justify-between"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center ${item.color} mb-8 shadow-inner transition-transform group-hover:rotate-12`}>
                                <span className="material-symbols-outlined text-3xl font-bold">{item.icon}</span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic mb-1">{item.val || 0}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* User Data Matrix */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-card overflow-hidden"
                >
                    <div className="p-10 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4 uppercase italic tracking-tight">
                            <span className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined font-bold">database</span>
                            </span>
                            Network Identity Matrix
                        </h3>
                        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                            {users.length} Active Profiles
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-950/30">
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Vector</th>
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identification / Contact</th>
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Protocol Role</th>
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {users.map(u => (
                                    <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="p-8 text-[10px] text-slate-400 font-mono tracking-tighter uppercase opacity-50 group-hover:opacity-100">{u._id}</td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black text-lg">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-base font-black text-slate-900 dark:text-white uppercase italic leading-none mb-2 group-hover:text-primary transition-colors">
                                                        {u.name} {u.role === "Admin" && <span className="ml-2 text-xs text-red-500 font-black tracking-widest">[ROOT]</span>}
                                                    </div>
                                                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-2">
                                                        {u.email} <span className="text-slate-300 dark:text-slate-700">|</span> {u.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8 text-center">
                                            <span className={`inline-block px-4 py-1.5 text-[8px] font-black rounded-full border shadow-sm ${u.role === 'Admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' : u.role === 'Employer' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'} uppercase tracking-[0.2em]`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-8 text-right text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Dashboard;
