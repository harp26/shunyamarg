// Run this to seed only TattvaBodh after already seeding Upanishads
// Usage: node scripts/seed-tattvabodh.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.resolve(process.cwd(), '.env.local');
const env = fs.readFileSync(envPath, 'utf8');
env.split('\n').forEach(l => {
  const t = l.trim();
  if (t && !t.startsWith('#')) {
    const eq = t.indexOf('=');
    if (eq > 0) process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const cardsData = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'data', 'tattvabodh.json'), 'utf8'));

(async () => {
  console.log('Seeding TattvaBodh...');

  // Upsert topic
  await supabase.from('topics').upsert(
    { slug: 'tattvabodh', label: 'Glimpses of TattvaBodh', sort_order: 2 },
    { onConflict: 'slug' }
  );

  let cardsSeeded = 0, voicesSeeded = 0, errors = [];

  for (const c of cardsData) {
    // Insert card
    const { data: card, error: e } = await supabase.from('cards').insert({
      topic_slug: 'tattvabodh', title: c.title, tag: c.tag,
      series: c.series || null, series_card: c.series_card || null,
      series_total: c.series_total || null,
      read_time: c.read_time || '3 min read', status: 'published',
      sort_order: c.sort_order || 0, content_fallback: c.content
    }).select('id').single();

    if (e) {
      // If unique constraint violation (already exists), skip
      if (e.code === '23505') {
        console.log(`  ⏭️  Skipping "${c.title}" (already exists)`);
        continue;
      }
      errors.push(`Card "${c.title}": ${e.message}`);
      continue;
    }

    cardsSeeded++;

    // Insert voices
    const { error: ve } = await supabase.from('card_voices').insert([
      { card_id: card.id, voice_type: 'general', body: c.content },
      { card_id: card.id, voice_type: 'trad', body: c.content_traditional },
      { card_id: card.id, voice_type: 'cont', body: c.content_contemporary },
      { card_id: card.id, voice_type: 'kath', body: c.content_katha }
    ]);

    if (ve) errors.push(`Voices for "${c.title}": ${ve.message}`);
    else voicesSeeded += 4;
  }

  console.log(`\n✅ Done: ${cardsSeeded} new cards, ${voicesSeeded} voices`);
  if (errors.length) console.log('⚠️ Warnings:\n  ' + errors.join('\n  '));
  console.log('🎉 All set!');
})();