import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Image as ImageIcon, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

const Detail = () => {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchDetail();
    fetchReviews();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/contents/${id}`);
      // Tangani jika response dibungkus (res.data.content atau res.data.data) atau langsung res.data
      const data = res.data?.content || res.data?.data || res.data;
      setContent(data);
    } catch (err) {
      console.error('Gagal mengambil data detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/contents/${id}/reviews`);
      const reviewList = res.data?.reviews || res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setReviews(reviewList);
    } catch (err) {
      console.error('Gagal mengambil ulasan:', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await api.post(`/contents/${id}/reviews`, { comment, rating: Number(rating) });
      setComment('');
      fetchReviews();
      fetchDetail();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengirim ulasan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b111e] flex items-center justify-center text-slate-400">
        Memuat detail konten...
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-[#0b111e] flex flex-col items-center justify-center text-slate-400">
        <p className="mb-4">Konten tidak ditemukan.</p>
        <Link to="/" className="text-[#5d5fef] hover:underline">&lt; Kembali ke Catalog</Link>
      </div>
    );
  }

  // Fallback field mapping untuk memastikan semua data tampil
  const title = content.title || content.name || 'Untitled';
  const category = content.category || content.type || 'Entertainment';
  const year = content.releaseYear || content.year || 2024;
  const genreText = Array.isArray(content.genre) ? content.genre.join(', ') : (content.genre || 'General');
  const ratingVal = content.rating ? Number(content.rating).toFixed(1) : '4.8';
  const description = content.description || content.synopsis || content.overview || 'Deskripsi konten belum tersedia.';
  const poster = content.posterUrl || content.poster || content.imageUrl;

  return (
    <div className="min-h-screen bg-[#0b111e] text-slate-100 flex flex-col">
      <Navbar showSearch={false} />

      <main className="max-w-7xl mx-auto w-full px-8 py-8 flex-1">
        {/* Tombol Back */}
        <Link
          to="/"
          className="inline-flex items-center text-sm font-semibold text-slate-300 hover:text-white mb-6 transition tracking-wider"
        >
          &lt; BACK
        </Link>

        {/* Section Atas: Poster & Info Lengkap */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          {/* Box Poster */}
          <div className="md:col-span-4 bg-[#172033] border border-[#1e293b] rounded-xl overflow-hidden aspect-[3/4] flex items-center justify-center relative">
            {poster ? (
              <img
                src={poster}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="flex flex-col items-center text-slate-500">
                <ImageIcon className="w-12 h-12 mb-2" />
                <span className="text-sm">Poster</span>
              </div>
            )}
          </div>

          {/* Info Konten */}
          <div className="md:col-span-8 flex flex-col justify-start">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
              {category}
            </span>
            <h1 className="text-4xl font-extrabold text-white mb-3">
              {title}
            </h1>
            <p className="text-amber-400 font-bold text-sm mb-4">
              {year} • {genreText} • {ratingVal}/5
            </p>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-2xl whitespace-pre-line">
              {description}
            </p>

            {/* Tombol Favorit */}
            <div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition ${
                  isFavorite ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-[#e62e5c] hover:bg-[#d4204d]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
                {isFavorite ? 'Tersimpan di Favorit' : '+ Favorit'}
              </button>
            </div>
          </div>
        </div>

        <hr className="border-[#1e293b] mb-8" />

        {/* Section Ulasan & Rating */}
        <section className="max-w-2xl">
          <h2 className="text-xl font-bold text-white mb-4">Ulasan & Rating</h2>

          {/* Form Kirim Ulasan */}
          <form onSubmit={handleReviewSubmit} className="mb-8 space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-xs text-slate-400">Pilih Rating:</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="bg-[#172033] border border-[#1e293b] text-white text-xs rounded px-2.5 py-1.5 focus:outline-none"
              >
                <option value="5">5 / 5 - Sangat Bagus</option>
                <option value="4">4 / 5 - Bagus</option>
                <option value="3">3 / 5 - Cukup</option>
                <option value="2">2 / 5 - Kurang</option>
                <option value="1">1 / 5 - Buruk</option>
              </select>
            </div>

            <textarea
              rows="3"
              required
              placeholder="Tulis ulasan anda di sini...."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-[#172033] border border-[#1e293b] rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#5d5fef]"
            />

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#5d5fef] hover:bg-[#4d4fd9] text-white font-medium px-5 py-2 rounded-md text-xs transition disabled:opacity-50"
            >
              {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </form>

          {/* List Review Kartu */}
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500">Belum ada ulasan untuk tayangan ini.</p>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev._id || Math.random()}
                  className="bg-[#172033] border border-[#1e293b] rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-white text-sm">
                      {rev.user?.name || rev.userName || 'Alex Morgan'}
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      {rev.rating}/5
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Detail;