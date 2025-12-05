import React from 'react';
import { Check, X, Lock, Zap, Crown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const PricingPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const isPro = profile?.subscription_plan === 'pro';

  const handleCheckout = (planType, stripeUrl) => {
    // Check if user is logged in
    if (!user?.id) {
      toast.error('Lütfen önce giriş yapın');
      navigate('/login');
      return;
    }

    // Add user ID to Stripe URL
    const checkoutUrl = `${stripeUrl}?client_reference_id=${user.id}`;
    
    // Redirect to Stripe
    window.location.href = checkoutUrl;
  };

  const features = {
    free: [
      { text: '5 Kredi (Tek Seferlik Tanımlanır)', available: true },
      { text: 'Temel Thumbnail Oluşturma', available: true },
      { text: 'AI Analiz & Skorlama', available: false },
      { text: 'YouTube Önizleme Testi', available: false },
      { text: 'Ekstra Kredi Satın Alma', available: false }
    ],
    pro: [
      { text: '+25 Kredi (Her Ay Yenilenir)', available: true, highlight: true },
      { text: 'Sınırsız AI Analiz & Skorlama', available: true, highlight: true },
      { text: 'Sınırsız YouTube Önizleme Testi', available: true, highlight: true },
      { text: 'Ekstra Kredi Satın Alma Hakkı', available: true },
      { text: 'AI Başlık ve Açıklama Önerileri', available: true }
    ]
  };

  const addonPackages = [
    { credits: 50, price: 299, badge: null },
    { credits: 100, price: 499, badge: 'Fırsat' },
    { credits: 200, price: 899, badge: 'En İyi Fiyat' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: 'url("https://customer-assets.emergentagent.com/job_326e649c-429d-481a-8bf3-c99e4276d28c/artifacts/bhrosu5k_8nNOHsP6PbEJMwWSth7Jb.png")',
        }}
      />

      {/* Content */}
      <div className="relative z-10 pt-24 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 
              className="text-5xl md:text-6xl font-bold text-white mb-4"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              Planını Seç, Viral Olmaya Başla.
            </h1>
            <p 
              className="text-xl text-slate-400 max-w-2xl mx-auto"
              style={{ fontFamily: 'Geist Sans, sans-serif' }}
            >
              İster deneyin, ister profesyonelleşin. İptal etmek serbest.
            </p>
          </div>

          {/* Main Plan Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {/* FREE PLAN - BAŞLANGIÇ */}
            <Card className="bg-slate-900 border-slate-700 relative">
              <CardHeader>
                <CardTitle 
                  className="text-2xl text-white mb-2"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  BAŞLANGIÇ
                </CardTitle>
                <CardDescription className="text-slate-400" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  Denemek için ideal
                </CardDescription>
                <div className="mt-6">
                  <div className="flex items-baseline gap-2">
                    <span 
                      className="text-5xl font-bold text-white"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    >
                      0 TL
                    </span>
                    <span 
                      className="text-slate-400 text-lg"
                      style={{ fontFamily: 'Geist Sans, sans-serif' }}
                    >
                      / Sonsuza Kadar
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-4">
                  {features.free.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {feature.available ? (
                        <Check size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X size={20} className="text-slate-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span 
                        className={`text-sm ${feature.available ? 'text-slate-300' : 'text-slate-600'}`}
                        style={{ fontFamily: 'Geist Sans, sans-serif' }}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full border-slate-600 text-white hover:bg-slate-800"
                  style={{ fontFamily: 'Geist Sans, sans-serif' }}
                >
                  Ücretsiz Başla
                </Button>
              </CardFooter>
            </Card>

            {/* PRO PLAN - HERO */}
            <Card className="bg-slate-900 border-2 border-blue-500 relative scale-105 shadow-2xl shadow-blue-500/20">
              {/* EN POPÜLER Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 text-xs font-bold border-0" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  <Crown size={14} className="mr-1" />
                  EN POPÜLER
                </Badge>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg blur-xl -z-10"></div>

              <CardHeader>
                <CardTitle 
                  className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  PRO COVERLAB
                </CardTitle>
                <CardDescription className="text-slate-400" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  Profesyoneller için tam paket
                </CardDescription>
                <div className="mt-6">
                  <div className="flex items-baseline gap-2">
                    <span 
                      className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    >
                      199 TL
                    </span>
                    <span 
                      className="text-slate-400 text-lg"
                      style={{ fontFamily: 'Geist Sans, sans-serif' }}
                    >
                      / Ay
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-4">
                  {features.pro.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                      <span 
                        className={`text-sm ${feature.highlight ? 'text-white font-semibold' : 'text-slate-300'}`}
                        style={{ fontFamily: 'Geist Sans, sans-serif' }}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/50"
                  style={{ fontFamily: 'Geist Sans, sans-serif' }}
                >
                  <Zap size={18} className="mr-2" />
                  Pro'ya Yükselt
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* ADD-ONS SECTION */}
          <div className="mt-20">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 
                className="text-3xl font-bold text-white mb-4"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                Ekstra Kredi Paketleri
              </h2>
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <Lock size={16} />
                <p className="text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  Sadece PRO üyeler satın alabilir.
                </p>
              </div>
            </div>

            {/* Add-on Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {addonPackages.map((pkg, idx) => (
                <Card key={idx} className="bg-slate-900 border-slate-700 relative">
                  {pkg.badge && (
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-orange-500 text-white text-xs font-bold border-0" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        {pkg.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center border-2 border-blue-500/30">
                      <Zap size={32} className="text-blue-400" />
                    </div>
                    <CardTitle 
                      className="text-3xl text-white mb-2"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    >
                      {pkg.credits} Kredi
                    </CardTitle>
                    <CardDescription 
                      className="text-2xl text-blue-400 font-bold"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    >
                      {pkg.price} TL
                    </CardDescription>
                  </CardHeader>

                  <CardFooter>
                    <Button 
                      variant="outline"
                      className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10"
                      style={{ fontFamily: 'Geist Sans, sans-serif' }}
                    >
                      Satın Al
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PricingPage;
