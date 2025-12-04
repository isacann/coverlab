import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Lock, LogIn } from "lucide-react";

export default function AccessGuard({ children, requirePro = false }) {
  const { user, isPro, loading } = useAuth();
  const navigate = useNavigate();

  // 1. Loading State - Show spinner instead of blank page
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
            Yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  // 2. Determine Lock Status
  let isLocked = false;
  let lockContent = null;

  if (!user) {
    // Guest User
    isLocked = true;
    lockContent = (
      <div className="text-center max-w-md p-8 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
          <LogIn size={28} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Giriş Yapmalısınız
        </h2>
        <p className="text-slate-400 mb-6 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
          Bu aracı kullanmak için ücretsiz hesabınıza giriş yapın.
        </p>
        <Button 
          onClick={() => navigate("/login")} 
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
          style={{ fontFamily: 'Geist Sans, sans-serif' }}
        >
          Google ile Giriş Yap
        </Button>
      </div>
    );
  } else if (requirePro && !isPro) {
    // Free User on Pro Page
    isLocked = true;
    lockContent = (
      <div className="text-center max-w-md p-8 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
          <Lock size={28} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Pro Özellik
        </h2>
        <p className="text-slate-400 mb-6 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
          Bu özellik sadece Pro üyeler içindir. Sınırları kaldırın.
        </p>
        <Button 
          onClick={() => navigate("/pricing")} 
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          style={{ fontFamily: 'Geist Sans, sans-serif' }}
        >
          Pro'ya Yükselt (200₺)
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full isolate">
      {/* THE CONTENT LAYER 
         - blur-sm: Light blur (frosted glass).
         - opacity-40: Faintly visible.
         - pointer-events-none: Strictly unclickable when locked.
         - select-none: Cannot copy text.
      */}
      <div className={`transition-all duration-500 ${isLocked ? 'filter blur-sm opacity-40 pointer-events-none select-none grayscale-[0.5]' : ''}`}>
        {children}
      </div>

      {/* THE LOCK OVERLAY LAYER 
         - absolute inset-0: Covers ONLY the parent div (the page), NOT the viewport/navbar.
         - z-10: Sits above the blurred content.
      */}
      {isLocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {lockContent}
        </div>
      )}
    </div>
  );
}
