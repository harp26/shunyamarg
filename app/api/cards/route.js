import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/cards - Retrieve cards and all their associated voices
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const topicSlug = searchParams.get('topic');
    const status = searchParams.get('status') || 'published'; // Default to published for public safety

    let query = supabase
      .from('cards')
      .select('*, card_voices(*)');

    if (topicSlug) {
      query = query.eq('topic_slug', topicSlug);
    }

    // Public users can only see published cards.
    // If request asks for 'draft', RLS policies will automatically validate the session.
    query = query.eq('status', status);

    const { data: cards, error } = await query.order('sort_order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(cards);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}

// POST /api/cards - Creates a card along with its custom voices (requires authentication)
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      topic_slug, title, tag, series, series_card, 
      series_total, read_time, status, sort_order, image_url,
      voices // Expecting an array of voice objects: [{ voice_type: 'trad', body: '...' }]
    } = body;

    if (!topic_slug || !title || !tag) {
      return NextResponse.json({ error: 'Missing required metadata: topic_slug, title, and tag are mandatory' }, { status: 400 });
    }

    // 1. Insert core card metadata
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .insert({
        topic_slug,
        title,
        tag,
        series: series || null,
        series_card: series_card || null,
        series_total: series_total || null,
        read_time: read_time || '3 min read',
        status: status || 'draft',
        sort_order: sort_order || 0,
        image_url: image_url || null,
        content_fallback: voices?.find(v => v.voice_type === 'general')?.body || ''
      })
      .select('id')
      .single();

    if (cardError) {
      return NextResponse.json({ error: cardError.message }, { status: 500 });
    }

    const cardId = card.id;

    // 2. Insert card voices if provided
    if (voices && voices.length > 0) {
      const voicesToInsert = voices.map(v => ({
        card_id: cardId,
        voice_type: v.voice_type,
        title_override: v.title_override || null,
        body: v.body
      }));

      const { error: voiceError } = await supabase
        .from('card_voices')
        .insert(voicesToInsert);

      if (voiceError) {
        // Rollback inserted card if voices fail to maintain database consistency
        await supabase.from('cards').delete().eq('id', cardId);
        return NextResponse.json({ error: `Failed to insert voices: ${voiceError.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'Card and voices created successfully', cardId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
