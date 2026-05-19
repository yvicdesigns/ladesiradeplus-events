-- ============================================================
-- PROMOUVOIR UN UTILISATEUR EN ADMIN
-- ============================================================
-- 1. D'abord créez votre compte sur /inscription du site
-- 2. Ensuite exécutez ce script dans Supabase SQL Editor
-- ============================================================

UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'yvicdesigns@gmail.com'
);

-- Vérification
SELECT u.email, p.role, p.first_name, p.last_name
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'yvicdesigns@gmail.com';
