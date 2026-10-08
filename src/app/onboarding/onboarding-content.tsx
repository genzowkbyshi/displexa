"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Building,
  Package,
  ChevronRight,
  User,
  ShieldCheck,
  Sparkles,
  LogIn,
  KeyRound,
} from "lucide-react";
import {
  onboardingSession,
  onboardingRegister,
  onboardingVerify,
  onboardingCompany,
  getOnboardingPackages,
  onboardingPackage,
  loginUser,
} from "@/services/onboarding.service";

interface OnboardingContentProps {
  defaultMode?: "register" | "login" | "forgot-password";
}

export default function OnboardingContent({ defaultMode = "register" }: OnboardingContentProps) {
  const searchParams = useSearchParams();
  const urlMode = searchParams?.get("mode") as "register" | "login" | "forgot-password" | null;

  const [authMode, setAuthMode] = useState<"register" | "login" | "forgot-password">(urlMode || defaultMode);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [packages, setPackages] = useState<any[]>([]);

  // State for register forms
  const [regData, setRegData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [verData, setVerData] = useState({ verificationCode: "", customChallengeId: "" });
  const [comData, setComData] = useState({ name: "", slug: "", phone: "" });
  const [pkgData, setPkgData] = useState({ packageId: "", billingCycle: "Monthly" });

  // State for login form
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // State for forgot password form
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    if (urlMode) {
      setAuthMode(urlMode);
    }
  }, [urlMode]);

  useEffect(() => {
    if (searchParams?.get("googleRegistered")) {
      return;
    }

    const startSession = async () => {
      try {
        await onboardingSession();
      } catch (err) {
        console.error("Failed to start session:", err);
      }
    };
    startSession();
  }, [searchParams]);

  useEffect(() => {
    const googleRegistered = searchParams?.get("googleRegistered");
    const googleError = searchParams?.get("googleError");

    if (googleRegistered) {
      setAuthMode("register");
      setCurrentStep(2);
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }

    if (googleError) {
      const messages: Record<string, string> = {
        cancelled: "Google kaydı iptal edildi.",
        config: "Google kayıt ayarları eksik.",
        invalid_state: "Google kayıt oturumu doğrulanamadı. Lütfen tekrar deneyin.",
        google_token: "Google hesabınız doğrulanamadı. Lütfen tekrar deneyin.",
        session: "Kayıt oturumu başlatılamadı. Lütfen tekrar deneyin.",
        registered: "Bu e-posta adresi zaten kayıtlı. Lütfen giriş yapın.",
        failed: "Google ile kayıt tamamlanamadı.",
      };

      setErrorMsg(messages[googleError] || "Google ile kayıt tamamlanamadı.");
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [searchParams]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      setLoading(true);
      const res = await onboardingRegister(regData);
      if (res && res.challengeId) {
        setChallengeId(res.challengeId);
      }
      setCurrentStep(1);
    } catch (error: any) {
      setErrorMsg(error.title || error.message || "Kayıt sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      setLoading(true);
      await onboardingVerify({
        challengeId: challengeId || verData.customChallengeId,
        verificationCode: verData.verificationCode,
      });
      setCurrentStep(2);
    } catch (error: any) {
      setErrorMsg(error.title || error.message || "Doğrulama sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const phone = normalizePhone(comData.phone);

    if (phone.length !== 10) {
      setErrorMsg("Telefon numarası başında 0 olmadan 10 haneli olmalıdır.");
      return;
    }

    try {
      setLoading(true);
      await onboardingCompany({ ...comData, phone });

      const pkgRes = await getOnboardingPackages();
      if (pkgRes && pkgRes.items) {
        const selectablePackages = pkgRes.items.filter(
          (item: any) => item.supportsMonthly || item.supportsYearly
        );
        setPackages(selectablePackages);
        const firstPackage = selectablePackages[0];
        if (firstPackage) {
          setPkgData({
            packageId: firstPackage.id,
            billingCycle: getDefaultBillingCycle(firstPackage),
          });
        }
      }

      setCurrentStep(3);
    } catch (error: any) {
      setErrorMsg(error.title || error.message || "Firma eklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handlePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      setLoading(true);
      await onboardingPackage(pkgData);
      setCurrentStep(4);
    } catch (error: any) {
      setErrorMsg(error.title || error.message || "Paket seçimi sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      setLoading(true);
      await loginUser(loginData);
      window.location.href = "https://app.displexa.com";
    } catch (error: any) {
      setErrorMsg(error?.title || error?.message || "E-posta veya şifre hatalı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setTimeout(() => {
      setLoading(false);
      setForgotSent(true);
    }, 600);
  };

  const steps = [
    { title: "Hesap", icon: User },
    { title: "Doğrulama", icon: CheckCircle2 },
    { title: "İşletme", icon: Building },
    { title: "Paket", icon: Package },
  ];

  const selectedPackage = packages.find((item: any) => item.id === pkgData.packageId);
  const availableBillingCycles = selectedPackage ? getAvailableBillingCycles(selectedPackage) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFBFD] via-[#F4F6F9] to-white text-black font-sans selection:bg-black selection:text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative">
      
      {/* Top Header / Navigation */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between py-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <img
            src="/images/logo.png"
            alt="MorgülMenü"
            className="h-[24px] sm:h-[28px] w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {authMode === "register" ? (
          <button
            type="button"
            onClick={() => {
              setAuthMode("login");
              setErrorMsg("");
            }}
            className="hidden sm:inline-block text-[13px] sm:text-[14px] text-neutral-600 hover:text-black font-medium transition"
          >
            Zaten hesabınız var mı? <span className="underline font-semibold text-black">Giriş Yap</span>
          </button>
        ) : authMode === "login" ? (
          <button
            type="button"
            onClick={() => {
              setAuthMode("register");
              setErrorMsg("");
            }}
            className="hidden sm:inline-block text-[13px] sm:text-[14px] text-neutral-600 hover:text-black font-medium transition"
          >
            Hesabınız yok mu? <span className="underline font-semibold text-black">Hemen Kayıt Ol</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setAuthMode("login");
              setErrorMsg("");
            }}
            className="hidden sm:inline-block text-[13px] sm:text-[14px] text-neutral-600 hover:text-black font-medium transition"
          >
            ← <span className="underline font-semibold text-black">Giriş Yap&apos;a Dön</span>
          </button>
        )}
      </div>

      {/* Main Form Card */}
      <div className="w-full max-w-xl mx-auto my-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-black/[0.08] p-6 sm:p-10 rounded-[32px] shadow-xl relative overflow-hidden"
        >
          {/* Top Segmented Tab Switcher (Ayrımı tamamen kaldıran modern sekme) */}
          {currentStep === 0 && authMode !== "forgot-password" && (
            <div className="flex p-1 bg-neutral-100 rounded-full mb-8 max-w-[280px] mx-auto border border-black/[0.05]">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("register");
                  setErrorMsg("");
                }}
                className={`flex-1 py-2 text-[13px] sm:text-[14px] font-medium rounded-full transition-all ${
                  authMode === "register"
                    ? "bg-black text-white shadow-sm"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                Kayıt Ol
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setErrorMsg("");
                }}
                className={`flex-1 py-2 text-[13px] sm:text-[14px] font-medium rounded-full transition-all ${
                  authMode === "login"
                    ? "bg-black text-white shadow-sm"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                Giriş Yap
              </button>
            </div>
          )}

          {/* ==================== LOGIN MODE ==================== */}
          {authMode === "login" && (
            <div>
              <div className="mb-6 text-center">
                <h1 className="text-[22px] sm:text-[26px] font-bold text-black tracking-tight">
                  Yönetim Paneline Giriş Yap
                </h1>
                <p className="text-[13px] sm:text-[14px] text-neutral-500 font-light mt-1">
                  Morgül Menü hesabınıza giriş yaparak menünüzü yönetin.
                </p>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200/80 rounded-2xl text-red-700 text-[13px] font-medium flex items-center gap-2">
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                {/* Google Sign-in */}
                <a
                  href="/api/auth/google/register/start"
                  className="h-12 bg-white text-black border border-black/15 hover:border-black rounded-full font-medium text-[14px] flex items-center justify-center gap-3 transition-all shadow-xs active:scale-95"
                >
                  <GoogleIcon />
                  Google ile Hızlı Giriş Yap
                </a>

                <div className="flex items-center gap-3 text-[12px] uppercase tracking-wider text-neutral-400 my-1">
                  <span className="h-px flex-1 bg-black/10" />
                  veya e-posta ile
                  <span className="h-px flex-1 bg-black/10" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-neutral-700">E-Posta Adresi</label>
                  <input
                    required
                    type="email"
                    placeholder="ornek@restoran.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="h-12 bg-neutral-50 border border-black/15 rounded-xl px-4 text-[14px] focus:outline-none focus:border-black focus:bg-white transition"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-medium text-neutral-700">Şifre</label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("forgot-password");
                        setErrorMsg("");
                        setForgotSent(false);
                        setForgotEmail(loginData.email);
                      }}
                      className="text-[12px] text-neutral-500 hover:text-black transition"
                    >
                      Şifremi unuttum?
                    </button>
                  </div>
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="h-12 bg-neutral-50 border border-black/15 rounded-xl px-4 text-[14px] focus:outline-none focus:border-black focus:bg-white transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-3 h-12 bg-black text-white hover:bg-neutral-800 rounded-full font-medium text-[15px] flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all"
                >
                  {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                  <LogIn className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-black/[0.06] text-center text-[13px] text-neutral-600">
                <span>Henüz bir hesabınız yok mu? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setErrorMsg("");
                  }}
                  className="font-semibold text-black underline hover:text-neutral-700 transition"
                >
                  Hemen Kayıt Olun
                </button>
              </div>
            </div>
          )}

          {/* ==================== FORGOT PASSWORD MODE ==================== */}
          {authMode === "forgot-password" && (
            <div>
              <div className="mb-6 text-center">
                <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-black border border-black/10 shadow-xs">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h1 className="text-[22px] sm:text-[26px] font-bold text-black tracking-tight">
                  Şifrenizi mi Unuttunuz?
                </h1>
                <p className="text-[13px] sm:text-[14px] text-neutral-500 font-light mt-1 max-w-[380px] mx-auto">
                  Hesabınıza bağlı e-posta adresinizi girin, şifre sıfırlama bağlantısını hemen gönderelim.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200/80 rounded-2xl text-red-700 text-[13px] font-medium flex items-center gap-2">
                  <span>{errorMsg}</span>
                </div>
              )}

              {forgotSent ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-[18px] font-bold text-emerald-900">
                    Sıfırlama Bağlantısı Gönderildi!
                  </h3>
                  <p className="text-[13px] text-emerald-800 font-light leading-relaxed">
                    <strong>{forgotEmail}</strong> adresine şifre sıfırlama talimatları gönderildi. Lütfen gelen kutunuzu ve spam klasörünüzü kontrol edin.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      setForgotSent(false);
                    }}
                    className="mt-2 w-full h-11 rounded-full bg-black text-white text-[14px] font-medium hover:bg-neutral-800 transition"
                  >
                    Giriş Ekranına Dön
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-neutral-700">E-Posta Adresi</label>
                    <input
                      required
                      type="email"
                      placeholder="ornek@restoran.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="h-12 bg-neutral-50 border border-black/15 rounded-xl px-4 text-[14px] focus:outline-none focus:border-black focus:bg-white transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-3 h-12 bg-black text-white hover:bg-neutral-800 rounded-full font-medium text-[15px] flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all"
                  >
                    {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("login");
                        setErrorMsg("");
                      }}
                      className="text-[13px] font-medium text-neutral-600 hover:text-black transition"
                    >
                      ← Giriş Yap&apos;a Dön
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ==================== REGISTER (ONBOARDING) MODE ==================== */}
          {authMode === "register" && (
            <>
              {currentStep < 4 ? (
                <>
                  {/* Stepper Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between relative">
                      {/* Progress Line */}
                      <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-neutral-200 -translate-y-1/2 -z-0" />
                      <div
                        className="absolute top-1/2 left-4 h-[2px] bg-black -translate-y-1/2 -z-0 transition-all duration-300"
                        style={{
                          width: `${(currentStep / (steps.length - 1)) * 92}%`,
                        }}
                      />

                      {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const isActive = currentStep === idx;
                        const isPast = currentStep > idx;

                        return (
                          <div key={idx} className="flex flex-col items-center gap-1.5 relative z-10">
                            <div
                              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isActive
                                  ? "bg-black text-white shadow-md scale-105"
                                  : isPast
                                  ? "bg-black text-white"
                                  : "bg-white border border-neutral-300 text-neutral-400"
                              }`}
                            >
                              {isPast ? (
                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              ) : (
                                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                              )}
                            </div>
                            <span
                              className={`text-[11px] sm:text-[12px] font-medium transition-colors ${
                                isActive ? "text-black font-bold" : isPast ? "text-neutral-700" : "text-neutral-400"
                              }`}
                            >
                              {step.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="mb-6 text-center">
                    <h1 className="text-[22px] sm:text-[26px] font-bold text-black tracking-tight">
                      {currentStep === 0 && "Hesabınızı Oluşturun"}
                      {currentStep === 1 && "E-Posta Doğrulama"}
                      {currentStep === 2 && "İşletme Bilgileri"}
                      {currentStep === 3 && "Paket ve Plan Seçimi"}
                    </h1>
                    <p className="text-[13px] sm:text-[14px] text-neutral-500 font-light mt-1">
                      {currentStep === 0 && "14 günlük ücretsiz denemenizi hemen başlatın."}
                      {currentStep === 1 && "E-posta adresinize gönderilen güvenlik kodunu girin."}
                      {currentStep === 2 && "Restoranınızın panel adını ve iletişim numarasını belirleyin."}
                      {currentStep === 3 && "İşletmenizin ihtiyacına uygun paketi seçin."}
                    </p>
                  </div>

                  {/* Error Alert */}
                  {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200/80 rounded-2xl text-red-700 text-[13px] font-medium flex items-center gap-2">
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Step 0: Register */}
                  {currentStep === 0 && (
                    <form onSubmit={handleRegister} className="flex flex-col gap-4">
                      {/* Google Sign-in */}
                      <a
                        href="/api/auth/google/register/start"
                        className="h-12 bg-white text-black border border-black/15 hover:border-black rounded-full font-medium text-[14px] flex items-center justify-center gap-3 transition-all shadow-xs active:scale-95"
                      >
                        <GoogleIcon />
                        Google ile Hızlı Kayıt Ol
                      </a>

                      <div className="flex items-center gap-3 text-[12px] uppercase tracking-wider text-neutral-400 my-1">
                        <span className="h-px flex-1 bg-black/10" />
                        veya e-posta ile
                        <span className="h-px flex-1 bg-black/10" />
                      </div>

                      <div className="grid grid-cols-2 gap-3.5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[13px] font-medium text-neutral-700">Ad</label>
                          <input
                            required
                            type="text"
                            placeholder="Ahmet"
                            value={regData.firstName}
                            onChange={(e) => setRegData({ ...regData, firstName: e.target.value })}
                            className="h-12 bg-neutral-50 border border-black/15 rounded-xl px-4 text-[14px] focus:outline-none focus:border-black focus:bg-white transition"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[13px] font-medium text-neutral-700">Soyad</label>
                          <input
                            required
                            type="text"
                            placeholder="Yılmaz"
                            value={regData.lastName}
                            onChange={(e) => setRegData({ ...regData, lastName: e.target.value })}
                            className="h-12 bg-neutral-50 border border-black/15 rounded-xl px-4 text-[14px] focus:outline-none focus:border-black focus:bg-white transition"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-neutral-700">E-posta</label>
                        <input
                          required
                          type="email"
                          placeholder="ornek@restoran.com"
                          value={regData.email}
                          onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                          className="h-12 bg-neutral-50 border border-black/15 rounded-xl px-4 text-[14px] focus:outline-none focus:border-black focus:bg-white transition"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-neutral-700">Şifre</label>
                        <input
                          required
                          type="password"
                          placeholder="En az 6 karakter"
                          value={regData.password}
                          onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                          className="h-12 bg-neutral-50 border border-black/15 rounded-xl px-4 text-[14px] focus:outline-none focus:border-black focus:bg-white transition"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="mt-3 h-12 bg-black text-white hover:bg-neutral-800 rounded-full font-medium text-[15px] flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all"
                      >
                        {loading ? "Hesap Oluşturuluyor..." : "Ücretsiz Başlayın"}{" "}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </form>
                  )}

                  {/* Step 1: Verify */}
                  {currentStep === 1 && (
                    <form onSubmit={handleVerify} className="flex flex-col gap-4">
                      {!challengeId && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[13px] font-medium text-neutral-700">Challenge ID</label>
                          <input
                            required
                            type="text"
                            value={verData.customChallengeId}
                            onChange={(e) =>
                              setVerData({ ...verData, customChallengeId: e.target.value })
                            }
                            className="h-12 bg-neutral-50 border border-black/15 rounded-xl px-4 text-[14px] focus:outline-none focus:border-black focus:bg-white transition"
                          />
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-neutral-700">Doğrulama Kodu</label>
                        <input
                          required
                          type="text"
                          maxLength={6}
                          value={verData.verificationCode}
                          onChange={(e) =>
                            setVerData({ ...verData, verificationCode: e.target.value })
                          }
                          className="h-14 bg-neutral-50 border border-black/15 rounded-2xl px-4 text-center tracking-[0.4em] text-2xl font-mono font-bold focus:outline-none focus:border-black focus:bg-white transition"
                          placeholder="123456"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="mt-3 h-12 bg-black text-white hover:bg-neutral-800 rounded-full font-medium text-[15px] flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all"
                      >
                        {loading ? "Doğrulanıyor..." : "Kodu Onayla"}{" "}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </form>
                  )}

                  {/* Step 2: Company */}
                  {currentStep === 2 && (
                    <form onSubmit={handleCompany} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-neutral-700">İşletme Adı</label>
                        <input
                          required
                          type="text"
                          placeholder="Örn: Kadıköy Moda Cafe"
                          value={comData.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            setComData((prev) => ({ ...prev, name, slug: createSlug(name) }));
                          }}
                          className="h-12 bg-neutral-50 border border-black/15 rounded-xl px-4 text-[14px] focus:outline-none focus:border-black focus:bg-white transition"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-neutral-700">
                          Panel Bağlantı Adresi (Slug)
                        </label>
                        <div className="relative">
                          <input
                            required
                            type="text"
                            value={comData.slug}
                            onChange={(e) =>
                              setComData({ ...comData, slug: createSlug(e.target.value) })
                            }
                            className="w-full h-12 bg-neutral-50 border border-black/15 rounded-xl px-4 text-[14px] font-mono focus:outline-none focus:border-black focus:bg-white transition"
                            placeholder="kadikoy-moda-cafe"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-neutral-700">
                          Telefon Numarası
                        </label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          value={comData.phone}
                          onChange={(e) =>
                            setComData({ ...comData, phone: formatPhone(e.target.value) })
                          }
                          className="h-12 bg-neutral-50 border border-black/15 rounded-xl px-4 text-[14px] focus:outline-none focus:border-black focus:bg-white transition"
                          placeholder="05xx xxx xx xx"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="mt-3 h-12 bg-black text-white hover:bg-neutral-800 rounded-full font-medium text-[15px] flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all"
                      >
                        {loading ? "Kaydediliyor..." : "İşletmeyi Oluştur"}{" "}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </form>
                  )}

                  {/* Step 3: Package */}
                  {currentStep === 3 && (
                    <form onSubmit={handlePackage} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-neutral-700">Paket Seçimi</label>
                        <select
                          required
                          value={pkgData.packageId}
                          onChange={(e) => {
                            const nextPackage = packages.find((item: any) => item.id === e.target.value);
                            setPkgData({
                              packageId: e.target.value,
                              billingCycle: nextPackage ? getDefaultBillingCycle(nextPackage) : "Monthly",
                            });
                          }}
                          className="h-12 bg-neutral-50 border border-black/15 rounded-xl px-4 text-[14px] focus:outline-none focus:border-black focus:bg-white transition text-black"
                        >
                          <option value="" disabled>
                            Lütfen bir paket seçin
                          </option>
                          {packages.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                        {packages.length === 0 && (
                          <p className="text-xs text-amber-600">Aktif ve seçilebilir paket bulunamadı.</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-neutral-700">Faturalama Dönemi</label>
                        <select
                          required
                          value={pkgData.billingCycle}
                          onChange={(e) => setPkgData({ ...pkgData, billingCycle: e.target.value })}
                          className="h-12 bg-neutral-50 border border-black/15 rounded-xl px-4 text-[14px] focus:outline-none focus:border-black focus:bg-white transition text-black"
                        >
                          {availableBillingCycles.map((cycle) => (
                            <option key={cycle.value} value={cycle.value}>
                              {cycle.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="mt-3 h-12 bg-black text-white hover:bg-neutral-800 rounded-full font-medium text-[15px] flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all"
                      >
                        {loading ? "Kurulum Tamamlanıyor..." : "Kurulumu Tamamla"}{" "}
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    </form>
                  )}
                </>
              ) : (
                /* Success Step */
                <div className="text-center py-6 flex flex-col items-center">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-5 border border-emerald-100">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-[24px] sm:text-[28px] font-bold text-black tracking-tight mb-2">
                    Tebrikler, Kurulum Tamamlandı!
                  </h2>
                  <p className="text-[14px] sm:text-[15px] text-neutral-600 font-light max-w-[400px] mb-8 leading-relaxed">
                    İşletmeniz ve dijital QR menünüz başarıyla oluşturuldu. Artık ürünlerinizi eklemeye ve menünüzü yayınlamaya başlayabilirsiniz.
                  </p>
                  <a
                    href="https://app.displexa.com/login"
                    className="h-12 px-9 bg-black text-white rounded-full font-medium text-[15px] hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all shadow-lg inline-flex items-center justify-center"
                  >
                    Yönetim Paneline Git
                  </a>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-[12px] sm:text-[13px] text-neutral-500 font-light">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-neutral-700" />
            <span>Kredi kartı gerekmez</span>
          </div>
          <div>•</div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-neutral-700" />
            <span>14 gün ücretsiz deneme</span>
          </div>
          <div>•</div>
          <div>İstediğiniz zaman iptal</div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-xl mx-auto text-center py-2 text-[12px] text-neutral-400 font-light">
        <Link href="/" className="hover:text-black transition">
          ← Morgül Menü Ana Sayfasına Dön
        </Link>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.12h4.01c2.34-2.16 3.68-5.32 3.68-8.74z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.87-3a7.5 7.5 0 0 1-11.45-3.96H.53v3.22A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M4.64 14.13a7.17 7.17 0 0 1 0-4.26V6.65H.53a12 12 0 0 0 0 10.7l4.11-3.22z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44A12 12 0 0 0 .53 6.65l4.11 3.22a7.44 7.44 0 0 1 7.36-5.12z"
      />
    </svg>
  );
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("0") ? digits.slice(1) : digits;
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  const normalized = digits.length > 0 && !digits.startsWith("0") ? `0${digits}`.slice(0, 11) : digits;
  const parts = [
    normalized.slice(0, 4),
    normalized.slice(4, 7),
    normalized.slice(7, 9),
    normalized.slice(9, 11),
  ].filter(Boolean);
  return parts.join(" ");
}

function createSlug(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getAvailableBillingCycles(pkg: any) {
  const cycles = [];
  if (pkg.supportsMonthly) {
    cycles.push({ value: "Monthly", label: `Aylık${formatPrice(pkg.monthlyPrice, pkg.currencyCode)}` });
  }
  if (pkg.supportsYearly) {
    cycles.push({ value: "Yearly", label: `Yıllık${formatPrice(pkg.yearlyPrice, pkg.currencyCode)}` });
  }
  return cycles;
}

function getDefaultBillingCycle(pkg: any) {
  return pkg.supportsMonthly ? "Monthly" : "Yearly";
}

function formatPrice(price?: number | null, currency?: string | null) {
  if (price === null || price === undefined) {
    return "";
  }
  return ` - ${price} ${currency || "TRY"}`;
}
