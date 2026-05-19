"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Globe, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cart";

const services = [
  { href: "/logistique", label_fr: "Logistique", label_en: "Logistics", icon: "🏗️", desc_fr: "Chapiteaux, tables, sono, scène" },
  { href: "/traiteur", label_fr: "Traiteur", label_en: "Catering", icon: "🍽️", desc_fr: "Buffets, cocktails, pâtisseries" },
  { href: "/decoration", label_fr: "Décoration", label_en: "Decoration", icon: "✨", desc_fr: "Arches, nappes, lumières" },
];

const navLinks = [
  { href: "/", label_fr: "Accueil", label_en: "Home" },
  { href: "/#about", label_fr: "À propos", label_en: "About" },
  { href: "/#contact", label_fr: "Contact", label_en: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [locale, setLocale] = useState<"fr" | "en">("fr");
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const t = (fr: string, en: string) => (locale === "fr" ? fr : en);

  const activeService = services.find((s) => pathname.startsWith(s.href));

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-charcoal-deep/95 backdrop-blur-md shadow-lg border-b border-gold/10"
            : "bg-transparent"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <span className="text-2xl">✿</span>
              <div>
                <span className="font-playfair font-bold text-lg text-gold leading-none block">
                  La Désirade
                </span>
                <span className="text-xs text-gray-400 tracking-widest uppercase leading-none">
                  Événements
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Services dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeService ? "text-gold" : "text-gray-300 hover:text-gold"
                }`}>
                  {activeService ? (
                    <><span>{activeService.icon}</span>{t(activeService.label_fr, activeService.label_en)}</>
                  ) : (
                    t("Nos services", "Our services")
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-72 glass-card-charcoal rounded-2xl p-2 border border-gold/20 shadow-gold"
                    >
                      {services.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${
                            pathname.startsWith(service.href)
                              ? "bg-gold/10 text-gold"
                              : "hover:bg-gold/5 text-gray-300 hover:text-gold"
                          }`}
                        >
                          <span className="text-xl mt-0.5">{service.icon}</span>
                          <div>
                            <p className="font-semibold text-sm">{t(service.label_fr, service.label_en)}</p>
                            <p className="text-xs text-gray-500 group-hover:text-gray-400">{service.desc_fr}</p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    pathname === link.href ? "text-gold" : "text-gray-300 hover:text-gold"
                  }`}
                >
                  {t(link.label_fr, link.label_en)}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Language toggle */}
              <button
                onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
                className="hidden sm:flex items-center gap-1 text-xs text-gray-400 hover:text-gold transition-colors px-2 py-1 rounded-full border border-gray-700 hover:border-gold"
              >
                <Globe className="w-3 h-3" />
                <span>{locale === "fr" ? "🇫🇷" : "🇬🇧"}</span>
              </button>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-gray-300 hover:text-gold transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-charcoal-deep text-[10px] font-bold flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {/* CTA */}
              <Link
                href="/decoration"
                className="hidden lg:flex btn-gold px-4 py-2 rounded-full text-sm font-semibold"
              >
                {t("Commander", "Order now")}
              </Link>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-gray-300 hover:text-gold transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-72 bg-charcoal glass-card-charcoal flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-gold/20">
              <span className="font-playfair text-gold font-bold">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-gold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
              {/* Services */}
              <p className="text-xs text-gold uppercase tracking-widest px-3 mb-2">Nos services</p>
              {services.map((service, i) => (
                <motion.div
                  key={service.href}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={service.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                      pathname.startsWith(service.href)
                        ? "bg-gold/10 text-gold"
                        : "text-off-white hover:bg-gold/5 hover:text-gold"
                    }`}
                  >
                    <span className="text-xl">{service.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{t(service.label_fr, service.label_en)}</p>
                      <p className="text-xs text-gray-500">{service.desc_fr}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}

              <div className="my-3 h-px bg-gold/10" />

              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 text-sm text-gray-300 hover:text-gold transition-colors rounded-xl hover:bg-gold/5"
                  >
                    {t(link.label_fr, link.label_en)}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="px-4 pb-6 space-y-3">
              <Link
                href="/decoration"
                onClick={() => setMobileOpen(false)}
                className="btn-gold w-full text-center py-3 rounded-full font-semibold block text-sm"
              >
                {t("Passer une commande", "Place an order")}
              </Link>
              <button
                onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-gold transition-colors mx-auto"
              >
                <Globe className="w-4 h-4" />
                {locale === "fr" ? "🇫🇷 Français" : "🇬🇧 English"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
