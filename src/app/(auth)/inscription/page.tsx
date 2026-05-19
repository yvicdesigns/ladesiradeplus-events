"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function InscriptionPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
          full_name: `${form.firstName} ${form.lastName}`,
        },
      },
    });

    if (error) {
      setError(
        error.message === "User already registered"
          ? "Un compte existe déjà avec cet email. Connectez-vous."
          : error.message
      );
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/mon-espace");
      router.refresh();
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-charcoal-deep flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="font-playfair text-3xl font-bold text-off-white mb-3">Vérifiez votre email</h2>
          <p className="text-gray-400 mb-6">
            Un lien de confirmation a été envoyé à <strong className="text-gold">{form.email}</strong>.
            Cliquez sur le lien pour activer votre compte.
          </p>
          <Link href="/connexion" className="btn-gold px-8 py-3 rounded-full font-semibold inline-block">
            Retour à la connexion
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-deep flex items-center justify-center px-4 py-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card-charcoal rounded-3xl p-8 border border-gold/20">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-3xl">✿</span>
              <div className="text-left">
                <span className="font-playfair font-bold text-lg text-gold block leading-none">La Désirade</span>
                <span className="text-xs text-gray-400 tracking-widest uppercase">Événements</span>
              </div>
            </Link>
            <h1 className="font-playfair text-2xl font-bold text-off-white mt-6 mb-2">Créer un compte</h1>
            <p className="text-gray-400 text-sm">Rejoignez La Désirade Événements</p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="firstName"
                    type="text"
                    placeholder="Marie"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-3 pl-9 pr-3 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Nom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Nzouzi"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-3 pl-9 pr-3 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-3 pl-10 pr-4 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Téléphone (Congo)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="phone"
                  type="tel"
                  placeholder="+242 064 000 000"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-3 pl-10 pr-4 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 caractères"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={handleChange}
                  className="w-full bg-charcoal-soft border border-gold/20 focus:border-gold rounded-xl py-3 pl-10 pr-10 text-sm text-off-white placeholder:text-gray-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3.5 rounded-xl font-bold text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-charcoal-deep/30 border-t-charcoal-deep rounded-full animate-spin" />
                  Création du compte...
                </>
              ) : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Déjà un compte ?{" "}
            <Link href="/connexion" className="text-gold hover:text-gold-light transition-colors font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
