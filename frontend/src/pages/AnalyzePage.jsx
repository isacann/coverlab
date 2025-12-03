import React, { useState } from 'react';
import { Upload, Smile, Sparkles, Box, Tag, Flame } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';

// Mock Data
const mockAnalysis = {
  imageUrl: "https://customer-assets.emergentagent.com/job_youclicker/artifacts/chp7x16v_6vd279giuweb1.jpg",
  score: 82,
  rating: "Çok İyi",
  faces: [
    { label: "Şaşkınlık", value: 95 },
    { label: "Mutluluk", value: 15 },
    { label: "Öfke", value: 5 }
  ],
  vibe: [
    { label: "Merak Uyandırma", value: 4 },
    { label: "Kışkırtıcılık", value: 5 },
    { label: "Gizem", value: 2 }
  ],
  objects: [
    { label: "İnsan", value: 99 },
    { label: "Lüks Yat", value: 95 },
    { label: "Deniz", value: 88 }
  ],
  labels: [
    { label: "Tık Çekici", value: 92 },
    { label: "Lüks", value: 89 },
    { label: "Heyecan", value: 85 }
  ],
  heatmap_points: [
    { x: 25, y: 35, color: "red" },
    { x: 65, y: 45, color: "yellow" }
  ]
};

const AnalyzePage = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState("faces");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      
      // Simulate analysis
      setTimeout(() => {
        setAnalysis({
          ...mockAnalysis,
          imageUrl: imageUrl
        });
      }, 1500);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      
      setTimeout(() => {
        setAnalysis({
          ...mockAnalysis,
          imageUrl: imageUrl
        });
      }, 1500);
    }
  };

  const renderDots = (count) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((dot) => (
          <div
            key={dot}
            className={`w-4 h-4 rounded-full ${
              dot <= count
                ? 'bg-cyan-500 shadow-lg shadow-cyan-500/50'
                : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://customer-assets.emergentagent.com/job_326e649c-429d-481a-8bf3-c99e4276d28c/artifacts/bhrosu5k_8nNOHsP6PbEJMwWSth7Jb.png")',
        }}
      >
        <div className="absolute inset-0 bg-black/75"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 
              className="text-4xl md:text-5xl font-bold text-white mb-3"
              style={{ 
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)'
              }}
            >
              Thumbnail Analiz
            </h1>
            <p 
              className="text-slate-300 text-lg"
              style={{ 
                fontFamily: 'Geist Sans, sans-serif',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
              }}
            >
              Yapay zeka ile thumbnail'ınızı detaylı analiz edin
            </p>
          </div>

          {!analysis ? (
            /* Upload Section */
            <div className="max-w-2xl mx-auto">
              <div 
                className="bg-slate-900/50 backdrop-blur-xl border-2 border-dashed border-cyan-500/50 rounded-2xl p-16 text-center cursor-pointer hover:border-cyan-500 transition-all"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById('analyzeFileInput').click()}
              >
                <input
                  id="analyzeFileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-24 h-24 mx-auto mb-6 bg-cyan-500/10 rounded-full flex items-center justify-center border-2 border-cyan-500/30">
                  <Upload size={48} className="text-cyan-400" />
                </div>
                <h3 
                  className="text-2xl font-bold text-white mb-3"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  Thumbnail Yükle
                </h3>
                <p 
                  className="text-slate-400 mb-6"
                  style={{ fontFamily: 'Geist Sans, sans-serif' }}
                >
                  Sürükle-bırak veya tıklayarak dosya seç
                </p>
                <p 
                  className="text-slate-500 text-sm"
                  style={{ fontFamily: 'Geist Sans, sans-serif' }}
                >
                  PNG, JPG veya JPEG (Max 10MB)
                </p>
              </div>
            </div>
          ) : (
            /* Analysis Result Section */
            <div className="space-y-6">
              {/* Score Section */}
              <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/10">
                <div className="text-center mb-6">
                  <h2 
                    className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    {analysis.score}/100
                  </h2>
                  <p 
                    className="text-xl text-cyan-400 font-semibold"
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  >
                    Genel CTR Skoru: {analysis.rating}
                  </p>
                </div>
                <Progress value={analysis.score} className="h-4 bg-slate-800" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Thumbnail Image */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                  <div className="relative">
                    <img 
                      src={analysis.imageUrl} 
                      alt="Analyzed Thumbnail" 
                      className="w-full h-auto rounded-lg border-2 border-slate-700"
                    />
                    
                    {/* Heatmap Overlay - Only show when heatmap tab is active */}
                    {activeTab === "heatmap" && (
                      <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                        {analysis.heatmap_points.map((point, idx) => (
                          <div
                            key={idx}
                            className="absolute w-32 h-32"
                            style={{
                              left: `${point.x}%`,
                              top: `${point.y}%`,
                              transform: 'translate(-50%, -50%)',
                              background: point.color === 'red' 
                                ? 'radial-gradient(circle, rgba(239,68,68,0.8) 0%, rgba(239,68,68,0) 70%)'
                                : 'radial-gradient(circle, rgba(234,179,8,0.8) 0%, rgba(234,179,8,0) 70%)',
                              filter: 'blur(40px)',
                              mixBlendMode: 'overlay'
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Analysis Tabs */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5 bg-slate-800/50" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                      <TabsTrigger value="faces" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                        <Smile size={16} />
                      </TabsTrigger>
                      <TabsTrigger value="vibe" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                        <Sparkles size={16} />
                      </TabsTrigger>
                      <TabsTrigger value="objects" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                        <Box size={16} />
                      </TabsTrigger>
                      <TabsTrigger value="labels" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                        <Tag size={16} />
                      </TabsTrigger>
                      <TabsTrigger value="heatmap" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                        <Flame size={16} />
                      </TabsTrigger>
                    </TabsList>

                    {/* Yüz Analizi */}
                    <TabsContent value="faces" className="space-y-4 mt-6">
                      <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        Yüz Analizi
                      </h3>
                      {analysis.faces.map((face, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300" style={{ fontFamily: 'Geist Sans, sans-serif' }}>{face.label}</span>
                            <span className="text-cyan-400 font-semibold" style={{ fontFamily: 'Geist Sans, sans-serif' }}>{face.value}%</span>
                          </div>
                          <Progress value={face.value} className="h-2 bg-slate-800" />
                        </div>
                      ))}
                    </TabsContent>

                    {/* Vibe & Etki */}
                    <TabsContent value="vibe" className="space-y-6 mt-6">
                      <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        Vibe & Etki
                      </h3>
                      {analysis.vibe.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-slate-300" style={{ fontFamily: 'Geist Sans, sans-serif' }}>{item.label}</span>
                          {renderDots(item.value)}
                        </div>
                      ))}
                    </TabsContent>

                    {/* Nesneler */}
                    <TabsContent value="objects" className="space-y-4 mt-6">
                      <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        Algılanan Nesneler
                      </h3>
                      {analysis.objects.map((obj, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300" style={{ fontFamily: 'Geist Sans, sans-serif' }}>{obj.label}</span>
                            <span className="text-cyan-400 font-semibold" style={{ fontFamily: 'Geist Sans, sans-serif' }}>{obj.value}%</span>
                          </div>
                          <Progress value={obj.value} className="h-2 bg-slate-800" />
                        </div>
                      ))}
                    </TabsContent>

                    {/* Etiketler */}
                    <TabsContent value="labels" className="space-y-4 mt-6">
                      <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        Etiketler
                      </h3>
                      {analysis.labels.map((label, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300" style={{ fontFamily: 'Geist Sans, sans-serif' }}>{label.label}</span>
                            <span className="text-cyan-400 font-semibold" style={{ fontFamily: 'Geist Sans, sans-serif' }}>{label.value}%</span>
                          </div>
                          <Progress value={label.value} className="h-2 bg-slate-800" />
                        </div>
                      ))}
                    </TabsContent>

                    {/* Isı Haritası */}
                    <TabsContent value="heatmap" className="space-y-4 mt-6">
                      <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        Isı Haritası
                      </h3>
                      <div className="bg-slate-800/50 rounded-lg p-4 border border-cyan-500/30">
                        <p className="text-slate-300 text-sm mb-3" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                          Göz takip simülasyonu görselin sol tarafında aktif.
                        </p>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                            <span className="text-slate-400 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Yüksek İlgi</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                            <span className="text-slate-400 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Orta İlgi</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzePage;
