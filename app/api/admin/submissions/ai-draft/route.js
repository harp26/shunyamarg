import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// POST /api/admin/submissions/ai-draft - Generate structured voices draft using Gemini 1.5 Flash
export async function POST(request) {
  try {
    const body = await request.json();
    const { submissionId } = body;

    if (!submissionId) {
      return NextResponse.json({ error: 'submissionId is required' }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured on the server environment' }, { status: 500 });
    }

    // 1. Fetch submission details
    const { data: submission, error: subError } = await supabaseAdmin
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (subError || !submission) {
      return NextResponse.json({ error: `Submission not found: ${subError?.message}` }, { status: 404 });
    }

    // 2. Build structured few-shot prompt for style alignment
    const systemPrompt = `You are the chief editor of ShunyaMarg, a premium philosophical brand representing Advaita Vedanta, Upanishadic insight, and modern introspection.
Your task is to take a raw user insight/query and convert it into a highly structured philosophical card with three distinct core brand voices.

You must classify the raw content and generate the response in strict JSON format.

RESOURCES & VOICE ALIGNMENT:
- "suggested_topic": Choose either "upanishads" or "tattvabodh".
- "tag": Suggest a suitable tag (e.g. "Seed Mantras", "Consciousness Maps", "Contemplative Practices", "Teaching Stories").
- "read_time": Estimate reading time based on card length (e.g. "3 min read").
- "title": A short, profound, elegant title.
- "voice_general": A concise 4-5 sentence summary of the core insight. Warm, elegant, and deep.
- "voice_trad" (Traditional): Grounded in Sanskrit etymology and Advaita scripture. Use proper terms (e.g. Brahman, Atman, Mahavakya, avidya) with correct devanagari script in brackets. Highly meditative, scholarly, and authoritative.
- "voice_cont" (Contemporary): Modern psychological reflection. Highly introspective, relatable, crisp, and direct. Free from cliché or fluff. Asks questions about the reader's direct experience.
- "voice_kath" (Katha Storytelling): Conversational, extremely engaging, begins with phrases like "Okay, real talk", "Spoiler:", "Think about it". Profound metaphors explained in highly modern colloquial English.

EXEMPLAR FOR STYLE REFERENCE (Upanishads - Tat Tvam Asi):
User raw content: "I realized today that maybe the person who is observing all my thoughts isn't my small ego, but a bigger consciousness that we all share. How do we live this?"
Expected Output JSON Structure:
{
  "suggested_topic": "upanishads",
  "tag": "Seed Mantras",
  "title": "Tat Tvam Asi",
  "read_time": "3 min read",
  "voice_general": "You spend years building an identity... who is the one watching all this unfold?",
  "voice_trad": "The teaching Tat Tvam Asi (तत् त्वम् असि) — \\"That Thou Art\\" — appears in the Chāndogya Upaniṣad... Tat refers to Brahman, Tvam is you, Asi means identity. Sankara clarifies it removes avidyā...",
  "voice_cont": "We walk around feeling fundamentally separate... Where is awareness located? When you dream, a whole world appears, then disappears. The Upaniṣad asks: what if this waking world works the same way?",
  "voice_kath": "Okay, real talk. You know that feeling when you're scrolling Instagram and suddenly you're like, \\"Wait, who's the one watching me scroll?\\"... That's what Uddalaka taught his son..."
}

Now, process the following raw seeker insight:
"${submission.raw_content}"
`;

    // 3. Query Gemini 1.5 Flash using direct fetch
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `Gemini API invocation failed: ${errText}` }, { status: 502 });
    }

    const resData = await response.json();
    const aiTextContent = resData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiTextContent) {
      return NextResponse.json({ error: 'Invalid response payload returned from Gemini API' }, { status: 502 });
    }

    // 4. Parse structured JSON from AI response
    let draftJson;
    try {
      draftJson = JSON.parse(aiTextContent);
    } catch (parseError) {
      return NextResponse.json({ 
        error: 'Failed to parse AI response as JSON', 
        rawResponse: aiTextContent, 
        details: parseError.message 
      }, { status: 502 });
    }

    // 5. Update submission record with processed AI draft
    const { data: updatedSub, error: updateErr } = await supabaseAdmin
      .from('submissions')
      .update({
        ai_processed_draft: draftJson
      })
      .eq('id', submissionId)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json({ error: `Failed to save AI draft to database: ${updateErr.message}` }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'AI draft generated and saved successfully', 
      draft: draftJson,
      submission: updatedSub
    });

  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
