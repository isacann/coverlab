import React, { useState } from 'react';
import { Upload, Sparkles, Loader2, Eye, Smile, Box, Flame, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AccessGuard from '../components/AccessGuard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { compressImageToBlob } from '../utils/imageHelpers';

const DEMO_IMAGE = "https://customer-assets.emergentagent.com/job_youclicker/artifacts/los4urqh_6vd279giuweb1.jpg";

const DEMO_DATA = {
  score: { value: 67, label: "Orta" },
  feedback: "Teknik olarak güzel bir çalışma. Renk kontrastı ve yüz ifadeleri dikkat çekici.",
  faces: {
    faces: [
      {
        position: { x: 36, y: 18, width: 28, height: 40 },
        emotions: { mutluluk: 5, saskinlik: 15, ofke: 10, notr: 65 },
        dominant_emotion: "notr"
      }
    ]
  },
  vibe: {
    merak_uyandirma: 5,
    kiskiricilik: 5,
    gizem: 3,
    aciliyet: 4
  },
  objects: {
    objects: [
      { name: "insan", confidence: 99, position: { x: 10, y: 14, width: 50, height: 86 } },
      { name: "yazi_paneli", confidence: 95, position: { x: 55, y: 10, width: 40, height: 30 } }
    ]
  },
  heatmap: {
    focus_points: [
      { x: 50, y: 30, intensity: 1.0, radius: 50, reason: "yüz merkezi" },
      { x: 75, y: 20, intensity: 0.9, radius: 60, reason: "metin alanı" }
    ]
  },
  prediction: {
    estimated_ctr_range: "9-13%",
    viral_potential: "Yüksek"
  }
};

const AnalyzePage = () => {
  const { user } = useAuth();
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('faces');
  const [advancedMode, setAdvancedMode] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile || !selectedFile.type.startsWith('image/')) {
      alert('Lütfen geçerli bir resim dosyası seçin');
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setTitle('');
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!file || !title.trim() || !user?.id) {
      alert('Lütfen resim, başlık ve giriş kontrolü yapın');
      return;
    }

    setIsAnalyzing(true);

    try {
      const compressedBlob = await compressImageToBlob(file);
      
      const formData = new FormData();
      formData.append('file', compressedBlob, 'thumbnail.jpg');
      formData.append('title', title.trim());
      formData.append('user_id', user.id);

      const response = await fetch('https://n8n.getoperiqo.com/webhook/49b88d43-fdf3-43c8-bfc4-70c30528f370', {
        method: 'POST',
        body: formData,
      });

      const rawJson = await response.json();
      console.log('📦 Raw response:', rawJson);

      // CRITICAL FIX: n8n returns an array, extract first element
      const json = Array.isArray(rawJson) ? rawJson[0] : rawJson;
      console.log('📦 Extracted json:', json);

      if (json.success === false || !json.data) {
        alert(`Hata: ${json.error || 'Analiz başarısız'}`);
        return;
      }

      console.log('✅ Analysis data:', json.data);
      setResult(json.data);
      alert('Analiz tamamlandı! 🎉');

    } catch (error) {
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
    setActiveTab('faces');
    setAdvancedMode(false);
  };

  const displayImage = preview || DEMO_IMAGE;
  const displayData = result || DEMO_DATA;
  const showDemo = !file && !result;

  const getHeatmapColor = (intensity) => {
    if (intensity >= 0.8) return 'rgba(239, 68, 68, 0.6)';
    if (intensity >= 0.5) return 'rgba(251, 191, 36, 0.5)';
    return 'rgba(59, 130, 246, 0.4)';
  };

  const ProgressBar = ({ label, value }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-white font-medium text-sm">{label}</span>
        <span className="font-bold text-blue-400">{value}%</span>
      </div>
      <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
        <div className="h-full bg-blue-500 transition-all duration-700" style={{ width: `${value}%` }} />
      </div>
    </div>
  );

  const renderDots = (count) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((dot) => (
        <div key={dot} className={`w-4 h-4 rounded-full ${dot <= count ? 'bg-purple-500' : 'bg-slate-700'}`} />
      ))}
    </div>
  );

  return (
    <AccessGuard requirePro={true}>
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{ backgroundImage: 'url("https://customer-assets.emergentagent.com/job_326e649c-429d-481a-8bf3-c99e4276d28c/artifacts/bhrosu5k_8nNOHsP6PbEJMwWSth7Jb.png")' }} />

        <div className="relative z-10 pt-24 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-3">
                <Sparkles className="inline mr-3 text-purple-500" size={48} />
                Thumbnail Analizi
              </h1>
              <p className="text-slate-400 text-lg">AI destekli CTR tahmini, yüz analizi ve heatmap</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT */}
              <div>
                <div className="relative rounded-2xl overflow-hidden border-4 border-purple-500/30 mb-4">
                  <img src={displayImage} alt="Thumbnail" className="w-full aspect-video object-cover" />
                  
                  {/* Heatmap Overlay */}
                  {activeTab === 'heatmap' && displayData.heatmap?.focus_points?.map((point, idx) => (
                    <div
                      key={idx}
                      className="absolute rounded-full animate-pulse pointer-events-none"
                      style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        width: `${point.radius * 2}px`,
                        height: `${point.radius * 2}px`,
                        transform: 'translate(-50%, -50%)',
                        background: `radial-gradient(circle, ${getHeatmapColor(point.intensity)}, transparent)`,
                        mixBlendMode: 'hard-light',
                        filter: 'blur(8px)',
                      }}
                      title={point.reason}
                    />
                  ))}

                  {/* Advanced Mode: Bounding Boxes */}
                  {advancedMode && (
                    <>
                      {displayData.faces?.faces?.map((face, idx) => face.position && (
                        <div key={`face-${idx}`} className="absolute border-2 border-purple-400 pointer-events-none" style={{ left: `${face.position.x}%`, top: `${face.position.y}%`, width: `${face.position.width}%`, height: `${face.position.height}%` }}>
                          <div className="absolute -top-6 left-0 bg-purple-500 text-white text-xs px-2 py-0.5 rounded">{face.dominant_emotion}</div>
                        </div>
                      ))}
                      {displayData.objects?.objects?.map((obj, idx) => obj.position && (
                        <div key={`obj-${idx}`} className="absolute border-2 border-cyan-400 pointer-events-none" style={{ left: `${obj.position.x}%`, top: `${obj.position.y}%`, width: `${obj.position.width}%`, height: `${obj.position.height}%` }}>
                          <div className="absolute -top-6 left-0 bg-cyan-500 text-white text-xs px-2 py-0.5 rounded">{obj.name}</div>
                        </div>
                      ))}
                    </>
                  )}
                  
                  <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {showDemo ? 'DEMO' : result ? 'SONUÇ' : 'UPLOAD'}
                  </div>
                </div>

                {(result || showDemo) && (
                  <label className="flex items-center gap-3 cursor-pointer bg-slate-900/50 p-3 rounded-lg hover:bg-slate-800/50 transition-all mb-4">
                    <input type="checkbox" checked={advancedMode} onChange={(e) => setAdvancedMode(e.target.checked)} className="w-5 h-5" />
                    <div>
                      <span className="text-white font-semibold">Gelişmiş Mod</span>
                      <p className="text-slate-400 text-xs">Yüz ve nesne kutucuklarını göster</p>
                    </div>
                  </label>
                )}

                {!file && !result && (
                  <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center hover:border-purple-500 transition-all cursor-pointer bg-slate-900/50" onClick={() => document.getElementById('fileInput').click()}>
                    <input id="fileInput" type="file" accept="image/*" onChange={(e) => handleFileSelect(e.target.files[0])} className="hidden" />
                    <Upload size={48} className="mx-auto mb-4 text-slate-400" />
                    <p className="text-white font-semibold mb-2">Kendi Thumbnail'ınızı Yükleyin</p>
                    <p className="text-slate-400 text-sm">Tıklayın veya sürükleyip bırakın</p>
                  </div>
                )}

                {file && !result && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white font-semibold mb-2 block">Video Başlığı *</Label>
                      <Input type="text" placeholder="Örn: MrBeast'in En İlginç Videosu!" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-slate-900 border-slate-700 text-white h-12" />
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleAnalyze} disabled={isAnalyzing || !title.trim()} className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin" size={20} />Analiz Ediliyor...</> : <><Sparkles className="mr-2" size={20} />Analiz Et</>}
                      </Button>
                      <Button onClick={resetDemo} variant="outline" className="h-12 border-slate-700 text-slate-300 hover:bg-slate-800">İptal</Button>
                    </div>
                  </div>
                )}

                {result && (
                  <div className="space-y-4">
                    {result.feedback && (
                      <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30 p-4">
                        <div className="flex items-start gap-3">
                          <Sparkles size={24} className="text-purple-400 flex-shrink-0 mt-1" />
                          <div>
                            <h4 className="text-white font-bold mb-2">💬 AI Yorumu</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">{result.feedback}</p>
                          </div>
                        </div>
                      </Card>
                    )}
                    {result.prediction && (
                      <Card className="bg-slate-800/50 border-slate-700 p-4">
                        <h4 className="text-white font-bold mb-3 flex items-center gap-2"><BarChart3 size={20} className="text-cyan-400" />📊 CTR Tahmini</h4>
                        <div className="space-y-2">
                          {result.prediction.estimated_ctr_range && (
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 text-sm">Tahmini Aralık:</span>
                              <span className="text-cyan-400 font-bold text-lg">{result.prediction.estimated_ctr_range}</span>
                            </div>
                          )}
                          {result.prediction.viral_potential && (
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400 text-sm">Viral Potansiyel:</span>
                              <span className="text-green-400 font-bold">{result.prediction.viral_potential}</span>
                            </div>
                          )}
                        </div>
                      </Card>
                    )}
                    <Button onClick={resetDemo} className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-white">Yeni Analiz</Button>
                  </div>
                )}
              </div>

              {/* RIGHT */}
              <div>
                <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 p-6">
                  {!isAnalyzing ? (
                    <>
                      <div className="text-center mb-8 pb-6 border-b border-slate-800">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mb-4">
                          <span className="text-5xl font-bold text-white">{displayData.score?.value || 0}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{displayData.score?.label || 'Analiz Ediliyor'}</h3>
                        <p className="text-slate-400">CTR Tahmini</p>
                        {displayData.prediction?.estimated_ctr_range && <p className="text-cyan-400 font-semibold text-lg mt-2">{displayData.prediction.estimated_ctr_range}</p>}
                      </div>

                      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4 bg-slate-800 p-1 rounded-lg mb-6">
                          <TabsTrigger value="faces" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-slate-400 text-xs"><Smile size={14} className="mr-1" />Yüzler</TabsTrigger>
                          <TabsTrigger value="vibe" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-slate-400 text-xs"><Flame size={14} className="mr-1" />Vibe</TabsTrigger>
                          <TabsTrigger value="objects" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-slate-400 text-xs"><Box size={14} className="mr-1" />Nesneler</TabsTrigger>
                          <TabsTrigger value="heatmap" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-slate-400 text-xs"><Eye size={14} className="mr-1" />Isı</TabsTrigger>
                        </TabsList>

                        <TabsContent value="faces" className="space-y-4">
                          {displayData.faces?.faces && displayData.faces.faces.length > 0 ? (
                            displayData.faces.faces.map((face, idx) => (
                              <div key={idx} className="space-y-4">
                                {face.emotions?.mutluluk !== undefined && <ProgressBar label="😊 Mutluluk" value={face.emotions.mutluluk} />}
                                {face.emotions?.saskinlik !== undefined && <ProgressBar label="😲 Şaşkınlık" value={face.emotions.saskinlik} />}
                                {face.emotions?.ofke !== undefined && <ProgressBar label="😠 Öfke" value={face.emotions.ofke} />}
                                {face.emotions?.notr !== undefined && <ProgressBar label="😐 Nötr" value={face.emotions.notr} />}
                                {face.dominant_emotion && (
                                  <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
                                    <span className="text-slate-400 text-sm">Baskın Duygu: </span>
                                    <span className="text-purple-300 font-bold capitalize">{face.dominant_emotion}</span>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8"><Smile size={48} className="mx-auto mb-3 text-slate-600" /><p className="text-slate-400">Yüz tespit edilmedi</p></div>
                          )}
                        </TabsContent>

                        <TabsContent value="vibe" className="space-y-4">
                          {displayData.vibe && Object.keys(displayData.vibe).length > 0 ? (
                            <>
                              {displayData.vibe.merak_uyandirma !== undefined && <div className="flex justify-between items-center py-2"><span className="text-white font-medium">🔍 Merak Uyandırma</span>{renderDots(displayData.vibe.merak_uyandirma)}</div>}
                              {displayData.vibe.kiskiricilik !== undefined && <div className="flex justify-between items-center py-2"><span className="text-white font-medium">⚡ Kışkırtıcılık</span>{renderDots(displayData.vibe.kiskiricilik)}</div>}
                              {displayData.vibe.gizem !== undefined && <div className="flex justify-between items-center py-2"><span className="text-white font-medium">🎭 Gizem</span>{renderDots(displayData.vibe.gizem)}</div>}
                              {displayData.vibe.aciliyet !== undefined && <div className="flex justify-between items-center py-2"><span className="text-white font-medium">⏰ Aciliyet</span>{renderDots(displayData.vibe.aciliyet)}</div>}
                            </>
                          ) : (
                            <div className="text-center py-8"><Flame size={48} className="mx-auto mb-3 text-slate-600" /><p className="text-slate-400">Vibe verisi mevcut değil</p></div>
                          )}
                        </TabsContent>

                        <TabsContent value="objects" className="space-y-4">
                          {displayData.objects?.objects && displayData.objects.objects.length > 0 ? (
                            displayData.objects.objects.slice(0, 5).map((obj, idx) => (
                              <div key={idx} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-white font-medium text-sm">📦 {obj.name.charAt(0).toUpperCase() + obj.name.slice(1).replace(/_/g, ' ')}</span>
                                  <span className="font-bold text-cyan-400">{obj.confidence}%</span>
                                </div>
                                <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                  <div className="h-full bg-cyan-500 transition-all duration-700" style={{ width: `${obj.confidence}%` }} />
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8"><Box size={48} className="mx-auto mb-3 text-slate-600" /><p className="text-slate-400">Nesne tespit edilmedi</p></div>
                          )}
                        </TabsContent>

                        <TabsContent value="heatmap" className="space-y-4">
                          <div className="text-center py-8">
                            <Eye size={48} className="mx-auto mb-4 text-purple-400" />
                            <h4 className="text-xl font-bold text-white mb-3">🔥 Isı Haritası</h4>
                            <p className="text-slate-400 text-sm mb-6">Sol taraftaki thumbnail üzerinde dikkat çekme bölgelerini görebilirsiniz</p>
                            <div className="space-y-3 max-w-xs mx-auto text-left">
                              <div className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-red-500/40 border-2 border-red-500"></div><span className="text-white text-sm">Yüksek Dikkat (&gt;80%)</span></div>
                              <div className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-yellow-500/40 border-2 border-yellow-500"></div><span className="text-white text-sm">Orta Dikkat (50-80%)</span></div>
                              <div className="flex items-center gap-3"><div className="w-6 h-6 rounded-full bg-blue-500/40 border-2 border-blue-500"></div><span className="text-white text-sm">Düşük Dikkat (&lt;50%)</span></div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </>
                  ) : (
                    <div className="text-center py-20">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mb-6 animate-pulse"><Loader2 size={40} className="text-white animate-spin" /></div>
                      <h3 className="text-2xl font-bold text-white mb-3">Yapay Zeka ile Analiz Ediliyor...</h3>
                      <p className="text-slate-400 max-w-sm mx-auto mb-6">Thumbnail'ınız detaylı olarak inceleniyor</p>
                      <div className="space-y-3 text-left max-w-md mx-auto">
                        <div className="flex items-center gap-3 text-slate-300"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div><span className="text-sm">Görsel işleniyor...</span></div>
                        <div className="flex items-center gap-3 text-slate-300"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div><span className="text-sm">Yüz ve nesne analizi yapılıyor...</span></div>
                        <div className="flex items-center gap-3 text-slate-300"><div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div><span className="text-sm">CTR tahmini hesaplanıyor...</span></div>
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