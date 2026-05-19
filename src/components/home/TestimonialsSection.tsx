"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { mockTestimonials } from "@/data/mock";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-sm ${i < rating ? "text-gold" : "text-gray-600"}`}>★</span>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 md:py-28 bg-charcoal relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="section-subtitle">Ils nous font confiance</p>
          <h2 className="section-title">Témoignages clients</h2>
          <div className="separator-gold mt-4" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={24}
            breakpoints={{ 768: { slidesPerView: 2 } }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            className="pb-12"
          >
            {mockTestimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="glass-card rounded-2xl p-6 h-full hover-gold-border transition-all duration-300 mx-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-gold/30">
                      <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div>
                      <p className="font-semibold text-off-white text-sm">{t.name}</p>
                      <p className="text-xs text-gold">{t.event}</p>
                      <StarRating rating={t.rating} />
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed italic">&quot;{t.text_fr}&quot;</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}
