import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Upload, X, AlertCircle, TrendingUp, Users, Sparkles, Target, Eye } from 'lucide-react';
import { compressImageToBlob } from '../utils/imageHelpers';

// MRBEAST DEMO DATA - SABIT KALACAK
const MRBEAST_DEMO = {
  success: true,
  data: {
    score: {
      value: 95,
      label: "Mükemmel"
    },
    feedback: "Mükemmel bir iş! Yüz ifaden ve 'altın yat' objesi o kadar güçlü bir kanca oluşturmuş ki yazıya hiç ihtiyaç duymamışsın. Bu tam da YouTube'un sevdiği 'görsel hikaye anlatıcılığı' tarzı. Mavi (okyanus/gökyüzü) ve Sarı (altın yat) renklerin zıtlığı harika bir kontrast yaratmış. Kaptan kostümü otorite sağlarken, altın yat merak unsurunu tavana çıkarıyor. Bu thumbnail şu haliyle 'Altın Standart' seviyesinde, üzerinde değişiklik yapmana gerek yok. Aynen yayına alabilirsin!",
    faces: {
      face_count: 1,
      faces: [
        {
          id: 1,
          position: { x: 5, y: 5, width: 35, height: 75 },
          emotions: {
            mutluluk: 90,
            saskinlik: 85,
            ofke: 0,
            korku: 0,
            uzuntu: 0,
            notr: 0
          },
          dominant_emotion: "mutluluk",
          size: "büyük",
          eye_contact: true
        }
      ],
      summary: {
        avg_mutluluk: 90,
        avg_saskinlik: 85,
        avg_ofke: 0
      }
    },
    vibe: {
      merak_uyandirma: 5,
      kiskiricilik: 5,
      gizem: 3,
      aciliyet: 4,
      guvenilirlik: 5,
      duygusal_etki: 5,
      overall_vibe: "lüks ve eğlence"
    },
    objects: {
      object_count: 3,
      objects: [
        {
          name: "insan (kaptan üniformalı)",
          confidence: 99,
          position: { x: 0, y: 5, width: 40, height: 95 },
          attention_score: 5,
          is_color_dominant: false
        },
        {
          name: "altın yat",
          confidence: 98,
          position: { x: 35, y: 10, width: 65, height: 70 },
          attention_score: 5,
          is_color_dominant: true
        },
        {
          name: "okyanus/gökyüzü",
          confidence: 95,
          position: { x: 0, y: 0, width: 100, height: 100 },
          attention_score: 2,
          is_color_dominant: true
        }
      ],
      detected_text: [],
      has_text_overlay: false
    },
    heatmap: {
      focus_points: [
        { x: 20, y: 55, intensity: 1, radius: 50, reason: "ağız (abartılı ifade)" },
        { x: 20, y: 35, intensity: 0.95, radius: 45, reason: "gözler" },
        { x: 60, y: 45, intensity: 0.9, radius: 80, reason: "altın yat gövdesi" },
        { x: 50, y: 15, intensity: 0.7, radius: 30, reason: "yatın üst kısmı (parıltı)" },
        { x: 30, y: 78, intensity: 0.5, radius: 25, reason: "kaptan apoleti (bağlam)" }
      ],
      attention_flow: ["yüz ifadesi", "altın yat", "kaptan kıyafeti"],
      dead_zones: [
        { x: 80, y: 80, width: 20, height: 20 },
        { x: 0, y: 0, width: 15, height: 15 }
      ]
    },
    score_breakdown: {
      faces_contribution: 28.88,
      vibe_contribution: 22.5,
      visual_contribution: 19.5,
      objects_contribution: 14.25,
      heatmap_contribution: 9.5
    },
    prediction: {
      estimated_ctr_range: "12-18%",
      comparison: "Nişindeki ortalama thumbnail'lerden %85 daha iyi",
      viral_potential: "çok yüksek"
    },
    input_image_url: "https://customer-assets.emergentagent.com/job_coverlab-studio/artifacts/ot7391mb_6vd279giuweb1.jpg",
    input_title: "1.000.000 $'lık Gemi"
  }
};

const MRBEAST_IMAGE = "https://customer-assets.emergentagent.com/job_coverlab-studio/artifacts/ot7391mb_6vd279giuweb1.jpg";

const AnalyzePage = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setPreview(URL.createObjectURL(uploadedFile));
    setResult(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: false,
  });

  const handleAnalyze = async () => {
    console.log('🔍 Debug - file:', !!file, 'title:', title, 'user:', user);
    
    if (!file || !title.trim()) {
      alert('Lütfen resim ve başlık giriniz');
      return;
    }

    if (!user?.id) {
      alert('Lütfen önce giriş yapın. Sayfanın üst kısmındaki "Login" butonuna tıklayın veya "Admin Giriş" kullanın.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const compressedBlob = await compressImageToBlob(file);
      
      const formData = new FormData();
      formData.append('file', compressedBlob, 'thumbnail.jpg');
      formData.append('title', title.trim());
      formData.append('user_id', user.id);

      console.log('📤 Sending to n8n webhook...');
      const response = await fetch('https://n8n.getoperiqo.com/webhook/49b88d43-fdf3-43c8-bfc4-70c30528f370', {
        method: 'POST',
        body: formData,
      });
      
      console.log('📡 Response received!');

      const rawJson = await response.json();
      console.log('📦 RAW RESPONSE:', JSON.stringify(rawJson, null, 2));

      // EXTRACT DATA - TRY ALL POSSIBLE FORMATS
      let data = null;
      
      // Format 1: {"sonuc": [{success: true, data: {...}}]}
      if (rawJson.sonuc && Array.isArray(rawJson.sonuc) && rawJson.sonuc[0]?.data) {
        console.log('✅ Format 1: sonuc array with data');
        data = rawJson.sonuc[0].data;
      }
      // Format 2: [{success: true, data: {...}}]
      else if (Array.isArray(rawJson) && rawJson[0]?.data) {
        console.log('✅ Format 2: direct array with data');
        data = rawJson[0].data;
      }
      // Format 3: {success: true, data: {...}}
      else if (rawJson.data) {
        console.log('✅ Format 3: direct object with data');
        data = rawJson.data;
      }
      // Format 4: Direct data object (no wrapper)
      else if (rawJson.score && rawJson.feedback) {
        console.log('✅ Format 4: direct data object');
        data = rawJson;
      }

      console.log('📦 EXTRACTED DATA:', data ? 'YES ✅' : 'NO ❌');

      if (!data) {
        console.error('❌ NO DATA FOUND IN ANY FORMAT!');
        console.error('Raw response keys:', Object.keys(rawJson));
        alert('Hata: Response içinde data bulunamadı. Console\'u kontrol edin.');
        return;
      }

      console.log('✅ SUCCESS! Setting result...');
      setResult(data);
      alert('🎉 Analiz tamamlandı!');

    } catch (error) {
      console.error('❌ Analysis error:', error);
      alert(`Hata: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetDemo = () => {
    setFile(null);
    setPreview(null);
    setTitle('');
    setResult(null);
    setActiveTab('overview');
  };

  // Display logic
  // DEMO MODE: Hiçbir şey yüklenmediğinde MrBeast demo göster
  // UPLOAD MODE: Kullanıcı dosya yüklediğinde sadece preview göster (sonuçları gizle)
  // RESULT MODE: Analiz tamamlandığında sonuçları göster
  const showDemo = !file && !result;
  const showResults = !!result;
  const displayImage = preview || (result && result.input_image_url) || MRBEAST_IMAGE;
  const displayData = result || MRBEAST_DEMO.data;

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Thumbnail Analizi
          </h1>
          <p className="text-xl text-slate-400" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
            Yapay zeka ile thumbnail'inizi analiz edin
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Upload Section */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
            <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Thumbnail Yükle
            </h2>

            {/* Dropzone */}
            {!preview ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                  isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto mb-4 text-slate-400" size={48} />
                <p className="text-slate-300 mb-2" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  Dosya sürükleyin veya tıklayın
                </p>
                <p className="text-sm text-slate-500" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  PNG, JPG, JPEG, WebP
                </p>
              </div>
            ) : (
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-xl" />
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                    setResult(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Title Input */}
            <div className="mt-6">
              <label className="block text-white font-semibold mb-2" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                Video Başlığı
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Ben 1.000.000 $'lık Gemi Aldım!"
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:border-blue-500 focus:outline-none"
                style={{ fontFamily: 'Geist Sans, sans-serif' }}
              />
            </div>

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={!file || !title.trim() || isAnalyzing}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Geist Sans, sans-serif' }}
            >
              {isAnalyzing ? '⏳ Analiz Ediliyor...' : '🚀 Analiz Et'}
            </Button>

            {result && (
              <Button
                onClick={resetDemo}
                className="w-full mt-3 bg-slate-700 hover:bg-slate-600 text-white py-3"
                style={{ fontFamily: 'Geist Sans, sans-serif' }}
              >
                Yeni Analiz
              </Button>
            )}
          </div>

          {/* Right: Preview & Score */}
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
            <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {showDemo ? 'Demo Önizleme' : 'Sonuçlar'}
            </h2>

            {/* Thumbnail Image */}
            <div className="relative mb-6">
              <img src={displayImage} alt="Thumbnail" className="w-full h-64 object-cover rounded-xl" />
              {showDemo && (
                <div className="absolute top-2 left-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  DEMO
                </div>
              )}
              {file && !result && (
                <div className="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <AlertCircle className="mx-auto mb-3 text-blue-400" size={48} />
                    <p className="text-white font-semibold mb-2" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                      Analiz Bekleniyor
                    </p>
                    <p className="text-sm text-slate-400" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                      "Analiz Et" butonuna basın
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Score Display - Only show when we have results or demo */}
            {(showDemo || showResults) && (
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6 text-center">
                <div className="text-6xl font-bold text-white mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {displayData.score.value}
                </div>
                <div className="text-2xl font-semibold text-blue-400 mb-4" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  {displayData.score.label}
                </div>
                <div className="text-sm text-slate-300" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-green-400" />
                    <span>CTR Tahmini: {displayData.prediction.estimated_ctr_range}</span>
                  </div>
                  <div className="text-xs text-slate-400">{displayData.prediction.comparison}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Results Tabs - Only show when we have results or demo */}
        {(showDemo || showResults) && (
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Eye size={16} />}>
              Genel Bakış
            </TabButton>
            <TabButton active={activeTab === 'faces'} onClick={() => setActiveTab('faces')} icon={<Users size={16} />}>
              Yüzler ({displayData.faces.face_count})
            </TabButton>
            <TabButton active={activeTab === 'vibe'} onClick={() => setActiveTab('vibe')} icon={<Sparkles size={16} />}>
              Vibe Analizi
            </TabButton>
            <TabButton active={activeTab === 'objects'} onClick={() => setActiveTab('objects')} icon={<Target size={16} />}>
              Objeler ({displayData.objects.object_count})
            </TabButton>
            <TabButton active={activeTab === 'heatmap'} onClick={() => setActiveTab('heatmap')} icon={<AlertCircle size={16} />}>
              Heatmap
            </TabButton>
          </div>

          {/* Tab Content */}
          <div className="text-white">
            {activeTab === 'overview' && <OverviewTab data={displayData} />}
            {activeTab === 'faces' && <FacesTab data={displayData.faces} />}
            {activeTab === 'vibe' && <VibeTab data={displayData.vibe} />}
            {activeTab === 'objects' && <ObjectsTab data={displayData.objects} image={displayImage} />}
            {activeTab === 'heatmap' && <HeatmapTab data={displayData.heatmap} image={displayImage} />}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, icon, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
      active
        ? 'bg-blue-500 text-white'
        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
    }`}
    style={{ fontFamily: 'Geist Sans, sans-serif' }}
  >
    {icon}
    {children}
  </button>
);

// Overview Tab
const OverviewTab = ({ data }) => (
  <div className="space-y-6">
    <div className="bg-slate-800/50 rounded-xl p-6">
      <h3 className="text-xl font-bold text-blue-400 mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        AI Geri Bildirimi
      </h3>
      <p className="text-slate-300 leading-relaxed" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
        {data.feedback}
      </p>
    </div>

    <div className="bg-slate-800/50 rounded-xl p-6">
      <h3 className="text-xl font-bold text-purple-400 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        Skor Dağılımı
      </h3>
      <div className="space-y-3">
        <ScoreBar label="Yüzler" value={data.score_breakdown.faces_contribution} />
        <ScoreBar label="Vibe" value={data.score_breakdown.vibe_contribution} />
        <ScoreBar label="Görsel" value={data.score_breakdown.visual_contribution} />
        <ScoreBar label="Objeler" value={data.score_breakdown.objects_contribution} />
        <ScoreBar label="Heatmap" value={data.score_breakdown.heatmap_contribution} />
      </div>
    </div>

    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
      <h3 className="text-xl font-bold text-green-400 mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        Viral Potansiyel
      </h3>
      <p className="text-2xl font-bold text-white capitalize" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
        {data.prediction.viral_potential}
      </p>
    </div>
  </div>
);

// Faces Tab
const FacesTab = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard label="Ortalama Mutluluk" value={`${data.summary.avg_mutluluk}%`} color="green" />
      <StatCard label="Ortalama Şaşkınlık" value={`${data.summary.avg_saskinlik}%`} color="blue" />
      <StatCard label="Ortalama Öfke" value={`${data.summary.avg_ofke}%`} color="red" />
    </div>

    {data.faces.map((face) => (
      <div key={face.id} className="bg-slate-800/50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-400 mb-4">
          Yüz #{face.id} - {face.size} - Baskın: {face.dominant_emotion}
        </h3>
        <div className="space-y-2">
          <EmotionBar label="Mutluluk" value={face.emotions.mutluluk} />
          <EmotionBar label="Şaşkınlık" value={face.emotions.saskinlik} />
          <EmotionBar label="Öfke" value={face.emotions.ofke} />
          <EmotionBar label="Korku" value={face.emotions.korku} />
          <EmotionBar label="Üzüntü" value={face.emotions.uzuntu} />
          <EmotionBar label="Nötr" value={face.emotions.notr} />
        </div>
        <div className="mt-4 text-sm text-slate-400">
          Göz Teması: {face.eye_contact ? '✅ Var' : '❌ Yok'}
        </div>
      </div>
    ))}
  </div>
);

// Vibe Tab
const VibeTab = ({ data }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 text-center">
      <h3 className="text-2xl font-bold text-purple-400 mb-2">Genel Vibe</h3>
      <p className="text-3xl font-bold text-white capitalize">{data.overall_vibe}</p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <VibeCard label="Merak Uyandırma" value={data.merak_uyandirma} />
      <VibeCard label="Kışkırtıcılık" value={data.kiskiricilik} />
      <VibeCard label="Gizem" value={data.gizem} />
      <VibeCard label="Aciliyet" value={data.aciliyet} />
      <VibeCard label="Güvenilirlik" value={data.guvenilirlik} />
      <VibeCard label="Duygusal Etki" value={data.duygusal_etki} />
    </div>
  </div>
);

// Objects Tab
const ObjectsTab = ({ data, image }) => {
  const [selectedObject, setSelectedObject] = React.useState(null);
  
  // Renk paleti - Her obje için farklı renk
  const colors = [
    'rgb(59, 130, 246)',  // blue
    'rgb(168, 85, 247)',  // purple
    'rgb(236, 72, 153)',  // pink
    'rgb(34, 197, 94)',   // green
    'rgb(251, 146, 60)',  // orange
  ];

  return (
    <div className="space-y-6">
      {/* Thumbnail with Bounding Boxes */}
      <div className="bg-slate-800/50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-blue-400 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Tespit Edilen Objeler
        </h3>
        <div className="relative inline-block">
          <img 
            src={image} 
            alt="Objects Detection" 
            className="w-full max-h-96 object-contain rounded-xl" 
          />
          {/* Bounding Boxes */}
          {data.objects.map((obj, idx) => {
            const isSelected = selectedObject === idx;
            const color = colors[idx % colors.length];
            
            return (
              <div
                key={idx}
                className="absolute border-4 cursor-pointer transition-all"
                style={{
                  left: `${obj.position.x}%`,
                  top: `${obj.position.y}%`,
                  width: `${obj.position.width}%`,
                  height: `${obj.position.height}%`,
                  borderColor: color,
                  backgroundColor: isSelected ? `${color.replace('rgb', 'rgba').replace(')', ', 0.2)')}` : 'transparent',
                  boxShadow: isSelected ? `0 0 20px ${color}` : 'none',
                }}
                onClick={() => setSelectedObject(isSelected ? null : idx)}
                onMouseEnter={() => setSelectedObject(idx)}
                onMouseLeave={() => setSelectedObject(null)}
              >
                {/* Label */}
                <div 
                  className="absolute -top-8 left-0 px-3 py-1 rounded text-xs font-bold text-white whitespace-nowrap"
                  style={{ 
                    backgroundColor: color,
                    fontFamily: 'Geist Sans, sans-serif'
                  }}
                >
                  {obj.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-400">
          Tespit Edilen Obje: <span className="text-white font-bold">{data.object_count}</span>
        </div>
        <div className="text-sm text-slate-400">
          Metin Overlay: {data.has_text_overlay ? '✅ Var' : '❌ Yok'}
        </div>
      </div>

      {/* Object Details */}
      {data.objects.map((obj, idx) => {
        const color = colors[idx % colors.length];
        
        return (
          <div 
            key={idx} 
            className="bg-slate-800/50 rounded-xl p-6 border-l-4 transition-all hover:bg-slate-800/70"
            style={{ borderColor: color }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-blue-400">{obj.name}</h3>
              <span className="text-sm text-slate-400">Güven: {obj.confidence}%</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Dikkat Skoru</p>
                <p className="text-2xl font-bold text-white">{obj.attention_score}/5</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Renk Dominantlığı</p>
                <p className="text-lg font-bold text-white">{obj.is_color_dominant ? '✅' : '❌'}</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Pozisyon: x:{obj.position.x}%, y:{obj.position.y}%, w:{obj.position.width}%, h:{obj.position.height}%
            </div>
          </div>
        );
      })}

      {/* Detected Text */}
      {data.detected_text.length > 0 && (
        <div className="bg-slate-800/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-purple-400 mb-3">Tespit Edilen Metinler</h3>
          <ul className="space-y-2">
            {data.detected_text.map((text, idx) => (
              <li key={idx} className="text-slate-300">• {text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Heatmap Tab
const HeatmapTab = ({ data, image }) => (
  <div className="space-y-6">
    <div className="relative">
      <img src={image} alt="Heatmap" className="w-full h-96 object-contain rounded-xl bg-slate-800" />
      {data.focus_points.map((point, idx) => (
        <div
          key={idx}
          className="absolute rounded-full border-2 border-red-500 pointer-events-none"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: `${point.radius}px`,
            height: `${point.radius}px`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: `rgba(255, 0, 0, ${point.intensity * 0.3})`,
          }}
        />
      ))}
    </div>

    <div className="bg-slate-800/50 rounded-xl p-6">
      <h3 className="text-lg font-bold text-red-400 mb-4">Odak Noktaları</h3>
      <div className="space-y-3">
        {data.focus_points.map((point, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-slate-300">{point.reason}</span>
            <span className="text-white font-bold">{Math.round(point.intensity * 100)}%</span>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-slate-800/50 rounded-xl p-6">
      <h3 className="text-lg font-bold text-blue-400 mb-4">Dikkat Akışı</h3>
      <div className="flex items-center gap-3">
        {data.attention_flow.map((flow, idx) => (
          <React.Fragment key={idx}>
            <span className="text-slate-300 bg-slate-700 px-4 py-2 rounded-lg">{flow}</span>
            {idx < data.attention_flow.length - 1 && <span className="text-blue-400">→</span>}
          </React.Fragment>
        ))}
      </div>
    </div>

    {data.dead_zones.length > 0 && (
      <div className="bg-slate-800/50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-yellow-400 mb-3">Ölü Bölgeler</h3>
        <p className="text-sm text-slate-400">{data.dead_zones.length} ölü bölge tespit edildi</p>
      </div>
    )}
  </div>
);

// Helper Components
const ScoreBar = ({ label, value }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm text-white font-bold">{value.toFixed(2)}%</span>
    </div>
    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
      <div className="h-full bg-blue-500" style={{ width: `${value}%` }} />
    </div>
  </div>
);

const EmotionBar = ({ label, value }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-sm text-white font-bold">{value}%</span>
    </div>
    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${value}%` }} />
    </div>
  </div>
);

const StatCard = ({ label, value, color }) => {
  const colorClasses = {
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    red: 'from-red-500/20 to-orange-500/20 border-red-500/30',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4 text-center`}>
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
};

const VibeCard = ({ label, value }) => (
  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
    <p className="text-sm text-slate-400 mb-2">{label}</p>
    <div className="flex items-center justify-center gap-1">
      {[...Array(5)].map((_, idx) => (
        <div
          key={idx}
          className={`w-3 h-3 rounded-full ${idx < value ? 'bg-purple-500' : 'bg-slate-700'}`}
        />
      ))}
    </div>
  </div>
);

export default AnalyzePage;
