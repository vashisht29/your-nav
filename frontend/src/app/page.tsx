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
  ShieldAlert, Shield,
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

import AppleGlobalNav from "./components/AppleGlobalNav";
import AppleScrollyHero from "./components/AppleScrollyHero";
import ScrollJourneyRunner from "./components/ScrollJourneyRunner";
import RoadGuardSOSCockpit from "./components/RoadGuardSOSCockpit";
import AppleBentoArchitecture from "./components/AppleBentoArchitecture";
import AuthModal from "./components/AuthModal";
import AppleDominoBootOverlay from "./components/AppleDominoBootOverlay";
import UserProfileHub from "./components/UserProfileHub";

// Dynamically import MapComponent to bypass SSR window undefined errors
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-slate-100 flex items-center justify-center rounded-xl">
      <Loader2 className="animate-spin text-primary-500 w-8 h-8" />
    </div>
  ),
});

const TrackingMap = dynamic(() => import("./track/TrackingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[200px] bg-slate-100 flex flex-col items-center justify-center rounded-2xl text-xs text-slate-400 gap-1.5">
      <Loader2 className="animate-spin text-indigo-500 w-5 h-5" />
      <span>Loading Live Satellite Map...</span>
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

const POPULAR_PAN_INDIA_CITIES = [
  // North
  { name: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739 },
  { name: "Manali", state: "Himachal Pradesh", lat: 32.2396, lng: 77.1887 },
  { name: "Bir Billing", state: "Himachal Pradesh", lat: 32.0515, lng: 76.7167 },
  { name: "Haridwar", state: "Uttarakhand", lat: 29.9457, lng: 78.1642 },
  { name: "Srinagar", state: "Jammu & Kashmir", lat: 34.0837, lng: 74.7973 },
  { name: "Leh Ladakh", state: "Ladakh", lat: 34.1526, lng: 77.5771 },
  // West
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { name: "Jaisalmer", state: "Rajasthan (Thar Desert)", lat: 26.9157, lng: 70.9083 },
  { name: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777 },
  { name: "Goa", state: "Goa (North/South)", lat: 15.4619, lng: 73.8560 },
  { name: "Rann of Kutch", state: "Gujarat", lat: 23.7337, lng: 69.8597 },
  // South
  { name: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { name: "Munnar", state: "Kerala", lat: 10.0889, lng: 77.0595 },
  { name: "Kanyakumari", state: "Tamil Nadu (Southern Cape)", lat: 8.0883, lng: 77.5385 },
  { name: "Rameshwaram", state: "Tamil Nadu", lat: 9.2876, lng: 79.3129 },
  { name: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867 },
  { name: "Ooty", state: "Tamil Nadu", lat: 11.4102, lng: 76.6950 },
  // East
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
  { name: "Darjeeling", state: "West Bengal", lat: 27.0410, lng: 88.2663 },
  { name: "Puri", state: "Odisha", lat: 19.8135, lng: 85.8312 },
  { name: "Bodh Gaya", state: "Bihar", lat: 24.6961, lng: 84.9869 },
  // Central
  { name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
  { name: "Ujjain", state: "Madhya Pradesh", lat: 23.1765, lng: 75.7885 },
  { name: "Bastar", state: "Chhattisgarh", lat: 19.0744, lng: 82.0309 },
  // Northeast
  { name: "Tawang", state: "Arunachal Pradesh", lat: 27.5861, lng: 91.8594 },
  { name: "Shillong", state: "Meghalaya", lat: 25.5788, lng: 91.8933 },
  { name: "Guwahati", state: "Assam", lat: 26.1445, lng: 91.7362 },
  { name: "Kaziranga", state: "Assam", lat: 26.5775, lng: 93.1711 },
  // Islands
  { name: "Port Blair", state: "Andaman & Nicobar", lat: 11.6234, lng: 92.7265 },
  { name: "Lakshadweep", state: "Lakshadweep", lat: 10.5667, lng: 72.6417 }
];

export default function Home() {
  // Out-of-the-Box Landing Page vs Cockpit State
  const [inCockpit, setInCockpit] = useState<boolean>(false);
  const [bootOpen, setBootOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; provider: string } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [userHubOpen, setUserHubOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"signin" | "cockpit" | "plan">("signin");
  const [activeTicker, setActiveTicker] = useState<string>("RoadGuard Sentinel: 52,400+ Corridors Active");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("yournav_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.name) {
            setCurrentUser(parsed);
          }
        }
      } catch (e) {}
    }
  }, []);

  const handleOpenAuth = (mode: string) => {
    setAuthMode(mode === "signin" ? "signin" : "cockpit");
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserHubOpen(false);
    setAuthModalOpen(false);
    setInCockpit(false);
    setBootOpen(false);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("yournav_user");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {}
    }
  };

  const handleAuthSuccess = (user?: { name: string; email: string; provider: string }) => {
    if (user) {
      setCurrentUser(user);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("yournav_user", JSON.stringify(user));
        } catch (e) {}
      }
    }
    setAuthModalOpen(false);
    setBootOpen(true);
  };

  const handleBootComplete = () => {
    setBootOpen(false);
    setInCockpit(true);
  };

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
  const [carTab, setCarTab] = useState<"dhabas" | "fuel" | "mechanics" | "route">("dhabas");
  const [activeFuelType, setActiveFuelType] = useState<string>("petrol");
  const [useAlternateRoute, setUseAlternateRoute] = useState<boolean>(false);
  const [agentLogs, setAgentLogs] = useState<any[]>([]);
  const [previewMapOpen, setPreviewMapOpen] = useState<boolean>(false);

  // Dynamic Route Telemetry & Estimator
  const getRouteStats = () => {
    const origCity = POPULAR_PAN_INDIA_CITIES.find(c => c.name.toLowerCase().includes((origin || "Delhi").toLowerCase().trim())) || { name: "Delhi", lat: 28.6139, lng: 77.2090 };
    const destCity = POPULAR_PAN_INDIA_CITIES.find(c => c.name.toLowerCase().includes((destination || "Manali").toLowerCase().trim())) || { name: "Manali", lat: 32.2396, lng: 77.1887 };
    
    const R = 6371;
    const dLat = (destCity.lat - origCity.lat) * Math.PI / 180;
    const dLon = (destCity.lng - origCity.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(origCity.lat * Math.PI / 180) * Math.cos(destCity.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const straightKm = Math.round(R * c) || 450;
    const roadKm = Math.max(90, Math.round(straightKm * 1.26));
    
    const flightH = Math.max(1, Math.floor(straightKm / 550));
    const flightM = Math.round((straightKm % 550) / 12) || 20;
    const trainH = Math.max(2, Math.floor(roadKm / 68));
    const trainM = Math.round((roadKm % 68) * 0.7) || 15;
    const driveH = Math.max(2, Math.floor(roadKm / 52));
    const driveM = Math.round((roadKm % 52) * 0.8) || 30;

    return {
      roadKm,
      straightKm,
      flightTime: `${flightH}h ${flightM}m`,
      trainTime: `${trainH}h ${trainM}m`,
      driveTime: `${driveH}h ${driveM}m`,
      busTime: `${driveH + 2}h 15m`
    };
  };

  const routeStats = getRouteStats();

  const handleSelectQuickExpedition = (quickOrigin: string, quickDest: string, quickBudget: number, quickMode: string) => {
    setOrigin(quickOrigin);
    setDestination(quickDest);
    setBudget(quickBudget);
    setTransportMode(quickMode);
    setOriginSuggestions([]);
    setDestSuggestions([]);
    setDidYouMean(null);
  };

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
  const [groundTransferModalTransit, setGroundTransferModalTransit] = useState<any>(null);
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
  // 🚨 Emergency SOS Dynamic Live Location & Moving Route State
  const [showSOS, setShowSOS] = useState(false);
  const [sosType, setSosType] = useState("medical");
  const [medicalViewTab, setMedicalViewTab] = useState<"all" | "hospitals" | "pharmacies">("all");
  const [sosLoading, setSosLoading] = useState(false);
  const [sosData, setSosData] = useState<any>(null);
  const [emergencyServices, setEmergencyServices] = useState<any[]>([]);
  const [sosLocationMode, setSosLocationMode] = useState<"gps" | "route">("route");
  const [userLiveCoords, setUserLiveCoords] = useState<{
    lat: number;
    lng: number;
    name: string;
    accuracy?: number;
    isRealGPS: boolean;
  }>({
    lat: 28.9845,
    lng: 77.7064,
    name: "Meerut Bypass (NH-58), Uttar Pradesh",
    isRealGPS: false
  });
  const [corridorWaypoints, setCorridorWaypoints] = useState<any[]>([]);
  const [activeWaypointIdx, setActiveWaypointIdx] = useState<number>(1);
  const [isSimulatingHighwayMotion, setIsSimulatingHighwayMotion] = useState(false);
  const [showAgentTrace, setShowAgentTrace] = useState(true);
  const [sosCitySearchQuery, setSosCitySearchQuery] = useState("");
  const [sosCitySuggestions, setSosCitySuggestions] = useState<any[]>([]);

  // 🛡️ Inbuilt RoadGuard AI Autonomous Highway Sentinel State
  const [guardianAlert, setGuardianAlert] = useState<any>(null);
  const [guardianCountdown, setGuardianCountdown] = useState<number>(60);
  // 📡 Family Live Share — Live Trip Sharing & Milestone Tracking State
  const [showSafarGuardian, setShowSafarGuardian] = useState(false);
  const [safarSession, setSafarSession] = useState<any>(null);
  const [safarLoading, setSafarLoading] = useState(false);
  const [safarToast, setSafarToast] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [simulatedNetwork, setSimulatedNetwork] = useState<"5g" | "2g" | "dead_zone" | "zero_network">("5g");
  const [safarViewMode, setSafarViewMode] = useState<"family_view" | "testing_lab">("family_view");
  const [autoPilotActive, setAutoPilotActive] = useState(false);
  const [zeroMeshHopStatus, setZeroMeshHopStatus] = useState<any>(null);
  const [satelliteBeamed, setSatelliteBeamed] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [activeZeroChannel, setActiveZeroChannel] = useState<"all" | "gps" | "sat" | "mesh" | "cloud" | "siren">("all");
  const [guardianContacts, setGuardianContacts] = useState<any[]>([
    { name: "Papa / Primary Guardian", phone: "+91-9876543210", relationship: "Father" },
    { name: "Family Member / Friend", phone: "+91-9812345678", relationship: "Travel Buddy" }
  ]);
  const [authorizedContacts, setAuthorizedContacts] = useState<any[]>([
    {
      id: "c1",
      name: "Papa (Suresh Sharma)",
      phone: "+91-9876543210",
      relation: "Father",
      status: "viewing",
      device: "iPhone 15 Pro",
      lastSeen: "Just now",
      permission: "Full Live GPS & Alerts",
    },
    {
      id: "c2",
      name: "Mummy (Sunita Sharma)",
      phone: "+91-9876543211",
      relation: "Mother",
      status: "whatsapp",
      device: "Samsung Galaxy S23",
      lastSeen: "4m ago",
      permission: "Milestone Checkpoints",
    },
    {
      id: "c3",
      name: "Pooja Sharma (Sister)",
      phone: "+91-9876543212",
      relation: "Sister",
      status: "active",
      device: "MacBook Air",
      lastSeen: "16m ago",
      permission: "Full Live GPS",
    },
  ]);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactRelation, setNewContactRelation] = useState("Friend");
  const [showAddContact, setShowAddContact] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);
  const [activeTabSafar, setActiveTabSafar] = useState<"map" | "who_has_access" | "send_location" | "simulator">("map");
  const [telemetry, setTelemetry] = useState<{
    speed: number;
    stationaryMins: number;
    trafficIndex: number;
    roadSegment: string;
    nearestHospital: { name: string; phone: string; dist: string };
    nearestPolice: { name: string; phone: string; dist: string };
    aiStatus: string;
  }>({
    speed: 68,
    stationaryMins: 0,
    trafficIndex: 0.15,
    roadSegment: "NH-58 / NH-334 Highway Corridor",
    nearestHospital: { name: "Subharti Medical College & Hospital", phone: "0121-2439052", dist: "2.4 km" },
    nearestPolice: { name: "Meerut Highway Patrol Chowki", phone: "112", dist: "1.2 km" },
    aiStatus: "Cruising safely at 68 km/h • Inbuilt Sentinel silently monitoring route telemetry in background."
  });

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

  const handleSwitchFuelType = async (fuel: string) => {
    setActiveFuelType(fuel);
    try {
      const res = await fetch("http://localhost:8000/api/search/transit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          destination,
          departure_date: depDate,
          return_date: retDate,
          travelers,
          mode: "self-drive",
          fuel_type: fuel
        })
      });
      if (res.status === 200) {
        const data = await res.json();
        if (data.transits && data.transits.length > 0) {
          setTransits(data.transits);
          setSelectedTransit(data.transits[0]);
        }
      }
    } catch (err) {
      console.error("Failed to switch fuel type", err);
    }
  };

  const handleSelectGroundTransfer = (transitId: string, groundOpt: any) => {
    setTransits((prev) =>
      prev.map((t) => {
        if (t.id === transitId) {
          const updated = {
            ...t,
            selected_ground_transfer: groundOpt.title,
            selected_ground_option: groundOpt
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

  const handleSelectStayRoom = (stayId: string, roomOpt: any) => {
    setHotels((prev) =>
      prev.map((h) => {
        if (h.id === stayId) {
          const updated = {
            ...h,
            selected_room: roomOpt.room_name,
            cost_inr: roomOpt.cost_per_night,
            total_stay_cost_inr: roomOpt.total_stay_cost_inr,
            meals_included: roomOpt.meals_included
          };
          if (selectedHotel?.id === stayId) {
            setSelectedHotel(updated);
          }
          return updated;
        }
        return h;
      })
    );
  };

  // 🚨 Dynamic Location-Aware Emergency SOS Fetcher
  const handleSOS = async (
    type: string = "medical",
    overrideLat?: number,
    overrideLng?: number,
    overrideName?: string
  ) => {
    setSosType(type);
    setSosLoading(true);
    const targetLat = overrideLat !== undefined ? overrideLat : userLiveCoords.lat;
    const targetLng = overrideLng !== undefined ? overrideLng : userLiveCoords.lng;
    const targetName = overrideName || userLiveCoords.name;

    try {
      const res = await fetch("http://localhost:8000/api/sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: targetLat,
          lng: targetLng,
          type: type,
          destination: destination || "Haridwar",
          origin: origin || "Delhi",
          location_name: targetName
        })
      });
      if (res.status === 200) {
        const data = await res.json();
        setSosData(data);
        setEmergencyServices(data.services || []);
      }
    } catch (e) {
      console.error("SOS fetch failed", e);
    } finally {
      setSosLoading(false);
    }
  };

  // 🛰️ Real-time Device GPS detection via browser Geolocation API
  const detectLiveDeviceGPS = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const accuracy = Math.round(pos.coords.accuracy || 10);
          const newCoords = {
            lat,
            lng,
            name: `Live Device Coordinates (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`,
            accuracy,
            isRealGPS: true
          };
          setUserLiveCoords(newCoords);
          setSosLocationMode("gps");
          setIsSimulatingHighwayMotion(false);
          handleSOS(sosType || "medical", lat, lng, newCoords.name);
        },
        (err) => {
          console.log("GPS access denied or unavailable, using route corridor", err);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
      );
    }
  };

  // 🛣️ Load route waypoints from backend
  const loadCorridorWaypoints = async (targetDest?: string, targetOrigin?: string) => {
    try {
      const d = targetDest || destination || "Haridwar";
      const o = targetOrigin || origin || "Delhi";
      const res = await fetch(`http://localhost:8000/api/sos/waypoints?origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(d)}`);
      const data = await res.json();
      if (data.waypoints && data.waypoints.length > 0) {
        setCorridorWaypoints(data.waypoints);
        // Default to waypoint 1 if not on device GPS
        if (!userLiveCoords.isRealGPS) {
          const initialWp = data.waypoints[1] || data.waypoints[0];
          setActiveWaypointIdx(1);
          setUserLiveCoords({
            lat: initialWp.lat,
            lng: initialWp.lng,
            name: initialWp.name,
            isRealGPS: false
          });
          handleSOS("medical", initialWp.lat, initialWp.lng, initialWp.name);
        }
      }
    } catch (e) {
      console.error("Failed to load corridor waypoints", e);
    }
  };

  // 🔍 Pan-India City Search in Emergency SOS
  const handleSosCitySearch = async (val: string) => {
    setSosCitySearchQuery(val);
    if (val.trim().length >= 2) {
      try {
        const res = await fetch(`http://localhost:8000/api/destinations/autocomplete?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        setSosCitySuggestions(data.results || []);
      } catch (e) {
        console.error("SOS City search failed", e);
      }
    } else {
      setSosCitySuggestions([]);
    }
  };

  const selectPanIndiaCity = (city: { name: string; lat: number; lng: number; state?: string }) => {
    const formattedName = `${city.name}${city.state ? `, ${city.state}` : ""}`;
    setUserLiveCoords({
      lat: city.lat,
      lng: city.lng,
      name: formattedName,
      isRealGPS: false
    });
    setSosLocationMode("route");
    setSosCitySearchQuery("");
    setSosCitySuggestions([]);
    handleSOS(sosType || "medical", city.lat, city.lng, city.name);
    loadCorridorWaypoints(city.name, origin || "Delhi");
  };

  // 🛣️ Select route waypoint when traveling or clicking
  const selectRouteWaypoint = (wp: any, idx: number) => {
    setActiveWaypointIdx(idx);
    setSosLocationMode("route");
    setUserLiveCoords({
      lat: wp.lat,
      lng: wp.lng,
      name: wp.name,
      isRealGPS: false
    });
    handleSOS(sosType || "medical", wp.lat, wp.lng, wp.name);
  };

  // 🚗 Continuous Highway Movement Simulator ("taki user chalte waqt bhi uski location ke hisab se change ho")
  useEffect(() => {
    let interval: any = null;
    if (isSimulatingHighwayMotion && corridorWaypoints.length > 0) {
      interval = setInterval(() => {
        setActiveWaypointIdx((prev) => {
          const nextIdx = (prev + 1) % corridorWaypoints.length;
          const nextWp = corridorWaypoints[nextIdx];
          setUserLiveCoords({
            lat: nextWp.lat,
            lng: nextWp.lng,
            name: nextWp.name,
            isRealGPS: false
          });
          handleSOS(sosType || "medical", nextWp.lat, nextWp.lng, nextWp.name);
          return nextIdx;
        });
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulatingHighwayMotion, corridorWaypoints, sosType]);

  const openSOSHub = () => {
    setShowSOS(true);
    setSosType("medical");
    loadCorridorWaypoints(destination, origin);
    handleSOS("medical", userLiveCoords.lat, userLiveCoords.lng, userLiveCoords.name);
  };

    const shareToWhatsApp = () => {
    if (!itinerary) return;
    const daysSummary = (itinerary.days || [])
      .slice(0, 3)
      .map((d: any) => `• Day ${d.day}: ${d.title || d.theme || "Sightseeing"}`)
      .join("\n");

    const msg = `🌟 *My Confirmed Travel Itinerary with YourNav*
📍 Route: ${origin} ➔ ${destination} (${depDate} to ${retDate})
👥 Travelers: ${travelers} People | Total Cost: ₹${itinerary.total_cost_inr || budget}

${transportMode === "flight" ? "✈️" : transportMode === "train" ? "🚆" : "🚌"} *Confirmed Transit:*
• ${selectedTransit?.airline || selectedTransit?.train_name || selectedTransit?.operator || transportMode} (${selectedTransit?.flight_number || selectedTransit?.train_number || selectedTransit?.travel_class || "Standard"})
• Timing: ${selectedTransit?.departure_time || "Morning"} ➔ ${selectedTransit?.arrival_time || "Evening"}
${selectedTransit?.ground_transfer_intelligence?.has_ground_transfer ? `• Onward Ground Transfer: ${selectedTransit.selected_ground_transfer || selectedTransit.ground_transfer_intelligence?.options?.[0]?.title || selectedTransit.ground_transfer_intelligence?.transfer_type || "Airport Cab / Shuttle"}` : ""}

🏨 *Confirmed Stay:*
• ${selectedHotel?.name || "Hotel"} (${selectedHotel?.selected_room || "Standard Room"})
• Meals: ${selectedHotel?.meals_included || "Breakfast Included"}

📅 *Day-by-Day Highlights:*
${daysSummary}

🚨 *24x7 Emergency Lifeline:* National 112 | Tourist Helpline 1363`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const printVoucher = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

    // 🔊 Pure Web Audio API Synthesizer for Guardian Warning Beeps & Sirens
  const playGuardianSound = (type: "beep" | "siren") => {
    try {
      if (typeof window === "undefined") return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "beep") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.25);
        osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.75);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch (e) {
      console.log("Audio alert suppressed", e);
    }
  };

  // 📡 Family Live Share Session & Milestone Dispatchers
  const openSafarGuardian = async (forceRefresh?: boolean | any) => {
    setShowSafarGuardian(true);
    const shouldForce = forceRefresh === true;
    const currentOrig = (origin || "Mumbai").trim();
    const currentDest = (destination || "Goa").trim();
    const isMismatch =
      shouldForce ||
      !safarSession ||
      safarSession.origin?.toLowerCase() !== currentOrig.toLowerCase() ||
      safarSession.destination?.toLowerCase() !== currentDest.toLowerCase() ||
      safarSession.traveler_name !== (currentUser?.name || "Rahul Sharma");

    if (isMismatch) {
      setSafarLoading(true);
      try {
        const payload = {
          origin: currentOrig,
          destination: currentDest,
          traveler_name: currentUser?.name || "Rahul Sharma",
          transport_mode: transportMode || "self-drive",
          departure_date: depDate,
          transit_details: selectedTransit,
          stay_name: selectedHotel?.name || `The Heritage Grand Resort, ${currentDest}`,
        };
        let res: Response | null = null;
        try {
          res = await fetch("/api/family-share/create-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } catch {
          res = await fetch("http://localhost:8000/api/family-share/create-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }
        if (res && res.ok) {
          const data = await res.json();
          if (data.status === "success" && data.safar_session) {
            setSafarSession(data.safar_session);
            if (data.safar_session.contacts) {
              setAuthorizedContacts(data.safar_session.contacts);
            }
          }
        }
      } catch (e) {
        console.error("Failed to load Family Live Share session", e);
      } finally {
        setSafarLoading(false);
      }
    }
  };

  const handleSendLivePing = (targetName?: string) => {
    setPingSuccess(true);
    const curLat = safarSession?.current_milestone?.lat ?? 18.7546;
    const curLng = safarSession?.current_milestone?.lng ?? 73.4062;
    const locName = safarSession?.current_milestone?.location_name || `${safarSession?.origin || "Mumbai"} ➔ ${safarSession?.destination || "Goa"}`;
    setSafarToast(
      `📍 Live GPS Broadcast Sent! Updated coordinates (${curLat}° N, ${curLng}° E • ${locName} • 78 km/h) pushed to ${
        targetName || "all authorized family members"
      } on WhatsApp & SMS.`
    );
    setTimeout(() => setPingSuccess(false), 3000);
    setTimeout(() => setSafarToast(null), 5000);
  };

  const handleRevokeAccess = (contactId: string, name: string) => {
    setAuthorizedContacts((prev) => prev.filter((c) => c.id !== contactId));
    setSafarToast(`🚫 Access Revoked: ${name} can no longer view your live GPS location.`);
    setTimeout(() => setSafarToast(null), 4000);
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    const newContact = {
      id: `c_${Date.now()}`,
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relation: newContactRelation,
      status: "active",
      device: "Mobile Phone",
      lastSeen: "Just invited",
      permission: "Full Live GPS & Milestones",
    };
    setAuthorizedContacts((prev) => [...prev, newContact]);
    setSafarToast(`✅ Access Granted: Live tracking invite & access link sent to ${newContactName}!`);
    setNewContactName("");
    setNewContactPhone("");
    setShowAddContact(false);
    setTimeout(() => setSafarToast(null), 4000);
  };

  const handleAdvanceMilestone = async (milestoneId?: string) => {
    if (!safarSession) return;
    try {
      let res: Response | null = null;
      try {
        res = await fetch("/api/family-share/advance-milestone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            track_id: safarSession.track_id,
            target_milestone_id: milestoneId,
          }),
        });
      } catch {
        res = await fetch("http://localhost:8000/api/family-share/advance-milestone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            track_id: safarSession.track_id,
            target_milestone_id: milestoneId,
          }),
        });
      }
      if (res && res.ok) {
        const data = await res.json();
        if (data.status === "success" && data.update) {
          setSafarSession((prev: any) => ({
            ...prev,
            milestones: data.update.milestones || prev.milestones,
            current_milestone: data.update.current_milestone,
            live_telemetry: {
              ...prev.live_telemetry,
              transit_status: data.update.current_milestone?.title || prev.live_telemetry?.transit_status,
            },
          }));
          setSafarToast(`📲 Milestone Dispatched to Family: "${data.update.current_milestone?.title}"`);
          setTimeout(() => setSafarToast(null), 4000);
        }
      }
    } catch (e) {
      console.error("Failed to advance milestone", e);
    }
  };

  // 🤖 100% Autonomous Hands-Free Geofence Simulator (Auto-Pilot)
  useEffect(() => {
    if (!autoPilotActive || !safarSession) return;
    const autoPilotTimer = setInterval(() => {
      handleAdvanceMilestone();
    }, 10000);
    return () => clearInterval(autoPilotTimer);
  }, [autoPilotActive, safarSession?.track_id, safarSession?.current_milestone?.id]);

  const copyTrackingLink = () => {
    if (typeof navigator !== "undefined" && safarSession) {
      const liveUrl = typeof window !== "undefined"
        ? `${window.location.origin}/track/${safarSession.track_id}`
        : safarSession.tracking_url || `http://localhost:3000/track/${safarSession.track_id}`;
      navigator.clipboard.writeText(liveUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // 🛡️ Inbuilt Autonomous Telemetry Evaluator (3.0 Extreme Resilience & Worst-Case Engine)
  const triggerAutonomousAnomalyDetection = async (
    scenarioType: 
      | "traffic_jam" 
      | "isolated_stop" 
      | "midnight_stop" 
      | "sudden_impact" 
      | "stage3_escalation"
      | "dropped_phone"
      | "atal_tunnel"
      | "battery_last_gasp"
      | "khardung_la"
      | "bastar_jungle"
      | "tamhini_landslide"
      | "thar_desert"
      | "phone_shutdown"
      | "hypoxia_ams"
      | "flash_flood"
      | "cab_deviation"
      | "engine_fire"
      | "vehicle_rollover" = "isolated_stop"
  ) => {
    try {
      let speed = 0.0;
      let stationaryMins = 5.0;
      let trafficIndex = 0.12;
      let isNight = false;
      let isCrash = false;
      let altitudeM = 0.0;
      let tempC = 25.0;
      let batteryPct = 85.0;
      let isTunnel = false;
      let isForest = false;
      let isLandslide = false;
      let isDesert = false;
      let isPhoneShutdown = false;
      let isHypoxia = false;
      let isFlood = false;
      let routeDevKm = 0.0;
      let isFire = false;
      let isOverturned = false;
      let aiStatusMsg = "";

      if (scenarioType === "traffic_jam") {
        stationaryMins = 8.5;
        trafficIndex = 0.85;
        aiStatusMsg = "🚗 Heavy traffic jam / toll queue (85% congestion). RoadGuard AI: Confirmed safe hold, false alarms suppressed 100%.";
      } else if (scenarioType === "midnight_stop") {
        stationaryMins = 4.5;
        trafficIndex = 0.05;
        isNight = true;
        aiStatusMsg = "🌙 MIDNIGHT HALT (1:30 AM): Isolated road stoppage. Night risk multiplier active. Accelerated check-in initiated.";
      } else if (scenarioType === "sudden_impact") {
        speed = 0.0;
        stationaryMins = 1.2;
        trafficIndex = 0.10;
        isCrash = true;
        aiStatusMsg = "💥 HIGH-SPEED IMPACT / CRASH DETECTED! Rapid deceleration collapse. Immediate Stage-2 urgent siren triggered!";
      } else if (scenarioType === "stage3_escalation") {
        stationaryMins = 9.0;
        trafficIndex = 0.08;
        aiStatusMsg = "🚨 UNRESPONSIVE TRAVELER: 9 mins stationary on open road. AI autonomously escalating emergency SOS beacon to family & 112!";
      } else if (scenarioType === "dropped_phone") {
        speed = 82.0;
        stationaryMins = 0.0;
        trafficIndex = 0.15;
        isCrash = true;
        aiStatusMsg = "📱 PHONE DROPPED ON CABIN FLOOR: 15g shockwave detected, but vehicle is cruising safely at 82 km/h. Crash siren safely disarmed!";
      } else if (scenarioType === "atal_tunnel") {
        speed = 48.0;
        stationaryMins = 0.0;
        trafficIndex = 0.30;
        isTunnel = true;
        aiStatusMsg = "🚇 ATAL TUNNEL ENTRY (9.02 km): GPS satellite lock shielded. 15-min safe transit window active. Missing alarms suppressed.";
      } else if (scenarioType === "battery_last_gasp") {
        speed = 0.0;
        stationaryMins = 3.5;
        trafficIndex = 0.10;
        batteryPct = 7.0;
        isNight = true;
        aiStatusMsg = "🔋 CRITICAL BATTERY (7%): Transmitting pre-shutdown safe coordinates & battery level to family so parents do not panic.";
      } else if (scenarioType === "khardung_la") {
        speed = 0.0;
        stationaryMins = 6.0;
        trafficIndex = 0.10;
        altitudeM = 4650.0;
        tempC = -14.0;
        aiStatusMsg = "❄️ KHARDUNG LA BLIZZARD (-14°C, 4650m): Sub-zero mountain stoppage. Hypothermia emergency protocol activated. ITBP alerted.";
      } else if (scenarioType === "bastar_jungle") {
        speed = 0.0;
        stationaryMins = 5.0;
        trafficIndex = 0.02;
        isForest = true;
        isNight = true;
        aiStatusMsg = "🌲 BASTAR FOREST RESERVE (22:00): Dense canopy signal loss. Night curfew active. CRPF Safe Corridor alerted.";
      } else if (scenarioType === "tamhini_landslide") {
        speed = 0.0;
        stationaryMins = 7.0;
        trafficIndex = 0.20;
        isLandslide = true;
        aiStatusMsg = "🌧️ TAMHINI GHAT LANDSLIDE: Torrential downpour & rockfall roadblock on hairpin. NDRF 5th Bn & winch alerted.";
      } else if (scenarioType === "thar_desert") {
        speed = 0.0;
        stationaryMins = 5.5;
        trafficIndex = 0.04;
        isDesert = true;
        tempC = 47.0;
        aiStatusMsg = "🏜️ THAR DESERT OVERHEAT BREAKDOWN (47°C): Radiator burst near Longewala. BSF Border Outpost water rescue queued.";
      } else {
        // Default isolated stop
        stationaryMins = 5.0;
        trafficIndex = 0.12;
        aiStatusMsg = "⚠️ UNEXPECTED HALT DETECTED: Vehicle stationary 5 mins on open highway. Traffic clear. Agentic AI initiating Stage-1 'Are You OK?' check-in...";
      }

      setTelemetry(prev => ({
        ...prev,
        speed: speed,
        stationaryMins: stationaryMins,
        trafficIndex: trafficIndex,
        aiStatus: aiStatusMsg
      }));

      const activeLat = userLiveCoords?.lat || 28.9845;
      const activeLng = userLiveCoords?.lng || 77.7064;

      const res = await fetch("http://localhost:8000/api/guardian/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: activeLat,
          lng: activeLng,
          speed_kmh: speed,
          stationary_duration_mins: stationaryMins,
          traffic_congestion_index: trafficIndex,
          destination: destination || "Your Destination",
          transit_mode: transportMode || "car",
          is_night: isNight,
          sudden_impact: isCrash,
          altitude_m: altitudeM,
          temp_c: tempC,
          battery_percent: batteryPct,
          is_tunnel_zone: isTunnel,
          is_forest_naxal_zone: isForest,
          is_landslide_zone: isLandslide,
          is_desert_zone: isDesert
        })
      });

      const data = await res.json();
      const evalRes = data.guardian_evaluation;

      if (evalRes && evalRes.is_alert_triggered) {
        setGuardianAlert(evalRes);
        setGuardianCountdown(evalRes.grace_seconds || 60);
        playGuardianSound(evalRes.beep_intensity === "urgent_siren" || evalRes.beep_intensity === "emergency_beacon" ? "siren" : "beep");
      } else if (evalRes) {
        setGuardianAlert(null);
      }
    } catch (e) {
      console.error("Inbuilt guardian autonomous telemetry check failed", e);
    }
  };

  // 🛡️ Inbuilt Autonomous Background Watchdog Daemon:
  // Runs silently in the background when the trip is confirmed (Step 5).
  // The traveler does NOT need to click anything — the AI evaluates route conditions on its own!
  useEffect(() => {
    if (step !== 5 || !itinerary) return;

    // Autonomous timeline simulation:
    // After 10s of entering the active trip view, simulates an isolated open road stop where AI awakens autonomously
    const autoAnomalyTimer = setTimeout(() => {
      // Only auto-trigger if an alert is not already active
      if (!guardianAlert) {
        triggerAutonomousAnomalyDetection("isolated_stop");
      }
    }, 10000);

    return () => clearTimeout(autoAnomalyTimer);
  }, [step, itinerary, guardianAlert]);

  // Countdown timer effect for Guardian Alert
  useEffect(() => {
    let timer: any = null;
    if (guardianAlert && guardianAlert.is_alert_triggered && guardianCountdown > 0) {
      timer = setInterval(() => {
        setGuardianCountdown((prev) => {
          if (prev <= 1) {
            // Escalate to Stage 3 when countdown expires
            clearInterval(timer);
            setGuardianAlert((prevAlert: any) => ({
              ...prevAlert,
              stage: "STAGE_3_AUTO_ESCALATION",
              severity: "CRITICAL",
              headline: "SOS ESCALATED: Emergency Beacon Dispatched!",
              subtext: "Traveler was unresponsive during check-in windows. Emergency beacon sent to family and 112 authorities."
            }));
            playGuardianSound("siren");
            return 0;
          }
          if (prev % 5 === 0) {
            playGuardianSound(prev < 20 ? "siren" : "beep");
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [guardianAlert, guardianCountdown]);

  const triggerPayment = () => {
    setPayRef(`PAY_SIM_${Math.floor(100000 + Math.random() * 900000)}`);
    setPaySuccess(true);
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

      const transitPayload = {
        origin,
        destination,
        departure_date: depDate,
        return_date: retDate,
        travelers,
        mode: transportMode,
        fuel_type: derivedSpecs.fuel_type,
        vehicle_query: vehicleQuery,
        travel_class: travelClass
      };

      const hotelPayload = {
        origin,
        destination,
        departure_date: depDate,
        return_date: retDate,
        travelers,
        budget,
        transport_mode: transportMode,
        vehicle_query: vehicleQuery
      };

      let transitData: any = null;
      let hotelData: any = null;

      try {
        const transitRes = await fetch("/api/search/transit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transitPayload)
        });
        if (transitRes.ok) {
          transitData = await transitRes.json();
        }
      } catch {
        try {
          const directTransit = await fetch("http://localhost:8000/api/search/transit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transitPayload)
          });
          if (directTransit.ok) {
            transitData = await directTransit.json();
          }
        } catch {}
      }

      try {
        const hotelRes = await fetch("/api/search/stays", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(hotelPayload)
        });
        if (hotelRes.ok) {
          hotelData = await hotelRes.json();
        }
      } catch {
        try {
          const directHotel = await fetch("http://localhost:8000/api/search/stays", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(hotelPayload)
          });
          if (directHotel.ok) {
            hotelData = await directHotel.json();
          }
        } catch {}
      }

      const transitsList = transitData?.transits || [];
      const hotelsList = hotelData?.hotels || [];

      if (transitsList.length > 0 || hotelsList.length > 0) {
        setTransits(transitsList);
        setHotels(hotelsList);
        setMidwayHotels(hotelData?.midway_hotels || []);
        setMidwayCityName(hotelData?.midway_city_name || "");
        setSelectedTransit(null);
        setSelectedHotel(null);
        setSelectedMidwayHotel(null);
        setErrorMsg("");
        setStep(2);
      } else {
        setErrorMsg("Unable to retrieve options for destination. Please verify the destination name.");
      }
    } catch (e: any) {
      setErrorMsg(e?.message || "Search failed. Please try again.");
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
      const planPayload = {
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
      };

      let res: Response | null = null;
      try {
        res = await fetch("/api/plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(planPayload)
        });
      } catch {
        try {
          res = await fetch("http://localhost:8000/api/plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(planPayload)
          });
        } catch {}
      }

      if (!res || !res.ok) {
        throw new Error("Unable to contact planner engine.");
      }

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
        const itemName = (item.name || "").toLowerCase();
        const isTransit = item.category === "logistics" && 
          (itemName.includes("drive") || 
           itemName.includes("transit") || 
           itemName.includes("taxi") ||
           itemName.includes("road"));
        
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
        const replanPayload = {
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
        };

        let res: Response | null = null;
        try {
          res = await fetch("/api/plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(replanPayload)
          });
        } catch {
          try {
            res = await fetch("http://localhost:8000/api/plan", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(replanPayload)
            });
          } catch {}
        }

        const data = res && res.ok ? await res.json() : null;
        if (data && data.status !== "Infeasible") {
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


  if (bootOpen) {
    return (
      <AppleDominoBootOverlay
        isOpen={bootOpen}
        userName={currentUser?.name || "Traveler"}
        provider={currentUser?.provider || "google"}
        onComplete={handleBootComplete}
      />
    );
  }

  if (!inCockpit) {
    return (
      <main className="min-h-screen bg-black text-[#f5f5f7] selection:bg-blue-500/30">
        {/* Unified Apple Global Navigation */}
        <AppleGlobalNav
          onOpenAuth={handleOpenAuth}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenUserHub={() => setUserHubOpen(true)}
        />

        {/* Apple Borderless Cinematic Hero Portal */}
        <AppleScrollyHero onOpenAuth={handleOpenAuth} />

        {/* Scroll-Driven Autonomous Journey Runner */}
        <ScrollJourneyRunner />

        {/* RoadGuard SOS Sentinel Interface Preview */}
        <RoadGuardSOSCockpit />

        {/* Apple Bento Grid ("Take a closer look") & Finale */}
        <AppleBentoArchitecture onOpenAuth={handleOpenAuth} />

        {/* Authentication Modal */}
        <AuthModal
          isOpen={authModalOpen}
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />

        {/* Traveler Hub Drawer (User Details, Past Trips, Add Recommendations) */}
        <UserProfileHub
          isOpen={userHubOpen}
          onClose={() => setUserHubOpen(false)}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenAuth={() => {
            setUserHubOpen(false);
            handleOpenAuth("signin");
          }}
        />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-sky-500/20 antialiased p-3 sm:p-5 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Modern Eye-Catching Header - Zero Jumping Alignment */}
        <header className="flex flex-wrap items-center justify-between bg-white border border-slate-200/90 rounded-2xl p-4 sm:px-6 shadow-sm gap-4 select-none">
          {/* Brand & Website Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setInCockpit(false)}
              className="h-10 px-3.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-2xs"
              title="Return to Website Home"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
              <span>Website</span>
            </button>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                {t.title || "YourNav"}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {t.subtitle || "Smart AI Travel Companion"}
              </p>
            </div>
          </div>

          {/* Right Action Bar: Clean, Minimalist & De-Cluttered */}
          <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap ml-auto">
            {/* Language Switch */}
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="h-9 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-2xs"
            >
              <Languages className="w-3.5 h-3.5 text-sky-600" />
              <span>{lang === "en" ? "हिंदी" : "English"}</span>
            </button>

            {/* User Profile Badge (Clicking opens Traveler Hub with User Details, Past Trips & Recommendations) */}
            {currentUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setUserHubOpen(true)}
                  className="h-9 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 flex items-center gap-2 shadow-2xs transition active:scale-95 cursor-pointer"
                  title="Open Traveler Hub (User Details, Past Trips, Recommendations)"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-black text-[10px] flex items-center justify-center shadow-xs">
                    {(currentUser?.name || "T").charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-900 text-xs max-w-[90px] truncate">{currentUser?.name || "Traveler"}</span>
                  <span className="text-[10px] text-sky-600 font-bold bg-sky-50 px-1.5 py-0.2 rounded-md">✦ Hub</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="h-9 px-2.5 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition cursor-pointer"
                  title="Log Out & Exit to Website"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleOpenAuth("signin")}
                className="h-9 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs cursor-pointer"
              >
                <span>👤</span>
                <span>Sign In</span>
              </button>
            )}

            {/* Compact Sentinel Badge */}
            <div className="h-9 px-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] font-bold text-emerald-800 hidden sm:flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>RoadGuard Active</span>
            </div>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Control Panel: Progressive Steps */}
          {/* Left Control Panel: Progressive Steps */}
          <div className="lg:col-span-1 bg-white border border-slate-200/90 p-5 sm:p-6 rounded-2xl h-fit space-y-6 shadow-sm">
            {/* Stepper Header */}
            <div className="space-y-3 border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Step {step} of 5
                </span>
                <span className="text-xs font-extrabold text-slate-900">
                  {step === 1 ? "Route & Dates" : step === 2 ? "Transit Mode" : step === 3 ? "Stays & Hotels" : step === 4 ? "Travel Preferences" : "Trip Itinerary"}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      step >= s
                        ? "bg-sky-600 shadow-xs"
                        : "bg-slate-100"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Live Budget Tracker & Expenditure Monitor (Visible when Step > 1) */}
            {step > 1 && (
              <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-3 shadow-2xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold text-xs">₹</span>
                    <span>Budget Tracking Bar</span>
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    bucketTotal > budget
                      ? "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                      : bucketTotal > 0
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-sky-50 text-sky-700 border-sky-200"
                  }`}>
                    {bucketTotal > budget
                      ? `⚠️ Over by ₹${(bucketTotal - budget).toLocaleString("en-IN")}`
                      : bucketTotal > 0
                        ? `🟢 ₹${(budget - bucketTotal).toLocaleString("en-IN")} Left`
                        : `Dynamic Allocation Preview`}
                  </span>
                </div>

                {/* Multi-Segment Color Coded Progress Bar */}
                <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden flex shadow-inner">
                  {bucketTotal > 0 ? (
                    <>
                      <div
                        className="h-full bg-sky-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, (calcTransitCost / (budget || 1)) * 100)}%` }}
                        title={`Transit: ₹${calcTransitCost}`}
                      />
                      <div
                        className="h-full bg-indigo-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, ((calcStayCost + calcMidwayCost) / (budget || 1)) * 100)}%` }}
                        title={`Stays: ₹${calcStayCost + calcMidwayCost}`}
                      />
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${Math.min(100, (calcFoodCost / (budget || 1)) * 100)}%` }}
                        title={`Meals: ₹${calcFoodCost}`}
                      />
                      {bucketTotal > budget && (
                        <div className="h-full bg-rose-500 flex-1 animate-pulse" title="Over Budget" />
                      )}
                    </>
                  ) : (
                    <>
                      <div className="h-full bg-sky-400" style={{ width: "35%" }} title="Transit (~35%)" />
                      <div className="h-full bg-indigo-400" style={{ width: "40%" }} title="Stays (~40%)" />
                      <div className="h-full bg-amber-400" style={{ width: "15%" }} title="Meals (~15%)" />
                      <div className="h-full bg-emerald-400" style={{ width: "10%" }} title="Buffer (~10%)" />
                    </>
                  )}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 flex flex-col shadow-2xs">
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> Transit
                    </span>
                    <span className="font-extrabold text-slate-900 text-xs mt-0.5">
                      ₹{calcTransitCost > 0 ? calcTransitCost.toLocaleString("en-IN") : Math.round(budget * 0.35).toLocaleString("en-IN") + "*"}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 flex flex-col shadow-2xs">
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Stays
                    </span>
                    <span className="font-extrabold text-slate-900 text-xs mt-0.5">
                      ₹{(calcStayCost + calcMidwayCost) > 0 ? (calcStayCost + calcMidwayCost).toLocaleString("en-IN") : Math.round(budget * 0.4).toLocaleString("en-IN") + "*"}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 flex flex-col shadow-2xs">
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Meals/Buff
                    </span>
                    <span className="font-extrabold text-slate-900 text-xs mt-0.5">
                      ₹{calcFoodCost > 0 ? calcFoodCost.toLocaleString("en-IN") : Math.round(budget * 0.25).toLocaleString("en-IN") + "*"}
                    </span>
                  </div>
                </div>

                {/* Active selection breakdown or note */}
                {bucketTotal > 0 ? (
                  <div className="space-y-1 text-[10px] text-slate-600 font-medium border-t border-slate-200 pt-2">
                    {selectedTransit && (
                      <div className="flex justify-between items-center">
                        <span className="truncate max-w-[70%]">
                          {selectedTransit.airline ? "✈️" : selectedTransit.train_name ? "🚆" : selectedTransit.operator ? "🚌" : "🚗"} {selectedTransit.airline || selectedTransit.train_name || selectedTransit.operator || "Self-Drive"}
                        </span>
                        <span className="font-bold text-slate-900">₹{selectedTransit.total_price_inr}</span>
                      </div>
                    )}
                    {selectedMidwayHotel && (
                      <div className="flex justify-between items-center">
                        <span className="truncate max-w-[70%]">🏨 {selectedMidwayHotel.name} (Midway)</span>
                        <span className="font-bold text-slate-900">₹{selectedMidwayHotel.total_stay_cost_inr}</span>
                      </div>
                    )}
                    {selectedHotel && (
                      <div className="flex justify-between items-center">
                        <span className="truncate max-w-[70%]">🏨 {selectedHotel.name} (Stay)</span>
                        <span className="font-bold text-slate-900">₹{selectedHotel.total_stay_cost_inr}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-1 border-t border-slate-100 font-bold text-slate-900">
                      <span>Total Committed:</span>
                      <span className={bucketTotal > budget ? "text-rose-600 font-black" : "text-emerald-700 font-black"}>
                        ₹{bucketTotal.toLocaleString("en-IN")} / ₹{budget.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[9px] text-slate-400 text-center italic">
                    *Live preview based on ₹{budget?.toLocaleString("en-IN") || budget} target. Updates instantly as you select options.
                  </p>
                )}
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                  <span className="font-semibold">{errorMsg}</span>
                </div>

                {/* Agentic Alternatives Resolvers */}
                {infeasibleAlternatives.length > 0 && (
                  <div className="mt-2.5 border-t border-rose-200 pt-2.5 space-y-2">
                    <span className="text-[10px] text-rose-700 font-extrabold block uppercase tracking-wider">
                      {t.alternativeTitle}
                    </span>
                    <p className="text-[10px] text-slate-600 mb-1">{t.alternativeSub}</p>
                    {infeasibleAlternatives.map((alt) => (
                      <button
                        key={alt.id}
                        onClick={() => handleApplyAlternative(alt)}
                        className="w-full p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-left rounded-xl text-[10px] text-slate-800 font-bold flex items-center justify-between gap-1 shadow-2xs transition-all"
                      >
                        <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-500" /> {alt.description}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

          {/* STEP 1: Clean Minimalist Travel Form */}
          {step === 1 && (
            <div className="space-y-4 animate-apple-spring">
              {/* Unsupported Wishlist Toast Banner */}
              {unsupportedToast && (
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800 space-y-1 animate-fade-in shadow-2xs">
                  <div className="flex items-center justify-between font-bold text-[11px]">
                    <span className="flex items-center gap-1.5">✨ Sector Recorded</span>
                    <button onClick={() => setUnsupportedToast(null)} className="text-sky-600 hover:text-sky-800">✕</button>
                  </div>
                  <p className="text-[10px] leading-relaxed text-sky-700">{unsupportedToast}</p>
                </div>
              )}

              {/* Origin Autocomplete */}
              <div className="relative">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>🛫</span> <span>{t.origin || "Origin"}</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Delhi, Mumbai, Bengaluru, Kolkata, Chandigarh"
                    value={origin}
                    onChange={(e) => handleOriginChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                  {origin && (
                    <button
                      type="button"
                      onClick={() => setOrigin("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {originSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-52 overflow-y-auto mt-1 divide-y divide-slate-100">
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
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span>🎯</span> <span>{t.destination || "Destination"}</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Manali, Hampi, Munnar, Varanasi, Bir Billing, Chopta, Goa"
                    value={destination}
                    onChange={(e) => handleDestinationChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                  {destination && (
                    <button
                      type="button"
                      onClick={() => setDestination("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 text-xs w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

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
                      className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[10px] shadow-sm transition-all cursor-pointer"
                    >
                      Auto-Correct
                    </button>
                  </div>
                )}

                {/* Autocomplete Dropdown List */}
                {destSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto mt-1 divide-y divide-slate-100">
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
                          <span className="text-[9px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">{s.type}</span>
                        </div>
                        {s.famous_for && (
                          <p className="text-[10px] text-slate-400 line-clamp-1">{s.famous_for}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* AI Sub-Region Recommendations */}
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

                    <div className="grid grid-cols-1 gap-1.5 pt-1">
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
                            className={`p-2 text-left rounded-lg text-xs transition-all flex items-center justify-between border cursor-pointer ${
                              isCurrent
                                ? "bg-white border-blue-500 text-blue-950 font-bold shadow-sm ring-1 ring-blue-400"
                                : "bg-white/70 border-slate-200 hover:bg-white text-slate-700"
                            }`}
                          >
                            <span className="font-semibold text-[11px]">{isCurrent ? "✓ " : ""}{sub.name}</span>
                            <span className="text-[9px] text-slate-600 font-mono font-bold">{sub.airport_iata}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Travel Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">{t.depDate || "Departure Date"}</label>
                  <input
                    type="date"
                    value={depDate}
                    onChange={(e) => setDepDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">{t.retDate || "Return Date"}</label>
                  <input
                    type="date"
                    value={retDate}
                    onChange={(e) => setRetDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Travelers & Budget */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">{t.travelers || "Travelers"}</label>
                  <input
                    type="number"
                    min={1}
                    value={travelers || ""}
                    onChange={(e) => setTravelers(e.target.value === "" ? 0 : parseInt(e.target.value, 10))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">{t.budget || "Budget (INR)"}</label>
                  <input
                    type="number"
                    value={budget || ""}
                    onChange={(e) => setBudget(e.target.value === "" ? 0 : parseInt(e.target.value, 10))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Transit Mode Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">{t.transitMode || "Transit Mode"}</label>
                <select
                  value={transportMode}
                  onChange={(e) => setTransportMode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white cursor-pointer"
                >
                  <option value="flight">{lang === "en" ? "✈️ Flight (Air Travel)" : "✈️ हवाई यात्रा (Flight)"}</option>
                  <option value="train">{lang === "en" ? "🚆 Train (Indian Railways IRCTC)" : "🚆 भारतीय रेलवे (Train)"}</option>
                  <option value="bus">{lang === "en" ? "🚌 Bus (Volvo / Inter-City)" : "🚌 बस (Bus / Volvo)"}</option>
                  <option value="self-drive">{lang === "en" ? "🚗 Car / Self-Drive Route" : "🚗 कार ड्राइविंग (Self-Drive)"}</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={searchLoading || !destination}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer shadow-sm active:scale-[0.99] mt-2"
              >
                {searchLoading ? <Loader2 className="animate-spin w-4 h-4" /> : null}
                <span>{t.searchBtn || "Search Options"}</span>
              </button>
            </div>
          )}

          {/* STEP 2: Choose Transit (Flight/Train/Bus/Car Details) */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {t.selectTransit}
                </h3>
                <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">Verified Routes</span>
              </div>
              
              <div className="space-y-3 max-h-[380px] overflow-y-auto p-1 pr-1.5">
                {/* 1. Flights List */}
                {transportMode === "flight" && transits.map((f) => (
                  <div
                    key={f.id}
                    className={`p-4 rounded-2xl transition-all space-y-2.5 border shadow-2xs ${
                      selectedTransit?.id === f.id
                        ? "bg-sky-50/80 border-sky-500 ring-1 ring-sky-400 shadow-sm"
                        : "bg-white border-slate-200/90 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Plane className="w-3.5 h-3.5 text-sky-600" />
                          <span className="font-extrabold text-slate-900 text-xs">{f.airline}</span>
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                            {f.flight_number}
                          </span>
                          {f.rating && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              ⭐ {f.rating}
                            </span>
                          )}
                          {f.otp_rate && (
                            <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              {f.otp_rate}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">{f.departure_time}</span>
                          <span>➔</span>
                          <span className="font-bold text-slate-800">{f.arrival_time}</span>
                          <span>•</span>
                          <span>{f.duration_hrs}h flight</span>
                          {f.travel_class && (
                            <>
                              <span>•</span>
                              <span className="font-bold text-sky-600">{f.travel_class}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 whitespace-nowrap pl-2">
                        <span className="font-black text-slate-900 text-sm block">₹{f.total_price_inr}</span>
                        <span className="block text-[9px] text-slate-500 font-medium">(₹{f.cost_inr}/person)</span>
                      </div>
                    </div>

                    {/* Official Airport Route & Best Airport Recommendation */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-[10px] text-slate-600 space-y-1.5">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="truncate max-w-[48%]">🛫 {f.origin_iata || "Origin"} ({f.origin_airport?.split(",")[0]})</span>
                        <span className="text-slate-400">➔</span>
                        <span className="truncate max-w-[48%] text-right font-bold text-slate-900">🛬 {f.destination_iata || "Dest"} ({f.destination_airport?.split(",")[0]})</span>
                      </div>
                      {f.dual_airport_advice && (
                        <div className="text-[9px] font-bold text-sky-800 bg-sky-50 border border-sky-200 rounded-lg px-2 py-1 flex items-center justify-between">
                          <span>{f.dual_airport_advice.badge}</span>
                          <span className="text-slate-500 font-medium">{f.dual_airport_advice.travel_time}</span>
                        </div>
                      )}
                    </div>

                    {/* Clean Minimal Onward Ground Transfer Pill */}
                    {f.ground_transfer_intelligence && f.ground_transfer_intelligence.has_ground_transfer && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setGroundTransferModalTransit(f);
                        }}
                        className="flex items-center justify-between text-[10px] bg-amber-50 hover:bg-amber-100/80 border border-amber-200/90 px-3 py-1.5 rounded-xl text-amber-950 transition-all cursor-pointer shadow-2xs"
                      >
                        <span className="font-semibold flex items-center gap-1">
                          🚗 <strong>Onward Transfer:</strong> Lands at {f.destination_iata} ({f.ground_transfer_intelligence.distance_km} km to {destination})
                        </span>
                        <span className="font-bold text-amber-800 hover:underline flex items-center gap-0.5">
                          {f.selected_ground_transfer ? `✓ ${f.selected_ground_transfer.split("/")[0]}` : "Choose Cab / Bus ➔"}
                        </span>
                      </div>
                    )}

                    {/* Clean Selected Class Pill */}
                    <div className="flex items-center justify-between text-[10px] bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70 text-slate-600">
                      <span>Cabin Class: <strong className="text-slate-900">{f.travel_class || "Saver Economy"}</strong></span>
                      <button type="button" onClick={() => setInspectingTransit(f)} className="text-sky-600 hover:text-sky-700 font-bold hover:underline cursor-pointer">
                        Change Class ➔
                      </button>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          setSelectedTransit(f);
                          if (f.ground_transfer_intelligence && f.ground_transfer_intelligence.has_ground_transfer) {
                            setGroundTransferModalTransit(f);
                          }
                        }}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedTransit?.id === f.id
                            ? "bg-sky-600 text-white shadow-sm font-bold"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                        }`}
                      >
                        {selectedTransit?.id === f.id ? "✓ Flight Selected" : "Select Flight"}
                      </button>
                      <button
                        onClick={() => setInspectingTransit(f)}
                        className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs text-slate-700 font-bold shadow-2xs cursor-pointer"
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
                    className={`p-4 rounded-2xl transition-all space-y-2.5 border shadow-2xs ${
                      selectedTransit?.id === tr.id
                        ? "bg-indigo-50/80 border-indigo-500 ring-1 ring-indigo-400 shadow-sm"
                        : "bg-white border-slate-200/90 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Compass className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="font-extrabold text-slate-900 text-xs">{tr.train_name}</span>
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                            #{tr.train_number}
                          </span>
                          {tr.otp_rate && (
                            <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              {tr.otp_rate}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">{tr.departure_time}</span>
                          <span>➔</span>
                          <span className="font-bold text-slate-800">{tr.arrival_time}</span>
                          <span>•</span>
                          <span>{tr.duration_hrs}h</span>
                          <span>•</span>
                          <span className="font-bold text-indigo-700">{tr.travel_class} Class</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 whitespace-nowrap pl-2">
                        <span className="font-black text-slate-900 text-sm block">₹{tr.total_price_inr}</span>
                        <span className="block text-[9px] text-slate-500 font-medium">(₹{tr.cost_inr}/person)</span>
                      </div>
                    </div>

                    {/* Official Railhead Route & Frequency */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-[10px] text-slate-600 space-y-1.5">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="truncate max-w-[48%]">🚉 {tr.origin_station || tr.origin_code || "Origin Stn"}</span>
                        <span className="text-slate-400">➔</span>
                        <span className="truncate max-w-[48%] text-right font-bold text-slate-900">🚉 {tr.destination_station || tr.destination_code || "Dest Stn"}</span>
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-500 border-t border-slate-200/60 pt-1">
                        <span>📅 {tr.operating_frequency || "Daily (All 7 Days)"}</span>
                        {tr.avg_delay && <span>⏱️ {tr.avg_delay}</span>}
                      </div>
                    </div>

                    {tr.is_multi_leg && (
                      <div className="text-[9px] font-bold text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 leading-tight">
                        📍 {tr.accessibility_note}
                      </div>
                    )}

                    {/* Clean Selected IRCTC Class Pill */}
                    <div className="flex items-center justify-between text-[10px] bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70 text-slate-600">
                      <span>IRCTC Class: <strong className="text-indigo-900">{tr.travel_class || "3A"}</strong></span>
                      <button type="button" onClick={() => setInspectingTransit(tr)} className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline cursor-pointer">
                        Change Class ➔
                      </button>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setSelectedTransit(tr)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedTransit?.id === tr.id
                            ? "bg-indigo-600 text-white shadow-sm font-bold"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                        }`}
                      >
                        {selectedTransit?.id === tr.id ? "✓ Train Selected" : "Select Train"}
                      </button>
                      <button
                        onClick={() => setInspectingTransit(tr)}
                        className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs text-slate-700 font-bold shadow-2xs cursor-pointer"
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
                    className={`p-4 rounded-2xl transition-all space-y-2.5 border shadow-2xs ${
                      selectedTransit?.id === b.id
                        ? "bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-400 shadow-sm"
                        : "bg-white border-slate-200/90 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Compass className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="font-extrabold text-slate-900 text-xs">{b.operator}</span>
                          {b.rating && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              ⭐ {b.rating}
                            </span>
                          )}
                          {b.otp_rate && (
                            <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              {b.otp_rate}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">{b.departure_time}</span>
                          <span>➔</span>
                          <span className="font-bold text-slate-800">{b.arrival_time}</span>
                          <span>•</span>
                          <span>{b.duration_hrs}h journey</span>
                          <span>•</span>
                          <span className="font-bold text-emerald-700">{b.bus_type}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 whitespace-nowrap pl-2">
                        <span className="font-black text-slate-900 text-sm block">₹{b.total_price_inr}</span>
                        <span className="block text-[9px] text-slate-500 font-medium">(₹{b.cost_inr}/person)</span>
                      </div>
                    </div>

                    {/* Boarding and Dropping Hubs */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-[10px] text-slate-600 space-y-1.5">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="truncate max-w-[48%]">🚏 {b.origin_hub || "Origin Bus Hub"}</span>
                        <span className="text-slate-400">➔</span>
                        <span className="truncate max-w-[48%] text-right font-bold text-slate-900">🏁 {b.destination_hub || "Dest Bus Hub"}</span>
                      </div>
                      {b.amenities && (
                        <div className="flex flex-wrap gap-1 border-t border-slate-200/60 pt-1">
                          {b.amenities.map((am: string, amIdx: number) => (
                            <span key={amIdx} className="text-[8px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                              {am}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setSelectedTransit(b)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedTransit?.id === b.id
                            ? "bg-emerald-600 text-white shadow-sm font-bold"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                        }`}
                      >
                        {selectedTransit?.id === b.id ? "✓ Bus Selected" : "Select Bus"}
                      </button>
                      <button
                        onClick={() => setInspectingTransit(b)}
                        className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs text-slate-700 font-bold shadow-2xs cursor-pointer"
                      >
                        {t.detailsBtn}
                      </button>
                    </div>
                  </div>
                ))}

                {/* 4. Car / Self-Drive Highway Intelligence Hub */}
                {transportMode === "self-drive" && transits.map((c) => (
                  <div
                    key={c.id}
                    className={`p-4 rounded-2xl transition-all space-y-3 border shadow-2xs ${
                      selectedTransit?.id === c.id
                        ? "bg-amber-50/70 border-amber-500 ring-1 ring-amber-400 shadow-sm"
                        : "bg-white border-slate-200/90 hover:border-slate-300"
                    }`}
                  >
                    {/* Header: Route Name & Mileage Breakdown */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Car className="w-4 h-4 text-amber-600" />
                          <span className="font-extrabold text-slate-900 text-xs">
                            {useAlternateRoute ? c.alternate_route_name : c.route_name}
                          </span>
                          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Verified Safe Corridor
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1.5">
                          <span>{c.distance_km} km</span>
                          <span>•</span>
                          <span>~{c.duration_hrs}h driving</span>
                          <span>•</span>
                          <span className="font-bold text-amber-800">{c.fuel_consumption}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-slate-900 text-sm">₹{c.total_price_inr}</span>
                        <span className="block text-[9px] text-slate-500 font-medium">
                          (Fuel: ₹{c.fuel_cost_inr} + Toll: ₹{c.toll_cost_inr})
                        </span>
                      </div>
                    </div>

                    {/* Fuel / Engine Type Switcher Buttons */}
                    <div className="pt-2 border-t border-slate-200/70 space-y-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-500 font-bold uppercase tracking-wider">Select Engine & Fuel Type:</span>
                        <span className="font-bold text-amber-800">{c.fuel_rate_applied}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { id: "petrol", label: "⛽ Petrol", badge: "Standard" },
                          { id: "diesel", label: "🛢️ Diesel", badge: "SUV Turbo" },
                          { id: "cng", label: "💨 Green CNG", badge: "Max Mileage" },
                          { id: "ev", label: "⚡ EV Fast", badge: "60kW Fast" }
                        ].map((eng) => {
                          const isSel = activeFuelType.toLowerCase() === eng.id;
                          return (
                            <button
                              key={eng.id}
                              type="button"
                              onClick={() => handleSwitchFuelType(eng.id)}
                              className={`p-2 text-center rounded-xl text-[10px] border transition-all cursor-pointer ${
                                isSel
                                  ? "bg-amber-600 text-white border-amber-600 font-bold shadow-xs ring-1 ring-amber-400"
                                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                              }`}
                            >
                              <span className="block font-bold truncate">{eng.label}</span>
                              <span className={`text-[8px] block ${isSel ? "text-amber-100" : "text-slate-400"}`}>{eng.badge}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Proactive AI Fuel Scarcity Alert */}
                    {c.fuel_drought_alert && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-rose-900">
                        <div className="flex items-center gap-1.5 font-bold text-[11px] text-rose-700">
                          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          <span>AI Fuel Scarcity Alert: {c.fuel_drought_alert.last_pump}</span>
                        </div>
                        <p className="text-[10px] leading-tight text-rose-800">
                          {c.fuel_drought_alert.warning}
                        </p>
                      </div>
                    )}

                    {/* Highway tabs */}
                    <div className="space-y-2 border-t border-slate-200/70 pt-2">
                      <div className="flex border-b border-slate-200 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setCarTab("dhabas")}
                          className={`pb-1.5 px-2 border-b-2 transition-all cursor-pointer ${
                            carTab === "dhabas" ? "border-amber-600 text-amber-800 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          🍲 Highway Dhabas ({c.highway_dhabas?.length || 0})
                        </button>
                        <button
                          type="button"
                          onClick={() => setCarTab("fuel")}
                          className={`pb-1.5 px-2 border-b-2 transition-all cursor-pointer ${
                            carTab === "fuel" ? "border-amber-600 text-amber-800 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          ⛽ Pumps & EV ({c.fuel_stations?.length || 0})
                        </button>
                        <button
                          type="button"
                          onClick={() => setCarTab("mechanics")}
                          className={`pb-1.5 px-2 border-b-2 transition-all cursor-pointer ${
                            carTab === "mechanics" ? "border-amber-600 text-amber-800 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          🔧 Mechanics ({c.mechanics?.length || 0})
                        </button>
                        <button
                          type="button"
                          onClick={() => setCarTab("route")}
                          className={`pb-1.5 px-2 border-b-2 transition-all cursor-pointer ${
                            carTab === "route" ? "border-amber-600 text-amber-800 font-bold" : "border-transparent text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          🛣️ Alternate
                        </button>
                      </div>

                      {carTab === "dhabas" && (
                        <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                          {c.highway_dhabas?.slice(0, 4).map((dh: any, dIdx: number) => (
                            <div key={dIdx} className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-0.5 text-[10px]">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-900">{dh.name}</span>
                                <span className="text-amber-800 font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-full">⭐ {dh.rating}</span>
                              </div>
                              <p className="text-slate-600 line-clamp-1">{dh.specialty}</p>
                              <div className="flex justify-between items-center text-[9px] text-slate-500 pt-0.5 border-t border-slate-200/60">
                                <span>📍 {dh.km_marker}</span>
                                <span className="font-bold text-emerald-700">✨ {dh.hygiene_score}</span>
                                <span className="text-slate-700 font-semibold">₹{dh.price_for_two} for 2</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {carTab === "fuel" && (
                        <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                          {c.fuel_stations?.map((st: any, sIdx: number) => (
                            <div key={sIdx} className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-0.5 text-[10px]">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-900">{st.name}</span>
                                <span className="text-[9px] font-bold text-sky-800 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded-full">{st.type}</span>
                              </div>
                              <p className="text-slate-500 text-[9px]">{st.location} • {st.features}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {carTab === "mechanics" && (
                        <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                          {c.mechanics?.map((m: any, mIdx: number) => (
                            <div key={mIdx} className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-[10px]">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-rose-950">{m.garage_name}</span>
                                <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded-full">24x7 SOS</span>
                              </div>
                              <p className="text-rose-700 text-[9px]">{m.location} • {m.specialty}</p>
                              <div className="flex justify-between items-center pt-1 border-t border-rose-200">
                                <span className="font-bold text-rose-800">{m.phone}</span>
                                <button
                                  type="button"
                                  onClick={openSOSHub}
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[9px] shadow-xs cursor-pointer"
                                >
                                  🚨 Trigger SOS
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {carTab === "route" && (
                        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 text-[10px] text-indigo-950">
                          <div className="space-y-1">
                            <span className="font-bold block text-xs text-indigo-950">🛣️ AI Dynamic Highway Rerouting</span>
                            <p className="text-slate-600">
                              Agar raste me heavy fog, landslide ya highway toll congestion milta hai, AI turant alternate bypass switch kar deta hai:
                            </p>
                          </div>
                          <div className="p-2.5 bg-white border border-indigo-200 rounded-xl space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800">Alternate Corridor:</span>
                              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Landslide Safe</span>
                            </div>
                            <p className="text-[10px] text-slate-700">{c.alternate_route_name}</p>
                            <button
                              type="button"
                              onClick={() => setUseAlternateRoute(!useAlternateRoute)}
                              className={`w-full py-1.5 text-[10px] font-bold rounded-xl border transition-all mt-1 cursor-pointer ${
                                useAlternateRoute
                                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {useAlternateRoute ? "✓ Alternate Safe Bypass Active" : "Switch to Safe Alternate Bypass"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setSelectedTransit(c)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer ${
                          selectedTransit?.id === c.id
                            ? "bg-amber-600 text-white shadow-sm"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                        }`}
                      >
                        {selectedTransit?.id === c.id ? "✓ Driving Route Confirmed" : "Select Driving Route"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  {t.back}
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedTransit}
                  className="flex-1 py-2.5 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold disabled:opacity-40 shadow-sm transition-all cursor-pointer"
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
                <div className="space-y-2 border-b border-slate-200 pb-3.5">
                  <h4 className="font-extrabold text-amber-800 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> {t.midwaySelect} ({midwayCityName})
                  </h4>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {[...midwayHotels].sort((a, b) => b.star_rating - a.star_rating).map((mh) => (
                      <div
                        key={mh.id}
                        onClick={() => setSelectedMidwayHotel(mh)}
                        className={`p-3 rounded-xl cursor-pointer text-xs transition-all flex items-center border shadow-2xs ${
                          selectedMidwayHotel?.id === mh.id
                            ? "bg-amber-50 border-amber-500 text-amber-950 font-bold ring-1 ring-amber-400 shadow-sm"
                            : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg flex-shrink-0 mr-3">
                          🏔️
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold block truncate text-slate-900">{mh.name}</span>
                          <span className="text-amber-700 text-[10px] font-semibold">{mh.star_rating} ⭐ Rating</span>
                        </div>
                        <span className="font-black text-slate-900 ml-2">₹{mh.cost_inr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-800 text-xs">
                  {t.selectHotel}
                </h3>
                <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">Verified Havens</span>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto p-1 pr-1.5">
                {[...hotels].sort((a, b) => (a.proximity_km || 1) - (b.proximity_km || 1)).map((h) => (
                  <div
                    key={h.id}
                    className={`p-4 rounded-2xl transition-all space-y-2.5 border shadow-2xs ${
                      selectedHotel?.id === h.id
                        ? "bg-sky-50/80 border-sky-500 ring-1 ring-sky-400 shadow-sm"
                        : "bg-white border-slate-200/90 hover:border-slate-300"
                    }`}
                  >
                    {/* Top Row: Icon Capsule + Name + Category + Price */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex gap-3 items-start min-w-0 flex-1">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl flex-shrink-0">
                          {h.category?.toLowerCase().includes("resort") ? "🏝️" : h.category?.toLowerCase().includes("homestay") ? "🏡" : "🏨"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-slate-900 text-xs truncate leading-snug">{h.name}</h4>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              ⭐ {h.star_rating}
                            </span>
                            <span className="font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full text-[9px] truncate max-w-[150px]">
                              {h.category || "Hotel & Resort"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 whitespace-nowrap pl-2">
                        <span className="font-black text-slate-900 text-sm block">₹{h.total_stay_cost_inr}</span>
                        <span className="block text-[9px] text-slate-500 font-medium">(₹{h.cost_inr}/night)</span>
                      </div>
                    </div>

                    {/* Proximity & Food Highlight Bar */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-[10px] flex items-center justify-between text-slate-600">
                      <span className="text-emerald-700 font-bold truncate max-w-[55%]">
                        📍 {h.proximity_tag || `${h.proximity_km} km to center`}
                      </span>
                      <span className="text-slate-500 truncate max-w-[42%] text-right font-medium">
                        🍳 {h.meals_included || "Breakfast Available"}
                      </span>
                    </div>

                    {/* Clean Selected Room Category Pill */}
                    <div className="flex items-center justify-between text-[10px] bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70 text-slate-600">
                      <span>Room: <strong className="text-slate-900">{h.selected_room || h.room_options?.[0]?.room_name || "Standard Room"}</strong></span>
                      <button type="button" onClick={() => { setInspectingHotel(h); setActiveModalImage(h.image_url || ""); }} className="text-sky-600 hover:text-sky-700 font-bold hover:underline cursor-pointer">
                        Change Room ➔
                      </button>
                    </div>

                    <div className="flex gap-2 pt-0.5">
                      <button
                        onClick={() => setSelectedHotel(h)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedHotel?.id === h.id
                            ? "bg-sky-600 text-white shadow-sm font-bold"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                        }`}
                      >
                        {selectedHotel?.id === h.id ? "✓ Haven Confirmed" : "Select Haven"}
                      </button>
                      <button
                        onClick={() => { setInspectingHotel(h); setActiveModalImage(h.image_url || ""); }}
                        className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs text-slate-700 font-bold shadow-2xs cursor-pointer"
                      >
                        {t.detailsBtn}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  {t.back}
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!selectedHotel || (selectedTransit?.overnight_stay_required && !selectedMidwayHotel)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold disabled:opacity-40 shadow-sm transition-all cursor-pointer"
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
                <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">{t.pace}</label>
                <div className="grid grid-cols-3 gap-2">
                  {["relaxed", "moderate", "fast"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPace(p)}
                      className={`py-2 border text-xs font-bold rounded-xl capitalize transition-all cursor-pointer ${
                        pace === p
                          ? "bg-sky-50 border-sky-500 text-sky-900 ring-1 ring-sky-400 font-bold shadow-2xs"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <label className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">{t.interests}</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_INTERESTS.map((item) => {
                    const active = interests.includes(item.id);
                    const label = lang === "en" ? item.label_en : item.label_hi;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleInterestToggle(item.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          active
                            ? "bg-sky-600 border-sky-600 text-white shadow-2xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  {t.back}
                </button>
                <button
                  onClick={handleSolve}
                  disabled={solveLoading}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-98 cursor-pointer"
                >
                  {solveLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>{t.generateBtn}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Finalized View Summary */}
          {step === 5 && itinerary && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                  <CheckCircle className="text-emerald-600 w-4 h-4" /> 
                  <span>Expedition Portfolio Confirmed</span>
                </h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Locked
                </span>
              </div>

              {/* Detailed Confirmed Transit Card */}
              {selectedTransit && (
                <div
                  onClick={() => setInspectingTransit(selectedTransit)}
                  className="p-4 bg-white rounded-2xl transition-all cursor-pointer border border-slate-200/90 hover:border-slate-300 space-y-2 group shadow-2xs"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                          {transportMode === "self-drive" ? "🚗 Self-Drive" : transportMode === "flight" ? "✈️ Flight" : transportMode === "train" ? "🚆 Train" : "🚌 Inter-City Bus"}
                        </span>
                        <span className="font-extrabold text-slate-900 text-xs truncate">
                          {selectedTransit.airline || selectedTransit.train_name || selectedTransit.operator || (transportMode === "self-drive" ? `Highway Route (${selectedTransit.fuel_type || "Petrol"})` : "Transit")}
                        </span>
                        {(selectedTransit.flight_number || selectedTransit.train_number || selectedTransit.bus_type) && (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.2 rounded-full">
                            {selectedTransit.flight_number || selectedTransit.train_number || selectedTransit.bus_type}
                          </span>
                        )}
                      </div>

                      {/* Selected Seat / Class / Berth Highlight */}
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-600 flex-wrap">
                        <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          💺 {selectedTransit.travel_class || "Standard Confirmed"}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-700 font-semibold">
                          {selectedTransit.departure_time} ➔ {selectedTransit.arrival_time}
                        </span>
                        {selectedTransit.duration_hrs && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500">{selectedTransit.duration_hrs}h</span>
                          </>
                        )}
                      </div>

                      {/* Confirmed Onward Transfer (if flight landing at nearby hub) */}
                      {selectedTransit.ground_transfer_intelligence && selectedTransit.ground_transfer_intelligence.has_ground_transfer && (
                        <div className="mt-2 flex items-center gap-1.5 text-[9px] text-amber-950 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                          <span>🚗 <strong>Onward Transfer:</strong> {selectedTransit.selected_ground_transfer || selectedTransit.ground_transfer_intelligence?.options?.[0]?.title || selectedTransit.ground_transfer_intelligence?.transfer_type || "Airport Cab / Shuttle"}</span>
                          <span className="text-slate-400">•</span>
                          <span>({selectedTransit.ground_transfer_intelligence.distance_km} km to {destination})</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0 whitespace-nowrap pl-2">
                      <span className="font-black text-slate-900 text-sm block">₹{selectedTransit.total_price_inr}</span>
                      <span className="text-[9px] text-sky-600 font-bold group-hover:underline block mt-0.5">Details ➔</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Confirmed Stay Card */}
              {selectedHotel && (
                <div
                  onClick={() => { setInspectingHotel(selectedHotel); setActiveModalImage(selectedHotel.image_url || ""); }}
                  className="p-4 bg-white rounded-2xl transition-all cursor-pointer border border-slate-200/90 hover:border-slate-300 space-y-2 group shadow-2xs"
                >
                  <div className="flex gap-3 items-start justify-between">
                    <div className="flex gap-3 items-start min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl flex-shrink-0">
                        🏨
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-slate-900 text-xs truncate">{selectedHotel.name}</span>
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            ⭐ {selectedHotel.star_rating}
                          </span>
                        </div>
                        
                        {/* Selected Room & Meal Plan */}
                        <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-600 flex-wrap">
                          <span className="font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
                            🛏️ {selectedHotel.selected_room || selectedHotel.room_options?.[0]?.room_name || "Confirmed Room"}
                          </span>
                        </div>
                        <div className="text-[9px] text-emerald-700 font-semibold mt-1 truncate">
                          🍳 {selectedHotel.meals_included || "Free Breakfast Included"}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 whitespace-nowrap pl-2">
                      <span className="font-black text-slate-900 text-sm block">₹{selectedHotel.total_stay_cost_inr}</span>
                      <span className="text-[9px] text-sky-600 font-bold group-hover:underline block mt-0.5">Details ➔</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirmed Midway Stay (if applicable) */}
              {selectedMidwayHotel && (
                <div
                  onClick={() => { setInspectingHotel(selectedMidwayHotel); setActiveModalImage(selectedMidwayHotel.image_url || ""); }}
                  className="p-3.5 bg-amber-50/70 rounded-2xl transition-all cursor-pointer border border-amber-200 space-y-1.5 shadow-2xs"
                >
                  <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider block">🌙 Confirmed Midway Rest Haven</span>
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-amber-950 text-xs truncate">{selectedMidwayHotel.name}</span>
                    <span className="font-black text-slate-900 text-xs">₹{selectedMidwayHotel.cost_inr}</span>
                  </div>
                </div>
              )}

              {/* Inbuilt RoadGuard AI Autonomous Highway Sentinel */}
              <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-base">🛡️</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>RoadGuard AI Highway Sentinel</span>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Active Telemetry & Crash Sentinel • Inbuilt
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                {/* Real-time Highway Corridor Telemetry Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">LIVE SPEED</span>
                    <span className={`text-xs font-bold ${telemetry.speed > 0 ? "text-emerald-700" : "text-amber-700"}`}>
                      {telemetry.speed > 0 ? `🚗 ${telemetry.speed} km/h` : `🛑 0 km/h (${telemetry.stationaryMins}m stop)`}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">CORRIDOR TRAFFIC</span>
                    <span className="text-xs font-bold text-slate-900">
                      {telemetry.trafficIndex > 0.6 ? `🚗 85% (Toll Jam)` : `🛣️ ${Math.round(telemetry.trafficIndex * 100)}% (Clear)`}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">NEAREST CLINIC</span>
                    <span className="text-xs font-bold text-rose-700 truncate block" title={sosData?.nearest_hospital?.name || "Civil Hospital"}>
                      🏥 {sosData?.nearest_hospital?.name ? sosData.nearest_hospital.name.slice(0, 14) + '...' : "Hospital (1.2 km)"}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">24x7 MEDICAL</span>
                    <span className="text-xs font-bold text-emerald-700 truncate block" title={sosData?.nearest_pharmacy?.name || "Apollo Pharmacy (24x7)"}>
                      💊 {sosData?.nearest_pharmacy?.name ? sosData.nearest_pharmacy.name.slice(0, 14) + '...' : "Apollo (380m)"}
                    </span>
                  </div>
                </div>

                {/* AI Autonomous Thinking & Feed */}
                <div className="p-2.5 bg-white border border-slate-200/80 rounded-xl space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between text-[9.5px]">
                    <span className="text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1">
                      <span>🤖</span> Agentic AI Watchdog:
                    </span>
                    <span className="text-emerald-700 font-bold">Listening 24/7</span>
                  </div>
                  <p className="text-[10px] text-slate-700 leading-relaxed font-medium">
                    {telemetry.aiStatus}
                  </p>
                </div>

                {/* Instant Simulation Trigger (Trained Multi-Scenario Engine) */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                    🧪 Test Autonomous Safety Scenarios:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => triggerAutonomousAnomalyDetection("traffic_jam")}
                      className="py-1.5 px-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-[9.5px] font-bold transition-all text-center shadow-2xs cursor-pointer"
                    >
                      🚗 Toll Jam
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerAutonomousAnomalyDetection("isolated_stop")}
                      className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-[9.5px] font-bold transition-all text-center shadow-2xs cursor-pointer"
                    >
                      ⚠️ Open Stop
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerAutonomousAnomalyDetection("midnight_stop")}
                      className="py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-[9.5px] font-bold transition-all text-center shadow-2xs cursor-pointer"
                    >
                      🌙 Midnight Stop
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerAutonomousAnomalyDetection("sudden_impact")}
                      className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-[9.5px] font-bold transition-all text-center shadow-2xs cursor-pointer"
                    >
                      💥 Crash Alert
                    </button>
                  </div>
                </div>
              </div>

              {/* 1-Click Export & Share Vouchers */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => openSafarGuardian()}
                  className="py-2.5 px-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 transition-all shadow-2xs cursor-pointer"
                >
                  <span>📡</span> Live Share
                </button>
                <button
                  type="button"
                  onClick={shareToWhatsApp}
                  className="py-2.5 px-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 transition-all shadow-2xs cursor-pointer"
                >
                  <span>💬</span> WhatsApp
                </button>
                <button
                  type="button"
                  onClick={printVoucher}
                  className="py-2.5 px-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 transition-all shadow-2xs cursor-pointer"
                >
                  <span>🖨️</span> Save PDF
                </button>
              </div>

              <button
                onClick={() => setStep(4)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all mt-1 cursor-pointer"
              >
                Modify Selections & Re-optimize
              </button>
            </div>
          )}
        </div>

        {/* Right Output Panel: Itinerary Accordion & Map */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Permanent Parameter overview header */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-500 block font-bold text-[10px] uppercase tracking-wider">{t.originDestLabel || "Route"}</span>
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs truncate">
                <span>{origin || "Delhi"}</span>
                <span className="text-slate-400">→</span>
                <span>{destination || "Manali"}</span>
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-500 block font-bold text-[10px] uppercase tracking-wider">{t.dates || "Dates"}</span>
              <span className="font-semibold text-slate-700 text-xs block truncate">{depDate} → {retDate}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-500 block font-bold text-[10px] uppercase tracking-wider">{t.travelers || "Travelers"}</span>
              <span className="font-semibold text-slate-700 text-xs block">{travelers} {t.peopleUnit || "People"}</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-500 block font-bold text-[10px] uppercase tracking-wider">{t.allocatedBudget || "Budget"}</span>
              <span className="font-extrabold text-slate-900 text-xs block">₹{budget?.toLocaleString("en-IN") || budget}</span>
            </div>
          </div>

          {!itinerary && (
            <div className="h-[420px] bg-white border border-slate-200/90 rounded-2xl flex flex-col items-center justify-center text-center p-8 shadow-sm">
              <Compass className="text-slate-300 w-12 h-12 mb-3 animate-bounce" />
              <h3 className="font-bold text-slate-800 text-sm">{t.noActiveItinerary || "No Active Itinerary"}</h3>
              <p className="text-slate-500 text-xs max-w-xs mt-1">
                {t.noPlanYet || "Configure parameters on the left and click 'Search Options' to start."}
              </p>
            </div>
          )}

          {itinerary && (
            <div className="space-y-6">
              
              {/* Agentic AI Proactive Conflict Resolution Banner */}
              {itinerary.optimization_applied && (
                <div className="bg-emerald-50 border border-emerald-200/80 p-4 rounded-2xl shadow-sm space-y-2.5 text-xs animate-fade-in">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                    <h4 className="font-extrabold text-xs text-emerald-900 uppercase tracking-wider">
                      🤖 Agentic AI Proactive Conflict Resolution Applied
                    </h4>
                    <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold px-2.5 py-0.5 rounded-full">
                      ₹{itinerary.cost_breakdown?.remaining_balance ?? 0} Saved Under Hard Budget
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    Your initial stay choice of <strong className="text-rose-600 line-through">{itinerary.optimization_applied?.original_stay || "Original Hotel"} (₹{itinerary.optimization_applied?.original_stay_cost || 0})</strong> combined with transport & food exceeded your hard budget limit of <strong className="text-slate-900">₹{budget}</strong> (Total would be ₹{itinerary.optimization_applied?.original_total_cost || budget}).
                  </p>
                  <div className="p-3 bg-white border border-emerald-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                    <div>
                      <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">Proactive AI Substitution:</span>
                      <span className="font-extrabold text-slate-900 text-xs">🏨 {itinerary.optimization_applied?.optimized_stay || "Recommended Hotel"} (₹{itinerary.optimization_applied?.optimized_stay_cost || 0})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-500 block">Final Optimized Price:</span>
                      <span className="font-black text-emerald-700 text-sm">₹{itinerary.total_cost_inr || 0}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    💡 The agent resolved this constraint autonomously by substituting the highest-utility verified stay within your ₹{budget} ceiling, keeping your chosen flight/transit intact.
                  </p>
                </div>
              )}

              {/* Cost Header breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                  <span className="text-[10px] text-slate-500 font-extrabold tracking-wider block uppercase">{t.allocatedBudget}</span>
                  <span className="text-lg font-black text-slate-900 flex items-center mt-1">
                    <IndianRupee className="w-4 h-4 text-slate-400 mr-0.5" /> {itinerary.cost_breakdown?.allocated_budget || budget || 0}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 border-l-4 border-l-sky-500 shadow-sm">
                  <span className="text-[10px] text-sky-600 font-extrabold tracking-wider block uppercase">{t.estimatedCost}</span>
                  <span className="text-lg font-black text-slate-900 flex items-center mt-1">
                    <IndianRupee className="w-4 h-4 text-sky-600 mr-0.5" /> {itinerary.total_cost_inr || 0}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/90 border-l-4 border-l-emerald-500 shadow-sm">
                  <span className="text-[10px] text-emerald-600 font-extrabold tracking-wider block uppercase">{t.remainingBalance}</span>
                  <span className="text-lg font-black text-emerald-600 flex items-center mt-1">
                    <IndianRupee className="w-4 h-4 text-emerald-600 mr-0.5" /> {itinerary.cost_breakdown?.remaining_balance ?? 0}
                  </span>
                </div>
              </div>

              {/* Tabulated Cost details */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-2 text-xs">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">{t.distributeBudget}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">{t.stayCost}</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">₹{itinerary.cost_breakdown?.stays ?? 0}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">{t.transportCost}</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">₹{itinerary.cost_breakdown?.transport ?? 0}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">{t.foodCost}</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">₹{itinerary.cost_breakdown?.food ?? 0}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">{t.ticketCost}</span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">₹{itinerary.cost_breakdown?.activities ?? 0}</span>
                  </div>
                </div>
              </div>

              {/* Gemini evaluation summary */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2.5 mb-2.5">
                  <HeartHandshake className="text-sky-600 w-4 h-4" /> {t.explanation}
                </h3>
                <div className="text-slate-700 text-xs leading-relaxed whitespace-pre-line font-normal">
                  {itinerary.explanation}
                </div>
              </div>

              {/* Agent Thinking Cycle Log Trace (Collapsible for Mentor Inspection & Clean Production) */}
              {agentLogs.length > 0 && (
                <div className="bg-white text-slate-900 p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                      <Terminal className="text-emerald-600 w-4 h-4" /> Agentic AI Execution Trace
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold border border-emerald-200">
                        Mentor Inspection Mode
                      </span>
                      <button
                        onClick={() => setShowAgentTrace(!showAgentTrace)}
                        className="text-[10px] text-slate-700 hover:text-slate-900 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 transition-all font-bold border border-slate-200 cursor-pointer"
                      >
                        {showAgentTrace ? "Hide Box" : "Show Box"}
                      </button>
                    </div>
                  </div>

                  {showAgentTrace ? (
                    <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                      {agentLogs.map((log: any, idx: number) => {
                        const stepTitle = log.step || log.title || `Agent Step ${idx + 1}`;
                        const actionName = log.action ? `${log.action.split('(')[0]}()` : (log.timestamp ? `@${log.timestamp}` : "reAct()");
                        const thoughtText = log.thought || log.detail || "Agent evaluated logistics constraint.";
                        return (
                          <div key={idx} className="border-l-2 border-emerald-400 pl-3.5 ml-1.5 space-y-1 relative text-left">
                            <div className="absolute w-2 h-2 bg-emerald-500 rounded-full -left-[5px] top-1"></div>
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-extrabold text-emerald-700 uppercase tracking-wider">{stepTitle}</span>
                              <span className="text-slate-500 font-mono">{actionName}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 font-medium italic">Thought: "{thoughtText}"</p>
                            {(log.action || log.observation || log.detail) && (
                              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-[9px] text-slate-600">
                                {log.action && (
                                  <div>
                                    <span className="text-indigo-600 font-bold">Action:</span> {log.action}
                                  </div>
                                )}
                                {(log.observation || log.detail) && (
                                  <div>
                                    <span className="text-sky-600 font-bold">Observation:</span> {log.observation || log.detail}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 italic">
                      ✅ 6-stage autonomous ReAct cycle completed with zero errors. Click "Show Box" to expand full execution thoughts and actions.
                    </p>
                  )}
                </div>
              )}

              {/* Timeline & Maps */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* Timeline Accordion with Flexible Day Slots */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-2.5 gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900">Itinerary Timeline</h3>
                    <div className="flex items-center gap-3">
                      {(transportMode === "self-drive" || selectedTransit?.is_multi_leg) && (
                        <div className="flex items-center gap-1.5 border border-slate-200 px-2.5 py-1 rounded-xl bg-slate-50 text-[10px] font-bold">
                          <span className="text-slate-500">Pace / Traffic:</span>
                          <input
                            type="range"
                            min="0.7"
                            max="1.5"
                            step="0.1"
                            value={speedMultiplier}
                            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                            className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <span className={speedMultiplier > 1.0 ? "text-emerald-600" : speedMultiplier < 1.0 ? "text-rose-600" : "text-slate-700"}>
                            {speedMultiplier}x
                          </span>
                        </div>
                      )}

                    </div>
                  </div>
                  <div className="space-y-2">
                    {(itinerary.days || []).map((day: any) => {
                      const isExpanded = expandedDay === day.day_number;
                      return (
                        <div key={day.day_number} className="border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
                          <button
                            onClick={() => setExpandedDay(isExpanded ? null : day.day_number)}
                            className="w-full bg-slate-50 hover:bg-slate-100 p-3 flex justify-between items-center text-xs font-extrabold text-slate-900 border-b border-slate-200/80 transition-all cursor-pointer"
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-sky-500" />
                              DAY {day.day_number}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {day.schedule?.length || 0} items (click to toggle)
                            </span>
                          </button>

                          {isExpanded && (
                            <div className="p-3 space-y-3 bg-white divide-y divide-slate-100">
                              {(day.schedule || []).map((item: any, idx: number) => {
                                const isLogistics = item.category === "logistics";
                                const isFood = item.category === "food";
                                return (
                                  <div key={idx} className="pt-2.5 first:pt-0 text-xs flex justify-between items-start gap-3">
                                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-base flex-shrink-0 mt-0.5">
                                        {isFood ? "🍽️" : isLogistics ? "✈️" : "📍"}
                                      </div>
                                      <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                            isLogistics ? "bg-sky-50 text-sky-800 border border-sky-200" : isFood ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-purple-50 text-purple-800 border border-purple-200"
                                          }`}>
                                            {isLogistics ? t.logisticsTitle : isFood ? t.foodTitle : t.interests}
                                          </span>
                                          <span className="text-[10px] text-slate-400 font-mono">({item.start_time})</span>
                                        </div>
                                        <h5 className={`font-extrabold text-xs flex items-center gap-1 truncate ${item.is_closed_alert ? "text-rose-600" : "text-slate-900"}`}>
                                          {item.name} {item.rating ? <span className="text-[10px] text-amber-600 font-normal flex-shrink-0">({(item.rating < 1.0 ? item.rating * 5.0 : item.rating).toFixed(1)} ⭐)</span> : ""}
                                        </h5>
                                        {item.description && <p className={`text-[10px] leading-relaxed ${item.is_closed_alert ? "text-rose-600 font-semibold" : "text-slate-600"}`}>{item.description}</p>}
                                      </div>
                                    </div>
                                    {item.cost_inr > 0 && (
                                      <span className="text-[9px] text-slate-700 font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg flex-shrink-0">
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
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <span>🗺️</span> Map & Expedition Route
                    </h3>
                    <span className="text-[9px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      CartoDB Live Map
                    </span>
                  </div>
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
              <div className="p-4 bg-white border border-slate-200/90 rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="font-black text-xs text-slate-900 flex items-center gap-1.5">
                    <span>💳</span> {t.bookBtn}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Apple Pay & Razorpay Instant Voucher Simulator</p>
                </div>
                <button
                  onClick={() => { setShowPayment(true); setPaySuccess(false); }}
                  className="px-6 py-2.5 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-md shadow-sky-600/20 transition-all active:scale-98 cursor-pointer"
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 relative space-y-4 shadow-2xl text-slate-900">
            <button onClick={() => setShowRouteFactors(false)} className="absolute right-4 top-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-all">
              <X className="w-5 h-5" />
            </button>
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Info className="text-sky-600 w-4 h-4" /> {t.factorTitle} (8 Factors Analyzed)
              </h3>
            </div>
            
            <div className="space-y-4 text-sm max-h-[420px] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block mb-0.5">Total Distance</span>
                  <span className="font-black text-slate-900 text-base">{selectedTransit.driving_distance_km} km</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block mb-0.5">Driving Duration</span>
                  <span className="font-black text-slate-900 text-base">{selectedTransit.duration_hrs} hours</span>
                </div>
              </div>

              {/* Fuel and EV charging stations grids */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block mb-0.5">Petrol Pumps</span>
                    <span className="font-black text-slate-900 text-sm">{selectedTransit.fuel_pumps_count || 12} locations</span>
                  </div>
                  <Fuel className="w-5 h-5 text-sky-600 flex-shrink-0" />
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block mb-0.5">EV Fast Chargers</span>
                    <span className="font-black text-emerald-600 text-sm">{selectedTransit.ev_stations_count || 6} stations</span>
                  </div>
                  <Zap className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                </div>
              </div>

              {/* State Fuel Rate Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                <div className="bg-slate-100/80 px-3.5 py-2.5 text-[10px] font-extrabold text-slate-700 flex justify-between uppercase tracking-wider">
                  <span>State Border Fuel Rates ({selectedTransit.fuel_info?.location || "Highway Corridor"})</span>
                  <span>Source</span>
                </div>
                <div className="p-3.5 flex justify-between text-xs font-bold text-slate-900">
                  <span className="capitalize">{(derivedSpecs?.fuel_type || "fuel").replace("_", " ")}: ₹{selectedTransit.fuel_info?.price_per_unit || "96.72"} / unit</span>
                  <span className="text-slate-500 font-medium text-[10px] my-auto">{selectedTransit.fuel_info?.source || "Live Fuel Telemetry"}</span>
                </div>
              </div>

              {/* Toll plazas details table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <div className="bg-slate-100/80 px-3.5 py-2.5 text-[10px] font-extrabold text-slate-700 flex justify-between uppercase tracking-wider">
                  <span>Toll Plaza Crossings</span>
                  <span>Single-way Fee</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {(selectedTransit.toll_plazas || []).map((toll: any, tIdx: number) => (
                    <div key={tIdx} className="p-2.5 px-3.5 flex justify-between text-xs text-slate-700">
                      <span>{toll.name}</span>
                      <span className="font-bold text-slate-900">₹{toll.fee_inr}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-50 p-3 px-3.5 text-xs font-extrabold text-slate-900 border-t border-slate-200 flex justify-between">
                  <span>Total Tolls Cost</span>
                  <span className="text-emerald-600">₹{selectedTransit.total_toll_cost_inr || 0}</span>
                </div>
              </div>

              {/* suggested road stops */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <div className="bg-slate-100/80 px-3.5 py-2.5 text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
                  {t.restStops} (Click to toggle/schedule stops)
                </div>
                <div className="divide-y divide-slate-100">
                  {(selectedTransit.suggested_rest_stops || []).map((stop: any, sIdx: number) => {
                    const isAdded = selectedRestStops.some(x => x.name === stop.name);
                    return (
                      <div
                        key={sIdx}
                        onClick={() => handleToggleRestStop(stop)}
                        className={`p-3 px-4 flex justify-between items-center text-xs cursor-pointer transition-all hover:bg-slate-50 ${
                          isAdded ? "bg-emerald-50 text-emerald-900 border-l-4 border-l-emerald-600" : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                            {isAdded && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                            {stop.name} (approx {stop.dist_km} km)
                          </span>
                          <span className="text-slate-500 text-xs block truncate">{stop.cuisine}</span>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg flex-shrink-0 ${
                          isAdded ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-slate-100 text-slate-600"
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
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer"
            >
              {t.closeBtn}
            </button>
          </div>
        </div>
      )}

      {/* 🚗 Dedicated Onward Ground Transfer & Taxi Bargaining Popup Window */}
      {groundTransferModalTransit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-amber-200 rounded-3xl max-w-lg w-full max-h-[88vh] overflow-y-auto p-6 relative space-y-4 shadow-2xl text-slate-900">
            <button
              onClick={() => setGroundTransferModalTransit(null)}
              className="absolute right-4 top-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl text-lg">🚗</span>
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">
                    Onward Ground Transfer & Taxi Guide
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                    Flight lands at {groundTransferModalTransit.destination_iata || "nearest airport"} ({groundTransferModalTransit.ground_transfer_intelligence?.distance_km} km from {destination})
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
              {groundTransferModalTransit.ground_transfer_intelligence?.summary || `Flight lands at nearest commercial airport (${groundTransferModalTransit.destination_iata || "Hub"}) • Onward scenic ground transfer to ${destination}.`}
            </p>

            {/* 1-Click Interactive Mode Selector */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                Choose How You Want to Reach {destination}:
              </span>
              <div className="space-y-2">
                {((groundTransferModalTransit.ground_transfer_intelligence?.options && groundTransferModalTransit.ground_transfer_intelligence.options.length > 0)
                  ? groundTransferModalTransit.ground_transfer_intelligence.options
                  : [
                      {
                        mode: "cab",
                        title: groundTransferModalTransit.ground_transfer_intelligence?.transfer_type || "Airport Pre-Paid Taxi / Cab",
                        icon: "🚕",
                        estimated_fare_range: groundTransferModalTransit.ground_transfer_intelligence?.transfer_cost_inr ? `₹${groundTransferModalTransit.ground_transfer_intelligence.transfer_cost_inr}` : "₹900 - ₹1,400",
                        duration: groundTransferModalTransit.ground_transfer_intelligence?.transfer_duration || "35 mins",
                        pricing_type: "Fixed Pre-Paid Booth",
                        bargaining_tip: "Official pre-paid booth inside arrival terminal has fixed transparent rates.",
                        availability: "24x7 Outside Arrival Gate",
                        schedule_services: [
                          { name: "Pre-Paid Sedan / Hatchback", timings: "24x7 On Demand", route_stops: `Airport ➔ ${destination || "City"} Hotel Drop`, fare: `₹${groundTransferModalTransit.ground_transfer_intelligence?.transfer_cost_inr || 950}`, capacity: "3-4 Pax" }
                        ]
                      },
                      {
                        mode: "bus",
                        title: "Airport Electric AC Express Shuttle",
                        icon: "🚌",
                        estimated_fare_range: "₹100 - ₹250 / person",
                        duration: "1 hr 10 mins",
                        pricing_type: "Fixed Government Transit",
                        bargaining_tip: "Fixed fare ticket issued at airport exit counter or on board.",
                        availability: "Every 30 mins (06:00 AM - 11:30 PM)",
                        schedule_services: [
                          { name: "City Express EV Shuttle", timings: "Every 30 mins", route_stops: `Airport Highway Gate ➔ ${destination || "Central"} Stand`, fare: "₹120 / seat", capacity: "AC Electric Bus" }
                        ]
                      }
                    ]
                ).map((opt: any, optIdx: number, allOpts: any[]) => {
                  const defaultTitle = allOpts[0]?.title || "";
                  const isSel = (groundTransferModalTransit.selected_ground_transfer || defaultTitle) === opt.title;
                  return (
                    <div
                      key={optIdx}
                      onClick={() => {
                        handleSelectGroundTransfer(groundTransferModalTransit.id, opt);
                        setGroundTransferModalTransit({
                          ...groundTransferModalTransit,
                          selected_ground_transfer: opt.title,
                          selected_ground_option: opt
                        });
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSel
                          ? "bg-amber-50/80 border-amber-500 shadow-md ring-1 ring-amber-400 text-slate-900"
                          : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{opt.icon}</span>
                          <div>
                            <span className="font-extrabold text-xs text-slate-900 block">{opt.title}</span>
                            <span className="text-[9px] text-slate-500 font-medium">⏱️ {opt.duration} • {opt.availability}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-xs text-slate-900 block">{opt.estimated_fare_range}</span>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            opt.pricing_type?.includes("Bargain") ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}>
                            {opt.pricing_type || "Standard"}
                          </span>
                        </div>
                      </div>

                      {/* Detailed Running Services & Timetable when selected */}
                      {isSel && (
                        <div className="mt-2.5 pt-2.5 border-t border-amber-200 space-y-2.5 text-[10px]">
                          {/* Live Services List (Trains / Buses / Cabs) */}
                          {opt.schedule_services && opt.schedule_services.length > 0 && (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1">
                                  📋 Available {(opt.mode || "Transit").toUpperCase()} Services & Timetable:
                                </span>
                                <span className="text-[9px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">
                                  {opt.schedule_services.length} Running Services
                                </span>
                              </div>

                              <div className="space-y-1.5">
                                {(opt.schedule_services || []).map((svc: any, sIdx: number) => {
                                  const isSvcChosen = (groundTransferModalTransit.selected_ground_service || opt.schedule_services?.[0]?.name) === svc.name;
                                  return (
                                    <div
                                      key={sIdx}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setGroundTransferModalTransit({
                                          ...groundTransferModalTransit,
                                          selected_ground_service: svc.name,
                                          selected_ground_transfer: `${opt.title} (${svc.name})`
                                        });
                                        if (selectedTransit?.id === groundTransferModalTransit.id) {
                                          setSelectedTransit({
                                            ...selectedTransit,
                                            selected_ground_service: svc.name,
                                            selected_ground_transfer: `${opt.title} (${svc.name})`
                                          });
                                        }
                                      }}
                                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                                        isSvcChosen
                                          ? "bg-amber-100/70 border-amber-400 shadow-xs ring-1 ring-amber-400"
                                          : "bg-white hover:bg-amber-50/50 border-slate-200"
                                      }`}
                                    >
                                      <div className="flex items-center justify-between font-black text-slate-900">
                                        <span className="text-[10.5px] text-slate-900 flex items-center gap-1 font-bold">
                                          {opt.icon} {svc.name}
                                        </span>
                                        <span className="text-amber-800 text-[10.5px] font-black bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                                          {svc.fare}
                                        </span>
                                      </div>

                                      <div className="flex items-center justify-between text-[9px] text-slate-500 font-semibold mt-1">
                                        <span>⏰ {svc.timings}</span>
                                        <span className="text-slate-600 font-medium bg-slate-100 px-1.5 py-0.5 rounded">{svc.capacity}</span>
                                      </div>

                                      {svc.operator && (
                                        <div className="text-[8px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded w-fit mt-1">
                                          🏛️ {svc.operator}
                                        </div>
                                      )}

                                      <div className="text-[8.5px] text-slate-600 bg-slate-50 p-1.5 rounded-lg font-medium mt-1 border border-slate-200">
                                        📍 <strong>Route & Stops:</strong> {svc.route_stops}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Bargaining & Ground Truth Advice */}
                          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[9px] text-amber-900 font-medium">
                            💡 <strong>Local Bargaining Guide:</strong> {opt.bargaining_tip}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hotel last-mile tip */}
            {groundTransferModalTransit.ground_transfer_intelligence?.hotel_last_mile && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[9px] text-emerald-900">
                <strong>🏨 Local Hotel Last-Mile Tip:</strong> {groundTransferModalTransit.ground_transfer_intelligence.hotel_last_mile}
              </div>
            )}

            <div className="text-[9px] text-slate-500 italic">
              * Ground transfer fare is paid directly during journey; not charged in flight booking.
            </div>

            <button
              onClick={() => setGroundTransferModalTransit(null)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all active:scale-98 cursor-pointer"
            >
              Confirm Onward Transfer Selection ✓
            </button>
          </div>
        </div>
      )}

      {/* Transit Inspector Modal Overlay */}
      {inspectingTransit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 relative space-y-4 shadow-2xl text-slate-900">
            <button onClick={() => setInspectingTransit(null)} className="absolute right-4 top-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-all cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Info className="text-sky-600 w-4 h-4" /> Transit Details Inspection
              </h3>
            </div>
            <div className="space-y-3.5 text-xs max-h-[420px] overflow-y-auto pr-1">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-900 text-base block">{inspectingTransit.airline || inspectingTransit.train_name || inspectingTransit.operator}</span>
                  <span className="text-[10px] font-bold text-slate-500">{inspectingTransit.flight_number || inspectingTransit.train_number || inspectingTransit.bus_type}</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 text-base block">₹{inspectingTransit.total_price_inr}</span>
                  <span className="text-[9px] text-slate-500 font-medium">(₹{inspectingTransit.cost_inr}/person)</span>
                </div>
              </div>

              {/* 💺 In-Modal Interactive Class / Berth Selector */}
              {inspectingTransit.class_options && inspectingTransit.class_options.length > 0 && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">
                    Choose Class Option (1-Click Price Update):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(inspectingTransit.class_options || []).map((opt: any) => {
                      const isSelected = inspectingTransit.travel_class === opt.class_name;
                      return (
                        <button
                          key={opt.class_name}
                          type="button"
                          onClick={() => {
                            handleSelectTransitClass(inspectingTransit.id, opt);
                            setInspectingTransit({
                              ...inspectingTransit,
                              travel_class: opt.class_name,
                              cost_inr: opt.cost_inr,
                              total_price_inr: opt.total_price_inr,
                              baggage_allowance: opt.baggage_allowance || inspectingTransit.baggage_allowance,
                              cancellation_policy: opt.cancellation_policy || inspectingTransit.cancellation_policy
                            });
                          }}
                          className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-sky-50 text-slate-900 border-sky-500 font-bold shadow-sm ring-1 ring-sky-400"
                              : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[11px] truncate">{opt.class_name}</span>
                            <span className={`font-black text-xs ${isSelected ? "text-sky-700" : "text-slate-900"}`}>
                              ₹{opt.total_price_inr}
                            </span>
                          </div>
                          {opt.seat_desc && (
                            <span className={`text-[9px] block mt-0.5 ${isSelected ? "text-sky-600" : "text-slate-500"}`}>
                              {opt.seat_desc}
                            </span>
                          )}
                          {opt.baggage_allowance && (
                            <span className={`text-[8px] block mt-0.5 ${isSelected ? "text-sky-600" : "text-slate-400"}`}>
                              🧳 {opt.baggage_allowance}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Name / Operator</span>
                <span className="font-bold text-slate-900">{inspectingTransit.airline || inspectingTransit.train_name || inspectingTransit.operator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Number / Class</span>
                <span className="font-bold text-slate-900">{inspectingTransit.flight_number || inspectingTransit.train_number || inspectingTransit.bus_type}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <span className="text-slate-500">Departure Time</span>
                <span className="font-bold text-slate-900">{inspectingTransit.departure_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Arrival Time</span>
                <span className="font-bold text-slate-900">{inspectingTransit.arrival_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.delayRateLabel}</span>
                <span className="font-bold text-rose-600">{inspectingTransit.delay_rate} delay average</span>
              </div>
              {inspectingTransit.data_status && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Data Trust Status</span>
                  <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    inspectingTransit.data_status === "LIVE" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                    inspectingTransit.data_status === "DEMO" || inspectingTransit.data_status === "FALLBACK" ? "bg-rose-100 text-rose-800 border border-rose-200" :
                    inspectingTransit.data_status === "VERIFIED" ? "bg-sky-100 text-sky-800 border border-sky-200" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {inspectingTransit.data_status} DATA
                  </span>
                </div>
              )}
              {/* 🛫 Dual Airport Proximity Recommendation */}
              {inspectingTransit.dual_airport_advice && (
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sky-800 flex items-center gap-1">
                      🛫 {inspectingTransit.dual_airport_advice.badge}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {inspectingTransit.dual_airport_advice.travel_time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                    {inspectingTransit.dual_airport_advice.comparison}
                  </p>
                  <div className="text-[10px] text-slate-500 font-semibold pt-1 border-t border-sky-200">
                    📍 Recommended for: <span className="text-slate-900 font-bold">{inspectingTransit.dual_airport_advice.recommended_for}</span>
                  </div>
                </div>
              )}

              {inspectingTransit.baggage_allowance && (
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.baggageLabel}</span>
                  <span className="font-bold text-slate-900">{inspectingTransit.baggage_allowance}</span>
                </div>
              )}

              {/* 🛡️ Official Cancellation & Refund Policy Slabs */}
              {inspectingTransit.cancellation_policy && (
                <div className="border-t border-slate-100 pt-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase flex items-center gap-1">
                      🛡️ Cancellation & Refund Policy
                    </span>
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                      {inspectingTransit.cancellation_policy.policy_type}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium">
                    {inspectingTransit.cancellation_policy.summary}
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-[10px]">
                    {(inspectingTransit.cancellation_policy.slabs || []).map((slab: any, sIdx: number) => (
                      <div key={sIdx} className="p-2 flex justify-between items-center">
                        <span className="font-medium text-slate-700">{slab.window}</span>
                        <div className="text-right">
                          <span className="font-extrabold text-emerald-700 block">{slab.refund_pct}</span>
                          <span className="text-[9px] text-slate-500">({slab.deduction})</span>
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
                    <span className="text-[9px] font-extrabold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded block w-fit mb-0.5 border border-amber-200">
                      {inspectingTransit.promo_code.badge}
                    </span>
                    <span className="font-extrabold text-slate-900">Coupon: {inspectingTransit.promo_code.code}</span>
                    <p className="text-[10px] text-slate-500">{inspectingTransit.promo_code.description}</p>
                  </div>
                  <span className="text-sm font-black text-amber-700">-₹{inspectingTransit.promo_code.discount_inr}</span>
                </div>
              )}

              {/* 🛣️ Onward Ground Transfer & Taxi Bargaining Guide in Modal */}
              {inspectingTransit.ground_transfer_intelligence && (
                <div className="border-t border-slate-100 pt-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wider flex items-center gap-1">
                      🛣️ Onward Ground Transfer Guide
                    </span>
                    <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                      {inspectingTransit.ground_transfer_intelligence?.distance_km || 35} km to destination
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium">
                    {inspectingTransit.ground_transfer_intelligence?.summary || "Onward ground transfer available from arrival terminal."}
                  </p>
                  <div className="space-y-1.5">
                    {((inspectingTransit.ground_transfer_intelligence?.options && inspectingTransit.ground_transfer_intelligence.options.length > 0)
                      ? inspectingTransit.ground_transfer_intelligence.options
                      : [
                          {
                            mode: "cab",
                            title: inspectingTransit.ground_transfer_intelligence?.transfer_type || "Airport Pre-Paid Taxi / Cab",
                            icon: "🚕",
                            estimated_fare_range: inspectingTransit.ground_transfer_intelligence?.transfer_cost_inr ? `₹${inspectingTransit.ground_transfer_intelligence.transfer_cost_inr}` : "₹900 - ₹1,400",
                            duration: inspectingTransit.ground_transfer_intelligence?.transfer_duration || "35 mins",
                            pricing_type: "Fixed Pre-Paid Booth",
                            bargaining_tip: "Official pre-paid booth inside arrival terminal has fixed transparent rates.",
                            availability: "24x7 Outside Arrival Gate"
                          },
                          {
                            mode: "bus",
                            title: "Airport Electric AC Express Shuttle",
                            icon: "🚌",
                            estimated_fare_range: "₹100 - ₹250 / person",
                            duration: "1 hr 10 mins",
                            pricing_type: "Fixed Government Transit",
                            bargaining_tip: "Fixed fare ticket issued at airport exit counter or on board.",
                            availability: "Every 30 mins (06:00 AM - 11:30 PM)"
                          }
                        ]
                    ).map((gOpt: any, gIdx: number) => (
                      <div key={gIdx} className="p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[10px]">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900 flex items-center gap-1">
                            {gOpt.icon} {gOpt.title}
                          </span>
                          <span className="font-extrabold text-amber-800">{gOpt.estimated_fare_range}</span>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-500">
                          <span>⏱️ {gOpt.duration} • {gOpt.availability}</span>
                          <span className={`font-bold px-1.5 py-0.2 rounded ${gOpt.pricing_type?.includes("Bargain") ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                            {gOpt.pricing_type || "Standard"}
                          </span>
                        </div>
                        {gOpt.bargaining_tip && (
                          <p className="text-[9px] text-slate-700 bg-white p-1.5 rounded border border-slate-200">
                            💡 <strong>Bargaining Tip:</strong> {gOpt.bargaining_tip}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  {inspectingTransit.ground_transfer_intelligence?.hotel_last_mile && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[9px] text-emerald-900">
                      <strong>🏨 Hotel Last-Mile Tip:</strong> {inspectingTransit.ground_transfer_intelligence.hotel_last_mile}
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-slate-100 pt-2 space-y-1">
                <span className="text-[10px] text-slate-500 font-extrabold uppercase">Traveler Reviews</span>
                {inspectingTransit.reviews?.map((r: string, rIdx: number) => (
                  <p key={rIdx} className="text-[10px] text-slate-700 bg-slate-50 border border-slate-200 p-2 rounded-xl">
                    "{r}"
                  </p>
                ))}
              </div>
            </div>
            <button
              onClick={() => { setSelectedTransit(inspectingTransit); setInspectingTransit(null); }}
              className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/20 transition-all active:scale-98 cursor-pointer"
            >
              Select This Transit
            </button>
          </div>
        </div>
      )}

      {/* Hotel Inspector Modal Overlay */}
      {inspectingHotel && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 relative space-y-4 shadow-2xl text-slate-900">
            <button onClick={() => setInspectingHotel(null)} className="absolute right-4 top-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-all cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <HotelHome className="text-amber-500 w-4 h-4" /> Hotel Details Inspection
              </h3>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl flex-shrink-0">
                  🏨
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 text-base block">{inspectingHotel.name}</span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {inspectingHotel.category || "Verified Haven & Resort"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-amber-600 text-sm block">⭐ {inspectingHotel.star_rating}</span>
                <span className="text-[10px] text-slate-500 font-bold">₹{inspectingHotel.cost_inr}/night</span>
              </div>
            </div>
            <div className="space-y-3 text-xs max-h-[360px] overflow-y-auto pr-1">
              {/* 🤝 Staff & Hospitality Profile */}
              {inspectingHotel.staff_nature_rating && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block">
                    🤝 Staff & Hospitality Profile
                  </span>
                  <p className="text-[11px] text-slate-700 font-medium">
                    {inspectingHotel.staff_nature_rating}
                  </p>
                </div>
              )}

              {/* ⏰ Check-In / Check-Out Timings */}
              {(inspectingHotel.check_in || inspectingHotel.check_out) && (
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500 block font-bold">⏰ Check-In:</span>
                    <span className="font-bold text-slate-900">{inspectingHotel.check_in || "12:00 PM"}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500 block font-bold">⏰ Check-Out:</span>
                    <span className="font-bold text-slate-900">{inspectingHotel.check_out || "11:00 AM"}</span>
                  </div>
                </div>
              )}

              {/* 🍳 Food & Dining Inclusions */}
              {inspectingHotel.food_plan && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">
                    🍳 Food & Dining Inclusions
                  </span>
                  <p className="text-[11px] text-slate-700 font-medium">
                    {inspectingHotel.food_plan}
                  </p>
                </div>
              )}

              {/* 📍 Proximity Details */}
              {inspectingHotel.proximity_tag && (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] flex items-center justify-between">
                  <span className="font-bold text-slate-500">📍 Proximity:</span>
                  <span className="font-bold text-emerald-700">{inspectingHotel.proximity_tag}</span>
                </div>
              )}

              {/* 🛏️ Interactive Room Tier Selector inside Modal */}
              {inspectingHotel.room_options && inspectingHotel.room_options.length > 0 && (
                <div className="border-t border-slate-100 pt-2 space-y-1.5">
                  <span className="text-[10px] text-slate-500 font-extrabold block uppercase tracking-wider">Choose Room Category & Meal Plan:</span>
                  <div className="space-y-1.5">
                    {(inspectingHotel.room_options || []).map((ro: any, roIdx: number) => {
                      const isSelected = (inspectingHotel.selected_room || inspectingHotel.room_options?.[0]?.room_name) === ro.room_name;
                      return (
                        <button
                          key={roIdx}
                          type="button"
                          onClick={() => {
                            handleSelectStayRoom(inspectingHotel.id, ro);
                            setInspectingHotel({
                              ...inspectingHotel,
                              selected_room: ro.room_name,
                              cost_inr: ro.cost_per_night,
                              total_stay_cost_inr: ro.total_stay_cost_inr,
                              meals_included: ro.meals_included
                            });
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left transition-all flex justify-between items-center text-[10px] cursor-pointer ${
                            isSelected
                              ? "bg-amber-50/80 text-slate-900 border-amber-500 font-bold shadow-sm ring-1 ring-amber-400"
                              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                          }`}
                        >
                          <div>
                            <span className="font-bold text-xs block text-slate-900">{ro.room_name}</span>
                            <span className={`text-[9px] ${isSelected ? "text-amber-800 font-semibold" : "text-emerald-700 font-medium"}`}>
                              {ro.meals_included}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className={`font-black text-xs block ${isSelected ? "text-amber-800" : "text-slate-900"}`}>
                              ₹{ro.cost_per_night}/night
                            </span>
                            <span className={`text-[8px] ${isSelected ? "text-amber-700" : "text-slate-500"}`}>
                              (Total: ₹{ro.total_stay_cost_inr})
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="border-t border-slate-100 pt-2">
                <span className="text-[10px] text-slate-500 font-extrabold block uppercase tracking-wider mb-1.5">Amenities Included</span>
                <div className="flex flex-wrap gap-1.5">
                  {inspectingHotel.amenities?.map((am: string, amIdx: number) => (
                    <span key={amIdx} className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md text-[9px] uppercase font-semibold">
                      {am}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t border-slate-100 pt-2 space-y-1">
                <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Guest Reviews</span>
                {inspectingHotel.reviews?.map((r: string, rIdx: number) => (
                  <p key={rIdx} className="text-[10px] text-slate-700 bg-slate-50 border border-slate-200 p-2 rounded-xl">
                    "{r}"
                  </p>
                ))}
              </div>
            </div>
            <button
              onClick={() => { setSelectedHotel(inspectingHotel); setInspectingHotel(null); }}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-98 cursor-pointer"
            >
              Select This Hotel
            </button>
          </div>
        </div>
      )}

      {/* 🚨 Active Guardian Audio & Countdown Check-in Alert Modal */}
      {guardianAlert && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 relative space-y-4 shadow-2xl border-2 border-rose-500 text-center text-slate-900">
            {/* Warning Pulsing Icon */}
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center text-3xl mx-auto animate-bounce shadow-md">
              {guardianAlert.stage === "STAGE_3_AUTO_ESCALATION" ? "📡" : "⚠️"}
            </div>

            <div>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1 border ${
                guardianAlert.stage === "STAGE_3_AUTO_ESCALATION" ? "bg-rose-600 text-white border-rose-500 animate-pulse" : "bg-rose-100 text-rose-800 border-rose-200"
              }`}>
                {(guardianAlert.stage || "STAGE").replace(/_/g, " ")}
              </span>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {guardianAlert.headline}
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                {guardianAlert.subtext}
              </p>
            </div>

            {/* Countdown Ring if in Stage 1 or 2 */}
            {guardianAlert.stage !== "STAGE_3_AUTO_ESCALATION" && (
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 space-y-1">
                <div className="text-2xl font-black text-rose-600">
                  ⏱️ {guardianCountdown}s
                </div>
                <span className="text-[10px] font-bold text-rose-800 block">
                  Confirm safety before automated escalation to emergency contacts
                </span>
              </div>
            )}

            {/* Stage 3 Escalation Dispatched View */}
            {guardianAlert.stage === "STAGE_3_AUTO_ESCALATION" && guardianAlert.dispatched_beacon && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 text-left text-xs">
                <span className="text-[10px] font-black text-rose-900 uppercase tracking-wider block">
                  🚨 Transmitted SOS Beacon to Loved Ones:
                </span>
                <p className="text-[10px] text-slate-800 bg-white p-2.5 rounded-xl border border-rose-200 font-mono leading-relaxed">
                  {guardianAlert.dispatched_beacon.message}
                </p>
                <div className="flex gap-2 pt-1">
                  <a
                    href={guardianAlert.dispatched_beacon.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black text-center shadow-md shadow-emerald-600/20"
                  >
                    Open WhatsApp Broadcast
                  </a>
                  <a
                    href="tel:112"
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black text-center shadow-md shadow-rose-600/20"
                  >
                    Call 112 Police
                  </a>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setGuardianAlert(null);
                  setGuardianCountdown(60);
                  setTelemetry(prev => ({ ...prev, speed: 65, stationaryMins: 0, aiStatus: "Cruising safely at 65 km/h • User confirmed safe. RoadGuard AI resumed silent background monitoring." }));
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-2xl text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-98 cursor-pointer"
              >
                🟢 I Am OK (False Alarm / Disarm Alert)
              </button>

              {guardianAlert.stage !== "STAGE_3_AUTO_ESCALATION" && (
                <button
                  type="button"
                  onClick={() => {
                    setGuardianAlert({
                      ...guardianAlert,
                      stage: "STAGE_3_AUTO_ESCALATION",
                      severity: "CRITICAL",
                      headline: "SOS ESCALATED: Emergency Beacon Dispatched!",
                      subtext: "User triggered immediate SOS. Beacon dispatched to loved ones and authorities."
                    });
                    playGuardianSound("siren");
                  }}
                  className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold rounded-2xl text-xs transition-all cursor-pointer"
                >
                  🔴 I Need Immediate Help (Escalate Now)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🚨 Dynamic Live Location & Moving Route Emergency SOS Hub */}
      {/* 🚨 Dynamic Live Location & Moving Route Emergency SOS Hub */}
      {showSOS && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 relative space-y-4 shadow-2xl border border-rose-200 text-slate-900">
            <button
              onClick={() => {
                setShowSOS(false);
                setIsSimulatingHighwayMotion(false);
              }}
              className="absolute right-4 top-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-900 transition-all z-10 border border-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Emergency Header */}
            <div className="border-b border-slate-100 pb-3 pr-8 relative">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center text-xl shadow-xs flex-shrink-0 animate-beacon-radar">
                  🚨
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight flex items-center gap-2">
                    <span>Emergency Lifeline SOS Hub</span>
                    <span className="text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      Dynamic GPS Active
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Real-time location-aware emergency response • Pan-India coverage
                  </p>
                </div>
              </div>
            </div>

            {/* 🚨 Quick 1-Tap Emergency Calling Strip - Kinetic & Tactical */}
            <div className="grid grid-cols-3 gap-2.5">
              <a
                href="tel:112"
                className="group py-3 px-2.5 bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-2xl flex items-center justify-center gap-2 font-black text-xs shadow-md shadow-rose-600/25 hover:shadow-rose-600/40 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 animate-beacon-radar border border-rose-400/50"
              >
                <span className="text-base group-hover:scale-110 transition-transform">🚨</span>
                <span>Call 112</span>
              </a>
              <a
                href="tel:108"
                className="group py-3 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs shadow-2xs hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
              >
                <span className="text-base group-hover:scale-110 transition-transform">🚑</span>
                <span>Call 108</span>
              </a>
              <a
                href="tel:1363"
                className="group py-3 px-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs shadow-2xs hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
              >
                <span className="text-base group-hover:scale-110 transition-transform">🛡️</span>
                <span>Help 1363</span>
              </a>
            </div>

            {/* 📍 Clean Active GPS Location Card with Telemetry Pulse */}
            <div className="p-3.5 bg-slate-50 border border-emerald-300 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <strong className="text-xs font-bold text-slate-900 tracking-wide">{userLiveCoords.name}</strong>
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    GPS Locked
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[9px] bg-slate-200/80 p-1 rounded-xl border border-slate-300">
                  <button
                    type="button"
                    onClick={() => setSosLocationMode("route")}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${sosLocationMode === "route" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    En-Route
                  </button>
                  <button
                    type="button"
                    onClick={detectLiveDeviceGPS}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${sosLocationMode === "gps" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Device GPS
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 font-mono pt-1 border-t border-slate-200">
                <span>Coords: {userLiveCoords.lat.toFixed(4)}° N, {userLiveCoords.lng.toFixed(4)}° E</span>
                <a
                  href={`https://maps.google.com/?q=${userLiveCoords.lat},${userLiveCoords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 hover:text-sky-700 hover:underline font-bold flex items-center gap-1 group"
                >
                  <span>Google Maps Pin</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">➔</span>
                </a>
              </div>
            </div>

            {/* 🏥 Unified Nearest Emergency Services */}
            {sosData && (
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Nearest Verified Emergency Facilities:
                </span>

                <div className="divide-y divide-slate-200">
                  {/* Hospital */}
                  {sosData.nearest_hospital && (
                    <div className="py-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-sm flex-shrink-0 border border-rose-200 shadow-xs">
                          🏥
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {sosData.nearest_hospital.name}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            Hospital • 🚗 {sosData.nearest_hospital.distance_km} km away
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <a
                          href={`tel:${sosData.nearest_hospital.phone}`}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold shadow-md shadow-rose-600/25 transition-all hover:scale-105 active:scale-95"
                        >
                          Call
                        </a>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(sosData.nearest_hospital.name + " " + (destination || ""))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold transition-all hover:scale-105 active:scale-95"
                        >
                          Navigate
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Police */}
                  {sosData.nearest_police && (
                    <div className="py-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center text-sm flex-shrink-0 border border-sky-200 shadow-xs">
                          👮
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {sosData.nearest_police.station}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            Highway Patrol • 🚗 {sosData.nearest_police.distance_km || "0.8"} km
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <a
                          href={`tel:${sosData.nearest_police.phone || "112"}`}
                          className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[10px] font-bold shadow-md shadow-sky-600/25 transition-all hover:scale-105 active:scale-95"
                        >
                          Call 112
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Pharmacy */}
                  {sosData.nearest_pharmacy && (
                    <div className="py-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm flex-shrink-0 border border-emerald-200 shadow-xs">
                          💊
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {sosData.nearest_pharmacy.name}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            24x7 Medicine • 📍 {sosData.nearest_pharmacy.distance_km || "0.4"} km
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <a
                          href={`tel:${sosData.nearest_pharmacy.phone || "112"}`}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold shadow-md shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95"
                        >
                          Call
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 📡 1-Click Family WhatsApp & SMS Beacon */}
            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="animate-satellite">📡</span> Dispatch Live GPS Distress Beacon to Family
                </span>
                <span className="text-[8.5px] text-emerald-800 font-mono bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">1-Tap Pinpoint</span>
              </div>
              <div className="flex gap-2">
                <a
                  href={sosData?.gps_beacon?.whatsapp_link || `https://api.whatsapp.com/send?text=${encodeURIComponent(`🚨 EMERGENCY SOS! Need immediate assistance at ${userLiveCoords.name}. Live GPS: https://maps.google.com/?q=${userLiveCoords.lat},${userLiveCoords.lng}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold text-center shadow-md shadow-emerald-600/25 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <span>💬</span> WhatsApp Family
                </a>
                <a
                  href={sosData?.gps_beacon?.sms_link || `sms:112?body=${encodeURIComponent(`🚨 EMERGENCY SOS! Need immediate help at ${userLiveCoords.name}.`)}`}
                  className="flex-1 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold text-center shadow-2xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <span>📱</span> SMS 112 Beacon
                </a>
              </div>
            </div>

            {/* ⚙️ Minimalist Collapsible Pan-India City Search & Simulator */}
            <details className="group bg-slate-50 border border-slate-200/90 rounded-2xl p-2.5 text-xs text-slate-700 shadow-2xs">
              <summary className="cursor-pointer font-bold text-slate-700 hover:text-slate-900 flex items-center justify-between select-none">
                <span className="flex items-center gap-1.5">
                  <span>🔍</span> Search Other Indian City / Corridor Simulator
                </span>
                <span className="text-[10px] text-slate-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>

              <div className="pt-2.5 space-y-2 border-t border-slate-200 mt-2">
                <div className="relative">
                  <input
                    type="text"
                    value={sosCitySearchQuery}
                    onChange={(e) => handleSosCitySearch(e.target.value)}
                    placeholder="Search city, highway or pass (Varanasi, Jaipur, Leh, Manali...)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 font-medium shadow-2xs"
                  />
                  {sosCitySuggestions.length > 0 && (
                    <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-44 overflow-y-auto p-1 divide-y divide-slate-100">
                      {sosCitySuggestions.map((sug: any, sIdx: number) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => selectPanIndiaCity(sug)}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg text-xs text-slate-800 flex items-center justify-between cursor-pointer"
                        >
                          <span className="font-bold">📍 {sug.name}</span>
                          <span className="text-[9px] text-slate-500">{sug.state || "India"}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
                  {POPULAR_PAN_INDIA_CITIES.map((c, cIdx) => (
                    <button
                      key={cIdx}
                      type="button"
                      onClick={() => selectPanIndiaCity(c)}
                      className="flex-shrink-0 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-[9px] font-semibold border border-slate-200 transition-all cursor-pointer shadow-2xs"
                    >
                      📍 {c.name}
                    </button>
                  ))}
                </div>

                {corridorWaypoints.length > 0 && (
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] text-slate-600 font-medium">Highway Corridor Sim:</span>
                    <button
                      type="button"
                      onClick={() => setIsSimulatingHighwayMotion(!isSimulatingHighwayMotion)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[9px] border transition-all cursor-pointer ${
                        isSimulatingHighwayMotion
                          ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 shadow-2xs"
                      }`}
                    >
                      {isSimulatingHighwayMotion ? "⏸️ Pause Motion" : "▶️ Auto-Simulate Highway"}
                    </button>
                  </div>
                )}
              </div>
            </details>

            {/* Category Filter Selector - Clean segmented chips */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Specific Emergency / Medical Need:
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                <button
                  type="button"
                  onClick={() => { handleSOS("medical"); setMedicalViewTab("hospitals"); }}
                  className={`p-2 border rounded-2xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all hover:-translate-y-0.5 cursor-pointer ${
                    sosType === "medical" && medicalViewTab !== "pharmacies" ? "bg-rose-50 border-rose-500 text-rose-900 shadow-xs ring-1 ring-rose-400" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Activity className="w-4 h-4 text-rose-600" /> 🏥 Hospital
                </button>
                <button
                  type="button"
                  onClick={() => { handleSOS("pharmacy"); setMedicalViewTab("pharmacies"); }}
                  className={`p-2 border rounded-2xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all hover:-translate-y-0.5 cursor-pointer ${
                    sosType === "pharmacy" || (sosType === "medical" && medicalViewTab === "pharmacies") ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs ring-1 ring-emerald-400" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-sm">💊</span> 24x7 Dawa
                </button>
                <button
                  type="button"
                  onClick={() => handleSOS("police")}
                  className={`p-2 border rounded-2xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all hover:-translate-y-0.5 cursor-pointer ${
                    sosType === "police" ? "bg-sky-50 border-sky-500 text-sky-900 shadow-xs ring-1 ring-sky-400" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <AlertCircle className="w-4 h-4 text-sky-600" /> 👮 Police 112
                </button>
                <button
                  type="button"
                  onClick={() => handleSOS("breakdown")}
                  className={`p-2 border rounded-2xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all hover:-translate-y-0.5 cursor-pointer ${
                    sosType === "breakdown" ? "bg-amber-50 border-amber-500 text-amber-900 shadow-xs ring-1 ring-amber-400" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Wrench className="w-4 h-4 text-amber-600" /> 🔧 Breakdown
                </button>
                <button
                  type="button"
                  onClick={() => setSosType("roadguard")}
                  className={`p-2 border rounded-2xl flex flex-col items-center gap-1 text-[10px] font-bold transition-all hover:-translate-y-0.5 cursor-pointer ${
                    sosType === "roadguard" ? "bg-purple-50 border-purple-500 text-purple-900 shadow-xs ring-1 ring-purple-400" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-purple-600" /> 🛡️ RoadGuard
                </button>
              </div>
            </div>

            {sosLoading && (
              <div className="py-6 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                <span className="text-[10px] font-bold text-slate-500">Contacting Dynamic Emergency Response Dispatch...</span>
              </div>
            )}

            {/* Verified Trauma Centers & SDRF Section */}
            {!sosLoading && sosData && (
              <div className="space-y-3 pt-1 text-xs">
                {/* 🏔️ SDRF Mountain & Disaster Response */}
                {sosData.sdrf_mountain_rescue && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 text-[11px] flex items-center gap-1">
                        🏔️ {sosData.sdrf_mountain_rescue.agency}
                      </span>
                      <a
                        href={`tel:${sosData.sdrf_mountain_rescue.control_room}`}
                        className="text-[9px] font-black bg-amber-600 hover:bg-amber-500 text-white px-2.5 py-0.5 rounded-full transition-all"
                      >
                        📞 Call SDRF
                      </a>
                    </div>
                    <p className="text-[9.5px] text-slate-700 font-medium">
                      <strong className="text-amber-900">Specialty:</strong> {sosData.sdrf_mountain_rescue.specialty}
                    </p>
                    <div className="flex justify-between text-[9px] text-slate-600 font-bold border-t border-amber-200 pt-1">
                      <span>Control Room: {sosData.sdrf_mountain_rescue.control_room}</span>
                      <span>State Toll-Free: {sosData.sdrf_mountain_rescue.state_toll_free}</span>
                    </div>
                  </div>
                )}

                {/* 🏥 & 💊 Dynamic Medical Sub-Filter Tabs */}
                {(sosType === "medical" || sosType === "pharmacy") && (
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setMedicalViewTab("all")}
                      className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        medicalViewTab === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      🌟 All Medical & Health
                    </button>
                    <button
                      type="button"
                      onClick={() => setMedicalViewTab("hospitals")}
                      className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        medicalViewTab === "hospitals" ? "bg-rose-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      🏥 Hospitals ({sosData?.hospitals?.length || 0})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMedicalViewTab("pharmacies")}
                      className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        medicalViewTab === "pharmacies" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      💊 24x7 Stores ({sosData?.medicine_stores?.length || 0})
                    </button>
                  </div>
                )}

                {/* 🏥 SECTION 1: NEARBY HOSPITALS & 24x7 EMERGENCY CLINICS */}
                {(medicalViewTab === "all" || medicalViewTab === "hospitals") && (sosType === "medical" || sosType === "pharmacy") && sosData.hospitals && sosData.hospitals.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                        🏥 Nearby Hospitals & 24x7 Emergency Clinics (अस्पताल / क्लिनिक):
                      </span>
                      <span className="text-[8.5px] font-bold text-rose-800 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full">
                        Doctor & Casualty Available
                      </span>
                    </div>
                    <div className="space-y-2">
                      {sosData.hospitals.map((h: any, hIdx: number) => (
                        <div key={hIdx} className="p-3 bg-white border border-slate-200/90 rounded-2xl space-y-1.5 shadow-2xs hover:border-slate-300 transition-all">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                {h.name}
                                {h.type && (
                                  <span className="text-[8px] font-bold bg-rose-100 text-rose-800 border border-rose-200 px-1.5 py-0.2 rounded">
                                    {h.type}
                                  </span>
                                )}
                              </span>
                              <span className="text-[9.5px] text-slate-500 font-semibold block mt-0.5">
                                📍 {h.address} • 🚗 {h.distance}
                              </span>
                            </div>
                            <div className="flex gap-1.5 flex-shrink-0">
                              <a
                                href={`tel:${h.phone}`}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-bold shadow-xs flex items-center gap-1 transition-all"
                              >
                                📞 Call
                              </a>
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(h.name + " " + (destination || ""))}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-bold transition-all shadow-2xs"
                              >
                                🗺️ Map
                              </a>
                            </div>
                          </div>
                          <p className="text-[8.5px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200 font-medium">
                            <strong className="text-slate-900">Emergency Services:</strong> {h.services || h.facilities || "24x7 Emergency Casualty, Doctor on duty, OPD, Stitches, IV Drips"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 💊 SECTION 2: 24x7 MEDICINE STORES & PHARMACIES */}
                {(medicalViewTab === "all" || medicalViewTab === "pharmacies") && (sosType === "medical" || sosType === "pharmacy") && sosData.medicine_stores && sosData.medicine_stores.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        💊 24x7 Medicine Stores & Pharmacies (दवा की दुकान / मेडिकल स्टोर):
                      </span>
                      <span className="text-[8.5px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                        🟢 Open 24/7 / Night Counter
                      </span>
                    </div>
                    <div className="space-y-2">
                      {sosData.medicine_stores.map((m: any, mIdx: number) => (
                        <div key={mIdx} className="p-3 bg-white border border-slate-200/90 rounded-2xl space-y-1.5 shadow-2xs hover:border-slate-300 transition-all">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                                {m.name}
                                <span className="text-[8px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded">
                                  {m.type || "24x7 Chemist"}
                                </span>
                              </span>
                              <span className="text-[9.5px] text-slate-500 font-semibold block mt-0.5">
                                📍 {m.address} • 🏃 {m.distance} • ⏰ {m.timings}
                              </span>
                            </div>
                            <div className="flex gap-1.5 flex-shrink-0">
                              <a
                                href={`tel:${m.phone}`}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-bold shadow-xs flex items-center gap-1 transition-all"
                              >
                                📞 Call Chemist
                              </a>
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(m.name + " " + (destination || ""))}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-bold transition-all shadow-2xs"
                              >
                                🗺️ Map
                              </a>
                            </div>
                          </div>
                          <p className="text-[8.5px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-200 font-medium">
                            <strong className="text-slate-900">Stocked Medicines:</strong> {m.available_medicines || "Prescription Drugs, Painkillers, Antibiotics, Fever (Paracetamol), ORS, Inhalers, First Aid Supplies"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 🛡️ ROADGUARD AI AUTONOMOUS SENTINEL & TRAINED SCENARIOS HUB */}
                {sosType === "roadguard" && (
                  <div className="space-y-3 pt-1 text-xs">
                    {/* Model Status Banner */}
                    <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-900 text-[11px] flex items-center gap-1.5">
                          <span>🛡️</span> RoadGuard AI 3.0 Extreme Sentinel (Trained Brain)
                        </span>
                        <span className="text-[9px] font-bold bg-purple-600 text-white px-2 py-0.5 rounded-full border border-purple-400">
                          Accuracy: 100% (16 Scenarios)
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                        Trained on <strong className="text-slate-900">16 extreme Indian frontier scenarios</strong> (Himalayan Blizzards, Thar Desert, Bastar Red Corridor, Western Ghats Landslides) and multi-sensor failures (dropped phone disarm, Atal tunnel GPS blackout).
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center text-[9px]">
                        <div className="p-2 bg-white rounded-xl border border-purple-200/70 shadow-2xs">
                          <span className="text-slate-500 block font-bold text-[8px]">FALSE ALARMS</span>
                          <span className="text-emerald-600 font-black">0.0% (Suppressed)</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-purple-200/70 shadow-2xs">
                          <span className="text-slate-500 block font-bold text-[8px]">SENSOR DISARM</span>
                          <span className="text-sky-600 font-black">Dropped Phone Safe</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-purple-200/70 shadow-2xs">
                          <span className="text-slate-500 block font-bold text-[8px]">CRASH SIREN</span>
                          <span className="text-rose-600 font-black">Stage-2 (20s)</span>
                        </div>
                        <div className="p-2 bg-white rounded-xl border border-purple-200/70 shadow-2xs">
                          <span className="text-slate-500 block font-bold text-[8px]">AUTO-SOS BEACON</span>
                          <span className="text-purple-700 font-black">Stage-3 (Family + 112)</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Trained Scenarios Simulator */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                          🧪 Worst-Case & Extreme Conditions Testing Lab:
                        </span>
                        <span className="text-[8.5px] font-semibold text-slate-500">
                          Click to test AI reaction live
                        </span>
                      </div>

                      {/* Group 1: Sensor Faults & Disarms */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-sky-700 uppercase tracking-wider block">
                          ⚡ 1. Sensor Multi-Failures & Disarms:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => triggerAutonomousAnomalyDetection("dropped_phone")}
                            className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-[9.5px] transition-all shadow-2xs cursor-pointer"
                          >
                            <strong className="text-slate-900 block">📱 Dropped Phone</strong>
                            <span className="text-slate-500 text-[8.5px] block">Impact + 82 km/h cruise</span>
                            <span className="text-[8px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded-full mt-1.5 inline-block">
                              ✓ 100% Disarmed
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => triggerAutonomousAnomalyDetection("atal_tunnel")}
                            className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-[9.5px] transition-all shadow-2xs cursor-pointer"
                          >
                            <strong className="text-slate-900 block">🚇 Atal Tunnel Blackout</strong>
                            <span className="text-slate-500 text-[8.5px] block">GPS lost in 9km tunnel</span>
                            <span className="text-[8px] font-bold text-sky-800 bg-sky-100 border border-sky-200 px-1.5 py-0.5 rounded-full mt-1.5 inline-block">
                              ✓ 15m Safe Window
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => triggerAutonomousAnomalyDetection("battery_last_gasp")}
                            className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-[9.5px] transition-all shadow-2xs cursor-pointer"
                          >
                            <strong className="text-slate-900 block">🔋 Battery 7% Last-Gasp</strong>
                            <span className="text-slate-500 text-[8.5px] block">Pre-shutdown coordinates</span>
                            <span className="text-[8px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full mt-1.5 inline-block">
                              Safe Breadcrumb
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Group 2: Extreme Indian Frontier Terrains */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[9px] font-bold text-rose-700 uppercase tracking-wider block">
                          🏔️ 2. Extreme Indian Frontiers & Disasters:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => triggerAutonomousAnomalyDetection("khardung_la")}
                            className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-[9.5px] transition-all shadow-2xs cursor-pointer"
                          >
                            <strong className="text-slate-900 block">❄️ Khardung La Blizzard</strong>
                            <span className="text-slate-500 text-[8.5px] block">-14°C, 4650m altitude • ITBP Rescue</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => triggerAutonomousAnomalyDetection("thar_desert")}
                            className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-[9.5px] transition-all shadow-2xs cursor-pointer"
                          >
                            <strong className="text-slate-900 block">🏜️ Thar Desert Overheat</strong>
                            <span className="text-slate-500 text-[8.5px] block">47°C, Radiator Burst • BSF Longewala</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => triggerAutonomousAnomalyDetection("bastar_jungle")}
                            className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-[9.5px] transition-all shadow-2xs cursor-pointer"
                          >
                            <strong className="text-slate-900 block">🌲 Bastar Forest Reserve</strong>
                            <span className="text-slate-500 text-[8.5px] block">22:00 Dusk Curfew • CRPF Safe Corridor</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => triggerAutonomousAnomalyDetection("tamhini_landslide")}
                            className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-[9.5px] transition-all shadow-2xs cursor-pointer"
                          >
                            <strong className="text-slate-900 block">🌧️ Tamhini Ghat Landslide</strong>
                            <span className="text-slate-500 text-[8.5px] block">Monsoon Rockfall Roadblock • NDRF</span>
                          </button>
                        </div>
                      </div>

                      {/* Group 3: Highway Transit & Escalation */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">
                          🚗 3. Standard Transit, Jams & Escalations:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <button
                            type="button"
                            onClick={() => triggerAutonomousAnomalyDetection("traffic_jam")}
                            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-[9px] transition-all shadow-2xs cursor-pointer"
                          >
                            <strong className="text-slate-900 block">🚗 Toll Plaza Jam</strong>
                            <span className="text-emerald-700 text-[8px] font-semibold">85% congestion (Suppressed)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => triggerAutonomousAnomalyDetection("isolated_stop")}
                            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-[9px] transition-all shadow-2xs cursor-pointer"
                          >
                            <strong className="text-slate-900 block">⚠️ Open Road Stop</strong>
                            <span className="text-amber-700 text-[8px] font-semibold">Stage-1 Chime (60s)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => triggerAutonomousAnomalyDetection("sudden_impact")}
                            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-[9px] transition-all shadow-2xs cursor-pointer"
                          >
                            <strong className="text-slate-900 block">💥 Sudden Crash</strong>
                            <span className="text-rose-700 text-[8px] font-semibold">Stage-2 Siren (20s)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => triggerAutonomousAnomalyDetection("stage3_escalation")}
                            className="p-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-left text-[9px] transition-all shadow-2xs cursor-pointer"
                          >
                            <strong className="text-rose-700 block font-bold">📡 Auto-SOS 112</strong>
                            <span className="text-slate-600 text-[8px]">Unresponsive Traveler</span>
                          </button>
                        </div>
                      </div>

                      {/* Group 4: Extreme Critical Survival & Life-and-Death Hazards */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[9px] font-bold text-rose-700 uppercase tracking-wider block">
                          ⚡ 4. Life-and-Death Critical Hazards (Autonomous Response):
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => triggerAutonomousAnomalyDetection("hypoxia_ams")}
                            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-[9px] transition-all shadow-2xs cursor-pointer"
                          >
                            <strong className="text-slate-900 block">🏔️ 4,850m Hypoxia (AMS)</strong>
                            <span className="text-sky-700 text-[8px]">Oxygen Depletion • Military</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => triggerAutonomousAnomalyDetection("flash_flood")}
                            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-[9px] transition-all shadow-2xs cursor-pointer"
                          >
                            <strong className="text-slate-900 block">🌊 Flash Flood (3.5ft)</strong>
                            <span className="text-sky-700 text-[8px]">Unlock Doors • SDRF Boat</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => triggerAutonomousAnomalyDetection("cab_deviation")}
                            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-[9px] transition-all shadow-2xs cursor-pointer"
                          >
                            <strong className="text-slate-900 block">⚠️ 2:30 AM Cab Deviation</strong>
                            <span className="text-purple-700 text-[8px]">&gt;5km Off Corridor • PCR Van 112</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => triggerAutonomousAnomalyDetection("engine_fire")}
                            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-[9px] transition-all shadow-2xs cursor-pointer"
                          >
                            <strong className="text-slate-900 block">🔥 Engine/EV Fire (68°C)</strong>
                            <span className="text-amber-700 text-[8px]">50m Upwind Evac • Fire 101</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => triggerAutonomousAnomalyDetection("vehicle_rollover")}
                            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-[9px] transition-all shadow-2xs cursor-pointer"
                          >
                            <strong className="text-slate-900 block">🚨 Overturned in Ravine</strong>
                            <span className="text-rose-700 text-[8px]">Tilt &gt;60° • Winch Rescue 112</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => triggerAutonomousAnomalyDetection("phone_shutdown")}
                            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-[9px] transition-all shadow-2xs cursor-pointer"
                          >
                            <strong className="text-slate-900 block">📱 Phone Dead / Shutoff</strong>
                            <span className="text-sky-700 text-[8px]">Zero-Panic • Family Notice</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Auto-Escalation Target Emergency Contacts */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                        👨‍👩‍👧 Family Auto-Escalation Targets (Automated WhatsApp & SMS):
                      </span>
                      <div className="space-y-1.5">
                        {guardianContacts.map((c: any, cIdx: number) => (
                          <div key={cIdx} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-[10px] shadow-2xs">
                            <div>
                              <strong className="text-slate-900">{c.name}</strong> <span className="text-slate-500">({c.relationship})</span>
                              <span className="text-slate-500 block text-[9px] font-mono">{c.phone}</span>
                            </div>
                            <span className="text-[8.5px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                              ✓ Auto-SOS Ready
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 🩹 First Aid Life-Saving Protocols */}
                {sosData.first_aid_protocols && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                      🩹 Immediate First-Aid Life Protocols:
                    </span>
                    <div className="space-y-1.5">
                      {sosData.first_aid_protocols.map((fa: any, fIdx: number) => (
                        <div key={fIdx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[9px] text-slate-700 shadow-2xs">
                          <strong className="text-slate-900 block mb-0.5 font-bold">⚠️ {fa.condition}</strong>
                          <p className="text-slate-600 leading-relaxed font-medium">{fa.action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📡 SAFAR GUARDIAN (सफ़र गार्जियन) — LIVE TRIP SHARING & MILESTONES MODAL */}
      {showSafarGuardian && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
          <div className="bg-white border border-indigo-200 text-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 relative space-y-4 shadow-2xl">
            <button
              onClick={() => setShowSafarGuardian(false)}
              className="absolute right-4 top-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 transition-all z-10 border border-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="border-b border-slate-100 pb-3 pr-8 relative">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center text-xl shadow-xs flex-shrink-0">
                  <span className="animate-satellite">📡</span>
                </span>
                <div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <span>Family Live Share & GPS Guardian</span>
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-extrabold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        {authorizedContacts.length} Connected
                      </span>
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-indigo-700 font-extrabold bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                        📍 {safarSession?.origin || origin || "Mumbai"} ➔ {safarSession?.destination || destination || "Goa"}
                      </span>
                      <button
                        type="button"
                        onClick={() => openSafarGuardian(true)}
                        className="text-[10.5px] font-extrabold text-slate-600 hover:text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
                        title="Re-sync route with current search destination"
                      >
                        🔄 Re-Sync
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Segmented Navigation Tabs */}
              <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTabSafar("map")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTabSafar === "map"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  <span>🗺️</span> Live Route & Map
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabSafar("who_has_access")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTabSafar === "who_has_access"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  <span>👥</span> Who Has Access ({authorizedContacts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabSafar("send_location")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTabSafar === "send_location"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  <span>📡</span> Send Location
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTabSafar("simulator")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTabSafar === "simulator"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  <span>🧪</span> Offline Lab
                </button>
              </div>
            </div>

            {safarLoading && (
              <div className="py-8 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                <span className="text-xs font-bold text-slate-600">Generating Live Trip Tracking Link & Milestones...</span>
              </div>
            )}

            {safarToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl animate-fade-in flex items-center gap-2 shadow-xs">
                <span className="text-base">🔔</span>
                <span className="flex-1">{safarToast}</span>
              </div>
            )}

            {!safarLoading && safarSession && (
              <div className="space-y-4 text-xs">
                {/* TAB 1: LIVE MAP & ROUTE */}
                {activeTabSafar === "map" && (
                  <div className="space-y-3">
                    {/* Share Bar & Live Ping Action */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-xs font-extrabold text-indigo-950 flex items-center gap-1 flex-shrink-0">
                          <span>🔗</span> Tracking ID:
                        </span>
                        <span className="font-mono text-xs font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-lg border border-indigo-200">
                          {safarSession.track_id}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium truncate hidden md:inline">
                          • {safarSession.origin} ➔ {safarSession.destination}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleSendLivePing()}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                            pingSuccess
                              ? "bg-emerald-600 text-white"
                              : "bg-indigo-600 hover:bg-indigo-500 text-white"
                          }`}
                        >
                          <span className={pingSuccess ? "animate-spin" : "animate-ping text-[10px]"}>📍</span>
                          <span>{pingSuccess ? "Broadcast Sent!" : "Broadcast Live Ping"}</span>
                        </button>
                        <a
                          href={`/track/${safarSession.track_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-white hover:bg-slate-50 text-indigo-700 font-bold border border-indigo-200 rounded-xl text-xs flex items-center gap-1 transition-all"
                        >
                          <span>🌐 Open Portal</span>
                          <span>➔</span>
                        </a>
                      </div>
                    </div>

                    {/* High-Craft Interactive Map Component */}
                    <div className="h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
                      <TrackingMap
                        milestones={safarSession.milestones || []}
                        currentMilestone={safarSession.current_milestone}
                        origin={safarSession.origin || origin || "Mumbai"}
                        destination={safarSession.destination || destination || "Goa"}
                        travelerName={safarSession.traveler_name || currentUser?.name || "Rahul Sharma"}
                      />
                    </div>

                    {/* Milestones Progression */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <span>📍</span> Scheduled Journey Milestones
                        </span>
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-lg flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          GPS Geofenced
                        </span>
                      </div>

                      <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
                        {safarSession.milestones?.map((m: any) => {
                          const isCompleted = m.status === "COMPLETED";
                          const isCurrent = m.status === "CURRENT";
                          return (
                            <div
                              key={m.id}
                              className={`p-3 rounded-2xl border transition-all ${
                                isCurrent
                                  ? "bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-400/40 shadow-sm"
                                  : isCompleted
                                  ? "bg-emerald-50/40 border-emerald-200 text-slate-900"
                                  : "bg-white border-slate-200 text-slate-900"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2.5">
                                  <span className="text-2xl flex-shrink-0 mt-0.5">{m.icon}</span>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <h4 className="font-bold text-slate-900 text-xs">{m.title}</h4>
                                      <span
                                        className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                          isCurrent
                                            ? "bg-indigo-600 text-white animate-pulse"
                                            : isCompleted
                                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                            : "bg-slate-100 text-slate-600 border border-slate-200"
                                        }`}
                                      >
                                        {isCurrent ? "🟢 Current Leg" : isCompleted ? "✓ Completed" : "Upcoming"}
                                      </span>
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium block mt-0.5">
                                      🕒 {m.relative_time} • 📍 {m.location_name}
                                    </span>
                                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                                      {m.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-1 items-end flex-shrink-0">
                                  {isCurrent && (
                                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                      📢 Live Pushed
                                    </span>
                                  )}
                                  <a
                                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(m.notification_template)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5 hover:underline"
                                  >
                                    <span>💬 WhatsApp</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Live Telemetry Bar */}
                    <div className="p-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-900 font-bold">🔋 88% Battery</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-emerald-700 font-bold">🛡️ RoadGuard AI Active</span>
                      </div>
                      <span className="text-slate-600 font-medium truncate max-w-[240px]">
                        {safarSession.live_telemetry?.transit_status || "Cruising smoothly on highway corridor"}
                      </span>
                    </div>
                  </div>
                )}

                {/* TAB 2: WHO HAS ACCESS (KIS KE PAS LOCATION HAI) */}
                {activeTabSafar === "who_has_access" && (
                  <div className="space-y-3">
                    {/* Privacy Header */}
                    <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                          <span>🛡️</span> Who Has Live Location Access
                        </span>
                        <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                          🔒 256-Bit E2E Encrypted
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        Sirf in logon ke pas aapki real-time GPS location dekhne ki permission hai. Aap kisi ka bhi access kabhi bhi turant 1-click me band (revoke) kar sakte hain.
                      </p>
                    </div>

                    {/* Authorized Contact Cards */}
                    <div className="space-y-2.5">
                      {authorizedContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-indigo-200 transition-all space-y-2"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm flex-shrink-0">
                                {(contact.name || "C").charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-extrabold text-slate-900 text-xs">{contact.name}</h4>
                                  <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                    {contact.relation}
                                  </span>
                                </div>
                                <span className="text-xs font-mono text-indigo-700 font-semibold block">
                                  {contact.phone}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              {contact.status === "viewing" ? (
                                <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                  Viewing Now
                                </span>
                              ) : contact.status === "whatsapp" ? (
                                <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1">
                                  <span>📲</span> WhatsApp Linked
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                                  Last active {contact.lastSeen}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                            <div className="text-slate-500 flex items-center gap-2">
                              <span>📱 {contact.device || "Mobile Device"}</span>
                              <span>•</span>
                              <span className="text-slate-700 font-medium">{contact.permission || "Full GPS & Alerts"}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSendLivePing(contact.name)}
                                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <span>📍 Ping Now</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRevokeAccess(contact.id, contact.name)}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <span>❌ Stop Sharing</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add New Family Member Accordion */}
                    <div className="pt-1">
                      {!showAddContact ? (
                        <button
                          type="button"
                          onClick={() => setShowAddContact(true)}
                          className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-2xl text-xs font-extrabold text-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <span>➕ Add Family Member / Guardian</span>
                        </button>
                      ) : (
                        <form onSubmit={handleAddContact} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-slate-900 text-xs">Add New Live Location Viewer</h4>
                            <button
                              type="button"
                              onClick={() => setShowAddContact(false)}
                              className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                            >
                              ✕ Cancel
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Full Name (e.g. Chachu / Rohit)"
                              value={newContactName}
                              onChange={(e) => setNewContactName(e.target.value)}
                              className="p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:border-indigo-500"
                            />
                            <input
                              type="tel"
                              required
                              placeholder="Phone Number (+91...)"
                              value={newContactPhone}
                              onChange={(e) => setNewContactPhone(e.target.value)}
                              className="p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:border-indigo-500 font-mono"
                            />
                            <select
                              value={newContactRelation}
                              onChange={(e) => setNewContactRelation(e.target.value)}
                              className="p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 outline-hidden focus:border-indigo-500"
                            >
                              <option value="Father">Father (Papa)</option>
                              <option value="Mother">Mother (Mummy)</option>
                              <option value="Sister">Sister</option>
                              <option value="Brother">Brother</option>
                              <option value="Spouse">Spouse / Partner</option>
                              <option value="Friend">Friend / Travel Buddy</option>
                            </select>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer"
                          >
                            ✓ Grant Live GPS Access & Send Invite Link
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: SEND LOCATION (LOCATION KESE SEND KREGA) */}
                {activeTabSafar === "send_location" && (
                  <div className="space-y-3">
                    {/* Method 1: Instant Live GPS Broadcast Ping */}
                    <div className="p-4 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 border-2 border-indigo-300 rounded-2xl space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm shadow-xs font-bold">
                            📡
                          </span>
                          <div>
                            <h4 className="text-xs font-black text-slate-900">
                              Method 1: Instant Live GPS Broadcast
                            </h4>
                            <span className="text-[10px] text-indigo-700 font-bold">
                              One-click update to all {authorizedContacts.length} family members
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] bg-indigo-100 text-indigo-900 font-extrabold px-2 py-0.5 rounded-full">
                          Instant Push
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        Current GPS coordinates ({(safarSession.current_milestone?.lat ?? 18.7546).toFixed(4)}° N, {(safarSession.current_milestone?.lng ?? 73.4062).toFixed(4)}° E) at {safarSession.current_milestone?.name || "Highway Checkpoint"}, gaadi ki live speed (78 km/h), battery status (88%), aur next milestone Papa, Mummy aur authorized members ko turant broadcast karein.
                      </p>

                      <button
                        type="button"
                        onClick={() => handleSendLivePing()}
                        className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                          pingSuccess
                            ? "bg-emerald-600 text-white"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                        }`}
                      >
                        <span className={pingSuccess ? "animate-spin" : "animate-ping text-[11px]"}>📍</span>
                        <span>{pingSuccess ? "✓ Live GPS Coordinates Broadcasted to Family!" : "Broadcast Live GPS Ping to All Family Now"}</span>
                      </button>
                    </div>

                    {/* Method 2: Direct WhatsApp Sharing */}
                    <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">💬</span>
                          <h4 className="text-xs font-black text-emerald-950">
                            Method 2: 1-Click WhatsApp Direct Share
                          </h4>
                        </div>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Personal WhatsApp
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <a
                          href={`https://api.whatsapp.com/send?phone=919876543210&text=${encodeURIComponent(
                            `🌟 Family Live Share: Papa, main raste me hoon aur bilkul safe hoon!\n• Live GPS Tracking: ${
                              typeof window !== "undefined"
                                ? `${window.location.origin}/track/${safarSession.track_id}`
                                : safarSession.tracking_url
                            }\n• Current Location: ${safarSession.current_milestone?.name || "Expressway"}\n• Speed: 78 km/h\n• Battery: 88%\n(Automatic checkpoint alerts active)`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center justify-between transition-all"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>👨‍🦳</span> Send to Papa (+91-9876543210)
                          </span>
                          <span className="text-[10px] text-emerald-600">Share ➔</span>
                        </a>

                        <a
                          href={`https://api.whatsapp.com/send?phone=919876543211&text=${encodeURIComponent(
                            `🌟 Family Live Share: Mummy, live tracking link yeh raha:\n${
                              typeof window !== "undefined"
                                ? `${window.location.origin}/track/${safarSession.track_id}`
                                : safarSession.tracking_url
                            }\n• Current Location: ${safarSession.current_milestone?.name || "Expressway"}\nHar stop (Dhaba, Toll, Hotel) par automatic update aayega.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center justify-between transition-all"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>👩</span> Send to Mummy (+91-9876543211)
                          </span>
                          <span className="text-[10px] text-emerald-600">Share ➔</span>
                        </a>

                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                            `🌟 Family Live Share: Tracking ${safarSession.traveler_name || currentUser?.name || "Rahul"} live!\n• Real-Time Map: ${
                              typeof window !== "undefined"
                                ? `${window.location.origin}/track/${safarSession.track_id}`
                                : safarSession.tracking_url
                            }\n• Route: ${safarSession.origin} to ${safarSession.destination}\n• Current Milestone: ${safarSession.current_milestone?.name || "Underway"}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="sm:col-span-2 p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-all"
                        >
                          <span>👨‍👩‍👧‍👦</span> Share in Family WhatsApp Group
                        </a>
                      </div>
                    </div>

                    {/* Method 3: 2G/SMS Native Messaging (Works without Internet) */}
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">📱</span>
                          <h4 className="text-xs font-black text-amber-950">
                            Method 3: 2G / SMS Dispatch (Zero Internet Failover)
                          </h4>
                        </div>
                        <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full font-mono">
                          SMS Safe
                        </span>
                      </div>
                      <div className="p-2 bg-white rounded-xl font-mono text-[10px] text-slate-800 border border-amber-200 select-all">
                        NAV {safarSession.track_id}: {safarSession.traveler_name || "Rahul"} SAFE. GPS:{(safarSession.current_milestone?.lat ?? 18.7546).toFixed(4)},{(safarSession.current_milestone?.lng ?? 73.4062).toFixed(4)} BAT:88% SPD:78kmh. LOC:{safarSession.current_milestone?.name ?? "Expressway"}. SOS:112
                      </div>
                      <a
                        href={`sms:+919876543210?body=${encodeURIComponent(
                          `NAV ${safarSession.track_id}: ${safarSession.traveler_name || "Rahul"} SAFE. GPS:${(safarSession.current_milestone?.lat ?? 18.7546).toFixed(4)},${(safarSession.current_milestone?.lng ?? 73.4062).toFixed(4)} BAT:88% SPD:78kmh. LOC:${safarSession.current_milestone?.name ?? "Expressway"}. SOS:112`
                        )}`}
                        className="block w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs text-center shadow-xs transition-all"
                      >
                        ✉️ Dispatch Native SMS to Papa (+91-9876543210)
                      </a>
                    </div>

                    {/* Method 4: Live Web Link */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                          <span>🌐</span> Method 4: Direct Web Tracking Link
                        </span>
                        <span className="text-[10px] font-mono text-indigo-800 bg-white px-2 py-0.5 rounded-full border border-slate-200 font-bold">
                          ID: {safarSession.track_id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 text-slate-900 font-mono text-xs select-all truncate">
                        <span className="truncate flex-1 text-indigo-700 font-medium">
                          {typeof window !== "undefined"
                            ? `${window.location.origin}/track/${safarSession.track_id}`
                            : safarSession.tracking_url || `http://localhost:3000/track/${safarSession.track_id}`}
                        </span>
                        <button
                          type="button"
                          onClick={copyTrackingLink}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-lg text-xs flex-shrink-0 transition-all border border-slate-200 cursor-pointer"
                        >
                          {copiedLink ? "✓ Copied!" : "📋 Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: OFFLINE & SIGNAL SIMULATOR */}
                {activeTabSafar === "simulator" && (
                  <div className="p-3.5 bg-slate-50 text-slate-900 rounded-2xl space-y-2.5 shadow-xs border border-purple-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                        <span>📡</span> Signal Condition & Zero-Network Dead Reckoning:
                      </span>
                      <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full ${
                        simulatedNetwork === "5g"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : simulatedNetwork === "2g"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : simulatedNetwork === "dead_zone"
                          ? "bg-rose-100 text-rose-800 border border-rose-200 animate-pulse"
                          : "bg-purple-100 text-purple-800 border border-purple-200 animate-pulse"
                      }`}>
                        {simulatedNetwork === "5g" ? "🟢 5G Live Online" : simulatedNetwork === "2g" ? "🟡 2G Single-Bar" : simulatedNetwork === "dead_zone" ? "🔴 Zero-Signal Mountain Valley" : "⚫ Absolute 0G (No Towers / No SMS)"}
                      </span>
                    </div>

                    {/* Network Switcher Simulator */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[9px] font-bold">
                      <button
                        type="button"
                        onClick={() => setSimulatedNetwork("5g")}
                        className={`py-1.5 px-2 rounded-xl transition-all text-center border cursor-pointer ${
                          simulatedNetwork === "5g" ? "bg-emerald-600 text-white border-emerald-600 shadow-xs" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        🟢 5G Online
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimulatedNetwork("2g")}
                        className={`py-1.5 px-2 rounded-xl transition-all text-center border cursor-pointer ${
                          simulatedNetwork === "2g" ? "bg-amber-500 text-slate-950 border-amber-500 shadow-xs" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        🟡 2G SMS
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimulatedNetwork("dead_zone")}
                        className={`py-1.5 px-2 rounded-xl transition-all text-center border cursor-pointer ${
                          simulatedNetwork === "dead_zone" ? "bg-rose-600 text-white border-rose-600 shadow-xs" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        🔴 Dead-Zone
                      </button>
                      <button
                        type="button"
                        onClick={() => setSimulatedNetwork("zero_network")}
                        className={`py-1.5 px-2 rounded-xl transition-all text-center border cursor-pointer ${
                          simulatedNetwork === "zero_network" ? "bg-purple-600 text-white border-purple-600 shadow-xs" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        ⚫ 0G Blackout (No SMS)
                      </button>
                    </div>

                    {/* Space GNSS Satellite Explanation */}
                    <div className="p-2.5 bg-white rounded-xl border border-indigo-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-indigo-900 font-extrabold text-[11px] flex items-center gap-1">
                          <span>🛰️</span> Phone ko Location Kese Milti Hai? (Space GNSS & NavIC)
                        </span>
                        <span className="text-emerald-700 text-[9px] font-mono font-bold">100% Cellular-Independent</span>
                      </div>
                      <p className="text-slate-600 text-[10px] leading-relaxed">
                        SIM ya cellular tower se GPS ka koi lena dena nahi hota. Space me 20,000 km upar ISRO NavIC + US GPS satellites radio waves bhejte hain jo Qualcomm/Apple GNSS chip passive sunkar trilateration se exact location calculate karti hai.
                      </p>
                    </div>

                    {/* Simulators */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 bg-white rounded-xl border border-sky-200 space-y-1.5">
                        <span className="font-extrabold text-sky-900 text-[10px] block">A. Direct Satellite SOS Uplink</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSatelliteBeamed(true);
                            setTimeout(() => setSatelliteBeamed(false), 4000);
                          }}
                          className="w-full py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-[9px] transition-all cursor-pointer"
                        >
                          {satelliteBeamed ? "✅ Beamed to MHA ERSS-112!" : "Test Direct Satellite SOS Beam"}
                        </button>
                      </div>

                      <div className="p-2.5 bg-white rounded-xl border border-amber-200 space-y-1.5">
                        <span className="font-extrabold text-amber-900 text-[10px] block">B. NDMA Good Samaritan Mesh Relay</span>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const res = await fetch("http://localhost:8000/api/zero-network/simulate-mesh-hop", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ track_id: safarSession?.track_id || "GP-LEH-9921", forwarder_name: "NDMA Volunteer Vehicle (HR-55)" })
                              });
                              const data = await res.json();
                              setZeroMeshHopStatus(data.relay_result);
                            } catch (e) {
                              setZeroMeshHopStatus({
                                reassurance_alert_to_family: "✅ RELAYED VIA GOOD SAMARITAN VEHICLE (HR-55)! Uploaded at checkpost."
                              });
                            }
                          }}
                          className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[9px] transition-all cursor-pointer"
                        >
                          Simulate Passing Vehicle Hop
                        </button>
                      </div>
                    </div>

                    {/* Exceptional Event Simulators */}
                    <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between gap-2">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">Worst-Case Event Testers:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAdvanceMilestone("MS-EX-FLIGHT-DIVERTED")}
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[9px] font-extrabold transition-all cursor-pointer"
                        >
                          ⚠️ Fog Flight Diversion
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdvanceMilestone("MS-EX-LOW-BATTERY-SAFE")}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-[9px] font-extrabold transition-all cursor-pointer"
                        >
                          🔋 Battery 6% Breadcrumb
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdvanceMilestone("MS-EX-PHONE-SHUTDOWN-SAFE")}
                          className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[9px] font-extrabold transition-all cursor-pointer"
                        >
                          📱 Phone Off Notice
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Razorpay checkout modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 space-y-4 text-slate-900 shadow-2xl">
            <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>{t.paymentTitle}</span>
              <span className="text-[10px] text-emerald-700 font-mono font-bold">🔒 SSL 256-Bit</span>
            </h3>
            {paySuccess ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-bold text-slate-900 text-xs">{t.paymentSuccess}</h4>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-[9px] font-mono text-slate-700">{t.refNo}: {payRef}</div>
                <button onClick={() => setShowPayment(false)} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer">
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
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 animate-fade-in shadow-xs">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded font-mono">
                                🎟️ {activePromo.code}
                              </span>
                              <span className="text-[9px] font-bold text-emerald-700">✓ Promo Applied</span>
                            </div>
                            <span className="text-xs font-black text-emerald-700">
                              -₹{activePromo.discount_inr}
                            </span>
                          </div>
                          <p className="text-[9px] text-emerald-800 font-medium">
                            {activePromo.description}
                          </p>
                        </div>
                      )}

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-[11px]">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span>🏨 Hotel Stay (Confirmed Voucher):</span>
                          <span className="text-slate-900">₹{itinerary?.cost_breakdown?.stays || 0}</span>
                        </div>
                        {transportMode !== "self-drive" && (
                          <div className="flex justify-between font-bold text-slate-700">
                            <span>🎫 Transit Tickets (PNR/E-Ticket):</span>
                            <span className="text-slate-900">₹{itinerary?.cost_breakdown?.transport || 0}</span>
                          </div>
                        )}
                        {discountAmount > 0 && (
                          <div className="flex justify-between font-bold text-emerald-700">
                            <span>🎟️ Promo Code Discount:</span>
                            <span>-₹{discountAmount}</span>
                          </div>
                        )}
                        <div className="border-t border-slate-200 pt-1.5 flex justify-between font-extrabold text-emerald-700 text-xs">
                          <span>💳 Total Payable Now:</span>
                          <span>₹{finalPayable.toFixed(0)}</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-[10px] text-amber-900">
                        <span className="font-extrabold block text-amber-900">🚗 On-Trip Estimated Expenses (Pay on the road):</span>
                        <div className="flex justify-between text-amber-800">
                          <span>• Meals & Food Thalis:</span>
                          <span className="font-bold">₹{itinerary?.cost_breakdown?.food || 0}</span>
                        </div>
                        {transportMode === "self-drive" && (
                          <div className="flex justify-between text-amber-800">
                            <span>• Fuel & Fastag Tolls:</span>
                            <span className="font-bold">₹{(itinerary?.cost_breakdown?.transport || 0) + (itinerary?.cost_breakdown?.toll || 0)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-amber-800">
                          <span>• Monument Entry Tickets:</span>
                          <span className="font-bold">₹{itinerary?.cost_breakdown?.activities || 0}</span>
                        </div>
                        <p className="text-[9px] text-amber-700 italic pt-1">Note: On-trip expenses are NOT charged online and will be paid directly during your journey.</p>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button onClick={() => setShowPayment(false)} className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-900 transition-all cursor-pointer">Cancel</button>
                        <button onClick={triggerPayment} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs transition-all shadow-md shadow-emerald-600/25 active:scale-98 cursor-pointer">
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

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Traveler Hub Drawer (User Details, Past Trips, Add Recommendations) */}
      <UserProfileHub
        isOpen={userHubOpen}
        onClose={() => setUserHubOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => {
          setUserHubOpen(false);
          handleOpenAuth("signin");
        }}
      />
    </div>
  );
}
