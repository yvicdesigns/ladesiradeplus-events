import Link from "next/link";
import { MessageCircle, ExternalLink } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">✿</span>
              <div>
                <span className="font-playfair font-bold text-xl text-gold block leading-none">
                  La Désirade
                </span>
                <span className="text-xs text-gray-400 tracking-widest uppercase">
                  Événements
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Location de matériel de décoration événementielle haut de gamme à Brazzaville.
              Sublimez vos mariages, anniversaires et cérémonies.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-all">
                <span className="text-sm">📸</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-all">
                <ExternalLink className="w-4 h-4" />
              </a>
              <a href={`https://wa.me/242064000000`} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="font-playfair text-gold font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { href: "/", label: "Accueil" },
                { href: "/catalogue", label: "Catalogue" },
                { href: "/panier", label: "Mon panier" },
                { href: "/connexion", label: "Connexion" },
                { href: "/inscription", label: "Inscription" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-playfair text-gold font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Brazzaville, République du Congo</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📱</span>
                <a href="https://wa.me/242064000000" className="hover:text-gold transition-colors">
                  +242 064 000 000
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span>📧</span>
                <a href="mailto:contact@ladesirade-evenements.com" className="hover:text-gold transition-colors">
                  contact@ladesirade.com
                </a>
              </li>
            </ul>
            <a
              href="https://wa.me/242064000000"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 btn-whatsapp px-4 py-2 rounded-full text-sm font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              Nous contacter
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {year} La Désirade Événements — Brazzaville 🇨🇬</p>
          <p>Développé avec ❤️ pour sublimer vos événements</p>
        </div>
      </div>
    </footer>
  );
}
