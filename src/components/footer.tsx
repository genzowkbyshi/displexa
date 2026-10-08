"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="iletisim" className="py-8 sm:py-10 px-5 sm:px-6 max-w-[1720px] mx-auto border-t border-gray-100 mt-4 sm:mt-6">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        
        {/* Left: Brand info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-[340px]">
          <Link href="/" className="inline-block group mb-3">
            <img
              src="/images/footer_logo.png"
              alt="Morgül Ticaret"
              className="h-[44px] sm:h-[48px] w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <p className="text-[13px] sm:text-[14px] text-gray-500 font-light leading-relaxed">
            Restoran, cafe ve oteller için yeni nesil dijital QR menü yönetim platformu.
          </p>
        </div>

        {/* Center / Right: Quick Navigation */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-8 gap-y-3 text-[14px] font-medium text-neutral-700">
          <Link href="/ozellikler" className="hover:text-black transition">
            Özellikler
          </Link>
          <Link href="/fiyatlandirma" className="hover:text-black transition">
            Fiyatlandırma
          </Link>
          <Link href="/destek" className="hover:text-black transition">
            Destek / SSS
          </Link>
          <Link href="/blog" className="hover:text-black transition">
            Blog
          </Link>
          <Link href="/iletisim" className="hover:text-black transition">
            İletişim
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-[1280px] mx-auto pt-8 mt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[12px] sm:text-[13px] text-gray-400 font-light gap-3">
        <p>© {new Date().getFullYear()} Morgül Menü — Tüm Hakları Saklıdır.</p>
        <div className="flex items-center gap-6">
          <Link href="/destek" className="hover:text-gray-600 transition">
            Gizlilik Politikası
          </Link>
          <Link href="/destek" className="hover:text-gray-600 transition">
            Kullanım Koşulları
          </Link>
        </div>
      </div>
    </footer>
  );
}
