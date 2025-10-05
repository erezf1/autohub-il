-- Add Hyundai with the CSV spelling if it doesn't exist (different from existing הונדאי)
INSERT INTO public.vehicle_makes (name_hebrew, name_english, is_active)
VALUES ('יונדאי', 'Hyundai Alt', true)
ON CONFLICT (name_hebrew) DO NOTHING;

-- Add all Toyota models
INSERT INTO public.vehicle_models (make_id, name_hebrew, name_english, is_active)
SELECT m.id, v.name_hebrew, v.name_english, true
FROM (VALUES
  ('C-HR', 'C-HR'),
  ('FJ קרוזר', 'FJ Cruiser'),
  ('GT86', 'GT86'),
  ('MR 2', 'MR 2'),
  ('RAV4', 'RAV4'),
  ('bZ4X', 'bZ4X'),
  ('iQ', 'iQ'),
  ('אוולון', 'Avalon'),
  ('אוונסיס', 'Avensis'),
  ('אוריס', 'Auris'),
  ('אייגו', 'Aygo'),
  ('אייגו X', 'Aygo X'),
  ('גראנד היילנדר', 'Grand Highlander'),
  ('הייאס', 'Hiace'),
  ('היילנדר', 'Highlander'),
  ('היילקס', 'Hilux'),
  ('היילקס ויגו', 'Hilux Vigo'),
  ('ונזה', 'Venza'),
  ('ורסו', 'Verso'),
  ('ורסו-S', 'Verso-S'),
  ('טאקומה', 'Tacoma'),
  ('טונדרה', 'Tundra'),
  ('יאריס', 'Yaris'),
  ('יאריס GR', 'Yaris GR'),
  ('יאריס קרוס', 'Yaris Cross'),
  ('לנד קרוזר', 'Land Cruiser'),
  ('סופרה', 'Supra'),
  ('סטארלט', 'Starlet'),
  ('סיינה', 'Sienna'),
  ('סליקה', 'Celica'),
  ('סקויה', 'Sequoia'),
  ('פור-ראנר', '4Runner'),
  ('פרואייס', 'Proace'),
  ('פרואייס סיטי', 'Proace City'),
  ('פריוויה', 'Previa'),
  ('פריוס', 'Prius'),
  ('פריוס פלוס', 'Prius Plus'),
  ('קאמרי', 'Camry'),
  ('קורולה', 'Corolla'),
  ('קורולה ורסו', 'Corolla Verso'),
  ('קורולה קרוס', 'Corolla Cross'),
  ('קראון', 'Crown'),
  ('קרינה', 'Carina')
) AS v(name_hebrew, name_english)
CROSS JOIN public.vehicle_makes m
WHERE m.name_hebrew = 'טויוטה'
ON CONFLICT (make_id, name_hebrew) DO NOTHING;

-- Add all Hyundai models (using יונדאי spelling)
INSERT INTO public.vehicle_models (make_id, name_hebrew, name_english, is_active)
SELECT m.id, v.name_hebrew, v.name_english, true
FROM (VALUES
  ('אקסנט', 'Accent'),
  ('H-1 / i800', 'H-1 / i800'),
  ('H100', 'H100'),
  ('H350', 'H350'),
  ('I20 קרוס', 'I20 Cross'),
  ('I20N', 'I20N'),
  ('I30N', 'I30N'),
  ('I35', 'I35'),
  ('i10', 'i10'),
  ('i20', 'i20'),
  ('i30', 'i30'),
  ('i40', 'i40'),
  ('ix20', 'ix20'),
  ('ix35', 'ix35'),
  ('ix55', 'ix55'),
  ('אטוס', 'Atos'),
  ('איוניק', 'Ioniq'),
  ('איוניק 5', 'Ioniq 5'),
  ('איוניק 5 N', 'Ioniq 5 N'),
  ('איוניק 6', 'Ioniq 6'),
  ('אלנטרה', 'Elantra'),
  ('אקסנט i25', 'Accent i25'),
  ('באיון', 'Bayon'),
  ('ג''נסיס', 'Genesis'),
  ('גאלופר', 'Galloper'),
  ('גטס', 'Getz'),
  ('גרנדיור', 'Grandeur'),
  ('ולוסטר', 'Veloster'),
  ('וניו', 'Venue'),
  ('טאראקן', 'Tarakan'),
  ('טוסון', 'Tucson'),
  ('טרג''ט', 'Trajet'),
  ('לנטרה', 'Lantra'),
  ('מטריקס', 'Matrix'),
  ('סונטה', 'Sonata'),
  ('סטאריה', 'Staria'),
  ('סנטה פה', 'Santa Fe'),
  ('פליסדה', 'Palisade'),
  ('קונה', 'Kona'),
  ('קופה', 'Coupe')
) AS v(name_hebrew, name_english)
CROSS JOIN public.vehicle_makes m
WHERE m.name_hebrew = 'יונדאי'
ON CONFLICT (make_id, name_hebrew) DO NOTHING;

-- Add all Ford models
INSERT INTO public.vehicle_models (make_id, name_hebrew, name_english, is_active)
SELECT m.id, v.name_hebrew, v.name_english, true
FROM (VALUES
  ('F-150', 'F-150'),
  ('F-250', 'F-250'),
  ('F-350', 'F-350'),
  ('S-מקס', 'S-Max'),
  ('אדג''', 'Edge'),
  ('אסקורט', 'Escort'),
  ('אסקייפ', 'Escape'),
  ('אקונוליין', 'Econoline'),
  ('אקספדישן', 'Expedition'),
  ('אקספלורר', 'Explorer'),
  ('ברונקו', 'Bronco'),
  ('ברונקו ספורט', 'Bronco Sport'),
  ('גלאקסי', 'Galaxy'),
  ('ווינדסטאר', 'Windstar'),
  ('טאורוס', 'Taurus'),
  ('טורנאו קאסטום', 'Tourneo Custom'),
  ('טורנאו קונקט', 'Tourneo Connect'),
  ('טרייסר', 'Tracer'),
  ('טרנזיט', 'Transit'),
  ('טרנזיט קוסטום', 'Transit Custom'),
  ('מאבריק', 'Maverick'),
  ('מונדאו', 'Mondeo'),
  ('מוסטנג', 'Mustang'),
  ('מוסטנג Mach-E', 'Mustang Mach-E'),
  ('פומה', 'Puma'),
  ('פוקוס', 'Focus'),
  ('פיאסטה', 'Fiesta'),
  ('פיוז''ן', 'Fusion'),
  ('קוגה', 'Kuga'),
  ('ריינג''ר', 'Ranger')
) AS v(name_hebrew, name_english)
CROSS JOIN public.vehicle_makes m
WHERE m.name_hebrew = 'פורד'
ON CONFLICT (make_id, name_hebrew) DO NOTHING;

-- Add all Renault models
INSERT INTO public.vehicle_models (make_id, name_hebrew, name_english, is_active)
SELECT m.id, v.name_hebrew, v.name_english, true
FROM (VALUES
  ('19', '19'),
  ('אוסטרל', 'Austral'),
  ('אקספרס', 'Express'),
  ('ארקנה', 'Arkana'),
  ('וול-סאטיס', 'Vel Satis'),
  ('זואי', 'Zoe'),
  ('טווינגו', 'Twingo'),
  ('טליה/סימבול', 'Talia/Symbol'),
  ('טראפיק', 'Trafic'),
  ('לגונה', 'Laguna'),
  ('לוגאן', 'Logan'),
  ('לטיטוד', 'Latitude'),
  ('מאסטר', 'Master'),
  ('מגאן', 'Megane'),
  ('מגאן E-Tech', 'Megane E-Tech'),
  ('סנדרו', 'Sandero'),
  ('סניק', 'Scenic'),
  ('ספרן', 'Safrane'),
  ('פלואנס', 'Fluence'),
  ('קדגא''ר', 'Kadjar'),
  ('קוליאוס', 'Koleos'),
  ('קליאו', 'Clio'),
  ('קנגו', 'Kangoo'),
  ('קפצ''ור', 'Captur')
) AS v(name_hebrew, name_english)
CROSS JOIN public.vehicle_makes m
WHERE m.name_hebrew = 'רנו'
ON CONFLICT (make_id, name_hebrew) DO NOTHING;