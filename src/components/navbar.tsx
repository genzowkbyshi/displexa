"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and handle Escape key when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
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

      {/* Figma Mobile Drawer Overlay (Node 964:41: Top Sheet with rounded-b-[30px] + 30% Dark Backdrop) */}
      {mounted &&
        mobileMenuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex flex-col justify-start">
            {/* Dark Backdrop Overlay (Figma Rectangle 112: opacity 0.3) */}
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
              aria-hidden="true"
            />

            {/* Top White Sheet Panel (Figma Rectangle 110: 402x543px with cornerRadii [0, 0, 30, 30]) */}
            <div className="relative z-10 w-full bg-white rounded-b-[30px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-top-3 duration-250 border-b border-black/10">
              {/* Top Header: Logo + Circular Close Button */}
              <div className="px-5 h-16 shrink-0 flex items-center justify-between border-b border-black/[0.06]">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center"
                >
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
              <div className="px-5 py-2 flex flex-col">
                <div className="divide-y divide-black/[0.08] border-b border-black/[0.08]">
                  {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between py-3.5 text-[16px] font-normal transition ${
                          isActive
                            ? "text-black font-semibold"
                            : "text-black hover:text-neutral-600"
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
              <div className="p-5 pt-3 pb-6 shrink-0 flex flex-col gap-2.5">
                {/* Row of 2 Buttons: Giriş Yap (border) & Kayıt Ol (black solid) */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/giris"
                    onClick={() => setMobileMenuOpen(false)}
                    className="h-[48px] rounded-full border border-black text-black hover:bg-neutral-100 text-[15px] font-medium flex items-center justify-center transition active:scale-95"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/onboarding"
                    onClick={() => setMobileMenuOpen(false)}
                    className="h-[48px] rounded-full bg-black text-white hover:bg-neutral-800 text-[15px] font-medium flex items-center justify-center transition active:scale-95 shadow-sm"
                  >
                    Kayıt Ol
                  </Link>
                </div>

                {/* Full-width "Sizi Arayalım" Button with Phone Icon */}
                <Link
                  href="/iletisim"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-[48px] rounded-full border border-black text-black hover:bg-neutral-50 text-[15px] font-medium flex items-center justify-center gap-2.5 transition active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>Sizi Arayalım</span>
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

