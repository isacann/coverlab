import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Lock, LogIn } from "lucide-react";

// Props:
// - requirePro (boolean): If true, user must have 'pro' plan. If false, just login is enough.
// - children: The page content to show (blurred) behind the lock.
export default function AccessGuard({ children, requirePro = false }) {
  const { user, isPro, loading } = useAuth();
  const navigate = useNavigate();

  // Helper to render the Lock Overlay
  const renderOverlay = (title, message, buttonText, onClick, icon) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* The Glass Backdrop */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
      
      {/* The Modal Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 p-8 text-center shadow-2xl ring-1 ring-white/20">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          {icon}
        </div>
        <h2 className="mb-3 text-2xl font-bold text-white tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {title}
        </h2>
        <p className="mb-8 text-slate-400 leading-relaxed" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
          {message}
        </p>
        <Button 
          onClick={onClick}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold h-12 text-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
          style={{ fontFamily: 'Geist Sans, sans-serif' }}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );

  // 1. Loading State (Keep generic)
  if (loading) return <div className="min-h-screen bg-slate-950" />;

  // 2. Decide if locked
  let isLocked = false;
  let lockContent = null;

  if (!user) {
    // LOCK: Not Logged In
    isLocked = true;
    lockContent = renderOverlay(
      "Giriş Yapmalısınız",
      "Bu aracı kullanmak ve harikalar yaratmak için ücretsiz hesabınıza giriş yapın.",
      "Google ile Giriş Yap",
      () => navigate("/login"),
      <LogIn size={32} />
    );
  } else if (requirePro && !isPro) {
    // LOCK: Logged In but Free Plan (and page requires Pro)
    isLocked = true;
    lockContent = renderOverlay(
      "Pro Özellik",
      "Bu gelişmiş analiz ve test araçları sadece PRO üyeler içindir. Rakiplerinizin önüne geçin.",
      "Pro'ya Yükselt (200₺)",
      () => navigate("/pricing"),
      <Lock size={32} />
    );
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* The Content (Blurred if locked) */}
      <div className={`transition-all duration-500 ${isLocked ? 'filter blur-lg pointer-events-none select-none opacity-50' : ''}`}>
        {children}
      </div>
      
      {/* The Overlay (Only if locked) */}
      {isLocked && lockContent}
    </div>
  );
}
