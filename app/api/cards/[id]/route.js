import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PUT /api/cards/[id] - Updates a card and upserts its voices (requires authentication)
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { 
      topic_slug, title, tag, series, series_card, 
      series_total, read_time, status, sort_order, image_url,
      voices 
    } = body;

    // 1. Update core card metadata
    const { error: cardError } = await supabase
      .from('cards')
      .update({
        topic_slug,
        title,
        tag,
        series: series !== undefined ? series : null,
        series_card: series_card !== undefined ? series_card : null,
        series_total: series_total !== undefined ? series_total : null,
        read_time: read_time || '3 min read',
        status: status || 'draft',
        sort_order: sort_order !== undefined ? sort_order : 0,
        image_url: image_url !== undefined ? image_url : null,
        content_fallback: voices?.find(v => v.voice_type === 'general')?.body || ''
      })
      .eq('id', id);

    if (cardError) {
      return NextResponse.json({ error: cardError.message }, { status: 500 });
    }

    // 2. Upsert voices if provided
    if (voices && voices.length > 0) {
      const voicesToUpsert = voices.map(v => ({
        card_id: parseInt(id),
        voice_type: v.voice_type,
        title_override: v.title_override || null,
        body: v.body
      }));

      // Upsert using the composite unique key (card_id, voice_type)
      const { error: voiceError } = await supabase
        .from('card_voices')
        .upsert(voicesToUpsert, { onConflict: 'card_id, voice_type' });

      if (voiceError) {
        return NextResponse.json({ error: `Failed to update voices: ${voiceError.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'Card and voices updated successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}

// DELETE /api/cards/[id] - Deletes a card (requires authentication)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Deleting the card will automatically trigger cascading delete for card_voices in PostgreSQL schema.
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Card deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
