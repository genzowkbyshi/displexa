"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Calendar, Clock, ArrowRight, ArrowUpRight, Search } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CtaBanner from "@/components/cta-banner";

import { BLOG_ARTICLES } from "@/data/blog-posts";

const CATEGORIES = [
  "Tümü",
  "Maliyet & Verimlilik",
  "Menü Mühendisliği",
  "Dijitalleşme",
  "Restoran Yönetimi",
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");

  const featuredPost = BLOG_ARTICLES.find((item) => item.featured) || BLOG_ARTICLES[0];

  const filteredPosts = BLOG_ARTICLES.filter((item) => {
    const matchesCat =
      selectedCategory === "Tümü" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
            <Sparkles className="w-4 h-4 text-black" />
            <span>Morgül Blog & İçerikler</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[36px] sm:text-[46px] lg:text-[56px] font-bold text-black tracking-tight leading-[1.14] max-w-[820px] mx-auto"
          >
            Restoranınızı Büyütecek
            <br />
            <span className="font-playfair italic font-medium">Rehberler ve İpuçları</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-[16px] sm:text-[18px] lg:text-[20px] font-light text-neutral-600 max-w-[620px] mx-auto leading-relaxed"
          >
            Menü mühendisliği, maliyet optimizasyonu ve gastronomi dünyasındaki dijital trendler üzerine hazırladığımız güncel yazılar.
          </motion.p>

          {/* Search bar */}
          <div className="mt-8 max-w-[540px] mx-auto relative">
            <Search className="w-5 h-5 text-neutral-400 absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Yazılarda arayın... (Örn: Maliyet, Fotoğraf)"
              className="w-full h-13 pl-14 pr-5 rounded-full bg-white border border-black/15 shadow-sm text-[15px] focus:outline-none focus:border-black transition"
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

      {/* Featured Blog Article (Only when searching Tümü and no query) */}
      {selectedCategory === "Tümü" && searchQuery === "" && featuredPost && (
        <section className="pt-12 pb-6 max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block bg-[#FAFBFD] rounded-[32px] border border-black/[0.08] overflow-hidden hover:border-black/30 hover:shadow-xl transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Image */}
              <div className="lg:col-span-7 h-[280px] sm:h-[360px] lg:h-[420px] overflow-hidden relative">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-black/75 text-white text-[12px] font-semibold backdrop-blur-md">
                  Öne Çıkan Yazı
                </div>
              </div>

              {/* Text */}
              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[13px] text-neutral-500 mb-3 font-light">
                    <span className="font-semibold text-black uppercase tracking-wider text-[11px] bg-neutral-200/80 px-2.5 py-0.5 rounded-full">
                      {featuredPost.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="text-[24px] sm:text-[30px] font-bold text-black tracking-tight leading-tight group-hover:text-neutral-700 transition">
                    {featuredPost.title}
                  </h2>

                  <p className="mt-4 text-[15px] sm:text-[16px] text-neutral-600 font-light leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-[15px] font-medium text-black group-hover:translate-x-1 transition-transform">
                  <span>Yazıyı Oku</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Blog Cards Grid */}
      <section className="py-12 lg:py-16 max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col justify-between bg-white rounded-[26px] border border-black/[0.08] overflow-hidden hover:border-black/30 hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Image */}
                <div className="h-[210px] sm:h-[230px] overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3.5 left-3.5 px-3 py-0.5 rounded-full bg-white/90 text-black text-[11px] font-semibold backdrop-blur-md shadow-sm">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2.5 text-[12px] text-neutral-400 mb-2.5 font-light">
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

                  <h3 className="text-[18px] sm:text-[19px] font-semibold text-black tracking-tight leading-snug group-hover:text-neutral-700 transition mb-3">
                    {post.title}
                  </h3>

                  <p className="text-[14px] text-neutral-600 font-light leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Read Action */}
              <div className="px-6 pb-6 pt-2 flex items-center justify-between text-[14px] font-medium text-black border-t border-black/[0.04]">
                <span>Devamını Oku</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Box */}
      <section className="py-12 max-w-[1080px] xl:max-w-[1200px] 2xl:max-w-[1280px] mx-auto px-6">
        <div className="bg-[#111] text-white rounded-[32px] p-8 sm:p-12 text-center max-w-[900px] mx-auto relative overflow-hidden">
          <h2 className="text-[26px] sm:text-[32px] font-bold tracking-tight mb-3">
            Yeni Yazılardan Haberdar Olun
          </h2>
          <p className="text-[14px] sm:text-[15px] text-neutral-400 font-light max-w-[500px] mx-auto mb-7">
            Restoranınızı büyütecek içerikleri, menü trendlerini ve pratik işletme ipuçlarını haftalık bültenimizle e-postanıza gönderelim.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Bültenimize başarıyla abone oldunuz!");
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-[460px] mx-auto"
          >
            <input
              type="email"
              required
              placeholder="E-posta adresinizi girin"
              className="w-full sm:w-auto flex-1 h-12 px-5 rounded-full bg-white/10 border border-white/20 text-white placeholder-neutral-400 text-[14px] focus:outline-none focus:border-white transition"
            />
            <button
              type="submit"
              className="w-full sm:w-auto h-12 px-7 rounded-full bg-white text-black font-medium text-[14px] hover:bg-neutral-200 transition shrink-0"
            >
              Abone Ol
            </button>
          </form>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <CtaBanner
        title="Kendi Dijital Menünüzü Bugün Oluşturun"
        description="Morgül Menü ile işletmenizi dijitalleştirin, müşteri memnuniyetini anında artırın."
      />

      <Footer />
    </div>
  );
}
