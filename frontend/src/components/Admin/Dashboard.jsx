import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie
} from "recharts";

const COLORS = ["#EF6C00", "#3B82F6", "#8B5CF6", "#10B981", "#F43F5E"];

const Dashboard = () => {
    const { user, isAuthorized } = useContext(Context);
    const [activeTab, setActiveTab] = useState("insights");
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchStats = async () => {
        try {
            const { data } = await axios.get("/api/v1/admin/stats", { withCredentials: true });
            setStats(data.stats);
        } catch (err) {
            toast.error("Failed to fetch telemetry");
        }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get("/api/v1/admin/users", { withCredentials: true });
            setUsers(data.users);
        } catch (err) {
            toast.error("Failed to load user matrix");
        }
    };

    const fetchJobs = async () => {
        try {
            const { data } = await axios.get("/api/v1/admin/jobs", { withCredentials: true });
            setJobs(data.jobs);
        } catch (err) {
            toast.error("Failed to load nodes");
        }
    };

    useEffect(() => {
        if (isAuthorized && user?.role === "Admin") {
            const init = async () => {
                setLoading(true);
                await Promise.all([fetchStats(), fetchUsers(), fetchJobs()]);
                setLoading(false);
            };
            init();
        }
    }, [isAuthorized, user]);

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const { data } = await axios.put(`/api/v1/admin/user/status/${id}`, {}, { withCredentials: true });
            toast.success(data.message);
            setUsers(users.map(u => u._id === id ? { ...u, isAccountActive: !currentStatus } : u));
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm("Are you sure you want to moderate this job? It will be permanently removed.")) return;
        try {
            const { data } = await axios.delete(`/api/v1/admin/job/${id}`, { withCredentials: true });
            toast.success(data.message);
            setJobs(jobs.filter(j => j._id !== id));
            fetchStats();
        } catch (error) {
            toast.error("Failed to delete job");
        }
    };

    if (!isAuthorized || user?.role !== "Admin") return <Navigate to="/" />;
    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full" /></div>;

    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="bg-slate-50 dark:bg-[#0a0f1c] min-h-screen pt-28 pb-20 px-4 sm:px-8 relative overflow-hidden text-slate-900 dark:text-white">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-12 h-0.5 bg-primary rounded-full" />
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Nexus Core Administration</p>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                                Admin <span className="text-primary italic">Terminal.</span>
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 font-bold mt-4 uppercase tracking-[0.2em] text-[10px]">Managing Decentralized Neighborhood Logistics</p>
                        </div>
                        <div className="flex bg-slate-900/10 dark:bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 self-start">
                            {["insights", "users", "jobs"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        activeTab === tab ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-primary"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === "insights" && (
                        <motion.div
                            key="insights"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-10"
                        >
                            {/* Top Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    { label: "Total Hires", val: stats?.hires, icon: "verified" },
                                    { label: "Active Nodes", val: stats?.activeJobs, icon: "radar" },
                                    { label: "Live Population", val: stats?.totalUsers, icon: "hub" },
                                    { label: "Applications", val: stats?.totalApplications, icon: "description" },
                                ].map((s, i) => (
                                    <div key={i} className="glass-card !bg-white/60 dark:!bg-slate-900/60 p-8 flex flex-col justify-between border-slate-100 dark:border-white/5">
                                        <span className="material-symbols-outlined text-primary mb-6 text-3xl">{s.icon}</span>
                                        <div>
                                            <h4 className="text-4xl font-black italic tracking-tighter leading-none mb-1">{s.val || 0}</h4>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
                                {/* Chart 1: Growth */}
                                <div className="glass-card p-10 !bg-white/40 dark:!bg-slate-900/40">
                                    <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-10 text-slate-400">Network Growth Trend</h3>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={stats?.userGrowth || []}>
                                                <defs>
                                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#EF6C00" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="#EF6C00" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#8884d820" />
                                                <XAxis dataKey="_id" tick={{fontSize: 10, fill: '#888'}} axisLine={false} tickLine={false} />
                                                <YAxis hide />
                                                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px'}} />
                                                <Area type="monotone" dataKey="count" stroke="#EF6C00" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Chart 2: Categories */}
                                <div className="glass-card p-10 !bg-white/40 dark:!bg-slate-900/40">
                                    <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-10 text-slate-400">Node Category Distribution</h3>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={stats?.categoryDistribution || []}>
                                                <XAxis dataKey="_id" tick={{fontSize: 8, fill: '#888'}} axisLine={false} tickLine={false} />
                                                <YAxis hide />
                                                <Tooltip cursor={{fill: '#8881'}} contentStyle={{backgroundColor: '#0f172a', border: 'none'}} />
                                                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                                                    {stats?.categoryDistribution?.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "users" && (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="glass-card overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <h3 className="text-xl font-black uppercase italic tracking-tight">Identity Matrix</h3>
                                <div className="relative max-w-md w-full">
                                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 italic">search</span>
                                    <input 
                                        type="text" 
                                        placeholder="Search by name or email..." 
                                        className="w-full bg-slate-900/10 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-bold outline-none focus:border-primary transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto lg:p-4">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="p-6 text-[8px] font-black text-slate-400 uppercase tracking-widest">Profile</th>
                                            <th className="p-6 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                            <th className="p-6 text-[8px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                        {filteredUsers.map(u => (
                                            <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white ${u.role === 'Admin' ? 'bg-rose-500' : u.role === 'Employer' ? 'bg-primary' : 'bg-blue-500 shadow-xl shadow-blue-500/10'}`}>
                                                            {u.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black uppercase italic italic-safe group-hover:text-primary transition-colors flex items-center gap-2">
                                                                {u.name}
                                                                {u.isVerified && <span className="material-symbols-outlined text-blue-500 text-sm">verified</span>}
                                                            </div>
                                                            <div className="text-[10px] font-bold text-slate-500">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full ${u.isAccountActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                        {u.isAccountActive ? 'Active' : 'Suspended'}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-right">
                                                    {u.role !== 'Admin' && (
                                                        <button 
                                                            onClick={() => handleToggleStatus(u._id, u.isAccountActive)}
                                                            className={`px-6 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${u.isAccountActive ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
                                                        >
                                                            {u.isAccountActive ? 'Suspend' : 'Activate'}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "jobs" && (
                        <motion.div
                            key="jobs"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {jobs.map(j => (
                                <div key={j._id} className="glass-card p-8 group border-slate-100 dark:border-white/5">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined">work</span>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteJob(j._id)}
                                            className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/10"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                    <h3 className="text-xl font-black uppercase italic italic-safe mb-2 group-hover:text-primary transition-colors">{j.title}</h3>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-6">{j.city} / {j.category}</p>
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                                        <div className="text-[10px] font-bold text-slate-500">Node ID: {j._id.substring(18)}</div>
                                        <div className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full ${j.expired ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                            {j.expired ? 'Expired' : 'Active Channel'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Dashboard;
