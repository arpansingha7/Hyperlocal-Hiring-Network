import React, { useContext, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useScroll } from "framer-motion";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { t, i18n } = useTranslation();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    return scrollY.onChange((latest) => {
        setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/v1/user/logout", { withCredentials: true });
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { name: t("Home"), path: "/" },
    { name: t("All Jobs"), path: "/job/getall" },
  ];

  if (isAuthorized) {
    navLinks.push({ 
      name: user?.role === "Employer" ? t("Applicant's Applications") : t("My Applications"), 
      path: "/applications/me" 
    });
    if (user?.role === "Employer") {
      navLinks.push({ name: t("Post New Job"), path: "/job/post" });
      navLinks.push({ name: t("View Your Jobs"), path: "/job/me" });
    }
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 py-4 ${
        isScrolled 
        ? "px-4 sm:px-6 lg:px-8" 
        : "px-0"
      }`}
    >
      <div 
        className={`mx-auto flex h-20 max-w-7xl items-center justify-between px-8 transition-all duration-500 ${
          isScrolled 
          ? "glass rounded-[2rem] shadow-2xl shadow-primary/5 border border-white/20 dark:border-white/10" 
          : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95">
            <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 transition-transform group-hover:rotate-12">
              <span className="material-symbols-outlined text-white text-2xl font-bold">work</span>
            </div>
            <h2 className="text-xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white hidden sm:block">
              Hyperlocal <span className="text-primary italic">Hiring</span> (HHN)
            </h2>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors relative group py-2"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
            {['en', 'hi', 'gu'].map((lng) => (
              <button
                key={lng}
                onClick={() => changeLanguage(lng)}
                className={`px-4 py-2 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${
                  i18n.language === lng 
                  ? 'bg-white dark:bg-slate-700 shadow-xl text-primary scale-105' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {lng}
              </button>
            ))}
          </div>

          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-primary transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-[22px]">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {!isAuthorized ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden sm:block text-sm font-black text-slate-700 dark:text-slate-300 hover:text-primary px-4 py-2">
                {t("Login")}
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-black hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5"
              >
                {t("Sign Up")}
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end mr-1">
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase leading-none mb-1">{user?.name}</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-10 h-10 flex lg:w-auto lg:h-auto items-center justify-center lg:px-4 lg:py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all font-black text-xs uppercase"
              >
                <span className="material-symbols-outlined lg:hidden">logout</span>
                <span className="hidden lg:block">{t("Logout")}</span>
              </button>
            </div>
          )}

          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 transition-all active:scale-90"
            onClick={() => setShow(!show)}
          >
            <span className="material-symbols-outlined text-2xl">{show ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div 
        className="h-1 bg-primary origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-20 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-[55]"
          >
            <div className="p-6 flex flex-col gap-2">
               {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setShow(false)}
                  className="p-4 rounded-xl text-sm font-black text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors uppercase tracking-widest"
                >
                  {link.name}
                </Link>
              ))}
              {!isAuthorized && (
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    to="/login"
                    onClick={() => setShow(false)}
                    className="flex items-center justify-center p-4 rounded-xl text-sm font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 uppercase tracking-widest"
                  >
                    {t("Login")}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setShow(false)}
                    className="flex items-center justify-center p-4 rounded-xl text-sm font-black text-white bg-primary uppercase tracking-widest"
                  >
                    {t("Sign Up")}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
