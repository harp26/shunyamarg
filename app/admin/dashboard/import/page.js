'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Wand2, Save, Loader2, AlertCircle } from 'lucide-react';

export default function BulkImportCockpit() {
  const [topicSlug, setTopicSlug] = useState('tattvabodh');
  const [prompt, setPrompt] = useState('');
  const [quantity, setQuantity] = useState(3);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [generatedCards, setGeneratedCards] = useState([]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setGeneratedCards([]);

    try {
      const res = await fetch('/api/admin/bulk-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_slug: topicSlug,
          prompt_instruction: prompt,
          quantity: quantity
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate batch');
      
      setGeneratedCards(data.cards);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSave = async () => {
    if (generatedCards.length === 0) return;
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      let savedCount = 0;
      for (const card of generatedCards) {
        const payload = {
          topic_slug: topicSlug,
          title: card.title,
          tag: card.tag,
          read_time: card.read_time,
          status: 'published',
          voices: [
            { voice_type: 'general', body: card.voice_general || '' },
            { voice_type: 'trad', body: card.voice_trad || '' },
            { voice_type: 'cont', body: card.voice_cont || '' },
            { voice_type: 'kath', body: card.voice_kath || '' }
          ]
        };

        const res = await fetch('/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          console.error('Failed to save card', card.title);
        } else {
          savedCount++;
        }
      }

      setSuccessMsg(`Successfully saved ${savedCount} of ${generatedCards.length} cards.`);
      setGeneratedCards([]);
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred while saving the batch.');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setGeneratedCards([]);
    setSuccessMsg('');
    setErrorMsg('');
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[rgba(28,27,24,0.1)]">
        <h1 className="font-serif text-3xl font-light text-[#1c1b18]">AI Bulk Cockpit</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Setup */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-[rgba(28,27,24,0.1)] rounded-sm p-6 shadow-sm">
            <h2 className="font-serif text-xl mb-4 text-[#1c1b18]">Seed Parameters</h2>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#8c877f] mb-1.5">Target Topic</label>
                <select 
                  value={topicSlug}
                  onChange={(e) => setTopicSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-[rgba(28,27,24,0.18)] rounded-sm bg-[#faf9f6] text-sm text-[#1c1b18] outline-none focus:border-[#b8935a]"
                >
                  <option value="tattvabodh">TattvaBodh</option>
                  <option value="upanishads">Upanishads</option>
                  <option value="advait">Advait Vedanta</option>
                  <option value="yogsutra">Patanjali YogSutra</option>
                  <option value="gitas">Various Gitas</option>
                  <option value="karma">Principles of Karma</option>
                  <option value="meditation">Meditation</option>
                  <option value="arts">16 Arts of Hinduism</option>
                  <option value="stories">Stories</option>
                  <option value="philosophies">Global Philosophies</option>
                  <option value="psychology">Modern Psychology</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#8c877f] mb-1.5">Quantity (Max 15)</label>
                <input 
                  type="number" 
                  min="1" max="15" 
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[rgba(28,27,24,0.18)] rounded-sm bg-[#faf9f6] text-sm text-[#1c1b18] outline-none focus:border-[#b8935a]"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#8c877f] mb-1.5">AI Instructions / Theme</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Generate cards about the illusory nature of the ego (ahamkara) using modern technological metaphors..."
                  className="w-full px-3 py-2 border border-[rgba(28,27,24,0.18)] rounded-sm bg-[#faf9f6] text-sm text-[#1c1b18] outline-none focus:border-[#b8935a] h-32 resize-none"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading || generatedCards.length > 0}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#1c1b18] text-[#faf9f6] border-none rounded-sm font-sans text-xs tracking-widest uppercase cursor-pointer hover:bg-[#2e2d29] transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                {loading ? 'Generating...' : 'Generate Batch'}
              </button>
            </form>
          </div>
          
          {errorMsg && (
            <div className="bg-[#b85a5a]/10 border border-[#b85a5a] text-[#b85a5a] px-4 py-3 rounded-sm text-sm flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-sm text-sm flex items-start gap-2">
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Right Col: Output Grid */}
        <div className="lg:col-span-2">
          {generatedCards.length === 0 ? (
            <div className="h-full min-h-[400px] border border-dashed border-[rgba(28,27,24,0.2)] rounded-sm flex flex-col items-center justify-center p-8 text-[#8c877f]">
              {loading ? (
                <>
                  <div className="relative mb-6">
                    <Loader2 size={40} className="animate-spin text-[#b8935a] absolute inset-0 m-auto" />
                    <Wand2 size={16} className="text-[#b8935a] absolute inset-0 m-auto" />
                  </div>
                  <p className="font-serif text-xl italic mb-2 text-[#1c1b18]">Consulting the oracle...</p>
                  <p className="text-sm">Gemini 1.5 Flash is writing {quantity} cards based on your theme.</p>
                </>
              ) : (
                <>
                  <Wand2 size={48} className="mb-4 opacity-20" />
                  <p className="font-serif text-xl italic mb-2 text-[#1c1b18]">No batch loaded.</p>
                  <p className="text-sm">Fill out the parameters and click Generate.</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 border border-[rgba(28,27,24,0.1)] shadow-sm rounded-sm sticky top-0 z-10">
                <div className="text-sm">
                  <span className="font-bold text-[#b8935a]">{generatedCards.length}</span> cards generated.
                </div>
                <div className="flex gap-3">
                  <button onClick={handleDiscard} disabled={saving} className="px-4 py-2 text-xs uppercase tracking-widest text-[#5a5650] hover:text-[#1c1b18] transition-colors disabled:opacity-50">
                    Discard
                  </button>
                  <button 
                    onClick={handleBulkSave} 
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {saving ? 'Saving...' : 'Approve & Save All'}
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {generatedCards.map((card, idx) => (
                  <div key={idx} className="bg-white border border-[rgba(28,27,24,0.1)] rounded-sm p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-4 border-b border-[rgba(28,27,24,0.1)] pb-3">
                      <div>
                        <div className="text-[10px] tracking-widest uppercase text-[#b8935a] mb-1 font-semibold">{card.tag} • {card.read_time}</div>
                        <h3 className="font-serif text-2xl font-light text-[#1c1b18]">{card.title}</h3>
                      </div>
                      <div className="bg-[#f4f2ed] px-2 py-1 rounded text-[10px] text-[#5a5650] max-w-[200px] text-right truncate" title={`Search Query: ${card.image_search_query}`}>
                        🔍 {card.image_search_query}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-3">
                        <span className="text-[10px] uppercase text-[#8c877f] font-bold block mb-1">General Summary</span>
                        <p className="text-sm text-[#1c1b18] leading-relaxed">{card.voice_general}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#8c877f] font-bold block mb-1">Traditional</span>
                        <p className="font-serif text-sm text-[#5a5650] leading-relaxed bg-[#f4f2ed] p-3 rounded-sm">{card.voice_trad}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#8c877f] font-bold block mb-1">Contemporary</span>
                        <p className="text-sm text-[#5a5650] leading-relaxed bg-[#f4f2ed] p-3 rounded-sm">{card.voice_cont}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#8c877f] font-bold block mb-1">Katha (Story)</span>
                        <p className="text-sm text-[#5a5650] leading-relaxed bg-[#f4f2ed] p-3 rounded-sm">{card.voice_kath}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
