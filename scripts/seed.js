const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Self-contained environment variable parser for standalone node script
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: .env.local file not found.');
    console.log('Please create a .env.local file in the project root with the following keys first:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=your-supabase-url');
    console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const firstEquals = trimmed.indexOf('=');
      if (firstEquals !== -1) {
        const key = trimmed.substring(0, firstEquals).trim();
        const val = trimmed.substring(firstEquals + 1).trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = val;
      }
    }
  });
}

async function runSeed() {
  console.log('Initializing ShunyaMarg Database Seeder...');
  loadEnv();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // 1. Load data from upanishads.json
  const upanishadsPath = path.resolve(process.cwd(), 'data', 'upanishads.json');
  if (!fs.existsSync(upanishadsPath)) {
    console.error('\x1b[31m%s\x1b[0m', `Error: upanishads.json not found at ${upanishadsPath}`);
    process.exit(1);
  }

  const upanishadsData = JSON.parse(fs.readFileSync(upanishadsPath, 'utf8'));
  console.log(`Loaded ${upanishadsData.length} cards from upanishads.json`);

  // 2. Insert/Upsert Upanishads Topic
  console.log('Seeding topics table...');
  const { error: topicError } = await supabase
    .from('topics')
    .upsert({
      slug: 'upanishads',
      label: 'Learning from Upanishads',
      parent_slug: null,
      sort_order: 1
    }, { onConflict: 'slug' });

  if (topicError) {
    console.error('\x1b[31m%s\x1b[0m', 'Error seeding topics:', topicError.message);
    process.exit(1);
  }
  console.log('Topic "upanishads" seeded successfully.');

  // 3. Populate cards & card_voices
  console.log('Seeding cards and voices table...');
  let cardsSeeded = 0;
  let voicesSeeded = 0;

  for (const cardData of upanishadsData) {
    // A. Insert card metadata
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .insert({
        topic_slug: 'upanishads',
        title: cardData.title,
        tag: cardData.tag,
        series: cardData.series || null,
        series_card: cardData.series_card || null,
        series_total: cardData.series_total || null,
        read_time: cardData.read_time || '3 min read',
        status: 'published', // Automatically publish Upanishad seeded content
        sort_order: cardData.sort_order || 0,
        content_fallback: cardData.content
      })
      .select('id')
      .single();

    if (cardError) {
      console.error('\x1b[31m%s\x1b[0m', `Error seeding card "${cardData.title}":`, cardError.message);
      continue;
    }

    const cardId = card.id;
    cardsSeeded++;

    // B. Insert Card Voices
    const voices = [
      { card_id: cardId, voice_type: 'general', body: cardData.content },
      { card_id: cardId, voice_type: 'trad', body: cardData.content_traditional },
      { card_id: cardId, voice_type: 'cont', body: cardData.content_contemporary },
      { card_id: cardId, voice_type: 'kath', body: cardData.content_katha }
    ];

    const { error: voiceError } = await supabase
      .from('card_voices')
      .insert(voices);

    if (voiceError) {
      console.error('\x1b[31m%s\x1b[0m', `Error seeding voices for card id ${cardId}:`, voiceError.message);
    } else {
      voicesSeeded += voices.length;
    }
  }

  console.log('\x1b[32m%s\x1b[0m', 'Seeding complete!');
  console.log(`- Seeded Cards: ${cardsSeeded}`);
  console.log(`- Seeded Voices: ${voicesSeeded}`);
}

runSeed().catch(err => {
  console.error('Fatal error during seed run:', err);
  process.exit(1);
});
