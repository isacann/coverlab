import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccessGuard from '../components/AccessGuard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Card } from '../components/ui/card';
import { Upload, Download, Wand2, ArrowRight, Eye } from 'lucide-react';

// Mock Recent Generations
const mockRecentGenerations = [
  { id: 1, thumbnail: 'https://picsum.photos/seed/gen1/400/225', title: 'İstanbul Vlog Kapağı', date: '2 saat önce' },
  { id: 2, thumbnail: 'https://picsum.photos/seed/gen2/400/225', title: 'Tech Review 2024', date: '5 saat önce' },
  { id: 3, thumbnail: 'https://picsum.photos/seed/gen3/400/225', title: 'Gaming Montaj', date: '1 gün önce' },
  { id: 4, thumbnail: 'https://picsum.photos/seed/gen4/400/225', title: 'Yemek Tarifi', date: '2 gün önce' },
];

const formSchema = z.object({
  videoKonusu: z.string().min(10, 'En az 10 karakter gerekli'),
  videoBasligi: z.string().min(5, 'En az 5 karakter gerekli'),
  thumbnailYazisi: z.string().optional(),
  ekstraIstek: z.string().optional(),
  creatorStatus: z.boolean().optional(),
});

const CreatePage = () => {
  const { credits, user } = useAuth();
  const navigate = useNavigate();
  const [referansGorsel, setReferansGorsel] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoKonusu: '',
      videoBasligi: '',
      thumbnailYazisi: '',
      ekstraIstek: '',
      creatorStatus: false,
    },
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setReferansGorsel(base64String);
        setPreviewImage(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    // Check if user has credits
    if (credits <= 0) {
      alert('Krediniz bitmiş! Lütfen kredi satın alın.');
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      // Prepare webhook payload
      const payload = {
        userId: user?.id || null,
        videoKonusu: data.videoKonusu,
        videoBasligi: data.videoBasligi,
        thumbnailYazisi: data.thumbnailYazisi || null,
        ekstraIstek: data.ekstraIstek || null,
        referansGorsel: referansGorsel || null,
        creatorStatus: data.creatorStatus || false
      };

      console.log('🚀 Sending to n8n webhook:', payload);

      // Call n8n webhook
      const response = await fetch('https://n8n.getoperiqo.com/webhook/abb2e2e0-d8f4-486d-b89d-a63cc331e122', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'cors'
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Webhook error:', errorText);
        throw new Error(`Webhook failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Webhook response:', result);

      // Set generated image from response
      if (result.imageUrl || result.image_url || result.thumbnail) {
        setGeneratedImage(result.imageUrl || result.image_url || result.thumbnail);
        alert('Thumbnail başarıyla oluşturuldu!');
      } else {
        console.warn('⚠️ No image URL in response:', result);
        alert('Thumbnail oluşturuldu ancak görsel alınamadı.');
      }

    } catch (error) {
      console.error('❌ Error:', error);
      alert('Bir hata oluştu: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const creatorStatus = watch('creatorStatus');

  return (
    <AccessGuard requirePro={false}>
      <div className="min-h-screen relative overflow-hidden bg-slate-950">
        {/* Background Image - Same as Hero */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://customer-assets.emergentagent.com/job_326e649c-429d-481a-8bf3-c99e4276d28c/artifacts/bhrosu5k_8nNOHsP6PbEJMwWSth7Jb.png")',
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 
              className="text-4xl md:text-5xl font-bold text-white mb-3"
              style={{ 
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)'
              }}
            >
              Thumbnail Oluştur
            </h1>
            <p 
              className="text-slate-300 text-lg"
              style={{ 
                fontFamily: 'Geist Sans, sans-serif',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
              }}
            >
              Yapay zeka ile profesyonel YouTube kapağı tasarlayın
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Controls */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Video Konusu */}
                <div>
                  <Label htmlFor="videoKonusu" className="text-white text-sm font-medium mb-2 block" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    Videonuz ne hakkında?
                  </Label>
                  <Textarea
                    id="videoKonusu"
                    {...register('videoKonusu')}
                    placeholder="Örn: Video içerisinde İstanbuldan otostop ile yola çıkıp 0tl ile dünya turu yapmaya çalışıyorum"
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px] resize-none"
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  />
                  {errors.videoKonusu && (
                    <p className="text-red-400 text-sm mt-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>{errors.videoKonusu.message}</p>
                  )}
                </div>

                {/* Video Başlığı */}
                <div>
                  <Label htmlFor="videoBasligi" className="text-white text-sm font-medium mb-2 block" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    Video Başlığınız?
                  </Label>
                  <Input
                    id="videoBasligi"
                    {...register('videoBasligi')}
                    placeholder="Örn: 0TL ile Dünya turuna çıktım"
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  />
                  {errors.videoBasligi && (
                    <p className="text-red-400 text-sm mt-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>{errors.videoBasligi.message}</p>
                  )}
                </div>

                {/* Thumbnail Yazısı */}
                <div>
                  <Label htmlFor="thumbnailYazisi" className="text-white text-sm font-medium mb-2 block" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    Thumbnail Üzerindeki Yazı (Opsiyonel)
                  </Label>
                  <Input
                    id="thumbnailYazisi"
                    {...register('thumbnailYazisi')}
                    placeholder="Boş bırakırsanız Yapay Zeka karar verir."
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  />
                </div>

                {/* Ekstra İstek */}
                <div>
                  <Label htmlFor="ekstraIstek" className="text-white text-sm font-medium mb-2 block" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    Ekstra belirtmek istediğiniz bir istek (Opsiyonel)
                  </Label>
                  <Textarea
                    id="ekstraIstek"
                    {...register('ekstraIstek')}
                    placeholder="Örn: Arka planda mavi gökyüzü olsun, daha renkli olsun vb."
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 min-h-[80px] resize-none"
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  />
                </div>

                {/* Referans Görsel Upload */}
                <div>
                  <Label htmlFor="referansGorsel" className="text-white text-sm font-medium mb-2 block" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    Referans Görsel Yükle (Yüz/Stil)
                  </Label>
                  
                  {!previewImage ? (
                    <div className="relative">
                      <input
                        id="referansGorsel"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="referansGorsel"
                        className="flex flex-col items-center justify-center gap-3 bg-slate-800/50 border-2 border-dashed border-slate-600 hover:border-cyan-500 rounded-lg p-8 cursor-pointer transition-all hover:bg-slate-800/70"
                      >
                        <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center">
                          <Upload size={28} className="text-cyan-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-slate-300 font-medium mb-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                            Görsel Yükle
                          </p>
                          <p className="text-slate-500 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                            PNG, JPG veya JPEG (Max 10MB)
                          </p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative group bg-slate-800/50 rounded-lg p-4 border-2 border-slate-600">
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="w-full h-auto max-h-64 object-contain rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <label
                            htmlFor="referansGorsel"
                            className="cursor-pointer bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors shadow-lg"
                            style={{ fontFamily: 'Geist Sans, sans-serif' }}
                          >
                            Görseli Değiştir
                          </label>
                        </div>
                        <input
                          id="referansGorsel"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                      <p className="text-slate-400 text-xs text-center" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        Görseli değiştirmek için üzerine gelin
                      </p>
                    </div>
                  )}
                </div>

                {/* Creator Status - Only show if file uploaded */}
                {referansGorsel && (
                  <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/40 to-slate-700/40 p-5 rounded-xl border border-slate-600/50">
                    <div className="flex-1">
                      <Label htmlFor="creatorStatus" className="text-white text-sm font-semibold block mb-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        Görseldeki kişi benim
                      </Label>
                      <p className="text-slate-400 text-xs" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        Yüzünüzü koruyarak thumbnail oluştur
                      </p>
                    </div>
                    <Switch
                      id="creatorStatus"
                      checked={creatorStatus}
                      onCheckedChange={(checked) => setValue('creatorStatus', checked)}
                      className="data-[state=checked]:bg-cyan-500"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 text-lg font-semibold"
                  style={{ fontFamily: 'Geist Sans, sans-serif' }}
                >
                  <Wand2 className="mr-2" size={20} />
                  Thumbnail Oluştur
                </Button>
              </form>
            </div>

            {/* Right Column - Preview Canvas */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center min-h-[600px]">
              {isGenerating ? (
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Wand2 size={32} className="text-cyan-400 animate-pulse" />
                    </div>
                  </div>
                  <h3 
                    className="text-2xl font-bold text-white mb-3 animate-pulse"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    Thumbnail Oluşturuluyor...
                  </h3>
                  <p 
                    className="text-slate-400 mb-4"
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  >
                    Yapay zeka sizin için çalışıyor
                  </p>
                  <div className="flex justify-center gap-1">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="w-full space-y-6">
                  <div className="relative">
                    <img 
                      src={generatedImage} 
                      alt="Generated Thumbnail" 
                      className="w-full rounded-lg shadow-2xl"
                    />
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-lg font-semibold"
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  >
                    <Download className="mr-2" size={20} />
                    İndir
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-slate-800/50 rounded-full flex items-center justify-center">
                    <Wand2 size={40} className="text-slate-500" />
                  </div>
                  <h3 
                    className="text-xl font-semibold text-slate-300 mb-2"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    Önizleme Bekleniyor
                  </h3>
                  <p 
                    className="text-slate-500"
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  >
                    Formu doldurun ve oluştur butonuna tıklayın
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Work Section */}
          {mockRecentGenerations.length > 0 && (
            <div className="mt-16">
              <div className="flex justify-between items-center mb-6">
                <h2 
                  className="text-2xl md:text-3xl font-bold text-white"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  Son Çalışmalar
                </h2>
                <Button
                  onClick={() => navigate('/lab')}
                  variant="ghost"
                  className="text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/50"
                  style={{ fontFamily: 'Geist Sans, sans-serif' }}
                >
                  Tümünü Gör
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>

              {/* Horizontal Scrolling Cards */}
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
                {mockRecentGenerations.map((gen) => (
                  <Card 
                    key={gen.id}
                    className="flex-shrink-0 w-[320px] bg-slate-900/50 backdrop-blur-sm border-slate-700/50 overflow-hidden cursor-pointer group hover:border-cyan-500 transition-all"
                    onClick={() => setLightboxImage(gen.thumbnail)}
                  >
                    <div className="relative">
                      <img src={gen.thumbnail} alt={gen.title} className="w-full aspect-video object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-full">
                          <Eye size={20} />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-1 truncate" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        {gen.title}
                      </h3>
                      <p className="text-slate-500 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        {gen.date}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Lightbox */}
          {lightboxImage && (
            <div 
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setLightboxImage(null)}
            >
              <img src={lightboxImage} alt="Preview" className="max-w-full max-h-full rounded-lg" />
            </div>
          )}
        </div>
      </div>
    </div>
    </AccessGuard>
  );
};

export default CreatePage;