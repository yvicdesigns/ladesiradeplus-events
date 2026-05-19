-- ============================================================
-- SEED DATA — Exécuter APRÈS schema.sql
-- ============================================================

-- ─── CATÉGORIES ──────────────────────────────────────────────

insert into categories (id, slug, service, name_fr, name_en, icon, sort_order) values
  -- Logistique
  ('11111111-0001-0000-0000-000000000001', 'chapiteaux-tentes',   'logistique', 'Chapiteaux & Tentes',    'Tents & Marquees',    '⛺', 1),
  ('11111111-0002-0000-0000-000000000001', 'tables-chaises',      'logistique', 'Tables & Chaises',       'Tables & Chairs',     '🪑', 2),
  ('11111111-0003-0000-0000-000000000001', 'sono-scene',          'logistique', 'Sono & Scène',           'Sound & Stage',       '🎤', 3),
  ('11111111-0004-0000-0000-000000000001', 'generateurs',         'logistique', 'Générateurs & Énergie',  'Generators & Power',  '⚡', 4),
  ('11111111-0005-0000-0000-000000000001', 'transport',           'logistique', 'Transport & Livraison',  'Transport & Delivery','🚚', 5),
  -- Traiteur
  ('22222222-0001-0000-0000-000000000002', 'cocktails-boissons',  'traiteur',   'Cocktails & Boissons',   'Cocktails & Drinks',  '🥂', 1),
  ('22222222-0002-0000-0000-000000000002', 'buffets-menus',       'traiteur',   'Buffets & Menus',        'Buffets & Menus',     '🍖', 2),
  ('22222222-0003-0000-0000-000000000002', 'gateaux-patisseries', 'traiteur',   'Gâteaux & Pâtisseries',  'Cakes & Pastries',    '🎂', 3),
  ('22222222-0004-0000-0000-000000000002', 'vaisselle-couverts',  'traiteur',   'Vaisselle & Couverts',   'Crockery & Cutlery',  '🍴', 4),
  ('22222222-0005-0000-0000-000000000002', 'personnel-service',   'traiteur',   'Personnel de service',   'Service Staff',       '👨‍🍳', 5),
  -- Décoration
  ('33333333-0001-0000-0000-000000000003', 'housses-chaises',     'decoration', 'Housses de chaises',     'Chair covers',        '💺', 1),
  ('33333333-0002-0000-0000-000000000003', 'nappes-tissus',       'decoration', 'Nappes & Tissus',        'Tablecloths & Fabrics','🪡', 2),
  ('33333333-0003-0000-0000-000000000003', 'arches-structures',   'decoration', 'Arches & Structures',    'Arches & Structures', '🌸', 3),
  ('33333333-0004-0000-0000-000000000003', 'lumieres-bougies',    'decoration', 'Lumières & Bougies',     'Lights & Candles',    '💡', 4),
  ('33333333-0005-0000-0000-000000000003', 'centres-table',       'decoration', 'Centres de table',       'Table centerpieces',  '🌺', 5),
  ('33333333-0006-0000-0000-000000000003', 'ballons-decoration',  'decoration', 'Ballons & Décoration',   'Balloons & Decoration','🎈', 6)
on conflict (slug) do nothing;

-- ─── ARTICLES ────────────────────────────────────────────────

insert into articles (slug, service, category_id, name_fr, name_en, description_fr, description_en, price_per_day, unit_fr, stock_available, images, is_active, is_featured) values

-- LOGISTIQUE
('chapiteau-blanc-100m2', 'logistique', '11111111-0001-0000-0000-000000000001',
 'Chapiteau blanc 100 m²', 'White marquee 100 m²',
 'Grand chapiteau blanc de 10 x 10 m, idéal pour 80 à 100 personnes. Structure aluminium, bâches PVC imperméables, montage et démontage inclus.',
 'Large white marquee 10x10m, ideal for 80 to 100 guests. Aluminium structure, waterproof PVC, assembly included.',
 150000, '/jour', 3,
 ARRAY['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80'],
 true, true),

('chapiteau-50m2', 'logistique', '11111111-0001-0000-0000-000000000001',
 'Chapiteau 50 m²', 'Marquee 50 m²',
 'Chapiteau de 5 x 10 m pour 40 à 50 personnes. Parfait pour les garden-parties et cocktails en extérieur.',
 'Marquee 5x10m for 40 to 50 guests. Perfect for garden parties and outdoor cocktails.',
 80000, '/jour', 5,
 ARRAY['https://images.unsplash.com/photo-1478146059778-26d1ee8f12e2?w=800&q=80'],
 true, false),

('table-ronde-10-personnes', 'logistique', '11111111-0002-0000-0000-000000000001',
 'Table ronde 10 personnes', 'Round table 10 persons',
 'Table ronde Ø 180 cm, capacité 10 personnes. Plateau en bois stratifié, pieds métal réglables.',
 'Round table Ø 180 cm, capacity 10 persons. Laminated wood top, adjustable metal legs.',
 3000, '/table/jour', 50,
 ARRAY['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'],
 true, true),

('chaise-tiffany-blanche', 'logistique', '11111111-0002-0000-0000-000000000001',
 'Chaise Tiffany blanche', 'White Tiffany chair',
 'Chaise Tiffany en résine blanche, elegante et résistante. Empilable pour faciliter la logistique. Stock : 300 unités.',
 'White resin Tiffany chair, elegant and sturdy. Stackable. Stock: 300 units.',
 500, '/chaise/jour', 300,
 ARRAY['https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80'],
 true, false),

('systeme-sono-professionnel', 'logistique', '11111111-0003-0000-0000-000000000001',
 'Système sono professionnel', 'Professional sound system',
 'Pack sono complet : 2 enceintes actives 1200W, 1 caisson de basses, console 12 voies, micro HF, câblage.',
 'Complete sound system: 2 active 1200W speakers, 1 subwoofer, 12-channel mixer, wireless mic.',
 75000, '/jour', 4,
 ARRAY['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'],
 true, true),

('scene-podium-modulable', 'logistique', '11111111-0003-0000-0000-000000000001',
 'Scène / Podium modulable', 'Modular stage / Podium',
 'Scène modulable en sections de 1 m², hauteur 40 ou 80 cm. Capacité jusqu''à 6 x 4 m.',
 'Modular stage in 1 m² sections, height 40 or 80 cm. Capacity up to 6 x 4 m.',
 50000, '/module/jour', 20,
 ARRAY['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80'],
 true, false),

('generateur-10kva', 'logistique', '11111111-0004-0000-0000-000000000001',
 'Générateur 10 KVA', '10 KVA generator',
 'Groupe électrogène silencieux 10 KVA, autonomie 12h (plein inclus). Idéal pour alimentation extérieure.',
 'Silent 10 KVA generator, 12h autonomy (fuel included). Ideal for outdoor power supply.',
 45000, '/jour', 6,
 ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
 true, false),

-- TRAITEUR
('buffet-gala-100-personnes', 'traiteur', '22222222-0002-0000-0000-000000000002',
 'Buffet gala — 100 personnes', 'Gala buffet — 100 persons',
 'Buffet complet pour 100 personnes : entrées froides & chaudes, plats principaux, accompagnements, desserts. Service en gants blancs inclus.',
 'Complete buffet for 100 persons: cold & hot starters, main courses, sides, desserts. White glove service included.',
 850000, '/événement', 10,
 ARRAY['https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80'],
 true, true),

('cocktail-dinatoire-50-personnes', 'traiteur', '22222222-0001-0000-0000-000000000002',
 'Cocktail dînatoire — 50 personnes', 'Dinner cocktail — 50 persons',
 'Formule cocktail dînatoire pour 50 personnes : canapés variés, verrines, mini-brochettes, pièces sucrées, boissons.',
 'Dinner cocktail for 50 persons: varied canapés, verrines, mini skewers, sweet pieces, drinks.',
 320000, '/événement', 15,
 ARRAY['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80'],
 true, true),

('piece-montee-mariage', 'traiteur', '22222222-0003-0000-0000-000000000002',
 'Pièce montée mariage', 'Wedding cake',
 'Pièce montée sur mesure pour mariage : 3 à 5 étages, choux ou génoise, parfum au choix. Livraison et mise en place incluses.',
 'Custom wedding cake: 3 to 5 tiers, choux or sponge, flavor of choice. Delivery and setup included.',
 120000, '/pièce', 5,
 ARRAY['https://images.unsplash.com/photo-1478146059778-26d1ee8f12e2?w=800&q=80'],
 true, true),

('vaisselle-elegante-100-couverts', 'traiteur', '22222222-0004-0000-0000-000000000002',
 'Vaisselle élégante — 100 couverts', 'Elegant crockery — 100 settings',
 'Location vaisselle complète pour 100 couverts : assiettes, couverts inox, verres, tasses. Livraison et récupération incluses.',
 'Complete crockery for 100 settings: plates, stainless cutlery, glasses, cups. Delivery and collection included.',
 75000, '/événement', 8,
 ARRAY['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80'],
 true, false),

('serveurs-professionnels', 'traiteur', '22222222-0005-0000-0000-000000000002',
 'Serveurs professionnels', 'Professional waiters',
 'Serveurs professionnels en tenue (chemise blanche, nœud papillon). Expérimentés en service à table, cocktail et buffet.',
 'Professional waiters in uniform. Experienced in table service, cocktail and buffet.',
 25000, '/serveur/jour', 20,
 ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'],
 true, false),

('bar-boissons-premium', 'traiteur', '22222222-0001-0000-0000-000000000002',
 'Bar à boissons premium', 'Premium drinks bar',
 'Formule bar pour 80 personnes : jus frais, sodas, eau, thé & café, mocktails maison. Barman professionnel inclus.',
 'Bar formula for 80 persons: fresh juices, sodas, water, tea & coffee, house mocktails. Barman included.',
 180000, '/événement', 8,
 ARRAY['https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80'],
 true, false),

-- DÉCORATION
('housse-chaise-blanche', 'decoration', '33333333-0001-0000-0000-000000000003',
 'Housse de chaise blanche', 'White chair cover',
 'Housse élégante en tissu satin ivoire. S''adapte à toutes les chaises standard. Comprend un nœud de décoration.',
 'Elegant ivory satin fabric cover. Fits all standard chairs. Includes a decorative bow.',
 500, '/housse/jour', 200,
 ARRAY['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80','https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80'],
 true, true),

('housse-chaise-bordeaux', 'decoration', '33333333-0001-0000-0000-000000000003',
 'Housse de chaise bordeaux', 'Burgundy chair cover',
 'Housse en velours bordeaux pour un rendu luxueux. Parfaite pour les événements d''automne et dîners de gala.',
 'Burgundy velvet cover for a luxurious look. Perfect for autumn events and gala dinners.',
 600, '/housse/jour', 150,
 ARRAY['https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80'],
 true, false),

('nappe-ivoire-ronde', 'decoration', '33333333-0002-0000-0000-000000000003',
 'Nappe ivoire ronde', 'Ivory round tablecloth',
 'Nappe ronde en jacquard ivoire, pour tables de 150 à 180 cm. Tombé élégant jusqu''au sol.',
 'Round ivory jacquard tablecloth, for tables 150 to 180 cm. Elegant drape to the floor.',
 1500, '/nappe/jour', 80,
 ARRAY['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80'],
 true, true),

('nappe-rectangulaire-or', 'decoration', '33333333-0002-0000-0000-000000000003',
 'Nappe rectangulaire dorée', 'Gold rectangular tablecloth',
 'Nappe rectangulaire en tissu brillant doré, pour tables de 2m40 x 1m20. Idéale pour tables d''honneur.',
 'Gold shiny fabric tablecloth, for 2.40m x 1.20m tables. Ideal for head tables and buffets.',
 2000, '/nappe/jour', 40,
 ARRAY['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'],
 true, false),

('arche-florale-blanche', 'decoration', '33333333-0003-0000-0000-000000000003',
 'Arche florale blanche', 'White floral arch',
 'Arche florale en fleurs artificielles blanches et dorées. 2m50 x 2m. Structure métal blanc incluse.',
 'Floral arch in white and gold artificial flowers. 2.50m x 2m. White metal structure included.',
 35000, '/jour', 5,
 ARRAY['https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80','https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80'],
 true, true),

('arche-ballon-rose-gold', 'decoration', '33333333-0003-0000-0000-000000000003',
 'Arche ballons rose gold', 'Rose gold balloon arch',
 'Arche de ballons rose gold et blanc, ~150 ballons premium. Montage et démontage inclus.',
 'Rose gold and white balloon arch, ~150 premium balloons. Assembly and disassembly included.',
 25000, '/jour', 3,
 ARRAY['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80'],
 true, true),

('chandelier-cristal', 'decoration', '33333333-0004-0000-0000-000000000003',
 'Chandelier en cristal', 'Crystal chandelier',
 'Chandelier en cristal avec 12 bougies LED. Hauteur réglable 60cm à 1m80. Ambiance romantique et luxueuse.',
 'Crystal chandelier with 12 LED candles. Adjustable height 60cm to 1.80m.',
 8000, '/pièce/jour', 20,
 ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
 true, true),

('guirlande-lumineuse-led', 'decoration', '33333333-0004-0000-0000-000000000003',
 'Guirlande lumineuse LED', 'LED fairy lights',
 'Guirlande de 10 mètres avec 100 LEDs chaudes. Pour plafonds, arbres ou structures.',
 '10-meter garland with 100 warm LEDs. For ceilings, trees or structures.',
 1500, '/guirlande/jour', 50,
 ARRAY['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80'],
 true, false),

('centre-table-floral', 'decoration', '33333333-0005-0000-0000-000000000003',
 'Centre de table floral', 'Floral table centerpiece',
 'Centre de table avec vase en verre, fleurs et décorations dorées. Hauteur 50cm. Personnalisable.',
 'Table centerpiece with glass vase, flowers and golden decorations. Height 50cm.',
 5000, '/pièce/jour', 30,
 ARRAY['https://images.unsplash.com/photo-1478146059778-26d1ee8f12e2?w=800&q=80'],
 true, false),

('rideau-paillettes-or', 'decoration', '33333333-0006-0000-0000-000000000003',
 'Rideau paillettes dorées', 'Gold sequin curtain',
 'Rideau de paillettes dorées étincelantes. 2m x 2m. Backdrop photo, table d''honneur ou scène.',
 'Sparkling gold sequin curtain. 2m x 2m. Photo backdrop, head table or stage.',
 7500, '/rideau/jour', 10,
 ARRAY['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'],
 true, true),

('set-ballons-or-blanc', 'decoration', '33333333-0006-0000-0000-000000000003',
 'Set ballons or & blanc', 'Gold & white balloon set',
 'Set de 50 ballons or et blanc en latex premium. Gonflage à l''hélium inclus.',
 'Set of 50 gold and white premium latex balloons. Helium inflation included.',
 10000, '/set/jour', 15,
 ARRAY['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80'],
 true, false)

on conflict (slug) do nothing;
