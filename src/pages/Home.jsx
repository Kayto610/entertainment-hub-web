import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ContentCard from '../components/ContentCard';
import api from '../api/axios';

const categories = ['All', 'Movie', 'TV Series', 'Music'];

const Home = () => {
  const [contents, setContents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContents();
  }, [selectedCategory]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const url =
        selectedCategory === 'All'
          ? '/contents'
          : `/contents?category=${encodeURIComponent(selectedCategory)}`;
      const res = await api.get(url);
      setContents(res.data);
    } catch (err) {
      console.error('Gagal mengambil data katalog:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter pencarian lokal berdasarkan input search bar di Navbar
  const filteredContents = contents.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b111e] text-slate-100 flex flex-col">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} showSearch={true} />

      <main className="max-w-7xl mx-auto w-full px-8 py-8 flex-1">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition ${
                selectedCategory === cat
                  ? 'bg-[#5d5fef] text-white'
                  : 'bg-[#172033] border border-[#1e293b] text-slate-300 hover:border-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white tracking-wide">Catalog</h1>
          <span className="text-xs text-slate-400">
            {filteredContents.length} titles
          </span>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24 text-slate-400">
            Memuat katalog konten...
          </div>
        ) : filteredContents.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            Tidak ada konten yang ditemukan.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredContents.map((item) => (
              <ContentCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;