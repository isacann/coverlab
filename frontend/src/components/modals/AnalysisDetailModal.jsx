import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { X, Eye, Users, Sparkles, Target, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

const ProgressBar = ({ label, value, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    cyan: 'bg-cyan-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-white text-sm font-medium" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
          {label}
        </span>
        <span className={`font-bold text-sm ${color === 'blue' ? 'text-blue-400' : color === 'green' ? 'text-green-400' : color === 'purple' ? 'text-purple-400' : 'text-cyan-400'}`}>
          {typeof value === 'number' ? `${value.toFixed(1)}%` : value}
        </span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-700`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all text-xs ${active
      ? 'bg-blue-500 text-white'
      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
      }`}
    style={{ fontFamily: 'Geist Sans, sans-serif' }}
  >
    {icon}
    {children}
  </button>
);

const AnalysisDetailModal = ({ analysis, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!analysis) return null;

  // Helper to parse JSONB that might come as string
  const parseJsonField = (field) => {
    if (!field) return {};
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch (e) {
        console.error('Failed to parse JSON field:', e);
        return {};
      }
    }
    return field;
  };

  // Debug log
  console.log('📊 Analysis data:', analysis);
  console.log('📊 Type of faces_data:', typeof analysis.faces_data);

  // Use direct column values from Supabase
  const thumbnail = analysis.input_image_url || 'https://via.placeholder.com/400x225';
  const title = analysis.input_title || 'Untitled';
  const score = analysis.ai_score || 0;
  const label = score >= 90 ? 'Mükemmel' : score >= 70 ? 'Çok İyi' : score >= 50 ? 'İyi' : 'Geliştirilmeli';
  const feedback = analysis.ai_feedback || 'Analiz verisi bulunamadı.';

  // JSONB columns from Supabase (with parse fallback)
  const facesData = parseJsonField(analysis.faces_data);
  const vibeData = parseJsonField(analysis.vibe_data);
  const objectsData = parseJsonField(analysis.objects_data);
  const heatmapData = parseJsonField(analysis.heatmap_data);
  const scoreBreakdown = parseJsonField(analysis.score_breakdown);
  const prediction = parseJsonField(analysis.performance_prediction);

  // Debug individual data
  console.log('👤 Faces:', facesData);
  console.log('✨ Vibe:', vibeData);
  console.log('🎯 Objects:', objectsData);
  console.log('🔥 Heatmap:', heatmapData);
  console.log('📈 Score Breakdown:', scoreBreakdown);

  // Counts
  const faceCount = facesData.face_count || facesData.faces?.length || 0;
  const objectCount = objectsData.object_count || objectsData.objects?.length || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full h-[90vh] bg-slate-900 border-slate-700 p-0 overflow-hidden">
        <div className="flex h-full min-h-0">
          {/* LEFT: Image Section (35%) */}
          <div className="w-[35%] bg-black flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-800">
              <h3 className="text-white text-sm font-bold truncate max-w-[200px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </Button>
            </div>

            {/* Image - Full width, proper aspect ratio */}
            <div className="flex-1 flex items-center justify-center p-4 bg-slate-950">
              {/* Image wrapper for proper overlay positioning */}
              <div className="relative inline-block max-w-full max-h-full">
                <img
                  src={thumbnail}
                  alt={title}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />

                {/* Heatmap Points Overlay - positioned relative to image */}
                {activeTab === 'heatmap' && heatmapData.focus_points && heatmapData.focus_points.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {heatmapData.focus_points.map((point, idx) => (
                      <div
                        key={idx}
                        className="absolute flex items-center justify-center"
                        style={{
                          left: `${point.x}%`,
                          top: `${point.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        {/* Outer glow - bigger for better visibility */}
                        <div
                          className="absolute rounded-full animate-pulse"
                          style={{
                            width: `${50 + (point.intensity * 30)}px`,
                            height: `${50 + (point.intensity * 30)}px`,
                            background: `radial-gradient(circle, rgba(255,0,0,${point.intensity * 0.5}) 0%, rgba(255,0,0,0) 70%)`
                          }}
                        />
                        {/* Inner circle - bigger with stronger border for visibility on red backgrounds */}
                        <div
                          className="rounded-full border-3 border-white bg-red-500/60 flex items-center justify-center shadow-lg"
                          style={{
                            width: '32px',
                            height: '32px',
                            borderWidth: '3px',
                            boxShadow: '0 0 10px rgba(0,0,0,0.5), 0 0 20px rgba(255,0,0,0.5)'
                          }}
                        >
                          <span className="text-white text-xs font-bold drop-shadow-md">{idx + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Data Dashboard (65%) */}
          <div className="w-[65%] bg-slate-900 flex flex-col min-h-0 overflow-hidden">
            {/* Score Section - Ultra Compact */}
            <div className="p-2 border-b border-slate-800 flex items-center justify-center gap-4">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {score}
              </div>
              <div className="flex-1 max-w-[200px]">
                <p className="text-sm text-blue-400 font-bold mb-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  {label}
                </p>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Tabs - No horizontal scroll, compact */}
            <div className="flex gap-1 p-3 border-b border-slate-800 flex-wrap">
              <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Eye size={12} />}>
                Genel
              </TabButton>
              <TabButton active={activeTab === 'faces'} onClick={() => setActiveTab('faces')} icon={<Users size={12} />}>
                Yüzler ({faceCount})
              </TabButton>
              <TabButton active={activeTab === 'vibe'} onClick={() => setActiveTab('vibe')} icon={<Sparkles size={12} />}>
                Vibe
              </TabButton>
              <TabButton active={activeTab === 'objects'} onClick={() => setActiveTab('objects')} icon={<Target size={12} />}>
                Objeler ({objectCount})
              </TabButton>
              <TabButton active={activeTab === 'heatmap'} onClick={() => setActiveTab('heatmap')} icon={<AlertCircle size={12} />}>
                Heatmap
              </TabButton>
            </div>

            {/* Tab Content - Scrollable */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* AI Feedback */}
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                    <h4 className="text-sm font-bold text-cyan-400 mb-2">AI Geri Bildirimi</h4>
                    <p className="text-slate-300 text-xs leading-relaxed">{feedback}</p>
                  </div>

                  {/* Score Breakdown */}
                  {scoreBreakdown && Object.keys(scoreBreakdown).length > 0 && (
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                      <h4 className="text-sm font-bold text-purple-400 mb-3">Skor Dağılımı</h4>
                      <div className="space-y-2">
                        {scoreBreakdown.faces_contribution !== undefined && (
                          <ProgressBar label="Yüzler" value={scoreBreakdown.faces_contribution} color="blue" />
                        )}
                        {scoreBreakdown.vibe_contribution !== undefined && (
                          <ProgressBar label="Vibe" value={scoreBreakdown.vibe_contribution} color="purple" />
                        )}
                        {scoreBreakdown.visual_contribution !== undefined && (
                          <ProgressBar label="Görsel" value={scoreBreakdown.visual_contribution} color="cyan" />
                        )}
                        {scoreBreakdown.objects_contribution !== undefined && (
                          <ProgressBar label="Objeler" value={scoreBreakdown.objects_contribution} color="green" />
                        )}
                        {scoreBreakdown.heatmap_contribution !== undefined && (
                          <ProgressBar label="Heatmap" value={scoreBreakdown.heatmap_contribution} color="blue" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Viral Potential */}
                  {prediction && prediction.viral_potential && (
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-3">
                      <h4 className="text-sm font-bold text-green-400 mb-1">Viral Potansiyel</h4>
                      <p className="text-xl font-bold text-white capitalize">{prediction.viral_potential}</p>
                      {prediction.estimated_ctr_range && (
                        <p className="text-xs text-slate-300 mt-1">CTR: {prediction.estimated_ctr_range}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Faces Tab */}
              {activeTab === 'faces' && (
                <div className="space-y-4">
                  {facesData.summary && (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-center">
                        <p className="text-xs text-slate-400">Mutluluk</p>
                        <p className="text-lg font-bold text-white">{facesData.summary.avg_mutluluk || 0}%</p>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 text-center">
                        <p className="text-xs text-slate-400">Şaşkınlık</p>
                        <p className="text-lg font-bold text-white">{facesData.summary.avg_saskinlik || 0}%</p>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-center">
                        <p className="text-xs text-slate-400">Öfke</p>
                        <p className="text-lg font-bold text-white">{facesData.summary.avg_ofke || 0}%</p>
                      </div>
                    </div>
                  )}

                  {facesData.faces && facesData.faces.map((face, idx) => (
                    <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                      <h4 className="text-sm font-bold text-blue-400 mb-2">
                        Yüz #{face.id || idx + 1} • {face.size || 'Orta'} • {face.dominant_emotion || 'Nötr'}
                      </h4>
                      <div className="space-y-1">
                        {face.emotions && Object.entries(face.emotions).map(([emotion, value]) => (
                          <ProgressBar key={emotion} label={emotion} value={value} color="blue" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        Göz Teması: {face.eye_contact ? '✅' : '❌'}
                      </p>
                    </div>
                  ))}

                  {(!facesData.faces || facesData.faces.length === 0) && !facesData.summary && (
                    <p className="text-slate-400 text-center py-6 text-sm">Yüz verisi bulunamadı</p>
                  )}
                </div>
              )}

              {/* Vibe Tab */}
              {activeTab === 'vibe' && (
                <div className="space-y-4">
                  {vibeData.overall_vibe && (
                    <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-purple-300">Genel Vibe</p>
                      <p className="text-xl font-bold text-white capitalize">{vibeData.overall_vibe}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {vibeData.merak_uyandirma !== undefined && (
                      <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
                        <p className="text-xs text-slate-400">Merak</p>
                        <p className="text-2xl font-bold text-cyan-400">{vibeData.merak_uyandirma}/5</p>
                      </div>
                    )}
                    {vibeData.kiskiricilik !== undefined && (
                      <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
                        <p className="text-xs text-slate-400">Kışkırtıcılık</p>
                        <p className="text-2xl font-bold text-cyan-400">{vibeData.kiskiricilik}/5</p>
                      </div>
                    )}
                    {vibeData.gizem !== undefined && (
                      <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
                        <p className="text-xs text-slate-400">Gizem</p>
                        <p className="text-2xl font-bold text-cyan-400">{vibeData.gizem}/5</p>
                      </div>
                    )}
                    {vibeData.aciliyet !== undefined && (
                      <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
                        <p className="text-xs text-slate-400">Aciliyet</p>
                        <p className="text-2xl font-bold text-cyan-400">{vibeData.aciliyet}/5</p>
                      </div>
                    )}
                    {vibeData.guvenilirlik !== undefined && (
                      <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
                        <p className="text-xs text-slate-400">Güvenilirlik</p>
                        <p className="text-2xl font-bold text-cyan-400">{vibeData.guvenilirlik}/5</p>
                      </div>
                    )}
                    {vibeData.duygusal_etki !== undefined && (
                      <div className="bg-slate-800/50 rounded-lg p-3 text-center border border-slate-700">
                        <p className="text-xs text-slate-400">Duygusal Etki</p>
                        <p className="text-2xl font-bold text-cyan-400">{vibeData.duygusal_etki}/5</p>
                      </div>
                    )}
                  </div>

                  {Object.keys(vibeData).length === 0 && (
                    <p className="text-slate-400 text-center py-6 text-sm">Vibe verisi bulunamadı</p>
                  )}
                </div>
              )}

              {/* Objects Tab */}
              {activeTab === 'objects' && (
                <div className="space-y-3">
                  {objectsData.objects && objectsData.objects.map((obj, idx) => (
                    <div key={idx} className="bg-slate-800/50 rounded-lg p-3 border-l-4 border-blue-500">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-blue-400">{obj.name}</h4>
                        <span className="text-xs text-slate-400">{obj.confidence}%</span>
                      </div>
                      <div className="flex gap-4 text-xs">
                        <span className="text-slate-400">Dikkat: <span className="text-white font-bold">{obj.attention_score}/5</span></span>
                        <span className="text-slate-400">Dominant: {obj.is_color_dominant ? '✅' : '❌'}</span>
                      </div>
                    </div>
                  ))}

                  {(!objectsData.objects || objectsData.objects.length === 0) && (
                    <p className="text-slate-400 text-center py-6 text-sm">Obje verisi bulunamadı</p>
                  )}
                </div>
              )}

              {/* Heatmap Tab */}
              {activeTab === 'heatmap' && (
                <div className="space-y-4">
                  {/* Focus Points */}
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                    <h4 className="text-sm font-bold text-red-400 mb-3">Odak Noktaları</h4>
                    <div className="space-y-2">
                      {heatmapData.focus_points && heatmapData.focus_points.map((point, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-white">{point.reason || 'Belirsiz'}</span>
                          <span className="text-slate-400">%{Math.round((point.intensity || 0) * 100)}</span>
                        </div>
                      ))}
                      {(!heatmapData.focus_points || heatmapData.focus_points.length === 0) && (
                        <p className="text-slate-400 text-sm">Odak noktası bulunamadı</p>
                      )}
                    </div>
                  </div>

                  {/* Attention Flow */}
                  {heatmapData.attention_flow && heatmapData.attention_flow.length > 0 && (
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                      <h4 className="text-sm font-bold text-blue-400 mb-2">Dikkat Akışı</h4>
                      <div className="flex flex-wrap gap-1">
                        {heatmapData.attention_flow.map((item, idx) => (
                          <span key={idx} className="bg-blue-500/20 border border-blue-500/30 rounded px-2 py-0.5 text-blue-300 text-xs">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!heatmapData.focus_points || heatmapData.focus_points.length === 0) &&
                    (!heatmapData.attention_flow || heatmapData.attention_flow.length === 0) && (
                      <p className="text-slate-400 text-center py-6 text-sm">Heatmap verisi bulunamadı</p>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDetailModal;
