import React, { useState, useMemo } from 'react';
import { Video, Sparkles, Mic, MicOff, Loader2, Zap, Search, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AccessGuard from '../components/AccessGuard';
import VideoStatusModal from '../components/modals/VideoStatusModal';

// Duration options with credit costs (6 credits per 30 seconds)
const DURATION_OPTIONS = [
    { value: 30, label: '30 saniye', credits: 6 },
    { value: 60, label: '1 dakika', credits: 12 },
    { value: 120, label: '2 dakika', credits: 24 },
    { value: 180, label: '3 dakika', credits: 36 },
    { value: 240, label: '4 dakika', credits: 48 },
    { value: 300, label: '5 dakika', credits: 60 },
    { value: 360, label: '6 dakika', credits: 72 },
    { value: 420, label: '7 dakika', credits: 84 },
    { value: 480, label: '8 dakika', credits: 96 },
    { value: 540, label: '9 dakika', credits: 108 },
    { value: 600, label: '10 dakika', credits: 120 },
    { value: 660, label: '11 dakika', credits: 132 },
    { value: 720, label: '12 dakika', credits: 144 },
];

// Language options for narrator
const LANGUAGE_OPTIONS = [
    { value: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { value: 'ru', label: 'Русский', flag: '🇷🇺' },
];

const WEBHOOK_URL_TOPIC = 'https://n8n.getoperiqo.com/webhook/93a2fb2c-8d7a-4686-b09e-5225f426c01e';
const WEBHOOK_URL_KEYWORD = 'https://n8n.getoperiqo.com/webhook/7198ca53-553f-458d-81e8-e94a47f23f2b';

const AIVideoPage = () => {
    const { user, credits } = useAuth();
    const navigate = useNavigate();

    // Form state
    const [creationMode, setCreationMode] = useState('topic'); // 'topic' or 'keyword'
    const [topic, setTopic] = useState('');
    const [keyword1, setKeyword1] = useState('');
    const [keyword2, setKeyword2] = useState('');
    const [keyword3, setKeyword3] = useState('');
    const [duration, setDuration] = useState(60); // Default 1 minute
    const [hasNarrator, setHasNarrator] = useState(false);
    const [language, setLanguage] = useState('tr');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [apiResponse, setApiResponse] = useState(null); // n8n response: { status, message, video_url? }

    // Calculate required credits based on selected duration and mode
    // Keyword mode costs +4 extra credits (for YouTube research)
    const requiredCredits = useMemo(() => {
        const option = DURATION_OPTIONS.find(opt => opt.value === duration);
        const baseCredits = option ? option.credits : 0;
        return creationMode === 'keyword' ? baseCredits + 4 : baseCredits;
    }, [duration, creationMode]);

    // Check if user has enough credits
    const hasEnoughCredits = credits >= requiredCredits;

    // Handle form submission
    const handleGenerate = async () => {
        // Validation based on creation mode
        if (creationMode === 'topic') {
            if (!topic.trim()) {
                setError('Lütfen bir video konusu girin.');
                return;
            }
        } else {
            // Keyword mode
            if (!keyword1.trim() || !keyword2.trim() || !keyword3.trim()) {
                setError('Lütfen 3 anahtar kelime girin.');
                return;
            }
        }

        if (!user?.id) {
            setError('Lütfen önce giriş yapın.');
            return;
        }

        if (!hasEnoughCredits) {
            setError(`Yetersiz kredi. Bu video için ${requiredCredits} kredi gerekiyor.`);
            return;
        }

        setError('');
        setIsGenerating(true);
        setApiResponse(null); // Reset previous response

        try {
            let payload;
            let webhookUrl;

            if (creationMode === 'topic') {
                // Topic mode payload
                payload = {
                    user_id: user.id,
                    konu: topic.trim(),
                    sure: duration,
                    kredi: requiredCredits,
                    anlatici: hasNarrator,
                    dil: hasNarrator ? language : null
                };
                webhookUrl = WEBHOOK_URL_TOPIC;
            } else {
                // Keyword mode payload
                payload = {
                    user_id: user.id,
                    anahtarkelime1: keyword1.trim(),
                    anahtarkelime2: keyword2.trim(),
                    anahtarkelime3: keyword3.trim(),
                    sure: duration,
                    kredi: requiredCredits,
                    anlatici: hasNarrator,
                    dil: hasNarrator ? language : null
                };
                webhookUrl = WEBHOOK_URL_KEYWORD;
            }

            console.log(`🎬 Sending ${creationMode} video request:`, payload);

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log('📬 n8n response:', data);

            // Handle n8n response
            if (data.status === 'success') {
                setApiResponse({
                    status: 'success',
                    message: data.message || 'Video başarıyla oluşturuldu!',
                    video_url: data.video_url || null
                });
                // Open status modal for success
                setShowStatusModal(true);
                // Reset form based on mode
                if (creationMode === 'topic') {
                    setTopic('');
                } else {
                    setKeyword1('');
                    setKeyword2('');
                    setKeyword3('');
                }
            } else if (data.status === 'error') {
                setApiResponse({
                    status: 'error',
                    message: data.message || 'Video oluşturulurken bir hata oluştu.'
                });
            }

        } catch (err) {
            console.error('❌ Video generation error:', err);
            setApiResponse({
                status: 'error',
                message: 'Bağlantı hatası. Lütfen tekrar deneyin.'
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <AccessGuard>
            <div className="min-h-screen bg-[#0a0a0a] pt-24 relative overflow-hidden">
                {/* Background Image - Full page cover */}
                <div
                    className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'url("/ai-video-bg.png")' }}
                />
                {/* Dark overlay for readability */}
                <div className="fixed inset-0 bg-[#0a0a0a]/60 pointer-events-none" />
                {/* Purple/pink gradient for atmosphere */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />

                <div className="max-w-4xl mx-auto px-6 py-12 relative">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse" />
                            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-5 rounded-full">
                                <Video size={40} className="text-white" />
                            </div>
                            <Sparkles size={20} className="absolute -top-1 -right-1 text-yellow-400 animate-bounce" />
                        </div>

                        <h1
                            className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400"
                            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                        >
                            AI Video Oluşturucu
                        </h1>
                        <p
                            className="text-slate-400 text-lg"
                            style={{ fontFamily: 'Geist Sans, sans-serif' }}
                        >
                            Konunuzu yazın, yapay zeka muhteşem bir video oluştursun
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">

                        {/* Mode Selector Tabs */}
                        <div className="flex mb-6 bg-slate-800/50 rounded-xl p-1">
                            <button
                                onClick={() => setCreationMode('topic')}
                                disabled={isGenerating}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${creationMode === 'topic'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                    }`}
                                style={{ fontFamily: 'Geist Sans, sans-serif' }}
                            >
                                <FileText size={18} />
                                Konu Gir
                            </button>
                            <button
                                onClick={() => setCreationMode('keyword')}
                                disabled={isGenerating}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${creationMode === 'keyword'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                    }`}
                                style={{ fontFamily: 'Geist Sans, sans-serif' }}
                            >
                                <Search size={18} />
                                Anahtar Kelime
                            </button>
                        </div>

                        {/* Topic Input - shown when mode is 'topic' */}
                        {creationMode === 'topic' && (
                            <div className="mb-6">
                                <label
                                    className="block text-white font-medium mb-2"
                                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                                >
                                    Video Konusu
                                </label>
                                <textarea
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Örn: Yapay zekanın geleceği hakkında ilgi çekici bir video..."
                                    className="w-full h-32 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 resize-none"
                                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                                    disabled={isGenerating}
                                />
                            </div>
                        )}

                        {/* Keyword Inputs - shown when mode is 'keyword' */}
                        {creationMode === 'keyword' && (
                            <div className="mb-6">
                                <label
                                    className="block text-white font-medium mb-2"
                                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                                >
                                    3 Anahtar Kelime
                                </label>
                                <p className="text-slate-400 text-sm mb-4" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                                    🔍 AI, bu anahtar kelimelerle en iyi performans gösteren YouTube içeriklerini araştırıp benzer bir senaryo oluşturacak.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <input
                                        type="text"
                                        value={keyword1}
                                        onChange={(e) => setKeyword1(e.target.value)}
                                        placeholder="Örn: yapay zeka"
                                        className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                                        style={{ fontFamily: 'Geist Sans, sans-serif' }}
                                        disabled={isGenerating}
                                    />
                                    <input
                                        type="text"
                                        value={keyword2}
                                        onChange={(e) => setKeyword2(e.target.value)}
                                        placeholder="Örn: gelecek"
                                        className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                                        style={{ fontFamily: 'Geist Sans, sans-serif' }}
                                        disabled={isGenerating}
                                    />
                                    <input
                                        type="text"
                                        value={keyword3}
                                        onChange={(e) => setKeyword3(e.target.value)}
                                        placeholder="Örn: teknoloji"
                                        className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                                        style={{ fontFamily: 'Geist Sans, sans-serif' }}
                                        disabled={isGenerating}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Duration Selection */}
                        <div className="mb-6">
                            <label
                                className="block text-white font-medium mb-3"
                                style={{ fontFamily: 'Geist Sans, sans-serif' }}
                            >
                                Video Süresi
                            </label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
                                {DURATION_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setDuration(option.value)}
                                        disabled={isGenerating}
                                        className={`relative px-3 py-3 rounded-xl text-sm font-medium transition-all ${duration === option.value
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white border border-slate-700'
                                            }`}
                                        style={{ fontFamily: 'Geist Sans, sans-serif' }}
                                    >
                                        <span className="block">{option.label}</span>
                                        <span className={`text-xs mt-1 block ${duration === option.value ? 'text-purple-200' : 'text-slate-500'
                                            }`}>
                                            {creationMode === 'keyword' ? option.credits + 4 : option.credits} kredi
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Narrator Toggle */}
                        <div className="mb-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {hasNarrator ? (
                                        <Mic size={24} className="text-purple-400" />
                                    ) : (
                                        <MicOff size={24} className="text-slate-500" />
                                    )}
                                    <div>
                                        <span
                                            className="text-white font-medium"
                                            style={{ fontFamily: 'Geist Sans, sans-serif' }}
                                        >
                                            Anlatıcı
                                        </span>
                                        <p className="text-slate-500 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                                            Videoya sesli anlatım ekle
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setHasNarrator(!hasNarrator)}
                                    disabled={isGenerating}
                                    className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${hasNarrator
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                                        : 'bg-slate-700'
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${hasNarrator ? 'translate-x-6' : 'translate-x-0'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Language Selection (only visible when narrator is enabled) */}
                            {hasNarrator && (
                                <div className="pt-4 border-t border-slate-700/50">
                                    <label
                                        className="block text-slate-400 text-sm mb-3"
                                        style={{ fontFamily: 'Geist Sans, sans-serif' }}
                                    >
                                        Anlatım Dili
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {LANGUAGE_OPTIONS.map((lang) => (
                                            <button
                                                key={lang.value}
                                                onClick={() => setLanguage(lang.value)}
                                                disabled={isGenerating}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${language === lang.value
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                                                    }`}
                                                style={{ fontFamily: 'Geist Sans, sans-serif' }}
                                            >
                                                <span className="text-lg">{lang.flag}</span>
                                                <span>{lang.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Error Message (local validation) */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                <p className="text-red-400 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* API Response Display (from n8n) */}
                        {apiResponse && (
                            <div className={`mb-6 p-4 rounded-xl ${apiResponse.status === 'success'
                                ? 'bg-green-500/10 border border-green-500/30'
                                : 'bg-red-500/10 border border-red-500/30'
                                }`}>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">
                                        {apiResponse.status === 'success' ? '✅' : '❌'}
                                    </span>
                                    <div className="flex-1">
                                        <p
                                            className={`font-medium ${apiResponse.status === 'success' ? 'text-green-400' : 'text-red-400'}`}
                                            style={{ fontFamily: 'Geist Sans, sans-serif' }}
                                        >
                                            {apiResponse.message}
                                        </p>
                                        {apiResponse.status === 'success' && apiResponse.video_url && (
                                            <a
                                                href={apiResponse.video_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors"
                                                style={{ fontFamily: 'Geist Sans, sans-serif' }}
                                            >
                                                <Video size={18} />
                                                Videoyu Görüntüle
                                            </a>
                                        )}
                                        {apiResponse.status === 'error' && apiResponse.message.includes('üyelik') && (
                                            <button
                                                onClick={() => navigate('/pricing')}
                                                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors"
                                                style={{ fontFamily: 'Geist Sans, sans-serif' }}
                                            >
                                                <Zap size={18} />
                                                Planı Yükselt
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setApiResponse(null)}
                                        className="text-slate-500 hover:text-white transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Generate Button */}
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating || !hasEnoughCredits || (creationMode === 'topic' ? !topic.trim() : (!keyword1.trim() || !keyword2.trim() || !keyword3.trim()))}
                                className={`w-full sm:w-auto px-8 py-6 text-lg font-semibold rounded-xl transition-all ${hasEnoughCredits
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/30'
                                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                    }`}
                                style={{ fontFamily: 'Geist Sans, sans-serif' }}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin mr-2" />
                                        Oluşturuluyor...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} className="mr-2" />
                                        Video Oluştur
                                    </>
                                )}
                            </Button>

                            {/* Credit Cost Display */}
                            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${hasEnoughCredits
                                ? 'bg-blue-500/10 border border-blue-500/30'
                                : 'bg-red-500/10 border border-red-500/30'
                                }`}>
                                <Zap size={18} className={hasEnoughCredits ? 'text-blue-400' : 'text-red-400'} />
                                <span
                                    className={`font-semibold ${hasEnoughCredits ? 'text-blue-400' : 'text-red-400'}`}
                                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                                >
                                    {requiredCredits} kredi
                                </span>
                                <span className="text-slate-500 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                                    ({credits} mevcut)
                                </span>
                            </div>
                        </div>

                        {/* Not enough credits warning */}
                        {!hasEnoughCredits && (
                            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                                <p className="text-amber-400 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                                    ⚠️ Yetersiz kredi. Bu video için {requiredCredits} kredi gerekiyor, {credits} krediniz var.
                                    <button
                                        onClick={() => navigate('/pricing')}
                                        className="ml-2 underline hover:text-amber-300"
                                    >
                                        Kredi satın al
                                    </button>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Feature Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-5 text-center">
                            <div className="text-2xl mb-2">🎬</div>
                            <h3 className="text-white font-medium mb-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                                Otomatik Senaryo
                            </h3>
                            <p className="text-slate-500 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                                AI konunuzu senaryoya dönüştürür
                            </p>
                        </div>
                        <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-5 text-center">
                            <div className="text-2xl mb-2">✨</div>
                            <h3 className="text-white font-medium mb-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                                Profesyonel Sahne
                            </h3>
                            <p className="text-slate-500 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                                Yüksek kaliteli sahneler ve geçişler
                            </p>
                        </div>
                        <div className="bg-slate-900/30 border border-slate-800/50 rounded-xl p-5 text-center">
                            <div className="text-2xl mb-2">🎙️</div>
                            <h3 className="text-white font-medium mb-1" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                                Çoklu Dil Desteği
                            </h3>
                            <p className="text-slate-500 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                                4 farklı dilde anlatım seçeneği
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Status Modal */}
            <VideoStatusModal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                userId={user?.id}
            />
        </AccessGuard>
    );
};

export default AIVideoPage;
