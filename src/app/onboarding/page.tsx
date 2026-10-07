"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Building, Package, ChevronRight, User } from "lucide-react";
import {
  onboardingSession,
  onboardingRegister,
  onboardingVerify,
  onboardingCompany,
  getOnboardingPackages,
  onboardingPackage
} from "@/services/onboarding.service";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [packages, setPackages] = useState<any[]>([]);

  // State for forms
  const [regData, setRegData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [verData, setVerData] = useState({ verificationCode: "", customChallengeId: "" });
  const [comData, setComData] = useState({ name: "", slug: "", phone: "" });
  const [pkgData, setPkgData] = useState({ packageId: "", billingCycle: "Monthly" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("googleRegistered")) {
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
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const googleRegistered = params.get("googleRegistered");
    const googleError = params.get("googleError");

    if (googleRegistered) {
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
        failed: "Google ile kayıt tamamlanamadı."
      };

      setErrorMsg(messages[googleError] || "Google ile kayıt tamamlanamadı.");
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

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
        verificationCode: verData.verificationCode
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
        const selectablePackages = pkgRes.items.filter((item: any) => item.supportsMonthly || item.supportsYearly);
        setPackages(selectablePackages);
        const firstPackage = selectablePackages[0];
        if (firstPackage) {
          setPkgData({
            packageId: firstPackage.id,
            billingCycle: getDefaultBillingCycle(firstPackage)
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
      setCurrentStep(4); // Success Step
    } catch (error: any) {
      setErrorMsg(error.title || error.message || "Paket seçimi sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Hesap", icon: User },
    { title: "Doğrulama", icon: CheckCircle2 },
    { title: "İşletme", icon: Building },
    { title: "Paket", icon: Package }
  ];

  const selectedPackage = packages.find((item: any) => item.id === pkgData.packageId);
  const availableBillingCycles = selectedPackage ? getAvailableBillingCycles(selectedPackage) : [];

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md shadow-2xl"
        >
          {currentStep < 4 ? (
            <>
              {/* Stepper Header */}
              <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2 -z-10" />
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = currentStep === idx;
                  const isPast = currentStep > idx;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isActive ? 'bg-orange-500 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)]' :
                        isPast ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' :
                        'bg-black border-white/10 text-gray-500'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {errorMsg}
                </div>
              )}

              {/* Step 0: Register */}
              {currentStep === 0 && (
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-400">Ad</label>
                      <input required type="text" value={regData.firstName} onChange={e => setRegData({...regData, firstName: e.target.value})} className="h-12 bg-black/50 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-orange-500 transition-colors" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-400">Soyad</label>
                      <input required type="text" value={regData.lastName} onChange={e => setRegData({...regData, lastName: e.target.value})} className="h-12 bg-black/50 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-orange-500 transition-colors" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-gray-400">E-posta</label>
                    <input required type="email" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} className="h-12 bg-black/50 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-orange-500 transition-colors" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-gray-400">Şifre</label>
                    <input required type="password" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} className="h-12 bg-black/50 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-orange-500 transition-colors" />
                  </div>
                  <a href="/api/auth/google/register/start" className="h-12 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all">
                    <GoogleIcon />
                    Google ile kayıt ol
                  </a>
                  <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-gray-500">
                    <span className="h-px flex-1 bg-white/10" />
                    veya
                    <span className="h-px flex-1 bg-white/10" />
                  </div>
                  <button type="submit" disabled={loading} className="mt-4 h-12 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all">
                    {loading ? 'İşleniyor...' : 'Hesabı Oluştur'} <ChevronRight className="w-5 h-5" />
                  </button>
                </form>
              )}

              {/* Step 1: Verify */}
              {currentStep === 1 && (
                <form onSubmit={handleVerify} className="flex flex-col gap-4">
                  <p className="text-sm text-gray-400 mb-2">E-posta adresinize (veya loglara) gönderilen doğrulama kodunu girin.</p>
                  
                  {!challengeId && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm text-gray-400">Challenge ID</label>
                      <input required type="text" value={verData.customChallengeId} onChange={e => setVerData({...verData, customChallengeId: e.target.value})} className="h-12 bg-black/50 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-orange-500 transition-colors" />
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-gray-400">Doğrulama Kodu</label>
                    <input required type="text" value={verData.verificationCode} onChange={e => setVerData({...verData, verificationCode: e.target.value})} className="h-12 bg-black/50 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-orange-500 transition-colors text-center tracking-widest text-lg font-mono" placeholder="123456" />
                  </div>

                  <button type="submit" disabled={loading} className="mt-4 h-12 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all">
                    {loading ? 'Doğrulanıyor...' : 'Doğrula'} <ChevronRight className="w-5 h-5" />
                  </button>
                </form>
              )}

              {/* Step 2: Company */}
              {currentStep === 2 && (
                <form onSubmit={handleCompany} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-gray-400">İşletme Adı</label>
                    <input
                      required
                      type="text"
                      value={comData.name}
                      onChange={e => {
                        const name = e.target.value;
                        setComData(prev => ({ ...prev, name, slug: createSlug(name) }));
                      }}
                      className="h-12 bg-black/50 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-gray-400">Panel Adresi</label>
                    <input
                      required
                      type="text"
                      value={comData.slug}
                      onChange={e => setComData({...comData, slug: createSlug(e.target.value)})}
                      className="h-12 bg-black/50 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="ornek-cafe"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-gray-400">Telefon</label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={comData.phone}
                      onChange={e => setComData({...comData, phone: formatPhone(e.target.value)})}
                      className="h-12 bg-black/50 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="05xx xxx xx xx"
                    />
                  </div>
                  
                  <button type="submit" disabled={loading} className="mt-4 h-12 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all">
                    {loading ? 'İşleniyor...' : 'İşletmeyi Oluştur'} <ChevronRight className="w-5 h-5" />
                  </button>
                </form>
              )}

              {/* Step 3: Package */}
              {currentStep === 3 && (
                <form onSubmit={handlePackage} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-gray-400">Paket Seçimi</label>
                    <select
                      required
                      value={pkgData.packageId}
                      onChange={e => {
                        const nextPackage = packages.find((item: any) => item.id === e.target.value);
                        setPkgData({
                          packageId: e.target.value,
                          billingCycle: nextPackage ? getDefaultBillingCycle(nextPackage) : "Monthly"
                        });
                      }}
                      className="h-12 bg-black/50 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-orange-500 transition-colors text-white appearance-none"
                    >
                      <option value="" disabled>Lütfen bir paket seçin</option>
                      {packages.map(p => (
                        <option key={p.id} value={p.id} className="bg-gray-900">
                          {p.name}
                        </option>
                      ))}
                    </select>
                    {packages.length === 0 && (
                      <p className="text-xs text-amber-300">Aktif ve seçilebilir paket bulunamadı.</p>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm text-gray-400">Faturalama</label>
                    <select
                      required
                      value={pkgData.billingCycle}
                      onChange={e => setPkgData({...pkgData, billingCycle: e.target.value})}
                      className="h-12 bg-black/50 border border-white/10 rounded-xl px-4 focus:outline-none focus:border-orange-500 transition-colors text-white appearance-none"
                    >
                      {availableBillingCycles.map(cycle => (
                        <option key={cycle.value} value={cycle.value} className="bg-gray-900">
                          {cycle.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" disabled={loading} className="mt-4 h-12 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all">
                    {loading ? 'İşleniyor...' : 'Kurulumu Tamamla'} <CheckCircle2 className="w-5 h-5" />
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="text-center py-8 flex flex-col items-center">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Kurulum Tamamlandı!</h2>
              <p className="text-gray-400 mb-8">İşletmeniz başarıyla oluşturuldu. Yönetim paneline giriş yapabilirsiniz.</p>
              <a href="https://app.displexa.com/login" className="h-12 px-8 bg-white text-black rounded-full font-bold flex items-center justify-center hover:bg-gray-100 transition-colors inline-flex">
                Panele Git
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.12h4.01c2.34-2.16 3.68-5.32 3.68-8.74z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.87-3a7.5 7.5 0 0 1-11.45-3.96H.53v3.22A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M4.64 14.13a7.17 7.17 0 0 1 0-4.26V6.65H.53a12 12 0 0 0 0 10.7l4.11-3.22z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44A12 12 0 0 0 .53 6.65l4.11 3.22a7.44 7.44 0 0 1 7.36-5.12z" />
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
    normalized.slice(9, 11)
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
