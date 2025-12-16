import React, { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
} from '../ui/dialog';
import { Button } from '../ui/button';
import {
    Clock,
    Loader2,
    CheckCircle,
    XCircle,
    ArrowRight
} from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';

// Simple status labels
const STATUS_CONFIG = {
    pending: {
        label: 'Sıraya Alındı',
        icon: Clock,
        color: 'text-yellow-400',
    },
    processing: {
        label: 'İşleniyor',
        icon: Loader2,
        color: 'text-blue-400',
        animate: true,
    },
    completed: {
        label: 'Tamamlandı',
        icon: CheckCircle,
        color: 'text-green-400',
    },
    failed: {
        label: 'Başarısız',
        icon: XCircle,
        color: 'text-red-400',
    },
};

const POLLING_INTERVAL = 3000; // 3 seconds

const VideoStatusModal = ({ isOpen, onClose, userId }) => {
    const navigate = useNavigate();
    const [status, setStatus] = useState(null); // null = bekleniyor
    const [loading, setLoading] = useState(true);

    // Fetch the latest video status for the user
    const fetchVideoStatus = useCallback(async () => {
        if (!userId) return;

        try {
            const { data, error } = await supabase
                .from('ai_videos')
                .select('status')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error || !data) {
                // n8n henüz satır oluşturmamış
                setStatus(null);
            } else {
                setStatus(data.status);
            }
        } catch (err) {
            console.error('Video status fetch error:', err);
            setStatus(null);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Start polling when modal opens
    useEffect(() => {
        if (!isOpen || !userId) return;

        setLoading(true);
        fetchVideoStatus();

        // Poll every 3 seconds
        const intervalId = setInterval(() => {
            if (status !== 'completed' && status !== 'failed') {
                fetchVideoStatus();
            }
        }, POLLING_INTERVAL);

        return () => clearInterval(intervalId);
    }, [isOpen, userId, fetchVideoStatus, status]);

    // Navigate to lab videos tab
    const goToVideos = () => {
        onClose();
        navigate('/lab?tab=videos');
    };

    const currentStatus = status ? STATUS_CONFIG[status] : null;
    const StatusIcon = currentStatus?.icon || Loader2;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900/95 border border-slate-700 text-white max-w-md backdrop-blur-xl">
                <div className="py-8 px-4 text-center">
                    {/* Animated Icon */}
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse" />
                        <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-5 rounded-full">
                            {loading ? (
                                <Loader2 size={40} className="text-white animate-spin" />
                            ) : (
                                <StatusIcon
                                    size={40}
                                    className={`text-white ${currentStatus?.animate ? 'animate-spin' : ''}`}
                                />
                            )}
                        </div>
                    </div>

                    {/* Status Text */}
                    <h2
                        className="text-xl font-bold text-white mb-2"
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    >
                        {loading ? 'Bekleniyor...' : (currentStatus?.label || 'Bekleniyor...')}
                    </h2>

                    {/* Info Message - Only show if not completed/failed */}
                    {status !== 'completed' && status !== 'failed' && (
                        <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                            <p
                                className="text-slate-300 text-sm mb-3"
                                style={{ fontFamily: 'Geist Sans, sans-serif' }}
                            >
                                ⏱️ Videonuzun süresine göre <span className="text-white font-medium">3 ila 30 dakika</span> sürebilir.
                            </p>
                            <p
                                className="text-slate-400 text-sm"
                                style={{ fontFamily: 'Geist Sans, sans-serif' }}
                            >
                                İşlem tamamlandığında <span className="text-purple-400">Laboratuvarım → Videolarım</span> kısmından kontrol edebilirsiniz.
                            </p>
                        </div>
                    )}

                    {/* Success Message */}
                    {status === 'completed' && (
                        <p className="text-green-400 text-sm mt-4">
                            ✅ Videonuz hazır! Laboratuvarım bölümünden erişebilirsiniz.
                        </p>
                    )}

                    {/* Error Message */}
                    {status === 'failed' && (
                        <p className="text-red-400 text-sm mt-4">
                            ❌ Video oluşturulamadı. Lütfen tekrar deneyin.
                        </p>
                    )}

                    {/* Go to Lab Button */}
                    <Button
                        onClick={goToVideos}
                        className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-6"
                        style={{ fontFamily: 'Geist Sans, sans-serif' }}
                    >
                        Videolarıma Git
                        <ArrowRight size={18} className="ml-2" />
                    </Button>

                    {/* Close hint */}
                    {status !== 'completed' && status !== 'failed' && (
                        <p className="text-slate-500 text-xs mt-4">
                            Bu pencereyi kapatabilirsiniz, işleminiz arka planda devam edecek.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default VideoStatusModal;
