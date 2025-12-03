import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../contexts/AuthContext';
import AccessGuard from '../components/AccessGuard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Upload, Download, Wand2 } from 'lucide-react';

const formSchema = z.object({
  videoKonusu: z.string().min(10, 'En az 10 karakter gerekli'),
  videoBasligi: z.string().min(5, 'En az 5 karakter gerekli'),
  thumbnailYazisi: z.string().optional(),
  creatorStatus: z.boolean().optional(),
});

const CreatePage = () => {
  const { credits } = useAuth();
  const [referansGorsel, setReferansGorsel] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);

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

  const onSubmit = (data) => {
    // Check if user is logged in
    if (isGuest) {
      setShowLoginModal(true);
      return;
    }

    // Check if user has credits
    if (credits <= 0) {
      alert('Krediniz bitmi\u015f! L\u00fctfen kredi sat\u0131n al\u0131n.');
      return;
    }

    console.log('Form Data:', data);
    console.log('Referans G\u00f6rsel (Base64):', referansGorsel);
    // TODO: API call will be here
    
    // Mock: Set a generated image after submission
    setTimeout(() => {
      setGeneratedImage('https://via.placeholder.com/800x450/1e293b/06b6d4?text=Generated+Thumbnail');
    }, 1000);
  };

  const creatorStatus = watch('creatorStatus');

  return (
    <>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      
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
              {generatedImage ? (
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
        </div>
      </div>
    </div>
    </>
  );
};

export default CreatePage;