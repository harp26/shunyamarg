'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const h = () => setS(window.scrollY > 20);
    window.addEventListener('scroll', h);
    h();
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0d0b] text-[#e8e4db] font-sans overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-[60px]" style={{background:'rgba(14,13,11,0.85)',backdropFilter:'blur(16px)',borderBottom:s?'1px solid rgba(201,160,90,0.15)':'1px solid transparent'}}>
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a05a] to-[#7a5e2a] flex items-center justify-center text-[10px] font-bold text-[#0e0d0b]">Ś</div>
          <span className="font-serif text-[1.1rem] text-[#c9a05a] tracking-wider">ShunyaMarg</span>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <a href="#about" className="text-[11px] tracking-[0.14em] uppercase text-[#b0aba2] no-underline hover:text-[#c9a05a]">About</a>
          <Link href="/deck" className="text-[11px] tracking-[0.14em] uppercase text-[#b0aba2] no-underline hover:text-[#c9a05a]">Gyaan Kosh</Link>
          <a href="#sangha" className="px-4 py-1.5 border border-[rgba(201,160,90,0.15)] rounded-full text-[11px] tracking-[0.14em] uppercase text-[#c9a05a] no-underline hover:bg-[#c9a05a] hover:text-[#0e0d0b]">Sangha</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-12 py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]" style={{background:'radial-gradient(ellipse,rgba(201,160,90,0.07) 0%,transparent 70%)'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute rounded-full border border-[rgba(201,160,90,0.12)] w-[420px] h-[420px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[breathe_8s_ease-in-out_infinite]" />
          <div className="absolute rounded-full border border-[rgba(201,160,90,0.07)] w-[580px] h-[580px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[breathe_8s_ease-in-out_infinite_2s]" />
          <div className="absolute rounded-full border border-[rgba(201,160,90,0.04)] w-[740px] h-[740px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[breathe_8s_ease-in-out_infinite_4s]" />
        </div>

        <div className="relative z-10 w-[110px] h-[110px] mx-auto mb-10">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#c9a05a]/20 to-[#7a5e2a]/10 flex items-center justify-center text-4xl font-serif text-[#c9a05a]" style={{boxShadow:'0 0 40px rgba(201,160,90,0.2),0 0 80px rgba(201,160,90,0.08)'}}>ॐ</div>
          <div className="absolute -inset-[6px] rounded-full border border-[rgba(201,160,90,0.35)] animate-[spin-slow_20s_linear_infinite]" />
        </div>

        <div className="relative z-10 flex items-center gap-4 mb-6">
          <span className="block w-8 h-[1px] bg-[#c9a05a] opacity-50" />
          <span className="text-[11px] tracking-[0.22em] uppercase text-[#c9a05a]">The Path of Dissolution</span>
          <span className="block w-8 h-[1px] bg-[#c9a05a] opacity-50" />
        </div>

        <h1 className="relative z-10 font-serif text-[clamp(3rem,8vw,6.5rem)] font-light leading-[1.05] text-[#e8e4db] tracking-[-0.01em]">
          <span className="block">ShunyaMarg</span>
          <span className="block italic text-[#c9a05a] text-[0.75em]">The Path of Dissolution</span>
        </h1>

        <p className="relative z-10 font-serif text-[1.15rem] font-light text-[#b0aba2] leading-[1.8] max-w-[540px] mx-auto my-6">
          A journey towards freedom from the noise of thoughts, the weight of possessions, and the burden of unnecessary words.
        </p>

        <p className="relative z-10 font-serif italic text-[1rem] text-[#c9a05a] mb-12">सर्वं शून्यं — All is empty of separate self</p>

        <div className="relative z-10 flex items-center gap-6">
          <Link href="/deck" className="inline-flex items-center gap-2.5 px-8 py-3 bg-[#c9a05a] text-[#0e0d0b] text-[12px] tracking-[0.1em] uppercase rounded hover:bg-[#e2c07a]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            Explore the Deck
          </Link>
          <a href="#sangha" className="inline-flex items-center gap-2 text-[12px] tracking-[0.1em] uppercase text-[#b0aba2] no-underline hover:text-[#c9a05a]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Join Sangha
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-[#f5f3ee] px-6 md:px-12 py-24 text-[#1a1916]">
        <div className="max-w-[960px] mx-auto">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="block w-5 h-[1px] bg-[#c9a05a] opacity-60" />
            <span className="text-[10px] tracking-[0.22em] uppercase text-[#c9a05a]">About</span>
          </div>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3rem)] font-light mb-4">What is ShunyaMarg?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-14">
            <div>
              <p className="font-serif text-[1.1rem] font-light text-[#3a3632] leading-[1.9] mb-4">In a world drowning in information, ShunyaMarg offers something rare: the space to stop, to question, and to see through the illusions that keep us bound.</p>
              <p className="font-serif text-[1.1rem] font-light text-[#3a3632] leading-[1.9] mb-4">Drawing from the Upanishads, TattvaBodh, and the mahāvākyas, each card presents a single insight in three voices: traditional, contemporary, and kathā.</p>
              <div className="p-6 pl-8 border-l-2 border-[#c9a05a] bg-[#edeae3]">
                <p className="font-serif italic text-[1.05rem]">"You are not what you think you are. The thinking itself is the veil."</p>
              </div>
            </div>
            <div className="space-y-5 md:sticky md:top-20">
              {[{t:"Three Voices",d:"Every teaching in Traditional, Contemporary, and Katha styles — so the truth reaches you wherever you are."},
                {t:"No Belief Required",d:"Nothing asks for blind faith. Each teaching invites you to look and see for yourself."},
                {t:"Free & Open",d:"All content is freely accessible. No paywalls, no subscriptions, no agendas."}
              ].map((item,i)=>(
                <div key={i} className="p-6 border border-[rgba(26,25,22,0.10)] rounded bg-white">
                  <h4 className="font-serif text-[1.2rem] text-[#1a1916] mb-1">{item.t}</h4>
                  <p className="text-[0.88rem] text-[#3a3632]">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA DECK */}
      <section className="bg-[#1a1916] px-6 md:px-12 py-20 text-center">
        <div className="max-w-[960px] mx-auto">
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3rem)] font-light text-[#e8e4db] mb-4">Begin Your Inquiry</h2>
          <p className="text-[1rem] text-[#b0aba2] max-w-[500px] mx-auto mb-10">30+ cards spanning the Upanishads, TattvaBodh, and the Mahāvākyas. Each card speaks in three voices.</p>
          <Link href="/deck" className="inline-flex items-center gap-2.5 px-8 py-3 bg-[#c9a05a] text-[#0e0d0b] text-[12px] tracking-[0.1em] uppercase rounded hover:bg-[#e2c07a]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            Enter the Knowledge Base <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      {/* SANGHA */}
      <section id="sangha" className="bg-[#0e0d0b] px-6 md:px-12 py-24">
        <div className="max-w-[960px] mx-auto">
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3rem)] font-light mb-4">Join the Sangha</h2>
          <p className="text-[1rem] text-[#b0aba2] max-w-[600px] mb-10">Share an insight or ask a question — the AI transforms it into a beautifully formatted card.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 border border-[rgba(201,160,90,0.15)] rounded bg-[#1a1916]">
              <h3 className="font-serif text-[1.5rem] font-light text-[#c9a05a] mb-2">Contribute</h3>
              <p className="text-[0.88rem] text-[#b0aba2] mb-6">Share a teaching, insight, or reflection. The AI generates three voices and suggests a topic.</p>
              <Link href="/sangha" className="text-[12px] tracking-[0.1em] uppercase text-[#c9a05a] no-underline hover:text-[#e2c07a]">Submit an Insight →</Link>
            </div>
            <div className="p-8 border border-[rgba(201,160,90,0.15)] rounded bg-[#1a1916]">
              <h3 className="font-serif text-[1.5rem] font-light text-[#c9a05a] mb-2">Ask a Query</h3>
              <p className="text-[0.88rem] text-[#b0aba2] mb-6">Stuck on a concept? Submit your question for a multi-perspective response.</p>
              <Link href="/sangha" className="text-[12px] tracking-[0.1em] uppercase text-[#c9a05a] no-underline hover:text-[#e2c07a]">Ask a Question →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[rgba(201,160,90,0.15)] bg-[#0e0d0b]">
        <div className="max-w-[960px] mx-auto px-6 md:px-12 py-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="font-serif text-[1.3rem] text-[#c9a05a] block mb-2">ShunyaMarg</span>
            <p className="text-[0.85rem] text-[#b0aba2]">The Path of Dissolution.</p>
          </div>
          <div>
            <h5 className="text-[10px] tracking-[0.16em] uppercase text-[#b0aba2] mb-4">Navigate</h5>
            <Link href="/deck" className="block text-[13px] text-[#b0aba2] no-underline mb-2 hover:text-[#c9a05a]">Knowledge Base</Link>
            <a href="#sangha" className="block text-[13px] text-[#b0aba2] no-underline hover:text-[#c9a05a]">Sangha</a>
          </div>
          <div className="text-right">
            <p className="font-serif italic text-[1rem] text-[#c9a05a]">तत्त्वमसि<br/>— That Thou Art</p>
          </div>
        </div>
        <div className="border-t border-[rgba(201,160,90,0.15)] max-w-[960px] mx-auto px-6 md:px-12 py-5 flex justify-between">
          <span className="text-[11px] text-[#b0aba2]">© {new Date().getFullYear()} ShunyaMarg</span>
          <span className="text-[11px] text-[#b0aba2]">सर्वं शून्यं</span>
        </div>
      </footer>
    </div>
  );
}