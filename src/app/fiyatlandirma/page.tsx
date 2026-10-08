"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, X, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CtaBanner from "@/components/cta-banner";

const PLANS = [
  {
    id: "free",
    name: "Ücretsiz Deneme",
    popular: false,
    description: "Temel özellikleri keşfetmek ve dijital menüyü denemek isteyen işletmeler için.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    buttonText: "Ücretsiz Başla",
    href: "/onboarding",
    features: [
      "25 ürüne kadar ekleme",
      "1 adet şube desteği",
      "Standart QR kod çıktısı",
      "Temel liste menü şablonu",
      "Mobil uyumlu arayüz",
      "Topluluk ve e-posta desteği",
    ],
  },
  {
    id: "classic",
    name: "Klasik Üyelik",
    popular: false,
    description: "İşletmesini profesyonelce dijitalleştirmek isteyen cafe ve restoranlar için ideal.",
    monthlyPrice: 49,
    yearlyPrice: 39,
    buttonText: "Klasik Paketi Seç",
    href: "/onboarding?plan=classic",
    features: [
      "Sınırsız ürün ve kategori",
      "Özel tema ve renk seçenekleri",
      "Masa bazlı dinamik QR kodlar",
      "Baskıya hazır PDF şablonları",
      "Alerjen ve kalori uyarıları",
      "Temel ziyaretçi istatistikleri",
      "Standart e-posta ve canlı destek",
    ],
  },
  {
    id: "pro",
    name: "Pro Üyelik",
    popular: true,
    description: "Kapsamlı raporlama, çoklu dil ve tam marka özelleştirmesi arayan işletmeler için.",
    monthlyPrice: 99,
    yearlyPrice: 79,
    buttonText: "Pro Pakete Geç",
    href: "/onboarding?plan=pro",
    features: [
      "Sınırsız ürün, kategori ve şube",
      "Tüm gelişmiş temalar & Grid düzeni",
      "40+ dilde otomatik menü çevirisi",
      "Gelişmiş analitik & ziyaretçi raporları",
      "Logo ve kurumsal kimlik entegrasyonu",
      "Günün menüsü ve özel promosyonlar",
      "7/24 Öncelikli WhatsApp ve telefon desteği",
    ],
  },
];

const COMPARISON_ROWS = [
  {
    category: "Menü & İçerik Yönetimi",
    features: [
      { name: "Ürün Ekleme Kapasitesi", free: "25 Adet", classic: "Sınırsız", pro: "Sınırsız" },
      { name: "Kategori Sayısı", free: "5 Kategori", classic: "Sınırsız", pro: "Sınırsız" },
      { name: "Yüksek Kalite Ürün Fotoğrafları", free: true, classic: true, pro: true },
      { name: "Anlık Fiyat & Stok Güncelleme", free: true, classic: true, pro: true },
      { name: "Alerjen & Kalori Etiketleri", free: false, classic: true, pro: true },
      { name: "Günün Menüsü & Şef Önerileri", free: false, classic: false, pro: true },
    ],
  },
  {
    category: "Tasarım & QR Kod",
    features: [
      { name: "Mobil Uyumlu Hızlı Arayüz", free: true, classic: true, pro: true },
      { name: "Özelleştirilebilir Renk & Temalar", free: false, classic: true, pro: true },
      { name: "Logo & Kurumsal Markalama", free: false, classic: true, pro: true },
      { name: "Masa Başı Ayrı QR Kodlar", free: false, classic: true, pro: true },
      { name: "Baskıya Hazır Stand Şablonları (PDF)", free: false, classic: true, pro: true },
      { name: "Özel QR Tasarım Çerçeveleri", free: false, classic: false, pro: true },
    ],
  },
  {
    category: "Gelişmiş Fonksiyonlar & Destek",
    features: [
      { name: "Çoklu Dil Desteği (Turistik Mod)", free: false, classic: false, pro: true },
      { name: "Ziyaretçi & Ürün İstatistikleri", free: false, classic: "Temel", pro: "Detaylı Raporlar" },
      { name: "Çoklu Şube Yönetimi", free: false, classic: false, pro: true },
      { name: "Destek Seviyesi", free: "E-Posta", classic: "Hızlı E-Posta", pro: "7/24 VIP WhatsApp" },
    ],
  },
];

const PRICING_FAQS = [
  {
    q: "Herhangi bir sözleşme veya taahhüt var mı?",
    a: "Hayır. Hiçbir taahhüt veya sözleşme bulunmaz. Dilediğiniz an üyeliğinizi iptal edebilir ya da dilediğiniz zaman paketinizi yükseltebilirsiniz.",
  },
  {
    q: "Ücretsiz deneme süresi bittiğinde otomatik ücret çekilir mi?",
    a: "Kesinlikle hayır. Kayıt olurken kredi kartı bilgisi talep etmiyoruz. Deneme süreniz dolduğunda siz onay vermediğiniz sürece hiçbir ücret yansıtılmaz.",
  },
  {
    q: "Yıllık ödemede nasıl bir indirim uygulanır?",
    a: "Yıllık faturalandırmayı tercih ettiğinizde 2 ay bedava kazanırsınız (yaklaşık %20 net tasarruf sağlarsınız).",
  },
  {
    q: "Birden fazla restoranım / şubem var, nasıl faturalandırılır?",
    a: "Çoklu şubeleriniz için Pro paket kapsamında avantajlı toplu fiyatlandırma sunuyoruz. Özel teklif için bizimle iletişime geçebilirsiniz.",
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <Navbar variant="sticky" />

      {/* Hero Section */}
      <section className="pt-16 sm:pt-20 pb-12 sm:pb-16 bg-gradient-to-b from-[#FAFBFD] via-[#F4F6F9] to-white border-b border-black/[0.04] text-center">
        <div className="max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.05] border border-black/[0.08] text-[13px] font-medium text-neutral-800 mb-6"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Şeffaf & Sürprizsiz Fiyatlar</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[36px] sm:text-[46px] lg:text-[56px] font-bold text-black tracking-tight leading-[1.14] max-w-[800px] mx-auto"
          >
            İşletmenizin Ölçeğine Uygun
            <br />
            <span className="font-playfair italic font-medium">Esnek Fiyatlandırma</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-[16px] sm:text-[18px] lg:text-[20px] font-light text-neutral-600 max-w-[620px] mx-auto leading-relaxed"
          >
            Gizli maliyet yok. Taahhüt yok. İstediğiniz paketi seçin, restoranınızı anında dijitalleştirin.
          </motion.p>

          {/* Billing Switcher */}
          <div className="mt-10 inline-flex items-center p-1.5 rounded-full bg-neutral-100 border border-black/[0.06]">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-full text-[14px] font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-black shadow-sm"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              Aylık Ödeme
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-full text-[14px] font-medium transition-all flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-black text-white shadow-sm"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              <span>Yıllık Ödeme</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                billingCycle === "yearly" ? "bg-white/20 text-white" : "bg-black text-white"
              }`}>
                %20 İndirim
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-14 lg:py-20 max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => {
            const price = billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.id}
                className={`rounded-[32px] p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.popular
                    ? "bg-black text-white shadow-2xl scale-[1.02] border border-black"
                    : "bg-[#FAFAFB] text-black border border-black/[0.08] hover:border-black/20 hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white text-black text-[12px] font-bold uppercase tracking-wider shadow-md">
                    En Çok Tercih Edilen
                  </div>
                )}

                <div>
                  <h3 className="text-[22px] font-bold tracking-tight mb-2">
                    {plan.name}
                  </h3>
                  <p className={`text-[13px] font-light leading-relaxed mb-6 min-h-[40px] ${
                    plan.popular ? "text-neutral-300" : "text-neutral-600"
                  }`}>
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-8 pb-6 border-b border-black/[0.08]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-[44px] font-extrabold tracking-tight">
                        {price} ₺
                      </span>
                      <span className={`text-[14px] font-light ${
                        plan.popular ? "text-neutral-400" : "text-neutral-500"
                      }`}>
                        / ay
                      </span>
                    </div>
                    {billingCycle === "yearly" && price > 0 && (
                      <p className={`text-[12px] font-light mt-1 ${
                        plan.popular ? "text-neutral-400" : "text-neutral-500"
                      }`}>
                        Yıllık peşin faturalandırılır (2 ay ücretsiz)
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-[14px]">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                          plan.popular ? "text-white" : "text-black"
                        }`} />
                        <span className={plan.popular ? "text-neutral-200" : "text-neutral-700"}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.href}
                  className={`w-full h-12 rounded-full text-[15px] font-medium transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center text-center ${
                    plan.popular
                      ? "bg-white text-black hover:bg-neutral-100 shadow-lg"
                      : "bg-black text-white hover:bg-neutral-800"
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-14 lg:py-20 bg-[#FAFBFD] border-y border-black/[0.06]">
        <div className="max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-[680px] mx-auto mb-14">
            <h2 className="text-[28px] sm:text-[36px] font-bold text-black tracking-tight">
              Detaylı Paket Karşılaştırması
            </h2>
            <p className="mt-2 text-[15px] sm:text-[16px] text-neutral-600 font-light">
              Tüm planların sunduğu özellikleri yan yana inceleyin, işletmenize en uygun olanı seçin.
            </p>
          </div>

          <div className="bg-white rounded-[28px] border border-black/[0.08] overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-12 p-6 border-b border-black/[0.08] bg-neutral-50/70 font-semibold text-[15px] text-black items-center">
              <div className="col-span-6 sm:col-span-5 text-neutral-600">Özellik</div>
              <div className="col-span-2 sm:col-span-2 text-center text-neutral-800">Ücretsiz</div>
              <div className="col-span-2 sm:col-span-2 text-center text-neutral-800">Klasik</div>
              <div className="col-span-2 sm:col-span-3 text-center text-black font-bold">Pro (Popüler)</div>
            </div>

            {/* Table Categories & Rows */}
            {COMPARISON_ROWS.map((group) => (
              <div key={group.category} className="border-b border-black/[0.06] last:border-b-0">
                <div className="px-6 py-3 bg-neutral-100/60 text-[13px] font-bold uppercase tracking-wider text-neutral-700">
                  {group.category}
                </div>
                {group.features.map((row) => (
                  <div
                    key={row.name}
                    className="grid grid-cols-12 px-6 py-4 border-b border-black/[0.04] last:border-b-0 items-center text-[14px] hover:bg-neutral-50/50 transition"
                  >
                    <div className="col-span-6 sm:col-span-5 text-neutral-900 font-medium">
                      {row.name}
                    </div>

                    <div className="col-span-2 sm:col-span-2 text-center flex justify-center text-neutral-700">
                      {typeof row.free === "boolean" ? (
                        row.free ? (
                          <Check className="w-5 h-5 text-black" />
                        ) : (
                          <X className="w-4 h-4 text-neutral-300" />
                        )
                      ) : (
                        <span className="text-[13px]">{row.free}</span>
                      )}
                    </div>

                    <div className="col-span-2 sm:col-span-2 text-center flex justify-center text-neutral-700">
                      {typeof row.classic === "boolean" ? (
                        row.classic ? (
                          <Check className="w-5 h-5 text-black" />
                        ) : (
                          <X className="w-4 h-4 text-neutral-300" />
                        )
                      ) : (
                        <span className="text-[13px] font-medium">{row.classic}</span>
                      )}
                    </div>

                    <div className="col-span-2 sm:col-span-3 text-center flex justify-center text-black font-semibold">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? (
                          <Check className="w-5 h-5 text-black" />
                        ) : (
                          <X className="w-4 h-4 text-neutral-300" />
                        )
                      ) : (
                        <span className="text-[13px] font-bold">{row.pro}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing FAQs */}
      <section className="py-16 lg:py-24 max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6">
        <div className="text-center max-w-[640px] mx-auto mb-12">
          <h2 className="text-[28px] sm:text-[34px] font-bold text-black tracking-tight">
            Fiyatlandırma ile İlgili Sıkça Sorulan Sorular
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1000px] mx-auto">
          {PRICING_FAQS.map((faq) => (
            <div
              key={faq.q}
              className="p-6 sm:p-7 rounded-[24px] bg-[#FAFAFB] border border-black/[0.06]"
            >
              <h3 className="text-[16px] sm:text-[17px] font-semibold text-black mb-2.5">
                {faq.q}
              </h3>
              <p className="text-[14px] text-neutral-600 font-light leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <CtaBanner
        title="14 Günlük Ücretsiz Denemenizi Hemen Başlatın"
        description="Kredi kartı gerekmez. Dakikalar içinde menünüzü oluşturup misafirlerinize sunmaya başlayın."
      />

      <Footer />
    </div>
  );
}
