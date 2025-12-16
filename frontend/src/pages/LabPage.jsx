import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Eye, Download, Trash2, CheckSquare, Square, Loader2, Wand2, Video, Clock, Play, ExternalLink, Zap, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AnalysisDetailModal from '../components/modals/AnalysisDetailModal';
import GenerationDetailModal from '../components/modals/GenerationDetailModal';
import AccessGuard from '../components/AccessGuard';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

// MOCK DATA
const mockGenerations = [
  { id: 1, thumbnail: 'https://picsum.photos/seed/gen1/400/225', title: 'İstanbul Vlog Kapağı', date: '2 saat önce' },
  { id: 2, thumbnail: 'https://picsum.photos/seed/gen2/400/225', title: 'Tech Review 2024', date: '5 saat önce' },
  { id: 3, thumbnail: 'https://picsum.photos/seed/gen3/400/225', title: 'Gaming Montaj', date: '1 gün önce' },
  { id: 4, thumbnail: 'https://picsum.photos/seed/gen4/400/225', title: 'Yemek Tarifi', date: '2 gün önce' },
  { id: 5, thumbnail: 'https://picsum.photos/seed/gen5/400/225', title: 'Vlog #42', date: '3 gün önce' },
  { id: 6, thumbnail: 'https://picsum.photos/seed/gen6/400/225', title: 'Challenge Video', date: '1 hafta önce' },
];

const mockAnalyses = [
  {
    id: 1,
    thumbnail: 'https://picsum.photos/seed/ana1/400/225',
    title: 'MrBeast Analizi',
    date: '1 saat önce',
    score: 92,
    rating: 'Mükemmel',
    faces_data: [
      { label: 'Mutluluk', value: 95 },
      { label: 'Şaşkınlık', value: 78 },
      { label: 'Öfke', value: 5 }
    ],
    vibe_data: [
      { label: 'Merak', value: 5 },
      { label: 'Kışkırtıcılık', value: 4 },
      { label: 'Gizem', value: 3 }
    ],
    objects_data: [
      { label: 'İnsan', value: 99 },
      { label: 'Yat', value: 95 },
      { label: 'Deniz', value: 88 }
    ],
    heatmap_data: [
      { x: 30, y: 40, color: 'red' },
      { x: 70, y: 50, color: 'yellow' }
    ]
  },
  {
    id: 2,
    thumbnail: 'https://picsum.photos/seed/ana2/400/225',
    title: 'Gaming Setup',
    date: '3 saat önce',
    score: 85,
    rating: 'Çok İyi',
    faces_data: [
      { label: 'Mutluluk', value: 80 },
      { label: 'Şaşkınlık', value: 40 },
      { label: 'Öfke', value: 10 }
    ],
    vibe_data: [
      { label: 'Merak', value: 4 },
      { label: 'Kışkırtıcılık', value: 3 },
      { label: 'Gizem', value: 2 }
    ],
    objects_data: [
      { label: 'İnsan', value: 95 },
      { label: 'Bilgisayar', value: 92 },
      { label: 'Oda', value: 85 }
    ],
    heatmap_data: [
      { x: 40, y: 35, color: 'red' },
      { x: 60, y: 55, color: 'yellow' }
    ]
  },
];

// VideoCard Component - separate component to use hooks properly
const VideoCard = ({ video, formatDate, navigate }) => {
  const [showScenario, setShowScenario] = useState(false);

  const isProcessing = video.status === 'pending' || video.status === 'processing';
  const isCompleted = video.status === 'completed';
  const isFailed = video.status === 'failed';

  return (
    <Card
      className={`bg-slate-900 border-slate-700 overflow-hidden group hover:border-purple-500/50 transition-all ${isProcessing ? 'ring-2 ring-purple-500/30 animate-pulse' : ''
        }`}
    >
      {/* Video Preview / Placeholder */}
      <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 overflow-hidden">
        {/* Video Thumbnail - using video element for completed videos */}
        {isCompleted && video.video_url && (
          <video
            src={video.video_url}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            preload="metadata"
            onLoadedMetadata={(e) => {
              e.target.currentTime = 1;
            }}
          />
        )}

        {isCompleted && video.video_url ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
            <a
              href={video.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-4 rounded-full transition-all hover:scale-110"
            >
              <Play size={32} fill="white" />
            </a>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {isProcessing ? (
              <div className="text-center">
                <Loader2 size={40} className="text-purple-400 animate-spin mx-auto mb-2" />
                <p className="text-purple-300 text-sm">
                  {video.status === 'pending' ? 'Sıraya alındı...' : 'İşleniyor...'}
                </p>
              </div>
            ) : isFailed ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-3xl">❌</span>
                </div>
                <p className="text-red-400 text-sm">Başarısız</p>
              </div>
            ) : (
              <Video size={40} className="text-slate-600" />
            )}
          </div>
        )}

        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${isProcessing ? 'bg-purple-500 text-white' :
          isCompleted ? 'bg-green-500 text-white' :
            isFailed ? 'bg-red-500 text-white' :
              'bg-slate-600 text-white'
          }`}>
          {isProcessing && <Loader2 size={12} className="animate-spin" />}
          {video.status === 'pending' && 'Sırada'}
          {video.status === 'processing' && 'İşleniyor'}
          {video.status === 'completed' && '✓ Tamamlandı'}
          {video.status === 'failed' && 'Başarısız'}
        </div>

        {/* Credits Badge */}
        {video.credits_spent && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold bg-blue-500/80 text-white flex items-center gap-1">
            <Zap size={12} />
            {video.credits_spent} kredi
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold mb-2 line-clamp-2" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
          {video.prompt || 'Video'}
        </h3>

        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock size={14} />
            <span>{video.duration} sn</span>
            {video.has_narrator && (
              <span className="text-purple-400">• 🎙️ {video.language?.toUpperCase()}</span>
            )}
          </div>
          <span className="text-slate-500 text-xs">
            {formatDate(video.created_at)}
          </span>
        </div>

        {/* AI Scenario Section */}
        {video.ai_scenario && (
          <div className="mb-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowScenario(!showScenario);
              }}
              className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors w-full"
            >
              <FileText size={14} />
              <span>AI Senaryo</span>
              {showScenario ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showScenario && (
              <div className="mt-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 max-h-32 overflow-y-auto">
                <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
                  {video.ai_scenario}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons for completed videos */}
        {isCompleted && video.video_url && (
          <div className="flex gap-2">
            <a
              href={video.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-center py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink size={14} />
              İzle
            </a>
            <a
              href={video.video_url}
              download
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-center py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <Download size={14} />
              İndir
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};

const LabPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'generations';

  // State Management
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Selection states for deletion
  const [isSelectModeGen, setIsSelectModeGen] = useState(false);
  const [isSelectModeAna, setIsSelectModeAna] = useState(false);
  const [selectedGens, setSelectedGens] = useState([]);
  const [selectedAnas, setSelectedAnas] = useState([]);

  // Data states - REAL DATA
  const [generations, setGenerations] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoadingGens, setIsLoadingGens] = useState(true);
  const [isLoadingAnas, setIsLoadingAnas] = useState(true);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    if (user?.id) {
      fetchGenerations();
      fetchAnalyses();
      fetchVideos();
    }
  }, [user]);

  // Poll for video status updates
  const fetchVideos = useCallback(async () => {
    if (!user?.id) return;
    try {
      setIsLoadingVideos(true);
      const { data, error } = await supabase
        .from('ai_videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoadingVideos(false);
    }
  }, [user?.id]);

  // Auto-refresh videos if there are pending/processing ones
  useEffect(() => {
    const hasPendingVideos = videos.some(v => v.status === 'pending' || v.status === 'processing');
    if (!hasPendingVideos) return;

    const intervalId = setInterval(fetchVideos, 5000); // Every 5 seconds
    return () => clearInterval(intervalId);
  }, [videos, fetchVideos]);

  const fetchGenerations = async () => {
    try {
      setIsLoadingGens(true);
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGenerations(data || []);
    } catch (error) {
      console.error('Error fetching generations:', error);
      toast.error('Üretimler yüklenemedi');
    } finally {
      setIsLoadingGens(false);
    }
  };

  const fetchAnalyses = async () => {
    try {
      setIsLoadingAnas(true);
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error('Error fetching analyses:', error);
      toast.error('Analizler yüklenemedi');
    } finally {
      setIsLoadingAnas(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Tarih bilinmiyor';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    return `${Math.floor(diffDays / 7)} hafta önce`;
  };

  // Handlers for Generations
  const toggleSelectModeGen = () => {
    setIsSelectModeGen(!isSelectModeGen);
    setSelectedGens([]);
  };

  const toggleGenSelection = (id) => {
    setSelectedGens(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const deleteSelectedGens = async () => {
    try {
      const { error } = await supabase
        .from('generations')
        .delete()
        .in('id', selectedGens);

      if (error) throw error;
      setGenerations(prev => prev.filter(g => !selectedGens.includes(g.id)));
      setSelectedGens([]);
      setIsSelectModeGen(false);
      toast.success(`${selectedGens.length} üretim silindi`);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Silme işlemi başarısız');
    }
  };

  const deleteSingleGen = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const { error } = await supabase
        .from('generations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setGenerations(prev => prev.filter(g => g.id !== id));
      toast.success('Silindi');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Silinemedi');
    }
  };

  // Handlers for Analyses
  const toggleSelectModeAna = () => {
    setIsSelectModeAna(!isSelectModeAna);
    setSelectedAnas([]);
  };

  const toggleAnaSelection = (id) => {
    setSelectedAnas(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const deleteSelectedAnas = () => {
    setAnalyses(prev => prev.filter(a => !selectedAnas.includes(a.id)));
    setSelectedAnas([]);
    setIsSelectModeAna(false);
  };

  const deleteSingleAna = (id, e) => {
    e.stopPropagation();
    setAnalyses(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AccessGuard requirePro={false}>
      <div className="min-h-screen bg-[#0a0a0a] pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-3"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Laboratuvarım
            </h1>
            <p
              className="text-slate-400 text-lg"
              style={{ fontFamily: 'Geist Sans, sans-serif' }}
            >
              Tüm çalışmalarınız burada saklanır • <span className="text-orange-400">Son 30 günü geçen işlemler otomatik silinir</span>
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue={initialTab} className="w-full">
            <TabsList className="bg-slate-900 mb-8" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
              <TabsTrigger value="generations" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Ürettiklerim ({generations.length})
              </TabsTrigger>
              <TabsTrigger value="analyses" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Analizlerim ({analyses.length})
              </TabsTrigger>
              <TabsTrigger value="videos" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                <Video size={16} className="mr-2" />
                Videolarım ({videos.length})
              </TabsTrigger>
            </TabsList>

            {/* Generations Tab */}
            <TabsContent value="generations">
              {/* Loading State */}
              {isLoadingGens ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                  <p className="text-slate-400" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    Üretimler yükleniyor...
                  </p>
                </div>
              ) : generations.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                    <Wand2 size={40} className="text-slate-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Henüz bir şey üretmediniz
                  </h3>
                  <p className="text-slate-400 mb-6" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    İlk thumbnail'inizi oluşturmak için Create sayfasına gidin
                  </p>
                  <Button
                    onClick={() => navigate('/create')}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold"
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  >
                    <Wand2 className="mr-2" size={20} />
                    Thumbnail Oluştur
                  </Button>
                </div>
              ) : (
                <>
                  {/* Selection Toolbar */}
                  <div className="flex justify-between items-center mb-6">
                    <Button
                      variant={isSelectModeGen ? "default" : "outline"}
                      onClick={toggleSelectModeGen}
                      className={isSelectModeGen ? "bg-blue-500 hover:bg-blue-600 text-white" : "border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"}
                      style={{ fontFamily: 'Geist Sans, sans-serif' }}
                    >
                      {isSelectModeGen ? <CheckSquare size={16} className="mr-2" /> : <Square size={16} className="mr-2" />}
                      {isSelectModeGen ? 'Seçimi İptal Et' : 'Seç'}
                    </Button>

                    {isSelectModeGen && selectedGens.length > 0 && (
                      <span className="text-slate-400 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        {selectedGens.length} öğe seçildi
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generations.map((gen) => (
                      <Card
                        key={gen.id}
                        className={`bg-slate-900 border-slate-700 overflow-hidden cursor-pointer group hover:border-blue-500 transition-all relative ${selectedGens.includes(gen.id) ? 'ring-2 ring-blue-500' : ''
                          }`}
                        onClick={() => isSelectModeGen ? toggleGenSelection(gen.id) : setSelectedGeneration(gen)}
                      >
                        {/* Selection Checkbox Overlay */}
                        {isSelectModeGen && (
                          <div className="absolute top-3 left-3 z-10">
                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${selectedGens.includes(gen.id)
                              ? 'bg-blue-500 border-blue-500'
                              : 'bg-slate-800/70 border-slate-500'
                              }`}>
                              {selectedGens.includes(gen.id) && (
                                <CheckSquare size={16} className="text-white" />
                              )}
                            </div>
                          </div>
                        )}

                        <div className="relative">
                          <img src={gen.image_url} alt={gen.title || 'Thumbnail'} className="w-full aspect-video object-cover" />

                          {/* Hover Actions (Only when NOT in select mode) */}
                          {!isSelectModeGen && (
                            <>
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-transform hover:scale-110">
                                  <Eye size={20} />
                                </button>
                                <button className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full transition-transform hover:scale-110">
                                  <Download size={20} />
                                </button>
                              </div>
                              {/* Delete Icon on Hover (Top Right) */}
                              <button
                                onClick={(e) => deleteSingleGen(gen.id, e)}
                                className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-white font-semibold mb-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                            {gen.title || 'Thumbnail'}
                          </h3>
                          <p className="text-slate-500 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                            {formatDate(gen.created_at)}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {/* Empty State */}
              {generations.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-slate-500 text-lg" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    Henüz bir üretim yok
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Analyses Tab */}
            <TabsContent value="analyses">
              {/* Selection Toolbar */}
              <div className="flex justify-between items-center mb-6">
                <Button
                  variant={isSelectModeAna ? "default" : "outline"}
                  onClick={toggleSelectModeAna}
                  className={isSelectModeAna ? "bg-blue-500 hover:bg-blue-600 text-white" : "border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"}
                  style={{ fontFamily: 'Geist Sans, sans-serif' }}
                >
                  {isSelectModeAna ? <CheckSquare size={16} className="mr-2" /> : <Square size={16} className="mr-2" />}
                  {isSelectModeAna ? 'Seçimi İptal Et' : 'Seç'}
                </Button>

                {isSelectModeAna && selectedAnas.length > 0 && (
                  <span className="text-slate-400 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    {selectedAnas.length} öğe seçildi
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analyses.map((analysis) => {
                  // Use direct column values from Supabase
                  const score = analysis.ai_score || 0;
                  const label = score >= 90 ? 'Mükemmel' : score >= 70 ? 'Çok İyi' : score >= 50 ? 'İyi' : 'Geliştirilmeli';
                  const imageUrl = analysis.input_image_url || 'https://via.placeholder.com/400x225';
                  const title = analysis.input_title || 'Untitled';

                  console.log('Analysis card FULL:', analysis);
                  console.log('JSONB fields:', {
                    faces_data: analysis.faces_data,
                    vibe_data: analysis.vibe_data,
                    objects_data: analysis.objects_data,
                    heatmap_data: analysis.heatmap_data,
                    score_breakdown: analysis.score_breakdown
                  });

                  return (
                    <Card
                      key={analysis.id}
                      className={`bg-slate-900 border-slate-700 overflow-hidden cursor-pointer group hover:border-blue-500 transition-all relative ${selectedAnas.includes(analysis.id) ? 'ring-2 ring-blue-500' : ''
                        }`}
                      onClick={() => isSelectModeAna ? toggleAnaSelection(analysis.id) : setSelectedAnalysis(analysis)}
                    >
                      {/* Selection Checkbox Overlay */}
                      {isSelectModeAna && (
                        <div className="absolute top-3 left-3 z-10">
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${selectedAnas.includes(analysis.id)
                            ? 'bg-blue-500 border-blue-500'
                            : 'bg-slate-800/70 border-slate-500'
                            }`}>
                            {selectedAnas.includes(analysis.id) && (
                              <CheckSquare size={16} className="text-white" />
                            )}
                          </div>
                        </div>
                      )}

                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-full aspect-video object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {score}
                        </div>

                        {/* Hover Actions (Only when NOT in select mode) */}
                        {!isSelectModeAna && (
                          <>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105">
                                Detayları Gör
                              </button>
                            </div>
                            {/* Delete Icon on Hover (Top Left, avoiding score badge) */}
                            <button
                              onClick={(e) => deleteSingleAna(analysis.id, e)}
                              className="absolute top-2 left-2 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-semibold mb-1 truncate" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                          {title}
                        </h3>
                        <p className="text-slate-500 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                          {formatDate(analysis.created_at)} • {label}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Empty State */}
              {analyses.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-slate-500 text-lg" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    Henüz bir analiz yok
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos">
              {isLoadingVideos ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
                  <p className="text-slate-400" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    Videolar yükleniyor...
                  </p>
                </div>
              ) : videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6">
                    <Video size={40} className="text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Henüz video oluşturmadınız
                  </h3>
                  <p className="text-slate-400 mb-6" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    AI Video sayfasından ilk videonuzu oluşturun
                  </p>
                  <Button
                    onClick={() => navigate('/ai-video')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-6 text-lg font-semibold"
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  >
                    <Video className="mr-2" size={20} />
                    AI Video Oluştur
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      formatDate={formatDate}
                      navigate={navigate}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Lightbox for Generations */}
          {lightboxImage && (
            <div
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setLightboxImage(null)}
            >
              <img src={lightboxImage} alt="Preview" className="max-w-full max-h-full rounded-lg" />
            </div>
          )}

          {/* Generation Detail Modal */}
          {selectedGeneration && (
            <GenerationDetailModal
              generation={selectedGeneration}
              isOpen={!!selectedGeneration}
              onClose={() => setSelectedGeneration(null)}
              onDelete={deleteSingleGen}
            />
          )}

          {/* Analysis Detail Modal */}
          {selectedAnalysis && (
            <AnalysisDetailModal
              analysis={selectedAnalysis}
              isOpen={!!selectedAnalysis}
              onClose={() => setSelectedAnalysis(null)}
            />
          )}

          {/* Floating Delete Button - Generations */}
          {isSelectModeGen && selectedGens.length > 0 && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 animate-in slide-in-from-bottom-5">
              <Button
                onClick={deleteSelectedGens}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 rounded-full shadow-2xl shadow-red-500/50 text-lg font-bold transition-all hover:scale-105"
                style={{ fontFamily: 'Geist Sans, sans-serif' }}
              >
                <Trash2 size={20} className="mr-2" />
                Seçilenleri Sil ({selectedGens.length})
              </Button>
            </div>
          )}

          {/* Floating Delete Button - Analyses */}
          {isSelectModeAna && selectedAnas.length > 0 && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 animate-in slide-in-from-bottom-5">
              <Button
                onClick={deleteSelectedAnas}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 rounded-full shadow-2xl shadow-red-500/50 text-lg font-bold transition-all hover:scale-105"
                style={{ fontFamily: 'Geist Sans, sans-serif' }}
              >
                <Trash2 size={20} className="mr-2" />
                Seçilenleri Sil ({selectedAnas.length})
              </Button>
            </div>
          )}
        </div>
      </div>
    </AccessGuard>
  );
};

export default LabPage;
