"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Calendar,
  IndianRupee,
  Users,
  Compass,
  Zap,
  Lock,
  Unlock,
  AlertTriangle,
  HeartHandshake,
  CheckCircle,
  ShieldAlert,
  Loader2,
  Languages,
  ChevronRight,
  ChevronLeft,
  X,
  Plane,
  Home as HotelHome,
  Check,
  Map,
  Activity,
  AlertCircle,
  Car,
  Fuel,
  TrendingDown,
  Sparkles,
  Info,
  Wrench,
  Utensils
} from "lucide-react";

// Dynamically import MapComponent to bypass SSR window undefined errors
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-slate-100 flex items-center justify-center rounded-xl">
      <Loader2 className="animate-spin text-primary-500 w-8 h-8" />
    </div>
  ),
});

// UI Translation Dictionary for consistent localization (English-First by default)
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    title: "Smart AI Travel",
    subtitle: "Stateful Recommendation & Optimization Engine",
    step: "Step",
    destination: "Destination",
    origin: "Origin",
    dates: "Travel Dates",
    depDate: "Departure Date",
    retDate: "Return Date",
    travelers: "Number of Travelers",
    budget: "Total Budget (INR)",
    searchBtn: "Search Options",
    selectTransit: "Choose Transportation Option",
    selectHotel: "Choose Destination Accommodation",
    flightCost: "Ticket Price",
    nightlyRate: "Per Night",
    totalStay: "Total Stay Cost",
    step4Title: "Travel Preferences",
    pace: "Travel Pace",
    interests: "Select Interests",
    generateBtn: "Optimize Itinerary",
    replanBtn: "Re-optimize Itinerary",
    stays: "Stay Selection",
    explanation: "AI Coordinator Evaluation Summary",
    allocatedBudget: "Budget Ceiling",
    estimatedCost: "Final Price",
    remainingBalance: "Leftover Savings",
    bookBtn: "Confirm & Book Stays",
    emergencyBtn: "Emergency SOS",
    next: "Continue",
    back: "Back",
    locked: "Locked",
    unlocked: "Unlocked",
    weather: "Weather",
    daysUnit: "Days",
    peopleUnit: "People",
    originLabel: "Leaving from?",
    invalidDaysErr: "Prototype supports travel durations up to 5 days only.",
    noPlanYet: "Configure parameters to start.",
    paymentTitle: "Razorpay Sandbox Checkout",
    paymentSuccess: "Payment Captured Successfully!",
    refNo: "Transaction Reference",
    sosTitle: "SOS Assistance Network",
    sosSub: "Select emergency situational trigger to request nearby assistance.",
    breakdownOpt: "Car Puncture / Engine Repair",
    medicalOpt: "Medical Emergency Clinic",
    policeOpt: "Police Safety Check",
    sosInstructions: "Critical Instructions",
    closeBtn: "Close",
    estimatedBadge: "OSM Estimated Spot",
    foodTitle: "Meal Plan",
    logisticsTitle: "Travel Logistics",
    distributeBudget: "Allocated budget distribution:",
    stayCost: "Accommodation Stays",
    transportCost: "Transportation & Fuel",
    foodCost: "Estimated Meal Costs",
    ticketCost: "Activity Entry Tickets",
    transitMode: "Transit Mode Selection",
    viewMore: "View More Options",
    carDetails: "Highway Driving Directions",
    drivingDistance: "Driving Distance",
    fuelPrice: "Estimated Fuel Cost",
    tollGates: "Toll Gates to cross",
    restStops: "Suggested Rest Stops",
    morning: "Morning Plan",
    afternoon: "Afternoon Plan",
    evening: "Evening Plan",
    fuelSelect: "Vehicle Fuel Type",
    detailsBtn: "View Details",
    alternativeTitle: "Agentic Conflict Resolution",
    alternativeSub: "The selected combination exceeds your budget. Select one of the optimized alternatives below to resolve the constraint immediately:",
    searchVehiclePlaceholder: "Search Vehicle (Creta, Nexon EV, XUV700)",
    specsLabel: "Specs Derived",
    midwaySelect: "Choose Midway Overnight Stay",
    factorTitle: "Route Intelligence Factors",
    viewFactorsBtn: "View Route Intelligence",
    delayRateLabel: "Delay Probability",
    stopsLabel: "Stops",
    baggageLabel: "Baggage limit"
  },
  hi: {
    title: "स्मार्ट AI ट्रेवल",
    subtitle: "यात्रा अनुकूलन और अनुशंसा इंजन",
    step: "चरण",
    destination: "गंतव्य स्थान",
    origin: "प्रस्थान का शहर",
    dates: "यात्रा तिथियां",
    depDate: "प्रस्थान तिथि",
    retDate: "वापसी तिथि",
    travelers: "यात्रियों की संख्या",
    budget: "कुल बजट (₹)",
    searchBtn: "खोजें",
    selectTransit: "परिवहन का चयन करें",
    selectHotel: "होटल रूम्स का चयन करें",
    flightCost: "टिकट मूल्य",
    nightlyRate: "प्रति रात",
    totalStay: "कुल होटल खर्च",
    step4Title: "यात्रा प्राथमिकताएं",
    pace: "यात्रा की गति",
    interests: "रुचियां",
    generateBtn: "यात्रा कार्यक्रम अनुकूलित करें",
    replanBtn: "पुन: अनुकूलित करें",
    stays: "चुना गया होटल",
    explanation: "AI समन्वयक विवरण",
    allocatedBudget: "बजट सीमा",
    estimatedCost: "अंतिम मूल्य",
    remainingBalance: "बचा हुआ बजट",
    bookBtn: "भुगतान पर जाएं",
    emergencyBtn: "आपातकालीन SOS",
    next: "आगे बढ़ें",
    back: "पीछे",
    locked: "लॉक किया गया",
    unlocked: "अनलॉक किया गया",
    weather: "मौसम",
    daysUnit: "दिन",
    peopleUnit: "लोग",
    originLabel: "कहाँ से प्रस्थान कर रहे हैं?",
    invalidDaysErr: "प्रोटोटाइप अधिकतम 5 दिनों की यात्रा का समर्थन करता है।",
    noPlanYet: "प्रारंभ करने के लिए चरण पूरे करें।",
    paymentTitle: "रेज़रपे भुगतान पोर्टल",
    paymentSuccess: "भुगतान सफलतापूर्वक प्राप्त हुआ!",
    refNo: "लेनदेन संदर्भ संख्या",
    sosTitle: "SOS सहायता नेटवर्क",
    sosSub: "आस-पास सहायता के लिए अपनी आपातकालीन श्रेणी चुनें।",
    breakdownOpt: "पंचर / इंजन सुधार",
    medicalOpt: "चिकित्सा क्लिनिक",
    policeOpt: "पुलिस बूथ",
    sosInstructions: "महत्वपूर्ण दिशानिर्देश",
    closeBtn: "बंद करें",
    estimatedBadge: "अनुमानित स्थानीय बिंदु",
    foodTitle: "भोजन योजना",
    logisticsTitle: "यात्रा व्यवस्था",
    distributeBudget: "बजट का अनुमानित आवंटन विवरण:",
    stayCost: "आवास (होटल) खर्च",
    transportCost: "परिवहन और ईंधन",
    foodCost: "भोजन खर्च",
    ticketCost: "गतिविधि प्रवेश टिकट",
    transitMode: "परिवहन चयन",
    viewMore: "और विकल्प देखें",
    carDetails: "हाईवे ड्राइविंग निर्देश",
    drivingDistance: "ड्राइविंग दूरी",
    fuelPrice: "अनुमानित ईंधन खर्च",
    tollGates: "कुल टोल नाके",
    restStops: "सुझाए गए रेस्ट स्टॉप्स",
    morning: "सुबह की योजना",
    afternoon: "दोपहर की योजना",
    evening: "शाम की योजना",
    fuelSelect: "वाहन ईंधन प्रकार",
    detailsBtn: "विवरण देखें",
    alternativeTitle: "एजेंटिक विकल्प समाधान",
    alternativeSub: "चुना गया विकल्प आपके बजट से अधिक है। समाधान के लिए नीचे दिए गए अनुकूलित विकल्पों में से एक चुनें:",
    searchVehiclePlaceholder: "गाड़ी खोजें (Creta, Nexon EV, XUV700)",
    specsLabel: "इंजन विवरण",
    midwaySelect: "मिडवे ओवरनाइट स्टे चुनें",
    factorTitle: "मार्ग बुद्धि कारक",
    viewFactorsBtn: "मार्ग खुफिया जानकारी देखें",
    delayRateLabel: "विलंब संभावना",
    stopsLabel: "स्टॉप",
    baggageLabel: "सामान की सीमा"
  }
};

const AVAILABLE_INTERESTS = [
  { id: "heritage", label_en: "Heritage / History", label_hi: "इतिहास / ऐतिहासिक स्थल" },
  { id: "architecture", label_en: "Architecture", label_hi: "वास्तुकला" },
  { id: "nature", label_en: "Nature & Outdoors", label_hi: "प्रकृति और हरियाली" },
  { id: "local_market", label_en: "Local Markets", label_hi: "स्थानीय बाजार" },
  { id: "culinary", label_en: "Culinary / Food", label_hi: "खान-पान" },
  { id: "adventure", label_en: "Adventure", label_hi: "साहसिक गतिविधियां" }
];

export default function Home() {
  const [lang, setLang] = useState("en");
  const t = TRANSLATIONS[lang];

  // Wizard Step State
  const [step, setStep] = useState(1);

  // Setup Parameters
  const [origin, setOrigin] = useState("Delhi");
  const [destination, setDestination] = useState("");
  const [depDate, setDepDate] = useState("2026-09-10");
  const [retDate, setRetDate] = useState("2026-09-13");
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(30000);
  const [transportMode, setTransportMode] = useState("flight");
  const [vehicleQuery, setVehicleQuery] = useState("Maruti Swift");

  // Derived Vehicle Specs Details
  const [derivedSpecs, setDerivedSpecs] = useState<any>({
    model: "Maruti Swift",
    fuel_type: "petrol",
    mileage: 22.0,
    capacity: 37,
    source: "Maruti Suzuki Bureau"
  });

  // Candidate Search Results
  const [transits, setTransits] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [midwayHotels, setMidwayHotels] = useState<any[]>([]);
  const [midwayCityName, setMidwayCityName] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infeasibleAlternatives, setInfeasibleAlternatives] = useState<any[]>([]);

  // User Selections
  const [selectedTransit, setSelectedTransit] = useState<any>(null);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [selectedMidwayHotel, setSelectedMidwayHotel] = useState<any>(null);

  // Inspector States
  const [inspectingTransit, setInspectingTransit] = useState<any>(null);
  const [inspectingHotel, setInspectingHotel] = useState<any>(null);
  const [showRouteFactors, setShowRouteFactors] = useState(false);

  // Preferences
  const [pace, setPace] = useState("moderate");
  const [interests, setInterests] = useState<string[]>(["heritage"]);

  // Final Solver Results
  const [itinerary, setItinerary] = useState<any>(null);
  const [solveLoading, setSolveLoading] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  // Payments & SOS
  const [showPayment, setShowPayment] = useState(false);
  const [payRef, setPayRef] = useState("");
  const [paySuccess, setPaySuccess] = useState(false);

  const [showSOS, setShowSOS] = useState(false);
  const [sosType, setSosType] = useState("");
  const [sosLoading, setSosLoading] = useState(false);
  const [emergencyServices, setEmergencyServices] = useState<any[]>([]);

  // Search Transit and Stays (Step 1 -> Step 2)
  const handleSearch = async () => {
    setErrorMsg("");
    setInfeasibleAlternatives([]);
    setSearchLoading(true);

    try {
      const transitRes = await fetch("http://localhost:8000/api/search/transit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          destination,
          departure_date: depDate,
          return_date: retDate,
          travelers,
          mode: transportMode,
          fuel_type: derivedSpecs.fuel_type,
          vehicle_query: vehicleQuery
        })
      });

      const hotelRes = await fetch("http://localhost:8000/api/search/stays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          destination,
          departure_date: depDate,
          return_date: retDate,
          travelers,
          budget,
          transport_mode: transportMode,
          vehicle_query: vehicleQuery
        })
      });

      const transitData = await transitRes.json();
      const hotelData = await hotelRes.json();

      if (transitRes.status === 200 && hotelRes.status === 200) {
        setTransits(transitData.transits);
        setHotels(hotelData.hotels);
        setMidwayHotels(hotelData.midway_hotels || []);
        setMidwayCityName(hotelData.midway_city_name || "");
        setSelectedTransit(null);
        setSelectedHotel(null);
        setSelectedMidwayHotel(null);
        setStep(2);
      } else {
        setErrorMsg(transitData.detail || hotelData.detail || "Search query failed.");
      }
    } catch (e) {
      setErrorMsg("Failed to connect to backend server. Make sure FastAPI runs on port 8000.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleVehicleSearch = (q: string) => {
    setVehicleQuery(q);
    // Simple frontend derived specification lookup
    const list = [
      { model: "Hyundai Creta", fuel_type: "petrol", mileage: 14.5, capacity: 50, source: "Hyundai Official Specs" },
      { model: "Tata Nexon EV", fuel_type: "ev_charge_kwh", mileage: 6.2, capacity: 40, source: "Tata Motors EV Specs" },
      { model: "Mahindra XUV700", fuel_type: "diesel", mileage: 13.2, capacity: 60, source: "Mahindra Official Specs" },
      { model: "Honda City", fuel_type: "petrol", mileage: 16.8, capacity: 40, source: "Honda Car Specs" },
      { model: "Toyota Innova Hycross", fuel_type: "premium_petrol", mileage: 18.2, capacity: 52, source: "Toyota Hybrid Bureau" },
      { model: "Maruti Swift", fuel_type: "petrol", mileage: 22.0, capacity: 37, source: "Maruti Suzuki Bureau" }
    ];
    const found = list.find((x) => x.model.toLowerCase().includes(q.toLowerCase()));
    if (found) {
      setDerivedSpecs(found);
    } else {
      setDerivedSpecs({
        model: q,
        fuel_type: "petrol",
        mileage: 16.0,
        capacity: 45,
        source: "Estimated specifications"
      });
    }
  };

  // Final Solve Optimization
  const handleSolve = async () => {
    setErrorMsg("");
    setInfeasibleAlternatives([]);
    setSolveLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          destination,
          departure_date: depDate,
          return_date: retDate,
          travelers,
          budget,
          selected_transit: selectedTransit,
          selected_hotel: selectedHotel,
          selected_midway_hotel: selectedMidwayHotel,
          pace,
          interests,
          lang,
          transport_mode: transportMode,
          fuel_type: derivedSpecs.fuel_type,
          vehicle_query: vehicleQuery
        })
      });
      const data = await res.json();
      if (res.status === 200) {
        if (data.status === "Infeasible") {
          setErrorMsg(data.message);
          setInfeasibleAlternatives(data.alternatives || []);
          setItinerary(null);
        } else {
          setItinerary(data);
          setStep(5);
        }
      } else {
        setErrorMsg(data.detail || "Optimization failed.");
      }
    } catch (e) {
      setErrorMsg("Connection failed during optimization solve.");
    } finally {
      setSolveLoading(false);
    }
  };

  const handleApplyAlternative = async (alt: any) => {
    setErrorMsg("");
    if (alt.hotel) {
      setSelectedHotel(alt.hotel);
    }
    if (alt.transit) {
      setSelectedTransit(alt.transit);
      setTransportMode(alt.transport_mode);
    }
    if (alt.budget_adjust) {
      setBudget(alt.budget_adjust);
    }
    
    setSolveLoading(true);
    setTimeout(async () => {
      try {
        const res = await fetch("http://localhost:8000/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origin,
            destination,
            departure_date: depDate,
            return_date: retDate,
            travelers,
            budget: alt.budget_adjust || budget,
            selected_transit: alt.transit || selectedTransit,
            selected_hotel: alt.hotel || selectedHotel,
            selected_midway_hotel: selectedMidwayHotel,
            pace,
            interests,
            lang,
            transport_mode: alt.transport_mode || transportMode,
            fuel_type: derivedSpecs.fuel_type,
            vehicle_query: vehicleQuery
          })
        });
        const data = await res.json();
        if (res.status === 200 && data.status !== "Infeasible") {
          setItinerary(data);
          setInfeasibleAlternatives([]);
          setStep(5);
        } else {
          setErrorMsg(data.message || "Failed to solve with applied alternative.");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setSolveLoading(false);
      }
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="flex items-center justify-between border-b pb-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Compass className="text-primary-500 w-7 h-7" />
            {t.title}
          </h1>
          <p className="text-xs text-slate-500">{t.subtitle}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border rounded-lg text-xs font-bold flex items-center gap-1 text-slate-700 transition-all"
          >
            <Languages className="w-3.5 h-3.5" />
            {lang === "en" ? "Switch to Hindi" : "English"}
          </button>

          <button
            onClick={() => { setShowSOS(true); setSosType(""); setEmergencyServices([]); }}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-extrabold flex items-center gap-1 shadow transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {t.emergencyBtn}
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Control Panel: Progressive Steps */}
        <div className="lg:col-span-1 bg-white border p-5 rounded-2xl shadow-sm h-fit space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-xs font-extrabold text-slate-800">
              {t.step} {step} / 5
            </h2>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`w-2.5 h-1.5 rounded-full transition-all ${
                    step >= s ? "bg-primary-500" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">{errorMsg}</span>
              </div>

              {/* Agentic Alternatives Resolvers */}
              {infeasibleAlternatives.length > 0 && (
                <div className="mt-2.5 border-t pt-2.5 space-y-2">
                  <span className="text-[10px] text-slate-500 font-extrabold block uppercase tracking-wider">
                    {t.alternativeTitle}
                  </span>
                  <p className="text-[10px] text-slate-500 mb-1">{t.alternativeSub}</p>
                  {infeasibleAlternatives.map((alt) => (
                    <button
                      key={alt.id}
                      onClick={() => handleApplyAlternative(alt)}
                      className="w-full p-2 bg-white hover:bg-slate-50 border text-left rounded-lg text-[10px] text-slate-700 font-bold flex items-center justify-between gap-1 shadow-sm transition-all"
                    >
                      <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-500" /> {alt.description}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 1: Parameters */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.origin}</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full p-2.5 rounded-lg border text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.destination}</label>
                <input
                  type="text"
                  placeholder="e.g. Nalanda, Jaipur, Munnar, Goa"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-2.5 rounded-lg border text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.depDate}</label>
                  <input
                    type="date"
                    value={depDate}
                    onChange={(e) => setDepDate(e.target.value)}
                    className="w-full p-2 rounded-lg border text-xs focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.retDate}</label>
                  <input
                    type="date"
                    value={retDate}
                    onChange={(e) => setRetDate(e.target.value)}
                    className="w-full p-2 rounded-lg border text-xs focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.travelers}</label>
                  <input
                    type="number"
                    min={1}
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border text-xs focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.budget}</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border text-xs focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.transitMode}</label>
                  <select
                    value={transportMode}
                    onChange={(e) => setTransportMode(e.target.value)}
                    className="w-full p-2.5 rounded-lg border text-xs font-bold focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="flight">{lang === "en" ? "Flight" : "हवाई यात्रा"}</option>
                    <option value="train">{lang === "en" ? "Train" : "ट्रेन"}</option>
                    <option value="bus">{lang === "en" ? "Bus" : "बस"}</option>
                    <option value="self-drive">{lang === "en" ? "Car / Driving" : "कार ड्राइविंग"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {transportMode === "self-drive" ? "Engine Type" : "Transit Option Class"}
                  </label>
                  {transportMode === "self-drive" ? (
                    <select
                      value={derivedSpecs.fuel_type}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "ev_charge_kwh") {
                          setDerivedSpecs({ model: "Standard EV", fuel_type: "ev_charge_kwh", mileage: 6.0, capacity: 40, source: "Highway EV Averages" });
                          setVehicleQuery("Standard EV");
                        } else {
                          setDerivedSpecs({ model: "Standard Petrol Car", fuel_type: "petrol", mileage: 15.0, capacity: 45, source: "Highway Petrol Averages" });
                          setVehicleQuery("Standard Petrol Car");
                        }
                      }}
                      className="w-full p-2.5 rounded-lg border text-xs font-bold focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="petrol">Petrol / Diesel Car</option>
                      <option value="ev_charge_kwh">Electric Vehicle (EV)</option>
                    </select>
                  ) : (
                    <select className="w-full p-2.5 rounded-lg border text-xs font-bold focus:ring-2 focus:ring-primary-500">
                      <option value="standard">Standard Economy</option>
                      <option value="premium">Premium First Class</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Dynamic Vehicle Specifications Badge */}
              {transportMode === "self-drive" && derivedSpecs && (
                <div className="p-2.5 bg-slate-50 border rounded-lg text-[10px] space-y-1">
                  <span className="font-bold text-slate-500 block uppercase tracking-wider">Estimated Specs (Standard Highway Averages):</span>
                  <div className="flex justify-between text-slate-700">
                    <span className="font-extrabold">{derivedSpecs.model}</span>
                    <span className="capitalize">{derivedSpecs.fuel_type.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[9px]">
                    <span>Mileage: {derivedSpecs.mileage} km/unit</span>
                    <span>Source: {derivedSpecs.source}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleSearch}
                disabled={searchLoading || !destination}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              >
                {searchLoading ? <Loader2 className="animate-spin w-4 h-4" /> : null}
                {t.searchBtn}
              </button>
            </div>
          )}

          {/* STEP 2: Choose Transit (Flight/Train/Bus/Car Details) */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-extrabold text-slate-800 text-xs">{t.selectTransit}</h3>
              
              <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                {/* 1. Flights List */}
                {transportMode === "flight" && transits.map((f) => (
                  <div
                    key={f.id}
                    className={`p-3 border rounded-xl transition-all ${
                      selectedTransit?.id === f.id ? "bg-primary-50 border-primary-500" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Plane className="w-3.5 h-3.5 text-primary-500" /> {f.airline} ({f.flight_number})
                      </span>
                      <span className="font-extrabold text-slate-700">₹{f.total_price_inr}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                      <span>{f.origin_airport} ➔ {f.destination_airport}</span>
                      <span>{f.duration_hrs} hrs</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setSelectedTransit(f)}
                        className="flex-1 py-1.5 bg-primary-600 text-white font-bold rounded-lg text-[10px]"
                      >
                        Select Option
                      </button>
                      <button
                        onClick={() => setInspectingTransit(f)}
                        className="px-2.5 py-1.5 border hover:bg-slate-100 rounded-lg text-[10px] text-slate-500 font-bold"
                      >
                        {t.detailsBtn}
                      </button>
                    </div>
                  </div>
                ))}

                {/* 2. Trains List */}
                {transportMode === "train" && transits.map((tr) => (
                  <div
                    key={tr.id}
                    className={`p-3 border rounded-xl transition-all ${
                      selectedTransit?.id === tr.id ? "bg-primary-50 border-primary-500" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-indigo-500" /> {tr.train_name} ({tr.train_number})
                      </span>
                      <span className="font-extrabold text-slate-700">₹{tr.total_price_inr}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                      <span>{tr.departure_time} | {tr.travel_class}</span>
                      <span>{tr.duration_hrs} hrs</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setSelectedTransit(tr)}
                        className="flex-1 py-1.5 bg-primary-600 text-white font-bold rounded-lg text-[10px]"
                      >
                        Select Option
                      </button>
                      <button
                        onClick={() => setInspectingTransit(tr)}
                        className="px-2.5 py-1.5 border hover:bg-slate-100 rounded-lg text-[10px] text-slate-500 font-bold"
                      >
                        {t.detailsBtn}
                      </button>
                    </div>
                  </div>
                ))}

                {/* 3. Buses List */}
                {transportMode === "bus" && transits.map((b) => (
                  <div
                    key={b.id}
                    className={`p-3 border rounded-xl transition-all ${
                      selectedTransit?.id === b.id ? "bg-primary-50 border-primary-500" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-emerald-500" /> {b.operator}
                      </span>
                      <span className="font-extrabold text-slate-700">₹{b.total_price_inr}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                      <span className="truncate max-w-[130px]">{b.bus_type}</span>
                      <span>{b.duration_hrs} hrs</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setSelectedTransit(b)}
                        className="flex-1 py-1.5 bg-primary-600 text-white font-bold rounded-lg text-[10px]"
                      >
                        Select Option
                      </button>
                      <button
                        onClick={() => setInspectingTransit(b)}
                        className="px-2.5 py-1.5 border hover:bg-slate-100 rounded-lg text-[10px] text-slate-500 font-bold"
                      >
                        {t.detailsBtn}
                      </button>
                    </div>
                  </div>
                ))}

                {/* 4. Car / Self-Drive Route */}
                {transportMode === "self-drive" && transits.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedTransit(c)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedTransit?.id === c.id ? "bg-primary-50 border-primary-500" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 border-b pb-2 mb-2">
                      <Car className="text-primary-500 w-5 h-5" />
                      <h4 className="font-extrabold text-slate-800 text-xs">{t.carDetails}</h4>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{t.drivingDistance}</span>
                        <span className="font-bold text-slate-800">{c.driving_distance_km} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Duration</span>
                        <span className="font-bold text-slate-800">{c.duration_hrs} hrs</span>
                      </div>

                      {c.overnight_stay_required && (
                        <div className="p-2 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold rounded-lg flex items-center gap-1.5 mt-2">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Overnight stop recommended in midway town.</span>
                        </div>
                      )}

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setSelectedTransit(c); setShowRouteFactors(true); }}
                          className="w-full py-1.5 border bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Info className="w-3.5 h-3.5 text-primary-500" />
                          {t.viewFactorsBtn}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View More Options handler */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => alert("Connecting live Indian listings engines...")}
                  className="text-xs text-primary-500 hover:text-primary-600 font-bold underline"
                >
                  {t.viewMore}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-2 border rounded-xl text-xs font-bold text-slate-500"
                >
                  {t.back}
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedTransit}
                  className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                >
                  {t.next}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Choose Stay Hotel & Midway Hotels (if long drive) */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Midway stays section if overnight stop is flagged */}
              {transportMode === "self-drive" && selectedTransit?.overnight_stay_required && (
                <div className="space-y-2 border-b pb-3.5">
                  <h4 className="font-extrabold text-amber-800 text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" /> {t.midwaySelect} ({midwayCityName})
                  </h4>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {midwayHotels.map((mh) => (
                      <div
                        key={mh.id}
                        onClick={() => setSelectedMidwayHotel(mh)}
                        className={`p-2.5 border rounded-lg cursor-pointer text-[10px] transition-all flex items-center ${
                          selectedMidwayHotel?.id === mh.id ? "bg-amber-50 border-amber-500 text-amber-900" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        {mh.image_url && (
                          <img
                            src={mh.image_url}
                            alt={mh.name}
                            className="w-12 h-12 object-cover rounded-lg mr-2.5"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="font-bold block truncate">{mh.name}</span>
                          <span className="text-slate-400 text-[9px]">{mh.star_rating} ⭐ Rating</span>
                        </div>
                        <span className="font-bold text-slate-700 ml-1">₹{mh.cost_inr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="font-extrabold text-slate-800 text-xs">{t.selectHotel}</h3>
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {hotels.map((h) => (
                  <div
                    key={h.id}
                    className={`p-3 border rounded-xl transition-all flex ${
                      selectedHotel?.id === h.id ? "bg-primary-50 border-primary-500" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    {h.image_url && (
                      <img
                        src={h.image_url}
                        alt={h.name}
                        className="w-20 h-20 object-cover rounded-lg mr-3 my-auto"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1 truncate mr-1">
                          <HotelHome className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" /> {h.name}
                        </span>
                        <span className="font-extrabold text-slate-700 flex-shrink-0">₹{h.total_stay_cost_inr}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                        <span>{h.star_rating} ⭐ {h.is_estimated ? `(${t.estimatedBadge})` : ""}</span>
                        <span>₹{h.cost_inr} / night</span>
                      </div>
                      <div className="flex gap-2 mt-2.5">
                        <button
                          onClick={() => setSelectedHotel(h)}
                          className="flex-1 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg text-[10px]"
                        >
                          Select Option
                        </button>
                        <button
                          onClick={() => setInspectingHotel(h)}
                          className="px-2.5 py-1.5 border bg-white hover:bg-slate-100 rounded-lg text-[10px] text-slate-500 font-bold"
                        >
                          {t.detailsBtn}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-2 border rounded-xl text-xs font-bold text-slate-500"
                >
                  {t.back}
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!selectedHotel || (selectedTransit?.overnight_stay_required && !selectedMidwayHotel)}
                  className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
                >
                  {t.next}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Preferences & Options */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-800 text-xs">{t.step4Title}</h3>
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{t.pace}</label>
                <div className="grid grid-cols-3 gap-2">
                  {["relaxed", "moderate", "fast"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPace(p)}
                      className={`py-1.5 border text-xs font-bold rounded-lg capitalize transition-all ${
                        pace === p ? "bg-primary-50 border-primary-500 text-primary-700" : "bg-white text-slate-500"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t pt-3">
                <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">{t.interests}</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_INTERESTS.map((item) => {
                    const active = interests.includes(item.id);
                    const label = lang === "en" ? item.label_en : item.label_hi;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleInterestToggle(item.id)}
                        className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all ${
                          active ? "bg-primary-500 border-primary-600 text-white" : "bg-white text-slate-500"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-2 border rounded-xl text-xs font-bold text-slate-500"
                >
                  {t.back}
                </button>
                <button
                  onClick={handleSolve}
                  disabled={solveLoading}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  {solveLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  {t.generateBtn}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Finalized View Summary */}
          {step === 5 && itinerary && (
            <div className="space-y-4 animate-fade-in text-xs">
              <h3 className="font-extrabold text-slate-800 text-sm border-b pb-2 flex items-center gap-1">
                <CheckCircle className="text-emerald-500 w-4 h-4" /> Active Plan Confirmed
              </h3>

              <div className="p-3 bg-slate-50 border rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">{t.transitMode}</span>
                  <span className="font-bold text-primary-600 uppercase">{transportMode} ({derivedSpecs.model})</span>
                </div>
                {selectedMidwayHotel && (
                  <div className="flex justify-between items-center border-t pt-1.5">
                    <span className="font-bold text-slate-700">Midway Stay</span>
                    <span className="font-bold text-amber-600 truncate max-w-[150px]">{selectedMidwayHotel.name}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t pt-1.5">
                  <span className="font-bold text-slate-700">{t.hotelSelected}</span>
                  <span className="font-bold text-amber-600 truncate max-w-[150px]">{selectedHotel?.name}</span>
                </div>
              </div>

              <button
                onClick={() => setStep(4)}
                className="w-full py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Modify Selections & Re-optimize
              </button>
            </div>
          )}
        </div>

        {/* Right Output Panel: Itinerary Accordion & Map */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Permanent Parameter overview header */}
          <div className="bg-slate-100/80 border p-4 rounded-xl flex flex-wrap justify-between items-center text-xs gap-3">
            <div>
              <span className="text-slate-400 block font-bold uppercase text-[9px]">{t.origin} ➔ {t.destination}</span>
              <span className="font-bold text-slate-800">{origin} ➔ {destination || "N/A"}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold uppercase text-[9px]">{t.dates}</span>
              <span className="font-bold text-slate-800">{depDate} ➔ {retDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold uppercase text-[9px]">{t.travelers}</span>
              <span className="font-bold text-slate-800">{travelers} {t.peopleUnit}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold uppercase text-[9px]">{t.allocatedBudget}</span>
              <span className="font-bold text-slate-800">₹{budget}</span>
            </div>
          </div>

          {!itinerary && (
            <div className="h-[400px] bg-white border rounded-2xl flex flex-col items-center justify-center text-center p-8">
              <Compass className="text-slate-300 w-12 h-12 mb-3 animate-bounce" />
              <h3 className="font-bold text-slate-800 text-sm">No Active Itinerary</h3>
              <p className="text-slate-500 text-xs max-w-xs mt-1">{t.noPlanYet}</p>
            </div>
          )}

          {itinerary && (
            <div className="space-y-6">
              
              {/* Cost Header breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                  <span className="text-[10px] text-slate-400 font-extrabold tracking-wider block uppercase">{t.allocatedBudget}</span>
                  <span className="text-md font-extrabold text-slate-800 flex items-center mt-0.5">
                    <IndianRupee className="w-4 h-4" /> {itinerary.cost_breakdown.allocated_budget}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-l-4 border-l-emerald-500 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-extrabold tracking-wider block uppercase">{t.estimatedCost}</span>
                  <span className="text-md font-extrabold text-slate-800 flex items-center mt-0.5">
                    <IndianRupee className="w-4 h-4" /> {itinerary.total_cost_inr}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                  <span className="text-[10px] text-slate-400 font-extrabold tracking-wider block uppercase">{t.remainingBalance}</span>
                  <span className="text-md font-extrabold text-slate-800 flex items-center mt-0.5">
                    <IndianRupee className="w-4 h-4" /> {itinerary.cost_breakdown.remaining_balance}
                  </span>
                </div>
              </div>

              {/* Tabulated Cost details */}
              <div className="bg-white p-4 rounded-xl border shadow-sm space-y-2 text-xs">
                <h4 className="font-extrabold text-slate-800">{t.distributeBudget}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                  <div>
                    <span className="text-slate-400 block">{t.stayCost}</span>
                    <span className="font-bold text-slate-800">₹{itinerary.cost_breakdown.stays}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{t.transportCost}</span>
                    <span className="font-bold text-slate-800">₹{itinerary.cost_breakdown.transport}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{t.foodCost}</span>
                    <span className="font-bold text-slate-800">₹{itinerary.cost_breakdown.food}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{t.ticketCost}</span>
                    <span className="font-bold text-slate-800">₹{itinerary.cost_breakdown.activities}</span>
                  </div>
                </div>
              </div>

              {/* Gemini evaluation summary */}
              <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 border-b pb-2 mb-2.5">
                  <HeartHandshake className="text-primary-500 w-4 h-4" /> {t.explanation}
                </h3>
                <div className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">
                  {itinerary.explanation}
                </div>
              </div>

              {/* Timeline & Maps */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* Timeline Accordion with Flexible Day Slots */}
                <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-3">
                  <h3 className="text-sm font-extrabold text-slate-800 border-b pb-2">Itinerary Timeline</h3>
                  <div className="space-y-2">
                    {itinerary.days.map((day: any) => {
                      const isExpanded = expandedDay === day.day_number;
                      return (
                        <div key={day.day_number} className="border rounded-xl overflow-hidden">
                          <button
                            onClick={() => setExpandedDay(isExpanded ? null : day.day_number)}
                            className="w-full bg-slate-50 hover:bg-slate-100 p-3 flex justify-between items-center text-xs font-extrabold text-slate-700 border-b"
                          >
                            <span>DAY {day.day_number}</span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {day.schedule.length} items (click to toggle)
                            </span>
                          </button>

                          {isExpanded && (
                            <div className="p-3 space-y-3 bg-white divide-y">
                              {day.schedule.map((item: any, idx: number) => {
                                const isLogistics = item.category === "logistics";
                                const isFood = item.category === "food";
                                return (
                                  <div key={idx} className="pt-2.5 first:pt-0 text-xs flex justify-between items-start gap-3">
                                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                      {item.image_url && (
                                        <img
                                          src={item.image_url}
                                          alt={item.name}
                                          className="w-12 h-12 object-cover rounded-lg mt-1 flex-shrink-0"
                                        />
                                      )}
                                      <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className={`text-[9px] font-bold px-1 py-0.5 rounded uppercase ${
                                            isLogistics ? "bg-slate-200 text-slate-700" : isFood ? "bg-emerald-100 text-emerald-800" : "bg-primary-50 text-primary-700"
                                          }`}>
                                            {isLogistics ? t.logisticsTitle : isFood ? t.foodTitle : t.interests}
                                          </span>
                                          <span className="text-[10px] text-slate-400">({item.start_time})</span>
                                        </div>
                                        <h5 className="font-extrabold text-slate-800 text-xs flex items-center gap-1 truncate">
                                          {item.name} {item.rating ? <span className="text-[10px] text-amber-500 font-normal flex-shrink-0">({item.rating} ⭐)</span> : ""}
                                        </h5>
                                        {item.description && <p className="text-[10px] text-slate-400">{item.description}</p>}
                                      </div>
                                    </div>
                                    {item.cost_inr > 0 && (
                                      <span className="text-[9px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">
                                        ₹{item.cost_inr}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Map Display showing Flight and ground path */}
                <div className="bg-white p-5 rounded-2xl border shadow-sm h-full flex flex-col justify-between">
                  <h3 className="text-sm font-extrabold text-slate-800 border-b pb-2 mb-3">Map & Journey route</h3>
                  <div className="flex-1">
                    <MapComponent
                      hotel={itinerary.selected_hotel}
                      days={itinerary.days}
                      emergencyServices={emergencyServices.length > 0 ? emergencyServices : null}
                      flight={transportMode === "flight" ? selectedTransit : null}
                    />
                  </div>
                </div>

              </div>

              {/* Checkout Book */}
              <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs">{t.bookBtn}</h4>
                  <p className="text-[9px] text-slate-400">Razorpay Payment Simulator</p>
                </div>
                <button
                  onClick={() => { setShowPayment(true); setPaySuccess(false); }}
                  className="px-5 py-2 bg-primary-500 hover:bg-primary-600 rounded-xl text-xs font-bold"
                >
                  Pay ₹{itinerary.total_cost_inr}
                </button>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Route Factors popup drawer */}
      {showRouteFactors && selectedTransit && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative space-y-4">
            <button onClick={() => setShowRouteFactors(false)} className="absolute right-4 top-4 p-1 hover:bg-slate-100 rounded-full">
              <X className="w-5 h-5 text-slate-400" />
            </button>
            <div className="border-b pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <Info className="text-primary-500 w-4 h-4" /> {t.factorTitle} (8 Factors Analyzed)
              </h3>
            </div>
            
            <div className="space-y-3.5 text-xs max-h-[360px] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-2.5 bg-slate-50 border rounded-lg">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase">Total Distance</span>
                  <span className="font-bold text-slate-800 block text-xs">{selectedTransit.driving_distance_km} km</span>
                </div>
                <div className="p-2.5 bg-slate-50 border rounded-lg">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase">Driving Duration</span>
                  <span className="font-bold text-slate-800 block text-xs">{selectedTransit.duration_hrs} hours</span>
                </div>
              </div>

              {/* State Fuel Rate Table */}
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="bg-slate-100 px-3 py-1.5 text-[10px] font-extrabold text-slate-700 flex justify-between">
                  <span>State Border Fuel Rates ({selectedTransit.fuel_info.location})</span>
                  <span>Source</span>
                </div>
                <div className="p-3 flex justify-between text-xs font-bold text-slate-800">
                  <span className="capitalize">{derivedSpecs.fuel_type.replace("_", " ")}: ₹{selectedTransit.fuel_info.price_per_unit} / unit</span>
                  <span className="text-slate-400 font-medium text-[10px]">{selectedTransit.fuel_info.source}</span>
                </div>
              </div>

              {/* Toll plazas details table */}
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="bg-slate-100 px-3 py-1.5 text-[10px] font-extrabold text-slate-700 flex justify-between">
                  <span>Toll Plaza Crossings</span>
                  <span>Single-way Fee</span>
                </div>
                <div className="divide-y">
                  {selectedTransit.toll_plazas.map((toll: any, tIdx: number) => (
                    <div key={tIdx} className="p-2 px-3 flex justify-between text-xs text-slate-600">
                      <span>{toll.name}</span>
                      <span className="font-bold text-slate-800">₹{toll.fee_inr}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 p-2.5 px-3 text-xs font-extrabold text-slate-800 border-t flex justify-between">
                  <span>Total Tolls Cost</span>
                  <span>₹{selectedTransit.total_toll_cost_inr}</span>
                </div>
              </div>

              {/* suggested road stops */}
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="bg-slate-100 px-3 py-1.5 text-[10px] font-extrabold text-slate-700">
                  {t.restStops}
                </div>
                <div className="divide-y">
                  {selectedTransit.suggested_rest_stops.map((stop: any, sIdx: number) => (
                    <div key={sIdx} className="p-2.5 px-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block">{stop.name} (approx {stop.dist_km} km)</span>
                        <span className="text-slate-400 text-[10px]">{stop.cuisine}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {stop.price_level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowRouteFactors(false)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              {t.closeBtn}
            </button>
          </div>
        </div>
      )}

      {/* Transit Inspector Modal Overlay */}
      {inspectingTransit && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative space-y-4">
            <button onClick={() => setInspectingTransit(null)} className="absolute right-4 top-4 p-1 hover:bg-slate-100 rounded-full">
              <X className="w-5 h-5 text-slate-400" />
            </button>
            <div className="border-b pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <Info className="text-primary-500 w-4 h-4" /> Transit Details Inspection
              </h3>
            </div>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Transit Category</span>
                <span className="font-bold text-slate-800 uppercase">{transportMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Name / Operator</span>
                <span className="font-bold text-slate-800">{inspectingTransit.airline || inspectingTransit.train_name || inspectingTransit.operator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Number / Class</span>
                <span className="font-bold text-slate-800">{inspectingTransit.flight_number || inspectingTransit.train_number || inspectingTransit.bus_type}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-slate-400">Departure Time</span>
                <span className="font-bold text-slate-800">{inspectingTransit.departure_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Arrival Time</span>
                <span className="font-bold text-slate-800">{inspectingTransit.arrival_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t.delayRateLabel}</span>
                <span className="font-bold text-red-600">{inspectingTransit.delay_rate} delay average</span>
              </div>
              {inspectingTransit.baggage && (
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.baggageLabel}</span>
                  <span className="font-bold text-slate-800">{inspectingTransit.baggage}</span>
                </div>
              )}
              <div className="border-t pt-2 space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase">Traveler Reviews</span>
                {inspectingTransit.reviews?.map((r: string, rIdx: number) => (
                  <p key={rIdx} className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded">
                    "{r}"
                  </p>
                ))}
              </div>
            </div>
            <button
              onClick={() => { setSelectedTransit(inspectingTransit); setInspectingTransit(null); }}
              className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold"
            >
              Select This Transit
            </button>
          </div>
        </div>
      )}

      {/* Hotel Inspector Modal Overlay */}
      {inspectingHotel && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative space-y-4">
            <button onClick={() => setInspectingHotel(null)} className="absolute right-4 top-4 p-1 hover:bg-slate-100 rounded-full">
              <X className="w-5 h-5 text-slate-400" />
            </button>
            <div className="border-b pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <HotelHome className="text-amber-500 w-4 h-4" /> Hotel Details Inspection
              </h3>
            </div>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Hotel Name</span>
                <span className="font-bold text-slate-800">{inspectingHotel.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Comfort Class</span>
                <span className="font-bold text-slate-800">{inspectingHotel.star_rating} ⭐ Star</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nightly rate (base)</span>
                <span className="font-bold text-slate-800">₹{inspectingHotel.cost_inr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Stay cost ({t.travelers})</span>
                <span className="font-bold text-primary-600">₹{inspectingHotel.total_stay_cost_inr}</span>
              </div>
              <div className="border-t pt-2">
                <span className="text-[10px] text-slate-400 font-extrabold block uppercase mb-1">Amenities Included</span>
                <div className="flex flex-wrap gap-1">
                  {inspectingHotel.amenities?.map((am: string, amIdx: number) => (
                    <span key={amIdx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] uppercase font-semibold">
                      {am}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t pt-2 space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase">Guest Reviews</span>
                {inspectingHotel.reviews?.map((r: string, rIdx: number) => (
                  <p key={rIdx} className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded">
                    "{r}"
                  </p>
                ))}
              </div>
            </div>
            <button
              onClick={() => { setSelectedHotel(inspectingHotel); setInspectingHotel(null); }}
              className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold"
            >
              Select This Hotel
            </button>
          </div>
        </div>
      )}

      {/* SOS Active Modal */}
      {showSOS && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative space-y-4">
            <button onClick={() => setShowSOS(false)} className="absolute right-4 top-4 p-1 hover:bg-slate-100 rounded-full">
              <X className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h3 className="text-md font-extrabold text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="text-red-600 w-5 h-5 animate-pulse" /> {t.sosTitle}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">{t.sosSub}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleSOS("breakdown")}
                className={`p-3 border rounded-xl flex flex-col items-center gap-1 text-[9px] font-bold ${
                  sosType === "breakdown" ? "bg-red-50 border-red-500 text-red-700" : "bg-white text-slate-600"
                }`}
              >
                <Wrench className="w-4 h-4" /> {t.breakdownOpt}
              </button>
              <button
                onClick={() => handleSOS("medical")}
                className={`p-3 border rounded-xl flex flex-col items-center gap-1 text-[9px] font-bold ${
                  sosType === "medical" ? "bg-red-50 border-red-500 text-red-700" : "bg-white text-slate-600"
                }`}
              >
                <Activity className="w-4 h-4" /> {t.medicalOpt}
              </button>
              <button
                onClick={() => handleSOS("police")}
                className={`p-3 border rounded-xl flex flex-col items-center gap-1 text-[9px] font-bold ${
                  sosType === "police" ? "bg-red-50 border-red-500 text-red-700" : "bg-white text-slate-600"
                }`}
              >
                <AlertCircle className="w-4 h-4" /> {t.policeOpt}
              </button>
            </div>

            {sosLoading && (
              <div className="py-4 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-red-600" /></div>
            )}

            {!sosLoading && sosType && (
              <div className="space-y-2 border-t pt-3 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wide">Nearby help found:</span>
                <div className="max-h-[140px] overflow-y-auto space-y-1">
                  {emergencyServices.map((serv, idx) => (
                    <div key={idx} className="p-2 bg-red-50/50 border rounded-xl flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-800 block">{serv.name}</span>
                        <span className="text-[9px] text-slate-400 capitalize">{serv.type}</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-red-700">{serv.distance_km} km</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Razorpay checkout modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 border-b pb-2">{t.paymentTitle}</h3>
            {paySuccess ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-slate-900 text-xs">{t.paymentSuccess}</h4>
                <div className="p-2 bg-slate-50 rounded text-[9px] font-bold text-slate-600">{t.refNo}: {payRef}</div>
                <button onClick={() => setShowPayment(false)} className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">
                  {t.closeBtn}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setShowPayment(false)} className="flex-1 py-2 border rounded-xl font-bold text-xs text-slate-500">Cancel</button>
                <button onClick={triggerPayment} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs">
                  Authorize ₹{itinerary?.total_cost_inr}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
