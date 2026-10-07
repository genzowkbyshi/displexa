"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { Plus, X, ChevronUp, ChevronDown } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    title: "Anında Güncelleme",
    description:
      "Fiyat değiştirmek için yeni menü bastırmaya son. Panelden fiyatı güncelleyin, anında müşterinin ekranına yansısın.",
    image: "/images/og1.png",
  },
  {
    id: 2,
    title: "Özelleştirilebilir Temalar",
    description:
      "İşletmenizin kurumsal kimliğine uygun renkler, logolar ve menü yerleşim planları (Grid, Liste) seçin.",
    image: "/images/og2.png",
  },
  {
    id: 3,
    title: "Kusursuz Mobil Deneyim",
    description:
      "Menünüz tüm telefonlarda, tabletlerde saniyeler içinde yüklenir ve uygulama hızında çalışır.",
    image: "/images/og3.png",
  },
  {
    id: 4,
    title: "Gelişmiş İstatistikler",
    description:
      "Menünüzün kaç kez görüntülendiğini, en çok hangi ürünün incelendiğini raporlayın.",
    image: "/images/og4.png",
  },
  {
    id: 5,
    title: "Uygulama Desteği",
    description:
      "Menünüzü ister web ister android ve ios uygulamasından kolayca yönetebilirsiniz.",
    image: "/images/og5.png",
  },
];

const PRICING_PLANS = [
  {
    id: "free",
    name: "Ücretsiz Deneme",
    description: "Temel özellikleri denemek isteyen işletmeler için.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      "Sınırsız ürün ekleme",
      "Temel menü tasarımları",
      "QR menü önizleme",
      "Paneli keşfetme",
    ],
    buttonText: "Ücretsiz Deneyin",
    href: "/onboarding",
  },
  {
    id: "classic",
    name: "Klasik Üyelik",
    description: "İşletmesini dijitalleştirmek isteyen restoran ve cafeler için.",
    monthlyPrice: 49,
    yearlyPrice: 39,
    features: [
      "Sınırsız ürün ekleme",
      "Temel menü tasarımları",
      "QR menü önizleme",
      "Paneli keşfetme",
    ],
    buttonText: "Klasik Seçim",
    href: "/onboarding?plan=classic",
  },
  {
    id: "pro",
    name: "Pro Üyelik",
    description: "Daha kapsamlı özelleştirme ve raporlama isteyen işletmeler için.",
    monthlyPrice: 99,
    yearlyPrice: 79,
    features: [
      "Sınırsız ürün ekleme",
      "Temel menü tasarımları",
      "QR menü önizleme",
      "Paneli keşfetme",
    ],
    buttonText: "Pro Seçim",
    href: "/onboarding?plan=pro",
  },
];

const FAQ_ITEMS = [
  {
    id: 1,
    question: "Üye olmak ücretli mi?",
    answer: "Hayır, temel özelliklerimizi denemek ve dijital menünüzü hemen oluşturmak için hiçbir ücret ödemeden kayıt olabilirsiniz.",
  },
  {
    id: 2,
    question: "Romayı kim yaktı?",
    answer: "Tarihsel kaynaklara göre MS 64 yılındaki Büyük Roma Yangını sırasında İmparator Neron şehri yakmamıştır. Ancak Morgül Menü'deki lezzetler misafirlerinizin damağını yakacak kadar iddialıdır!",
  },
  {
    id: 3,
    question: "Ferhat ile Şirin hikayesinin geçtiği ilimiz hangisidir?",
    answer: "Amasya'dır. Dağları delen sevda gibi, siz de işletmenizle müşterileriniz arasındaki engelleri modern dijital QR menü ile kaldırabilirsiniz.",
  },
  {
    id: 4,
    question: "Üye olurken kredi kartı gerekli mi?",
    answer: "Kesinlikle hayır. Kredi kartı bilgisi vermeden hemen ücretsiz hesabınızı oluşturup menünüzü anında yayına alabilirsiniz.",
  },
  {
    id: 5,
    question: "Fenerbahçe en son hangi sezon şampiyon oldu?",
    answer: "Fenerbahçe en son 2013-2014 sezonunda Süper Lig şampiyonu olmuştur. Morgül Menü ile işletmenizin şampiyonluğu ise her zaman garantidir!",
  },
];

export default function LandingPage() {
  const panelUrl = "https://app.displexa.com";
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [activeModalFaq, setActiveModalFaq] = useState<typeof FAQ_ITEMS[0] | null>(null);

  // Scroll-driven scaling animation for the black feature slider card
  const sliderSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sliderSectionRef,
    // Kart ekranın altına girdiğinde başlar, kartın üstü ekranın ortasına gelene kadar hızlıca tam boyuta (1.0) ulaşır
    offset: ["start end", "start center"],
  });

  const rawScale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.75, 0.95, 1]);

  const smoothScale = useSpring(rawScale, {
    stiffness: 320,
    damping: 26,
    mass: 0.3,
  });
  const smoothOpacity = useSpring(rawOpacity, {
    stiffness: 320,
    damping: 26,
    mass: 0.3,
  });

  // Auto-play feature slider every 5 seconds unless hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Close FAQ modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModalFaq(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-x-hidden">
      
      {/* 1. Header / Navbar (Geniş Alan: 1720px) */}
      <header className="absolute top-0 inset-x-0 z-50">
        <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/images/logo.png"
              alt="MorgülMenü"
              className="h-[24px] sm:h-[28px] w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-[14px] sm:text-[15px] font-normal text-black">
            <a href="#ozellikler" className="hover:opacity-70 transition-opacity">
              Özellikler
            </a>
            <a href="#nasil-calisir" className="hover:opacity-70 transition-opacity">
              Nasıl Çalışır?
            </a>
            <a href="#fiyatlar" className="hover:opacity-70 transition-opacity">
              Fiyatlandırma
            </a>
            <a href="#sss" className="hover:opacity-70 transition-opacity">
              Sıkça Sorulan Sorular
            </a>
          </nav>

          {/* Header Action Button */}
          <div className="flex items-center">
            <a
              href={`${panelUrl}/giris`}
              className="h-[36px] sm:h-[38px] px-5 sm:px-6 rounded-full bg-white/70 hover:bg-white text-black text-[13px] sm:text-[14px] font-medium border border-black/10 hover:border-black/20 transition-all active:scale-95 flex items-center justify-center backdrop-blur-md"
            >
              Ücretsiz Başla
            </a>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[660px] 2xl:min-h-[820px] flex items-center overflow-hidden bg-[#fafafa]">
        {/* Background Banner Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/banner.png"
            alt="Morgül Menü Banner"
            fill
            priority
            className="object-cover object-right md:object-center pointer-events-none"
          />
          {/* Mobile subtle gradient overlay to ensure text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent md:from-white/50 md:via-white/10 md:to-transparent pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="container max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-20 lg:pt-24 pb-12 relative z-10">
          <div className="max-w-[460px] lg:max-w-[520px]">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[34px] sm:text-[42px] lg:text-[50px] 2xl:text-[60px] font-bold text-black leading-[1.14] tracking-tight"
            >
              Menünüzü
              <br />
              <span className="font-bold">Dijitale Taşıyın,</span>
              <br />
              <span className="font-playfair italic font-bold text-[26px] sm:text-[32px] lg:text-[38px] 2xl:text-[44px] text-black block mt-1 tracking-tight leading-[1.2]">
                işletmenizi büyütün.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] lg:text-[19px] 2xl:text-[22px] font-light text-black leading-[1.45] max-w-[460px]"
            >
              Saniyeler içinde kayıt olun. Ürünlerinizi ekleyin, fiyatlarınızı anında güncelleyin. Modern ve hızlı QR menü ile işletmenize değer katın.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3.5"
            >
              <Link
                href="/onboarding"
                className="w-full sm:w-auto h-[44px] sm:h-[46px] px-7 rounded-full bg-black text-white text-[15px] sm:text-[16px] font-medium border border-[#D2D2D2] hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95 hover:shadow-md flex items-center justify-center text-center"
              >
                Ücretsiz Deneyin
              </Link>
              <a
                href="#ozellikler"
                className="w-full sm:w-auto h-[44px] sm:h-[46px] px-7 rounded-full bg-white text-black text-[15px] sm:text-[16px] font-medium border border-[#D2D2D2] hover:border-black transition-all hover:scale-105 active:scale-95 hover:shadow-sm flex items-center justify-center text-center"
              >
                Özellikleri Keşfedin
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Transition Headline (Standart Dikey Ritim: pt-14 lg:pt-16 pb-6 lg:pb-8) */}
      <section className="pt-14 lg:pt-16 pb-6 lg:pb-8 px-6 sm:px-10 lg:px-14 xl:px-16 max-w-[1720px] mx-auto">
        <div className="pl-2 sm:pl-4 lg:pl-10 xl:pl-14 2xl:pl-20 max-w-[960px] text-left">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[22px] sm:text-[26px] lg:text-[32px] 2xl:text-[38px] font-medium text-black leading-[1.28] tracking-tight text-left"
          >
            Saniyeler içinde kayıt olun. Ürünlerinizi ekleyin,
            <br className="hidden sm:inline" /> fiyatlarınızı anında güncelleyin. Modern ve hızlı
            <br className="hidden sm:inline" /> QR menü ile restoranınıza değer katın.
          </motion.h2>
        </div>
      </section>

      {/* 4. Siyah Özellik Slider Kartı (Scroll Zoom In / Out Efekti) */}
      <section 
        id="ozellikler" 
        ref={sliderSectionRef}
        className="pb-14 lg:pb-18 px-6 sm:px-10 lg:px-14 xl:px-16 max-w-[1720px] mx-auto overflow-hidden"
      >
        <motion.div
          style={{
            scale: smoothScale,
            opacity: smoothOpacity,
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="bg-black text-white rounded-[28px] md:rounded-[40px] lg:rounded-[56px] 2xl:rounded-[70px] relative overflow-hidden flex items-center will-change-transform origin-center"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center w-full relative z-10">
            
            {/* Left Content (Nokta Sütunu + Geniş Gap + Metin Bloğu) */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-0 lg:pl-10 xl:pl-16 2xl:pl-24 flex items-center gap-6 sm:gap-8 lg:gap-10 xl:gap-12 z-10">
              
              {/* Vertical Navigation Column: Üst Ok + Noktalar + Alt Ok */}
              <div className="flex flex-col items-center gap-2 py-2 shrink-0">
                {/* Up Arrow (Önceki Slide) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
                  }}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition active:scale-90"
                  aria-label="Önceki özellik"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>

                {/* Vertical Dots */}
                <div className="flex flex-col gap-2.5 py-1">
                  {SLIDES.map((slide, index) => {
                    const isActive = index === activeSlide;
                    return (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveSlide(index);
                        }}
                        className="group flex items-center justify-center p-0.5 focus:outline-none"
                        aria-label={`Slide ${index + 1}: ${slide.title}`}
                      >
                        <span
                          className={`rounded-full transition-all duration-300 block ${
                            isActive
                              ? "w-[8px] h-[8px] bg-white scale-125"
                              : "w-[8px] h-[8px] bg-[#383535] group-hover:bg-[#666]"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Down Arrow (Sonraki Slide) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
                  }}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition active:scale-90"
                  aria-label="Sonraki özellik"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Description (Sabit yükseklikli, sıfır zıplamalı metin geçişi) */}
              <div className="flex-1 relative min-h-[130px] sm:min-h-[150px] lg:min-h-[170px] flex flex-col justify-center py-4 pl-1 sm:pl-2">
                {SLIDES.map((slide, index) => {
                  const isCurrent = index === activeSlide;
                  return (
                    <motion.div
                      key={slide.id}
                      initial={false}
                      animate={{
                        opacity: isCurrent ? 1 : 0,
                        y: isCurrent ? 0 : 8,
                      }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className={`w-full ${
                        isCurrent
                          ? "relative z-10"
                          : "absolute inset-y-0 left-1 sm:left-2 flex flex-col justify-center pointer-events-none z-0"
                      }`}
                    >
                      <h3 className="text-[20px] sm:text-[24px] lg:text-[28px] 2xl:text-[34px] font-medium tracking-tight text-white leading-snug mb-2 sm:mb-2.5">
                        {slide.title}
                      </h3>
                      <p className="text-gray-400 text-[13px] sm:text-[14px] lg:text-[15px] 2xl:text-[17px] font-normal leading-[1.45] max-w-[420px]">
                        {slide.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Right Graphic Mockup (Her yönden eşit boşluklu, kusursuz hizalama) */}
            <div className="lg:col-span-7 relative h-[380px] sm:h-[460px] lg:h-[530px] 2xl:h-[610px] w-full">
              {SLIDES.map((slide, index) => {
                const isCurrent = index === activeSlide;
                return (
                  <motion.div
                    key={slide.id}
                    initial={false}
                    animate={{
                      opacity: isCurrent ? 1 : 0,
                      scale: isCurrent ? 1 : 0.97,
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`absolute inset-0 p-5 sm:p-7 lg:p-8 2xl:p-9 flex items-center justify-end ${
                      isCurrent ? "pointer-events-auto z-10" : "pointer-events-none z-0"
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      loading="eager"
                      className="h-full w-auto max-w-full object-contain rounded-[16px] sm:rounded-[22px] lg:rounded-[30px] 2xl:rounded-[40px] drop-shadow-2xl"
                    />
                  </motion.div>
                );
              })}
            </div>

          </div>
        </motion.div>
      </section>

      {/* 5. "Nasıl çalışır?" Section (Eşit Ritim: py-14 lg:py-18) */}
      <section id="nasil-calisir" className="py-14 lg:py-18 px-6 sm:px-10 lg:px-14 xl:px-16 max-w-[1720px] mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-[760px] mx-auto mb-10 sm:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-[26px] sm:text-[30px] lg:text-[34px] 2xl:text-[38px] font-medium tracking-tight text-black mb-2.5"
          >
            Nasıl çalışır?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-[14px] sm:text-[16px] lg:text-[18px] font-light text-[#5D5D5D] leading-relaxed"
          >
            Morgül menüde menünüzü yayınlamak çok kolay. Sade ve kolay kullanımı amaçlayan yapısı ile rahatlıkla dijital menünüzü oluşturabilirsiniz.
          </motion.p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 lg:gap-8 max-w-[940px] mx-auto">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-[190px] sm:w-[220px] lg:w-[250px] h-[190px] sm:h-[220px] lg:h-[250px] rounded-[22px] lg:rounded-[28px] overflow-hidden flex items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <img
              src="/images/n1.png"
              alt="Üye olun"
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-[190px] sm:w-[220px] lg:w-[250px] h-[190px] sm:h-[220px] lg:h-[250px] rounded-[22px] lg:rounded-[28px] overflow-hidden flex items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <img
              src="/images/n2.png"
              alt="Menünüzü oluşturun"
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="w-[190px] sm:w-[220px] lg:w-[250px] h-[190px] sm:h-[220px] lg:h-[250px] rounded-[22px] lg:rounded-[28px] overflow-hidden flex items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <img
              src="/images/n3.png"
              alt="Yayınlayın"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>
      </section>

      {/* 6. "İster web ister mobil deneyim." Section (Eşit Ritim: py-14 lg:py-18) */}
      <section id="mobil-deneyim" className="py-14 lg:py-18 px-6 sm:px-10 lg:px-14 xl:px-16 max-w-[1720px] mx-auto">
        <div 
          className="rounded-[28px] md:rounded-[40px] lg:rounded-[56px] 2xl:rounded-[70px] border border-[#E6E6E6] relative overflow-hidden flex items-center"
          style={{
            background: "radial-gradient(circle at 20% 35%, #E8EBEF 0%, #FFFFFF 100%)"
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center w-full">
            
            {/* Left Content (Artırılmış Sol/İç Boşluk) */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:py-16 lg:pl-16 xl:pl-24 2xl:pl-32 lg:pr-8 flex flex-col justify-center">
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-[22px] sm:text-[26px] lg:text-[30px] 2xl:text-[36px] font-medium tracking-tight text-black leading-tight"
              >
                İster web ister mobil deneyim.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-3.5 sm:mt-4 text-[14px] sm:text-[15px] lg:text-[16px] 2xl:text-[19px] font-light text-[#5D5D5D] leading-relaxed max-w-[480px]"
              >
                Saniyeler içinde kayıt olun. Ürünlerinizi ekleyin, fiyatlarınızı anında güncelleyin. Modern ve hızlı QR menü ile müşterilerinize kolayca ulaşın.
              </motion.p>

              {/* App Store & Google Play Badges */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4"
              >
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-block hover:scale-105 active:scale-95 transition-transform"
                  aria-label="Google Play'den İndirin"
                >
                  <img
                    src="/images/googleplay.png"
                    alt="Google Play"
                    className="w-[140px] sm:w-[160px] lg:w-[180px] h-auto object-contain"
                  />
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-block hover:scale-105 active:scale-95 transition-transform"
                  aria-label="App Store'dan İndirin"
                >
                  <img
                    src="/images/appstore.png"
                    alt="App Store"
                    className="w-[140px] sm:w-[160px] lg:w-[180px] h-auto object-contain"
                  />
                </a>
              </motion.div>
            </div>

            {/* Right Graphic Mockup (Artırılmış Sağ/İç Boşluk) */}
            <div className="lg:col-span-6 p-6 sm:p-10 lg:py-16 lg:pr-16 xl:pr-24 2xl:pr-32 lg:pl-8 flex items-center justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="w-full flex justify-center lg:justify-end"
              >
                <img
                  src="/images/mobil3.png"
                  alt="Mobil Menü Ekranları"
                  className="w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[440px] h-auto object-contain drop-shadow-xl"
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Fiyatlandırma (Eşit Ritim: py-14 lg:py-18, DAR ALAN: 1080px -> 1280px) */}
      <section id="fiyatlar" className="relative py-14 lg:py-18 overflow-hidden">
        {/* Background Texture from Figma (pricing_bg.png) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/pricing_bg.png"
            alt=""
            fill
            className="object-cover object-center pointer-events-none"
          />
          {/* Top & Bottom seamless gradient blending */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>

        {/* DAR Container */}
        <div className="relative z-10 max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6">
          {/* Header + Toggle row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-[26px] sm:text-[30px] lg:text-[36px] font-medium tracking-tight text-black"
            >
              Fiyatlandırma
            </motion.h2>

            {/* Toggle Switch */}
            <div className="flex items-center p-1 bg-white border border-[#EBE9E9] rounded-full">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 sm:px-5 py-1.5 text-[13px] sm:text-[14px] font-normal rounded-full transition-all ${
                  billingCycle === "monthly"
                    ? "bg-black text-white"
                    : "text-black hover:opacity-70"
                }`}
              >
                Aylık
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 sm:px-5 py-1.5 text-[13px] sm:text-[14px] font-normal rounded-full transition-all ${
                  billingCycle === "yearly"
                    ? "bg-black text-white"
                    : "text-black hover:opacity-70"
                }`}
              >
                Yıllık
              </button>
            </div>
          </div>

          {/* 3 Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            {PRICING_PLANS.map((plan, idx) => {
              const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
              const period = billingCycle === "monthly" ? "/ay" : "/ay";

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="w-full rounded-[26px] bg-[#FEFEFE] border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  {/* Upper Card Header */}
                  <div className="p-6 sm:p-7 pb-4">
                    <h3 className="text-[20px] sm:text-[22px] font-bold text-black tracking-tight mb-1.5">
                      {plan.name}
                    </h3>
                    <p className="text-[13px] text-gray-500 font-normal leading-relaxed min-h-[38px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Lower Card Area */}
                  <div className="bg-[#F7F7F7] p-6 sm:p-7 pt-5 rounded-b-[26px] flex-1 flex flex-col justify-between">
                    <div>
                      {/* Price Row */}
                      <div className="flex items-baseline gap-1 mb-4 sm:mb-5">
                        <span className="text-[34px] sm:text-[40px] font-bold text-black tracking-tight">
                          {price} ₺
                        </span>
                        <span className="text-[13px] sm:text-[14px] text-gray-500 font-normal">
                          {period}
                        </span>
                      </div>

                      {/* Features List */}
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F26B4C] shrink-0" />
                            <span className="text-[13px] sm:text-[14px] font-light text-[#3E4149]">
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={plan.href}
                      className="w-full h-[42px] sm:h-[44px] rounded-full bg-white hover:bg-black hover:text-white text-[#202126] text-[14px] sm:text-[15px] font-medium border border-[#E9E5DF] hover:border-black hover:shadow-sm transition-all flex items-center justify-center active:scale-95 text-center mt-2"
                    >
                      {plan.buttonText}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Sıkça Sorulan Sorular (Eşit Ritim: py-14 lg:py-18, DAR ALAN: 1080px -> 1280px) */}
      <section id="sss" className="py-14 lg:py-18 max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6">
        <div className="text-left mb-6 sm:mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-[26px] sm:text-[30px] lg:text-[36px] font-medium tracking-tight text-black"
          >
            Sıkça Sorulan Sorular
          </motion.h2>
        </div>

        {/* Side-by-Side Flex Wrap Question Pill Boxes */}
        <div className="flex flex-wrap gap-3 sm:gap-3.5 items-center">
          {FAQ_ITEMS.map((faq, index) => (
            <motion.button
              key={faq.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              onClick={() => setActiveModalFaq(faq)}
              className="h-[54px] sm:h-[60px] px-5 sm:px-6 rounded-[14px] border border-[#CECECE] hover:border-black bg-white hover:bg-gray-50/80 hover:shadow-md transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer text-left active:scale-[0.98] group"
            >
              <span className="text-[14px] sm:text-[15px] font-normal text-black group-hover:text-black">
                {faq.question}
              </span>

              {/* Plus icon */}
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-gray-400 group-hover:text-black transition-colors shrink-0">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* FAQ Pop-Up Modal */}
      <AnimatePresence>
        {activeModalFaq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalFaq(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white rounded-[24px] p-6 sm:p-7 shadow-2xl border border-gray-100 z-10"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalFaq(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition active:scale-90"
                aria-label="Kapat"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Question Title */}
              <h3 className="text-[19px] sm:text-[21px] font-bold text-black tracking-tight pr-8 leading-snug">
                {activeModalFaq.question}
              </h3>

              {/* Answer Content */}
              <div className="mt-3.5 text-[14px] sm:text-[15px] text-[#444] font-light leading-relaxed">
                {activeModalFaq.answer}
              </div>

              {/* Footer action */}
              <div className="mt-6 pt-3.5 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveModalFaq(null)}
                  className="px-5 py-2 rounded-full bg-black text-white text-[13px] sm:text-[14px] font-medium hover:bg-neutral-800 transition active:scale-95"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 9. Bottom CTA Banner (Eşit Ritim: py-14 lg:py-18) */}
      <section className="py-14 lg:py-18 px-6 sm:px-10 lg:px-14 xl:px-16 max-w-[1720px] mx-auto">
        <div className="bg-black text-white rounded-[28px] md:rounded-[40px] lg:rounded-[56px] 2xl:rounded-[70px] relative overflow-hidden flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center w-full relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-0 lg:pl-10 xl:pl-16 2xl:pl-24 flex flex-col justify-center">
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-[24px] sm:text-[30px] lg:text-[36px] 2xl:text-[42px] font-medium tracking-tight text-white leading-[1.16] max-w-[460px]"
              >
                Menünüzü Dijitalleştirmeye Hazır mısınız?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-3.5 text-[13px] sm:text-[14px] lg:text-[15px] 2xl:text-[18px] font-normal text-gray-300 leading-relaxed max-w-[460px]"
              >
                Kredi kartı gerektirmeden hemen ücretsiz kayıt olun ve işletmenizin dijital menüsünü saniyeler içinde oluşturun.
              </motion.p>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-6 sm:mt-7"
              >
                <Link
                  href="/onboarding"
                  className="inline-flex w-full sm:w-[260px] h-[42px] sm:h-[44px] rounded-full bg-white hover:bg-neutral-200 text-black text-[14px] sm:text-[15px] font-medium items-center justify-center hover:shadow-lg transition-all hover:scale-105 active:scale-95 text-center"
                >
                  Ücretsiz Hesabınızı Oluşturun
                </Link>
              </motion.div>
            </div>

            {/* Right Photo Graphic */}
            <div className="lg:col-span-6 p-2 sm:p-3 lg:p-4 lg:pr-5 2xl:p-6 2xl:pr-8 flex items-center justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="w-full flex justify-end"
              >
                <img
                  src="/images/cta_banner.png"
                  alt="QR Menü Kullanımı"
                  className="w-full h-auto max-h-[380px] sm:max-h-[460px] lg:max-h-[520px] 2xl:max-h-[600px] object-contain object-right rounded-[18px] sm:rounded-[24px] lg:rounded-[36px] 2xl:rounded-[50px] drop-shadow-2xl"
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. Footer (Eşit Ritim) */}
      <footer className="py-12 sm:py-14 px-6 max-w-[1720px] mx-auto border-t border-gray-100 mt-4 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          {/* Footer Logo */}
          <Link href="/" className="inline-block group">
            <img
              src="/images/footer_logo.png"
              alt="Morgül Ticaret"
              className="h-[44px] sm:h-[50px] w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          <p className="text-[12px] sm:text-[13px] text-gray-500 font-light">
            © {new Date().getFullYear()} Morgül Menü — Tüm Hakları Saklıdır.
          </p>
        </div>
      </footer>

    </div>
  );
}
