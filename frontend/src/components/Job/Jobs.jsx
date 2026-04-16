import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import Loading from "../Layout/Loading";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapView, setMapView] = useState(false);
  const [radius, setRadius] = useState(10); 

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobsNearMe = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        axios
          .get(`/api/v1/job/radius/${radius}/center/${latitude},${longitude}`, {
            withCredentials: true,
          })
          .then((res) => {
            setJobs(res.data.jobs || []);
            setLoading(false);
            setMapView(true);
            toast.success(`Found ${res.data.jobs?.length || 0} jobs near you!`);
          })
          .catch((error) => {
            toast.error("Failed to fetch nearby jobs");
            setLoading(false);
          });
      },
      () => {
        toast.error("Unable to retrieve location");
        setLoading(false);
      }
    );
  };

  const fetchJobs = () => {
    setLoading(true);
    axios
      .get("/api/v1/job/getall", {
        withCredentials: true,
      })
      .then((res) => {
        setJobs(res.data.jobs || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to fetch jobs");
        setLoading(false);
      });
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <main className="max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-end mb-12"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                Discover <span className="text-primary">Opportunities</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">
                {jobs.length} roles available in your network
            </p>
          </div>
          <div className="flex gap-4">
            <button 
                onClick={fetchJobsNearMe} 
                className="group flex items-center gap-2 px-6 py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-2xl text-sm font-black transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">my_location</span> 
              <span className="hidden sm:block">Explore Near Me</span>
            </button>
            <button 
                onClick={() => setMapView(!mapView)} 
                className="flex items-center gap-2 px-6 py-3 glass hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-sm font-black text-slate-700 dark:text-slate-300 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">{mapView ? "grid_view" : "map"}</span> 
              <span className="hidden sm:block">{mapView ? "List View" : "Map View"}</span>
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
        {mapView ? (
          <motion.div 
            key="map"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full h-[650px] rounded-[2.5rem] overflow-hidden border border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900 shadow-2xl relative z-0"
          >
             <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {jobs.map(job => (
                  job.locationPoint?.coordinates?.length === 2 ? (
                    <Marker key={job._id} position={[job.locationPoint.coordinates[1], job.locationPoint.coordinates[0]]}>
                      <Popup>
                        <div className="p-2 min-w-[150px]">
                          <h4 className="font-black text-slate-900 m-0 text-sm mb-1">{job.title}</h4>
                          <p className="text-[10px] uppercase font-bold text-slate-400 m-0 mb-3 tracking-wider">{job.city}, {job.country}</p>
                          <Link to={`/job/${job._id}`} className="block w-full text-center bg-primary text-white py-2 rounded-lg text-xs font-black no-underline transition-opacity hover:opacity-90">View Role</Link>
                        </div>
                      </Popup>
                    </Marker>
                  ) : null
                ))}
             </MapContainer>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
          {jobs.length > 0 ? (
            jobs.map((element, index) => (
              <motion.div
                key={element._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-10 group"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 rounded-[1.25rem] bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6 shadow-inner">
                    <span className="material-symbols-outlined text-primary text-3xl">work</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest border border-green-500/20 mb-2">
                        {element.category}
                    </span>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        {element.city}
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                    <h3 className="font-black text-2xl text-slate-900 dark:text-white leading-tight mb-3 group-hover:text-primary transition-colors">
                      {element.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed line-clamp-3">
                      {element.description}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-800/50">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Salary</p>
                    <div className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">
                        {element.fixedSalary
                        ? `$${element.fixedSalary.toLocaleString()}`
                        : `$${element.salaryFrom.toLocaleString()} - $${element.salaryTo.toLocaleString()}`}
                    </div>
                  </div>
                  <Link
                    to={`/job/${element._id}`}
                    className="w-12 h-12 flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl transition-all group-hover:bg-primary group-hover:text-white group-hover:-translate-y-1 shadow-lg active:scale-95"
                  >
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-32 flex flex-col items-center">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">work_off</span>
              </div>
              <p className="text-slate-500 font-black uppercase tracking-widest">No roles matches your search</p>
            </div>
          )}
        </motion.div>
        )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Jobs;
