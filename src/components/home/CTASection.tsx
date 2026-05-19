"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { getWhatsAppContactLink } from "@/lib/whatsapp";

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="contact"
      className="py-20 md:py-28 relative overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&q=60')" }}
      />
      <div className="absolute inset-0 bg-charcoal-deep/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-deep via-transparent to-charcoal-deep" />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="section-subtitle">Prêt à commencer ?</p>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-off-white leading-tight mb-6">
            Créez un événement{" "}
            <span className="text-gradient-gold">inoubliable</span>
          </h2>
          <p className="text-gray-300 text-sm md:text-base mb-10 max-w-xl mx-auto">
            Contactez-nous sur WhatsApp pour discuter de votre projet. Devis gratuit,
            réponse rapide, livraison à domicile disponible dans tout Brazzaville.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={getWhatsAppContactLink("fr")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp flex items-center gap-3 px-8 py-4 rounded-full font-bold text-base shadow-lg w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-6 h-6" />
              +242 064 000 000
            </a>
            <a
              href="tel:+242064000000"
              className="btn-outline-gold flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base w-full sm:w-auto justify-center"
            >
              <Phone className="w-5 h-5" />
              Appeler maintenant
            </a>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-gray-400">
            {["📍 Brazzaville, Congo", "🚚 Livraison à domicile", "⚡ Réponse rapide"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
