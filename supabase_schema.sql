-- ==========================================
-- ShunyaMarg Database Schema & Security
-- ==========================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TOPICS TABLE (Categories & Nesting)
CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    label VARCHAR(255) NOT NULL,
    parent_slug VARCHAR(100) REFERENCES topics(slug) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CARDS TABLE (Core Metadata & Fallbacks)
CREATE TABLE IF NOT EXISTS cards (
    id SERIAL PRIMARY KEY,
    topic_slug VARCHAR(100) REFERENCES topics(slug) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    tag VARCHAR(100) NOT NULL,
    series VARCHAR(255) DEFAULT NULL,
    series_card INTEGER DEFAULT NULL,
    series_total INTEGER DEFAULT NULL,
    read_time VARCHAR(50) DEFAULT '3 min read',
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    sort_order INTEGER DEFAULT 0,
    image_url TEXT DEFAULT NULL,
    content_fallback TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CARD VOICES TABLE (Extensible Multi-Layer Text Content)
CREATE TABLE IF NOT EXISTS card_voices (
    id SERIAL PRIMARY KEY,
    card_id INTEGER REFERENCES cards(id) ON DELETE CASCADE NOT NULL,
    voice_type VARCHAR(50) NOT NULL CHECK (voice_type IN ('general', 'trad', 'cont', 'kath')),
    title_override VARCHAR(255) DEFAULT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_card_voice UNIQUE (card_id, voice_type)
);

-- 4. SUBMISSIONS TABLE (Crowd-sourced Queue with AI-Processed Drafts)
CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) DEFAULT 'contribution' CHECK (type IN ('query', 'contribution')),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    raw_content TEXT NOT NULL,
    ai_processed_draft JSONB DEFAULT NULL, -- Stores Gemini structured response (suggested topic, tags, 3 generated voices)
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable Row-Level Security on all tables
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_voices ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------
-- Topics Table Policies
-- ------------------------------------------
CREATE POLICY "Allow public read access to topics" 
ON topics FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow authenticated admin write access to topics" 
ON topics FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- ------------------------------------------
-- Cards Table Policies
-- ------------------------------------------
CREATE POLICY "Allow public read access to published cards" 
ON cards FOR SELECT 
TO public 
USING (status = 'published');

CREATE POLICY "Allow authenticated admin write access to cards" 
ON cards FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- ------------------------------------------
-- Card Voices Table Policies
-- ------------------------------------------
CREATE POLICY "Allow public read access to published card voices" 
ON card_voices FOR SELECT 
TO public 
USING (
    EXISTS (
        SELECT 1 FROM cards 
        WHERE cards.id = card_voices.card_id 
        AND cards.status = 'published'
    )
);

CREATE POLICY "Allow authenticated admin write access to card voices" 
ON card_voices FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- ------------------------------------------
-- Submissions Table Policies
-- ------------------------------------------
CREATE POLICY "Allow public to create submissions" 
ON submissions FOR INSERT 
TO public 
WITH CHECK (status = 'pending');

CREATE POLICY "Allow authenticated admin full access to submissions" 
ON submissions FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- ==========================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_topics_parent ON topics(parent_slug);
CREATE INDEX IF NOT EXISTS idx_cards_topic ON cards(topic_slug);
CREATE INDEX IF NOT EXISTS idx_cards_status ON cards(status);
CREATE INDEX IF NOT EXISTS idx_voices_card_id ON card_voices(card_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
