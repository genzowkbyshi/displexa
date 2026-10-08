"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  MessageCircle,
  Mail,
  FileText,
  HelpCircle,
  Sparkles,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CtaBanner from "@/components/cta-banner";

const FAQ_DATA = [
  {
    id: 1,
    category: "Hesap & Başlangıç",
    question: "Üye olmak ücretli mi ve nasıl başlarım?",
    answer:
      "Hayır, üye olmak tamamen ücretsizdir. Kredi kartı bilgisi girmeden 'Ücretsiz Başla' butonuna tıklayarak saniyeler içinde restoran hesabınızı oluşturabilir, ürünlerinizi ekleyip dijital menünüzü hemen yayınlayabilirsiniz.",
  },
  {
    id: 2,
    category: "Hesap & Başlangıç",
    question: "Üye olurken kredi kartı girmem gerekiyor mu?",
    answer:
      "Kesinlikle hayır. 14 günlük ücretsiz deneme sürecinde herhangi bir ödeme bilgisi veya kredi kartı talep edilmez. Deneme sonunda memnun kalırsanız uygun paketi seçebilirsiniz.",
  },
  {
    id: 3,
    category: "Menü & Ürünler",
    question: "Fiyatlarımı ve ürünlerimi nasıl güncellerim?",
    answer:
      "Yönetim panelinizden ürün listesine girip istediğiniz ürünün fiyatını veya açıklamasını anında değiştirebilirsiniz. Kaydet dediğiniz anda masalardaki tüm müşterilerin ekranlarında yeni fiyatlar otomatik olarak güncellenir.",
  },
  {
    id: 4,
    category: "Menü & Ürünler",
    question: "Tükenen ürünleri menüden nasıl kaldırırım?",
    answer:
      "Panelinizden ilgili ürünün yanındaki 'Aktif/Pasif' butonuna basmanız yeterlidir. Ürünü silmenize gerek kalmadan menüde görünmez hale getirebilir, stoğu yenilendiğinde tek tıkla tekrar açabilirsiniz.",
  },
  {
    id: 5,
    category: "Menü & Ürünler",
    question: "Alerjen ve kalori bilgilerini ekleyebilir miyim?",
    answer:
      "Evet! Her ürünün altına Gluten, Laktoz, Fındık/Fıstık, Acı, Vejetaryen, Vegan gibi özel etiketler ve porsiyon kalori değerlerini kolayca tanımlayabilirsiniz.",
  },
  {
    id: 6,
    category: "QR Kod & Baskı",
    question: "Masalarım için QR kodları nasıl temin ederim?",
    answer:
      "Panelinizde 'QR Kodlarım' sekmesinden her masaya özel veya genel mekanınıza ait QR kodları yüksek çözünürlüklü PDF veya PNG olarak indirebilirsiniz. Hazır stand şablonlarımızı doğrudan matbaanıza veya renkli yazıcınıza gönderebilirsiniz.",
  },
  {
    id: 7,
    category: "QR Kod & Baskı",
    question: "Fiyat değiştirdiğimde QR kodları yeniden bastırmam gerekir mi?",
    answer:
      "Asla! Morgül Menü dinamik QR kod altyapısı kullanır. Masalarınızdaki fiziksel QR kodlar hiç değişmez; panelden yaptığınız tüm değişiklikler o QR kodun yönlendiği menü sayfasına anında yansır.",
  },
  {
    id: 8,
    category: "Ödeme & Faturalandırma",
    question: "Üyelik paketimi istediğim zaman iptal edebilir miyim?",
    answer:
      "Evet. Sistemimizde herhangi bir taahhüt ya da sözleşme yoktur. İstediğiniz an üyeliğinizi sonlandırabilir, dilediğiniz zaman yeniden aktifleştirebilirsiniz.",
  },
  {
    id: 9,
    category: "Ödeme & Faturalandırma",
    question: "Faturam nasıl ve ne zaman kesilir?",
    answer:
      "Ödemeniz onaylandığı anda kurumsal veya bireysel e-faturanız sisteme kayıtlı e-posta adresinize otomatik olarak gönderilir.",
  },
  {
    id: 10,
    category: "Teknik Destek",
    question: "Müşterilerimin uygulamayı indirmesi gerekiyor mu?",
    answer:
      "Hayır. Misafirleriniz akıllı telefonlarının kamerasını masadaki QR koda tuttuğunda menü doğrudan tarayıcılarında açılır. Hiçbir uygulama indirme, üyelik veya bekleme süresi yoktur.",
  },
  {
    id: 11,
    category: "Teknik Destek",
    question: "Yabancı turistler için çoklu dil desteği nasıl çalışır?",
    answer:
      "Morgül Menü, müşterinin telefon dilini otomatik algılayarak menüyü kendi dilinde sunabilir. Ayrıca müşteri sağ üst köşeden İngilizce, Rusça, Arapça gibi diller arasında dilediği zaman geçiş yapabilir.",
  },
  {
    id: 12,
    category: "Teknik Destek",
    question: "İnternet bağlantısı yavaş olduğunda menü açılır mı?",
    answer:
      "Evet, sistemimiz hafif kodlama ve gelişmiş görsel sıkıştırma teknolojileriyle optimize edilmiştir. Düşük hızlı 3G bağlantılarda dahi saniyeler içinde yüklenir.",
  },
];

const CATEGORIES = [
  "Tümü",
  "Hesap & Başlangıç",
  "Menü & Ürünler",
  "QR Kod & Baskı",
  "Ödeme & Faturalandırma",
  "Teknik Destek",
];

export default function SupportFaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [openIds, setOpenIds] = useState<number[]>([1]); // default first item open

  const toggleAccordion = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "Tümü" || item.category === selectedCategory;
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <Navbar variant="sticky" />

      {/* Hero Section */}
      <section className="pt-16 sm:pt-20 pb-12 sm:pb-16 bg-gradient-to-b from-[#FAFBFD] via-[#F4F6F9] to-white border-b border-black/[0.04]">
        <div className="max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.05] border border-black/[0.08] text-[13px] font-medium text-neutral-800 mb-6"
          >
            <HelpCircle className="w-4 h-4 text-black" />
            <span>Morgül Menü Yardım Merkezi</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[36px] sm:text-[46px] lg:text-[56px] font-bold text-black tracking-tight leading-[1.14] max-w-[820px] mx-auto"
          >
            Size Nasıl Yardımcı Olabiliriz?
            <br />
            <span className="font-playfair italic font-medium">Sıkça Sorulan Sorular</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-[16px] sm:text-[18px] lg:text-[20px] font-light text-neutral-600 max-w-[620px] mx-auto leading-relaxed"
          >
            Kayıt aşamasından menü yayınlamaya, QR kod basımından teknik detaylara kadar merak ettiğiniz tüm yanıtlar burada.
          </motion.p>

          {/* Search Box */}
          <div className="mt-8 max-w-[640px] mx-auto relative">
            <Search className="w-5 h-5 text-neutral-400 absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Aklınıza takılan bir konu veya soru arayın... (Örn: QR baskı, fiyat)"
              className="w-full h-14 pl-14 pr-5 rounded-full bg-white border border-black/15 shadow-sm text-[15px] focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-[13px] sm:text-[14px] font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-black text-white shadow-sm"
                    : "bg-white text-neutral-700 hover:bg-neutral-100 border border-black/[0.08]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-14 lg:py-20 max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6">
        <div className="max-w-[860px] mx-auto space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 bg-[#FAFAFB] rounded-[28px] border border-black/[0.06]">
              <p className="text-[17px] text-neutral-600 font-medium">
                Aramanızla eşleşen bir soru bulunamadı.
              </p>
              <p className="text-[14px] text-neutral-400 mt-1">
                Farklı bir anahtar kelime deneyebilir veya doğrudan bizimle iletişime geçebilirsiniz.
              </p>
              <Link
                href="/iletisim"
                className="inline-flex mt-5 px-6 py-2.5 rounded-full bg-black text-white text-[14px] font-medium hover:bg-neutral-800 transition"
              >
                Bize Ulaşın
              </Link>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className="rounded-[22px] border border-black/[0.08] bg-[#FAFAFB] hover:border-black/20 transition-all overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-medium text-[16px] sm:text-[17px] text-black focus:outline-none"
                  >
                    <span className="flex-1">{faq.question}</span>
                    <span
                      className={`w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-black/10 transition-transform duration-300 ${
                        isOpen ? "rotate-180 bg-black text-white" : "text-black"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-1 text-[14px] sm:text-[15px] font-light text-neutral-600 leading-relaxed border-t border-black/[0.04]">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Support Channels Cards */}
      <section className="py-14 lg:py-20 bg-[#FAFBFD] border-y border-black/[0.06]">
        <div className="max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <h2 className="text-[28px] sm:text-[36px] font-bold text-black tracking-tight">
              Sorunuza Yanıt Bulamadınız mı?
            </h2>
            <p className="mt-2 text-[15px] text-neutral-600 font-light">
              Uzman destek ekibimiz sorularınızı yanıtlamak ve size yardımcı olmak için her zaman hazır.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[24px] p-8 border border-black/[0.06] text-center flex flex-col items-center justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-black/[0.05] flex items-center justify-center mx-auto mb-5 text-black">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h3 className="text-[18px] font-semibold text-black mb-2">WhatsApp Destek</h3>
                <p className="text-[14px] text-neutral-600 font-light mb-6">
                  Mesai saatleri içinde ortalama 5 dakika içinde anlık yanıt alın.
                </p>
              </div>
              <a
                href="https://wa.me/905000000000"
                target="_blank"
                rel="noreferrer"
                className="w-full h-11 rounded-full bg-black text-white text-[14px] font-medium hover:bg-neutral-800 transition flex items-center justify-center"
              >
                WhatsApp'tan Yazın
              </a>
            </div>

            <div className="bg-white rounded-[24px] p-8 border border-black/[0.06] text-center flex flex-col items-center justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-black/[0.05] flex items-center justify-center mx-auto mb-5 text-black">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-[18px] font-semibold text-black mb-2">E-Posta Desteği</h3>
                <p className="text-[14px] text-neutral-600 font-light mb-6">
                  Detaylı teknik sorularınız ve kurumsal talepleriniz için bize yazın.
                </p>
              </div>
              <a
                href="mailto:destek@displexa.com"
                className="w-full h-11 rounded-full bg-white text-black border border-black/20 hover:border-black text-[14px] font-medium transition flex items-center justify-center"
              >
                destek@displexa.com
              </a>
            </div>

            <div className="bg-white rounded-[24px] p-8 border border-black/[0.06] text-center flex flex-col items-center justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-black/[0.05] flex items-center justify-center mx-auto mb-5 text-black">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-[18px] font-semibold text-black mb-2">İletişim Formu</h3>
                <p className="text-[14px] text-neutral-600 font-light mb-6">
                  Tüm öneri, şikayet ve iş birliği talepleriniz için formu doldurun.
                </p>
              </div>
              <Link
                href="/iletisim"
                className="w-full h-11 rounded-full bg-white text-black border border-black/20 hover:border-black text-[14px] font-medium transition flex items-center justify-center"
              >
                İletişim Formuna Git
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <CtaBanner
        title="Dijital Menünüzü Hemen Canlıya Alın"
        description="Deneyin, test edin ve işletmenizin verimliliğini artırın. Kredi kartı gerekmez."
      />

      <Footer />
    </div>
  );
}
