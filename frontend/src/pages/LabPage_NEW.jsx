import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Eye, Download, Trash2, CheckSquare, Square, Wand2, Loader2 } from 'lucide-react';
import AnalysisDetailModal from '../components/modals/AnalysisDetailModal';
import AccessGuard from '../components/AccessGuard';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

const LabPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  
  // Selection states for deletion
  const [isSelectModeGen, setIsSelectModeGen] = useState(false);
  const [isSelectModeAna, setIsSelectModeAna] = useState(false);
  const [selectedGens, setSelectedGens] = useState([]);
  const [selectedAnas, setSelectedAnas] = useState([]);
  
  // Data states - REAL DATA from Supabase
  const [generations, setGenerations] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [isLoadingGens, setIsLoadingGens] = useState(true);
  const [isLoadingAnas, setIsLoadingAnas] = useState(true);

  // Fetch Real Data on Mount
  useEffect(() => {
    if (user?.id) {
      fetchGenerations();
      fetchAnalyses();
    }
  }, [user]);

  // Fetch Generations from Supabase
  const fetchGenerations = async () => {
    try {
      setIsLoadingGens(true);
      console.log('📥 Fetching generations for user:', user?.id);

      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('✅ Generations fetched:', data?.length);
      setGenerations(data || []);
    } catch (error) {
      console.error('❌ Error fetching generations:', error);
      toast.error('Üretimler yüklenemedi');
    } finally {
      setIsLoadingGens(false);
    }
  };

  // Fetch Analyses from Supabase
  const fetchAnalyses = async () => {
    try {
      setIsLoadingAnas(true);
      console.log('📥 Fetching analyses for user:', user?.id);

      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('✅ Analyses fetched:', data?.length);
      setAnalyses(data || []);
    } catch (error) {
      console.error('❌ Error fetching analyses:', error);
      toast.error('Analizler yüklenemedi');
    } finally {
      setIsLoadingAnas(false);
    }
  };

  // Format date helper
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
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
    return `${Math.floor(diffDays / 30)} ay önce`;
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
    e.stopPropagation();
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
  
  const deleteSelectedAnas = async () => {
    try {
      const { error } = await supabase
        .from('analyses')
        .delete()
        .in('id', selectedAnas);

      if (error) throw error;

      setAnalyses(prev => prev.filter(a => !selectedAnas.includes(a.id)));
      setSelectedAnas([]);
      setIsSelectModeAna(false);
      toast.success(`${selectedAnas.length} analiz silindi`);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Silme işlemi başarısız');
    }
  };
  
  const deleteSingleAna = async (id, e) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('analyses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAnalyses(prev => prev.filter(a => a.id !== id));
      toast.success('Silindi');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Silinemedi');
    }
  };

  return (
    <AccessGuard requirePro={false}>
      <div className="min-h-screen relative overflow-hidden bg-slate-950">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://customer-assets.emergentagent.com/job_326e649c-429d-481a-8bf3-c99e4276d28c/artifacts/bhrosu5k_8nNOHsP6PbEJMwWSth7Jb.png")',
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 pt-24 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <div className="text-center mb-12">
              <h1 
                className="text-4xl md:text-5xl font-bold text-white mb-3"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                Laboratuvarım
              </h1>
              <p 
                className="text-slate-300 text-lg"
                style={{ fontFamily: 'Geist Sans, sans-serif' }}
              >
                Tüm üretim ve analizleriniz burada
              </p>
            </div>

          {/* Tabs */}
          <Tabs defaultValue="generations" className="w-full">
            <TabsList className="bg-slate-900 mb-8" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
              <TabsTrigger value="generations" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Ürettiklerim ({generations.length})
              </TabsTrigger>
              <TabsTrigger value="analyses" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Analizlerim ({analyses.length})
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
                        className={`bg-slate-900 border-slate-700 overflow-hidden cursor-pointer group hover:border-blue-500 transition-all relative ${
                          selectedGens.includes(gen.id) ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => isSelectModeGen ? toggleGenSelection(gen.id) : setLightboxImage(gen.image_url)}
                      >
                        {/* Selection Checkbox */}
                        {isSelectModeGen && (
                          <div className="absolute top-3 left-3 z-10">
                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                              selectedGens.includes(gen.id) 
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
                          <img src={gen.image_url} alt={gen.title || 'Generated thumbnail'} className="w-full aspect-video object-cover" />
                          
                          {/* Hover Actions */}
                          {!isSelectModeGen && (
                            <>
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-transform hover:scale-110">
                                  <Eye size={20} />
                                </button>
                                <a href={gen.image_url} download className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full transition-transform hover:scale-110">
                                  <Download size={20} />
                                </a>
                              </div>
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
            </TabsContent>

            {/* Analyses Tab */}
            <TabsContent value="analyses">
              {/* Loading State */}
              {isLoadingAnas ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                  <p className="text-slate-400" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    Analizler yükleniyor...
                  </p>
                </div>
              ) : analyses.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                    <BarChart3 size={40} className="text-slate-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Henüz bir analiz yapmadınız
                  </h3>
                  <p className="text-slate-400 mb-6" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    İlk analizinizi yapmak için Analyze sayfasına gidin
                  </p>
                  <Button
                    onClick={() => navigate('/analyze')}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold"
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  >
                    <BarChart3 className="mr-2" size={20} />
                    Analiz Yap
                  </Button>
                </div>
              ) : (
                <>
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
                    {analyses.map((analysis) => (
                      <Card 
                        key={analysis.id} 
                        className={`bg-slate-900 border-slate-700 overflow-hidden cursor-pointer group hover:border-blue-500 transition-all relative ${
                          selectedAnas.includes(analysis.id) ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => isSelectModeAna ? toggleAnaSelection(analysis.id) : setSelectedAnalysis(analysis)}
                      >
                        {/* Selection Checkbox */}
                        {isSelectModeAna && (
                          <div className="absolute top-3 left-3 z-10">
                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                              selectedAnas.includes(analysis.id) 
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
                          <img src={analysis.thumbnail} alt={analysis.title} className="w-full aspect-video object-cover" />
                          <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            {analysis.score}/100
                          </div>
                          
                          {/* Hover Actions */}
                          {!isSelectModeAna && (
                            <>
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105">
                                  Detayları Gör
                                </button>
                              </div>
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
                          <h3 className="text-white font-semibold mb-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                            {analysis.title}
                          </h3>
                          <p className="text-slate-500 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                            {formatDate(analysis.created_at)} • {analysis.rating}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>

          {/* Lightbox */}
          {lightboxImage && (
            <div 
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setLightboxImage(null)}
            >
              <img src={lightboxImage} alt="Preview" className="max-w-full max-h-full rounded-lg" />
            </div>
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
