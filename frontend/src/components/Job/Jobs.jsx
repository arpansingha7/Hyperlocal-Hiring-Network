import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

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
  const [radius, setRadius] = useState(10); // 10km default radius

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-primary animate-spin">refresh</span>
          <p className="mt-4 text-slate-500 font-medium">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">All Available Jobs</h1>
            <p className="text-slate-500 mt-1">{jobs.length} jobs found</p>
          </div>
          <div className="flex gap-4">
            <button onClick={fetchJobsNearMe} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
              <span className="material-symbols-outlined">my_location</span> Near Me
            </button>
            <button onClick={() => setMapView(!mapView)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
              <span className="material-symbols-outlined">{mapView ? "list" : "map"}</span> 
              {mapView ? "List View" : "Map View"}
            </button>
          </div>
        </div>

        {mapView ? (
          <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 z-0 relative shadow-inner">
             <MapContainer center={[39.828, -98.579]} zoom={4} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {jobs.map(job => (
                  job.locationPoint?.coordinates?.length === 2 ? (
                    <Marker key={job._id} position={[job.locationPoint.coordinates[1], job.locationPoint.coordinates[0]]}>
                      <Popup>
                        <div className="p-1">
                          <h4 className="font-bold text-sm m-0">{job.title}</h4>
                          <p className="text-xs text-slate-500 m-0 mb-2">{job.city}, {job.country}</p>
                          <Link to={`/job/${job._id}`} className="text-primary text-xs font-bold no-underline">View Details</Link>
                        </div>
                      </Popup>
                    </Marker>
                  ) : null
                ))}
             </MapContainer>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length > 0 ? (
            jobs.map((element) => (
              <div
                key={element._id}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">work</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
                      {element.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {element.city}, {element.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs font-bold">
                    {element.category}
                  </span>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {element.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {element.fixedSalary
                      ? `$${element.fixedSalary}`
                      : `$${element.salaryFrom} - $${element.salaryTo}`}
                  </div>
                  <Link
                    to={`/job/${element._id}`}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700">work_off</span>
              <p className="mt-4 text-slate-500 font-medium">No jobs found</p>
            </div>
          )}
        </div>
        )}
      </main>
    </div>
  );
};

export default Jobs;
