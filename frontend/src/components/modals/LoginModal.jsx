import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Lock } from 'lucide-react';

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
            <Lock size={32} className="text-orange-500" />
          </div>
          <DialogTitle className="text-2xl text-center text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Giri\u015f Yapmal\u0131s\u0131n\u0131z
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-center" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
            Bu \u00f6zelli\u011fi kullanabilmek i\u00e7in giri\u015f yapman\u0131z gerekmektedir.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
            style={{ fontFamily: 'Geist Sans, sans-serif' }}
          >
            \u0130ptal
          </Button>
          <Button
            onClick={handleLogin}
            className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
            style={{ fontFamily: 'Geist Sans, sans-serif' }}
          >
            Giri\u015f Yap
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
