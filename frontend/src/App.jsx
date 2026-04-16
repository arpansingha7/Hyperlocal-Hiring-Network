import React, { useContext, useEffect } from "react";
import "./i18n";
import { Context } from "./main";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import NotFound from "./components/NotFound/NotFound";
import MyJobs from "./components/Job/MyJobs";
import Notifications from "./components/Notifications";
import Dashboard from "./components/Admin/Dashboard";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/job/getall" element={<PageWrapper><Jobs /></PageWrapper>} />
        <Route path="/job/:id" element={<PageWrapper><JobDetails /></PageWrapper>} />
        <Route path="/application/:id" element={<PageWrapper><Application /></PageWrapper>} />
        <Route path="/applications/me" element={<PageWrapper><MyApplications /></PageWrapper>} />
        <Route path="/job/post" element={<PageWrapper><PostJob /></PageWrapper>} />
        <Route path="/job/me" element={<PageWrapper><MyJobs /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const App = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "/api/v1/user/getuser",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, [isAuthorized]);

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <AnimatedRoutes />
        <Footer />
        <Toaster />
        <Notifications />
      </BrowserRouter>
    </>
  );
};

export default App;
