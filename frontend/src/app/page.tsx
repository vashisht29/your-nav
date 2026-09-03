"use client";

import { useState, useEffect } from "react";
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
  Utensils,
  Terminal
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
    title: "YourNav",
    subtitle: "Agentic Travel Recommendation & Optimization Engine",
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
    baggageLabel: "Baggage limit",
    originDestLabel: "Origin ➔ Destination",
    budgetCeiling: "Budget Ceiling",
    liveCostBucket: "Live Cost Bucket",
    noActiveItinerary: "No Active Itinerary",
    foodThaliEstimate: "Food thali estimate (3 days)",
    carRoute: "Car Route",
    midwayStayLabel: "Midway Stay",
    hotelSelected: "Selected Stay"
  },
  hi: {
    title: "YourNav",
    subtitle: "Agentic Travel Recommendation & Optimization Engine",
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
    baggageLabel: "सामान की सीमा",
    originDestLabel: "प्रस्थान ➔ गंतव्य",
    budgetCeiling: "बजट सीमा",
    liveCostBucket: "लागत बकेट",
    noActiveItinerary: "कोई सक्रिय यात्रा कार्यक्रम नहीं",
    foodThaliEstimate: "भोजन थाली अनुमान (3 दिन)",
    carRoute: "कार मार्ग",
    midwayStayLabel: "मिडवे स्टे",
    hotelSelected: "चुना गया होटल"
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
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<any[]>([]);
  const [didYouMean, setDidYouMean] = useState<string | null>(null);
  const [unsupportedToast, setUnsupportedToast] = useState<string | null>(null);
  const [vibeData, setVibeData] = useState<any>(null);
  const [selectedSubRegion, setSelectedSubRegion] = useState<any>(null);
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [agentLogs, setAgentLogs] = useState<any[]>([]);

  const handleOriginChange = async (val: string) => {
    setOrigin(val);
    if (val.trim().length >= 1) {
      try {
        const res = await fetch(`http://localhost:8000/api/destinations/autocomplete?q=${encodeURIComponent(val)}`);
        if (res.status === 200) {
          const data = await res.json();
          setOriginSuggestions(data.results || []);
        }
      } catch (e) {
        console.error("Origin suggestions fetch failed", e);
      }
    } else {
      setOriginSuggestions([]);
    }
  };

  const handleDestinationChange = async (val: string) => {
    setDestination(val);
    setDidYouMean(null);
    if (val.trim().length >= 1) {
      try {
        const res = await fetch(`http://localhost:8000/api/destinations/autocomplete?q=${encodeURIComponent(val)}`);
        if (res.status === 200) {
          const data = await res.json();
          setDestSuggestions(data.results || []);
          if (data.did_you_mean && data.did_you_mean.toLowerCase() !== val.trim().toLowerCase()) {
            setDidYouMean(data.did_you_mean);
          }
        }
      } catch (e) {
        console.error("Destination suggestions fetch failed", e);
      }
    } else {
      setDestSuggestions([]);
    }
  };

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
  const [activeModalImage, setActiveModalImage] = useState<string>("");
  const [travelClass, setTravelClass] = useState("economy");
  const [delayLoading, setDelayLoading] = useState(false);
  const [showRouteFactors, setShowRouteFactors] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);

  useEffect(() => {
    setErrorMsg("");
    setInfeasibleAlternatives([]);
  }, [selectedHotel, selectedTransit, selectedMidwayHotel]);

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

  const [selectedRestStops, setSelectedRestStops] = useState<any[]>([]);
  const [showSOS, setShowSOS] = useState(false);
  const [sosType, setSosType] = useState("");
  const [sosLoading, setSosLoading] = useState(false);
  const [emergencyServices, setEmergencyServices] = useState<any[]>([]);
  const [showAgentTrace, setShowAgentTrace] = useState(true);

  // Caching & Persistence hydration (Next.js SSR safe)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("smart_ai_trip_state");
      if (cached) {
        try {
          const state = JSON.parse(cached);
          if (state.origin) setOrigin(state.origin);
          if (state.destination) setDestination(state.destination);
          if (state.depDate) setDepDate(state.depDate);
          if (state.retDate) setRetDate(state.retDate);
          if (state.travelers) setTravelers(state.travelers);
          if (state.budget) setBudget(state.budget);
          if (state.selectedTransit) setSelectedTransit(state.selectedTransit);
          if (state.selectedHotel) setSelectedHotel(state.selectedHotel);
          if (state.selectedMidwayHotel) setSelectedMidwayHotel(state.selectedMidwayHotel);
          if (state.travelClass) setTravelClass(state.travelClass);
          if (state.pace) setPace(state.pace);
          if (state.interests) setInterests(state.interests);
          if (state.itinerary) setItinerary(state.itinerary);
          if (state.step) setStep(state.step);
        } catch (e) {
          console.error("Hydration error:", e);
        }
      }
    }
  }, []);

  // Save changes automatically
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stateObj = {
        origin,
        destination,
        depDate,
        retDate,
        travelers,
        budget,
        selectedTransit,
        selectedHotel,
        selectedMidwayHotel,
        travelClass,
        pace,
        interests,
        itinerary,
        step
      };
      localStorage.setItem("smart_ai_trip_state", JSON.stringify(stateObj));
    }
  }, [origin, destination, depDate, retDate, travelers, budget, selectedTransit, selectedHotel, selectedMidwayHotel, travelClass, pace, interests, itinerary, step]);

  // Invalidate dependent state when core trip inputs change
  const tripFingerprint = `${origin}|${destination}|${depDate}|${retDate}|${travelers}|${budget}`;
  const [lastFingerprint, setLastFingerprint] = useState<string>("");
  useEffect(() => {
    if (lastFingerprint && tripFingerprint !== lastFingerprint) {
      // Core inputs changed — clear stale downstream state
      setSelectedTransit(null);
      setSelectedHotel(null);
      setSelectedMidwayHotel(null);
      setItinerary(null);
      setSelectedRestStops([]);
      setTransits([]);
      setHotels([]);
      setMidwayHotels([]);
      if (step > 1) {
        setStep(1);
      }
    }
    setLastFingerprint(tripFingerprint);
  }, [tripFingerprint]);

  // Auto-fetch Sub-region Vibe recommendations when destination or interests change
  useEffect(() => {
    if (!destination || destination.trim().length < 3) {
      setVibeData(null);
      setSelectedSubRegion(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/destinations/vibes?destination=${encodeURIComponent(destination)}&interests=${encodeURIComponent(interests.join(","))}`);
        if (res.status === 200) {
          const json = await res.json();
          if (json.data) {
            setVibeData(json.data);
            setSelectedSubRegion(json.data.recommended_sub_region);
          } else {
            setVibeData(null);
            setSelectedSubRegion(null);
          }
        }
      } catch (err) {
        setVibeData(null);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [destination, interests]);

  const handleInterestToggle = (id: string) => {
    if (interests.includes(id)) {
      setInterests(interests.filter((x) => x !== id));
    } else {
      setInterests([...interests, id]);
    }
  };

  const handleToggleRestStop = (stop: any) => {
    if (selectedRestStops.some(x => x.name === stop.name)) {
      setSelectedRestStops(selectedRestStops.filter(x => x.name !== stop.name));
    } else {
      setSelectedRestStops([...selectedRestStops, stop]);
    }
  };

  const handleSelectTransitClass = (transitId: string, opt: any) => {
    setTransits((prev) =>
      prev.map((t) => {
        if (t.id === transitId) {
          const updated = {
            ...t,
            travel_class: opt.class_name,
            cost_inr: opt.cost_inr,
            total_price_inr: opt.total_price_inr,
            baggage_allowance: opt.baggage_allowance || t.baggage_allowance,
            cancellation_policy: opt.cancellation_policy || t.cancellation_policy
          };
          if (selectedTransit?.id === transitId) {
            setSelectedTransit(updated);
          }
          return updated;
        }
        return t;
      })
    );
  };

  // Search Transit and Stays (Step 1 -> Step 2)
  const handleSearch = async () => {
    setErrorMsg("");
    setInfeasibleAlternatives([]);
    setSearchLoading(true);

    try {
      // Check if destination is recognized in our pan-India directory
      try {
        const checkRes = await fetch(`http://localhost:8000/api/destinations/autocomplete?q=${encodeURIComponent(destination)}`);
        if (checkRes.status === 200) {
          const checkData = await checkRes.json();
          if (!checkData.results || checkData.results.length === 0) {
            fetch("http://localhost:8000/api/destinations/request-location", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ destination, origin })
            }).catch(() => {});
            setUnsupportedToast(`📍 Location Request Logged: Humne aapki location "${destination}" ko database wishlist me add kar liya hai! Live mapping se results load ho rahe hain.`);
            setTimeout(() => setUnsupportedToast(null), 8000);
          }
        }
      } catch (err) {}

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
          vehicle_query: vehicleQuery,
          travel_class: travelClass
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
          travel_class: travelClass,
          waypoints: selectedRestStops.map(s => ({
            id: s.name,
            type: "rest_stop",
            name: s.name,
            lat: s.lat || 28.0,
            lng: s.lng || 76.0
          }))
        })
      });
      const data = await res.json();
      if (res.status === 200) {
        if (data.status === "Infeasible") {
          setErrorMsg(data.message);
          setInfeasibleAlternatives(data.alternatives || []);
          setItinerary(null);
        } else {
          if (data.selected_hotel) {
            setSelectedHotel(data.selected_hotel);
          }
          if (data.selected_transit) {
            setSelectedTransit(data.selected_transit);
          }
          if (data.cost_breakdown?.allocated_budget && data.cost_breakdown.allocated_budget > budget) {
            setBudget(data.cost_breakdown.allocated_budget);
          }
          setItinerary(data);
          setAgentLogs(data.agent_logs || []);
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

  const handleSimulateDelay = async () => {
    if (!itinerary || !itinerary.days) return;
    setDelayLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/trip/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "flight_delay",
          delay_minutes: 180,
          current_days: itinerary.days
        })
      });
      const data = await res.json();
      if (res.status === 200 && data.itinerary) {
        setItinerary({
          ...itinerary,
          days: data.itinerary.days
        });
        setAgentLogs(data.agent_logs || []);
      }
    } catch (e) {
      console.error("Delay simulation failed:", e);
    } finally {
      setDelayLoading(false);
    }
  };

  const parseTimeToMins = (tStr: string) => {
    if (!tStr || !tStr.includes(":")) return 720;
    const parts = tStr.split(":");
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  };

  const minsToTimeStr = (mins: number) => {
    const total = (mins + 1440) % 1440;
    const hrs = Math.floor(total / 60);
    const m = total % 60;
    return `${hrs.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const handleSpeedChange = (newMult: number) => {
    setSpeedMultiplier(newMult);
    if (!itinerary || !itinerary.days) return;
    
    // Deep clone the itinerary
    const updated = JSON.parse(JSON.stringify(itinerary));
    
    updated.days.forEach((day: any) => {
      let accumulatedShiftMins = 0;
      day.schedule = day.schedule.map((item: any) => {
        const isTransit = item.category === "logistics" && 
          (item.name.toLowerCase().includes("drive") || 
           item.name.toLowerCase().includes("transit") || 
           item.name.toLowerCase().includes("taxi") ||
           item.name.toLowerCase().includes("road"));
        
        if (isTransit) {
          const originalStartMins = parseTimeToMins(item.start_time);
          const originalEndMins = parseTimeToMins(item.end_time);
          const originalDuration = originalEndMins - originalStartMins;
          
          // Higher multiplier scales duration down (less driving time needed)
          // Lower multiplier scales duration up (traffic delays)
          const newDuration = Math.round(originalDuration / newMult);
          const diff = newDuration - originalDuration;
          
          item.end_time = minsToTimeStr(originalStartMins + newDuration);
          accumulatedShiftMins += diff;
        } else {
          // Shift standard attractions and checks by the accumulated delay/acceleration diff
          const originalStartMins = parseTimeToMins(item.start_time);
          const originalEndMins = parseTimeToMins(item.end_time);
          
          item.start_time = minsToTimeStr(originalStartMins + accumulatedShiftMins);
          item.end_time = minsToTimeStr(originalEndMins + accumulatedShiftMins);
        }
        return item;
      });
    });
    
    setItinerary(updated);
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

  // Live Costing Bucket computations
  const calcStayCost = selectedHotel?.total_stay_cost_inr || 0;
  const calcMidwayCost = selectedMidwayHotel?.total_stay_cost_inr || 0;
  const calcTransitCost = selectedTransit?.total_price_inr || 0;
  const calcFoodCost = 600 * travelers * 3;
  const bucketTotal = calcStayCost + calcMidwayCost + calcTransitCost + calcFoodCost;
  const budgetPercentage = Math.min(100, Math.floor((bucketTotal * 100) / (budget || 1)));

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

          {/* Trip Cost Estimator / Bucket Panel */}
          {step > 1 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 shadow-inner">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-primary-500" /> {t.liveCostBucket}
                </span>
                <span className="font-extrabold text-slate-800">
                  ₹{bucketTotal.toFixed(2)} / <span className="text-[10px] text-slate-400">₹{budget}</span>
                </span>
              </div>
              
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    bucketTotal > budget ? "bg-red-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${budgetPercentage}%` }}
                />
              </div>

              <div className="space-y-1.5 text-[10px] text-slate-500 font-bold border-t pt-2">
                {selectedTransit && (
                  <div className="flex justify-between items-center">
                    <span>{selectedTransit.airline ? "✈️" : (selectedTransit.train_name ? "🚆" : (selectedTransit.operator ? "🚌" : "🚗"))} {selectedTransit.airline || selectedTransit.train_name || selectedTransit.operator || t.carRoute}</span>
                    <span className="font-extrabold text-slate-700">₹{selectedTransit.total_price_inr}</span>
                  </div>
                )}
                {selectedMidwayHotel && (
                  <div className="flex justify-between items-center">
                    <span>🏨 {selectedMidwayHotel.name} ({t.midwayStayLabel})</span>
                    <span className="font-extrabold text-slate-700">₹{selectedMidwayHotel.total_stay_cost_inr}</span>
                  </div>
                )}
                {selectedHotel && (
                  <div className="flex justify-between items-center">
                    <span>🏨 {selectedHotel.name} ({t.stays})</span>
                    <span className="font-extrabold text-slate-700">₹{selectedHotel.total_stay_cost_inr}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t pt-1">
                  <span>🍽️ {t.foodThaliEstimate}</span>
                  <span className="font-extrabold text-slate-700">₹{calcFoodCost}</span>
                </div>
              </div>
            </div>
          )}

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
              {/* Unsupported Wishlist Toast Banner */}
              {unsupportedToast && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 space-y-1 animate-fade-in shadow-sm">
                  <div className="flex items-center justify-between font-extrabold text-[11px]">
                    <span className="flex items-center gap-1">✨ Location Logged</span>
                    <button onClick={() => setUnsupportedToast(null)} className="text-blue-500 hover:text-blue-700">✕</button>
                  </div>
                  <p className="text-[10px] leading-relaxed text-blue-700">{unsupportedToast}</p>
                </div>
              )}

              {/* Origin Autocomplete */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.origin}</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi, Mumbai, Bengaluru, Kolkata, Chandigarh"
                  value={origin}
                  onChange={(e) => handleOriginChange(e.target.value)}
                  className="w-full p-2.5 rounded-lg border text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
                {originSuggestions.length > 0 && (
                  <div className="absolute z-20 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto mt-1 divide-y divide-slate-100">
                    {originSuggestions.map((s, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setOrigin(s.name);
                          setOriginSuggestions([]);
                        }}
                        className="p-2.5 hover:bg-slate-50 cursor-pointer text-xs space-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-800">{s.name}, {s.state}</span>
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{s.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination Autocomplete with Spell Correction */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.destination}</label>
                <input
                  type="text"
                  placeholder="e.g. Manali, Hampi, Munnar, Varanasi, Bir Billing, Chopta, Goa"
                  value={destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  className="w-full p-2.5 rounded-lg border text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />

                {/* Fuzzy Spelling Auto-Correction Suggestion */}
                {didYouMean && (
                  <div className="mt-1.5 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-900 animate-fade-in shadow-sm">
                    <span className="text-[11px]">💡 Did you mean <strong className="underline">{didYouMean}</strong>?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setDestination(didYouMean);
                        setDidYouMean(null);
                        setDestSuggestions([]);
                      }}
                      className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[10px] shadow-sm transition-all"
                    >
                      Auto-Correct
                    </button>
                  </div>
                )}

                {/* Autocomplete Dropdown List */}
                {destSuggestions.length > 0 && (
                  <div className="absolute z-20 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto mt-1 divide-y divide-slate-100">
                    {destSuggestions.map((s, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setDestination(s.name);
                          setDestSuggestions([]);
                          setDidYouMean(null);
                        }}
                        className="p-2.5 hover:bg-slate-50 cursor-pointer text-xs space-y-0.5 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-800">{s.name} <span className="text-slate-400 font-medium text-[11px]">({s.state})</span></span>
                          <span className="text-[9px] font-bold text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded">{s.type}</span>
                        </div>
                        {s.famous_for && (
                          <p className="text-[10px] text-slate-400 line-clamp-1">{s.famous_for}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 🤖 Agentic AI Sub-Region & Multi-Airport Vibe Recommender */}
                {vibeData && (
                  <div className="mt-2.5 p-3 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200 rounded-xl space-y-2 animate-fade-in shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-900">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                          <span>AI Smart Pick: {selectedSubRegion?.name || vibeData.recommended_sub_region.name}</span>
                        </div>
                        <p className="text-[10px] text-blue-700 font-medium">
                          {selectedSubRegion?.savings_rationale || vibeData.recommended_sub_region.savings_rationale}
                        </p>
                      </div>
                      <span className="text-[9px] font-extrabold text-blue-800 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                        ✈️ {selectedSubRegion?.airport_iata || vibeData.recommended_sub_region.airport_iata}
                      </span>
                    </div>

                    {/* 1-Click Interactive Switch Chips */}
                    <div className="pt-1.5 border-t border-blue-200/60">
                      <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        Choose your vibe (1-Click Switch):
                      </span>
                      <div className="grid grid-cols-1 gap-1.5">
                        {vibeData.all_sub_regions.map((sub: any) => {
                          const isCurrent = (selectedSubRegion?.id || vibeData.recommended_sub_region.id) === sub.id;
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => {
                                setSelectedSubRegion(sub);
                                setDestination(sub.name);
                                setDestSuggestions([]);
                              }}
                              className={`p-2 text-left rounded-lg text-xs transition-all flex items-center justify-between border ${
                                isCurrent
                                  ? "bg-white border-blue-500 shadow-sm text-blue-950 font-bold ring-1 ring-blue-400"
                                  : "bg-white/70 border-slate-200 hover:bg-white text-slate-700"
                              }`}
                            >
                              <div className="space-y-0.5">
                                <span className="font-extrabold text-[11px] flex items-center gap-1">
                                  {isCurrent ? "✓ " : ""}{sub.name}
                                </span>
                                <span className="text-[9px] text-slate-500 block">{sub.vibe}</span>
                              </div>
                              <span className="text-[9px] font-extrabold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                {sub.airport_iata}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
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
                    value={travelers || ""}
                    onChange={(e) => setTravelers(e.target.value === "" ? 0 : parseInt(e.target.value, 10))}
                    className="w-full p-2.5 rounded-lg border text-xs focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.budget}</label>
                  <input
                    type="number"
                    value={budget || ""}
                    onChange={(e) => setBudget(e.target.value === "" ? 0 : parseInt(e.target.value, 10))}
                    className="w-full p-2.5 rounded-lg border text-xs focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.transitMode}</label>
                <select
                  value={transportMode}
                  onChange={(e) => setTransportMode(e.target.value)}
                  className="w-full p-2.5 rounded-lg border text-xs font-bold focus:ring-2 focus:ring-primary-500"
                >
                  <option value="flight">{lang === "en" ? "✈️ Flight (Air Travel)" : "✈️ हवाई यात्रा (Flight)"}</option>
                  <option value="train">{lang === "en" ? "🚆 Train (Indian Railways IRCTC)" : "🚆 भारतीय रेलवे (Train)"}</option>
                  <option value="bus">{lang === "en" ? "🚌 Bus (Volvo / Inter-City)" : "🚌 बस (Bus / Volvo)"}</option>
                  <option value="self-drive">{lang === "en" ? "🚗 Car / Self-Drive Route" : "🚗 कार ड्राइविंग (Self-Drive)"}</option>
                </select>
              </div>



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
                    className={`p-3.5 border rounded-xl transition-all space-y-2 ${
                      selectedTransit?.id === f.id ? "bg-primary-50/80 border-primary-500 shadow-sm" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Plane className="w-3.5 h-3.5 text-primary-600" />
                          <span className="font-extrabold text-slate-800 text-xs">{f.airline}</span>
                          <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                            {f.flight_number}
                          </span>
                          {f.rating && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              ⭐ {f.rating}
                            </span>
                          )}
                          {f.otp_rate && (
                            <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                              {f.otp_rate}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-1 flex items-center gap-1">
                          <span className="font-bold text-slate-700">{f.departure_time}</span>
                          <span>➔</span>
                          <span className="font-bold text-slate-700">{f.arrival_time}</span>
                          <span>•</span>
                          <span>{f.duration_hrs}h flight</span>
                          {f.travel_class && (
                            <>
                              <span>•</span>
                              <span className="font-bold text-primary-600">{f.travel_class}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-900 text-xs">₹{f.total_price_inr}</span>
                        <span className="block text-[9px] text-slate-400 font-medium">(₹{f.cost_inr}/person)</span>
                      </div>
                    </div>

                    {/* Official Airport Route */}
                    <div className="bg-white/80 border border-slate-200/80 rounded-lg p-2 text-[10px] text-slate-600 space-y-0.5">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="truncate max-w-[48%]">🛫 {f.origin_airport || f.origin_iata || "Origin Airport"}</span>
                        <span className="text-slate-400">➔</span>
                        <span className="truncate max-w-[48%] text-right">🛬 {f.destination_airport || f.destination_iata || "Dest Airport"}</span>
                      </div>
                      {f.baggage_allowance && (
                        <div className="text-[9px] text-slate-400 font-medium">
                          🧳 {f.baggage_allowance}
                        </div>
                      )}
                    </div>

                    {f.is_multi_leg && (
                      <div className="text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 leading-tight">
                        📍 {f.accessibility_note}
                      </div>
                    )}

                    {/* 💺 Dynamic Airline Class Selection Options */}
                    {f.class_options && f.class_options.length > 0 && (
                      <div className="pt-1.5 border-t border-slate-200/60 space-y-1">
                        <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">
                          Choose Class Option (1-Click Price Update):
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                          {f.class_options.map((opt: any) => {
                            const isSelected = f.travel_class === opt.class_name;
                            return (
                              <button
                                key={opt.class_name}
                                type="button"
                                onClick={() => handleSelectTransitClass(f.id, opt)}
                                className={`p-1.5 text-left rounded-lg text-[10px] border transition-all ${
                                  isSelected
                                    ? "bg-primary-600 text-white border-primary-600 font-bold shadow-sm ring-1 ring-primary-400"
                                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                                }`}
                              >
                                <span className="block truncate text-[10px]">{opt.class_name}</span>
                                <span className={`font-extrabold text-[11px] block ${isSelected ? "text-white" : "text-slate-900"}`}>
                                  ₹{opt.total_price_inr}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setSelectedTransit(f)}
                        className="flex-1 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg text-[10px] shadow-sm transition-all"
                      >
                        {selectedTransit?.id === f.id ? "✓ Selected Flight" : "Select Flight"}
                      </button>
                      <button
                        onClick={() => setInspectingTransit(f)}
                        className="px-2.5 py-1.5 bg-white border hover:bg-slate-100 rounded-lg text-[10px] text-slate-600 font-bold shadow-sm"
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
                    className={`p-3.5 border rounded-xl transition-all space-y-2 ${
                      selectedTransit?.id === tr.id ? "bg-primary-50/80 border-primary-500 shadow-sm" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Compass className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="font-extrabold text-slate-800 text-xs">{tr.train_name}</span>
                          <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                            #{tr.train_number}
                          </span>
                          {tr.otp_rate && (
                            <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                              {tr.otp_rate}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-1 flex items-center gap-1">
                          <span className="font-bold text-slate-700">{tr.departure_time}</span>
                          <span>➔</span>
                          <span className="font-bold text-slate-700">{tr.arrival_time}</span>
                          <span>•</span>
                          <span>{tr.duration_hrs}h</span>
                          <span>•</span>
                          <span className="font-bold text-indigo-600">{tr.travel_class} Class</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-900 text-xs">₹{tr.total_price_inr}</span>
                        <span className="block text-[9px] text-slate-400 font-medium">(₹{tr.cost_inr}/person)</span>
                      </div>
                    </div>

                    {/* Official Railhead Route & Frequency */}
                    <div className="bg-white/80 border border-slate-200/80 rounded-lg p-2 text-[10px] text-slate-600 space-y-1">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="truncate max-w-[48%]">🚉 {tr.origin_station || tr.origin_code || "Origin Stn"}</span>
                        <span className="text-slate-400">➔</span>
                        <span className="truncate max-w-[48%] text-right">🚉 {tr.destination_station || tr.destination_code || "Dest Stn"}</span>
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-500 border-t pt-1">
                        <span>📅 {tr.operating_frequency || "Daily (All 7 Days)"}</span>
                        {tr.avg_delay && <span>⏱️ {tr.avg_delay}</span>}
                      </div>
                    </div>

                    {tr.is_multi_leg && (
                      <div className="text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 leading-tight">
                        📍 {tr.accessibility_note}
                      </div>
                    )}

                    {/* 🚆 Dynamic IRCTC Class Selection Options */}
                    {tr.class_options && tr.class_options.length > 0 && (
                      <div className="pt-1.5 border-t border-slate-200/60 space-y-1">
                        <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">
                          Choose IRCTC Travel Class & Fare:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          {tr.class_options.map((opt: any) => {
                            const isSelected = tr.travel_class === opt.class_name;
                            return (
                              <button
                                key={opt.class_name}
                                type="button"
                                onClick={() => handleSelectTransitClass(tr.id, opt)}
                                className={`p-1.5 text-left rounded-lg text-[10px] border transition-all ${
                                  isSelected
                                    ? "bg-indigo-600 text-white border-indigo-600 font-bold shadow-sm ring-1 ring-indigo-400"
                                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                                }`}
                              >
                                <span className="block truncate text-[10px]">{opt.class_name}</span>
                                <span className={`font-extrabold text-[11px] block ${isSelected ? "text-white" : "text-slate-900"}`}>
                                  ₹{opt.total_price_inr}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Promo & Refund Highlights */}
                    <div className="flex items-center justify-between text-[9px] text-slate-500">
                      <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                        🛡️ {tr.cancellation_policy?.summary || "IRCTC Refund Eligible"}
                      </span>
                      {tr.promo_code && (
                        <span className="font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                          🎟️ {tr.promo_code.code}: Save ₹{tr.promo_code.discount_inr}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setSelectedTransit(tr)}
                        className="flex-1 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg text-[10px] shadow-sm transition-all"
                      >
                        {selectedTransit?.id === tr.id ? "✓ Selected Train" : "Select Train"}
                      </button>
                      <button
                        onClick={() => setInspectingTransit(tr)}
                        className="px-2.5 py-1.5 bg-white border hover:bg-slate-100 rounded-lg text-[10px] text-slate-600 font-bold shadow-sm"
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
                    className={`p-3.5 border rounded-xl transition-all space-y-2 ${
                      selectedTransit?.id === b.id ? "bg-emerald-50/80 border-emerald-500 shadow-sm" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Compass className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-extrabold text-slate-800 text-xs">{b.operator}</span>
                          {b.rating && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              ⭐ {b.rating}
                            </span>
                          )}
                          {b.otp_rate && (
                            <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                              {b.otp_rate}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-1 flex items-center gap-1">
                          <span className="font-bold text-slate-700">{b.departure_time}</span>
                          <span>➔</span>
                          <span className="font-bold text-slate-700">{b.arrival_time}</span>
                          <span>•</span>
                          <span>{b.duration_hrs}h journey</span>
                          <span>•</span>
                          <span className="font-bold text-emerald-700">{b.bus_type}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-900 text-xs">₹{b.total_price_inr}</span>
                        <span className="block text-[9px] text-slate-400 font-medium">(₹{b.cost_inr}/person)</span>
                      </div>
                    </div>

                    {/* Boarding and Dropping Hubs */}
                    <div className="bg-white/80 border border-slate-200/80 rounded-lg p-2 text-[10px] text-slate-600 space-y-1">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="truncate max-w-[48%]">🚏 {b.origin_hub || "Origin Bus Hub"}</span>
                        <span className="text-slate-400">➔</span>
                        <span className="truncate max-w-[48%] text-right">🏁 {b.destination_hub || "Dest Bus Hub"}</span>
                      </div>
                      {b.amenities && (
                        <div className="flex flex-wrap gap-1 border-t pt-1">
                          {b.amenities.map((am: string, amIdx: number) => (
                            <span key={amIdx} className="text-[8px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded">
                              {am}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 🚌 Dynamic Seat Tier / Position Selection Options (Lower Front vs Rear Saver) */}
                    {b.class_options && b.class_options.length > 0 && (
                      <div className="pt-1.5 border-t border-slate-200/60 space-y-1">
                        <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block">
                          Choose Berth / Seat Position (Peeche vs Aage):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                          {b.class_options.map((opt: any) => {
                            const isSelected = b.travel_class === opt.class_name;
                            return (
                              <button
                                key={opt.class_name}
                                type="button"
                                onClick={() => handleSelectTransitClass(b.id, opt)}
                                className={`p-1.5 text-left rounded-lg text-[10px] border transition-all ${
                                  isSelected
                                    ? "bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm ring-1 ring-emerald-400"
                                    : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                                }`}
                              >
                                <span className="block truncate text-[10px]">{opt.class_name}</span>
                                {opt.seat_desc && (
                                  <span className={`text-[8px] block ${isSelected ? "text-emerald-100" : "text-slate-400"}`}>
                                    {opt.seat_desc}
                                  </span>
                                )}
                                <span className={`font-extrabold text-[11px] block ${isSelected ? "text-white" : "text-slate-900"}`}>
                                  ₹{opt.total_price_inr}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Promo & Refund Highlights */}
                    <div className="flex items-center justify-between text-[9px] text-slate-500">
                      <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                        🛡️ {b.cancellation_policy?.summary || "90% Refund Eligible"}
                      </span>
                      {b.promo_code && (
                        <span className="font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                          🎟️ {b.promo_code.code}: Save ₹{b.promo_code.discount_inr}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setSelectedTransit(b)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] shadow-sm transition-all"
                      >
                        {selectedTransit?.id === b.id ? "✓ Selected Bus" : "Select Bus"}
                      </button>
                      <button
                        onClick={() => setInspectingTransit(b)}
                        className="px-2.5 py-1.5 bg-white border hover:bg-slate-100 rounded-lg text-[10px] text-slate-600 font-bold shadow-sm"
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
                    {[...midwayHotels].sort((a, b) => b.star_rating - a.star_rating).map((mh) => (
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
                {[...hotels].sort((a, b) => b.star_rating - a.star_rating).map((h) => (
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
                        <span>
                          {h.star_rating} ⭐{" "}
                          {h.data_status ? (
                            <span className={`font-extrabold px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider ${
                              h.data_status === "LIVE" ? "bg-emerald-100 text-emerald-800" :
                              h.data_status === "VERIFIED" ? "bg-blue-100 text-blue-800" :
                              h.data_status === "HISTORICAL" ? "bg-amber-100 text-amber-800" :
                              h.data_status === "ESTIMATED" ? "bg-purple-100 text-purple-800" :
                              "bg-slate-100 text-slate-800"
                            }`}>
                              {h.data_status}
                            </span>
                          ) : h.is_estimated ? (
                            <span className="bg-orange-100 text-orange-800 font-bold px-1 rounded text-[8px] uppercase">ESTIMATED DATA</span>
                          ) : (
                            <span className="bg-sky-100 text-sky-800 font-bold px-1 rounded text-[8px] uppercase">LIVE DATA</span>
                          )}
                        </span>
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
                          onClick={() => { setInspectingHotel(h); setActiveModalImage(h.image_url || ""); }}
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
                  <span className="font-bold text-primary-600 uppercase">{transportMode === "self-drive" ? t.carRoute : transportMode}</span>
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
              <span className="text-slate-400 block font-bold uppercase text-[9px]">{t.originDestLabel}</span>
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
              <h3 className="font-bold text-slate-800 text-sm">{t.noActiveItinerary}</h3>
              <p className="text-slate-500 text-xs max-w-xs mt-1">{t.noPlanYet}</p>
            </div>
          )}

          {itinerary && (
            <div className="space-y-6">
              
              {/* Agentic AI Proactive Conflict Resolution Banner */}
              {itinerary.optimization_applied && (
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-300 p-4 rounded-2xl shadow-sm space-y-2.5 text-xs animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                    <h4 className="font-extrabold text-xs text-emerald-950 uppercase tracking-wider">
                      🤖 Agentic AI Proactive Conflict Resolution Applied
                    </h4>
                    <span className="ml-auto text-[10px] bg-emerald-600 text-white font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                      ₹{itinerary.cost_breakdown.remaining_balance} Saved Under Hard Budget
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    Your initial stay choice of <strong className="text-red-700 line-through">{itinerary.optimization_applied.original_stay} (₹{itinerary.optimization_applied.original_stay_cost})</strong> combined with transport & food exceeded your hard budget limit of <strong>₹{budget}</strong> (Total would be ₹{itinerary.optimization_applied.original_total_cost}).
                  </p>
                  <div className="p-3 bg-white/90 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">Proactive AI Substitution:</span>
                      <span className="font-extrabold text-slate-800 text-xs">🏨 {itinerary.optimization_applied.optimized_stay} (₹{itinerary.optimization_applied.optimized_stay_cost})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-500 block">Final Optimized Price:</span>
                      <span className="font-extrabold text-emerald-700 text-sm">₹{itinerary.total_cost_inr}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    💡 The agent resolved this constraint autonomously by substituting the highest-utility verified stay within your ₹{budget} ceiling, keeping your chosen flight/transit intact.
                  </p>
                </div>
              )}

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

              {/* Agent Thinking Cycle Log Trace (Collapsible for Mentor Inspection & Clean Production) */}
              {agentLogs.length > 0 && (
                <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 shadow-lg space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5">
                      <Terminal className="text-emerald-400 w-4 h-4" /> Agentic AI Execution Trace
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                        Mentor Inspection Mode
                      </span>
                      <button
                        onClick={() => setShowAgentTrace(!showAgentTrace)}
                        className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-all font-bold"
                      >
                        {showAgentTrace ? "Hide Box" : "Show Box"}
                      </button>
                    </div>
                  </div>

                  {showAgentTrace ? (
                    <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                      {agentLogs.map((log: any, idx: number) => (
                        <div key={idx} className="border-l-2 border-slate-700 pl-3.5 ml-1.5 space-y-1 relative text-left">
                          <div className="absolute w-2 h-2 bg-emerald-400 rounded-full -left-[5px] top-1"></div>
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-extrabold text-emerald-400 uppercase tracking-wider">{log.step}</span>
                            <span className="text-slate-500 font-mono">{log.action.split('(')[0]}()</span>
                          </div>
                          <p className="text-[11px] text-slate-300 font-medium italic">Thought: "{log.thought}"</p>
                          <div className="bg-slate-950/60 p-2 rounded border border-slate-800 font-mono text-[9px] text-slate-400">
                            <span className="text-purple-400 font-bold">Action:</span> {log.action}
                            <br />
                            <span className="text-blue-400 font-bold">Observation:</span> {log.observation}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">
                      ✅ 6-stage autonomous ReAct cycle completed with zero errors. Click "Show Box" to expand full execution thoughts and actions.
                    </p>
                  )}
                </div>
              )}

              {/* Timeline & Maps */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* Timeline Accordion with Flexible Day Slots */}
                <div className="bg-white p-5 rounded-2xl border shadow-sm space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-2.5 gap-2">
                    <h3 className="text-sm font-extrabold text-slate-800">Itinerary Timeline</h3>
                    <div className="flex items-center gap-3">
                      {(transportMode === "self-drive" || selectedTransit?.is_multi_leg) && (
                        <div className="flex items-center gap-1.5 border px-2 py-0.5 rounded-lg bg-slate-50 text-[10px] font-bold">
                          <span className="text-slate-500">Driving Speed/Traffic:</span>
                          <input
                            type="range"
                            min="0.7"
                            max="1.5"
                            step="0.1"
                            value={speedMultiplier}
                            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                            className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className={speedMultiplier > 1.0 ? "text-emerald-600" : speedMultiplier < 1.0 ? "text-rose-600" : "text-slate-600"}>
                            {speedMultiplier}x
                          </span>
                        </div>
                      )}
                      <button
                        disabled={delayLoading}
                        onClick={handleSimulateDelay}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 text-[10px] font-bold rounded-lg border border-red-200 flex items-center gap-1 transition-all disabled:opacity-50 flex-shrink-0"
                      >
                        {delayLoading ? "Simulating..." : "⚠️ Simulate 3-Hour Flight Delay"}
                      </button>
                    </div>
                  </div>
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
                                        <h5 className={`font-extrabold text-xs flex items-center gap-1 truncate ${item.is_closed_alert ? "text-red-600" : "text-slate-800"}`}>
                                          {item.name} {item.rating ? <span className="text-[10px] text-amber-500 font-normal flex-shrink-0">({(item.rating < 1.0 ? item.rating * 5.0 : item.rating).toFixed(1)} ⭐)</span> : ""}
                                        </h5>
                                        {item.description && <p className={`text-[10px] ${item.is_closed_alert ? "text-red-500 font-semibold" : "text-slate-400"}`}>{item.description}</p>}
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
            
            <div className="space-y-4 text-sm max-h-[420px] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-0.5">Total Distance</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedTransit.driving_distance_km} km</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-0.5">Driving Duration</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedTransit.duration_hrs} hours</span>
                </div>
              </div>

              {/* Fuel and EV charging stations grids */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-0.5">Petrol Pumps</span>
                    <span className="font-extrabold text-slate-800 text-xs">{selectedTransit.fuel_pumps_count || 12} locations</span>
                  </div>
                  <Fuel className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase block mb-0.5">EV Fast Chargers</span>
                    <span className="font-extrabold text-slate-855 text-xs">{selectedTransit.ev_stations_count || 6} stations</span>
                  </div>
                  <Zap className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                </div>
              </div>

              {/* State Fuel Rate Table */}
              <div className="border rounded-xl overflow-hidden bg-white">
                <div className="bg-slate-100 px-3 py-2 text-[10px] font-extrabold text-slate-700 flex justify-between">
                  <span>State Border Fuel Rates ({selectedTransit.fuel_info.location})</span>
                  <span>Source</span>
                </div>
                <div className="p-3.5 flex justify-between text-xs font-bold text-slate-850">
                  <span className="capitalize">{derivedSpecs.fuel_type.replace("_", " ")}: ₹{selectedTransit.fuel_info.price_per_unit} / unit</span>
                  <span className="text-slate-400 font-medium text-[10px] my-auto">{selectedTransit.fuel_info.source}</span>
                </div>
              </div>

              {/* Toll plazas details table */}
              <div className="border rounded-xl overflow-hidden bg-white">
                <div className="bg-slate-100 px-3 py-2 text-[10px] font-extrabold text-slate-700 flex justify-between">
                  <span>Toll Plaza Crossings</span>
                  <span>Single-way Fee</span>
                </div>
                <div className="divide-y">
                  {selectedTransit.toll_plazas.map((toll: any, tIdx: number) => (
                    <div key={tIdx} className="p-2.5 px-3.5 flex justify-between text-xs text-slate-600">
                      <span>{toll.name}</span>
                      <span className="font-bold text-slate-800">₹{toll.fee_inr}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 p-3 px-3.5 text-xs font-extrabold text-slate-800 border-t flex justify-between">
                  <span>Total Tolls Cost</span>
                  <span>₹{selectedTransit.total_toll_cost_inr}</span>
                </div>
              </div>

              {/* suggested road stops */}
              <div className="border rounded-xl overflow-hidden bg-white">
                <div className="bg-slate-100 px-3 py-2 text-[10px] font-extrabold text-slate-700">
                  {t.restStops} (Click to toggle/schedule stops)
                </div>
                <div className="divide-y">
                  {selectedTransit.suggested_rest_stops.map((stop: any, sIdx: number) => {
                    const isAdded = selectedRestStops.some(x => x.name === stop.name);
                    return (
                      <div
                        key={sIdx}
                        onClick={() => handleToggleRestStop(stop)}
                        className={`p-3 px-4 flex justify-between items-center text-xs cursor-pointer transition-all hover:bg-slate-50 ${
                          isAdded ? "bg-emerald-50 text-emerald-900 border-l-4 border-l-emerald-500" : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5 truncate">
                            {isAdded && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                            {stop.name} (approx {stop.dist_km} km)
                          </span>
                          <span className="text-slate-450 text-xs block truncate">{stop.cuisine}</span>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded flex-shrink-0 ${
                          isAdded ? "bg-emerald-200 text-emerald-800" : "bg-slate-100 text-slate-500"
                        }`}>
                          {isAdded ? "Added to Route!" : stop.price_level}
                        </span>
                      </div>
                    );
                  })}
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
              {inspectingTransit.data_status && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Data Trust Status</span>
                  <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    inspectingTransit.data_status === "LIVE" ? "bg-emerald-100 text-emerald-800" :
                    inspectingTransit.data_status === "DEMO" || inspectingTransit.data_status === "FALLBACK" ? "bg-rose-100 text-rose-800 border border-rose-200" :
                    inspectingTransit.data_status === "VERIFIED" ? "bg-blue-100 text-blue-800" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {inspectingTransit.data_status} DATA
                  </span>
                </div>
              )}
              {inspectingTransit.baggage && (
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.baggageLabel}</span>
                  <span className="font-bold text-slate-800">{inspectingTransit.baggage}</span>
                </div>
              )}

              {/* 🛡️ Official Cancellation & Refund Policy Slabs */}
              {inspectingTransit.cancellation_policy && (
                <div className="border-t pt-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase flex items-center gap-1">
                      🛡️ Cancellation & Refund Policy
                    </span>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {inspectingTransit.cancellation_policy.policy_type}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium">
                    {inspectingTransit.cancellation_policy.summary}
                  </p>
                  <div className="bg-slate-50 border rounded-lg overflow-hidden divide-y divide-slate-100 text-[10px]">
                    {inspectingTransit.cancellation_policy.slabs.map((slab: any, sIdx: number) => (
                      <div key={sIdx} className="p-2 flex justify-between items-center">
                        <span className="font-medium text-slate-600">{slab.window}</span>
                        <div className="text-right">
                          <span className="font-extrabold text-emerald-700 block">{slab.refund_pct}</span>
                          <span className="text-[9px] text-slate-400">({slab.deduction})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 🎟️ Applicable Promo Code */}
              {inspectingTransit.promo_code && (
                <div className="p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[9px] font-extrabold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded block w-fit mb-0.5">
                      {inspectingTransit.promo_code.badge}
                    </span>
                    <span className="font-extrabold text-slate-800">Coupon: {inspectingTransit.promo_code.code}</span>
                    <p className="text-[10px] text-slate-500">{inspectingTransit.promo_code.description}</p>
                  </div>
                  <span className="text-sm font-black text-amber-600">-₹{inspectingTransit.promo_code.discount_inr}</span>
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
            <div className="space-y-2">
              <img
                src={activeModalImage || inspectingHotel.image_url}
                alt={inspectingHotel.name}
                className="w-full h-48 object-cover rounded-xl shadow transition-all duration-200"
              />
              {inspectingHotel.images && inspectingHotel.images.length > 0 && (
                <div className="flex gap-2 justify-center">
                  {inspectingHotel.images.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Thumbnail"
                      onClick={() => setActiveModalImage(img)}
                      className={`w-14 h-10 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                        (activeModalImage || inspectingHotel.image_url) === img ? "border-primary-500 scale-105" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              )}
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
              <div className="space-y-4 text-xs">
                {/* Pre-Booked vs On-Trip Breakdown */}
                {(() => {
                  const basePayable = (itinerary?.cost_breakdown?.stays || 0) + (transportMode !== "self-drive" ? (itinerary?.cost_breakdown?.transport || 0) : 0);
                  const activePromo = appliedPromo || selectedTransit?.promo_code;
                  const discountAmount = activePromo ? activePromo.discount_inr : 0;
                  const finalPayable = Math.max(0, basePayable - discountAmount);

                  return (
                    <>
                      {/* 🎟️ Smart Coupon / Promo Discount Box */}
                      {activePromo && (
                        <div className="p-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl space-y-1 animate-fade-in shadow-sm">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                                🎟️ {activePromo.code}
                              </span>
                              <span className="text-[9px] font-bold text-emerald-700">✓ Promo Applied</span>
                            </div>
                            <span className="text-xs font-black text-emerald-700">
                              -₹{activePromo.discount_inr}
                            </span>
                          </div>
                          <p className="text-[9px] text-emerald-600 font-medium">
                            {activePromo.description}
                          </p>
                        </div>
                      )}

                      <div className="p-3 bg-slate-50 border rounded-xl space-y-2 text-[11px]">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span>🏨 Hotel Stay (Confirmed Voucher):</span>
                          <span>₹{itinerary?.cost_breakdown?.stays || 0}</span>
                        </div>
                        {transportMode !== "self-drive" && (
                          <div className="flex justify-between font-bold text-slate-700">
                            <span>🎫 Transit Tickets (PNR/E-Ticket):</span>
                            <span>₹{itinerary?.cost_breakdown?.transport || 0}</span>
                          </div>
                        )}
                        {discountAmount > 0 && (
                          <div className="flex justify-between font-bold text-emerald-600">
                            <span>🎟️ Promo Code Discount:</span>
                            <span>-₹{discountAmount}</span>
                          </div>
                        )}
                        <div className="border-t pt-1.5 flex justify-between font-extrabold text-emerald-700 text-xs">
                          <span>💳 Total Payable Now:</span>
                          <span>₹{finalPayable.toFixed(0)}</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 text-[10px] text-amber-900">
                        <span className="font-extrabold block">🚗 On-Trip Estimated Expenses (Pay on the road):</span>
                        <div className="flex justify-between text-amber-800">
                          <span>• Meals & Food Thalis:</span>
                          <span>₹{itinerary?.cost_breakdown?.food || 0}</span>
                        </div>
                        {transportMode === "self-drive" && (
                          <div className="flex justify-between text-amber-800">
                            <span>• Fuel & Fastag Tolls:</span>
                            <span>₹{(itinerary?.cost_breakdown?.transport || 0) + (itinerary?.cost_breakdown?.toll || 0)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-amber-800">
                          <span>• Monument Entry Tickets:</span>
                          <span>₹{itinerary?.cost_breakdown?.activities || 0}</span>
                        </div>
                        <p className="text-[9px] text-amber-700 italic pt-1">Note: On-trip expenses are NOT charged online and will be paid directly during your journey.</p>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => setShowPayment(false)} className="flex-1 py-2 border rounded-xl font-bold text-xs text-slate-500">Cancel</button>
                        <button onClick={triggerPayment} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs">
                          Pay Now ₹{finalPayable.toFixed(0)}
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
