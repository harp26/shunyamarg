import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/submissions - Admin retrieves submissions queue (requires authentication)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(submissions);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}

// POST /api/submissions - Seekers submit their insights
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, name, email, raw_content } = body;

    if (!name || !email || !raw_content) {
      return NextResponse.json({ error: 'Name, email, and raw content are required fields' }, { status: 400 });
    }

    const { data: submission, error } = await supabase
      .from('submissions')
      .insert({
        type: type || 'contribution',
        name,
        email,
        raw_content,
        status: 'pending',
        ai_processed_draft: null
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Submission successfully received', submissionId: submission.id }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
