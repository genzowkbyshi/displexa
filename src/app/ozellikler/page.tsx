"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Palette,
  Smartphone,
  BarChart3,
  Globe2,
  ShieldCheck,
  QrCode,
  Layers,
  HeartHandshake,
  Clock,
  Sliders,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CtaBanner from "@/components/cta-banner";

const FEATURE_PILLARS = [
  {
    tag: "Fiyat & Menü Yönetimi",
    title: "Saniyeler İçinde Menünüzü ve Fiyatlarınızı Güncelleyin",
    description:
      "Girdi maliyetleri değiştikçe yeni menü bastırmak zorunda kalmayın. Yönetim panelinizden saniyeler içinde fiyatı güncelleyin, anında müşterinizin ekranına yansısın. Tükendiğinde ürünleri tek tıkla gizleyin.",
    bulletPoints: [
      "Tek tıkla anlık fiyat güncelleme",
      "Stokta olmayan ürünleri gizleme / pasife alma",
      "Günün menüsü ve özel şef önerileri öne çıkarma",
      "Kategori bazlı kolay sıralama ve düzenleme",
    ],
    image: "/images/og1.png",
    reverse: false,
  },
  {
    tag: "Tasarım & Markalama",
    title: "Restoranınızın Kurumsal Kimliğine Uygun Özel Temalar",
    description:
      "Klasik menü şablonlarının ötesine geçin. İşletmenizin atmosferini yansıtan renk paletleri, logonuz, kapak görseliniz ve Grid veya Liste menü yerleşim düzenleri arasından dilediğinizi seçin.",
    bulletPoints: [
      "Görsel ağırlıklı Grid veya klasik Liste tasarımı",
      "Özel kurumsal renk ve tipografi uyumu",
      "Marka logonuz ve sosyal medya bağlantıları",
      "Açık / Koyu tema ve şık tipografi seçenekleri",
    ],
    image: "/images/og2.png",
    reverse: true,
  },
  {
    tag: "Hız & Performans",
    title: "Kusursuz, Hafif ve Işık Hızında Mobil Deneyim",
    description:
      "Misafirlerinizin herhangi bir uygulama indirmesine veya beklemesine gerek yoktur. Telefon kamerasını QR koda tutmaları yeterlidir; menünüz 1 saniyeden kısa sürede açılır ve akıcı bir şekilde çalışır.",
    bulletPoints: [
      "Uygulama indirme veya üyelik zorunluluğu yok",
      "Tüm iOS ve Android cihazlarla %100 uyumluluk",
      "Zayıf internet bağlantılarında bile anında açılış",
      "Dokunmatik kaydırma ve hızlı arama mekanizması",
    ],
    image: "/images/og3.png",
    reverse: false,
  },
  {
    tag: "İstatistik & Raporlama",
    title: "Veriye Dayalı Menü Yönetimi ile Satışlarınızı Katlayın",
    description:
      "Müşterilerinizin en çok hangi kategorilere baktığını, hangi ürünlerin popüler olduğunu ve menünüzün toplam kaç kez görüntülendiğini detaylı grafiklerle takip edin. Menü mühendisliğinizi verilerle yönetin.",
    bulletPoints: [
      "Ürün bazlı görüntülenme ve ilgi istatistikleri",
      "Saatlik ve günlük ziyaretçi yoğunluk grafikleri",
      "Masa bazlı QR tarama ve etkileşim analizleri",
      "Dönemsel satış ve menü performans raporları",
    ],
    image: "/images/og4.png",
    reverse: true,
  },
  {
    tag: "Çoklu Şube & Masa Yönetimi",
    title: "Her Masaya Özel QR Kod ve Çoklu Şube Desteği",
    description:
      "Her masa için özel QR kodlar oluşturun, yüksek çözünürlüklü baskıya hazır PDF şablonlarını indirin. İster tek bir cafe, ister onlarca şubesi olan bir zincir olun, tüm şubelerinizi tek ekrandan yönetin.",
    bulletPoints: [
      "Masaya özel veya genel mekan QR kodları",
      "Baskıya hazır şık QR stand şablonları (PDF / PNG)",
      "Tek panelden sınırsız şube yönetimi",
      "Yetkilendirme ve personel erişim kontrolü",
    ],
    image: "/images/og5.png",
    reverse: false,
  },
];

const ALL_FEATURES_GRID = [
  {
    icon: <Zap className="w-5 h-5 text-black" />,
    title: "Anında Güncelleme",
    desc: "Fiyat veya içerik değişiklikleri sayfayı yenilemeye dahi gerek kalmadan canlıya geçer.",
  },
  {
    icon: <Palette className="w-5 h-5 text-black" />,
    title: "Görsel Zenginlik",
    desc: "Yüksek çözünürlüklü iştah açıcı fotoğraflarla müşterilerin sipariş kararlarını hızlandırın.",
  },
  {
    icon: <Globe2 className="w-5 h-5 text-black" />,
    title: "Çoklu Dil Desteği",
    desc: "İngilizce, Rusça, Arapça ve 40+ dilde menü desteğiyle turist misafirlerinize kolaylık sağlayın.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-black" />,
    title: "Alerjen & Kalori Uyarıları",
    desc: "Gluten, laktoz, fındık gibi alerjen etiketleri ve kalori bilgisiyle misafirlerinize güven verin.",
  },
  {
    icon: <QrCode className="w-5 h-5 text-black" />,
    title: "Özelleştirilebilir QR Kodlar",
    desc: "Logolu, renkli ve şık QR tasarımlarıyla masalarınızda kurumsal bir görünüm sağlayın.",
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-black" />,
    title: "Gelişmiş Analitik",
    desc: "Hangi saatlerde hangi ürünlerin daha çok incelendiğini raporlayarak stoklarınızı optimize edin.",
  },
  {
    icon: <Smartphone className="w-5 h-5 text-black" />,
    title: "Mobil Yönetim Uygulaması",
    desc: "Yönetici paneline hem bilgisayardan hem telefonunuzdan dilediğiniz an erişebilirsiniz.",
  },
  {
    icon: <Layers className="w-5 h-5 text-black" />,
    title: "Günün Menüsü & Kampanyalar",
    desc: "Özel indirimler, günün çorbası veya şefin spesiyallerini menünün en üstünde öne çıkarın.",
  },
  {
    icon: <HeartHandshake className="w-5 h-5 text-black" />,
    title: "Hijyenik ve Temassız",
    desc: "Yıpranan menü kağıtları yerine misafirlerin kendi telefonlarıyla güvenle sipariş vermesini sağlayın.",
  },
  {
    icon: <Sliders className="w-5 h-5 text-black" />,
    title: "Sınırsız Kategori & Ürün",
    desc: "İçecekler, ana yemekler, tatlılar ve yan ürünleri dilediğiniz derinlikte gruplandırın.",
  },
  {
    icon: <Clock className="w-5 h-5 text-black" />,
    title: "Sıfır Baskı Bekleme Süresi",
    desc: "Matbaa baskı süreçlerini, hatalı basımları ve haftalar süren beklemeleri tamamen unutun.",
  },
  {
    icon: <Sparkles className="w-5 h-5 text-black" />,
    title: "Google SEO Uyumlu Menü",
    desc: "Menünüz arama motorlarında da indekslenir, bölgenizdeki potansiyel müşterilerin dikkatini çeker.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <Navbar variant="sticky" />

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-16 pb-6 sm:pb-8 bg-gradient-to-b from-[#FAFBFD] via-[#F4F6F9] to-white border-b border-black/[0.04]">
        <div className="max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.05] border border-black/[0.08] text-[13px] font-medium text-neutral-800 mb-6"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Tüm Özellikler ve Yetenekler</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[36px] sm:text-[46px] lg:text-[56px] font-bold text-black tracking-tight leading-[1.12] max-w-[860px] mx-auto"
          >
            Restoranınızı Büyütecek
            <br />
            <span className="font-playfair italic font-medium">Yeni Nesil Dijital Menü</span> Özellikleri
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-[16px] sm:text-[18px] lg:text-[20px] font-light text-neutral-600 max-w-[680px] mx-auto leading-relaxed"
          >
            Morgül Menü ile menü baskı maliyetlerini sıfırlayın, fiyatlarınızı tek tıkla güncelleyin ve misafirlerinize kusursuz bir deneyim sunun.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/onboarding"
              className="h-[46px] px-8 rounded-full bg-black text-white text-[15px] font-medium hover:bg-neutral-800 transition hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-md"
            >
              <span>Ücretsiz Deneyin</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/fiyatlandirma"
              className="h-[46px] px-8 rounded-full bg-white text-black text-[15px] font-medium border border-neutral-300 hover:border-black transition hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              Fiyatlandırmayı İnceleyin
            </Link>
          </motion.div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-black/[0.06] max-w-[1000px] mx-auto text-left sm:text-center">
            <div>
              <div className="text-[28px] sm:text-[36px] font-bold text-black">&lt; 1 sn</div>
              <div className="text-[13px] text-neutral-500 font-light">Menü Açılış Hızı</div>
            </div>
            <div>
              <div className="text-[28px] sm:text-[36px] font-bold text-black">%0</div>
              <div className="text-[13px] text-neutral-500 font-light">Baskı & Kağıt Masrafı</div>
            </div>
            <div>
              <div className="text-[28px] sm:text-[36px] font-bold text-black">40+</div>
              <div className="text-[13px] text-neutral-500 font-light">Otomatik Dil Desteği</div>
            </div>
            <div>
              <div className="text-[28px] sm:text-[36px] font-bold text-black">%100</div>
              <div className="text-[13px] text-neutral-500 font-light">Tüm Cihazlarla Uyum</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars (Alternating Showcases) */}
      <section className="pt-8 sm:pt-10 lg:pt-14 pb-16 lg:pb-24 max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6 space-y-20 lg:space-y-28">
        {FEATURE_PILLARS.map((pillar, idx) => (
          <div
            key={pillar.title}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
              pillar.reverse ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Left Content */}
            <div
              className={`lg:col-span-6 ${
                pillar.reverse ? "lg:order-2" : "lg:order-1"
              }`}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-neutral-100 text-[12px] font-semibold text-neutral-700 tracking-wider uppercase mb-3">
                {pillar.tag}
              </span>
              <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-bold text-black tracking-tight leading-[1.2] mb-4">
                {pillar.title}
              </h2>
              <p className="text-[15px] sm:text-[17px] font-light text-neutral-600 leading-relaxed mb-6">
                {pillar.description}
              </p>
              <ul className="space-y-3">
                {pillar.bulletPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-[14px] sm:text-[15px] text-neutral-800">
                    <CheckCircle2 className="w-5 h-5 text-black shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Graphic Mockup */}
            <div
              className={`lg:col-span-6 flex items-center justify-center ${
                pillar.reverse ? "lg:order-1" : "lg:order-2"
              }`}
            >
              <div className="w-full bg-[#f8f9fa] rounded-[32px] p-6 sm:p-8 border border-black/[0.05] shadow-sm hover:shadow-md transition">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="w-full h-auto max-h-[380px] sm:max-h-[440px] object-contain drop-shadow-lg mx-auto"
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* All Features Grid (12 Cards) */}
      <section className="py-16 lg:py-20 bg-[#FBFBFC] border-y border-black/[0.05]">
        <div className="max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-[720px] mx-auto mb-14">
            <h2 className="text-[30px] sm:text-[38px] font-bold text-black tracking-tight">
              İşletmeniz İçin Tasarlanan Tüm Fonksiyonlar
            </h2>
            <p className="mt-3 text-[16px] text-neutral-600 font-light">
              Küçük bir kahveciden yüzlerce masalı restoranlara kadar her ölçekteki işletmenin ihtiyaçlarını karşılayacak güçlü altyapı.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_FEATURES_GRID.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-[24px] p-7 border border-black/[0.06] hover:border-black/20 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-black/[0.05] flex items-center justify-center mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-[18px] font-semibold text-black tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-neutral-600 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <CtaBanner
        title="Tüm Özellikleri 14 Gün Boyunca Ücretsiz Deneyin"
        description="Kredi kartı bilgisi gerekmeden hemen başlayın. Menünüzü oluşturup dakikalar içinde masalarınıza yerleştirin."
      />

      <Footer />
    </div>
  );
}
