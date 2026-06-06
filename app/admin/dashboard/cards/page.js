'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RefreshCcw, Trash2, Edit2, Loader2, Search } from 'lucide-react';

export default function AdminCardsList() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadCards = async () => {
    setLoading(true);
    try {
      let query = supabase.from('cards').select('*').order('created_at', { ascending: false });
      
      if (topicFilter) query = query.eq('topic_slug', topicFilter);
      if (statusFilter) query = query.eq('status', statusFilter);
      
      const { data, error } = await query;
      if (error) throw error;
      setCards(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, [topicFilter, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    try {
      const { error } = await supabase.from('cards').delete().eq('id', id);
      if (error) throw error;
      setCards(cards.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete card.');
    }
  };

  const filteredCards = cards.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    (c.tag && c.tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[rgba(28,27,24,0.1)]">
        <h1 className="font-serif text-3xl font-light text-[#1c1b18]">Knowledge Cards</h1>
        <button 
          onClick={loadCards}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-[rgba(28,27,24,0.18)] rounded-sm bg-white text-[12px] uppercase tracking-widest text-[#5a5650] hover:bg-[#f4f2ed] transition-colors disabled:opacity-50"
        >
          <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input 
            type="text" 
            placeholder="Search by title or tag..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[rgba(28,27,24,0.18)] rounded-sm bg-white text-sm outline-none focus:border-[#b8935a]"
          />
        </div>
        <select 
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="px-4 py-2.5 border border-[rgba(28,27,24,0.18)] rounded-sm bg-white text-sm outline-none focus:border-[#b8935a] md:w-48"
        >
          <option value="">All Topics</option>
          <option value="tattvabodh">TattvaBodh</option>
          <option value="upanishads">Upanishads</option>
          <option value="advait">Advait Vedanta</option>
        </select>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-[rgba(28,27,24,0.18)] rounded-sm bg-white text-sm outline-none focus:border-[#b8935a] md:w-48"
        >
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="bg-white border border-[rgba(28,27,24,0.1)] rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#f4f2ed] text-[10px] tracking-widest uppercase text-[#8c877f]">
              <tr>
                <th className="px-6 py-4 font-normal">Title</th>
                <th className="px-6 py-4 font-normal">Topic</th>
                <th className="px-6 py-4 font-normal">Tag</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(28,27,24,0.1)]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-stone-500">
                    <Loader2 className="animate-spin w-6 h-6 mx-auto mb-2 text-[#b8935a]" />
                    <span className="text-xs uppercase tracking-widest">Loading cards...</span>
                  </td>
                </tr>
              ) : filteredCards.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-stone-500 italic font-serif">
                    No cards found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCards.map(card => (
                  <tr key={card.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-serif text-[15px] text-[#1c1b18]">{card.title}</td>
                    <td className="px-6 py-4 text-xs text-stone-600 uppercase tracking-wider">{card.topic_slug}</td>
                    <td className="px-6 py-4 text-xs text-stone-600">{card.tag}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                        card.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {card.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button className="p-2 text-stone-400 hover:text-[#1c1b18] transition-colors" title="Edit Card (Coming Soon)">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(card.id)}
                        className="p-2 text-stone-400 hover:text-red-600 transition-colors" 
                        title="Delete Card"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
