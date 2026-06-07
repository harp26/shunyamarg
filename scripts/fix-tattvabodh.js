// 🔧 TattvaBodh Diagnostic & Fix Script
// Run: node scripts/fix-tattvabodh.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ---- Load .env.local ----
const envPath = path.resolve(process.cwd(), '.env.local');
console.log('Looking for .env.local at:', envPath);
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local not found!');
  process.exit(1);
}

const env = fs.readFileSync(envPath, 'utf8');
env.split('\n').forEach(l => {
  const t = l.trim();
  if (t && !t.startsWith('#')) {
    const eq = t.indexOf('=');
    if (eq > 0) {
      const key = t.slice(0, eq).trim();
      const val = t.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = val;
      console.log(`  Loaded: ${key}`);
    }
  }
});

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('❌ Missing SUPABASE credentials in .env.local');
  console.error('   Need: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// ---- Check JSON data ----
console.log('\n📂 Checking tattvabodh.json...');
const dataPath = path.resolve(process.cwd(), 'data', 'tattvabodh.json');
if (!fs.existsSync(dataPath)) {
  console.error('❌ data/tattvabodh.json not found!');
  process.exit(1);
}
const cardsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
console.log(`✅ Loaded ${cardsData.length} cards from tattvabodh.json`);
console.log(`   First card: "${cardsData[0]?.title}"`);
console.log(`   Last card: "${cardsData[cardsData.length-1]?.title}"`);

// ---- Connect to Supabase ----
console.log('\n🔌 Connecting to Supabase...');
const supabase = createClient(url, key);

(async () => {
  // Check existing data
  console.log('\n📊 Checking existing database state...');
  
  const { data: topics, error: tErr } = await supabase.from('topics').select('*');
  if (tErr) console.error('❌ Topics query error:', tErr.message);
  else console.log('✅ Topics:', topics?.map(t => t.slug).join(', ') || '(none)');

  const { data: existingCards, error: cErr } = await supabase
    .from('cards')
    .select('id, title, topic_slug')
    .eq('topic_slug', 'tattvabodh');
  
  if (cErr) console.error('❌ Cards query error:', cErr.message);
  else console.log(`✅ Existing tattvabodh cards: ${existingCards?.length || 0}`);

  // ---- SEED ----
  console.log('\n🌱 Seeding TattvaBodh...');
  
  // 1. Upsert topic
  console.log('  Step 1: Upserting topic...');
  const { error: topicErr } = await supabase.from('topics').upsert(
    { slug: 'tattvabodh', label: 'Glimpses of TattvaBodh', parent_slug: null, sort_order: 2 },
    { onConflict: 'slug' }
  );
  if (topicErr) {
    console.error('  ❌ Topic error:', topicErr.message);
    process.exit(1);
  }
  console.log('  ✅ Topic "tattvabodh" ready');

  // 2. Insert cards one by one
  console.log('  Step 2: Inserting cards...');
  let cardsSeeded = 0;
  let voicesSeeded = 0;
  let errors = [];

  for (let i = 0; i < cardsData.length; i++) {
    const c = cardsData[i];
    process.stdout.write(`    [${i+1}/${cardsData.length}] "${c.title}"... `);
    
    const { data: card, error: e } = await supabase.from('cards').insert({
      topic_slug: 'tattvabodh',
      title: c.title,
      tag: c.tag,
      series: c.series || null,
      series_card: c.series_card || null,
      series_total: c.series_total || null,
      read_time: c.read_time || '3 min read',
      status: 'published',
      sort_order: c.sort_order || 0,
      content_fallback: c.content
    }).select('id').single();

    if (e) {
      if (e.code === '23505') {
        console.log('⏭️ already exists');
      } else {
        console.log('❌', e.message);
        errors.push(`"${c.title}": ${e.message} (${e.code})`);
      }
      continue;
    }

    // Insert voices
    const { error: ve } = await supabase.from('card_voices').insert([
      { card_id: card.id, voice_type: 'general', body: c.content },
      { card_id: card.id, voice_type: 'trad', body: c.content_traditional },
      { card_id: card.id, voice_type: 'cont', body: c.content_contemporary },
      { card_id: card.id, voice_type: 'kath', body: c.content_katha }
    ]);

    if (ve) {
      console.log('⚠️ card OK, voices failed:', ve.message);
      errors.push(`Voices for "${c.title}": ${ve.message}`);
    } else {
      console.log('✅ card + 4 voices');
      cardsSeeded++;
      voicesSeeded += 4;
    }
  }

  // ---- Summary ----
  console.log('\n' + '='.repeat(50));
  console.log('📋 RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ New cards seeded: ${cardsSeeded}`);
  console.log(`✅ New voices seeded: ${voicesSeeded}`);
  
  if (errors.length) {
    console.log(`\n⚠️  Warnings (${errors.length}):`);
    errors.forEach(e => console.log('   • ' + e));
  }

  // Final count
  const { data: finalCards } = await supabase.from('cards').select('topic_slug');
  const counts = {};
  (finalCards || []).forEach(c => { counts[c.topic_slug] = (counts[c.topic_slug] || 0) + 1; });
  console.log('\n📊 Final card counts by topic:');
  Object.entries(counts).forEach(([k, v]) => console.log(`   ${k}: ${v}`));
  console.log(`   TOTAL: ${(finalCards || []).length} cards`);
  console.log('\n🎉 Done!');
})();