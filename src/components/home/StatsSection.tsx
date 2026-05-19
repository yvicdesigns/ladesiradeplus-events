"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 200, suffix: "+", label_fr: "Événements décorés", label_en: "Events decorated", icon: "🎉" },
  { value: 98, suffix: "%", label_fr: "Clients satisfaits", label_en: "Satisfied clients", icon: "⭐" },
  { value: 50, suffix: "+", label_fr: "Articles disponibles", label_en: "Items available", icon: "🎀" },
  { value: 5, suffix: "+", label_fr: "Ans d'expérience", label_en: "Years of experience", icon: "📍" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const step = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold font-playfair text-gradient-gold">
      {count}{suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 md:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-deep via-charcoal to-charcoal-deep" />
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-subtitle">Notre bilan</p>
          <h2 className="section-title">La confiance de nos clients</h2>
          <div className="separator-gold mt-4" />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="glass-card rounded-2xl p-6 text-center hover-gold-border group"
            >
              <span className="text-3xl mb-3 block">{stat.icon}</span>
              <Counter target={stat.value} suffix={stat.suffix} />
              <p className="text-gray-400 text-sm mt-2 group-hover:text-gray-300 transition-colors">
                {stat.label_fr}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
