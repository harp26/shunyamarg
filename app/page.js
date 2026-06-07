'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const styles = {
  section: { padding: '48px 20px' },
  inner: { maxWidth: 800, margin: '0 auto' },
  eyebrow: { fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9a05a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 },
  eyebrowLine: { display: 'inline-block', width: 20, height: 1, background: '#c9a05a', opacity: 0.6 },
  sectionTitle: { fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(1.8rem,4.5vw,2.8rem)', fontWeight: 300, lineHeight: 1.12 },
  bodyText: { fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '1rem', fontWeight: 300, color: '#6a6560', lineHeight: 1.9, marginBottom: 16 },
  goldBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 24px', width: '100%', background: '#c9a05a', color: '#0e0d0b', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2, fontWeight: 400 },
  ghostLink: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a7670', textDecoration: 'none' },
  divider: { border: 'none', borderTop: '1px solid rgba(201,160,90,0.15)', margin: 0 },
};

const PILLARS = [
  { num: '01', sans: 'Shunya Chitta · शून्य चित्त', eng: 'Empty Mind', desc: 'When the restless stream of thoughts settles into stillness, the mind dissolves into Shunya. Chitta is not suppressed — it is stilled, like a lake when wind ceases. In that stillness, pure awareness shines.' },
  { num: '02', sans: 'Shunya Bheda · शून्य भेद', eng: 'Empty Division', desc: 'The experiencer, the experienced, and the experience lose their separateness — all become one in Shunya. The line between self and world, drawn so firmly by the mind, is seen for what it is: a useful fiction.' },
  { num: '03', sans: 'Shunya Aasakti · शून्य आसक्ति', eng: 'Empty Attachment', desc: 'From possessions to attachments, from wealth to relationships — the clinging fades away, revealing the lightness of Shunya. Nothing is abandoned; instead, everything is held lightly, with an open hand.' },
  { num: '04', sans: 'Shunya Vani · शून्य वाणी', eng: 'Empty Speech', desc: 'Words give way to silence, arguments dissolve, and truth is expressed in the quiet depth of Shunya. Every word spoken from stillness carries more weight than a thousand spoken from agitation.' },
  { num: '05', sans: 'Shunya Kaal · शून्य काल', eng: 'Empty Time', desc: 'Past and future vanish, journey and destination merge — all that remains is the timeless now of Shunya. The present moment is not a stepping stone to some future arrival; it is itself the destination.' }
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    h();
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0e0d0b', color: '#e8e4db', fontFamily: "'DM Sans', system-ui, sans-serif", overflowX: 'hidden', lineHeight: 1.7 }}>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', background: 'rgba(14,13,11,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(201,160,90,0.15)' : '1px solid transparent',
        transition: 'border-color 0.3s'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/shunyamarg-logo.jpg" alt="ShunyaMarg" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', opacity: 0.9 }} />
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', fontWeight: 400, color: '#c9a05a', letterSpacing: '0.08em' }}>ShunyaMarg</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/deck" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#b0aba2', textDecoration: 'none' }}>Gyaan Kosh</Link>
          <a href="#sangha" style={{ padding: '4px 12px', border: '1px solid rgba(201,160,90,0.15)', borderRadius: 20, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c9a05a', textDecoration: 'none' }}>Sangha</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', padding: '80px 20px 40px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, pointerEvents: 'none', background: 'radial-gradient(ellipse, rgba(201,160,90,0.07) 0%, transparent 70%)' }} />
        
        <div style={{ position: 'relative', zIndex: 1, width: 100, height: 100, margin: '0 auto 24px' }}>
          <img src="/shunyamarg-logo.jpg" alt="ShunyaMarg" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 40px rgba(201,160,90,0.2), 0 0 80px rgba(201,160,90,0.08)' }} />
          <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '1px solid rgba(201,160,90,0.35)', animation: 'spin-slow 20s linear infinite' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ display: 'inline-block', width: 24, height: 1, background: '#c9a05a', opacity: 0.5 }} />
          <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9a05a' }}>A philosophical path</span>
          <span style={{ display: 'inline-block', width: 24, height: 1, background: '#c9a05a', opacity: 0.5 }} />
        </div>

        <h1 style={{ position: 'relative', zIndex: 1, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.5rem,10vw,5rem)', fontWeight: 300, lineHeight: 1.05, color: '#e8e4db', marginBottom: 8, letterSpacing: '-0.01em' }}>
          <span style={{ display: 'block' }}>ShunyaMarg</span>
          <span style={{ display: 'block', fontStyle: 'italic', color: '#c9a05a', fontSize: '0.7em' }}>The Path of Dissolution</span>
        </h1>

        <p style={{ position: 'relative', zIndex: 1, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1rem', fontWeight: 300, color: '#7a7670', lineHeight: 1.8, maxWidth: 480, margin: '16px auto 16px' }}>
          When the restless activity of the mind begins to fade, we glimpse moments of pure stillness — a taste of Shunya, where energy and freshness flow naturally.
        </p>

        <p style={{ position: 'relative', zIndex: 1, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '0.95rem', color: '#c9a05a', letterSpacing: '0.06em', opacity: 0.8, marginBottom: 32 }}>
          सर्वम् शून्यम् · शून्यम् सर्वम्
        </p>

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%', maxWidth: 280 }}>
          <Link href="/deck" style={styles.goldBtn}>
            Enter Gyaan Kosh
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <a href="#about" style={styles.ghostLink}>
            Read the path
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
      </section>

      {/* ABOUT */}
      <hr style={styles.divider} />
      <section id="about" style={{ ...styles.section, background: '#f5f3ee', color: '#1a1916' }}>
        <div style={styles.inner}>
          <p style={{ ...styles.eyebrow, color: '#8a6530' }}>
            <span style={styles.eyebrowLine} /> About ShunyaMarg
          </p>
          <h2 style={{ ...styles.sectionTitle, color: '#1a1916', marginBottom: 32 }}>The Zero Milestone</h2>
          <div>
            <p style={styles.bodyText}>Shunya Marg is a journey towards freedom — freedom from the noise of thoughts, the weight of possessions, and even the burden of unnecessary words. In meditation, when the restless activity of the mind begins to fade, we glimpse moments of pure stillness — a taste of Shunya, where energy and freshness flow naturally.</p>
            <p style={styles.bodyText}>In life too, when we choose simplicity over excess, we lighten our burdens and discover space for clarity and joy. And often, silence itself becomes the deepest expression — when words fail to capture truth, when anger tempts us to speak harshly, or when desire makes us explain what we seek.</p>
            <p style={styles.bodyText}>At its essence, Shunya Marg is the path towards the Zero Milestone — the point where journey and destination dissolve into the present moment. Whatever we seek in life is not at some distant future, but here and now, at Shunya.</p>
            <p style={styles.bodyText}>In the Vedantic vision, even the triad of experiencer, experience, and experienced eventually dissolves. What remains when all three fall away is not emptiness, but pure Being — awareness itself, untouched by objects and unbound by divisions.</p>
            <p style={styles.bodyText}>To walk the path of Shunya is not to lose life, but to discover its essence. It is the arrival where less becomes infinite, and zero reveals the whole.</p>
            <div style={{ padding: '16px 20px', borderLeft: '2px solid #c9a05a', background: '#edeae3' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', color: '#1a1916', fontSize: '1rem' }}>
                सर्वम् शून्यम्, शून्यम् सर्वम् —<br />All is Shunya, Shunya is all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <hr style={styles.divider} />
      <section id="pillars" style={{ ...styles.section, background: '#141310' }}>
        <div style={styles.inner}>
          <p style={styles.eyebrow}><span style={styles.eyebrowLine} /> Five pillars</p>
          <h2 style={{ ...styles.sectionTitle, color: '#e8e4db', marginBottom: 12 }}>ShunyaMarg — The Path of Dissolution</h2>
          <p style={{ fontSize: '0.9rem', color: '#7a7670', lineHeight: 1.85, marginBottom: 32 }}>Five dimensions of emptying — not as deprivation, but as liberation from the unnecessary weight we carry in mind, identity, desire, word, and moment.</p>
          <div>
            {PILLARS.map((p, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '2rem 1fr', gap: 16,
                padding: '20px 0', borderBottom: '1px solid rgba(201,160,90,0.15)',
                borderTop: i === 0 ? '1px solid rgba(201,160,90,0.15)' : 'none'
              }}>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', fontWeight: 300, color: '#7a5e2a', lineHeight: 1 }}>{p.num}</span>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.15rem', fontWeight: 400, color: '#c9a05a', marginBottom: 2 }}>{p.sans}</div>
                  <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a7670', marginBottom: 8 }}>{p.eng}</div>
                  <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.9rem', fontWeight: 300, color: '#7a7670', lineHeight: 1.8 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <hr style={styles.divider} />
      <section style={{ ...styles.section, background: '#1a1916', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.5rem,4vw,2.5rem)', fontWeight: 300, color: '#e8e4db', marginBottom: 12 }}>Gyaan Kosh — The Knowledge Base</h2>
          <p style={{ fontSize: '0.9rem', color: '#7a7670', lineHeight: 1.85, marginBottom: 24 }}>Explore 30+ cards spanning the Upanishads and TattvaBodh, each presented in three voices — Traditional, Contemporary, and Katha.</p>
          <Link href="/deck" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: '#c9a05a', color: '#0e0d0b', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2 }}>
            Enter Gyaan Kosh
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </section>

      {/* SANGHA */}
      <hr style={styles.divider} />
      <section id="sangha" style={{ ...styles.section, background: '#0e0d0b' }}>
        <div style={styles.inner}>
          <p style={styles.eyebrow}><span style={styles.eyebrowLine} /> Sangha · Community</p>
          <h2 style={{ ...styles.sectionTitle, color: '#e8e4db', marginBottom: 12 }}>Ask. Contribute. Connect.</h2>
          <p style={{ fontSize: '0.9rem', color: '#7a7670', lineHeight: 1.85, marginBottom: 32 }}>Every sincere question is a step on the path. We read every message. We respond to those that carry genuine seeking.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
            <div style={{ padding: 24, border: '1px solid rgba(201,160,90,0.15)', borderRadius: 2, background: '#1a1916' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.3rem', fontWeight: 300, color: '#c9a05a', marginBottom: 8 }}>Send a Query</h3>
              <p style={{ fontSize: '0.85rem', color: '#7a7670', lineHeight: 1.7, marginBottom: 16 }}>A question that sits with you. Something from the cards, or something life has asked of you that you have not been able to answer.</p>
              <Link href="/sangha" style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a05a', textDecoration: 'none' }}>Send a Query →</Link>
            </div>
            <div style={{ padding: 24, border: '1px solid rgba(201,160,90,0.15)', borderRadius: 2, background: '#1a1916' }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.3rem', fontWeight: 300, color: '#c9a05a', marginBottom: 8 }}>Contribute a Card</h3>
              <p style={{ fontSize: '0.85rem', color: '#7a7670', lineHeight: 1.7, marginBottom: 16 }}>If you have lived something this path touches, you can offer a card to the Gyaan Kosh. Submissions are reviewed before being woven in.</p>
              <Link href="/sangha" style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9a05a', textDecoration: 'none' }}>Contribute →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(201,160,90,0.15)', background: '#0e0d0b', padding: '40px 20px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
          <div>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.2rem', color: '#c9a05a', display: 'block', marginBottom: 8 }}>ShunyaMarg</span>
            <p style={{ fontSize: '0.85rem', color: '#7a7670', lineHeight: 1.65 }}>The path of dissolution. Walking towards the Zero Milestone — where journey and destination dissolve into the present moment.</p>
          </div>
          <div>
            <h5 style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7a7670', marginBottom: 12 }}>Explore</h5>
            <a href="#about" style={{ display: 'block', fontSize: 13, color: '#7a7670', textDecoration: 'none', marginBottom: 8 }}>The Path</a>
            <a href="#pillars" style={{ display: 'block', fontSize: 13, color: '#7a7670', textDecoration: 'none', marginBottom: 8 }}>Five Pillars</a>
            <Link href="/deck" style={{ display: 'block', fontSize: 13, color: '#7a7670', textDecoration: 'none', marginBottom: 8 }}>Gyaan Kosh</Link>
            <a href="#sangha" style={{ display: 'block', fontSize: 13, color: '#7a7670', textDecoration: 'none' }}>Sangha</a>
          </div>
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontSize: '1rem', color: '#c9a05a', lineHeight: 1.6 }}>सर्वम् शून्यम्<br />शून्यम् सर्वम्</p>
            <p style={{ marginTop: 12, fontSize: '0.82rem', color: '#7a7670' }}>All is Shunya.<br />Shunya is all.</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(201,160,90,0.15)', maxWidth: 800, margin: '24px auto 0', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#7a7670', letterSpacing: '0.04em' }}>© {new Date().getFullYear()} ShunyaMarg · All content is an offering, not a claim.</span>
          <span style={{ fontSize: 11, color: '#7a7670', letterSpacing: '0.04em' }}>contact@shunyamarg.org</span>
        </div>
      </footer>
    </div>
  );
}
