import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { X, Flame } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';

const AnalysisDetailModal = ({ analysis, isOpen, onClose }) => {
  const [showHeatmap, setShowHeatmap] = useState(false);

  if (!analysis) return null;

  // Parse analysis_data (real Supabase format)
  const data = analysis.analysis_data || {};
  const thumbnail = analysis.thumbnail_url || data.input_image_url || 'https://via.placeholder.com/400x225';
  const title = analysis.title || data.input_title || 'Untitled';
  const score = data.score?.value || 0;
  const label = data.score?.label || 'N/A';
  const feedback = data.feedback || 'Analiz verisi bulunamadı.';
  
  // Convert faces data to array format
  const facesData = data.faces?.summary ? [
    { label: 'Mutluluk', value: data.faces.summary.avg_mutluluk || 0 },
    { label: 'Şaşkınlık', value: data.faces.summary.avg_saskinlik || 0 },
    { label: 'Öfke', value: data.faces.summary.avg_ofke || 0 }
  ] : [];
  
  // Convert vibe data
  const vibeData = data.vibe ? [
    { label: 'Merak', value: (data.vibe.merak_uyandirma || 0) * 20 },
    { label: 'Kışkırtıcılık', value: (data.vibe.kiskiricilik || 0) * 20 },
    { label: 'Gizem', value: (data.vibe.gizem || 0) * 20 },
    { label: 'Aciliyet', value: (data.vibe.aciliyet || 0) * 20 },
    { label: 'Güvenilirlik', value: (data.vibe.guvenilirlik || 0) * 20 }
  ] : [];
  
  // Heatmap data
  const heatmapData = data.heatmap?.focus_points || [];

  // Convert objects data
  const objectsData = data.objects?.objects ? data.objects.objects.map(obj => ({
    label: obj.name,
    value: obj.confidence
  })) : [];

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

  const ProgressBar = ({ label, value, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      cyan: 'bg-cyan-500'
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
            className={`h-full ${colorClasses[color]} transition-all duration-700 ease-out shadow-lg`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] bg-slate-900 border-slate-700 p-0 overflow-hidden">
        <div className="flex h-full">
          {/* LEFT: Image Section (40%) */}
          <div className="w-[40%] bg-black p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-bold truncate" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Image with Heatmap */}
            <div className="relative flex-1 flex items-center justify-center bg-slate-950 rounded-lg overflow-hidden">
              <img 
                src={thumbnail} 
                alt={title}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Heatmap Overlay */}
              {showHeatmap && heatmapData.length > 0 && (
                <div className="absolute inset-0 pointer-events-none">
                  {heatmapData.map((point, idx) => (
                    <div
                      key={idx}
                      className="absolute"
                      style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        transform: 'translate(-50%, -50%)',
                        width: `${point.radius || 100}px`,
                        height: `${point.radius || 100}px`,
                        background: `radial-gradient(circle, rgba(255,0,0,${point.intensity || 0.6}) 0%, rgba(255,0,0,0) 70%)`,
                        filter: 'blur(40px)',
                        mixBlendMode: 'screen'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Heatmap Toggle */}
            <Button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`mt-4 w-full ${showHeatmap ? 'bg-orange-500 hover:bg-orange-600' : 'bg-slate-700 hover:bg-slate-600'} text-white`}
              style={{ fontFamily: 'Geist Sans, sans-serif' }}
            >
              <Flame size={16} className="mr-2" />
              {showHeatmap ? 'Isı Haritasını Gizle' : 'Isı Haritasını Göster'}
            </Button>
          </div>

          {/* RIGHT: Data Dashboard (60%) */}
          <div className="w-[60%] bg-slate-900 p-6 overflow-y-auto">
            {/* Score */}
            <div className="mb-8 text-center">
              <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {score}
              </div>
              <p className="text-xl text-blue-400 font-bold" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                {label}
              </p>
              <div className="h-6 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700 mt-4 mx-auto max-w-md">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 shadow-lg shadow-blue-500/50"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            {/* AI Feedback */}
            <div className="mb-8 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <h4 className="text-lg font-bold text-cyan-400 mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                AI Geri Bildirimi
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                {feedback}
              </p>
            </div>

            {/* Faces Data */}
            {facesData.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Yüz Analizi
                </h4>
                <div className="space-y-4">
                  {facesData.map((face, idx) => (
                    <ProgressBar key={idx} label={face.label} value={face.value} color="blue" />
                  ))}
                </div>
              </div>
            )}

            {/* Vibe Data */}
            {vibeData.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Vibe & Etki
                </h4>
                <div className="space-y-4">
                  {vibeData.map((item, idx) => (
                    <ProgressBar key={idx} label={item.label} value={item.value} color="cyan" />
                  ))}
                </div>
                {data.vibe?.overall_vibe && (
                  <div className="mt-4 bg-purple-500/20 border border-purple-500/30 rounded-lg p-3 text-center">
                    <p className="text-purple-300 text-sm font-semibold">
                      Genel Vibe: <span className="text-white capitalize">{data.vibe.overall_vibe}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Objects Data */}
            {objectsData.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Algılanan Nesneler
                </h4>
                <div className="space-y-4">
                  {objectsData.map((obj, idx) => (
                    <ProgressBar key={idx} label={obj.label} value={obj.value} color="green" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDetailModal;
