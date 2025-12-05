import React, { useState } from 'react';
import { Upload, Sparkles, Loader2, Eye, Smile, Box, Flame } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AccessGuard from '../components/AccessGuard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { compressImageToBlob } from '../utils/imageHelpers';

// Label mappings for Turkish
const OBJECT_LABELS = {
  "insan": "İnsan",
  "yazi_paneli": "Yazı Paneli",
  "dijital_ekran_arayuzu": "Dijital Ekran",
  "isaret_parmagi": "İşaret Parmağı",
  "kitaplik": "Kitaplık",
  "metin_grafigi": "Metin Grafiği"
};

const EMOTION_LABELS = {
  "mutluluk": "Mutluluk",
  "saskinlik": "Şaşkınlık",
  "ofke": "Öfke",
  "korku": "Korku",
  "uzuntu": "Üzüntü"
};

const VIBE_LABELS = {
  "merak_uyandirma": "Merak Uyandırma",
  "kiskiricilik": "Kışkırtıcılık",
  "gizem": "Gizem",
  "aciliyet": "Aciliyet",
  "guvenilirlik": "Güvenilirlik",
  "duygusal_etki": "Duygusal Etki"
};

// Demo data for initial view
const DEMO_RESULT = {
  score: { value: 92, label: "Mükemmel" },
  faces: {
    face_count: 1,
    summary: {
      avg_mutluluk: 95,
      avg_saskinlik: 78,
      avg_ofke: 5
    }
  },
  vibe: {
    merak_uyandirma: 5,
    kiskiricilik: 4,
    gizem: 3
  },
  objects: {
    objects: [
      { name: "insan", confidence: 99 },
      { name: "yazi_paneli", confidence: 95 },
      { name: "dijital_ekran_arayuzu", confidence: 88 }
    ]
  },
  heatmap: {
    focus_points: [
      { x: 38, y: 32, intensity: 1.0, radius: 50, reason: "yüz ve göz teması" },
      { x: 75, y: 20, intensity: 0.9, radius: 60, reason: "büyük renkli metin" }
    ]
  }
};

const DEMO_IMAGE = "https://customer-assets.emergentagent.com/job_youclicker/artifacts/los4urqh_6vd279giuweb1.jpg";

const AnalyzePage = () => {
  const { user } = useAuth();
  
  // Simple state
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('faces');

  // File upload handler
  const handleFileSelect = (selectedFile) => {
    console.log('📤 File selected:', selectedFile);
    
    if (!selectedFile || !selectedFile.type.startsWith('image/')) {
      alert('Lütfen geçerli bir resim dosyası seçin');
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setPreview(previewUrl);
    setTitle('');
    setResult(null);
    
    console.log('✅ Preview created:', previewUrl);
  };

  // Analyze button handler
  const handleAnalyze = async () => {
    console.log('🔘 Analyze clicked. File:', file, 'Title:', title, 'User:', user?.id);

    // Step 1: Validation
    if (!file) {
      alert('Lütfen bir resim yükleyin');
      console.log('❌ No file');
      return;
    }

    if (!title.trim()) {
      alert('Lütfen video başlığını girin');
      console.log('❌ No title');
      return;
    }

    if (!user?.id) {
      alert('Lütfen giriş yapın');
      console.log('❌ No user ID');
      return;
    }

    // Step 2: Loading
    setIsAnalyzing(true);
    console.log('✅ Starting analysis...');

    try {
      // Step 3: Compression
      console.log('🗜️ Compressing image...');
      const compressedBlob = await compressImageToBlob(file);
      console.log('✅ Image compressed:', compressedBlob.size, 'bytes');

      // Step 4: FormData
      const formData = new FormData();
      formData.append('file', compressedBlob, 'thumbnail.jpg');
      formData.append('title', title.trim());
      formData.append('user_id', user.id);
      
      console.log('📦 FormData prepared');
      console.log('   - file:', compressedBlob.size, 'bytes');
      console.log('   - title:', title.trim());
      console.log('   - user_id:', user.id);

      // Step 5: API Call
      console.log('📤 Sending to n8n webhook...');
      const response = await fetch('https://n8n.getoperiqo.com/webhook/49b88d43-fdf3-43c8-bfc4-70c30528f370', {
        method: 'POST',
        body: formData,
        // DON'T set Content-Type - browser sets it with boundary
      });

      console.log('📥 Response received:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      // Step 6: Parse response
      const responseData = await response.json();
      console.log('✅ Analysis complete:', responseData);

      // Extract data from n8n response structure
      const analysisData = responseData.success ? responseData.data : responseData;
      
      setResult(analysisData);
      alert('Analiz tamamlandı! 🎉');

    } catch (error) {
      console.error('❌ Error:', error);
      alert(`Hata: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
      console.log('✅ Analysis process finished');
    }
  };

  // Reset to demo
  const resetDemo = () => {
    setFile(null);
    setPreview(null);
    setTitle('');
    setResult(null);
    setActiveTab('faces');
  };

  // Current display data
  const displayImage = preview || DEMO_IMAGE;
  const displayResult = result || DEMO_RESULT;
  const showDemo = !file && !result;

  // Helper: Get heatmap color based on intensity
  const getHeatmapColor = (intensity) => {
    if (intensity > 0.8) return 'rgba(239, 68, 68, 0.5)'; // Red - high attention
    if (intensity > 0.5) return 'rgba(251, 191, 36, 0.4)'; // Yellow - medium attention
    return 'rgba(59, 130, 246, 0.3)'; // Blue - low attention
  };

  // Helper: Get border color
  const getHeatmapBorder = (intensity) => {
    if (intensity > 0.8) return 'rgb(239, 68, 68)';
    if (intensity > 0.5) return 'rgb(251, 191, 36)';
    return 'rgb(59, 130, 246)';
  };

  // Helper: Capitalize Turkish words
  const capitalizeTurkish = (str) => {
    if (!str) return '';
    return str.charAt(0).toLocaleUpperCase('tr-TR') + str.slice(1);
  };

  // Progress bar component
  const ProgressBar = ({ label, value, color = "blue" }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-white font-medium">{label}</span>
        <span className={`font-bold text-lg ${
          color === 'blue' ? 'text-blue-400' : 
          color === 'green' ? 'text-green-400' : 
          'text-cyan-400'
        }`}>
          {value}%
        </span>
      </div>
      <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
        <div
          className={`h-full transition-all duration-700 ${
            color === 'blue' ? 'bg-blue-500' : 
            color === 'green' ? 'bg-green-500' : 
            'bg-cyan-500'
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  // Dots renderer
  const renderDots = (count) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((dot) => (
        <div
          key={dot}
          className={`w-4 h-4 rounded-full transition-all ${
            dot <= count ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 'bg-slate-700'
          }`}
        />
      ))}
    </div>
  );

  return (
    <AccessGuard requirePro={true}>
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
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-3">
                <Sparkles className="inline mr-3 text-purple-500" size={48} />
                Thumbnail Analizi
              </h1>
              <p className="text-slate-400 text-lg">
                AI destekli CTR tahmini, yüz analizi ve heatmap
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT SIDE */}
              <div>
                {/* Image Display */}
                <div className="relative rounded-2xl overflow-hidden border-4 border-purple-500/30 mb-6">
                  <img 
                    src={displayImage} 
                    alt="Thumbnail"
                    className="w-full aspect-video object-cover"
                  />
                  
                  {/* Heatmap overlay when tab is active */}
                  {activeTab === 'heatmap' && displayResult.heatmap_points && displayResult.heatmap_points.map((point, idx) => (
                    <div
                      key={idx}
                      className="absolute rounded-full animate-pulse"
                      style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        width: '80px',
                        height: '80px',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: point.color === 'red' 
                          ? 'rgba(239, 68, 68, 0.4)' 
                          : point.color === 'yellow'
                          ? 'rgba(251, 191, 36, 0.4)'
                          : 'rgba(59, 130, 246, 0.4)',
                        border: `3px solid ${point.color === 'red' 
                          ? 'rgb(239, 68, 68)' 
                          : point.color === 'yellow'
                          ? 'rgb(251, 191, 36)'
                          : 'rgb(59, 130, 246)'}`,
                        boxShadow: point.color === 'red' 
                          ? '0 0 20px rgba(239, 68, 68, 0.6)' 
                          : point.color === 'yellow'
                          ? '0 0 20px rgba(251, 191, 36, 0.6)'
                          : '0 0 20px rgba(59, 130, 246, 0.6)',
                      }}
                    />
                  ))}
                  
                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {showDemo ? 'DEMO' : result ? 'SONUÇ' : 'UPLOAD'}
                  </div>
                </div>

                {/* Upload controls OR Results actions */}
                {!file && !result && (
                  <div
                    className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:border-purple-500 transition-all cursor-pointer bg-slate-900/50"
                    onClick={() => document.getElementById('fileInput').click()}
                  >
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                      className="hidden"
                    />
                    <Upload size={48} className="mx-auto mb-4 text-slate-400" />
                    <p className="text-white font-semibold mb-2">
                      Kendi Thumbnail'ınızı Yükleyin
                    </p>
                    <p className="text-slate-400 text-sm">
                      Tıklayın veya sürükleyip bırakın
                    </p>
                  </div>
                )}

                {file && !result && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white font-semibold mb-2 block">
                        Video Başlığı *
                      </Label>
                      <Input
                        type="text"
                        placeholder="Örn: MrBeast'in En İlginç Videosu!"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-slate-900 border-slate-700 text-white h-12"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !title.trim()}
                        className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 animate-spin" size={20} />
                            Analiz Ediliyor...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2" size={20} />
                            Analiz Et
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={resetDemo}
                        variant="outline"
                        className="h-12 border-slate-700 text-slate-300 hover:bg-slate-800"
                      >
                        İptal
                      </Button>
                    </div>
                  </div>
                )}

                {result && (
                  <Button
                    onClick={resetDemo}
                    className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    Yeni Analiz
                  </Button>
                )}
              </div>

              {/* RIGHT SIDE - Results */}
              <div>
                <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 p-6">
                  {!isAnalyzing ? (
                    <>
                      {/* Score */}
                      <div className="text-center mb-8 pb-6 border-b border-slate-800">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mb-4">
                          <span className="text-5xl font-bold text-white">
                            {displayResult.score}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {displayResult.rating}
                        </h3>
                        <p className="text-slate-400">CTR Tahmini</p>
                      </div>

                      {/* Tabs */}
                      <Tabs 
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-4 bg-slate-800 p-1 rounded-lg mb-6">
                          <TabsTrigger value="faces" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-slate-400 text-xs">
                            <Smile size={14} className="mr-1" />
                            Yüzler
                          </TabsTrigger>
                          <TabsTrigger value="vibe" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-slate-400 text-xs">
                            <Flame size={14} className="mr-1" />
                            Vibe
                          </TabsTrigger>
                          <TabsTrigger value="objects" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-slate-400 text-xs">
                            <Box size={14} className="mr-1" />
                            Nesneler
                          </TabsTrigger>
                          <TabsTrigger value="heatmap" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-slate-400 text-xs">
                            <Eye size={14} className="mr-1" />
                            Isı
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="faces" className="space-y-4">
                          {displayResult.faces.map((item, idx) => (
                            <ProgressBar key={idx} label={item.label} value={item.value} color="blue" />
                          ))}
                        </TabsContent>

                        <TabsContent value="vibe" className="space-y-4">
                          {displayResult.vibe.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2">
                              <span className="text-white font-medium">{item.label}</span>
                              {renderDots(item.value)}
                            </div>
                          ))}
                        </TabsContent>

                        <TabsContent value="objects" className="space-y-4">
                          {displayResult.objects.map((item, idx) => (
                            <ProgressBar key={idx} label={item.label} value={item.value} color="cyan" />
                          ))}
                        </TabsContent>

                        <TabsContent value="heatmap" className="space-y-4">
                          <div className="text-center py-8">
                            <Eye size={48} className="mx-auto mb-4 text-purple-400" />
                            <h4 className="text-xl font-bold text-white mb-3">Isı Haritası</h4>
                            <p className="text-slate-400 text-sm mb-6">
                              Sol taraftaki thumbnail üzerinde dikkat çekme bölgelerini görebilirsiniz
                            </p>
                            <div className="space-y-3 max-w-xs mx-auto text-left">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-red-500/40 border-2 border-red-500"></div>
                                <span className="text-white text-sm">Yüksek Dikkat</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-yellow-500/40 border-2 border-yellow-500"></div>
                                <span className="text-white text-sm">Orta Dikkat</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-blue-500/40 border-2 border-blue-500"></div>
                                <span className="text-white text-sm">Düşük Dikkat</span>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </>
                  ) : (
                    // Analyzing state
                    <div className="text-center py-20">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mb-6 animate-pulse">
                        <Loader2 size={40} className="text-white animate-spin" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        Yapay Zeka ile Analiz Ediliyor...
                      </h3>
                      <p className="text-slate-400 max-w-sm mx-auto mb-6">
                        Thumbnail'ınız detaylı olarak inceleniyor
                      </p>
                      <div className="space-y-3 text-left max-w-md mx-auto">
                        <div className="flex items-center gap-3 text-slate-300">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-sm">Görsel işleniyor...</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                          <span className="text-sm">Yüz ve nesne analizi yapılıyor...</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                          <span className="text-sm">CTR tahmini hesaplanıyor...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccessGuard>
  );
};

export default AnalyzePage;
