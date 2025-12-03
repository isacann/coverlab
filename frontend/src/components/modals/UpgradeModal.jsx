import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Crown, Zap } from 'lucide-react';

const UpgradeModal = ({ isOpen, onClose, feature = 'bu \u00f6zellik' }) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate('/pricing');
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
            <Crown size={32} className="text-white" />
          </div>
          <DialogTitle className="text-2xl text-center" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            PRO'ya Yükselt
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-center" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
            {feature} sadece PRO üyeler için kullanılabilir.
          </DialogDescription>
        </DialogHeader>
        
        {/* Benefits List */}
        <div className="space-y-3 my-4">
          <div className="flex items-center gap-3 text-slate-300">
            <Zap size={20} className="text-blue-400" />
            <span style={{ fontFamily: 'Geist Sans, sans-serif' }}>Sınırsız AI Analiz</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <Zap size={20} className="text-blue-400" />
            <span style={{ fontFamily: 'Geist Sans, sans-serif' }}>Sınırsız A/B Test</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <Zap size={20} className="text-blue-400" />
            <span style={{ fontFamily: 'Geist Sans, sans-serif' }}>25 Kredi/Ay + Ekstra Paketler</span>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
            style={{ fontFamily: 'Geist Sans, sans-serif' }}
          >
            İptal
          </Button>
          <Button
            onClick={handleUpgrade}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            style={{ fontFamily: 'Geist Sans, sans-serif' }}
          >
            <Crown size={18} className="mr-2" />
            PRO'ya Geç
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
