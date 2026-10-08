"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Share2, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CtaBanner from "@/components/cta-banner";
import { BLOG_ARTICLES } from "@/data/blog-posts";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const post = BLOG_ARTICLES.find((p) => p.slug === slug) || BLOG_ARTICLES[0];
  const relatedPosts = BLOG_ARTICLES.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <Navbar variant="sticky" />

      {/* Article Header */}
      <article className="pt-12 sm:pt-16 pb-16 max-w-[860px] mx-auto px-6">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-neutral-600 hover:text-black mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tüm Yazılara Dön</span>
        </Link>

        {/* Category & Meta */}
        <div className="flex flex-wrap items-center gap-3 text-[13px] text-neutral-500 mb-4 font-light">
          <span className="font-semibold text-black uppercase tracking-wider text-[11px] bg-neutral-100 px-3 py-1 rounded-full">
            {post.category}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {post.date}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {post.readTime}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-[32px] sm:text-[44px] lg:text-[48px] font-bold text-black tracking-tight leading-[1.18] mb-6">
          {post.title}
        </h1>

        {/* Lead Excerpt */}
        <p className="text-[18px] sm:text-[20px] font-light text-neutral-600 leading-relaxed mb-8 border-l-2 border-black pl-4">
          {post.excerpt}
        </p>

        {/* Cover Image */}
        <div className="rounded-[28px] overflow-hidden mb-10 border border-black/[0.08] shadow-md">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto max-h-[460px] object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="prose prose-neutral max-w-none text-[16px] sm:text-[17px] font-light text-neutral-800 leading-relaxed space-y-6">
          <p>
            Geleneksel restoran işletmeciliğinde menü baskısı ve güncelleme süreçleri hem ciddi bir zaman kaybı hem de yüksek maliyet kaynağıdır. Özellikle gıda enflasyonu ve mevsimsel menü değişikliklerinin sık yaşandığı günümüzde, basılı menülerle çalışmak işletme karlılığını doğrudan düşürmektedir.
          </p>

          <h2 className="text-[24px] sm:text-[28px] font-bold text-black tracking-tight pt-4">
            1. Matbaa ve Yeniden Baskı Maliyetlerini Tamamen Sıfırlayın
          </h2>
          <p>
            Her fiyat revizyonunda tüm masalardaki menüleri yeniden bastırmak, laminasyon yaptırmak ve haftalarca matbaadan teslim beklemek yerine dijital QR menü altyapısı sayesinde panelden 10 saniye içinde fiyatınızı güncelleyebilirsiniz. Yapılan araştırmalara göre ortalama 30 masalı bir restoran, QR menüye geçerek yıllık on binlerce lira baskı masrafından tasarruf etmektedir.
          </p>

          <h2 className="text-[24px] sm:text-[28px] font-bold text-black tracking-tight pt-4">
            2. Stokta Biten Ürünleri Tek Tıkla Gizleyin
          </h2>
          <p>
            Müşterinizin menüden bir yemek seçip sipariş verdiğinde garsonun &quot;Maalesef o ürünümüz bitti&quot; demesi müşteri memnuniyetini zedeleyen en büyük etkenlerden biridir. Dijital menüde tükenen ürünü tek tıkla pasife alabilir, stoğu yenilendiğinde tekrar açabilirsiniz.
          </p>

          <h2 className="text-[24px] sm:text-[28px] font-bold text-black tracking-tight pt-4">
            3. Yan Ürün ve Tatlı Satışlarını Görsellerle Artırın
          </h2>
          <p>
            İştah açıcı yüksek çözünürlüklü fotoğraflar, müşterilerin sipariş verme dürtüsünü %25 oranında artırır. Basılı menülerde yer kısıtı nedeniyle her ürünün fotoğrafını koymak mümkün olmazken, Morgül Menü&apos;nün modern Grid tasarımında her lezzeti en çekici haliyle sunabilirsiniz.
          </p>

          <div className="p-6 sm:p-8 rounded-[24px] bg-[#FAFBFD] border border-black/[0.08] my-8">
            <h3 className="text-[19px] font-semibold text-black mb-2">
              Özetle Neler Kazanırsınız?
            </h3>
            <ul className="space-y-2.5 text-[15px] text-neutral-700">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Baskı ve tasarım maliyetlerinde %100 net tasarruf</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Fiyat güncellemelerinde sıfır bekleme süresi</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Yabancı misafirler için otomatik çoklu dil desteği</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Masa başı temassız, hijyenik ve modern servis prestiji</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Share Bar */}
        <div className="mt-12 pt-6 border-t border-black/[0.08] flex items-center justify-between">
          <Link
            href="/blog"
            className="text-[14px] font-medium text-black hover:underline"
          >
            ← Diğer Yazıları Gör
          </Link>
          <button
            type="button"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert("Yazı linki kopyalandı!");
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/15 text-[13px] font-medium hover:bg-black hover:text-white transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Paylaş</span>
          </button>
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-14 bg-[#FAFBFD] border-t border-black/[0.06]">
        <div className="max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6">
          <h2 className="text-[24px] sm:text-[28px] font-bold text-black mb-8">
            İlginizi Çekebilecek Diğer Yazılar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((item) => (
              <Link
                key={item.slug}
                href={`/blog/${item.slug}`}
                className="bg-white rounded-[22px] border border-black/[0.08] overflow-hidden hover:border-black/30 hover:shadow-lg transition p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="h-[160px] rounded-[16px] overflow-hidden mb-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] font-semibold uppercase text-neutral-500">
                    {item.category}
                  </span>
                  <h3 className="text-[16px] font-semibold text-black mt-1 line-clamp-2">
                    {item.title}
                  </h3>
                </div>
                <div className="mt-4 pt-3 border-t border-black/[0.04] text-[13px] text-neutral-500 flex items-center justify-between">
                  <span>{item.date}</span>
                  <span className="font-medium text-black">Oku →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
      <Footer />
    </div>
  );
}
