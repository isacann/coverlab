import React, { useState } from 'react';
import { Upload, Monitor, Smartphone, Sun, Moon, Shuffle, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

// COMPETITOR MOCK DATA
const COMPETITORS = [
  {
    id: 1,
    thumbnail: 'https://picsum.photos/seed/vid1/1280/720',
    title: 'I Spent 24 Hours in the Worlds Largest Cave',
    channel: 'MrBeast',
    avatar: 'MB',
    views: '45M görüntüleme • 2 gün önce'
  },
  {
    id: 2,
    thumbnail: 'https://picsum.photos/seed/vid2/1280/720',
    title: 'My Gaming Setup Tour 2024 - $50,000 Setup!',
    channel: 'TechGuru',
    avatar: 'TG',
    views: '2.1M görüntüleme • 5 saat önce'
  },
  {
    id: 3,
    thumbnail: 'https://picsum.photos/seed/vid3/1280/720',
    title: 'This Changed Everything... (Storytime)',
    channel: 'Daily Vlogs',
    avatar: 'DV',
    views: '890K görüntüleme • 12 saat önce'
  },
  {
    id: 4,
    thumbnail: 'https://picsum.photos/seed/vid4/1280/720',
    title: 'You Won\'t Believe What Happened Next...',
    channel: 'Trending Now',
    avatar: 'TN',
    views: '5.4M görüntüleme • 1 gün önce'
  },
  {
    id: 5,
    thumbnail: 'https://picsum.photos/seed/vid5/1280/720',
    title: 'TOP 10 Most INSANE Moments in Gaming History',
    channel: 'GameTime',
    avatar: 'GT',
    views: '3.2M görüntüleme • 3 gün önce'
  },
  {
    id: 6,
    thumbnail: 'https://picsum.photos/seed/vid6/1280/720',
    title: 'I Built the PERFECT Smart Home for $10,000',
    channel: 'Tech Reviews',
    avatar: 'TR',
    views: '1.8M görüntüleme • 1 hafta önce'
  },
  {
    id: 7,
    thumbnail: 'https://picsum.photos/seed/vid7/1280/720',
    title: 'Cooking the WORLD\'S Most Expensive Burger',
    channel: 'Food Masters',
    avatar: 'FM',
    views: '4.5M görüntüleme • 2 gün önce'
  },
  {
    id: 8,
    thumbnail: 'https://picsum.photos/seed/vid8/1280/720',
    title: 'Why Everyone is Talking About THIS...',
    channel: 'Viral Videos',
    avatar: 'VV',
    views: '7.2M görüntüleme • 6 saat önce'
  },
  {
    id: 9,
    thumbnail: 'https://picsum.photos/seed/vid9/1280/720',
    title: 'My Morning Routine That Changed My Life',
    channel: 'Life Hacks',
    avatar: 'LH',
    views: '2.9M görüntüleme • 4 gün önce'
  },
  {
    id: 10,
    thumbnail: 'https://picsum.photos/seed/vid10/1280/720',
    title: 'ULTIMATE Travel Guide to Tokyo 2024',
    channel: 'Travel World',
    avatar: 'TW',
    views: '1.5M görüntüleme • 1 hafta önce'
  }
];

const VideoCard = ({ thumbnail, title, channel, views, avatar, isLightMode, isMobile, isUserVideo }) => {
  return (
    <div className={`${isMobile ? 'flex gap-3' : 'flex flex-col'} cursor-pointer group`}>
      {/* Thumbnail */}
      <div className={`relative ${isMobile ? 'w-40 flex-shrink-0' : 'w-full'} ${isUserVideo ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}>
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full aspect-video object-cover rounded-lg"
        />
        {isUserVideo && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
            SİZİN
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`${isMobile ? 'flex-1 py-1' : 'mt-3'} flex gap-3`}>
        {/* Avatar - Only show on desktop */}
        {!isMobile && (
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
            isLightMode ? 'bg-slate-300 text-slate-700' : 'bg-slate-700 text-white'
          }`} style={{ fontFamily: 'Geist Sans, sans-serif' }}>
            {avatar}
          </div>
        )}

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm line-clamp-2 mb-1 ${
            isLightMode ? 'text-slate-900' : 'text-white'
          }`} style={{ fontFamily: 'Geist Sans, sans-serif' }}>
            {title}
          </h3>
          <p className={`text-xs mb-0.5 ${
            isLightMode ? 'text-slate-600' : 'text-slate-400'
          }`} style={{ fontFamily: 'Geist Sans, sans-serif' }}>
            {channel}
          </p>
          <p className={`text-xs ${
            isLightMode ? 'text-slate-500' : 'text-slate-500'
          }`} style={{ fontFamily: 'Geist Sans, sans-serif' }}>
            {views}
          </p>
        </div>
      </div>
    </div>
  );
};

const TestPage = () => {
  const [uploadedThumbnails, setUploadedThumbnails] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoTitle, setVideoTitle] = useState('Mükemmel Bir Video Başlığı Buraya Gelecek');
  const [channelName, setChannelName] = useState('CoverLab Media');
  const [viewsMeta, setViewsMeta] = useState('1.2M görüntüleme • 1 gün önce');
  const [device, setDevice] = useState('desktop'); // desktop | mobile
  const [theme, setTheme] = useState('dark'); // dark | light
  const [shuffled, setShuffled] = useState(false);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (uploadedThumbnails.length + files.length > 3) {
      alert('Maksimum 3 thumbnail yükleyebilirsiniz');
      return;
    }

    const newThumbnails = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file
    }));

    setUploadedThumbnails([...uploadedThumbnails, ...newThumbnails]);
  };

  const removeThumbnail = (id) => {
    const newThumbnails = uploadedThumbnails.filter(t => t.id !== id);
    setUploadedThumbnails(newThumbnails);
    if (activeIndex >= newThumbnails.length) {
      setActiveIndex(Math.max(0, newThumbnails.length - 1));
    }
  };

  const handleShuffle = () => {
    setShuffled(!shuffled);
  };

  // Build video list
  const getVideoList = () => {
    let videos = [...COMPETITORS];
    
    if (shuffled) {
      videos = videos.sort(() => Math.random() - 0.5);
    }

    // Insert user's video at position 1 (2nd video)
    if (uploadedThumbnails.length > 0) {
      const userVideo = {
        id: 'user-video',
        thumbnail: uploadedThumbnails[activeIndex].url,
        title: videoTitle,
        channel: channelName,
        avatar: channelName.substring(0, 2).toUpperCase(),
        views: viewsMeta,
        isUserVideo: true
      };
      videos.splice(1, 0, userVideo);
    }

    return videos;
  };

  const isLightMode = theme === 'light';
  const isMobile = device === 'mobile';
  const videoList = getVideoList();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: 'url("https://customer-assets.emergentagent.com/job_326e649c-429d-481a-8bf3-c99e4276d28c/artifacts/bhrosu5k_8nNOHsP6PbEJMwWSth7Jb.png")',
        }}
      />

      <div className="relative z-10 pt-20">
        <div className="flex h-screen">
          {/* LEFT SIDEBAR - CONTROLS */}
          <div className="w-[350px] bg-slate-900 border-r border-slate-700 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Önizleme Ayarları
                </h2>
                <p className="text-slate-400 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  A/B test yapın ve karşılaştırın
                </p>
              </div>

              {/* Upload Zone */}
              <div className="space-y-3">
                <Label className="text-white font-semibold" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  Thumbnail'larınız (Max 3)
                </Label>
                
                {uploadedThumbnails.length < 3 && (
                  <div 
                    className="border-2 border-dashed border-blue-500/50 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-slate-800/50 transition-all"
                    onClick={() => document.getElementById('testFileInput').click()}
                  >
                    <input
                      id="testFileInput"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload size={32} className="text-blue-400 mx-auto mb-2" />
                    <p className="text-white text-sm font-medium" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                      Thumbnail Ekle
                    </p>
                    <p className="text-slate-500 text-xs" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                      {uploadedThumbnails.length}/3
                    </p>
                  </div>
                )}

                {/* Uploaded Thumbnails */}
                {uploadedThumbnails.map((thumb, idx) => (
                  <div 
                    key={thumb.id}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      activeIndex === idx ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-slate-700 hover:border-blue-500/50'
                    }`}
                    onClick={() => setActiveIndex(idx)}
                  >
                    <img src={thumb.url} alt="Thumbnail" className="w-full aspect-video object-cover" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeThumbnail(thumb.id);
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    {activeIndex === idx && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        AKTİF
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Video Title */}
              <div className="space-y-2">
                <Label htmlFor="videoTitle" className="text-white font-semibold" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  Video Başlığı
                </Label>
                <Input
                  id="videoTitle"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                  style={{ fontFamily: 'Geist Sans, sans-serif' }}
                />
              </div>

              {/* Channel Name */}
              <div className="space-y-2">
                <Label htmlFor="channelName" className="text-white font-semibold" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  Kanal Adı
                </Label>
                <Input
                  id="channelName"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                  style={{ fontFamily: 'Geist Sans, sans-serif' }}
                />
              </div>

              {/* Views Meta */}
              <div className="space-y-2">
                <Label htmlFor="viewsMeta" className="text-white font-semibold" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  Görüntülenme
                </Label>
                <Input
                  id="viewsMeta"
                  value={viewsMeta}
                  onChange={(e) => setViewsMeta(e.target.value)}
                  className="bg-slate-800 border-slate-600 text-white"
                  style={{ fontFamily: 'Geist Sans, sans-serif' }}
                />
              </div>

              {/* Device Toggle */}
              <div className="space-y-2">
                <Label className="text-white font-semibold" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Cihaz</Label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setDevice('desktop')}
                    className={`flex-1 ${
                      device === 'desktop' 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  >
                    <Monitor size={16} className="mr-2" />
                    Masaüstü
                  </Button>
                  <Button
                    onClick={() => setDevice('mobile')}
                    className={`flex-1 ${
                      device === 'mobile' 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  >
                    <Smartphone size={16} className="mr-2" />
                    Mobil
                  </Button>
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="space-y-2">
                <Label className="text-white font-semibold" style={{ fontFamily: 'Geist Sans, sans-serif' }}>Tema</Label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 ${
                      theme === 'dark' 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  >
                    <Moon size={16} className="mr-2" />
                    Karanlık
                  </Button>
                  <Button
                    onClick={() => setTheme('light')}
                    className={`flex-1 ${
                      theme === 'light' 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  >
                    <Sun size={16} className="mr-2" />
                    Aydınlık
                  </Button>
                </div>
              </div>

              {/* Shuffle Button */}
              <Button
                onClick={handleShuffle}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                style={{ fontFamily: 'Geist Sans, sans-serif' }}
              >
                <Shuffle size={16} className="mr-2" />
                Sırayı Karıştır
              </Button>
            </div>
          </div>

          {/* RIGHT AREA - SIMULATOR */}
          <div className={`flex-1 overflow-y-auto ${
            isLightMode ? 'bg-white' : 'bg-[#0f0f0f]'
          }`}>
            <div className={`${
              isMobile ? 'max-w-md mx-auto' : 'max-w-7xl mx-auto'
            } p-6`}>
              {/* Simulator Header */}
              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-1 ${
                  isLightMode ? 'text-slate-900' : 'text-white'
                }`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  YouTube Önizleme
                </h3>
                <p className={`text-sm ${
                  isLightMode ? 'text-slate-600' : 'text-slate-400'
                }`} style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  {isMobile ? 'Mobil' : 'Masaüstü'} görünümü • {isLightMode ? 'Aydınlık' : 'Karanlık'} tema
                </p>
              </div>

              {/* Video Grid */}
              <div className={`${
                isMobile 
                  ? 'flex flex-col gap-4' 
                  : 'grid grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8'
              }`}>
                {videoList.map((video) => (
                  <VideoCard
                    key={video.id}
                    thumbnail={video.thumbnail}
                    title={video.title}
                    channel={video.channel}
                    views={video.views}
                    avatar={video.avatar}
                    isLightMode={isLightMode}
                    isMobile={isMobile}
                    isUserVideo={video.isUserVideo}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;