import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../Layout/Loading";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [distanceKm, setDistanceKm] = useState(null);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
        setLoading(false);
      })
      .catch((error) => {
        navigateTo("/notfound");
      });
  }, [id, navigateTo]);

  useEffect(() => {
    if (job.postedBy) {
      const employerId = typeof job.postedBy === 'object' ? job.postedBy._id : job.postedBy;
      axios.get(`/api/v1/review/${employerId}`, { withCredentials: true })
        .then(res => setReviews(res.data.reviews || []))
        .catch(err => console.error(err));
    }

    if (job.locationPoint?.coordinates?.length === 2 && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;
          const jobLng = job.locationPoint.coordinates[0];
          const jobLat = job.locationPoint.coordinates[1];
          const dist = calculateDistance(userLat, userLng, jobLat, jobLng);
          setDistanceKm(dist.toFixed(1));
        },
        () => {} // silently handle denial
      );
    }
  }, [job]);

  const handlePostReview = async (e) => {
    e.preventDefault();
    try {
      const employerId = typeof job.postedBy === 'object' ? job.postedBy._id : job.postedBy;
      const { data } = await axios.post("/api/v1/review/post", {
        revieweeId: employerId,
        jobId: job._id,
        rating,
        comment
      }, { withCredentials: true });
      toast.success(data.message);
      
      setReviews([...reviews, { ...data.review, reviewerId: { _id: user._id, name: user.name, role: user.role } }]);
      setComment("");
      setRating(5);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post review");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <main className="max-w-5xl mx-auto space-y-12">
        {/* Job Header Card */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-10 sm:p-14 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-[80px] -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                        {job.category}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-widest">
                        Posted {new Date(job.jobPostedOn).toLocaleDateString()}
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight italic-safe">
                    {job.title}
                </h1>
                <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {job.city}, {job.country}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Salary</p>
                <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                   {job.fixedSalary ? `₹${job.fixedSalary.toLocaleString()}` : `₹${job.salaryFrom?.toLocaleString()} - ₹${job.salaryTo?.toLocaleString()}`}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {distanceKm && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-blue-500/10 border border-blue-500/20 backdrop-blur-md p-6 rounded-3xl flex items-center justify-between shadow-2xl shadow-blue-500/10 mb-12"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <span className="material-symbols-outlined text-white text-2xl">near_me</span>
                    </div>
                    <div>
                        <h4 className="text-blue-900 dark:text-blue-100 font-black text-xl italic italic-safe tracking-tight">Hyperlocal Match Found!</h4>
                        <p className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest opacity-80">Only {distanceKm} km from your door</p>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Estimated Commute</p>
                    <p className="text-blue-900 dark:text-blue-100 font-black">~ {Math.round(distanceKm * 2)} Mins Drive</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Detailed Description</h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-bold leading-relaxed whitespace-pre-line">
                    {job.description}
                </p>
              </div>

              <div className="pt-10 border-t border-slate-100 dark:border-slate-800/50">
                {isAuthorized && user?.role !== "Employer" ? (
                  <Link to={`/application/${job._id}`} className="inline-flex items-center gap-3 bg-primary text-white font-black py-5 px-12 rounded-[2rem] text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all">
                    Apply for this role <span className="material-symbols-outlined text-xl">arrow_right_alt</span>
                  </Link>
                ) : !isAuthorized ? (
                  <Link to="/login" className="inline-flex items-center gap-3 bg-primary text-white font-black py-5 px-12 rounded-[2rem] text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all">
                    Login to Apply <span className="material-symbols-outlined text-xl">login</span>
                  </Link>
                ) : (
                    <div className="inline-flex items-center gap-3 bg-slate-100 dark:bg-slate-800 text-slate-400 font-black py-5 px-12 rounded-[2rem] text-sm uppercase tracking-widest cursor-not-allowed">
                        Employer Perspective
                    </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Employer Reviews Card */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-10 sm:p-14"
        >
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3 uppercase italic italic-safe">
                <span className="w-8 h-1 bg-primary rounded-full" />
                Employer Trust & Ratings
            </h3>
            <div className="text-yellow-400 flex items-center gap-1">
                <span className="material-symbols-outlined filled text-3xl">star</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                   {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0"}
                </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {reviews.length > 0 ? reviews.map((rev, index) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                key={rev._id} 
                className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center font-black text-primary text-xs">
                                {rev.reviewerId?.name?.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-slate-900 dark:text-white">{rev.reviewerId?.name}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic italic-safe">{rev.reviewerId?.role}</span>
                            </div>
                        </div>
                        <div className="flex items-center text-yellow-400 gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={`material-symbols-outlined text-sm ${i < rev.rating ? 'filled' : ''}`}>star</span>
                            ))}
                        </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-bold leading-relaxed">"{rev.comment}"</p>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-10 text-center opacity-50">
                <p className="text-slate-500 font-bold italic italic-safe text-sm">No reviews for this employer yet. Be the first!</p>
              </div>
            )}
          </div>

          {isAuthorized && user?.role !== "Employer" && (
            <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800/50 space-y-8">
              <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Leave your feedback</h4>
              <form onSubmit={handlePostReview} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Service Rating</label>
                  <select
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 font-black text-xs uppercase tracking-widest focus:border-primary outline-none transition-all cursor-pointer shadow-inner"
                  >
                    <option value={5}>5 - Exceptional Service</option>
                    <option value={4}>4 - Professional</option>
                    <option value={3}>3 - Satisfactory</option>
                    <option value={2}>2 - Poor Experience</option>
                    <option value={1}>1 - Unreliable</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-4">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Detailed Comment</label>
                        <input
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="How was your experience?"
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 font-bold focus:border-primary outline-none transition-all shadow-inner"
                            required
                        />
                    </div>
                    <button type="submit" className="px-8 py-4 mt-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-primary hover:text-white transition-all">
                        Post
                    </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default JobDetails;
