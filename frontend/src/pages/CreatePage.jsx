import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccessGuard from '../components/AccessGuard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Card } from '../components/ui/card';
import { Upload, Download, Wand2, Eye, ArrowRight, AlertTriangle, RefreshCw, RotateCcw, Copy } from 'lucide-react';
import { convertFileToBase64, formatFileSize } from '../utils/imageHelpers';
import toast, { Toaster } from 'react-hot-toast';
import Confetti from 'react-confetti';

// Mock Recent Generations
const mockRecentGenerations = [
  { id: 1, thumbnail: 'https://picsum.photos/seed/gen1/400/225', title: 'İstanbul Vlog Kapağı', date: '2 saat önce' },
  { id: 2, thumbnail: 'https://picsum.photos/seed/gen2/400/225', title: 'Tech Review 2024', date: '5 saat önce' },
  { id: 3, thumbnail: 'https://picsum.photos/seed/gen3/400/225', title: 'Gaming Montaj', date: '1 gün önce' },
  { id: 4, thumbnail: 'https://picsum.photos/seed/gen4/400/225', title: 'Yemek Tarifi', date: '2 gün önce' },
];

const CreatePage = () => {
  const { credits, user, setProfile } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [thumbText, setThumbText] = useState('');
  const [extraRequest, setExtraRequest] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isCreator, setIsCreator] = useState(false);

  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isTemporary, setIsTemporary] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      console.log('File selected:', file.name);
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsCreator(false);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Validation
    if (!topic.trim() || !title.trim()) {
      toast.error('Lütfen zorunlu alanları doldurun');
      return;
    }

    if (credits <= 0) {
      toast.error('Krediniz bitmiş! Lütfen kredi satın alın.');
      return;
    }

    console.log('✅ Submission started...');

    setIsGenerating(true);
    setGeneratedImage(null);
    setIsTemporary(false);
    setAiSuggestions(null);
    setShowConfetti(false);

    try {
      // Step 2: Convert image to base64 if exists
      let base64String = null;
      if (selectedFile) {
        console.log('🖼️ Converting and compressing image...');
        base64String = await convertFileToBase64(selectedFile);
        console.log('✅ Image converted (length:', base64String?.length, ')');
      }

      // Step 3: Construct payload
      const payload = {
        user_id: user?.id || 'anonymous',
        topic: topic,
        title: title,
        thumbnail_text: thumbText.trim() || null,
        extra: extraRequest.trim() || null,
        reference: base64String || null,
        creator_status: isCreator ? 'true' : 'false'
      };

      // Step 4: API Call (NO TIMEOUT - Let it run as long as needed)
      console.log('🚀 Sending payload:', {
        ...payload,
        reference: payload.reference ? `[BASE64 STRING: ${payload.reference.substring(0, 50)}...]` : null
      });
      console.log('⏳ Waiting for response (may take 60-90 seconds)...');

      let response;
      let data;

      try {
        response = await fetch('https://n8n.getoperiqo.com/webhook/abb2e2e0-d8f4-486d-b89d-a63cc331e122', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          // NO timeout specified - browser default (usually 5+ minutes)
        });

        console.log('📡 Response received! Status:', response.status);

      } catch (fetchError) {
        console.error('❌ Network error during fetch:', fetchError);
        throw new Error('Network hatası. İnternet bağlantınızı kontrol edin.');
      }

      // Step 5: Check HTTP status
      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
        } catch (e) {
          errorText = 'Bilinmeyen hata';
        }
        console.error('❌ HTTP Error:', response.status, errorText);
        throw new Error(`Sunucu hatası (${response.status})`);
      }

      // Step 6: Parse JSON response
      try {
        data = await response.json();
        console.log('✅ Response parsed:', data);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error('Sunucu yanıtı okunamadı');
      }

      // Step 7: Handle response scenarios

      // --- SCENARIO A: ERROR ---
      if (data.status === 'error') {
        // Safely extract error message (handle nested objects)
        let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
        
        if (typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (data.message && typeof data.message === 'object') {
          // Handle Turkish nested objects like {baslik: "...", aciklama: "..."}
          if (data.message.aciklama) {
            errorMessage = data.message.aciklama;
          } else if (data.message.baslik) {
            errorMessage = data.message.baslik;
          } else {
            errorMessage = JSON.stringify(data.message);
          }
        }
        
        toast.error(errorMessage);
        console.error('❌ API Error:', data);
        return;
      }

      // --- SCENARIO B: SUCCESS (Partial or Full) ---
      if (data.status === 'success') {
        // 1. Set the generated image
        const imageUrl = data.image_url || data.imageUrl || data.thumbnail || data.url;
        
        if (!imageUrl) {
          toast.error('Görsel URL alınamadı');
          console.error('❌ No image URL in success response');
          return;
        }

        setGeneratedImage(imageUrl);
        console.log('🖼️ Image URL set:', imageUrl);

        // 2. Decrement credits (Visual update)
        setProfile((prev) => ({
          ...prev,
          credits: Math.max(0, (prev?.credits || 0) - 1)
        }));
        console.log('💰 Credits decremented');

        // 3. Handle AI Suggestions (if present) - SAFELY PARSE
        if (data.ai_suggestions) {
          try {
            // Parse if it's a JSON string, otherwise use as-is
            const suggestions = typeof data.ai_suggestions === 'string' 
              ? JSON.parse(data.ai_suggestions) 
              : data.ai_suggestions;
            setAiSuggestions(suggestions);
            console.log('💡 AI suggestions received:', suggestions);
          } catch (e) {
            console.error('Failed to parse AI suggestions:', e);
            setAiSuggestions(null);
          }
        }

        // 4. Check Temporary Status
        if (data.is_temporary === true) {
          // Safely extract message
          const messageText = typeof data.message === 'string' 
            ? data.message 
            : '⚠️ Geçici görsel oluşturuldu. Hemen indirin!';

          toast(messageText, {
            icon: '⚠️',
            duration: 6000,
            style: {
              background: '#f59e0b',
              color: '#fff',
            },
          });
          setIsTemporary(true);
          console.log('⚠️ Temporary image generated');
        } else {
          // Full success - Permanent link
          const messageText = typeof data.message === 'string' 
            ? data.message 
            : '✅ Thumbnail başarıyla oluşturuldu!';

          toast.success(messageText);
          setIsTemporary(false);
          
          // Trigger confetti celebration
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
          console.log('🎉 Permanent image generated - Confetti!');
        }
      } else {
        // Unknown status
        toast.error('Bilinmeyen yanıt formatı');
        console.error('❌ Unknown response status:', data);
      }

    } catch (error) {
      console.error('❌ Error during submission:', error);
      
      // User-friendly error message
      const errorMessage = error.message || 'Beklenmeyen bir hata oluştu';
      toast.error(errorMessage);
      
    } finally {
      setIsGenerating(false);
      console.log('🏁 Generation process completed');
    }
  };

  return (
    <AccessGuard requirePro={false}>
      <Toaster position="top-center" reverseOrder={false} />
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      <div className="min-h-screen relative overflow-hidden bg-slate-950">
        {/* Background Image */}
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
              {/* Left Column - Form */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Video Konusu (Required) */}
                  <div>
                    <Label htmlFor="topic" className="text-white text-sm font-medium mb-2 block" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                      Videonuz ne hakkında? <span className="text-red-400">*</span>
                    </Label>
                    <Textarea
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Örn: Video içerisinde İstanbuldan otostop ile yola çıkıp 0tl ile dünya turu yapmaya çalışıyorum"
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px] resize-none"
                      style={{ fontFamily: 'Geist Sans, sans-serif' }}
                      required
                    />
                  </div>

                  {/* Video Başlığı (Required) */}
                  <div>
                    <Label htmlFor="title" className="text-white text-sm font-medium mb-2 block" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                      Video Başlığınız? <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Örn: 0TL ile Dünya turuna çıktım"
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                      style={{ fontFamily: 'Geist Sans, sans-serif' }}
                      required
                    />
                  </div>

                  {/* Thumbnail Yazısı (Optional) */}
                  <div>
                    <Label htmlFor="thumbText" className="text-white text-sm font-medium mb-2 block" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                      Thumbnail Üzerindeki Yazı (Opsiyonel)
                    </Label>
                    <Input
                      id="thumbText"
                      value={thumbText}
                      onChange={(e) => setThumbText(e.target.value)}
                      placeholder="Boş bırakırsanız Yapay Zeka karar verir."
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                      style={{ fontFamily: 'Geist Sans, sans-serif' }}
                    />
                  </div>

                  {/* Ekstra İstek (Optional) */}
                  <div>
                    <Label htmlFor="extra" className="text-white text-sm font-medium mb-2 block" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                      Ekstra belirtmek istediğiniz bir istek (Opsiyonel)
                    </Label>
                    <Textarea
                      id="extra"
                      value={extraRequest}
                      onChange={(e) => setExtraRequest(e.target.value)}
                      placeholder="Örn: Arka planda mavi gökyüzü olsun, daha renkli olsun vb."
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 min-h-[80px] resize-none"
                      style={{ fontFamily: 'Geist Sans, sans-serif' }}
                    />
                  </div>

                  {/* Referans Görsel Upload */}
                  <div>
                    <Label htmlFor="imageFile" className="text-white text-sm font-medium mb-2 block" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                      Referans Görsel Yükle (Yüz/Stil)
                    </Label>
                    
                    {!previewUrl ? (
                      <div className="relative">
                        <input
                          id="imageFile"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="imageFile"
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
                            src={previewUrl} 
                            alt="Preview" 
                            className="w-full h-auto max-h-64 object-contain rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold"
                            style={{ fontFamily: 'Geist Sans, sans-serif' }}
                          >
                            Kaldır
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Creator Checkbox - Only show if file uploaded */}
                  {selectedFile && (
                    <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/40 to-slate-700/40 p-5 rounded-xl border border-slate-600/50">
                      <div className="flex-1">
                        <Label htmlFor="creatorCheck" className="text-white text-sm font-semibold block mb-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                          Görseldeki kişi benim
                        </Label>
                        <p className="text-slate-400 text-xs" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                          Yüzünüzü koruyarak thumbnail oluştur
                        </p>
                      </div>
                      <Switch
                        id="creatorCheck"
                        checked={isCreator}
                        onCheckedChange={setIsCreator}
                        className="data-[state=checked]:bg-cyan-500"
                      />
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  >
                    <Wand2 className="mr-2" size={20} />
                    {isGenerating ? 'Oluşturuluyor...' : 'Thumbnail Oluştur'}
                  </Button>
                </form>
              </div>

              {/* Right Column - Preview */}
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
                    {/* Temporary Badge */}
                    {isTemporary && (
                      <div className="bg-orange-500/20 border border-orange-500 rounded-lg p-4 flex items-start gap-3">
                        <AlertTriangle className="text-orange-400 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                          <p className="text-orange-200 font-semibold text-sm mb-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                            ⚠️ Geçici Link
                          </p>
                          <p className="text-orange-300 text-xs" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                            Bu görsel yakında silinecek. Hemen indirin!
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="relative">
                      <img 
                        src={generatedImage} 
                        alt="Generated Thumbnail" 
                        className="w-full rounded-lg shadow-2xl"
                      />
                      {isTemporary && (
                        <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <AlertTriangle size={12} />
                          Geçici
                        </div>
                      )}
                    </div>

                    {/* AI Suggestions */}
                    {aiSuggestions && (
                      <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
                        <p className="text-blue-200 font-semibold text-sm mb-2" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                          💡 AI Önerileri
                        </p>
                        <p className="text-blue-300 text-xs" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                          {aiSuggestions}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = generatedImage;
                        link.download = 'thumbnail.jpg';
                        link.click();
                        if (isTemporary) {
                          toast.success('Görsel indirildi! ✅');
                        }
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-lg font-semibold"
                      style={{ fontFamily: 'Geist Sans, sans-serif' }}
                    >
                      <Download className="mr-2" size={20} />
                      {isTemporary ? 'Hemen İndir ⚠️' : 'İndir'}
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
