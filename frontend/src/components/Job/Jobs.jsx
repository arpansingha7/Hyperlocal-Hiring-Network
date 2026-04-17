import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

// Helper to fix Leaflet map size issues
function MapRefresher() {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => { map.invalidateSize(); }, 100);
    }, [map]);
    return null;
}

// Helper to center map dynamically
function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapView, setMapView] = useState(false);
  const [radius, setRadius] = useState(10); 
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState(null); // [lat, lng]

  useEffect(() => {
    fetchJobs();
  }, []);

  // Re-fetch if radius changes while we have a pinned location
  useEffect(() => {
    if (userLocation) {
        fetchJobsNearMe(true);
    }
  }, [radius]);

  const fetchJobsNearMe = (silent = false) => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    if (!silent) setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        
        axios
          .get(`/api/v1/job/radius/${radius}/center/${latitude},${longitude}`, {
            withCredentials: true,
          })
          .then((res) => {
            setJobs(res.data.jobs || []);
            setLoading(false);
            setIsLocating(false);
            setMapView(true);
            if (!silent) toast.success(`Found ${res.data.jobs?.length || 0} jobs near you!`);
          })
          .catch((error) => {
            toast.error("Failed to fetch nearby jobs");
            setLoading(false);
            setIsLocating(false);
          });
      },
      () => {
        toast.error("Unable to retrieve location");
        setLoading(false);
        setIsLocating(false);
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
        toast.error("Failed to fetch jobs");
        setLoading(false);
      });
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <Helmet>
        <title>HHN | Explore Neighborhood Opportunities</title>
        <meta name="description" content="Find the best local jobs in your area. Hyperlocal precision for and localized growth." />
      </Helmet>
      <main className="max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 lg:mb-16"
        >
          <div className="w-full lg:w-auto text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                <span className="h-0.5 w-16 bg-primary rounded-full" />
                <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Marketplace Discovery</p>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic italic-safe leading-none">
                Active <span className="text-primary italic italic-safe">Vacancies</span>
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-end gap-3 sm:gap-4 w-full lg:w-auto">
            {/* Radius Selector */}
            <div className="flex items-center justify-between sm:justify-start gap-3 bg-slate-50 dark:bg-slate-800/50 p-1.5 pl-5 rounded-[2rem] border border-slate-100 dark:border-white/5 w-full sm:w-auto shrink-0">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest min-w-max">Radius</span>
                <select 
                    value={radius} 
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full sm:w-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[10px] font-black px-4 py-3 sm:py-2.5 rounded-[1.5rem] outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer border-none text-center sm:text-left"
                >
                    {[5, 10, 20, 50, 100].map(r => (
                        <option key={r} value={r}>{r} KM</option>
                    ))}
                </select>
            </div>

            <button 
                onClick={fetchJobsNearMe} 
                className={`w-full sm:w-auto justify-center group flex items-center gap-3 px-6 sm:px-8 py-4 bg-primary text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-all active:scale-95 ${isLocating ? 'opacity-70 pointer-events-none' : ''}`}
            >
              <span className={`material-symbols-outlined text-lg ${isLocating ? 'animate-spin' : 'transition-transform group-hover:scale-110'}`}>
                {isLocating ? 'refresh' : 'my_location'}
              </span> 
              <span className="whitespace-nowrap">{isLocating ? 'Scanning Neighbors...' : 'Explore Near Me'}</span>
            </button>

            <button 
                onClick={() => setMapView(!mapView)} 
                className="w-full sm:w-auto justify-center flex items-center gap-3 px-6 sm:px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined text-lg">{mapView ? "grid_view" : "map"}</span> 
              <span className="whitespace-nowrap">{mapView ? "List View" : "Map View"}</span>
            </button>

            {userLocation && (
                <button 
                    onClick={() => { setUserLocation(null); fetchJobs(); }}
                    className="w-full sm:w-auto justify-center flex items-center gap-2 group px-6 py-4 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-rose-500/10 shrink-0"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                    <span className="whitespace-nowrap">Reset Systems</span>
                </button>
            )}
          </div>
        </motion.div>

        {mapView ? (
          <div 
            className="w-full h-[450px] md:h-[600px] lg:h-[700px] rounded-[2rem] lg:rounded-[3rem] overflow-hidden border border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900 shadow-2xl relative z-0 animate-in fade-in zoom-in duration-500"
          >
             <MapContainer center={userLocation || [20.5937, 78.9629]} zoom={userLocation ? 12 : 5} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapRefresher />
                <ChangeView center={userLocation} zoom={12} />
                {jobs.map(job => (
                  job.locationPoint?.coordinates?.length === 2 ? (
                    <Marker key={job._id} position={[job.locationPoint.coordinates[1], job.locationPoint.coordinates[0]]}>
                      <Popup>
                        <div className="p-4 min-w-[200px] text-center">
                          <h4 className="font-black text-slate-900 m-0 text-sm mb-1 uppercase italic italic-safe tracking-tight">{job.title}</h4>
                          <p className="text-[10px] uppercase font-black text-primary m-0 mb-4 tracking-widest">{job.city}</p>
                          <Link to={`/job/${job._id}`} className="block w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest no-underline transition-all hover:bg-primary">Explore Role</Link>
                        </div>
                      </Popup>
                    </Marker>
                  ) : null
                ))}
             </MapContainer>
          </div>
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
                className="glass-card group p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full"
              >
                <div>
                    <div className="flex items-start justify-between mb-6 sm:mb-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 flex items-center justify-center transition-all group-hover:rotate-12 group-hover:scale-110 shadow-inner shrink-0">
                        <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl font-bold">work</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-primary text-white text-[8px] font-black uppercase tracking-[0.2em] mb-2 sm:mb-3 whitespace-nowrap text-right max-w-[120px] truncate">
                            {element.category}
                        </span>
                        <div className="flex items-center gap-1 text-slate-400">
                            <span className="material-symbols-outlined text-[10px] sm:text-sm">location_on</span>
                            <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-right">
                                {element.city}
                            </p>
                        </div>
                    </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-black text-xl sm:text-2xl lg:text-3xl text-slate-900 dark:text-white leading-[1.1] mb-3 group-hover:text-primary transition-colors uppercase italic italic-safe tracking-tighter">
                        {element.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed line-clamp-3">
                        {element.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 sm:pt-8 border-t border-slate-100 dark:border-slate-800/50 mt-auto">
                  <div className="flex flex-col">
                    <p className="text-[8px] sm:text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Monthly Salary</p>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic italic-safe">
                        {element.fixedSalary
                        ? `₹${element.fixedSalary.toLocaleString()}`
                        : `₹${element.salaryFrom.toLocaleString()} - ₹${element.salaryTo.toLocaleString()}`}
                    </div>
                  </div>
                  <Link
                    to={`/job/${element._id}`}
                    className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl sm:rounded-2xl transition-all group-hover:bg-primary group-hover:text-white group-hover:-translate-y-1 sm:group-hover:-translate-y-2 shadow-xl active:scale-95 shrink-0 ml-2"
                  >
                    <span className="material-symbols-outlined font-black text-lg sm:text-xl">arrow_forward</span>
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-48 flex flex-col items-center justify-center text-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, rotate: -12 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 15 }}
                className="w-40 h-40 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center mb-12 shadow-2xl shadow-primary/5 border border-white/20 dark:border-white/5"
              >
                <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center animate-pulse">
                   <span className="material-symbols-outlined text-7xl text-primary font-bold">radar</span>
                </div>
              </motion.div>
              <h4 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase italic italic-safe tracking-tighter mb-4 leading-none">
                Still <span className="text-primary italic italic-safe">Looking...</span>
              </h4>
              <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px] max-w-md leading-relaxed">
                 No neighborhood opportunities found for this filter. Try expanding your radius.
              </p>
            </div>
          )}
        </motion.div>
        )}
      </main>
    </div>
  );
};

export default Jobs;
