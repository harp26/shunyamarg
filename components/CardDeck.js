'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Volume2, Share2, Compass, ArrowLeft, ArrowRight, Menu, X, BookOpen, AlertCircle
} from 'lucide-react';
import TTSPlayer from './TTSPlayer';
import ShareModal from './ShareModal';
import ReferenceMap from './ReferenceMap';

const GROUPS = [
  { label: "Indian Scriptures", topics: [
    { slug: "tattvabodh", name: "Glimpses of TattvaBodh" },
    { slug: "upanishads", name: "Learning from Upanishads" },
    { slug: "advait",     name: "Advait Vedanta" },
    { slug: "yogsutra",   name: "Patanjali YogSutra" },
    { slug: "gitas",      name: "Various Gitas" }
  ]},
  { label: "Peace Skills", topics: [
    { slug: "karma",      name: "Principles of Karma" },
    { slug: "meditation", name: "Meditation" },
    { slug: "arts",       name: "16 Arts of Hinduism" }
  ]},
  { label: "Contemplation", topics: [
    { slug: "stories",      name: "Stories to Make You Think" },
    { slug: "philosophies", name: "Global Philosophies" },
    { slug: "psychology",   name: "Modern Psychology" }
  ]}
];

const TB_SECTIONS = [
  { num: 1, name: "Sādhana Catuṣṭaya", sub: "The Four Qualifications", tag: "Sādhana Catuṣṭaya" },
  { num: 2, name: "Tri-Śarīra",         sub: "The Three Bodies",             tag: "Tri-Śarīra"         },
  { num: 3, name: "Pañcha Kosha",        sub: "The Five Sheaths",            tag: "Pañcha Kosha"       },
  { num: 4, name: "Three States",        sub: "Jāgrat · Svapna · Suṣupti",  tag: "Three States"       },
  { num: 5, name: "Ātman & Brahman",     sub: "The Nature of the Self",      tag: "Ātman & Brahman"    },
  { num: 6, name: "Mahāvākyas",          sub: "The Great Declarations",      tag: "Mahāvākyas"         }
];

export default function CardDeck() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State Variables
  const [currentTopic, setCurrentTopic] = useState('tattvabodh');
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentVoice, setCurrentVoice] = useState('trad');
  
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  
  // Overlay overlays
  const [showSectionNav, setShowSectionNav] = useState(true);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const cardInnerRef = useRef(null);

  // Sync params on initial load
  useEffect(() => {
    const t = searchParams.get('t') || searchParams.get('topic') || 'tattvabodh';
    const c = parseInt(searchParams.get('c') || searchParams.get('card')) || 0;
    const v = searchParams.get('v') || searchParams.get('voice') || 'trad';

    setCurrentTopic(t);
    setCurrentIndex(c);
    setCurrentVoice(v);
    
    if (t !== 'tattvabodh' || c > 0) {
      setShowSectionNav(false);
    }
    
    fetchCards(t, c);
  }, [searchParams]);

  // Fetch cards from Serverless API
  const fetchCards = async (topicSlug, targetIndex = 0) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cards?topic=${topicSlug}`);
      if (!res.ok) throw new Error('Failed to fetch cards');
      const data = await res.json();
      
      if (data && data.length > 0) {
        // Transform the DB relational structure into the state schema
        const mapped = data.map(c => {
          const tradVoice = c.card_voices?.find(v => v.voice_type === 'trad');
          const contVoice = c.card_voices?.find(v => v.voice_type === 'cont');
          const kathVoice = c.card_voices?.find(v => v.voice_type === 'kath');
          const generalVoice = c.card_voices?.find(v => v.voice_type === 'general');

          return {
            id: c.id,
            tag: c.tag || "",
            series: c.series || "",
            series_card: c.series_card || null,
            series_total: c.series_total || null,
            image_url: c.image_url || null,
            content_fallback: c.content_fallback || "",
            trad: {
              q: tradVoice?.title_override || c.title,
              body: tradVoice?.body || c.content_fallback,
              time: c.read_time || "3 min read"
            },
            cont: {
              q: contVoice?.title_override || c.title,
              body: contVoice?.body || c.content_fallback,
              time: c.read_time || "3 min read"
            },
            kath: {
              q: kathVoice?.title_override || c.title,
              body: kathVoice?.body || c.content_fallback,
              time: c.read_time || "3 min read"
            }
          };
        });
        setCards(mapped);
        setCurrentIndex(targetIndex < mapped.length ? targetIndex : 0);
      } else {
        // Mock fallback if empty
        setCards([{
          tag: "Notice",
          trad: { q: "No Cards Seeded Yet", body: "Use the database seeder to load the primary cards.", time: "1 min read" },
          cont: { q: "No Cards Seeded Yet", body: "Use the database seeder to load the primary cards.", time: "1 min read" },
          kath: { q: "No Cards Seeded Yet", body: "Use the database seeder to load the primary cards.", time: "1 min read" }
        }]);
      }
    } catch (err) {
      console.error('Error fetching cards:', err);
    } finally {
      setLoading(false);
    }
  };

  // State Persistence helper
  const updateUrlAndProgress = (topic, index, voice) => {
    // Set search params without full refresh
    const params = new URLSearchParams();
    params.set('t', topic);
    params.set('c', index);
    params.set('v', voice);
    router.replace(`/?${params.toString()}`, { scroll: false });

    // Save in local storage
    try {
      localStorage.setItem('sm_progress', JSON.stringify({
        topic, index, voice, ts: Date.now()
      }));
    } catch(e) {}
  };

  // Navigators
  const selectTopic = async (slug) => {
    setShowMobileDrawer(false);
    setCurrentTopic(slug);
    setCurrentIndex(0);
    setCards([]);
    if (slug === 'tattvabodh') {
      setShowSectionNav(true);
    } else {
      setShowSectionNav(false);
    }
    await fetchCards(slug, 0);
    updateUrlAndProgress(slug, 0, currentVoice);
  };

  const selectVoice = (v) => {
    setCurrentVoice(v);
    updateUrlAndProgress(currentTopic, currentIndex, v);
  };

  const navigate = (dir) => {
    if (animating || cards.length === 0) return;
    const next = currentIndex + dir;

    if (next < 0) {
      if (currentTopic === 'tattvabodh') {
        setShowSectionNav(true);
      }
      return;
    }

    if (next >= cards.length) return;

    setAnimating(true);
    setAnimationClass('exiting');
    
    setTimeout(() => {
      setCurrentIndex(next);
      updateUrlAndProgress(currentTopic, next, currentVoice);
      setAnimationClass('entering');
      
      // Request repaint to ensure slide fading behaves perfectly
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationClass('');
          setTimeout(() => { setAnimating(false); }, 280);
        });
      });
      
      // Scroll smoothly to voice bar for consistent readability positioning
      const vb = document.getElementById('voiceBar');
      if (vb) {
        const offset = vb.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }, 260);
  };

  const jumpToSection = (num) => {
    const sec = TB_SECTIONS.find(s => s.num === num);
    if (!sec || cards.length === 0) return;

    // Filter to find the first card matching this section's Sanskrit tag
    const firstIdx = cards.findIndex(c => 
      c.tag.toLowerCase().startsWith(sec.tag.substring(0, 6).toLowerCase())
    );

    if (firstIdx >= 0) {
      setCurrentIndex(firstIdx);
      setShowSectionNav(false);
      updateUrlAndProgress(currentTopic, firstIdx, currentVoice);
    } else {
      alert("This section cards are currently unavailable.");
    }
  };

  const resumeReading = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('sm_progress'));
      if (saved && saved.topic === 'tattvabodh') {
        setCurrentIndex(saved.index);
        setCurrentVoice(saved.voice || 'trad');
        setShowSectionNav(false);
        updateUrlAndProgress('tattvabodh', saved.index, saved.voice || 'trad');
      }
    } catch(e) {}
  };

  const getLiveCardCount = (tag) => {
    if (!tag) return 0;
    const prefix = tag.substring(0, 6).toLowerCase();
    return cards.filter(c => c.tag && c.tag.toLowerCase().startsWith(prefix)).length;
  };

  const activeCard = cards[currentIndex] || null;
  const activeVoice = activeCard ? (activeCard[currentVoice] || activeCard.cont) : null;
  const progressPct = cards.length > 0 ? Math.round(((currentIndex + 1) / cards.length) * 100) : 0;

  // Format body text to intelligently support rich newlines, strong elements, and optional image embedding
  const formatBodyText = (text) => {
    if (!text) return '';
    let formatted = text;
    // Replace **word** with bold HTML tag
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace double newlines with neat margins
    formatted = formatted.replace(/\n\n/g, '</p><p className="mb-4">');
    formatted = formatted.replace(/\n/g, '<br/>');
    return `<p className="mb-4">${formatted}</p>`;
  };

  return (
    <div className="section-inner max-w-6xl mx-auto px-4 md:px-6 py-6 font-sans">
      
      {/* Knowledge Base Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Topic Sidebar (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-1 border-r border-[#d8d3ca] pr-6">
          <h4 className="font-serif text-sm font-semibold tracking-wider text-stone-500 uppercase mb-6 pb-2 border-b border-[#d8d3ca]">
            Main Deck Library
          </h4>
          
          {GROUPS.map((group, idx) => (
            <div key={idx} className="mb-6">
              <span className="text-[10px] tracking-wider uppercase font-semibold text-[#b8935a] block mb-2">
                {group.label}
              </span>
              <div className="space-y-1">
                {group.topics.map(t => (
                  <button
                    key={t.slug}
                    onClick={() => selectTopic(t.slug)}
                    className={`w-full text-left p-2 rounded transition-all text-xs ${
                      currentTopic === t.slug 
                        ? 'bg-[#1a1916] text-[#f5f3ee] font-semibold font-serif' 
                        : 'text-stone-600 hover:bg-stone-200 hover:text-stone-900 font-sans'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Central Active Area */}
        <div className="lg:col-span-3 flex flex-col">
          
          {/* Mobile Navigator Action Bar */}
          <div className="lg:hidden flex items-center justify-between mb-4 bg-stone-100 p-2.5 rounded border border-stone-200">
            <span className="font-serif text-xs font-semibold text-stone-700">
              {GROUPS.flatMap(g => g.topics).find(t => t.slug === currentTopic)?.name || currentTopic}
            </span>
            <button
              onClick={() => setShowMobileDrawer(true)}
              className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase font-bold text-[#b8935a] border border-[#d8d3ca] px-2.5 py-1 rounded"
            >
              <Menu size={12} />
              Switch Topic
            </button>
          </div>

          {/* Reference Map Trigger */}
          {currentTopic === 'tattvabodh' && (
            <button
              onClick={() => setShowMapModal(true)}
              className="flex items-center justify-center gap-2 p-3 mb-4 rounded border border-[#c9a05a]/30 bg-gradient-to-r from-[#c9a05a]/8 to-[#c9a05a]/4 text-xs font-semibold tracking-wider text-[#b8935a] uppercase hover:bg-[#c9a05a]/15 transition-all w-full select-none"
            >
              <Compass size={14} className="animate-spin-slow" />
              Launch Sanskrit Reference Map
            </button>
          )}

          {/* Loading Skeletal state */}
          {loading ? (
            <div className="bg-white border border-stone-200 rounded-md h-[400px] flex flex-col items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-stone-300 border-t-amber-600"></div>
              <span className="text-xs text-stone-500">Retrieving deck details...</span>
            </div>
          ) : showSectionNav && currentTopic === 'tattvabodh' ? (
            <div className="bg-white border border-[#d8d3ca] p-6 md:p-8 rounded-md shadow-sm">
              <h3 className="font-serif text-xl font-normal text-stone-900 mb-1">
                TattvaBodh Chapters
              </h3>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#b8935a] mb-6 pb-2 border-b border-[#d8d3ca]">
                Select a section to begin studying
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TB_SECTIONS.map(sec => {
                  const cardCount = getLiveCardCount(sec.tag);
                  const isAvailable = cardCount > 0;
                  return (
                    <button
                      key={sec.num}
                      onClick={() => isAvailable && jumpToSection(sec.num)}
                      disabled={!isAvailable}
                      className={`flex items-center gap-4 p-4 border border-[#d8d3ca] rounded transition-all text-left ${
                        isAvailable 
                          ? 'bg-white hover:bg-[#1a1916] hover:text-[#f5f3ee] hover:border-[#1a1916] group cursor-pointer' 
                          : 'bg-stone-50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <span className="font-serif text-xl font-light text-[#b8935a] w-8">
                        {String(sec.num).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <div className="font-serif text-sm font-medium text-stone-900 group-hover:text-white">
                          {sec.name}
                        </div>
                        <div className="text-[11px] text-stone-500 group-hover:text-stone-300">
                          {sec.sub}
                        </div>
                      </div>
                      <span className="text-[10px] text-stone-500 font-sans group-hover:text-stone-300">
                        {isAvailable ? `${cardCount} cards` : 'Coming soon'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Resume Reading Panel */}
              {typeof window !== 'undefined' && localStorage.getItem('sm_progress') && (
                <div className="mt-6 p-4 rounded border border-amber-600/30 bg-amber-500/5 flex items-center justify-between gap-4 text-xs">
                  <span className="text-stone-700">Resume your last studied card position inside TattvaBodh?</span>
                  <button 
                    onClick={resumeReading}
                    className="bg-[#1a1916] text-[#f5f3ee] px-4 py-1.5 rounded text-[10px] uppercase font-bold tracking-wider hover:bg-stone-800 transition-colors"
                  >
                    Resume Reading →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col">
              
              {/* Voice Tabs switcher */}
              <div id="voiceBar" className="flex items-center bg-stone-100 p-1.5 rounded border border-[#d8d3ca] mb-4 gap-1">
                <span className="hidden sm:inline-block text-[9px] uppercase tracking-wider font-bold text-stone-500 mr-2 ml-1">
                  Layer Selector
                </span>
                
                {['trad', 'cont', 'kath'].map(vType => {
                  const label = vType === 'trad' ? 'Traditional' : vType === 'cont' ? 'Contemporary' : 'Katha';
                  const activeColorClass = 
                    vType === 'trad' ? 'bg-[#3a3060] text-white hover:bg-[#322954]' :
                    vType === 'cont' ? 'bg-[#1a3a2a] text-white hover:bg-[#132c1f]' :
                    'bg-[#7a5e2a] text-white hover:bg-[#684f22]';
                  
                  return (
                    <button
                      key={vType}
                      onClick={() => selectVoice(vType)}
                      className={`flex-1 text-center py-2.5 rounded font-sans text-[10px] uppercase tracking-wider font-semibold transition-all ${
                        currentVoice === vType 
                          ? activeColorClass 
                          : 'text-stone-600 hover:text-stone-900 bg-transparent hover:bg-stone-200'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Breadcrumb Path & Counter */}
              <div className="flex items-center justify-between text-[11px] mb-3 pb-2 border-b border-[#d8d3ca] font-sans text-stone-500">
                <div className="flex items-center gap-1 truncate max-w-[70%]">
                  <span 
                    onClick={() => selectTopic(currentTopic)}
                    className="hover:underline hover:text-[#b8935a] cursor-pointer"
                  >
                    {GROUPS.flatMap(g => g.topics).find(t => t.slug === currentTopic)?.name || currentTopic}
                  </span>
                  {activeCard?.tag && (
                    <>
                      <span> › </span>
                      <span className="text-stone-800 font-semibold">{activeCard.tag}</span>
                    </>
                  )}
                  {activeCard?.series && (
                    <>
                      <span> › </span>
                      <span className="italic text-stone-600">{activeCard.series}</span>
                    </>
                  )}
                </div>
                <div className="font-semibold text-stone-800 whitespace-nowrap">
                  {activeCard?.series_card && activeCard?.series_total 
                    ? `${activeCard.series_card} of ${activeCard.series_total}`
                    : `${currentIndex + 1} of ${cards.length}`}
                </div>
              </div>

              {/* The Core Deck box */}
              <div className="card-box bg-white border border-[#d8d3ca] rounded-md shadow-sm flex flex-col relative overflow-hidden h-[540px]">
                
                {/* Visual Top Shimmer Bar */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#7a5e2a] via-[#c9a05a] to-[#7a5e2a] animate-pulse"></div>

                {/* Progress bar Fill */}
                <div className="h-[2px] bg-stone-100 w-full mt-[3px]">
                  <div 
                    className="h-full bg-[#c9a05a] transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>

                {/* Sliding inner card content */}
                <div 
                  ref={cardInnerRef} 
                  className={`card-inner p-6 md:p-8 flex-1 flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                    animationClass === 'exiting' ? 'opacity-0 -translate-x-6' : 
                    animationClass === 'entering' ? 'opacity-0 translate-x-6' : 'opacity-100 translate-x-0'
                  }`}
                >
                  <div className="flex-1 overflow-y-auto mb-4 pr-1 scrollbar-thin">
                    {/* Optional Image Tag */}
                    {activeCard?.image_url && (
                      <div className="mb-4 rounded overflow-hidden max-h-[200px] border border-stone-200">
                        <img 
                          src={activeCard.image_url} 
                          alt={activeVoice?.q || 'spiritual card'} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Quotation Header Title */}
                    <h2 className="font-serif text-stone-900 leading-snug mb-4 tracking-normal text-xl md:text-2xl font-light">
                      {activeVoice?.q || 'Title'}
                    </h2>
                    
                    {/* High-Contrast legibility card body */}
                    <div 
                      className="font-serif text-[15px] md:text-[17px] text-[#1c1a18] leading-relaxed font-normal"
                      dangerouslySetInnerHTML={{ __html: formatBodyText(activeVoice?.body || activeCard?.content_fallback) }}
                    />
                  </div>

                  {/* Narrate & Share footer tools */}
                  <div className="border-t border-[#d8d3ca] pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Dynamic TTS Narration Bar */}
                    <TTSPlayer 
                      textToRead={`${activeVoice?.q || ''}. ${activeVoice?.body || ''}`}
                      onFinished={() => {
                        // Auto-advance quote card if not on the very last card of the deck
                        if (currentIndex < cards.length - 1) {
                          navigate(1);
                        }
                      }}
                      activeCardId={activeCard?.id || currentIndex}
                    />

                    {/* Desktop control Navigators */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowShareModal(true)}
                        className="flex items-center gap-1.5 px-3 py-2 border border-[#d8d3ca] hover:border-[#c9a05a] hover:bg-stone-100 text-stone-600 hover:text-[#b8935a] font-sans text-xs font-semibold rounded transition-all"
                      >
                        <Share2 size={13} />
                        Share
                      </button>

                      <button
                        onClick={() => {
                          if (currentIndex === 0 && currentTopic === 'tattvabodh') {
                            setShowSectionNav(true);
                          } else {
                            navigate(-1);
                          }
                        }}
                        disabled={currentIndex === 0 && currentTopic !== 'tattvabodh'}
                        className="px-4 py-2 border border-[#d8d3ca] text-xs font-semibold text-stone-600 hover:bg-stone-50 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {currentIndex === 0 && currentTopic === 'tattvabodh' ? '← Index' : '← Prev'}
                      </button>

                      <button
                        onClick={() => navigate(1)}
                        disabled={currentIndex === cards.length - 1}
                        className="px-4 py-2 bg-[#1a1916] text-[#f5f3ee] hover:bg-stone-800 text-xs font-semibold rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {currentIndex === cards.length - 1 ? 'Done ✓' : 'Next →'}
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* Share Quote Canvas Modal */}
      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        card={activeCard}
        voiceType={currentVoice}
        currentTopic={currentTopic}
        currentIndex={currentIndex}
      />

      {/* Reference Map Overlay */}
      <ReferenceMap 
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
      />

      {/* Mobile Topic Selection Drawer Overlay */}
      {showMobileDrawer && (
        <div className="fixed inset-0 z-[999] bg-black/60 flex items-end animate-fade-in" onClick={() => setShowMobileDrawer(false)}>
          <div 
            className="w-full bg-[#f5f3ee] rounded-t-2xl max-h-[80vh] overflow-y-auto p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto mb-4"></div>
            
            <div className="flex items-center justify-between border-b border-stone-250 pb-2 mb-4">
              <span className="font-serif text-base font-semibold text-stone-900">Switch Study Topic</span>
              <button onClick={() => setShowMobileDrawer(false)} className="text-stone-500 p-1"><X size={16} /></button>
            </div>

            <div className="space-y-4">
              {GROUPS.map((group, idx) => (
                <div key={idx}>
                  <div className="text-[9px] uppercase tracking-wider font-bold text-[#b8935a] mb-2 px-2">
                    {group.label}
                  </div>
                  <div className="space-y-1 bg-white p-1 rounded border border-stone-200">
                    {group.topics.map(t => (
                      <button
                        key={t.slug}
                        onClick={() => selectTopic(t.slug)}
                        className={`w-full text-left p-2.5 rounded text-xs transition-all flex items-center justify-between ${
                          currentTopic === t.slug 
                            ? 'bg-[#1a1916] text-[#f5f3ee] font-semibold' 
                            : 'text-stone-700 active:bg-stone-100'
                        }`}
                      >
                        <span>{t.name}</span>
                        {currentTopic === t.slug && <span className="text-[9px] uppercase font-bold tracking-wider text-[#c9a05a]">Active</span>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
