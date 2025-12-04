import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Download, Trash2, Copy, X } from 'lucide-react';
import toast from 'react-hot-toast';

const GenerationDetailModal = ({ generation, isOpen, onClose, onDelete }) => {
  if (!generation) return null;

  // Format date to Turkish
  const formatDate = (dateString) => {
    if (!dateString) return 'Tarih bilinmiyor';
    try {
      return new Date(dateString).toLocaleString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Tarih bilinmiyor';
    }
  };

  // Parse AI suggestions safely
  let aiSuggestions = null;
  if (generation.ai_suggestions) {
    try {
      aiSuggestions = typeof generation.ai_suggestions === 'string' 
        ? JSON.parse(generation.ai_suggestions)
        : generation.ai_suggestions;
    } catch (e) {
      console.error('Failed to parse AI suggestions:', e);
    }
  }

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} kopyalandı!`);
    }).catch(() => {
      toast.error('Kopyalama başarısız');
    });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generation.image_url;
    link.download = `coverlab-${generation.id}.jpg`;
    link.click();
    toast.success('İndirme başladı!');
  };

  const handleDelete = () => {
    if (window.confirm('Bu üretimi silmek istediğinizden emin misiniz?')) {
      onDelete(generation.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-slate-900 border-slate-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center justify-between" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Üretim Detayları
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4">
          {/* Left Column - Image (3/5 = 60%) */}
          <div className="md:col-span-3 space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={generation.image_url} 
                alt={generation.title || 'Generated thumbnail'} 
                className="w-full aspect-video object-cover"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleDownload}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                style={{ fontFamily: 'Geist Sans, sans-serif' }}
              >
                <Download size={16} className="mr-2" />
                İndir
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="bg-red-500 hover:bg-red-600"
                style={{ fontFamily: 'Geist Sans, sans-serif' }}
              >
                <Trash2 size={16} className="mr-2" />
                Sil
              </Button>
            </div>
          </div>

          {/* Right Column - Info (2/5 = 40%) */}
          <div className="md:col-span-2 space-y-6">
            {/* Video Description (User's Topic) */}
            <div>
              <label className="text-slate-400 text-sm font-medium mb-1 block" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                Video Konusu
              </label>
              <p className="text-white text-sm leading-relaxed" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                {generation.video_description || generation.user_description || 'Açıklama yok'}
              </p>
            </div>

            {/* Date */}
            <div>
              <label className="text-slate-400 text-sm font-medium mb-1 block" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                Oluşturulma Tarihi
              </label>
              <p className="text-white" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                {formatDate(generation.created_at)}
              </p>
            </div>

            {/* AI Suggestions */}
            {aiSuggestions && (
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6">
                <h3 className="text-cyan-300 font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  ✨ AI Tavsiyeleri
                </h3>

                {/* YouTube Title */}
                {(aiSuggestions.baslik || aiSuggestions.youtube_basligi) && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-slate-300 text-sm font-semibold flex items-center gap-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        <span className="text-lg">📺</span>
                        Önerilen Başlık
                      </label>
                      <button
                        onClick={() => copyToClipboard(aiSuggestions.baslik || aiSuggestions.youtube_basligi, 'Başlık')}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors p-1.5 hover:bg-cyan-500/10 rounded"
                        title="Kopyala"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <p className="text-white text-sm leading-relaxed" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        {aiSuggestions.baslik || aiSuggestions.youtube_basligi}
                      </p>
                    </div>
                  </div>
                )}

                {/* Description */}
                {aiSuggestions.aciklama && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-slate-300 text-sm font-semibold flex items-center gap-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        <span className="text-lg">📝</span>
                        Açıklama
                      </label>
                      <button
                        onClick={() => copyToClipboard(aiSuggestions.aciklama, 'Açıklama')}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors p-1.5 hover:bg-cyan-500/10 rounded"
                        title="Kopyala"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                      <p className="text-white text-sm leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        {aiSuggestions.aciklama}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerationDetailModal;
