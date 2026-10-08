"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  variant?: "absolute" | "sticky";
}

const NAV_ITEMS = [
  { label: "Özellikler", href: "/ozellikler" },
  { label: "Fiyatlandırma", href: "/fiyatlandirma" },
  { label: "Destek/SSS", href: "/destek" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
];

export default function Navbar({ variant = "sticky" }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const panelUrl = "https://app.displexa.com";

  return (
    <header
      className={`${
        variant === "absolute"
          ? "absolute top-0 inset-x-0 z-50"
          : "sticky top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/[0.06]"
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 h-16 sm:h-20 flex items-center justify-between">
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

        {/* Header Action Button (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={`${panelUrl}/giris`}
            className="h-[36px] sm:h-[38px] px-5 sm:px-6 rounded-full bg-white/80 hover:bg-white text-black text-[13px] sm:text-[14px] font-medium border border-black/10 hover:border-black/25 transition-all active:scale-95 flex items-center justify-center backdrop-blur-md shadow-sm"
          >
            Ücretsiz Başla
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href={`${panelUrl}/giris`}
            className="h-[32px] px-3.5 rounded-full bg-black text-white text-[12px] font-medium flex items-center justify-center"
          >
            Giriş
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-700 hover:bg-black/[0.05] transition"
            aria-label="Menüyü Aç"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-black/[0.08] px-6 py-5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl font-medium text-[15px] transition ${
                    isActive
                      ? "bg-black text-white"
                      : "text-neutral-800 hover:bg-black/[0.05]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 mt-1 border-t border-black/[0.08] flex flex-col gap-2">
              <Link
                href="/onboarding"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 rounded-full bg-black text-white text-[14px] font-medium flex items-center justify-center"
              >
                Hemen Ücretsiz Dene
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
