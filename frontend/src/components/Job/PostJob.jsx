import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper to center map
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

function LocationMarker({ lat, lng, setLat, setLng }) {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    },
  });
  return lat && lng ? <Marker position={[lat, lng]} /> : null;
}

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food & Beverage");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  
  const [salaryType, setSalaryType] = useState("Range"); // "Fixed" or "Range"
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [mapCenter, setMapCenter] = useState([22.5726, 88.3639]); // Default Kolkata
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "Employer")) {
      navigateTo("/");
    }

    // Try to get user location for map centering
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setMapCenter([latitude, longitude]);
            // Optional: Auto-set coordinates if user hasn't clicked yet
            // setLat(latitude);
            // setLng(longitude);
        }, (error) => {
            console.log("Geolocation error:", error);
            // Don't show toast for every error to avoid being annoying, but log for debugging
        });
    }
  }, [isAuthorized, user, navigateTo]);

  const handleJobPost = async (e) => {
    e.preventDefault();
    
    if (salaryType === "Range" && (!salaryFrom || !salaryTo)) {
        return toast.error("Please provide full salary range.");
    }
    if (salaryType === "Fixed" && !fixedSalary) {
        return toast.error("Please provide fixed salary amount.");
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        description,
        category,
        country,
        city,
        location,
        lat,
        lng,
      };

      if (salaryType === "Fixed") {
        payload.fixedSalary = Number(fixedSalary);
      } else {
        payload.salaryFrom = Number(salaryFrom);
        payload.salaryTo = Number(salaryTo);
      }

      const res = await axios.post(
        "/api/v1/job/post",
        payload,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(res.data.message);
      // Premium experience: Redirect to dashboard after a short delay
      setTimeout(() => {
          navigateTo("/job/me");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Internal Server Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <main className="max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="h-0.5 w-16 bg-primary rounded-full" />
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Employer Studio</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">
            Post <span className="text-primary italic">a New Vacancy</span>
          </h1>
        </motion.div>

        <form onSubmit={handleJobPost} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form Area */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 space-y-8"
          >
            <div className="glass-card-premium !p-8 sm:!p-12 space-y-12">
              <section className="space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary font-bold">edit_note</span>
                    </div>
                    <h2 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Core Vacancy Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Job Title / Designation</label>
                    <input
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                        placeholder="e.g. Lead Barista"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    </div>

                    <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Industry Category</label>
                    <div className="relative">
                        <select
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner appearance-none"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option>Construction & Technical</option>
                            <option>Retail & Shops</option>
                            <option>Delivery & Logistics</option>
                            <option>Healthcare & Care</option>
                            <option>Security & Guarding</option>
                            <option>Salon & Beauty</option>
                            <option>Driving & Transport</option>
                            <option>Electric & Plumbing</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">unfold_more</span>
                    </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Region / Country</label>
                    <input
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                        placeholder="India"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                    </div>
                    <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Service City</label>
                    <input
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                        placeholder="Kolkata"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                    </div>
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">payments</span>
                        <h2 className="font-black text-xs uppercase tracking-widest text-slate-400">Compensation Model</h2>
                    </div>
                    
                    {/* Salary Type Segmented Control */}
                    <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex gap-1">
                        {["Fixed", "Range"].map(type => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setSalaryType(type)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${
                                    salaryType === type 
                                    ? "bg-white dark:bg-slate-700 text-primary shadow-sm" 
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {salaryType === "Fixed" ? (
                        <motion.div 
                            key="fixed"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Fixed Monthly Salary</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-primary">₹</span>
                                <input
                                    type="number"
                                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 font-black text-2xl tracking-tighter focus:border-primary outline-none transition-all shadow-inner"
                                    placeholder="0.00"
                                    value={fixedSalary}
                                    onChange={(e) => setFixedSalary(e.target.value)}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="range"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-10"
                        >
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Kam se Kam (Minimum)</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-primary">₹</span>
                                    <input
                                        type="number"
                                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 font-black text-xl tracking-tighter focus:border-primary outline-none"
                                        placeholder="From"
                                        value={salaryFrom}
                                        onChange={(e) => setSalaryFrom(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Zyada se Zyada (Maximum)</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-primary">₹</span>
                                    <input
                                        type="number"
                                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 font-black text-xl tracking-tighter focus:border-primary outline-none"
                                        placeholder="To"
                                        value={salaryTo}
                                        onChange={(e) => setSalaryTo(e.target.value)}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
              </section>

              <section className="space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <span className="material-symbols-outlined text-primary">description</span>
                    <h2 className="font-black text-xs uppercase tracking-widest text-slate-400">Position brief</h2>
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Role Description & Requirements</label>
                    <textarea
                        className="w-full px-8 py-6 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner resize-none min-h-[15rem]"
                        placeholder="Tell candidates about the mission, requirements, and culture..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
              </section>

              <div className="pt-10 flex justify-end">
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-16 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-primary hover:text-white disabled:opacity-50 transition-all flex items-center gap-3 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                      <span className="material-symbols-outlined animate-spin">refresh</span>
                  ) : (
                      <span className="material-symbols-outlined">rocket_launch</span>
                  )}
                  {isSubmitting ? "Broadcasting..." : "Publish Opportunity"}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Sidebar Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 space-y-12"
          >
            <div className="glass-card p-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl font-bold">distance</span>
                </div>
                <div>
                    <h3 className="font-black text-xl tracking-tight leading-none italic uppercase">Geotagging</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Hyperlocal Precision</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none bg-slate-100 z-0">
                  <MapContainer 
                    center={mapCenter} 
                    zoom={12} 
                    scrollWheelZoom={true} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker lat={lat} lng={lng} setLat={setLat} setLng={setLng} />
                    <ChangeView center={mapCenter} zoom={12} />
                  </MapContainer>
                  
                  <AnimatePresence>
                    {lat && lng ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-primary/10 backdrop-blur-[2px] pointer-events-none border-4 border-primary/50 rounded-[3rem] z-10 flex items-center justify-center"
                        >
                            <div className="bg-white dark:bg-slate-900 border-2 border-primary text-primary px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-2xl scale-75 md:scale-100">
                                Location Locked
                            </div>
                        </motion.div>
                    ) : (
                        <div className="absolute top-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 shadow-xl z-20">
                            <p className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest text-center leading-tight">
                                Tap Map to set precise coordinates for smart matching.
                            </p>
                        </div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Operational Address</label>
                  <div className="relative">
                      <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">explore</span>
                      <input
                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 font-bold focus:border-primary outline-none shadow-inner"
                        placeholder="Street, Landmark, Zone..."
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-10 bg-slate-900 dark:bg-slate-800 text-white relative overflow-hidden group border-none shadow-[0_20px_50px_rgba(15,23,42,0.3)]">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-primary/30">
                    <span className="material-symbols-outlined text-white text-2xl font-bold">auto_awesome</span>
                </div>
                <h4 className="font-black text-2xl mb-4 uppercase italic tracking-tight leading-none">Smart Dispatch</h4>
                <p className="text-sm font-medium text-slate-400 leading-relaxed italic border-l-2 border-primary pl-4">"Our matching engine will instantly reveal your role to high-intent candidates within 10km of your tagged location."</p>
              </div>
              <span className="material-symbols-outlined absolute -right-10 -bottom-10 text-white/5 text-[15rem] rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-0 duration-700">radar</span>
            </div>
          </motion.div>
        </form>
      </main>
    </div>
  );
};

export default PostJob;
