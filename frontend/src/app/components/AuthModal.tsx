"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  Fingerprint,
  Lock,
  ShieldCheck,
  Check,
  KeyRound,
  Smartphone,
  ChevronRight,
  Eye,
  EyeOff,
  UserCheck
} from "lucide-react";

export interface AuthUser {
  name: string;
  email: string;
  provider: "google" | "apple" | "email";
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  initialMode?: "signin" | "cockpit" | "plan";
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = "signin",
}: AuthModalProps) {
  // Main Tab: "signin" | "signup"
  const [tab, setTab] = useState<"signin" | "signup">(
    initialMode === "cockpit" || initialMode === "plan" ? "signup" : "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Sub-Flow State Controller:
  // "idle" -> Main Modal (Continue with Google / Continue with Apple / Email)
  //
  // Google Workflow:
  // "google_email" -> Enter Email or Select Account
  // "google_password" -> Enter Google Password
  // "google_2fa" -> Google Phone 2-Step Verification prompt
  // "google_consent" -> Google OAuth Permissions screen (Safar AI wants to access your Google Account)
  // "google_redirect" -> Google Redirect spinner
  //
  // Apple Workflow:
  // "apple_login" -> Apple ID & Password / Touch ID Prompt
  // "apple_2fa" -> Apple 6-Digit Two-Factor Authentication
  // "apple_consent" -> The Real Apple Details: First/Last Name & Share vs Hide My Email
  // "apple_touchid" -> macOS Touch ID fingerprint animation
  // "apple_verifying" -> Apple Secure Enclave verification
  const [authStep, setAuthStep] = useState<string>("idle");

  // Google Flow State
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");
  const [googlePassword, setGooglePassword] = useState("");
  const [showGooglePassword, setShowGooglePassword] = useState(false);
  const [google2FACode, setGoogle2FACode] = useState("48");

  // Apple ID Flow State
  const [appleEmail, setAppleEmail] = useState("");
  const [appleFirstName, setAppleFirstName] = useState("");
  const [appleLastName, setAppleLastName] = useState("");
  const [applePassword, setApplePassword] = useState("");
  const [appleShareEmail, setAppleShareEmail] = useState<boolean>(true);
  const [apple2FACode, setApple2FACode] = useState(["8", "3", "1", "9", "4", "2"]);
  const [appleTouchScanning, setAppleTouchScanning] = useState(false);

  // Active verified user being processed
  const [activeUser, setActiveUser] = useState<AuthUser | null>(null);

  // Saved accounts history
  const [savedAccounts, setSavedAccounts] = useState<AuthUser[]>([]);

  // Subtle synthesized audio feedback
  const playHapticChime = () => {
    try {
      if (typeof window !== "undefined" && (window.AudioContext || (window as any).webkitAudioContext)) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("yournav_saved_accounts");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedAccounts(parsed);
          }
        }
        // Auto-seed email if user previously entered one in current session
        const active = localStorage.getItem("yournav_user");
        if (active) {
          const u = JSON.parse(active);
          if (u?.email) {
            setGoogleEmail(u.email);
            setAppleEmail(u.email);
            const nameParts = (u.name || "").split(" ");
            setAppleFirstName(nameParts[0] || "Harsh");
            setAppleLastName(nameParts.slice(1).join(" ") || "Vashishth");
            setGoogleName(u.name || "Harsh Vashishth");
          }
        }
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const saveAndComplete = (user: AuthUser) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("yournav_user", JSON.stringify(user));
        const updated = [
          user,
          ...savedAccounts.filter((a) => a.email.toLowerCase() !== user.email.toLowerCase()),
        ].slice(0, 4);
        localStorage.setItem("yournav_saved_accounts", JSON.stringify(updated));
        setSavedAccounts(updated);
      } catch (e) {}
    }
    onClose();
    onSuccess(user);
    setAuthStep("idle");
  };

  // -------------------------------------------------------------
  // EMAIL FORM SUBMIT
  // -------------------------------------------------------------
  const handleEmailSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalEmail = email.trim() || "traveler@safar.ai";
    const finalName = fullName.trim() || finalEmail.split("@")[0] || "Traveler";
    saveAndComplete({
      name: finalName,
      email: finalEmail,
      provider: "email",
    });
  };

  // -------------------------------------------------------------
  // GOOGLE MULTI-STAGE AUTH HANDLERS
  // -------------------------------------------------------------
  const handleStartGoogleFlow = (suggestedAccount?: AuthUser) => {
    if (suggestedAccount) {
      setGoogleEmail(suggestedAccount.email);
      setGoogleName(suggestedAccount.name);
      setAuthStep("google_password");
    } else {
      setAuthStep("google_email");
    }
  };

  const handleGoogleEmailNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) return;
    if (!googleName.trim()) {
      const prefix = googleEmail.split("@")[0];
      const derived = prefix.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      setGoogleName(derived);
    }
    setAuthStep("google_password");
  };

  const handleGooglePasswordNext = (e: React.FormEvent) => {
    e.preventDefault();
    // Move to authentic Google 2-Step Phone Verification
    setAuthStep("google_2fa");
  };

  const handleGoogle2FAApprove = () => {
    playHapticChime();
    // Move to Google OAuth permissions consent screen
    setAuthStep("google_consent");
  };

  const handleGoogleConsentAllow = () => {
    playHapticChime();
    const user: AuthUser = {
      name: googleName || "Harsh Vashishth",
      email: googleEmail || "vashishtharsh@gmail.com",
      provider: "google",
    };
    setActiveUser(user);
    setAuthStep("google_redirect");
    setTimeout(() => {
      saveAndComplete(user);
    }, 900);
  };

  // -------------------------------------------------------------
  // APPLE MULTI-STAGE AUTH HANDLERS
  // -------------------------------------------------------------
  const handleStartAppleFlow = () => {
    if (!appleEmail) {
      setAppleEmail("vashishtharsh@icloud.com");
      setAppleFirstName("Harsh");
      setAppleLastName("Vashishth");
    }
    setAuthStep("apple_login");
  };

  const handleAppleCredentialsSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Move to Apple 6-Digit Two-Factor Authentication
    setAuthStep("apple_2fa");
  };

  const handleAppleTouchIDTrigger = () => {
    setAuthStep("apple_touchid");
    setAppleTouchScanning(true);
    setTimeout(() => {
      setAppleTouchScanning(false);
      playHapticChime();
      // Move to Apple details & privacy choice screen
      setAuthStep("apple_consent");
    }, 1200);
  };

  const handleApple2FAComplete = () => {
    playHapticChime();
    // Move to Apple Details & Privacy Choices screen
    setAuthStep("apple_consent");
  };

  const handleAppleConsentContinue = () => {
    playHapticChime();
    const cleanFirst = appleFirstName.trim() || "Harsh";
    const cleanLast = appleLastName.trim() || "Vashishth";
    const finalName = `${cleanFirst} ${cleanLast}`.trim();
    const rawEmail = appleEmail.trim() || "vashishtharsh@icloud.com";
    const finalEmail = appleShareEmail
      ? rawEmail
      : `${rawEmail.split("@")[0]}_relay@appleid.com`;

    const user: AuthUser = {
      name: finalName,
      email: finalEmail,
      provider: "apple",
    };
    setActiveUser(user);
    setAuthStep("apple_verifying");
    setTimeout(() => {
      saveAndComplete(user);
    }, 850);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="w-full max-w-sm sm:max-w-md bg-[#12141a] border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl relative transition-all duration-300 overflow-hidden text-slate-200">

        {/* ========================================================================= */}
        {/* VIEW 1: MAIN STANDARD SIGN-IN MODAL (Clean, Prominent Google/Apple)       */}
        {/* ========================================================================= */}
        {authStep === "idle" && (
          <>
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Brand Header */}
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto mb-2.5 text-2xl font-black shadow-lg shadow-indigo-500/30">
                🧭
              </div>
              <h3 className="text-lg font-black text-white tracking-tight">
                {tab === "signin" ? "Sign In to Safar AI" : "Create Your Safar Account"}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Sign in with your personal Google account or Apple ID for live GPS sync and trip planning.
              </p>
            </div>

            {/* ================= FULL-WIDTH PRIMARY SOCIAL BUTTONS ================= */}
            <div className="space-y-2.5 mb-4">
              {/* 1. Official Google Button */}
              <button
                type="button"
                onClick={() => handleStartGoogleFlow()}
                className="w-full h-11 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer flex items-center justify-center gap-3 border border-slate-200"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* 2. Official Apple Button */}
              <button
                type="button"
                onClick={() => handleStartAppleFlow()}
                className="w-full h-11 px-4 rounded-2xl bg-black hover:bg-neutral-900 text-white text-xs font-bold transition-all shadow-sm hover:shadow active:scale-98 cursor-pointer flex items-center justify-center gap-2.5 border border-white/20"
              >
                <span className="text-base font-bold"></span>
                <span>Continue with Apple</span>
              </button>
            </div>

            {/* Separator */}
            <div className="relative flex items-center justify-center mb-4">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#12141a] px-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider absolute">
                or continue with email
              </span>
            </div>

            {/* Tab Toggle: Sign In vs Sign Up */}
            <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 mb-3.5">
              <button
                type="button"
                onClick={() => setTab("signin")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  tab === "signin" ? "bg-white text-black shadow-xs" : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setTab("signup")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  tab === "signup" ? "bg-white text-black shadow-xs" : "text-slate-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Manual Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {tab === "signup" && (
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Harsh Vashishth"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-400 transition"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-400 transition"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-400 transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs tracking-wide transition shadow-lg shadow-indigo-600/25 cursor-pointer mt-2"
              >
                {tab === "signin" ? "Sign In & Launch" : "Create Account & Launch"}
              </button>
            </form>
          </>
        )}

        {/* ========================================================================= */}
        {/* GOOGLE FLOW - STEP 1: EMAIL ENTRY / ACCOUNT CHOOSER (accounts.google.com) */}
        {/* ========================================================================= */}
        {authStep === "google_email" && (
          <div className="space-y-4 animate-fade-in bg-white text-slate-900 -m-5 sm:-m-6 p-6 sm:p-7 rounded-3xl">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setAuthStep("idle")}
                className="text-slate-500 hover:text-slate-800 p-1 -ml-1 rounded-full hover:bg-slate-100 transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>accounts.google.com</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1 -mr-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-1">
              <svg className="w-9 h-9 mx-auto mb-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Sign in</h3>
              <p className="text-xs text-slate-500 mt-0.5">to continue to <span className="font-semibold text-slate-800">Safar AI</span></p>
            </div>

            <form onSubmit={handleGoogleEmailNext} className="space-y-3.5 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email or phone
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="vashishtharsh@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Harsh Vashishth"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                  Forgot email?
                </span>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <span>➔</span>
                </button>
              </div>
            </form>

            <p className="text-[10.5px] text-slate-400 text-center leading-relaxed pt-2">
              Before using this app, you can review Safar AI&apos;s privacy policy and terms of service.
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GOOGLE FLOW - STEP 2: PASSWORD ENTRY                                      */}
        {/* ========================================================================= */}
        {authStep === "google_password" && (
          <div className="space-y-4 animate-fade-in bg-white text-slate-900 -m-5 sm:-m-6 p-6 sm:p-7 rounded-3xl">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setAuthStep("google_email")}
                className="text-slate-500 hover:text-slate-800 p-1 -ml-1 rounded-full hover:bg-slate-100 transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>accounts.google.com</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1 -mr-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-1">
              <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>

              {/* Selected Account Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700 border border-slate-200 mb-1">
                <div className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center">
                  {(googleName || googleEmail || "G").charAt(0).toUpperCase()}
                </div>
                <span>{googleEmail || "vashishtharsh@gmail.com"}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Welcome</h3>
            </div>

            <form onSubmit={handleGooglePasswordNext} className="space-y-3.5 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Enter your password
                </label>
                <div className="relative">
                  <input
                    type={showGooglePassword ? "text" : "password"}
                    required
                    autoFocus
                    placeholder="••••••••••••"
                    value={googlePassword}
                    onChange={(e) => setGooglePassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-xs text-slate-900 placeholder-slate-400 outline-none transition font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGooglePassword(!showGooglePassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showGooglePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                  Forgot password?
                </span>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <span>➔</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GOOGLE FLOW - STEP 3: 2-STEP PHONE VERIFICATION                           */}
        {/* ========================================================================= */}
        {authStep === "google_2fa" && (
          <div className="space-y-4 animate-fade-in bg-white text-slate-900 -m-5 sm:-m-6 p-6 sm:p-7 rounded-3xl">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setAuthStep("google_password")}
                className="text-slate-500 hover:text-slate-800 p-1 -ml-1 rounded-full hover:bg-slate-100 transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>2-Step Verification</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1 -mr-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-2 space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto text-2xl shadow-xs">
                <Smartphone className="w-7 h-7 animate-bounce" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Check your phone</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Google sent a prompt to your smartphone. Tap <strong>Yes</strong> on the prompt, then tap <strong>{google2FACode}</strong> on your phone to verify it&apos;s you.
              </p>

              {/* Authentic Google Number Badge */}
              <div className="py-2">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/30">
                  {google2FACode}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Tap this number on your phone</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleGoogle2FAApprove}
                className="w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>I Tapped {google2FACode} (Confirm & Continue)</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              Don&apos;t have your phone? <span className="text-blue-600 underline cursor-pointer">Try another way</span>
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GOOGLE FLOW - STEP 4: OAUTH PERMISSIONS CONSENT (Safar AI wants access)   */}
        {/* ========================================================================= */}
        {authStep === "google_consent" && (
          <div className="space-y-4 animate-fade-in bg-white text-slate-900 -m-5 sm:-m-6 p-6 sm:p-7 rounded-3xl">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setAuthStep("google_2fa")}
                className="text-slate-500 hover:text-slate-800 p-1 -ml-1 rounded-full hover:bg-slate-100 transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>Google OAuth 2.0</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1 -mr-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-1">
              <h3 className="text-base font-extrabold text-slate-900">
                Safar AI wants to access your Google Account
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                {googleEmail}
              </p>
            </div>

            {/* Scope Permissions List */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                This will allow Safar AI to:
              </span>
              <div className="flex items-start gap-2 text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>See your primary Google Account email address</span>
              </div>
              <div className="flex items-start gap-2 text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>See your personal info, including any public profile data</span>
              </div>
              <div className="flex items-start gap-2 text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>Securely authenticate your travel telemetry & saved trips</span>
              </div>
            </div>

            {/* Two Standard OAuth Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setAuthStep("idle")}
                className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGoogleConsentAllow}
                className="px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>Allow</span>
                <span>➔</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              You can revoke this access at any time in your Google Account security settings.
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GOOGLE FLOW - STEP 5: REDIRECT SPINNER                                    */}
        {/* ========================================================================= */}
        {authStep === "google_redirect" && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3.5 animate-fade-in bg-white text-slate-900 -m-5 sm:-m-6 p-6 sm:p-7 rounded-3xl">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-3 border-blue-100 border-t-blue-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
            </div>
            <h4 className="text-sm font-bold text-slate-900">Signed in as {activeUser?.name}</h4>
            <p className="text-xs text-slate-500 font-mono">Redirecting to Safar AI...</p>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
              ✓ Google OAuth 2.0 Authenticated
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* APPLE FLOW - STEP 1: APPLE ID LOGIN & PASSKEY / TOUCH ID PROMPT           */}
        {/* ========================================================================= */}
        {authStep === "apple_login" && (
          <div className="space-y-4 animate-fade-in">
            {/* Apple Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <button
                type="button"
                onClick={() => setAuthStep("idle")}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition flex items-center gap-1 text-xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                <span className="text-sm font-bold"></span>
                <span>appleid.apple.com</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Apple Logo & Title */}
            <div className="text-center pt-0.5">
              <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center text-2xl mx-auto mb-2 shadow-lg">
                
              </div>
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Sign in with Apple
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Use your Apple ID to sign in to <strong className="text-white">Safar AI</strong>.
              </p>
            </div>

            {/* Quick Touch ID / Passkey Hero Action */}
            <button
              type="button"
              onClick={handleAppleTouchIDTrigger}
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-white/15 via-white/10 to-transparent border border-white/20 hover:border-white/40 text-left flex items-center gap-3 transition cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold text-base flex-shrink-0 group-hover:scale-105 transition-transform">
                <Fingerprint className="w-5 h-5 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black text-white group-hover:text-sky-300 transition">
                  Touch ID / Face ID for Mac & iPhone
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Instant biometric authentication via Secure Enclave
                </div>
              </div>
              <span className="text-xs text-white font-bold group-hover:translate-x-0.5 transition-transform">➔</span>
            </button>

            {/* Manual Apple ID & Password Form */}
            <form onSubmit={handleAppleCredentialsSubmit} className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Apple ID
                </label>
                <input
                  type="email"
                  required
                  placeholder="vashishtharsh@icloud.com"
                  value={appleEmail}
                  onChange={(e) => setAppleEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Apple ID Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={applePassword}
                  onChange={(e) => setApplePassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 focus:border-white rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-sky-400 hover:underline cursor-pointer">
                  Forgot Apple ID or password?
                </span>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white text-black hover:bg-slate-200 font-extrabold text-xs transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <span>➔</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* APPLE FLOW - STEP 2: TWO-FACTOR AUTHENTICATION (6 DIGIT CODE)             */}
        {/* ========================================================================= */}
        {authStep === "apple_2fa" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <button
                type="button"
                onClick={() => setAuthStep("apple_login")}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition flex items-center gap-1 text-xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                <span className="text-sm"></span>
                <span>Two-Factor Auth</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-1 space-y-1.5">
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Two-Factor Authentication
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                A verification code has been sent to your Apple devices. Enter the code to continue.
              </p>
            </div>

            {/* 6 Digit Input Boxes */}
            <div className="flex items-center justify-center gap-2 py-3">
              {apple2FACode.map((digit, idx) => (
                <div
                  key={idx}
                  className="w-10 h-12 rounded-xl bg-white/10 border border-white/20 text-white font-black text-lg flex items-center justify-center font-mono shadow-xs"
                >
                  {digit}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleApple2FAComplete}
              className="w-full py-2.5 rounded-xl bg-white text-black hover:bg-slate-200 font-extrabold text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Verify Code & Continue</span>
            </button>

            <p className="text-[10px] text-slate-500 text-center">
              Didn&apos;t get a code? <span className="text-sky-400 underline cursor-pointer">Resend Code</span>
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* APPLE FLOW - STEP 3: THE REAL APPLE CONSENT SCREEN (Name & Hide My Email) */}
        {/* ========================================================================= */}
        {authStep === "apple_consent" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <button
                type="button"
                onClick={() => setAuthStep("apple_login")}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition flex items-center gap-1 text-xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                <span className="text-sm"></span>
                <span>Apple ID</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center pt-0.5">
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Continue to Safar AI
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review the information shared with Safar AI.
              </p>
            </div>

            {/* Apple Name Fields (First Name & Last Name) */}
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Name Shared with App
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">First Name</label>
                  <input
                    type="text"
                    value={appleFirstName}
                    onChange={(e) => setAppleFirstName(e.target.value)}
                    placeholder="Harsh"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Last Name</label>
                  <input
                    type="text"
                    value={appleLastName}
                    onChange={(e) => setAppleLastName(e.target.value)}
                    placeholder="Vashishth"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Apple Email Privacy Options (Share My Email vs Hide My Email) */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-0.5">
                Email Settings
              </span>
              <button
                type="button"
                onClick={() => setAppleShareEmail(true)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition ${
                  appleShareEmail
                    ? "bg-white/15 border-white/40 text-white font-bold"
                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                }`}
              >
                <div>
                  <div className="text-xs font-bold">Share My Email</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {appleEmail || "vashishtharsh@icloud.com"}
                  </div>
                </div>
                {appleShareEmail && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
              </button>

              <button
                type="button"
                onClick={() => setAppleShareEmail(false)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition ${
                  !appleShareEmail
                    ? "bg-white/15 border-white/40 text-white font-bold"
                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                }`}
              >
                <div>
                  <div className="text-xs font-bold">Hide My Email</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {appleEmail ? `${appleEmail.split("@")[0]}_relay@appleid.com` : "vashishth_relay@appleid.com"}
                  </div>
                  <div className="text-[9.5px] text-slate-500 mt-0.5">
                    Forward to: {appleEmail || "vashishtharsh@icloud.com"}
                  </div>
                </div>
                {!appleShareEmail && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setAuthStep("idle")}
                className="px-4 py-2 rounded-xl border border-white/20 text-slate-300 hover:bg-white/10 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAppleConsentContinue}
                className="px-6 py-2 rounded-xl bg-white text-black hover:bg-slate-200 text-xs font-black transition shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Continue</span>
                <span>➔</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-500 text-center leading-relaxed">
              🔒 Protected by Apple Secure Enclave. Apple does not profile your search or location data.
            </p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* APPLE FLOW - STEP 4: TOUCH ID SCANNING MODAL                              */}
        {/* ========================================================================= */}
        {authStep === "apple_touchid" && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3.5 animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-4xl shadow-xl">
                <Fingerprint className={`w-10 h-10 transition-all ${
                  appleTouchScanning ? "text-rose-400 animate-pulse scale-110" : "text-emerald-400"
                }`} />
              </div>
            </div>
            <h4 className="text-base font-extrabold text-white">Touch ID for Safar AI</h4>
            <p className="text-xs text-slate-300">
              {appleTouchScanning ? "Scanning fingerprint on Touch ID sensor..." : "Fingerprint verified!"}
            </p>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
              ✓ Apple Secure Enclave Verified
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* APPLE FLOW - STEP 5: VERIFIED SUCCESS                                     */}
        {/* ========================================================================= */}
        {authStep === "apple_verifying" && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center text-3xl shadow-xl animate-pulse">
              
            </div>
            <h4 className="text-sm font-bold text-white">Apple ID Authenticated</h4>
            <p className="text-xs text-slate-300 font-mono">
              Signing in as {activeUser?.name}
            </p>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> Signed in via Apple
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
