import React, { useState } from 'react';
import { Upload, Smile, Sparkles, Box, Tag, Flame, Loader2 } from 'lucide-react';
import ProGuard from '../components/ProGuard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// DEMO DATA - MrBeast Example (Outstanding Performance)
const DEMO_DATA = {
  imageUrl: "https://customer-assets.emergentagent.com/job_youclicker/artifacts/los4urqh_6vd279giuweb1.jpg",
  score: 92,
  rating: "Mükemmel",
  isDemo: true,
  faces: [
    { label: "Mutluluk", value: 95 },
    { label: "Şaşkınlık", value: 78 },
    { label: "Öfke", value: 5 }
  ],
  vibe: [
    { label: "Merak Uyandırma", value: 5 },
    { label: "Kışkırtıcılık", value: 4 },
    { label: "Gizem", value: 3 }
  ],
  objects: [
    { label: "İnsan", value: 99 },
    { label: "Lüks Yat", value: 95 },
    { label: "Deniz", value: 88 }
  ],
  labels: [
    { label: "Tık Çekici", value: 96 },
    { label: "Lüks", value: 92 },
    { label: "Heyecan", value: 89 }
  ],
  heatmap_points: [
    { x: 30, y: 40, color: "red" },
    { x: 70, y: 50, color: "yellow" }
  ]
};

const AnalyzePage = () => {
  const { isGuest, isPro } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [analysis, setAnalysis] = useState(DEMO_DATA); // START WITH DEMO
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState("faces");

  const handleFileUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    // Check if user is logged in
    if (isGuest) {
      setShowLoginModal(true);
      return;
    }

    // Check if user is PRO (only PRO can analyze)
    if (!isPro) {
      setShowUpgradeModal(true);
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    
    // Show scanning state
    setIsScanning(true);
    setAnalysis({ ...DEMO_DATA, imageUrl, isDemo: false });

    // Simulate AI processing for 2 seconds
    setTimeout(() => {
      setIsScanning(false);
      // Keep same mock data but with user's image
      setAnalysis({
        imageUrl: imageUrl,
        score: 85,
        rating: "Çok İyi",
        isDemo: false,
        faces: [
          { label: "Şaşkınlık", value: 88 },
          { label: "Mutluluk", value: 42 },
          { label: "Öfke", value: 12 }
        ],
        vibe: [
          { label: "Merak Uyandırma", value: 4 },
          { label: "Kışkırtıcılık", value: 5 },
          { label: "Gizem", value: 2 }
        ],
        objects: [
          { label: "İnsan", value: 95 },
          { label: "Nesne", value: 82 },
          { label: "Arka Plan", value: 78 }
        ],
        labels: [
          { label: "Tık Çekici", value: 87 },
          { label: "Dikkat Çekici", value: 91 },
          { label: "Profesyonel", value: 79 }
        ],
        heatmap_points: [
          { x: 35, y: 45, color: "red" },
          { x: 65, y: 55, color: "yellow" }
        ]
      });
    }, 2000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const renderDots = (count) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((dot) => (
          <div
            key={dot}
            className={`w-4 h-4 rounded-full transition-all ${
              dot <= count
                ? 'bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse'
                : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

  // HIGH CONTRAST Progress Bar Component
  const ProgressBar = ({ value, label, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      cyan: "bg-cyan-500"
    };

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-white font-medium" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
            {label}
          </span>
          <span className={`font-bold text-lg ${color === 'blue' ? 'text-blue-400' : color === 'green' ? 'text-green-400' : 'text-cyan-400'}`} style={{ fontFamily: 'Geist Sans, sans-serif' }}>
            {value}%
          </span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className={`h-full ${colorClasses[color]} transition-all duration-700 ease-out shadow-lg`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        feature="AI Analiz"
      />
      
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: 'url("https://customer-assets.emergentagent.com/job_326e649c-429d-481a-8bf3-c99e4276d28c/artifacts/bhrosu5k_8nNOHsP6PbEJMwWSth7Jb.png")',
        }}
      />

      {/* Content */}
      <div className="relative z-10 pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 
              className="text-5xl font-bold text-white mb-3"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Thumbnail Analiz
            </h1>
            <p 
              className="text-slate-400 text-lg"
              style={{ fontFamily: 'Geist Sans, sans-serif' }}
            >
              Yapay zeka ile thumbnail'ınızı detaylı analiz edin
            </p>
          </div>

          {/* Analysis Result Section */}
          <div className="space-y-6">
            {/* Score Section */}
            <div className="bg-slate-900 border-2 border-blue-500/30 rounded-2xl p-8 shadow-2xl shadow-blue-500/20">
              <div className="text-center mb-6">
                <h2 
                  className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  {analysis.score}/100
                </h2>
                <p 
                  className="text-2xl text-blue-400 font-bold"
                  style={{ fontFamily: 'Geist Sans, sans-serif' }}
                >
                  Genel CTR Skoru: {analysis.rating}
                </p>
              </div>
              {/* Main Progress Bar */}
              <div className="h-6 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 shadow-lg shadow-blue-500/50"
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Thumbnail Image */}
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
                {/* Demo Badge */}
                {analysis.isDemo && (
                  <div className="mb-4 flex justify-center">
                    <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold border border-blue-500/50" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                      Örnek Analiz (Demo)
                    </span>
                  </div>
                )}

                <div className="relative">
                  {/* Scanning Overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-black/80 rounded-lg flex flex-col items-center justify-center z-20">
                      <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
                      <p className="text-white text-lg font-semibold" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        Analiz Ediliyor...
                      </p>
                    </div>
                  )}

                  <img 
                    src={analysis.imageUrl} 
                    alt="Analyzed Thumbnail" 
                    className="w-full h-auto rounded-lg border-2 border-slate-700"
                  />
                  
                  {/* Heatmap Overlay */}
                  {activeTab === "heatmap" && !isScanning && (
                    <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none z-10">
                      {analysis.heatmap_points.map((point, idx) => (
                        <div
                          key={idx}
                          className="absolute"
                          style={{
                            left: `${point.x}%`,
                            top: `${point.y}%`,
                            transform: 'translate(-50%, -50%)',
                            width: '150px',
                            height: '150px',
                            background: point.color === 'red' 
                              ? 'radial-gradient(circle, rgba(255,0,0,0.6) 0%, rgba(255,0,0,0) 70%)'
                              : 'radial-gradient(circle, rgba(255,255,0,0.6) 0%, rgba(255,255,0,0) 70%)',
                            filter: 'blur(40px)',
                            mixBlendMode: 'screen'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Upload Zone */}
                <div 
                  className="mt-6 border-2 border-dashed border-blue-500/50 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-slate-800/50 transition-all"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('analyzeFileInput').click()}
                >
                  <input
                    id="analyzeFileInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                  <Upload size={32} className="text-blue-400 mx-auto mb-2" />
                  <p className="text-white font-semibold mb-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    Kendi Görselinizi Analiz Edin
                  </p>
                  <p className="text-slate-500 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    Sürükle-bırak veya tıkla
                  </p>
                </div>
              </div>

              {/* Analysis Tabs */}
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 bg-slate-800 p-1 rounded-lg" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    <TabsTrigger value="faces" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-400 rounded-md">
                      <Smile size={18} />
                    </TabsTrigger>
                    <TabsTrigger value="vibe" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-400 rounded-md">
                      <Sparkles size={18} />
                    </TabsTrigger>
                    <TabsTrigger value="objects" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-400 rounded-md">
                      <Box size={18} />
                    </TabsTrigger>
                    <TabsTrigger value="labels" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-400 rounded-md">
                      <Tag size={18} />
                    </TabsTrigger>
                    <TabsTrigger value="heatmap" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-400 rounded-md">
                      <Flame size={18} />
                    </TabsTrigger>
                  </TabsList>

                  {/* Yüz Analizi */}
                  <TabsContent value="faces" className="space-y-5 mt-6">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <Smile className="text-blue-400" />
                      Yüz Analizi
                    </h3>
                    {analysis.faces.map((face, idx) => (
                      <ProgressBar key={idx} label={face.label} value={face.value} color="blue" />
                    ))}
                  </TabsContent>

                  {/* Vibe & Etki */}
                  <TabsContent value="vibe" className="space-y-6 mt-6">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <Sparkles className="text-blue-400" />
                      Vibe & Etki
                    </h3>
                    {analysis.vibe.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <span className="text-white font-medium" style={{ fontFamily: 'Geist Sans, sans-serif' }}>{item.label}</span>
                        {renderDots(item.value)}
                      </div>
                    ))}
                  </TabsContent>

                  {/* Nesneler */}
                  <TabsContent value="objects" className="space-y-5 mt-6">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <Box className="text-blue-400" />
                      Algılanan Nesneler
                    </h3>
                    {analysis.objects.map((obj, idx) => (
                      <ProgressBar key={idx} label={obj.label} value={obj.value} color="green" />
                    ))}
                  </TabsContent>

                  {/* Etiketler */}
                  <TabsContent value="labels" className="space-y-5 mt-6">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <Tag className="text-blue-400" />
                      Etiketler
                    </h3>
                    {analysis.labels.map((label, idx) => (
                      <ProgressBar key={idx} label={label.label} value={label.value} color="cyan" />
                    ))}
                  </TabsContent>

                  {/* Isı Haritası */}
                  <TabsContent value="heatmap" className="space-y-4 mt-6">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <Flame className="text-blue-400" />
                      Isı Haritası
                    </h3>
                    <div className="bg-slate-800 rounded-lg p-6 border-2 border-blue-500/30">
                      <p className="text-white text-base mb-4 font-medium" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        Göz takip simülasyonu görselin üzerinde aktif.
                      </p>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></div>
                          <span className="text-slate-300 font-medium" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Yüksek İlgi Alanı</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></div>
                          <span className="text-slate-300 font-medium" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Orta İlgi Alanı</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AnalyzePage;
