'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RefreshCcw } from 'lucide-react';

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    pending: 0
  });
  const [topicStats, setTopicStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      // 1. Get cards counts
      const { data: cards, error: cardsError } = await supabase
        .from('cards')
        .select('status, topic_slug');

      if (cardsError) throw cardsError;

      // 2. Get pending submissions
      const { count: pendingCount, error: subError } = await supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (subError) throw subError;

      const published = cards.filter(c => c.status === 'published').length;
      const drafts = cards.filter(c => c.status === 'draft').length;

      setStats({
        total: cards.length,
        published,
        drafts,
        pending: pendingCount || 0
      });

      // Calculate topic breakdown
      const topicCounts = {};
      cards.forEach(c => {
        topicCounts[c.topic_slug] = (topicCounts[c.topic_slug] || 0) + 1;
      });

      // Map slugs to display names
      const topicLabels = {
        tattvabodh: "TattvaBodh",
        upanishads: "Upanishads",
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

      const sortedTopics = Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([slug, count]) => ({
          slug,
          name: topicLabels[slug] || slug,
          count,
          percentage: cards.length > 0 ? (count / cards.length) * 100 : 0
        }));

      setTopicStats(sortedTopics);

    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[rgba(28,27,24,0.1)]">
        <h1 className="font-serif text-3xl font-light text-[#1c1b18]">Dashboard</h1>
        <button 
          onClick={loadStats}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-[rgba(28,27,24,0.18)] rounded-sm bg-white text-[12px] uppercase tracking-widest text-[#5a5650] hover:bg-[#f4f2ed] transition-colors disabled:opacity-50"
        >
          <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Cards" value={stats.total} loading={loading} />
        <StatCard label="Published" value={stats.published} loading={loading} />
        <StatCard label="Drafts" value={stats.drafts} loading={loading} />
        <StatCard 
          label="Pending Reviews" 
          value={stats.pending} 
          sub="from community" 
          loading={loading} 
        />
      </div>

      <div className="bg-white border border-[rgba(28,27,24,0.1)] rounded-sm p-6 mt-6 shadow-sm">
        <h3 className="font-serif text-xl font-light mb-6 text-[#1c1b18]">Cards by topic</h3>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-6 bg-stone-100 rounded"></div>
            ))}
          </div>
        ) : topicStats.length === 0 ? (
          <p className="text-stone-500 text-sm italic">No cards available.</p>
        ) : (
          <div className="space-y-4">
            {topicStats.map(topic => (
              <div key={topic.slug} className="flex items-center gap-4">
                <div className="text-xs text-[#5a5650] w-[180px] shrink-0 truncate">
                  {topic.name}
                </div>
                <div className="flex-1 h-1.5 bg-[#e2ddd5] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#b8935a] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${topic.percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-[#8c877f] w-8 text-right font-medium">
                  {topic.count}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, loading }) {
  return (
    <div className="bg-white border border-[rgba(28,27,24,0.1)] rounded-sm p-5 shadow-sm">
      <div className="text-[10px] tracking-widest uppercase text-[#8c877f] mb-1.5">
        {label}
      </div>
      <div className="font-serif text-4xl font-light text-[#1c1b18] leading-none">
        {loading ? <span className="opacity-0">0</span> : value}
      </div>
      {sub && (
        <div className="text-[11px] text-[#8c877f] mt-1.5">
          {sub}
        </div>
      )}
    </div>
  );
}
