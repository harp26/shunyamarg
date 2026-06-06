import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/topics - Fetches all topics sorted by sort_order
export async function GET() {
  try {
    const { data: topics, error } = await supabase
      .from('topics')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(topics);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
