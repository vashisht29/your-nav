"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  MapPin,
  Clock,
  Plus,
  Star,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  Calendar,
  Compass,
  ArrowRight,
  LogOut,
  Sparkles,
  Heart,
  Coffee,
  Utensils,
  Mountain,
  Building,
  Upload,
  Camera
} from "lucide-react";

export interface UserRecommendation {
  id: string;
  title: string;
  category: "cafe" | "food" | "viewpoint" | "stay" | "gem";
  location: string;
  description: string;
  imageUrl: string;
  rating: number;
  createdAt: string;
}

interface UserProfileHubProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; email: string; provider: string } | null;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export default function UserProfileHub({
  isOpen,
  onClose,
  currentUser,
  onLogout,
  onOpenAuth,
}: UserProfileHubProps) {
  // Active Tab: "details" | "past_trips" | "recommendations"
  const [activeTab, setActiveTab] = useState<"details" | "past_trips" | "recommendations">("details");

  // Editable Profile fields
  const [profileName, setProfileName] = useState(currentUser?.name || "Traveler");
  const [homeCity, setHomeCity] = useState("Mumbai");
  const [emergencyPhone, setEmergencyPhone] = useState("+91 98765 43210");
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // New Recommendation Form State
  const [recTitle, setRecTitle] = useState("");
  const [recCategory, setRecCategory] = useState<"cafe" | "food" | "viewpoint" | "stay" | "gem">("cafe");
  const [recLocation, setRecLocation] = useState("");
  const [recDescription, setRecDescription] = useState("");
  const [recRating, setRecRating] = useState(5);
  const [recImage, setRecImage] = useState<string>("");
  const [recImagePreview, setRecImagePreview] = useState<string>("");
  const [recSuccessToast, setRecSuccessToast] = useState(false);

  // Stored Recommendations
  const [recommendations, setRecommendations] = useState<UserRecommendation[]>([
    {
      id: "rec-1",
      title: "Cafe Lilliput & Sunset Deck",
      category: "cafe",
      location: "Anjuna Beach Cliff, North Goa",
      description: "Best artisanal cold brew with unobstructed sea views. Incredible ambient sunset vibe and woodfired pizza.",
      imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
      rating: 5,
      createdAt: "Yesterday",
    },
    {
      id: "rec-2",
      title: "Amrik Sukhdev Highway Oasis",
      category: "food",
      location: "GT Road KM 52, Murthal, Haryana",
      description: "Legendary white butter tandoori parathas and authentic kulhad chai. Fast 24/7 service, spotless washrooms.",
      imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
      rating: 5,
      createdAt: "3 days ago",
    },
    {
      id: "rec-3",
      title: "Tiger Point Valley Lookout",
      category: "viewpoint",
      location: "Khandala Ghats, Lonavala",
      description: "Spectacular misty gorge view during monsoon. Hot roasted sweet corn and ginger chai while watching waterfalls.",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      rating: 5,
      createdAt: "1 week ago",
    }
  ]);

  // Past Trips History
  const pastTrips = [
    {
      id: "trip-01",
      title: "Mumbai ➔ Goa Coastal Expressway",
      date: "14 Aug – 18 Aug 2026",
      mode: "Self-Drive (SUV)",
      status: "COMPLETED",
      milestonesCount: 5,
      budgetSpent: "₹18,500",
      budgetAllocated: "₹22,000",
      route: "Mumbai Gateway → Khalapur Toll → Lonavala Oasis → Sawantwadi → Goa Beachfront",
      highlight: "Family Live Share broadcasted 5 checkpoints without delay.",
    },
    {
      id: "trip-02",
      title: "Delhi ➔ Manali Cloud Highway Corridor",
      date: "02 Jul – 06 Jul 2026",
      mode: "Personal Car",
      status: "ARCHIVED",
      milestonesCount: 7,
      budgetSpent: "₹24,800",
      budgetAllocated: "₹28,000",
      route: "Mukarba Chowk → Karnal Toll → Ambala Midway → Aut Tunnel → Manali Stay",
      highlight: "Offline Dead-Reckoning SMS triggered automatically in Aut pass.",
    },
    {
      id: "trip-03",
      title: "Bengaluru ➔ Ooty Nilgiri Tea Trail",
      date: "12 May – 14 May 2026",
      mode: "Self-Drive",
      status: "COMPLETED",
      milestonesCount: 4,
      budgetSpent: "₹12,400",
      budgetAllocated: "₹15,000",
      route: "NICE Road → Mysore Bypass → Bandipur Reserve → Ooty Lake",
      highlight: "Zero false alarm route check completed smoothly.",
    },
  ];

  // Load saved recommendations from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedRecs = localStorage.getItem("safar_user_recommendations");
        if (storedRecs) {
          const parsed = JSON.parse(storedRecs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRecommendations(parsed);
          }
        }
      } catch (e) {}
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentUser?.name) {
      setProfileName(currentUser.name);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // Handle image file selection
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setRecImage(result);
        setRecImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick Preset Sample Images
  const samplePresets = [
    { label: "Cozy Cafe", url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80" },
    { label: "Sunset Coast", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
    { label: "Mountain Pass", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80" },
    { label: "Dhaba Food", url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80" },
  ];

  // Add new recommendation
  const handleAddRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recTitle.trim() || !recLocation.trim()) return;

    const newRec: UserRecommendation = {
      id: `rec-${Date.now()}`,
      title: recTitle.trim(),
      category: recCategory,
      location: recLocation.trim(),
      description: recDescription.trim() || "Great pitstop with scenic views and excellent hospitality.",
      imageUrl: recImage || samplePresets[0].url,
      rating: recRating,
      createdAt: "Just now",
    };

    const updated = [newRec, ...recommendations];
    setRecommendations(updated);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("safar_user_recommendations", JSON.stringify(updated));
      } catch (e) {}
    }

    // Reset Form
    setRecTitle("");
    setRecLocation("");
    setRecDescription("");
    setRecImage("");
    setRecImagePreview("");
    setRecRating(5);
    setRecSuccessToast(true);
    setTimeout(() => setRecSuccessToast(false), 3000);
  };

  const handleDeleteRecommendation = (id: string) => {
    const updated = recommendations.filter((r) => r.id !== id);
    setRecommendations(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("safar_user_recommendations", JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const handleSaveProfile = () => {
    if (currentUser && typeof window !== "undefined") {
      try {
        const updatedUser = { ...currentUser, name: profileName.trim() || currentUser.name };
        localStorage.setItem("yournav_user", JSON.stringify(updatedUser));
      } catch (e) {}
    }
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[250] flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0f1117] border border-white/15 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* ================= MODAL HEADER ================= */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-md shadow-sky-500/25">
              {(currentUser?.name || "T").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  {currentUser?.name || "Traveler Account"}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 capitalize">
                  {currentUser?.provider || "explorer"}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {currentUser?.email || "Signed In with Safar AI"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================= 3-TAB TOGGLE BAR ================= */}
        <div className="flex items-center border-b border-white/10 bg-white/[0.01] px-4 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "details"
                ? "border-sky-400 text-sky-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>User Details</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("past_trips")}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "past_trips"
                ? "border-sky-400 text-sky-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Past Trips</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300 font-mono">
              {pastTrips.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("recommendations")}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "recommendations"
                ? "border-sky-400 text-sky-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Add Recommendation</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-sky-500/20 text-sky-300 font-mono">
              {recommendations.length}
            </span>
          </button>
        </div>

        {/* ================= SCROLLABLE TAB CONTENT ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: USER DETAILS */}
          {activeTab === "details" && (
            <div className="space-y-4 animate-fade-in text-xs">
              {profileSavedToast && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-2xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Profile details saved successfully!</span>
                </div>
              )}

              {/* Profile Card */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Traveler Credentials
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Verified Profile
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">
                      Primary Email
                    </label>
                    <input
                      type="text"
                      disabled
                      value={currentUser?.email || "traveler@safar.ai"}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-400 outline-none font-mono cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">
                      Home City / Base
                    </label>
                    <input
                      type="text"
                      value={homeCity}
                      onChange={(e) => setHomeCity(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 font-semibold">
                      Emergency Guardian Contact
                    </label>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Sentinel Protection Status */}
              <div className="p-3.5 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  <span>Safar AI Guardian Active</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your profile is protected by NavIC Satellite lock and RoadGuard safety algorithms. Real-time checkpoints auto-notify your primary contact upon waypoint clearance.
                </p>
              </div>

              {/* Logout & Redirect Action */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Want to switch accounts or exit to the main landing page?
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="px-4 py-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out & Exit to Website</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PAST TRIPS */}
          {activeTab === "past_trips" && (
            <div className="space-y-3 animate-fade-in text-xs">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Journey Archive & Logs
                </span>
                <span className="text-[10px] text-slate-400">
                  {pastTrips.length} expeditions documented
                </span>
              </div>

              <div className="space-y-2.5">
                {pastTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="p-3.5 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl space-y-2 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                          <span>📍</span>
                          <span>{trip.title}</span>
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-sky-400" />
                            {trip.date}
                          </span>
                          <span>•</span>
                          <span>{trip.mode}</span>
                        </div>
                      </div>

                      <span className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                        {trip.status}
                      </span>
                    </div>

                    <div className="p-2 bg-black/30 rounded-xl text-[10.5px] text-slate-300 font-mono border border-white/5 truncate">
                      {trip.route}
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-400">
                        Total Spent: <strong className="text-white font-mono">{trip.budgetSpent}</strong> (Saved ~{parseInt(trip.budgetAllocated.replace(/\D/g, "")) - parseInt(trip.budgetSpent.replace(/\D/g, ""))})
                      </span>
                      <span className="text-sky-400 font-bold hover:underline cursor-pointer flex items-center gap-1">
                        <span>Route Log</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ADD RECOMMENDATION */}
          {activeTab === "recommendations" && (
            <div className="space-y-4 animate-fade-in text-xs">
              {recSuccessToast && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-2xl flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Recommendation added to your traveler hub!</span>
                </div>
              )}

              {/* Add New Recommendation Form */}
              <form onSubmit={handleAddRecommendation} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>Recommend a Cafe, Dhaba, Viewpoint or Stay</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Public & Saved</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Spot Name */}
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-semibold text-slate-300 block mb-1">
                      Place / Spot Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cafe Lilliput / Baba Cafe / Curlies"
                      value={recTitle}
                      onChange={(e) => setRecTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-300 block mb-1">
                      Category
                    </label>
                    <select
                      value={recCategory}
                      onChange={(e: any) => setRecCategory(e.target.value)}
                      className="w-full bg-[#171923] border border-white/15 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="cafe">☕ Cafe & Coffee House</option>
                      <option value="food">🍽️ Dhaba / Authentic Food</option>
                      <option value="viewpoint">🌅 Scenic Viewpoint / Valley</option>
                      <option value="stay">🏨 Boutique Stay / Hotel</option>
                      <option value="gem">💎 Hidden Gem / Secret Spot</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-300 block mb-1">
                      Location / Landmark <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anjuna Cliff, Goa or NH-48 KM 92"
                      value={recLocation}
                      onChange={(e) => setRecLocation(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
                    />
                  </div>

                  {/* Picture Upload & Preview */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-semibold text-slate-300 block">
                      Spot Picture / Photo (Upload or Pick Preset)
                    </label>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      {/* File Upload Button */}
                      <label className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-xs font-semibold text-white cursor-pointer transition flex-shrink-0">
                        <Upload className="w-3.5 h-3.5 text-sky-400" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>

                      {/* Quick Presets */}
                      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                        {samplePresets.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setRecImage(p.url);
                              setRecImagePreview(p.url);
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition cursor-pointer flex-shrink-0 ${
                              recImage === p.url
                                ? "bg-sky-500/20 border-sky-400 text-sky-300"
                                : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Image Preview Thumbnail */}
                    {recImagePreview && (
                      <div className="relative w-full h-28 rounded-xl overflow-hidden border border-white/15 mt-2 shadow-xs group">
                        <img
                          src={recImagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setRecImage("");
                            setRecImagePreview("");
                          }}
                          className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black text-white rounded-lg transition cursor-pointer"
                          title="Remove Photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-semibold text-slate-300 block mb-1">
                      Description & What to Order
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Best iced latte, sunset views, clean restrooms and plenty of bike parking..."
                      value={recDescription}
                      onChange={(e) => setRecDescription(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-sky-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none resize-none"
                    />
                  </div>

                  {/* Rating Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-300">Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRecRating(s)}
                          className="text-base cursor-pointer transition hover:scale-110"
                        >
                          {s <= recRating ? "⭐️" : "☆"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl transition shadow-md shadow-sky-500/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Recommendation</span>
                  </button>
                </div>
              </form>

              {/* Feed of Added Recommendations */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    My Recommendations ({recommendations.length})
                  </span>
                  <span className="text-[10px] text-slate-500">Shared with community</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-white/20 transition group"
                    >
                      {rec.imageUrl && (
                        <div className="h-28 w-full relative overflow-hidden bg-black/40">
                          <img
                            src={rec.imageUrl}
                            alt={rec.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-extrabold text-white border border-white/10 uppercase">
                            {rec.category}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteRecommendation(rec.id)}
                            className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-lg transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <h5 className="font-bold text-white text-xs truncate">
                              {rec.title}
                            </h5>
                            <span className="text-[11px] flex items-center">
                              {"⭐️".repeat(rec.rating)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-sky-300 mt-0.5">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{rec.location}</span>
                          </div>
                          <p className="text-[10.5px] text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                            {rec.description}
                          </p>
                        </div>

                        <div className="text-[9px] text-slate-500 pt-1 border-t border-white/5 flex items-center justify-between">
                          <span>Added {rec.createdAt}</span>
                          <span className="text-emerald-400 font-bold">✓ Verified Spot</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
