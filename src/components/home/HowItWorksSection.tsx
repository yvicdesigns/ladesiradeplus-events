"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: "🔍",
    title_fr: "Parcourez",
    title_en: "Browse",
    description_fr: "Explorez notre catalogue complet et choisissez votre matériel de décoration parmi plus de 50 articles disponibles.",
    description_en: "Explore our complete catalogue and choose your decoration equipment from over 50 available items.",
  },
  {
    number: "02",
    icon: "🛒",
    title_fr: "Composez",
    title_en: "Compose",
    description_fr: "Ajoutez les articles souhaités à votre panier avec les quantités désirées. Modifiez à tout moment.",
    description_en: "Add desired items to your cart with required quantities. Modify at any time.",
  },
  {
    number: "03",
    icon: "💬",
    title_fr: "Confirmez",
    title_en: "Confirm",
    description_fr: "Envoyez votre commande via WhatsApp en un clic. Nous confirmons la disponibilité et organisons la livraison.",
    description_en: "Send your order via WhatsApp with one click. We confirm availability and arrange delivery.",
  },
];

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-charcoal relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-subtitle">Simple & rapide</p>
          <h2 className="section-title">Comment ça marche ?</h2>
          <div className="separator-gold mt-4" />
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="absolute top-16 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative text-center group"
              >
                {/* Number badge */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold transition-all duration-300">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gold text-charcoal-deep text-xs font-bold flex items-center justify-center font-playfair">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-playfair text-xl font-bold text-off-white mb-3 group-hover:text-gold transition-colors">
                  {step.title_fr}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description_fr}</p>

                {/* Arrow (mobile) */}
                {i < steps.length - 1 && (
                  <div className="flex justify-center mt-6 md:hidden">
                    <span className="text-gold text-2xl">↓</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
