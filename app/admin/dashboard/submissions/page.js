'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RefreshCcw, Wand2, CheckCircle2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

export default function SubmissionsQueue() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const loadSubmissions = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSubmissions(data || []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setErrorMsg('Failed to load submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleGenerateDraft = async (submissionId) => {
    setGeneratingId(submissionId);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/submissions/ai-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to generate draft');
      
      // Update local state
      setSubmissions(prev => 
        prev.map(sub => sub.id === submissionId ? { ...sub, ai_processed_draft: data.draft } : sub)
      );
    } catch (err) {
      console.error('Generate error:', err);
      setErrorMsg(err.message);
    } finally {
      setGeneratingId(null);
    }
  };

  const handleApprove = async (sub) => {
    if (!sub.ai_processed_draft) return;
    setApprovingId(sub.id);
    setErrorMsg('');
    try {
      const draft = sub.ai_processed_draft;
      
      // Format payload for /api/cards
      const payload = {
        topic_slug: draft.suggested_topic || 'tattvabodh',
        title: draft.title || 'Untitled Insight',
        tag: draft.tag || 'Community Insight',
        read_time: draft.read_time || '3 min read',
        status: 'published',
        voices: [
          { voice_type: 'general', body: draft.voice_general || '' },
          { voice_type: 'trad', body: draft.voice_trad || '' },
          { voice_type: 'cont', body: draft.voice_cont || '' },
          { voice_type: 'kath', body: draft.voice_kath || '' }
        ]
      };

      const cardRes = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const cardData = await cardRes.json();
      if (!cardRes.ok) throw new Error(cardData.error || 'Failed to create card');

      // Update submission status
      const { error: updateErr } = await supabase
        .from('submissions')
        .update({ status: 'approved' })
        .eq('id', sub.id);

      if (updateErr) throw updateErr;

      // Remove from queue
      setSubmissions(prev => prev.filter(s => s.id !== sub.id));
      if (expandedId === sub.id) setExpandedId(null);
      
    } catch (err) {
      console.error('Approval error:', err);
      setErrorMsg(err.message);
    } finally {
      setApprovingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[rgba(28,27,24,0.1)]">
        <h1 className="font-serif text-3xl font-light text-[#1c1b18]">Submissions Queue</h1>
        <button 
          onClick={loadSubmissions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-[rgba(28,27,24,0.18)] rounded-sm bg-white text-[12px] uppercase tracking-widest text-[#5a5650] hover:bg-[#f4f2ed] transition-colors disabled:opacity-50"
        >
          <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {errorMsg && (
        <div className="bg-[#b85a5a]/10 border border-[#b85a5a] text-[#b85a5a] px-4 py-3 rounded-sm text-sm mb-6 flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-stone-500">
          <Loader2 className="animate-spin w-8 h-8 text-[#b8935a]" />
          <span className="text-xs uppercase tracking-widest">Loading Queue...</span>
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white border border-[rgba(28,27,24,0.1)] rounded-sm p-12 text-center text-stone-500 shadow-sm">
          <Inbox size={48} className="mx-auto mb-4 opacity-20" />
          <p className="font-serif text-xl italic mb-2">The queue is empty.</p>
          <p className="text-sm">No pending submissions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map(sub => {
            const isExpanded = expandedId === sub.id;
            const hasDraft = !!sub.ai_processed_draft;
            const draft = sub.ai_processed_draft;

            return (
              <div key={sub.id} className="bg-white border border-[rgba(28,27,24,0.1)] rounded-sm shadow-sm overflow-hidden transition-all">
                {/* Header */}
                <div 
                  onClick={() => toggleExpand(sub.id)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="font-semibold text-stone-900 truncate max-w-[200px]">{sub.name}</span>
                      <span className="text-xs text-stone-400">{new Date(sub.created_at).toLocaleDateString()}</span>
                      {hasDraft && <span className="bg-[#b8935a]/10 text-[#b8935a] text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-[#b8935a]/20">AI Draft Ready</span>}
                    </div>
                    <p className="text-sm text-stone-600 truncate mr-8">{sub.raw_content}</p>
                  </div>
                  <div className="text-stone-400 shrink-0">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Expanded Body */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-[rgba(28,27,24,0.1)] bg-stone-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
                      {/* Left: Original Submission */}
                      <div>
                        <h4 className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 mb-3">Original Submission</h4>
                        <div className="bg-white p-4 rounded border border-stone-200 text-sm text-stone-700 whitespace-pre-wrap leading-relaxed shadow-inner font-serif">
                          {sub.raw_content}
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            onClick={() => handleGenerateDraft(sub.id)}
                            disabled={generatingId === sub.id}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1c1b18] text-[#faf9f6] rounded-sm text-xs font-semibold uppercase tracking-wider hover:bg-[#2e2d29] transition-colors disabled:opacity-50 w-full"
                          >
                            {generatingId === sub.id ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                            {hasDraft ? 'Regenerate Draft' : 'Generate AI Draft'}
                          </button>
                        </div>
                      </div>

                      {/* Right: AI Draft & Approve */}
                      <div>
                        <h4 className="text-[10px] tracking-widest uppercase font-semibold text-[#b8935a] mb-3">AI Formatted Draft</h4>
                        {hasDraft ? (
                          <div className="bg-white rounded border border-[#c9a05a]/30 shadow-sm overflow-hidden text-sm">
                            <div className="p-4 bg-[#c9a05a]/5 border-b border-[#c9a05a]/20 grid grid-cols-2 gap-2">
                              <div><span className="text-[9px] uppercase text-stone-500 font-bold block">Topic</span> <span className="font-serif">{draft.suggested_topic}</span></div>
                              <div><span className="text-[9px] uppercase text-stone-500 font-bold block">Tag</span> <span className="font-serif">{draft.tag}</span></div>
                              <div className="col-span-2"><span className="text-[9px] uppercase text-stone-500 font-bold block">Title</span> <span className="font-serif text-lg text-stone-900">{draft.title}</span></div>
                            </div>
                            <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin">
                              <div><span className="text-[9px] uppercase text-stone-500 font-bold block mb-1">Traditional Voice</span><p className="font-serif text-stone-700 text-[13px]">{draft.voice_trad}</p></div>
                              <div><span className="text-[9px] uppercase text-stone-500 font-bold block mb-1">Contemporary Voice</span><p className="font-serif text-stone-700 text-[13px]">{draft.voice_cont}</p></div>
                              <div><span className="text-[9px] uppercase text-stone-500 font-bold block mb-1">Katha (Story) Voice</span><p className="font-serif text-stone-700 text-[13px]">{draft.voice_kath}</p></div>
                            </div>
                            <div className="p-3 bg-stone-100 border-t border-stone-200">
                              <button
                                onClick={() => handleApprove(sub)}
                                disabled={approvingId === sub.id}
                                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                              >
                                {approvingId === sub.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                One-Click Approve & Publish
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full border border-dashed border-stone-300 rounded flex flex-col items-center justify-center p-8 text-stone-400">
                            <Wand2 size={32} className="mb-2 opacity-50" />
                            <p className="text-xs text-center">Click generate to align this submission with ShunyaMarg's voice styles.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
