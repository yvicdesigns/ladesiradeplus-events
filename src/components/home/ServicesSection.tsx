"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/mock";

const serviceColors: Record<string, string> = {
  logistique: "from-blue-500/20 to-blue-900/10 border-blue-500/20 hover:border-blue-400/40",
  traiteur: "from-amber-500/20 to-amber-900/10 border-amber-500/20 hover:border-amber-400/40",
  decoration: "from-gold/20 to-gold-dark/10 border-gold/20 hover:border-gold/50",
};

const serviceAccent: Record<string, string> = {
  logistique: "text-blue-400",
  traiteur: "text-amber-400",
  decoration: "text-gold",
};

export function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-charcoal-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="section-subtitle">Tout pour votre événement</p>
          <h2 className="section-title">Nos 3 pôles de services</h2>
          <div className="separator-gold mt-4 mb-4" />
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            De la logistique à la décoration en passant par la restauration — un seul prestataire de confiance pour un événement parfait à Brazzaville.
          </p>
        </motion.div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
            >
              <Link
                href={service.href}
                className={`group block rounded-3xl overflow-hidden border bg-gradient-to-br ${serviceColors[service.key]} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name_fr}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/80 to-transparent" />
                  <span className="absolute top-4 left-4 text-4xl">{service.icon}</span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className={`font-playfair text-2xl font-bold mb-1 ${serviceAccent[service.key]}`}>
                    {service.name_fr}
                  </h3>
                  <p className="text-off-white font-medium text-sm mb-3 italic">
                    &ldquo;{service.tagline_fr}&rdquo;
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">
                    {service.description_fr}
                  </p>
                  <div className={`flex items-center gap-2 text-sm font-semibold ${serviceAccent[service.key]} group-hover:gap-3 transition-all`}>
                    Voir le catalogue
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
