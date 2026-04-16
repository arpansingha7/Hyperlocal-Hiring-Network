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
    <div className="bg-white dark:bg-slate-900 min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <main className="max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16"
        >
          <div>
            <div className="flex items-center gap-4 mb-2">
                <span className="h-0.5 w-12 bg-primary rounded-full" />
                <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Marketplace Discovery</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                Active <span className="text-primary">Opportunities</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
                onClick={fetchJobsNearMe} 
                className="group flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-lg transition-transform group-hover:scale-110">my_location</span> 
              Explore Near Me
            </button>
            <button 
                onClick={() => setMapView(!mapView)} 
                className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">{mapView ? "grid_view" : "map"}</span> 
              {mapView ? "List View" : "Map View"}
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
        {mapView ? (
          <motion.div 
            key="map"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="w-full h-[700px] rounded-[3rem] overflow-hidden border border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900 shadow-2xl relative z-0"
          >
             <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {jobs.map(job => (
                  job.locationPoint?.coordinates?.length === 2 ? (
                    <Marker key={job._id} position={[job.locationPoint.coordinates[1], job.locationPoint.coordinates[0]]}>
                      <Popup>
                        <div className="p-4 min-w-[200px] text-center">
                          <h4 className="font-black text-slate-900 m-0 text-sm mb-1 uppercase italic tracking-tight">{job.title}</h4>
                          <p className="text-[10px] uppercase font-black text-primary m-0 mb-4 tracking-widest">{job.city}</p>
                          <Link to={`/job/${job._id}`} className="block w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest no-underline transition-all hover:bg-primary">Explore Role</Link>
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
          {jobs.length > 0 ? (
            jobs.map((element, index) => (
              <motion.div
                key={element._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card group p-10 flex flex-col justify-between"
              >
                <div>
                    <div className="flex items-start justify-between mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center transition-all group-hover:rotate-12 group-hover:scale-110 shadow-inner">
                        <span className="material-symbols-outlined text-primary text-3xl font-bold">work</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="px-4 py-1.5 rounded-full bg-primary text-white text-[8px] font-black uppercase tracking-[0.2em] mb-3">
                            {element.category}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            <p className="text-[10px] font-bold uppercase tracking-widest">
                                {element.city}
                            </p>
                        </div>
                    </div>
                    </div>

                    <div className="mb-10">
                        <h3 className="font-black text-2xl lg:text-3xl text-slate-900 dark:text-white leading-[1.1] mb-4 group-hover:text-primary transition-colors uppercase italic tracking-tighter">
                        {element.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed line-clamp-3">
                        {element.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-10 border-t border-slate-100 dark:border-slate-800/50">
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Compensation</p>
                    <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                        {element.fixedSalary
                        ? `$${element.fixedSalary.toLocaleString()}`
                        : `$${element.salaryFrom.toLocaleString()} - $${element.salaryTo.toLocaleString()}`}
                    </div>
                  </div>
                  <Link
                    to={`/job/${element._id}`}
                    className="w-14 h-14 flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl transition-all group-hover:bg-primary group-hover:text-white group-hover:-translate-y-2 shadow-xl active:scale-95"
                  >
                    <span className="material-symbols-outlined font-black">arrow_forward</span>
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-40 flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8"
              >
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">travel_explore</span>
              </motion.div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight mb-2">No roles found</h4>
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Adjust your filters or check back later</p>
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
