-- SQL Schema for Real Estate Marketplace

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    -- Basic Information
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    
    -- Property Details
    property_type TEXT NOT NULL, -- 'house', 'apartment', 'land', etc.
    beds INTEGER DEFAULT 0,
    baths INTEGER DEFAULT 0,
    parking_spaces INTEGER DEFAULT 0,
    area_sqm NUMERIC NOT NULL,
    
    -- Location (Public)
    neighborhood TEXT NOT NULL,
    city TEXT DEFAULT 'Local' NOT NULL,
    
    -- Location (Private/Admin)
    address TEXT,
    
    -- Media and Features
    images TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    
    -- Status and SEO
    status TEXT DEFAULT 'active' NOT NULL, -- 'active', 'sold', 'paused'
    is_featured BOOLEAN DEFAULT false,
    
    -- Slug for SEO-friendly URLs
    slug TEXT UNIQUE
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Public Policy (Read All)
CREATE POLICY "Public properties are viewable by everyone" 
ON public.properties FOR SELECT 
USING (status = 'active');
