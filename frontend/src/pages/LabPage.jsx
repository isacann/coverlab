import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Eye, Download, Trash2, CheckSquare, Square } from 'lucide-react';
import AnalysisDetailModal from '../components/modals/AnalysisDetailModal';
import AccessGuard from '../components/AccessGuard';

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

const LabPage = () => {
  // State Management
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  
  // Selection states for deletion
  const [isSelectModeGen, setIsSelectModeGen] = useState(false);
  const [isSelectModeAna, setIsSelectModeAna] = useState(false);
  const [selectedGens, setSelectedGens] = useState([]);
  const [selectedAnas, setSelectedAnas] = useState([]);
  
  // Data states with mock data
  const [generations, setGenerations] = useState(mockGenerations);
  const [analyses, setAnalyses] = useState(mockAnalyses);
  
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
  
  const deleteSelectedGens = () => {
    setGenerations(prev => prev.filter(g => !selectedGens.includes(g.id)));
    setSelectedGens([]);
    setIsSelectModeGen(false);
  };
  
  const deleteSingleGen = (id, e) => {
    e.stopPropagation();
    setGenerations(prev => prev.filter(g => g.id !== id));
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
              Tüm çalışmalarınız burada saklanır
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
                    onClick={() => isSelectModeGen ? toggleGenSelection(gen.id) : setLightboxImage(gen.thumbnail)}
                  >
                    {/* Selection Checkbox Overlay */}
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
                      <img src={gen.thumbnail} alt={gen.title} className="w-full aspect-video object-cover" />
                      
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
                        {gen.title}
                      </h3>
                      <p className="text-slate-500 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        {gen.date}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockAnalyses.map((analysis) => (
                  <Card 
                    key={analysis.id} 
                    className="bg-slate-900 border-slate-700 overflow-hidden cursor-pointer group hover:border-blue-500 transition-all"
                    onClick={() => setSelectedAnalysis(analysis)}
                  >
                    <div className="relative">
                      <img src={analysis.thumbnail} alt={analysis.title} className="w-full aspect-video object-cover" />
                      <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {analysis.score}/100
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
                          Detayları Gör
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        {analysis.title}
                      </h3>
                      <p className="text-slate-500 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        {analysis.date} • {analysis.rating}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
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

          {/* Analysis Detail Modal */}
          {selectedAnalysis && (
            <AnalysisDetailModal 
              analysis={selectedAnalysis} 
              isOpen={!!selectedAnalysis} 
              onClose={() => setSelectedAnalysis(null)}
            />
          )}
        </div>
      </div>
    </AccessGuard>
  );
};

export default LabPage;
