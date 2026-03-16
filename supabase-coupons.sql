-- =============================================
-- TABLA BIRTHDAY_COUPONS
-- Ejecutar en Supabase Dashboard > SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS public.birthday_coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    is_redeemed BOOLEAN DEFAULT false,
    redeemed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(username, title)
);

ALTER TABLE public.birthday_coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for birthday_coupons" ON public.birthday_coupons;
CREATE POLICY "Allow all for birthday_coupons" ON public.birthday_coupons
    FOR ALL USING (true) WITH CHECK (true);
