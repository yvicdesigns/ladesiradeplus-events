-- ============================================================
-- SUPABASE STORAGE — Bucket images
-- Exécuter dans Supabase Dashboard > SQL Editor
-- ============================================================

-- Créer le bucket public "images"
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/jpg']
) ON CONFLICT (id) DO NOTHING;

-- Lecture publique (tout le monde peut voir les images)
DROP POLICY IF EXISTS "Images publicly readable" ON storage.objects;
CREATE POLICY "Images publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

-- Upload réservé aux utilisateurs connectés (admin uniquement via middleware)
DROP POLICY IF EXISTS "Authenticated can upload images" ON storage.objects;
CREATE POLICY "Authenticated can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Suppression réservée aux utilisateurs connectés
DROP POLICY IF EXISTS "Authenticated can delete images" ON storage.objects;
CREATE POLICY "Authenticated can delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'images' AND auth.role() = 'authenticated');
