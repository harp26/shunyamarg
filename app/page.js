import { Suspense } from 'react';
import CardDeck from '@/components/CardDeck';

export const metadata = {
  title: 'ShunyaMarg · Wisdom Cards',
  description: 'Explore Upanishads, TattvaBodh, Advaita Vedanta, and more through beautifully curated knowledge cards.',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f5f3ee]">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-stone-300 border-t-[#b8935a]"></div>
            <span className="font-serif text-stone-500 text-sm">Loading ShunyaMarg...</span>
          </div>
        </div>
      }>
        <CardDeck />
      </Suspense>
    </main>
  );
}
