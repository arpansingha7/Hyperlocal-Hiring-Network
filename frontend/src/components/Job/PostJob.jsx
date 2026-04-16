import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

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
  const [salaryFrom, setSalaryFrom] = useState(1000);
  const [salaryTo, setSalaryTo] = useState(10000);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "Employer")) {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);

  const handleJobPost = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/api/v1/job/post",
        {
          title,
          description,
          category,
          country,
          city,
          location,
          salaryFrom,
          salaryTo,
          lat,
          lng,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <main className="max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            Post a <span className="text-primary">New Role</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">
            Reach the top talent in your community instantly.
          </p>
        </motion.div>

        <form onSubmit={handleJobPost} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form Area */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 space-y-8"
          >
            <div className="glass-card p-8 sm:p-12 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Job Title / Designation</label>
                  <input
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                    placeholder="e.g. Senior Barista"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Choose Category</label>
                  <select
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner appearance-none relative"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>Food & Beverage</option>
                    <option>Retail</option>
                    <option>Logistics</option>
                    <option>Healthcare</option>
                    <option>Customer Service</option>
                    <option>Technology</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Country</label>
                  <input
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                    placeholder="India"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">City</label>
                  <input
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner"
                    placeholder="Kolkata"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Salary Range (Monthly)</label>
                    <p className="text-xl font-black text-primary tracking-tighter">${salaryFrom.toLocaleString()} - ${salaryTo.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    className="w-full px-6 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 font-bold"
                    placeholder="Min"
                    value={salaryFrom}
                    onChange={(e) => setSalaryFrom(e.target.value)}
                  />
                  <input
                    type="number"
                    className="w-full px-6 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 font-bold"
                    placeholder="Max"
                    value={salaryTo}
                    onChange={(e) => setSalaryTo(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Job Description & Requirements</label>
                <textarea
                  className="w-full px-6 py-5 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-slate-900 dark:text-white transition-all shadow-inner resize-none"
                  placeholder="Tell us about the role, responsibilities, and key requirements..."
                  rows="6"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex justify-end">
                <button type="submit" className="px-12 py-5 bg-primary text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:brightness-110 active:scale-[0.98] transition-all">
                  Publish Your Role
                </button>
              </div>
            </div>
          </motion.div>

          {/* Sidebar Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 space-y-8"
          >
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                </div>
                <h3 className="font-black text-lg tracking-tight">Set GPS Location</h3>
              </div>
              
              <div className="space-y-6">
                <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner group z-0 ring-1 ring-slate-100 dark:ring-slate-800">
                  <MapContainer center={[22.5726, 88.3639]} zoom={11} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker lat={lat} lng={lng} setLat={setLat} setLng={setLng} />
                  </MapContainer>
                  <AnimatePresence>
                    {lat && lng && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-4 left-4 right-4 bg-green-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase text-center backdrop-blur-md shadow-lg"
                        >
                            Location Data Captured
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Specific Address</label>
                  <input
                    className="w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 font-bold focus:border-primary outline-none"
                    placeholder="Building, Landmark, etc."
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="glass-card p-8 bg-primary/5 border border-primary/20 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                    <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
                </div>
                <h4 className="font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">AI Matching Enabled</h4>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed">By setting a GPS location, our AI will automatically notify nearby qualified candidates.</p>
              </div>
              <span className="material-symbols-outlined absolute -right-6 -bottom-6 text-primary/10 text-9xl rotate-12 transition-transform group-hover:scale-110">rocket_launch</span>
            </div>
          </motion.div>
        </form>
      </main>
    </div>
  );
};

export default PostJob;
