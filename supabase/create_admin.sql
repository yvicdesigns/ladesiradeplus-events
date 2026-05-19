-- ============================================================
-- CRÉER COMPTE ADMIN — Exécuter dans Supabase SQL Editor
-- ============================================================
-- Email  : yvicdesigns@gmail.com
-- Mot de passe : LaDesiradeAdmin2024!
-- ============================================================

DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Vérifie si l'utilisateur existe déjà
  SELECT id INTO admin_id
  FROM auth.users
  WHERE email = 'yvicdesigns@gmail.com';

  IF admin_id IS NULL THEN
    -- Crée le compte dans auth.users
    admin_id := gen_random_uuid();

    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    ) VALUES (
      admin_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'yvicdesigns@gmail.com',
      crypt('LaDesiradeAdmin2024!', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      '{"full_name": "Admin La Désirade"}'::jsonb,
      now(),
      now(),
      '',
      ''
    );

    RAISE NOTICE 'Compte admin créé avec ID: %', admin_id;
  ELSE
    RAISE NOTICE 'Utilisateur existant trouvé, ID: %', admin_id;
  END IF;

  -- Crée ou met à jour le profil admin
  INSERT INTO public.profiles (id, role, first_name, last_name)
  VALUES (admin_id, 'admin', 'Admin', 'La Désirade')
  ON CONFLICT (id) DO UPDATE SET role = 'admin';

  RAISE NOTICE 'Rôle admin attribué avec succès.';
END $$;
