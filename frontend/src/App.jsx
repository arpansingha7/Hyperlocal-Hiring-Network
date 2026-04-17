import React, { useContext, useEffect, lazy, Suspense } from "react";
import "./i18n";
import { Context } from "./main";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import axios from "axios";

// Layout Components (Synchronous as they are part of the core shell)
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Notifications from "./components/Notifications";
import ScrollToTop from "./components/Layout/ScrollToTop";
import Loading from "./components/Layout/Loading";

// Lazy Loaded Page Components
const Home = lazy(() => import("./components/Home/Home"));
const Login = lazy(() => import("./components/Auth/Login"));
const Register = lazy(() => import("./components/Auth/Register"));
const Jobs = lazy(() => import("./components/Job/Jobs"));
const JobDetails = lazy(() => import("./components/Job/JobDetails"));
const Application = lazy(() => import("./components/Application/Application"));
const MyApplications = lazy(() => import("./components/Application/MyApplications"));
const PostJob = lazy(() => import("./components/Job/PostJob"));
const MyJobs = lazy(() => import("./components/Job/MyJobs"));
const Dashboard = lazy(() => import("./components/Admin/Dashboard"));
const Terms = lazy(() => import("./components/Legal/Terms"));
const Privacy = lazy(() => import("./components/Legal/Privacy"));
const NotFound = lazy(() => import("./components/NotFound/NotFound"));

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loading />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/terms" element={<PageWrapper><Terms /></PageWrapper>} />
          <Route path="/privacy" element={<PageWrapper><Privacy /></PageWrapper>} />
          <Route path="/job/getall" element={<PageWrapper><Jobs /></PageWrapper>} />
          <Route path="/job/:id" element={<PageWrapper><JobDetails /></PageWrapper>} />
          <Route path="/application/:id" element={<PageWrapper><Application /></PageWrapper>} />
          <Route path="/applications/me" element={<PageWrapper><MyApplications /></PageWrapper>} />
          <Route path="/job/post" element={<PageWrapper><PostJob /></PageWrapper>} />
          <Route path="/job/me" element={<PageWrapper><MyJobs /></PageWrapper>} />
          <Route path="/admin" element={<PageWrapper><Dashboard /></PageWrapper>} />
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

import ErrorBoundary from "./components/Layout/ErrorBoundary";

const App = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/v1/user/getuser", { withCredentials: true });
        if (isMounted) {
          if (response.data.success && response.data.user) {
            setUser(response.data.user);
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            setUser({});
          }
        }
      } catch (error) {
        if (isMounted) {
          setIsAuthorized(false);
          setUser({});
        }
      }
    };
    
    // Only fetch if we aren't already authorized or if it's the first mount
    if (!isAuthorized) {
        fetchUser();
    }
    
    return () => { isMounted = false; };
  }, [isAuthorized, setIsAuthorized, setUser]);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Navbar />
        <AnimatedRoutes />
        <Footer />
        <Toaster position="top-center" reverseOrder={false} />
        <Notifications />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;

