import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// PUT /api/submissions/[id] - Update submission status or custom AI drafts (requires authentication)
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, ai_processed_draft, type, name, email, raw_content } = body;

    const updateFields = {};
    if (status !== undefined) updateFields.status = status;
    if (ai_processed_draft !== undefined) updateFields.ai_processed_draft = ai_processed_draft;
    if (type !== undefined) updateFields.type = type;
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (raw_content !== undefined) updateFields.raw_content = raw_content;

    const { data: submission, error } = await supabase
      .from('submissions')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Submission updated successfully', submission });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}

// DELETE /api/submissions/[id] - Deletes a submission from history queue (requires authentication)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Submission deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
