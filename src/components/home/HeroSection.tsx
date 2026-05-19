"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, MessageCircle, Sparkles } from "lucide-react";
import { getWhatsAppContactLink } from "@/lib/whatsapp";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
  color: string;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      size: Math.random() * 3 + 1,
      color: Math.random() > 0.5 ? "#C9A84C" : "#E8C96D",
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.002;

        if (p.opacity <= 0 || p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.opacity = Math.random() * 0.6 + 0.2;
          p.vy = -Math.random() * 0.6 - 0.2;
        }
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="particle-canvas" />;
}

const typewriterPhrases = [
  { fr: "Sublimez vos événements", en: "Elevate your events" },
  { fr: "Créez des souvenirs inoubliables", en: "Create unforgettable memories" },
  { fr: "La magie de la décoration", en: "The magic of decoration" },
];

export function HeroSection() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const phrase = typewriterPhrases[phraseIndex].fr;
    if (typing) {
      if (displayed.length < phrase.length) {
        const t = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2500);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
        return () => clearTimeout(t);
      } else {
        setPhraseIndex((i) => (i + 1) % typewriterPhrases.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, phraseIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=85')`,
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-deep/40 via-charcoal-deep/60 to-charcoal-deep/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-deep/50 to-transparent" />

      {/* Particles */}
      <ParticleCanvas />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-gold/30 text-sm text-gold mb-8"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>✨ Livraison à domicile disponible à Brazzaville</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-off-white leading-tight mb-4"
        >
          {displayed}
          <span className="animate-pulse text-gold">|</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Location de matériel de décoration haut de gamme à{" "}
          <span className="text-gold font-semibold">Brazzaville</span>.
          Mariages, anniversaires, conférences — nous sublimions chaque événement.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/catalogue"
            className="btn-gold px-8 py-4 rounded-full font-bold text-base w-full sm:w-auto text-center shadow-gold"
          >
            ✨ Explorer le catalogue
          </Link>
          <a
            href={getWhatsAppContactLink("fr")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold px-8 py-4 rounded-full font-semibold text-base w-full sm:w-auto text-center flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Nous contacter sur WhatsApp
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6 text-gold opacity-70" />
      </motion.div>
    </section>
  );
}
