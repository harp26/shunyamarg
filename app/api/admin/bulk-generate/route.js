import { NextResponse } from 'next/server';

// POST /api/admin/bulk-generate - AI Bulk Card Batch Generator Powered by Gemini
export async function POST(request) {
  try {
    const body = await request.json();
    const { topic_slug, prompt_instruction, quantity } = body;

    if (!topic_slug || !prompt_instruction) {
      return NextResponse.json({ error: 'topic_slug and prompt_instruction are mandatory fields' }, { status: 400 });
    }

    const batchSize = Math.min(parseInt(quantity || 3), 15); // Limit batch size to 15 to prevent timeout constraints

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured on the server environment' }, { status: 500 });
    }

    const systemPrompt = `You are a professional philosophy content seeder for ShunyaMarg.
Generate exactly ${batchSize} cards covering the following theme/instruction:
"${prompt_instruction}"

Target Topic Category: "${topic_slug}"

You must output a strict JSON array of objects. Do not include markdown code block wrappers or any extra text.

Each card object in the array must contain:
1. "title": Profound, elegant, and short card title.
2. "tag": Appropriate category tag (e.g., "Seed Mantras", "Consciousness Maps", "Contemplative Practices", "Teaching Stories").
3. "read_time": E.g., "3 min read".
4. "voice_general": A concise 4-5 sentence summary of the core insight. Warm, elegant, and deep.
5. "voice_trad" (Traditional Voice): Scripture and Sanskrit etymology focused. Advaita Vedanta theme with bracketed devanagari words. Meditative, scholarly, and authoritative.
6. "voice_cont" (Contemporary Voice): Modern psychological reflection, direct, fluff-free, and introspective. Asks deep questions of the observer.
7. "voice_kath" (Katha Storytelling Voice): Casual narrative storyteller style ("Okay, real talk...", "Spoiler:...", etc.) explaining profound metaphors.
8. "image_search_query": A highly aesthetic, clean keyword search query (3-5 words) suitable for finding beautiful, minimal, artistic background photos on stock websites (Pexels/Unsplash). Keep it abstract, high-end, and artistic (e.g., "abstract gold minimalist painting", "calm ocean morning light", "sand ripples shadow desert", "minimalist stone balances").

The output MUST be a valid JSON array, strictly structured as:
[
  {
    "title": "...",
    "tag": "...",
    "read_time": "...",
    "voice_general": "...",
    "voice_trad": "...",
    "voice_cont": "...",
    "voice_kath": "...",
    "image_search_query": "..."
  },
  ...
]
`;

    // Fetch batch from Gemini 1.5 Flash
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

    let batchCards;
    try {
      batchCards = JSON.parse(aiTextContent);
    } catch (parseError) {
      return NextResponse.json({ 
        error: 'Failed to parse AI batch response as JSON array', 
        rawResponse: aiTextContent, 
        details: parseError.message 
      }, { status: 502 });
    }

    if (!Array.isArray(batchCards)) {
      return NextResponse.json({ error: 'AI response did not return a valid array', rawResponse: batchCards }, { status: 502 });
    }

    return NextResponse.json({
      message: 'AI Card Batch generated successfully',
      count: batchCards.length,
      cards: batchCards
    });

  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
