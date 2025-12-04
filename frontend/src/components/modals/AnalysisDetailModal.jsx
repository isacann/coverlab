import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { X, Flame } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';

const AnalysisDetailModal = ({ analysis, isOpen, onClose }) => {
  const [showHeatmap, setShowHeatmap] = useState(false);

  if (!analysis) return null;

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
              <h3 className="text-white text-lg font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {analysis.title}
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
                src={analysis.thumbnail} 
                alt={analysis.title}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Heatmap Overlay */}
              {showHeatmap && analysis.heatmap_data && (
                <div className="absolute inset-0 pointer-events-none">
                  {analysis.heatmap_data.map((point, idx) => (
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
                {analysis.score}/100
              </div>
              <p className="text-xl text-blue-400 font-bold" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                {analysis.rating}
              </p>
              <div className="h-6 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700 mt-4 mx-auto max-w-md">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 shadow-lg shadow-blue-500/50"
                  style={{ width: `${analysis.score}%` }}
                />
              </div>
            </div>

            {/* Faces Data */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Yüz Analizi
              </h4>
              <div className="space-y-4">
                {analysis.faces_data?.map((face, idx) => (
                  <ProgressBar key={idx} label={face.label} value={face.value} color="blue" />
                ))}
              </div>
            </div>

            {/* Vibe Data */}
            <div className="mb-8">
              <h4 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Vibe & Etki
              </h4>
              <div className="space-y-4">
                {analysis.vibe_data?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <span className="text-white font-medium" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                      {item.label}
                    </span>
                    {renderDots(item.value)}
                  </div>
                ))}
              </div>
            </div>

            {/* Objects Data */}
            <div>
              <h4 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Algılanan Nesneler
              </h4>
              <div className="space-y-4">
                {analysis.objects_data?.map((obj, idx) => (
                  <ProgressBar key={idx} label={obj.label} value={obj.value} color="green" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDetailModal;
