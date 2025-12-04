import React, { useState } from 'react';
import { Upload, Sparkles, Loader2, ArrowRight, Eye, Smile, Box, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccessGuard from '../components/AccessGuard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { compressImageToBlob } from '../utils/imageHelpers';
import toast from 'react-hot-toast';

// DEMO DATA - MrBeast Example
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
  heatmap_points: [
    { x: 30, y: 40, color: "red" },
    { x: 70, y: 50, color: "yellow" }
  ]
};

const AnalyzePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext
  
  // State Management
  const [mode, setMode] = useState('demo'); // 'demo' | 'upload' | 'results'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(DEMO_DATA);

  // File Upload Handler
  const handleFileUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Lütfen geçerli bir resim dosyası seçin');
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setUploadedFile(file);
    setUploadedImageUrl(imageUrl);
    setMode('upload');
    setVideoTitle(''); // Reset title
  };

  // Drag & Drop Handlers
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Analyze Button Handler
  const handleAnalyze = async () => {
    // Validation
    if (!videoTitle.trim()) {
      toast.error('Lütfen video başlığını girin');
      return;
    }

    if (!uploadedFile) {
      toast.error('Lütfen bir resim yükleyin');
      return;
    }

    if (!user?.id) {
      toast.error('Lütfen giriş yapın');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Step 1: Compress image to Blob
      console.log('🗜️ Compressing image...');
      const compressedBlob = await compressImageToBlob(uploadedFile);
      
      // Step 2: Create FormData
      const formData = new FormData();
      formData.append('file', compressedBlob, 'thumbnail.jpg');
      formData.append('title', videoTitle.trim());
      formData.append('user_id', user.id); // Add user_id to request

      console.log('📤 Sending to n8n webhook...');
      console.log('👤 User ID:', user.id);

      // Step 3: API Request
      const response = await fetch('https://n8n.getoperiqo.com/webhook/49b88d43-fdf3-43c8-bfc4-70c30528f370', {
        method: 'POST',
        body: formData,
        // Note: Don't set Content-Type header - browser will set it automatically with boundary
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Analysis received:', data);

      // Step 4: Process Response
      // Map n8n response to our format
      const processedResult = {
        imageUrl: uploadedImageUrl,
        score: data.score || 85,
        rating: data.rating || "Çok İyi",
        isDemo: false,
        faces: data.faces || [
          { label: "Mutluluk", value: 70 },
          { label: "Şaşkınlık", value: 50 },
          { label: "Öfke", value: 10 }
        ],
        vibe: data.vibe || [
          { label: "Merak Uyandırma", value: 4 },
          { label: "Kışkırtıcılık", value: 3 },
          { label: "Gizem", value: 2 }
        ],
        objects: data.objects || [
          { label: "İnsan", value: 90 },
          { label: "Nesne", value: 75 }
        ],
        heatmap_points: data.heatmap_points || [
          { x: 40, y: 45, color: "red" },
          { x: 60, y: 55, color: "yellow" }
        ]
      };

      setAnalysisResult(processedResult);
      setMode('results');
      toast.success('Analiz tamamlandı! 🎉');

    } catch (error) {
      console.error('❌ Analysis error:', error);
      toast.error('Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset to Demo
  const resetToDemo = () => {
    setMode('demo');
    setUploadedFile(null);
    setUploadedImageUrl(null);
    setVideoTitle('');
    setAnalysisResult(DEMO_DATA);
  };

  // Progress Bar Component
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
          <span className={`font-bold text-lg ${color === 'blue' ? 'text-blue-400' : color === 'green' ? 'text-green-400' : 'text-cyan-400'}`}>
            {value}%
          </span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className={`h-full ${colorClasses[color]} transition-all duration-700 ease-out`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    );
  };

  // Render Dots (for vibe score)
  const renderDots = (count) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((dot) => (
          <div
            key={dot}
            className={`w-4 h-4 rounded-full transition-all ${
              dot <= count
                ? 'bg-blue-500 shadow-lg shadow-blue-500/50'
                : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

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
            {/* Page Title */}
            <div className="text-center mb-12">
              <h1 
                className="text-5xl font-bold text-white mb-3"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                <Sparkles className="inline mr-3 text-purple-500" size={48} />
                Thumbnail Analizi
              </h1>
              <p className="text-slate-400 text-lg" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                AI destekli CTR tahmini, yüz analizi ve heatmap
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT SIDE - Upload or Results */}
              <div>
                {/* DEMO MODE */}
                {mode === 'demo' && (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="relative group"
                  >
                    {/* Demo Image */}
                    <div className="relative rounded-2xl overflow-hidden border-4 border-purple-500/30">
                      <img 
                        src={DEMO_DATA.imageUrl} 
                        alt="Demo Thumbnail"
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        DEMO
                      </div>
                    </div>

                    {/* Upload Overlay */}
                    <div className="mt-6 border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:border-purple-500 transition-all cursor-pointer bg-slate-900/50"
                      onClick={() => document.getElementById('analyzeFileInput').click()}
                    >
                      <Upload size={48} className="mx-auto mb-4 text-slate-400" />
                      <p className="text-white font-semibold mb-2" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        Kendi Thumbnail'ınızı Yükleyin
                      </p>
                      <p className="text-slate-400 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        Tıklayın veya sürükleyip bırakın
                      </p>
                      <input
                        id="analyzeFileInput"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e.target.files[0])}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}

                {/* UPLOAD MODE */}
                {mode === 'upload' && (
                  <div className="space-y-6">
                    {/* Uploaded Image Preview */}
                    <div className="relative rounded-2xl overflow-hidden border-4 border-blue-500/50">
                      <img 
                        src={uploadedImageUrl} 
                        alt="Uploaded Thumbnail"
                        className="w-full aspect-video object-cover"
                      />
                    </div>

                    {/* Video Title Input */}
                    <div>
                      <Label className="text-white font-semibold mb-2 block" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        Video Başlığı *
                      </Label>
                      <Input
                        type="text"
                        placeholder="Örn: MrBeast'in En İlginç Videosu!"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="bg-slate-900 border-slate-700 text-white h-12"
                        style={{ fontFamily: 'Geist Sans, sans-serif' }}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !videoTitle.trim()}
                        className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold"
                        style={{ fontFamily: 'Geist Sans, sans-serif' }}
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
                        onClick={resetToDemo}
                        variant="outline"
                        className="h-12 border-slate-700 text-slate-300 hover:bg-slate-800"
                      >
                        İptal
                      </Button>
                    </div>
                  </div>
                )}

                {/* RESULTS MODE */}
                {mode === 'results' && (
                  <div className="space-y-6">
                    {/* Result Image */}
                    <div className="relative rounded-2xl overflow-hidden border-4 border-green-500/50">
                      <img 
                        src={analysisResult.imageUrl} 
                        alt="Analysis Result"
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        SONUÇ
                      </div>
                    </div>

                    {/* New Analysis Button */}
                    <Button
                      onClick={resetToDemo}
                      className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white"
                      style={{ fontFamily: 'Geist Sans, sans-serif' }}
                    >
                      <ArrowRight className="mr-2" size={20} />
                      Yeni Analiz
                    </Button>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE - Analysis Results */}
              <div>
                <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 p-6">
                  {/* DEMO MODE or RESULTS MODE - Show Analysis */}
                  {(mode === 'demo' || mode === 'results') && !isAnalyzing && (
                    <>
                      {/* Score Card */}
                      <div className="text-center mb-8 pb-6 border-b border-slate-800">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mb-4">
                          <span className="text-5xl font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                            {analysisResult.score}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                          {analysisResult.rating}
                        </h3>
                        <p className="text-slate-400" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                          CTR Tahmini
                        </p>
                      </div>

                      {/* Tabs - NO LABELS TAB */}
                      <Tabs defaultValue="faces" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-slate-800 p-1 rounded-lg mb-6">
                          <TabsTrigger 
                            value="faces"
                            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-slate-400"
                          >
                            <Smile size={16} className="mr-2" />
                            Yüzler
                          </TabsTrigger>
                          <TabsTrigger 
                            value="vibe"
                            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-slate-400"
                          >
                            <Flame size={16} className="mr-2" />
                            Vibe
                          </TabsTrigger>
                          <TabsTrigger 
                            value="objects"
                            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-slate-400"
                          >
                            <Box size={16} className="mr-2" />
                            Nesneler
                          </TabsTrigger>
                        </TabsList>

                        {/* Faces Tab */}
                        <TabsContent value="faces" className="space-y-4">
                          {analysisResult.faces.map((item, idx) => (
                            <ProgressBar 
                              key={idx}
                              label={item.label}
                              value={item.value}
                              color="blue"
                            />
                          ))}
                        </TabsContent>

                        {/* Vibe Tab */}
                        <TabsContent value="vibe" className="space-y-4">
                          {analysisResult.vibe.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2">
                              <span className="text-white font-medium" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                                {item.label}
                              </span>
                              {renderDots(item.value)}
                            </div>
                          ))}
                        </TabsContent>

                        {/* Objects Tab */}
                        <TabsContent value="objects" className="space-y-4">
                          {analysisResult.objects.map((item, idx) => (
                            <ProgressBar 
                              key={idx}
                              label={item.label}
                              value={item.value}
                              color="cyan"
                            />
                          ))}
                        </TabsContent>
                      </Tabs>
                    </>
                  )}

                  {/* UPLOAD MODE - Ready to Analyze */}
                  {mode === 'upload' && !isAnalyzing && (
                    <div className="text-center py-20">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-800 mb-6">
                        <Sparkles size={40} className="text-purple-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        Analiz için Hazır
                      </h3>
                      <p className="text-slate-400 max-w-sm mx-auto" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        Video başlığınızı girin ve "Analiz Et" butonuna basın
                      </p>
                    </div>
                  )}

                  {/* ANALYZING STATE - AI Processing */}
                  {isAnalyzing && (
                    <div className="text-center py-20">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mb-6 animate-pulse">
                        <Loader2 size={40} className="text-white animate-spin" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        Yapay Zeka ile Analiz Ediliyor...
                      </h3>
                      <p className="text-slate-400 max-w-sm mx-auto mb-6" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        Thumbnail'ınız detaylı olarak inceleniyor
                      </p>
                      {/* Progress Steps */}
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
