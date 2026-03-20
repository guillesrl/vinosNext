-- ========================================
-- CONFIGURACIÓN COMPLETA DE LA TABLA VINOS
-- Ejecuta esto en Supabase SQL Editor
-- ========================================

-- 1. Deshabilitar Row Level Security (para desarrollo)
ALTER TABLE vinos DISABLE ROW LEVEL SECURITY;

-- 2. Si prefieres mantener RLS, crea estas políticas en su lugar:
-- (Descomenta si quieres RLS habilitado)

-- Permitir SELECT público
-- CREATE POLICY "Allow public select" ON vinos
-- FOR SELECT USING (true);

-- Permitir INSERT público
-- CREATE POLICY "Allow public insert" ON vinos
-- FOR INSERT WITH CHECK (true);


-- 3. Vaciar tabla (opcional, solo si quieres empezar de cero)
-- DELETE FROM vinos;


-- 4. Insertar datos de ejemplo (opcional)
-- INSERT INTO vinos (Id, Title, Vintage, Country, County, Designation, Points, Price, Province, Variety, Winery) VALUES
-- ('1', 'Marqués de Murrieta Reserva', 2018, 'Spain', 'Logroño', 'Reserva', 92, 45, 'Rioja', 'Tempranillo', 'Marqués de Murrieta'),
-- ('2', 'Vega Sicilia Valbuena 5º', 2016, 'Spain', 'Valbuena de Duero', 'Valbuena 5º', 94, 180, 'Valladolid', 'Tinto Fino, Merlot', 'Vega Sicilia'),
-- ('3', 'Château Margaux', 2015, 'France', 'Margaux', 'Grand Cru Classé', 98, 850, 'Bordeaux', 'Cabernet Sauvignon, Merlot', 'Château Margaux'),
-- ('4', 'Barolo Brunate', 2017, 'Italy', 'Serralunga d''Alba', 'Barolo DOCG', 96, 120, 'Piedmont', 'Nebbiolo', 'Giacomo Conterno'),
-- ('5', 'Opus One', 2019, 'USA', 'Napa', 'Napa Valley', 97, 425, 'California', 'Cabernet Sauvignon', 'Opus One Winery'),
-- ('6', 'Penfolds Grange', 2018, 'Australia', 'Adelaide', 'Grange Hermitage', 99, 780, 'South Australia', 'Shiraz', 'Penfolds'),
-- ('7', 'Domaine de la Romanée-Conti', 2019, 'France', 'Vosne-Romanée', 'Grand Cru', 100, 2500, 'Burgundy', 'Pinot Noir', 'Domaine de la Romanée-Conti'),
-- ('8', 'Screaming Eagle', 2020, 'USA', 'Oakville', 'Napa Valley', 98, 3200, 'California', 'Cabernet Sauvignon', 'Screaming Eagle Winery'),
-- ('9', 'Château d''Yquem', 2014, 'France', 'Sauternes', 'Sauternes', 100, 895, 'Bordeaux', 'Sémillon, Sauvignon Blanc', 'Château d''Yquem'),
-- ('10', 'Roman Conti', 2005, 'France', 'Vosne-Romanée', 'Romanée-Conti Grand Cru', 100, 4500, 'Burgundy', 'Pinot Noir', 'Domaine de la Romanée-Conti');


-- 5. Verificar configuración final
SELECT 'Tabla configurada correctamente!' as status;
