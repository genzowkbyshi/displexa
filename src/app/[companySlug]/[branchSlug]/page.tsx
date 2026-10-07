"use client";

import React, { useEffect, useState } from "react";
import { publicMenuService, PublicMenuResponse } from "@/services/public-menu.service";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import { Clock, ExternalLink, Flame, Globe2, Info, Mail, MapPin, Phone, X } from "lucide-react";

const LOCALES = [
  { code: "tr", label: "TR" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "ar", label: "AR" },
] as const;

type LocaleCode = typeof LOCALES[number]["code"];

export default function PublicMenuPage() {
  const params = useParams();
  const companySlug = params.companySlug as string;
  const branchSlug = params.branchSlug as string;

  const [data, setData] = useState<PublicMenuResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [locale, setLocale] = useState<LocaleCode>("tr");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showCompanyInfo, setShowCompanyInfo] = useState(false);


  // Sayfa yüklendiğinde MenuView kaydet
  useEffect(() => {
    if (!companySlug || !branchSlug) return;
    fetch('/api/bff/public/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 2, // MenuView
        companySlug,
        branchSlug
      })
    }).catch(e => console.error('Analytics error:', e));
  }, [companySlug, branchSlug]);

  // Kategori değiştiğinde CategoryView kaydet
  useEffect(() => {
    if (!companySlug || !branchSlug || !activeCategory) return;
    fetch('/api/bff/public/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 3, // CategoryView
        companySlug,
        branchSlug,
        categorySlug: activeCategory
      })
    }).catch(e => console.error('Analytics error:', e));
  }, [activeCategory, companySlug, branchSlug]);


  useEffect(() => {
    if (!companySlug || !branchSlug) return;

    let cancelled = false;

    setLoading(true);
    setError(false);

    const loadMenu = async () => {
      try {
        const res = await publicMenuService.getMenu(companySlug, branchSlug, locale);
        if (cancelled) return;

        setData(res);
        if (res.categories && res.categories.length > 0) {
          setActiveCategory(res.categories[0].slug);
        }
      } catch (err) {
        console.error(err);

        if (locale !== "tr") {
          try {
            const fallback = await publicMenuService.getMenu(companySlug, branchSlug, "tr");
            if (cancelled) return;

            setLocale("tr");
            setData(fallback);
            setError(false);
            if (fallback.categories && fallback.categories.length > 0) {
              setActiveCategory(fallback.categories[0].slug);
            }
            return;
          } catch (fallbackErr) {
            console.error(fallbackErr);
          }
        }

        if (cancelled) return;
        setError(true);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    };

    loadMenu();

    return () => {
      cancelled = true;
    };
  }, [companySlug, branchSlug, locale]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Menü Bulunamadı</h1>
        <p className="text-gray-500">Aradığınız menü şu anda aktif değil veya bağlantı hatalı.</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {LOCALES.map(item => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                setLocale(item.code);
                setError(false);
              }}
              className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-black text-gray-800 shadow-sm"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const { company, branch, settings, categories, banners } = data;
  const s = settings;

  return (
    <div 
      className="min-h-screen font-sans pb-24"
      style={{ backgroundColor: s.backgroundColor, color: s.textColor }}
    >
      {/* Header */}
      <header 
        className="pt-4 pb-4 px-4 shadow-sm rounded-b-3xl sticky top-0 z-40 transition-colors"
        style={{ backgroundColor: s.backgroundColor }}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowCompanyInfo(true)}
            className="w-11 h-11 rounded-2xl border border-black/10 bg-white/90 shadow-sm flex items-center justify-center transition active:scale-95"
            aria-label="Firma bilgileri"
          >
            <Info className="w-5 h-5" style={{ color: s.textColor }} />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLanguageMenu(value => !value)}
              className="h-11 px-3 rounded-2xl border border-black/10 bg-white/90 shadow-sm flex items-center gap-2 text-sm font-black transition active:scale-95"
              aria-label="Dil seç"
            >
              <Globe2 className="w-5 h-5" style={{ color: s.primaryColor }} />
              <span style={{ color: s.textColor }}>{locale.toUpperCase()}</span>
            </button>

            <AnimatePresence>
              {showLanguageMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  className="absolute right-0 top-13 w-28 rounded-2xl bg-white shadow-xl border border-black/10 overflow-hidden z-50"
                >
                  {LOCALES.map(item => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setLocale(item.code);
                        setShowLanguageMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-bold transition hover:bg-gray-50"
                      style={{
                        color: item.code === locale ? s.primaryColor : "#111827",
                        backgroundColor: item.code === locale ? `${s.primaryColor}14` : "#ffffff",
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          {company.logoUrl && (
            <img src={company.logoUrl} alt={company.name} className="w-16 h-16 rounded-2xl object-contain shadow-sm mb-3 bg-white" />
          )}
          <h1 className="text-xl font-black tracking-tight" style={{ color: s.textColor }}>{company.name}</h1>
          <p className="text-xs opacity-70 mt-1 font-medium">{branch.name}</p>
        </div>

        {/* Categories Scroll */}
        {categories.length > 0 && (
          <div className="mt-5 -mx-6 px-6 overflow-x-auto hide-scrollbar">
            <div className="flex gap-3 pb-2 w-max">
              {categories.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => {
                    setActiveCategory(cat.slug);
                    document.getElementById(`category-${cat.slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm ${
                    activeCategory === cat.slug ? 'ring-2 ring-offset-2' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: activeCategory === cat.slug ? s.primaryColor : s.secondaryColor,
                    color: activeCategory === cat.slug ? '#ffffff' : s.textColor,
                    boxShadow: activeCategory === cat.slug ? `0 0 0 2px ${s.backgroundColor}, 0 0 0 4px ${s.primaryColor}` : 'none'
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Menu Content */}
      <main className="px-5 mt-6">
        {categories.map(cat => (
          <div key={cat.slug} id={`category-${cat.slug}`} className="mb-10 scroll-mt-48">
            <h2 className="text-lg font-extrabold mb-3 flex items-center gap-2">
              {cat.name}
              {cat.imageUrl && s.showCategoryImages && (
                <img src={cat.imageUrl} className="w-6 h-6 rounded-full object-cover" alt="" />
              )}
            </h2>
            {cat.description && s.showCategoryDescriptions && (
              <p className="text-sm opacity-70 mb-4 font-medium">{cat.description}</p>
            )}

            <CategoryBanners
              banners={(banners || []).filter(banner => banner.targetCategorySlug === cat.slug)}
              primaryColor={s.primaryColor}
            />

            <div className={`grid gap-4 ${s.layout === 'Grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {cat.products.map(product => (
                <ProductCard key={product.slug} product={product} s={s} />
              ))}
            </div>
          </div>
        ))}
      </main>

      <CompanyInfoDrawer
        open={showCompanyInfo}
        onClose={() => setShowCompanyInfo(false)}
        company={company}
        branch={branch}
        primaryColor={s.primaryColor}
        textColor={s.textColor}
      />
    </div>
  );
}

function CategoryBanners({
  banners,
  primaryColor,
}: {
  banners: PublicMenuResponse["banners"];
  primaryColor: string;
}) {
  const visibleBanners = banners
    .filter(banner => banner.imageUrl || banner.videoUrl)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (visibleBanners.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 -mx-1 overflow-x-auto hide-scrollbar">
      <div className="flex gap-3 px-1 pb-1 snap-x snap-mandatory">
        {visibleBanners.map((banner, index) => {
          const targetId = banner.targetProductSlug
            ? `product-${banner.targetProductSlug}`
            : `category-${banner.targetCategorySlug}`;

          return (
            <button
              key={`${banner.targetCategorySlug}-${banner.targetProductSlug || "category"}-${index}`}
              type="button"
              onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "center" })}
              className="relative min-w-[82%] sm:min-w-[360px] aspect-[16/7] overflow-hidden rounded-3xl bg-gray-100 shadow-sm snap-start active:scale-[0.99] transition"
              style={{ boxShadow: `0 8px 22px ${primaryColor}1f` }}
            >
              {banner.videoUrl ? (
                <video
                  src={banner.videoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={banner.imageUrl || ""}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CompanyInfoDrawer({
  open,
  onClose,
  company,
  branch,
  primaryColor,
  textColor,
}: {
  open: boolean;
  onClose: () => void;
  company: PublicMenuResponse["company"];
  branch: PublicMenuResponse["branch"];
  primaryColor: string;
  textColor: string;
}) {
  const contactItems = [
    { icon: Phone, label: "Telefon", value: branch.phone || company.phone, href: branch.phone || company.phone ? `tel:${branch.phone || company.phone}` : undefined },
    { icon: Mail, label: "E-posta", value: branch.email || company.email, href: branch.email || company.email ? `mailto:${branch.email || company.email}` : undefined },
    { icon: MapPin, label: "Adres", value: branch.address || company.address, href: company.googleMapsUrl },
    { icon: ExternalLink, label: "Web sitesi", value: company.website, href: company.website },
  ].filter(item => item.value);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Kapat"
            className="fixed inset-0 bg-black/35 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-[86vw] max-w-[380px] bg-white shadow-2xl rounded-r-[2rem] overflow-y-auto"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {company.logoUrl && (
                    <img src={company.logoUrl} alt={company.name} className="w-14 h-14 rounded-2xl object-contain border border-gray-100 bg-white" />
                  )}
                  <div className="min-w-0">
                    <h2 className="text-lg font-black leading-tight truncate" style={{ color: textColor }}>{company.name}</h2>
                    <p className="text-sm text-gray-500 font-semibold">{branch.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0 active:scale-95"
                  aria-label="Kapat"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {company.description && (
                <p className="mt-5 text-sm leading-6 text-gray-600 font-medium">{company.description}</p>
              )}

              {contactItems.length > 0 && (
                <div className="mt-6 space-y-3">
                  {contactItems.map(item => {
                    const Icon = item.icon;
                    const content = (
                      <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white shrink-0">
                          <Icon className="w-4 h-4" style={{ color: primaryColor }} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] font-black uppercase tracking-wide text-gray-400">{item.label}</div>
                          <div className="text-sm font-bold text-gray-800 break-words">{item.value}</div>
                        </div>
                      </div>
                    );

                    return item.href ? (
                      <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                        {content}
                      </a>
                    ) : (
                      <div key={item.label}>{content}</div>
                    );
                  })}
                </div>
              )}

              {company.socialLinks && company.socialLinks.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-black text-gray-900 mb-3">Sosyal Medya</h3>
                  <div className="flex flex-wrap gap-2">
                    {company.socialLinks.map(link => (
                      <a
                        key={`${link.platform}-${link.url}`}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-full text-xs font-black border border-gray-200 bg-white"
                        style={{ color: primaryColor }}
                      >
                        {formatSocialPlatform(link.platform)}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {company.workingHours && company.workingHours.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-black text-gray-900 mb-3">Çalışma Saatleri</h3>
                  <div className="rounded-2xl border border-gray-100 overflow-hidden">
                    {company.workingHours.map(hour => (
                      <div key={hour.dayOfWeek} className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0">
                        <span className="text-sm font-bold text-gray-700">{formatDay(hour.dayOfWeek)}</span>
                        <span className="text-sm font-black" style={{ color: hour.isClosed ? "#9CA3AF" : primaryColor }}>
                          {hour.isClosed ? "Kapalı" : `${hour.openTime} - ${hour.closeTime}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function formatDay(day: string) {
  const days: Record<string, string> = {
    Monday: "Pazartesi",
    Tuesday: "Salı",
    Wednesday: "Çarşamba",
    Thursday: "Perşembe",
    Friday: "Cuma",
    Saturday: "Cumartesi",
    Sunday: "Pazar",
  };

  return days[day] || day;
}

function formatSocialPlatform(platform: string) {
  return platform === "X" ? "Twitter/X" : platform;
}

function ProductCard({ product, s }: { product: any; s: any }) {
  if (s.layout === 'ListWithImage') {
    return (
      <motion.div 
        id={`product-${product.slug}`}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className="relative rounded-2xl overflow-hidden shadow-sm flex p-3 gap-3"
        style={{ backgroundColor: s.secondaryColor }}
      >
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="font-bold text-sm leading-tight" style={{ color: s.textColor }}>{product.name}</h3>
          {product.description && s.showProductDescriptions && (
            <p className="text-xs opacity-70 mt-1 leading-snug font-medium line-clamp-2">{product.description}</p>
          )}
          
          <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
            {s.showPreparationTime && product.preparationTimeMinutes > 0 && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-gray-100 rounded-md opacity-80 text-gray-700">
                <Clock className="w-2.5 h-2.5" /> {product.preparationTimeMinutes} dk
              </span>
            )}
            {s.showCalories && product.calories > 0 && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-white/50 rounded-md opacity-80 text-orange-600">
                <Flame className="w-2.5 h-2.5 text-orange-500" /> {product.calories} kcal
              </span>
            )}
            {s.showAllergens && product.allergens?.map((a: any) => (
              <span
                key={a.name}
                className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-black/5"
                style={{
                  backgroundColor: a.backgroundColor || "#FEF2F2",
                  color: a.textColor || "#DC2626",
                }}
              >
                {a.emoji && <span aria-hidden="true">{a.emoji}</span>}
                {a.name}
              </span>
            ))}
            {s.showTags && product.tags?.map((t: any) => (
              <span key={t.name} className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ backgroundColor: t.backgroundColor, color: t.textColor }}>
                {t.name}
              </span>
            ))}
          </div>

          {s.showPrices && (
            <div className="mt-auto font-bold text-sm" style={{ color: s.primaryColor }}>₺{product.price}</div>
          )}
        </div>
        
        {s.showProductImages && product.imageUrl && (
          <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100 relative">
            <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
          </div>
        )}
      </motion.div>
    );
  }

  // Grid or SimpleList
  return (
    <motion.div 
      id={`product-${product.slug}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`relative rounded-2xl overflow-hidden shadow-sm flex flex-col`}
      style={{ backgroundColor: s.secondaryColor }}
    >
      {s.layout === 'Grid' && s.showProductImages && product.imageUrl && (
        <div className="w-full h-32 bg-gray-100 relative">
          <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
          {product.price > 0 && s.showPrices && (
            <div 
              className="absolute bottom-2 right-2 px-2 py-1 rounded-lg font-bold text-xs shadow-lg backdrop-blur-md"
              style={{ backgroundColor: s.primaryColor, color: '#fff' }}
            >
              ₺{product.price}
            </div>
          )}
        </div>
      )}

      <div className={`p-4 flex flex-col flex-1 ${s.layout === 'SimpleList' ? 'flex-row items-center justify-between' : ''}`}>
        <div className="flex-1">
          <h3 className="font-bold text-sm leading-tight" style={{ color: s.textColor }}>{product.name}</h3>
          
          {product.description && s.showProductDescriptions && (
            <p className="text-xs opacity-70 mt-1 leading-snug font-medium line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 mt-2">
            {s.showPreparationTime && product.preparationTimeMinutes > 0 && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-gray-100 rounded-md opacity-80 text-gray-700">
                <Clock className="w-2.5 h-2.5" /> {product.preparationTimeMinutes} dk
              </span>
            )}
            {s.showCalories && product.calories > 0 && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-white/50 rounded-md opacity-80 text-orange-600">
                <Flame className="w-2.5 h-2.5 text-orange-500" /> {product.calories} kcal
              </span>
            )}
            {s.showAllergens && product.allergens?.map((a: any) => (
              <span
                key={a.name}
                className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-black/5"
                style={{
                  backgroundColor: a.backgroundColor || "#FEF2F2",
                  color: a.textColor || "#DC2626",
                }}
              >
                {a.emoji && <span aria-hidden="true">{a.emoji}</span>}
                {a.name}
              </span>
            ))}
            {s.showTags && product.tags?.map((t: any) => (
              <span key={t.name} className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ backgroundColor: t.backgroundColor, color: t.textColor }}>
                {t.name}
              </span>
            ))}
          </div>
        </div>

        {/* Price for Simple List or Grid without image */}
        {((s.layout === 'SimpleList') || (s.layout === 'Grid' && (!product.imageUrl || !s.showProductImages))) && s.showPrices && (
          <div className="ml-3 font-bold text-sm whitespace-nowrap" style={{ color: s.primaryColor }}>
            ₺{product.price}
          </div>
        )}
      </div>
    </motion.div>
  );
}
