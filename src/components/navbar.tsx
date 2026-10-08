"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, Phone } from "lucide-react";

interface NavbarProps {
  variant?: "absolute" | "sticky";
}

const NAV_ITEMS = [
  { label: "Özellikler", href: "/ozellikler" },
  { label: "Fiyatlandırma", href: "/fiyatlandirma" },
  { label: "Destek / SSS", href: "/destek" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
];

export default function Navbar({ variant = "sticky" }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`${
          variant === "absolute"
            ? "absolute top-0 inset-x-0 z-40"
            : "sticky top-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-b border-black/[0.06]"
        }`}
      >
        <div className="max-w-[1720px] mx-auto px-5 sm:px-10 lg:px-14 xl:px-16 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/images/logo.png"
              alt="MorgülMenü"
              className="h-[24px] sm:h-[28px] w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5 text-[14px] sm:text-[15px] text-black">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-1.5 rounded-full transition-all duration-200 font-medium active:scale-95 group ${
                    isActive
                      ? "bg-black text-white"
                      : "text-neutral-700 hover:text-black hover:bg-black/[0.08]"
                  }`}
                >
                  <span>{item.label}</span>
                  {!isActive && (
                    <span className="absolute bottom-1 inset-x-3.5 h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Header Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              href="/giris"
              className="h-[36px] sm:h-[38px] px-4 sm:px-5 rounded-full text-black hover:bg-black/[0.06] text-[13px] sm:text-[14px] font-medium transition-all active:scale-95 flex items-center justify-center"
            >
              Giriş Yap
            </Link>
            <Link
              href="/onboarding"
              className="h-[36px] sm:h-[38px] px-5 sm:px-6 rounded-full bg-black text-white hover:bg-neutral-800 text-[13px] sm:text-[14px] font-medium transition-all active:scale-95 flex items-center justify-center shadow-sm"
            >
              Ücretsiz Başla
            </Link>
          </div>

          {/* Mobile Right Controls: "Giriş Yap" Pill + Hamburger Menu (Figma Node 902:4) */}
          <div className="flex md:hidden items-center gap-2.5">
            <Link
              href="/giris"
              className="h-[30px] px-3.5 rounded-full bg-black text-white text-[13px] font-medium flex items-center justify-center active:scale-95 transition"
            >
              Giriş Yap
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg text-black hover:bg-black/[0.06] transition active:scale-95"
              aria-label="Menüyü Aç"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Figma Mobile Drawer Overlay (Node 964:41) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
          {/* Top Header: Logo + Circular Close Button */}
          <div className="px-5 h-16 flex items-center justify-between border-b border-black/[0.06]">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
              <img
                src="/images/logo.png"
                alt="MorgülMenü"
                className="h-[24px] w-auto object-contain"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="w-[42px] h-[42px] rounded-full border border-[#DCDCDC] flex items-center justify-center text-black hover:bg-neutral-100 transition active:scale-95"
              aria-label="Menüyü Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Middle Nav Links with Divider Lines & Right Chevron (Figma Lines 6-11) */}
          <div className="flex-1 px-5 py-6 flex flex-col justify-center">
            <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-4 text-[16px] font-normal transition ${
                      isActive ? "text-black font-semibold" : "text-black hover:text-neutral-600"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Buttons (Figma Node 964:41) */}
          <div className="p-5 pb-8 flex flex-col gap-3">
            {/* Row of 2 Buttons: Giriş Yap (border) & Kayıt Ol (black solid) */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/giris"
                onClick={() => setMobileMenuOpen(false)}
                className="h-[50px] rounded-full border border-black text-black hover:bg-neutral-100 text-[15px] font-medium flex items-center justify-center transition active:scale-95"
              >
                Giriş Yap
              </Link>
              <Link
                href="/onboarding"
                onClick={() => setMobileMenuOpen(false)}
                className="h-[50px] rounded-full bg-black text-white hover:bg-neutral-800 text-[15px] font-medium flex items-center justify-center transition active:scale-95 shadow-sm"
              >
                Kayıt Ol
              </Link>
            </div>

            {/* Full-width "Sizi Arayalım" Button with Phone Icon */}
            <Link
              href="/iletisim"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full h-[50px] rounded-full border border-black text-black hover:bg-neutral-50 text-[15px] font-medium flex items-center justify-center gap-2.5 transition active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Sizi Arayalım</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

