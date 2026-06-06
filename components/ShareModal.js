'use client';
import { useState, useEffect, useRef } from 'react';
import { X, Download, Share2, Link, Check } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function ShareModal({ isOpen, onClose, card, voiceType, currentTopic, currentIndex }) {
  const [imageGenerated, setImageGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [shareDataUrl, setShareDataUrl] = useState('');
  const previewRef = useRef(null);

  const voice = card ? (card[voiceType] || card.cont || card.trad || {}) : {};
  const title = voice.q || (card ? card.title : 'ShunyaMarg');
  const bodyText = voice.body || (card ? card.content_fallback : '');

  useEffect(() => {
    if (isOpen && card) {
      generateImage();
    } else {
      setImageGenerated(false);
      setShareDataUrl('');
    }
  }, [isOpen, card, voiceType]);

  const showFeedback = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg('');
    }, 2000);
  };

  const generateImage = async () => {
    if (!card) return;
    setLoading(true);
    setImageGenerated(false);

    // Context line Builder
    const parentLabel = "Indian Scriptures";
    const topicLabels = {
      tattvabodh: "Glimpses of TattvaBodh",
      upanishads: "Learning from Upanishads",
      advait: "Advait Vedanta",
      yogsutra: "Patanjali YogSutra",
      gitas: "Various Gitas",
      karma: "Principles of Karma",
      meditation: "Meditation",
      arts: "16 Arts of Hinduism",
      stories: "Stories",
      philosophies: "Global Philosophies",
      psychology: "Modern Psychology"
    };

    const topicLabel = topicLabels[currentTopic] || currentTopic;
    const tagLabel = card.tag || '';
    let contextLine = `${parentLabel} · ${topicLabel}`;
    if (tagLabel) {
      contextLine += ` · ${tagLabel}`;
    }

    // Clean excerpt formatting
    let cleanContent = bodyText.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    cleanContent = cleanContent.replace(/[""]/g, '"').replace(/['']/g, "'");

    let excerpt = cleanContent.substring(0, 280).trim();
    if (cleanContent.length > 280) {
      const lastPeriod = excerpt.lastIndexOf('.');
      const lastQuestion = excerpt.lastIndexOf('?');
      const lastExclamation = excerpt.lastIndexOf('!');
      const lastSentence = Math.max(lastPeriod, lastQuestion, lastExclamation);
      if (lastSentence > 150) {
        excerpt = excerpt.substring(0, lastSentence + 1);
      } else {
        const lastSpace = excerpt.lastIndexOf(' ');
        if (lastSpace > 200) {
          excerpt = excerpt.substring(0, lastSpace) + '...';
        } else {
          excerpt += '...';
        }
      }
    }

    const shareUrl = `shunyamarg.org/?t=${currentTopic}&c=${currentIndex}`;

    const bgGradient = 'linear-gradient(135deg, #FFF8E7 0%, #F5E6D3 100%)';
    const borderColor = '#C9A05A';
    const titleColor = '#2D1810';
    const bodyColor = '#4A3828';
    const contextColor = '#8B7355';
    const brandColor = '#8B7355';

    // Temp Off-Screen rendering container
    const tempDiv = document.createElement('div');
    tempDiv.style.cssText = `
      width: 1080px;
      height: 1080px;
      background: ${bgGradient};
      border: 3px solid ${borderColor};
      border-radius: 8px;
      padding: 70px 60px 60px;
      position: absolute;
      left: -9999px;
      top: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      box-sizing: border-box;
    `;

    tempDiv.innerHTML = `
      <div style="width: 100%; text-align: center;">
        <div style="font-size: 16px; color: ${contextColor}; letter-spacing: 0.12em; font-family: Arial, sans-serif; font-weight: 400; margin-bottom: 35px; text-transform: uppercase;">
          ${contextLine}
        </div>
      </div>
      
      <div style="max-width: 920px; width: 100%; flex: 1; display: flex; flex-direction: column; justify-content: center;">
        <div style="font-size: 54px; color: ${titleColor}; line-height: 1.25; margin-bottom: 40px; font-weight: 400; font-family: Georgia, 'Times New Roman', serif;">
          ${title}
        </div>
        <div style="font-size: 26px; color: ${bodyColor}; line-height: 1.6; font-family: Georgia, 'Times New Roman', serif; font-weight: 300;">
          ${excerpt}
        </div>
      </div>
      
      <div style="width: 100%; text-align: center;">
        <div style="width: 80px; height: 2px; background: ${borderColor}; margin: 0 auto 30px;"></div>
        <div style="font-size: 22px; color: ${brandColor}; letter-spacing: 0.15em; font-family: Arial, sans-serif; font-weight: 500; margin-bottom: 8px;">
          SHUNYAMARG
        </div>
        <div style="font-size: 15px; color: ${brandColor}; margin-bottom: 18px; font-family: Arial, sans-serif; font-weight: 300;">
          The Path of Dissolution
        </div>
        <div style="font-size: 16px; color: ${brandColor}; font-family: 'Courier New', monospace; font-weight: 500; letter-spacing: 0.02em;">
          ${shareUrl}
        </div>
      </div>
    `;

    document.body.appendChild(tempDiv);

    try {
      await new Promise(resolve => setTimeout(resolve, 200));

      const canvas = await html2canvas(tempDiv, {
        scale: 1,
        backgroundColor: '#FFF8E7',
        logging: false,
        width: 1080,
        height: 1080,
        useCORS: true,
        allowTaint: true
      });

      document.body.removeChild(tempDiv);

      const base64Png = canvas.toDataURL('image/png');
      setShareDataUrl(base64Png);

      if (previewRef.current) {
        previewRef.current.innerHTML = '';
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        canvas.style.boxShadow = '0 6px 18px rgba(0,0,0,0.15)';
        canvas.style.borderRadius = '4px';
        previewRef.current.appendChild(canvas);
      }
      
      setImageGenerated(true);
    } catch (err) {
      console.error('Error rendering sharing image:', err);
      if (document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!shareDataUrl) return;
    const cleanTitle = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const link = document.createElement('a');
    link.download = `shunyamarg-${cleanTitle}.png`;
    link.href = shareDataUrl;
    link.click();
    showFeedback('Downloaded!');
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?t=${currentTopic}&c=${currentIndex}&v=${voiceType}`;
    navigator.clipboard.writeText(url).then(() => {
      showFeedback('Link copied!');
    }).catch(() => {
      showFeedback('Copy failed');
    });
  };

  const handleWhatsAppShare = async () => {
    if (!shareDataUrl) return;
    const url = `${window.location.origin}/?t=${currentTopic}&c=${currentIndex}`;
    const text = `${title}\n\nRead on ShunyaMarg: ${url}`;

    if (navigator.share && navigator.canShare) {
      try {
        const response = await fetch(shareDataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'shunyamarg-card.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: title,
            text: 'Read on ShunyaMarg',
            url: url,
            files: [file]
          });
          showFeedback('Shared!');
          return;
        }
      } catch (err) {
        console.warn('Native sharing failed, using web fallback:', err);
      }
    }

    // Trigger local download and redirect to WhatsApp Web / App
    handleDownload();
    setTimeout(() => {
      const whatsappText = `${title}\n\nRead on ShunyaMarg:\n${url}\n\n(Image downloaded - attach it to your WhatsApp message)`;
      const waUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
      window.open(waUrl, '_blank');
      showFeedback('Image downloaded! Attach to WhatsApp');
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 p-4 bg-white dark:bg-zinc-950">
          <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
            Share Spiritual Quote
          </h3>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Canvas Preview Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-950 min-h-[300px]">
          {loading && (
            <div className="flex flex-col items-center gap-2 text-stone-500">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-stone-400 border-t-amber-600"></div>
              <span className="text-xs">Creating quote graphic...</span>
            </div>
          )}
          <div ref={previewRef} className={`w-full ${loading ? 'hidden' : 'block'}`}></div>
        </div>

        {/* Buttons / Actions */}
        <div className="border-t border-stone-200 dark:border-stone-800 p-4 bg-white dark:bg-zinc-950">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center justify-center p-2 rounded border border-stone-200 dark:border-zinc-800 hover:border-amber-600 dark:hover:border-amber-500 hover:bg-stone-100 dark:hover:bg-zinc-900 text-stone-700 dark:text-stone-300 gap-1 text-[11px] transition-all font-sans font-medium"
            >
              <Link size={16} />
              Copy Link
            </button>

            <button
              onClick={handleDownload}
              disabled={!imageGenerated}
              className="flex flex-col items-center justify-center p-2 rounded border border-stone-200 dark:border-zinc-800 hover:border-amber-600 dark:hover:border-amber-500 hover:bg-stone-100 dark:hover:bg-zinc-900 text-stone-700 dark:text-stone-300 gap-1 text-[11px] transition-all font-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              Download
            </button>

            <button
              onClick={handleWhatsAppShare}
              disabled={!imageGenerated}
              className="flex flex-col items-center justify-center p-2 rounded bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-400 text-white gap-1 text-[11px] transition-all font-sans font-medium"
            >
              <Share2 size={16} />
              WhatsApp
            </button>
          </div>
        </div>

        {/* Status Toast Alert */}
        {successMsg && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg animate-bounce z-[1000]">
            <Check size={14} />
            {successMsg}
          </div>
        )}
      </div>
    </div>
  );
}
