import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";

export default function ProGuard({ children }) {
  const { user, isPro, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-white text-xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Yükleniyor...
          </div>
        </div>
      </div>
    );
  }

  // 1. Not Logged In -> Redirect to Login
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-5xl">🔒</span>
          </div>
          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Giriş Yapmalısınız
          </h2>
          <p className="text-slate-400 text-lg" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
            Bu aracı kullanmak için hesabınıza giriş yapın.
          </p>
          <Button 
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-6 text-lg"
            style={{ fontFamily: 'Geist Sans, sans-serif' }}
          >
            Giriş Yap
          </Button>
        </div>
      </div>
    );
  }

  // 2. Logged In but FREE -> Show Paywall
  if (!isPro) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">
          <div className="relative overflow-hidden rounded-2xl border-2 border-blue-500/30 bg-slate-900 p-12 text-center shadow-2xl">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl -z-10"></div>
            
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Crown size={40} className="text-white" />
            </div>
            
            <h2 className="mb-4 text-4xl font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Pro Özellik
            </h2>
            
            <p className="mb-8 text-slate-300 text-lg leading-relaxed" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
              Bu analiz ve test araçları sadece <span className="text-blue-400 font-bold">PRO</span> plan üyelerine özeldir.
              <br />
              Hemen yükseltin ve viral olmaya başlayın.
            </p>
            
            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="text-blue-400 text-2xl mb-2">✨</div>
                <p className="text-white font-semibold mb-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Sınırsız Analiz</p>
                <p className="text-slate-400 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Tüm thumbnail'larınızı test edin</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="text-blue-400 text-2xl mb-2">💡</div>
                <p className="text-white font-semibold mb-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>A/B Test</p>
                <p className="text-slate-400 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Karşılaştırın ve seçin</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="text-blue-400 text-2xl mb-2">⚡</div>
                <p className="text-white font-semibold mb-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>25 Kredi/Ay</p>
                <p className="text-slate-400 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>+ Ekstra paket hakkı</p>
              </div>
            </div>
            
            <Button 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-12 py-6 text-lg shadow-lg shadow-blue-500/50"
              onClick={() => navigate("/pricing")}
              style={{ fontFamily: 'Geist Sans, sans-serif' }}
            >
              <Crown size={20} className="mr-2" />
              Pro'ya Yükselt (200₺/Ay)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Logged In and PRO -> Show Content
  return <>{children}</>;
}
