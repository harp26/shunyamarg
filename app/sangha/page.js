'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Loader2, CheckCircle2 } from 'lucide-react';

export default function SanghaPage() {
  const [formType, setFormType] = useState('contribution');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: formType, name, email, raw_content: content })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0e0d0b] flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md">
          <CheckCircle2 size={48} className="mx-auto mb-6 text-[#c9a05a]" />
          <h1 className="font-serif text-3xl font-light text-[#e8e4db] mb-3">Thank You</h1>
          <p className="font-serif text-[#b0aba2] text-lg italic mb-8">
            Your insight has been received. The community grows through contributions like yours.
          </p>
          <Link href="/deck" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#c9a05a] text-[#0e0d0b] text-[12px] tracking-[0.1em] uppercase no-underline rounded transition-all hover:bg-[#e2c07a]">
            <ArrowLeft size={14} /> Return to Knowledge Base
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0d0b] text-[#e8e4db] font-sans">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-[60px] bg-[rgba(14,13,11,0.85)] backdrop-blur-md border-b border-[rgba(201,160,90,0.15)]">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c9a05a] to-[#7a5e2a] flex items-center justify-center text-[9px] font-bold text-[#0e0d0b]">Ś</div>
          <span className="font-serif text-[1rem] font-normal text-[#c9a05a] tracking-wider">ShunyaMarg</span>
        </Link>
        <Link href="/deck" className="text-[11px] tracking-[0.14em] uppercase text-[#b0aba2] no-underline transition-colors hover:text-[#c9a05a]">← Back to Deck</Link>
      </nav>

      <div className="pt-[60px] min-h-screen flex items-center justify-center px-6 py-16">
        <div className="max-w-[960px] w-full mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2.5 mb-4">
              <span className="block w-5 h-[1px] bg-[#c9a05a] opacity-60" />
              <span className="text-[10px] tracking-[0.22em] uppercase text-[#c9a05a]">Sangha</span>
              <span className="block w-5 h-[1px] bg-[#c9a05a] opacity-60" />
            </div>
            <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light text-[#e8e4db] mb-3">The Sangha</h1>
            <p className="font-serif text-[1.05rem] text-[#b0aba2] max-w-[500px] mx-auto leading-relaxed">
              Share an insight, ask a question, or contribute a teaching. The AI will transform your submission into a beautifully crafted multi-voice card.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 border border-[rgba(201,160,90,0.15)] rounded bg-[#1a1916]">
              <div className="flex gap-2 mb-6">
                <button onClick={() => setFormType('contribution')} className={`flex-1 py-2.5 rounded text-[11px] uppercase tracking-wider font-semibold transition-all ${formType === 'contribution' ? 'bg-[#c9a05a] text-[#0e0d0b]' : 'border border-[rgba(201,160,90,0.2)] text-[#b0aba2] hover:border-[#c9a05a]'}`}>Contribute</button>
                <button onClick={() => setFormType('query')} className={`flex-1 py-2.5 rounded text-[11px] uppercase tracking-wider font-semibold transition-all ${formType === 'query' ? 'bg-[#c9a05a] text-[#0e0d0b]' : 'border border-[rgba(201,160,90,0.2)] text-[#b0aba2] hover:border-[#c9a05a]'}`}>Ask a Query</button>
              </div>
              {formType === 'contribution' ? (
                <div>
                  <h3 className="font-serif text-[1.3rem] font-light text-[#c9a05a] mb-2">Share an Insight</h3>
                  <p className="text-[0.88rem] text-[#b0aba2] leading-relaxed">Share a teaching, reflection, or insight that has arisen in your practice. The AI will process it into the three brand voices — Traditional, Contemporary, and Katha — and suggest a topic for admin review.</p>
                </div>
              ) : (
                <div>
                  <h3 className="font-serif text-[1.3rem] font-light text-[#c9a05a] mb-2">Ask a Question</h3>
                  <p className="text-[0.88rem] text-[#b0aba2] leading-relaxed">Stuck on a concept? Wrestling with a teaching? Submit your question and it will be answered through the lens of all three voices — scripture, modern reflection, and story.</p>
                </div>
              )}
              <div className="border-t border-[rgba(201,160,90,0.1)] pt-6 mt-6">
                <h4 className="text-[10px] tracking-[0.16em] uppercase text-[#b0aba2] mb-3">What happens next?</h4>
                <ol className="space-y-3 text-[0.85rem] text-[#b0aba2]">
                  <li className="flex items-start gap-2"><span className="text-[#c9a05a] font-bold shrink-0">1.</span>Your submission enters the review queue.</li>
                  <li className="flex items-start gap-2"><span className="text-[#c9a05a] font-bold shrink-0">2.</span>An admin triggers the AI to generate three voice drafts.</li>
                  <li className="flex items-start gap-2"><span className="text-[#c9a05a] font-bold shrink-0">3.</span>After review and approval, your card joins the Knowledge Base.</li>
                </ol>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 border border-[rgba(201,160,90,0.15)] rounded bg-[#1a1916]">
              <div className="mb-5">
                <label className="block text-[10px] tracking-[0.14em] uppercase text-[#b0aba2] mb-1.5">Your Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter your name" className="w-full px-3 py-2.5 border border-[rgba(201,160,90,0.2)] rounded bg-[#141310] text-[0.9rem] text-[#e8e4db] outline-none transition-colors focus:border-[#c9a05a]" />
              </div>
              <div className="mb-5">
                <label className="block text-[10px] tracking-[0.14em] uppercase text-[#b0aba2] mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" className="w-full px-3 py-2.5 border border-[rgba(201,160,90,0.2)] rounded bg-[#141310] text-[0.9rem] text-[#e8e4db] outline-none transition-colors focus:border-[#c9a05a]" />
              </div>
              <div className="mb-6">
                <label className="block text-[10px] tracking-[0.14em] uppercase text-[#b0aba2] mb-1.5">{formType === 'contribution' ? 'Your Insight / Reflection' : 'Your Question'}</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required placeholder={formType === 'contribution' ? "Share the teaching, insight, or reflection that came to you..." : "What question is arising in your practice or study?"} rows={6} className="w-full px-3 py-2.5 border border-[rgba(201,160,90,0.2)] rounded bg-[#141310] text-[0.9rem] text-[#e8e4db] outline-none transition-colors focus:border-[#c9a05a] resize-vertical min-h-[120px]" />
              </div>
              {error && <div className="mb-4 p-3 bg-[#b85a5a]/10 border border-[#b85a5a]/30 rounded text-[0.85rem] text-[#b85a5a]">{error}</div>}
              <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 py-3 bg-[#c9a05a] text-[#0e0d0b] border-none rounded text-[12px] tracking-[0.1em] uppercase cursor-pointer transition-all hover:bg-[#e2c07a] disabled:opacity-50 font-sans">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {submitting ? 'Submitting...' : `Submit ${formType === 'contribution' ? 'Insight' : 'Query'}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}