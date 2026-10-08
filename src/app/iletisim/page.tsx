"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CtaBanner from "@/components/cta-banner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    phone: "",
    subject: "Satış & Bilgi Talebi",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        fullName: "",
        businessName: "",
        email: "",
        phone: "",
        subject: "Satış & Bilgi Talebi",
        message: "",
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <Navbar variant="sticky" />

      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 pb-6 sm:pb-8 bg-gradient-to-b from-[#FAFBFD] via-[#F4F6F9] to-white border-b border-black/[0.04] text-center">
        <div className="max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.05] border border-black/[0.08] text-[13px] font-medium text-neutral-800 mb-6"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Her Zaman Buradayız</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[36px] sm:text-[46px] lg:text-[56px] font-bold text-black tracking-tight leading-[1.14] max-w-[800px] mx-auto"
          >
            Bizimle İletişime Geçin
            <br />
            <span className="font-playfair italic font-medium">Sorularınızı Yanıtlayalım</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-[16px] sm:text-[18px] lg:text-[20px] font-light text-neutral-600 max-w-[620px] mx-auto leading-relaxed"
          >
            Restoranınız için en uygun paketi belirlemek, teknik destek almak veya aklınıza takılanları sormak için formu doldurun veya doğrudan arayın.
          </motion.p>
        </div>
      </section>

      {/* Contact Content Grid (Sol: Form, Sağ: Bilgiler) */}
      <section className="pt-8 sm:pt-10 pb-16 lg:pb-24 max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-[#FAFBFD] rounded-[32px] p-8 sm:p-12 border border-black/[0.08] shadow-sm">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-black tracking-tight mb-2">
              Bize Mesaj Gönderin
            </h2>
            <p className="text-[14px] sm:text-[15px] font-light text-neutral-600 mb-8">
              Mesai saatleri içerisinde iletilen tüm mesajlara en geç 15 dakika içinde geri dönüş sağlıyoruz.
            </p>

            {submitted ? (
              <div className="p-8 rounded-[24px] bg-white border border-black/[0.08] text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-[20px] font-bold text-black">Mesajınız Alındı!</h3>
                <p className="text-[14px] text-neutral-600 font-light max-w-[360px] mx-auto">
                  Talebiniz uzman ekibimize iletildi. Belirttiğiniz iletişim kanalı üzerinden en kısa sürede sizinle irtibata geçeceğiz.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-black text-white text-[14px] font-medium hover:bg-neutral-800 transition"
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[13px] font-medium text-neutral-800 mb-2">
                      Adınız Soyadınız <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Ahmet Yılmaz"
                      className="w-full h-12 px-4 rounded-xl bg-white border border-black/15 text-[14px] focus:outline-none focus:border-black transition"
                    />
                  </div>

                  {/* Business Name */}
                  <div>
                    <label className="block text-[13px] font-medium text-neutral-800 mb-2">
                      İşletme Adınız (Restoran / Cafe)
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="Lezzet Cafe"
                      className="w-full h-12 px-4 rounded-xl bg-white border border-black/15 text-[14px] focus:outline-none focus:border-black transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email */}
                  <div>
                    <label className="block text-[13px] font-medium text-neutral-800 mb-2">
                      E-Posta Adresiniz <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ahmet@example.com"
                      className="w-full h-12 px-4 rounded-xl bg-white border border-black/15 text-[14px] focus:outline-none focus:border-black transition"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[13px] font-medium text-neutral-800 mb-2">
                      Telefon Numaranız <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="05XX XXX XX XX"
                      className="w-full h-12 px-4 rounded-xl bg-white border border-black/15 text-[14px] focus:outline-none focus:border-black transition"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-[13px] font-medium text-neutral-800 mb-2">
                    Görüşme Konusu
                  </label>
                  <div className="relative">
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full h-12 pl-4 pr-11 rounded-xl bg-white border border-black/15 text-[14px] focus:outline-none focus:border-black transition appearance-none cursor-pointer"
                    >
                      <option value="Satış & Bilgi Talebi">Satış & Paket Bilgisi</option>
                      <option value="Teknik Destek">Teknik Destek & Kurulum</option>
                      <option value="Çoklu Şube / Franchise">Çoklu Şube & Özel Teklif</option>
                      <option value="Öneri / Geri Bildirim">Öneri veya Şikayet</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[13px] font-medium text-neutral-800 mb-2">
                    Mesajınız <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="İşletmeniz veya sormak istediğiniz detaylar hakkında bize kısaca bilgi verin..."
                    className="w-full p-4 rounded-xl bg-white border border-black/15 text-[14px] focus:outline-none focus:border-black transition resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-13 rounded-full bg-black text-white font-medium text-[15px] hover:bg-neutral-800 transition active:scale-[0.99] flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Gönderiliyor...</span>
                  ) : (
                    <>
                      <span>Mesajı Gönder</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Cards & Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Card */}
            <div className="bg-white rounded-[32px] p-8 border border-black/[0.08] shadow-sm space-y-6">
              <h3 className="text-[20px] font-bold text-black tracking-tight">
                İletişim Bilgileri
              </h3>

              <div className="space-y-5 text-[14px]">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/[0.05] flex items-center justify-center shrink-0 text-black">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[12px] text-neutral-400 font-light">E-Posta</div>
                    <a
                      href="mailto:destek@displexa.com"
                      className="font-medium text-black hover:underline"
                    >
                      destek@displexa.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/[0.05] flex items-center justify-center shrink-0 text-black">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[12px] text-neutral-400 font-light">Müşteri Hattı</div>
                    <a
                      href="tel:08500000000"
                      className="font-medium text-black hover:underline"
                    >
                      0850 000 00 00
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/[0.05] flex items-center justify-center shrink-0 text-black">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[12px] text-neutral-400 font-light">WhatsApp Hattı</div>
                    <a
                      href="https://wa.me/905000000000"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-black hover:underline"
                    >
                      0500 000 00 00
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/[0.05] flex items-center justify-center shrink-0 text-black">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[12px] text-neutral-400 font-light">Genel Merkez</div>
                    <div className="font-medium text-black leading-snug">
                      Büyükdere Cad. No: 120, Maslak / İstanbul
                    </div>
                  </div>
                </div>

                {/* Working hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/[0.05] flex items-center justify-center shrink-0 text-black">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[12px] text-neutral-400 font-light">Çalışma Saatleri</div>
                    <div className="font-medium text-black">
                      Pazartesi – Cumartesi: 09:00 – 19:00
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Support Promise Card */}
            <div className="bg-[#111] text-white rounded-[32px] p-8 relative overflow-hidden shadow-md">
              <h4 className="text-[18px] font-bold mb-2">Hızlı Kurulum Desteği</h4>
              <p className="text-[13px] text-neutral-300 font-light leading-relaxed mb-6">
                Menülerinizi sisteme aktarmakta zorlanırsanız, mevcut menünüzün fotoğrafını veya PDF&apos;ini bize gönderin, ekibimiz sizin yerinize menünüzü sisteme ücretsiz aktarsın.
              </p>
              <a
                href="https://wa.me/905000000000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-medium hover:bg-neutral-200 transition"
              >
                <span>Menümü Gönder</span>
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Bottom CTA Banner */}
      <CtaBanner
        title="Dijital Menünüzü Bugün Yayına Alın"
        description="Morgül Menü ile işletmenizi modernleştirin, müşteri memnuniyetini anında artırın."
      />

      <Footer />
    </div>
  );
}
