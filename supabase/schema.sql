-- SQL Schema for Real Estate Marketplace (Updated)

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    -- Basic Information
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC,
    
    -- Property Details
    property_type TEXT DEFAULT 'house', -- 'house', 'apartment', 'land', 'commercial'
    beds INTEGER DEFAULT 0,
    baths INTEGER DEFAULT 0,
    parking_spaces INTEGER DEFAULT 0,
    area_sqm NUMERIC,
    
    -- Location
    neighborhood TEXT,
    city TEXT DEFAULT 'Local',
    address TEXT,
    
    -- Media and Features
    images TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    
    -- Status and Ownership
    status TEXT DEFAULT 'pending', -- 'pending', 'active', 'sold', 'rejected'
    owner_name TEXT,
    owner_phone TEXT
);

-- Habilita Row Level Security (Essencial para as políticas funcionarem)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer pessoa pode ver imóveis ativos
CREATE POLICY "Public properties are viewable by everyone" 
ON public.properties FOR SELECT 
USING (true);

-- Política: Qualquer pessoa pode inserir novos imóveis (para a página de anúncio)
CREATE POLICY "Anyone can insert properties" 
ON public.properties FOR INSERT 
WITH CHECK (true);

-- Política: Permitir update (necessário para o painel admin - idealmente via Auth)
CREATE POLICY "Enable update for all for now" 
ON public.properties FOR UPDATE 
USING (true)
WITH CHECK (true);
