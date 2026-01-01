-- =====================================================
-- COVERLAB GÜVENLİK - SADECE RLS POLİTİKALARI
-- =====================================================
-- Bu script'i Supabase Dashboard > SQL Editor'de çalıştırın
-- =====================================================

-- 1. RLS'i etkinleştir
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Mevcut politikaları temizle (hata verirse devam et)
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update safe fields only" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "No user deletes" ON profiles;

-- 3. SELECT: Kullanıcılar sadece kendi profillerini okuyabilir
CREATE POLICY "Users can read own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- 4. UPDATE: SADECE güvenli alanları güncelleyebilir
-- credits, subscription_plan, customer_id DEĞİŞTİRİLEMEZ!
CREATE POLICY "Users can update safe fields only" 
ON profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  credits = (SELECT credits FROM profiles WHERE id = auth.uid()) AND
  subscription_plan = (SELECT subscription_plan FROM profiles WHERE id = auth.uid()) AND
  customer_id IS NOT DISTINCT FROM (SELECT customer_id FROM profiles WHERE id = auth.uid())
);

-- 5. INSERT: Kullanıcılar sadece kendi profillerini oluşturabilir
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 6. DELETE: Hiç kimse profil silemez
CREATE POLICY "No user deletes" 
ON profiles FOR DELETE 
USING (false);

-- 7. Politikaları kontrol et
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles';
