import React, { useEffect, useContext, useState } from "react";
import { io } from "socket.io-client";
import { Context } from "../main";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

let socket;

const Notifications = () => {
    const { isAuthorized, user } = useContext(Context);
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (isAuthorized && user && user._id) {
            const isDevelopment = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
            const rawUrl = import.meta.env.VITE_API_BASE_URL || (isDevelopment ? "http://localhost:4000" : `${window.location.origin}/_/backend`);
            const socketUrl = rawUrl ? rawUrl.replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "") : "";
            socket = io(socketUrl, {
                withCredentials: true,
            });

            socket.on("connect", () => {
                socket.emit("join", user._id.toString());
            });

            socket.on("new_application", (data) => {
                toast.custom((t) => (
                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full glass-card p-0 overflow-hidden pointer-events-auto flex shadow-2xl ring-1 ring-primary/20`}>
                        <div className="flex-1 w-0 p-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined font-black">work_history</span>
                                    </div>
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">System Message</p>
                                    <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400 italic italic-safe">"{data.message}"</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-l border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="w-full border border-transparent rounded-none p-6 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                ), { duration: 5000 });

                setNotifications((prev) => [{ id: Date.now(), text: data.message, time: new Date() }, ...prev]);
                setUnreadCount((c) => c + 1);
            });

            socket.on("application_status_update", (data) => {
                toast.custom((t) => (
                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full glass-card p-0 overflow-hidden pointer-events-auto flex shadow-2xl ring-1 ring-primary/20`}>
                        <div className="flex-1 w-0 p-6">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <span className="material-symbols-outlined font-black">check_circle</span>
                                    </div>
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Status Update</p>
                                    <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400 italic italic-safe">"{data.message}"</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex border-l border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="w-full border border-transparent rounded-none p-6 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                ), { duration: 5000 });

                setNotifications((prev) => [{ id: Date.now(), text: data.message, time: new Date() }, ...prev]);
                setUnreadCount((c) => c + 1);
            });

            return () => {
                socket.disconnect();
            };
        }
    }, [isAuthorized, user]);

    if (!isAuthorized) return null;

    return (
        <>
            <div className="fixed bottom-10 right-10 z-50">
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setIsOpen(!isOpen); setUnreadCount(0); }}
                    className="bg-primary text-white w-16 h-16 rounded-[1.5rem] shadow-2xl shadow-primary/40 flex items-center justify-center relative transition-colors"
                >
                    <span className="material-symbols-outlined text-3xl font-bold">notifications_none</span>
                    {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black min-w-[24px] h-6 rounded-full flex items-center justify-center px-1.5 shadow-lg border-2 border-white dark:border-slate-900">
                            {unreadCount}
                        </span>
                    )}
                </motion.button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="absolute bottom-24 right-0 w-80 md:w-[400px] glass-card overflow-hidden z-50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]"
                        >
                            <div className="p-8 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                                <h3 className="font-black text-slate-900 dark:text-white uppercase italic italic-safe tracking-tighter flex items-center gap-3">
                                    <span className="w-8 h-0.5 bg-primary rounded-full" />
                                    Activity Alerts
                                </h3>
                                {notifications.length > 0 && (
                                    <button 
                                        onClick={() => setNotifications([])} 
                                        className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                                    >
                                        Clear All Alerts
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-16 text-center flex flex-col items-center gap-6 opacity-40">
                                        <span className="material-symbols-outlined text-6xl">cloud_done</span>
                                        <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-500 italic italic-safe">All Caught Up</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                        {notifications.map(n => (
                                            <div key={n.id} className="p-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                                <p className="text-sm text-slate-700 dark:text-slate-300 font-bold leading-relaxed italic italic-safe group-hover:text-primary transition-colors">
                                                    "{n.text}"
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-4 font-black uppercase tracking-widest opacity-60">
                                                    Received {n.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default Notifications;
