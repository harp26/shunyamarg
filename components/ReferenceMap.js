'use client';
import { useEffect } from 'react';

export default function ReferenceMap({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[999] bg-[#0e0d0b]/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#f5f3ee] text-[#1a1916] rounded-md w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl border border-[#d8d3ca] flex flex-col font-sans">
        
        {/* Sticky Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#1a1916] text-[#e8e4db] hover:bg-[#c9a05a] hover:text-[#1a1916] transition-all w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold z-10"
        >
          ✕
        </button>

        {/* Content */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          <h2 className="font-serif text-2xl font-normal text-[#1a1916] mb-1">
            Tri-Śarīra · The Three Bodies
          </h2>
          <p className="text-[10px] tracking-wider uppercase text-stone-500 mb-6 font-semibold">
            A reference map — return to this whenever needed
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[#d8d3ca] border border-[#d8d3ca] rounded overflow-hidden">
            {/* Header Row */}
            <div className="bg-[#1a1916] text-[#e8e4db] text-[10px] tracking-wider uppercase font-semibold p-4">
              Body
            </div>
            <div className="bg-[#1a1916] text-[#e8e4db] text-[10px] tracking-wider uppercase font-semibold p-4">
              State of Consciousness
            </div>
            <div className="bg-[#1a1916] text-[#e8e4db] text-[10px] tracking-wider uppercase font-semibold p-4">
              Components
            </div>

            {/* Gross Body */}
            <div className="bg-white p-5 min-h-[100px] flex flex-col justify-start">
              <span className="font-serif text-lg font-medium text-[#1a1916]">स्थूल शरीर</span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#b8935a] mt-1 mb-2">
                Gross Body · Sthūla Śarīra
              </span>
              <p className="text-xs text-stone-500 leading-relaxed">
                Formed of the 5 great elements (pañca-mahābhūta) after gross combination
              </p>
            </div>
            <div className="bg-white p-5 min-h-[100px] flex flex-col justify-start">
              <span className="font-serif text-lg font-medium text-[#1a1916]">जाग्रत् अवस्था</span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#b8935a] mt-1 mb-2">
                Waking State
              </span>
              <p className="text-xs text-stone-500 leading-relaxed">
                Consciousness identified with the gross body — the waker (विश्व) experiencing the waking world
              </p>
            </div>
            <div className="bg-white p-5 min-h-[100px] flex flex-col justify-start text-xs text-stone-700 space-y-4">
              <div>
                <div className="text-[9px] font-bold tracking-wider uppercase text-[#b8935a] mb-1.5">
                  5 Sense Organs
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between border-b border-stone-50 pb-0.5"><span className="font-serif font-medium text-stone-900">श्रोत्र</span> <span className="text-stone-500">Ears (hearing)</span></div>
                  <div className="flex justify-between border-b border-stone-50 pb-0.5"><span className="font-serif font-medium text-stone-900">त्वक्</span> <span className="text-stone-500">Skin (touch)</span></div>
                  <div className="flex justify-between border-b border-stone-50 pb-0.5"><span className="font-serif font-medium text-stone-900">चक्षु</span> <span className="text-stone-500">Eyes (sight)</span></div>
                  <div className="flex justify-between border-b border-stone-50 pb-0.5"><span className="font-serif font-medium text-stone-900">रसना</span> <span className="text-stone-500">Tongue (taste)</span></div>
                  <div className="flex justify-between"><span className="font-serif font-medium text-stone-900">घ्राण</span> <span className="text-stone-500">Nose (smell)</span></div>
                </div>
              </div>
              <div>
                <div className="text-[9px] font-bold tracking-wider uppercase text-[#b8935a] mb-1.5">
                  5 Action Organs
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between border-b border-stone-50 pb-0.5"><span className="font-serif font-medium text-stone-900">वाक्</span> <span className="text-stone-500">Speech</span></div>
                  <div className="flex justify-between border-b border-stone-50 pb-0.5"><span className="font-serif font-medium text-stone-900">पाणि</span> <span className="text-stone-500">Hands</span></div>
                  <div className="flex justify-between border-b border-stone-50 pb-0.5"><span className="font-serif font-medium text-stone-900">पाद</span> <span className="text-stone-500">Feet</span></div>
                  <div className="flex justify-between border-b border-stone-50 pb-0.5"><span className="font-serif font-medium text-stone-900">पायु</span> <span className="text-stone-500">Elimination</span></div>
                  <div className="flex justify-between"><span className="font-serif font-medium text-stone-900">उपस्थ</span> <span className="text-stone-500">Generation</span></div>
                </div>
              </div>
            </div>

            {/* Subtle Body */}
            <div className="bg-white p-5 min-h-[100px] flex flex-col justify-start">
              <span className="font-serif text-lg font-medium text-[#1a1916]">सूक्ष्म शरीर</span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#b8935a] mt-1 mb-2">
                Subtle Body · Sūkṣma Śarīra
              </span>
              <p className="text-xs text-stone-500 leading-relaxed">
                17 components · Purely functional · No fixed form · Vehicle of the jīva across births
              </p>
            </div>
            <div className="bg-white p-5 min-h-[100px] flex flex-col justify-start">
              <span className="font-serif text-lg font-medium text-[#1a1916]">स्वप्न अवस्था</span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#b8935a] mt-1 mb-2">
                Dreaming State
              </span>
              <p className="text-xs text-stone-500 leading-relaxed">
                Consciousness identified with the subtle body — the dreamer (तैजस) creating experience from within
              </p>
            </div>
            <div className="bg-white p-5 min-h-[100px] flex flex-col justify-start text-xs text-stone-700 space-y-4">
              <div>
                <div className="text-[9px] font-bold tracking-wider uppercase text-[#b8935a] mb-1.5">
                  Antaḥkaraṇa (Inner Instrument)
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between border-b border-stone-50 pb-0.5"><span className="font-serif font-medium text-stone-900">मनस्</span> <span className="text-stone-500">Doubting mind</span></div>
                  <div className="flex justify-between border-b border-stone-50 pb-0.5"><span className="font-serif font-medium text-stone-900">बुद्धि</span> <span className="text-stone-500">Deciding intellect</span></div>
                  <div className="flex justify-between border-b border-stone-50 pb-0.5"><span className="font-serif font-medium text-stone-900">चित्त</span> <span className="text-stone-500">Memory store</span></div>
                  <div className="flex justify-between"><span className="font-serif font-medium text-stone-900">अहंकार</span> <span className="text-stone-500">Ego-sense</span></div>
                </div>
              </div>
              <div>
                <div className="text-[9px] font-bold tracking-wider uppercase text-[#b8935a] mb-1.5">
                  5 Prāṇas (Vital Forces)
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between border-b border-stone-50 pb-0.5"><span className="font-serif font-medium text-stone-900">प्राण</span> <span className="text-stone-500">In-breath · chest</span></div>
                  <div className="flex justify-between border-b border-stone-50 pb-0.5"><span className="font-serif font-medium text-stone-900">अपान</span> <span className="text-stone-500">Out-breath · lower</span></div>
                  <div className="flex justify-between border-b border-stone-50 pb-0.5"><span className="font-serif font-medium text-stone-900">व्यान</span> <span className="text-stone-500">Circulation</span></div>
                  <div className="flex justify-between border-b border-stone-50 pb-0.5"><span className="font-serif font-medium text-stone-900">उदान</span> <span className="text-stone-500">Upward · throat</span></div>
                  <div className="flex justify-between"><span className="font-serif font-medium text-stone-900">समान</span> <span className="text-stone-500">Integration · navel</span></div>
                </div>
              </div>
              <div className="text-[10px] text-stone-500 italic mt-2 border-t border-stone-100 pt-2">
                + 5 sense + 5 action organs (subtle form)
              </div>
            </div>

            {/* Causal Body */}
            <div className="bg-white p-5 min-h-[100px] flex flex-col justify-start">
              <span className="font-serif text-lg font-medium text-[#1a1916]">कारण शरीर</span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#b8935a] mt-1 mb-2">
                Causal Body · Kāraṇa Śarīra
              </span>
              <p className="text-xs text-stone-500 leading-relaxed">
                Seed of the other two · अनादि अविद्या · Dissolves only in liberation
              </p>
            </div>
            <div className="bg-white p-5 min-h-[100px] flex flex-col justify-start">
              <span className="font-serif text-lg font-medium text-[#1a1916]">सुषुप्ति अवस्था</span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#b8935a] mt-1 mb-2">
                Deep Sleep State
              </span>
              <p className="text-xs text-stone-500 leading-relaxed">
                Consciousness identified with the causal body — the deep sleeper (प्राज्ञ) resting in undifferentiated bliss
              </p>
            </div>
            <div className="bg-white p-5 min-h-[100px] flex flex-col justify-start text-xs text-stone-700">
              <div className="text-[9px] font-bold tracking-wider uppercase text-[#b8935a] mb-1.5">
                Anandamaya Kosha
              </div>
              <div className="space-y-1 mb-3">
                <div className="flex justify-between border-b border-stone-50 pb-0.5"><span className="font-serif font-medium text-stone-900">वासना</span> <span className="text-stone-500">Deep tendencies</span></div>
                <div className="flex justify-between border-b border-stone-50 pb-0.5"><span className="font-serif font-medium text-stone-900">संस्कार</span> <span className="text-stone-500">Impressions</span></div>
                <div className="flex justify-between"><span className="font-serif font-medium text-stone-900">कर्मफल</span> <span className="text-stone-500">Karmic seeds</span></div>
              </div>
              <p className="text-[10px] text-stone-500 italic leading-relaxed border-t border-stone-100 pt-2.5">
                All in unmanifest (avyakta) form — the seed containing the whole tree
              </p>
            </div>

            {/* Turiya Row */}
            <div className="col-span-1 md:col-span-3 bg-[#1a1916] text-[#c9a05a] p-5 text-center font-serif text-base italic leading-relaxed border-t border-stone-85">
              तुरीय — The Fourth · Pure Consciousness · The witness of all three bodies and all three states · This is what we are
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6 text-xs text-stone-500 font-sans border-t border-[#d8d3ca] pt-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#1a1916]"></div>
              <span>Gross → Waking → Annamaya Kosha</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#3a3060]"></div>
              <span>Subtle → Dreaming → Prāṇa · Mano · Vijñānamaya Kosha</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#3a2a10]"></div>
              <span>Causal → Deep Sleep → Ānandamaya Kosha</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#b8935a]"></div>
              <span>Turīya → The Self → Beyond all Koshas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
