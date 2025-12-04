import React, { useState, useEffect } from 'react';
import { Upload, Monitor, Smartphone, Sun, Moon, Shuffle, X } from 'lucide-react';
import AccessGuard from '../components/AccessGuard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { competitors } from '../data/competitors';

const VideoCard = ({ thumbnail, title, channel, views, avatar, isLightMode, isMobile, isUserVideo }) => {
  // Check if avatar is a URL or text initials
  const isAvatarUrl = avatar && (avatar.startsWith('http://') || avatar.startsWith('https://'));
  
  return (
    <div className={`${isMobile ? 'flex gap-2' : 'flex flex-col'} cursor-pointer group`}>
      {/* Thumbnail */}
      <div className={`relative ${isMobile ? 'w-40 flex-shrink-0' : 'w-full'} rounded-xl overflow-hidden`}>
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full aspect-video object-cover"
        />
      </div>

      {/* Content */}
      <div className={`${isMobile ? 'flex-1 py-1' : 'mt-3'} flex gap-3`}>
        {/* Avatar - Only show on desktop */}
        {!isMobile && (
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 overflow-hidden ${
            isLightMode ? 'bg-red-600 text-white' : 'bg-slate-700 text-white'
          }`} style={{ fontFamily: 'Roboto, sans-serif' }}>
            {isAvatarUrl ? (
              <img src={avatar} alt={channel} className="w-full h-full object-cover" />
            ) : (
              avatar
            )}
          </div>
        )}

        {/* Text */}
        <div className="flex-1 min-w-0">
          {/* Title - YouTube uses Roboto, 14px, 500 weight, line-height 20px, max 2 lines */}
          <h3 
            className={`font-medium line-clamp-2 mb-1 ${
              isLightMode ? 'text-[#0f0f0f]' : 'text-[#f1f1f1]'
            }`} 
            style={{ 
              fontFamily: 'Roboto, Arial, sans-serif',
              fontSize: '14px',
              lineHeight: '20px',
              fontWeight: 500
            }}
          >
            {title}
          </h3>
          
          {/* Channel Name - YouTube uses 12px, 400 weight, normal (not bold) */}
          <p 
            className={`mb-0.5 font-normal ${
              isLightMode ? 'text-[#606060]' : 'text-[#aaaaaa]'
            }`} 
            style={{ 
              fontFamily: 'Roboto, Arial, sans-serif',
              fontSize: '12px',
              lineHeight: '18px',
              fontWeight: 'normal'
            }}
          >
            {channel}
          </p>
          
          {/* Views & Date - YouTube uses 12px, 400 weight, normal (not bold) */}
          <p 
            className={`font-normal ${
              isLightMode ? 'text-[#606060]' : 'text-[#aaaaaa]'
            }`} 
            style={{ 
              fontFamily: 'Roboto, Arial, sans-serif',
              fontSize: '12px',
              lineHeight: '18px',
              fontWeight: 'normal'
            }}
          >
            {views}
          </p>
        </div>
      </div>
    </div>
  );
};

const TestPage = () => {
  const [uploadedThumbnails, setUploadedThumbnails] = useState([]);
  const [channelName, setChannelName] = useState('CoverLab Media');
  const [viewsMeta, setViewsMeta] = useState('1.2M görüntüleme • 1 gün önce');
  const [device, setDevice] = useState('desktop'); // desktop | mobile
  const [theme, setTheme] = useState('dark'); // dark | light
  const [simulationList, setSimulationList] = useState([]); // Complete video list with user thumbnails injected
  const [isDragging, setIsDragging] = useState(false); // Drag & drop state
  const [shuffledCompetitors, setShuffledCompetitors] = useState([]); // Shuffled competitor list
  const [userThumbnailPositions, setUserThumbnailPositions] = useState([]); // Fixed positions for user thumbnails

  // Initialize shuffled competitors on mount
  useEffect(() => {
    const shuffled = [...competitors].sort(() => Math.random() - 0.5);
    setShuffledCompetitors(shuffled);
  }, []);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      uploadedThumbnails.forEach(thumb => {
        if (thumb.url) URL.revokeObjectURL(thumb.url);
      });
    };
  }, []);

  // Rebuild simulation list when any relevant data changes
  useEffect(() => {
    if (shuffledCompetitors.length > 0) {
      buildSimulationList();
    }
  }, [uploadedThumbnails, channelName, viewsMeta, shuffledCompetitors]);

  // Generate random positions for user thumbnails (only when thumbnails are added/removed)
  const generateUserThumbnailPositions = (count) => {
    const maxPosition = 10; // Insert within first 10 videos
    const usedPositions = new Set();
    const positions = [];
    
    for (let i = 0; i < count; i++) {
      let pos;
      do {
        pos = Math.floor(Math.random() * maxPosition);
      } while (usedPositions.has(pos));
      usedPositions.add(pos);
      positions.push(pos);
    }
    
    return positions;
  };

  const buildSimulationList = () => {
    // Use the pre-shuffled competitors list
    const videoList = shuffledCompetitors.map(video => ({
      ...video,
      thumbnail: video.thumbnail + '?t=' + Date.now()
    }));

    // Inject user thumbnails using FIXED positions from state
    if (uploadedThumbnails.length > 0 && userThumbnailPositions.length === uploadedThumbnails.length) {
      // Use the pre-calculated positions from state
      const sortedPositions = [...userThumbnailPositions].sort((a, b) => b - a);
      
      for (let i = 0; i < uploadedThumbnails.length; i++) {
        const userVideo = {
          id: `user-video-${uploadedThumbnails[i].id}`,
          thumbnail: uploadedThumbnails[i].url,
          title: uploadedThumbnails[i].title,
          channel: channelName,
          avatar: channelName.substring(0, 2).toUpperCase(),
          views: viewsMeta,
          isUserVideo: true
        };
        videoList.splice(sortedPositions[i], 0, userVideo);
      }
    }

    setSimulationList(videoList);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    if (uploadedThumbnails.length + files.length > 3) {
      alert('Maksimum 3 thumbnail yükleyebilirsiniz');
      return;
    }

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    const newThumbnails = imageFiles.map((file, index) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file,
      title: `Video Başlığı ${uploadedThumbnails.length + index + 1}`
    }));

    const newThumbnailsList = [...uploadedThumbnails, ...newThumbnails];
    setUploadedThumbnails(newThumbnailsList);
    
    // Generate new positions for ALL thumbnails
    const newPositions = generateUserThumbnailPositions(newThumbnailsList.length);
    setUserThumbnailPositions(newPositions);
  };

  // Drag & Drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const removeThumbnail = (id) => {
    // Revoke blob URL to clear cache
    const thumbnail = uploadedThumbnails.find(t => t.id === id);
    if (thumbnail?.url) {
      URL.revokeObjectURL(thumbnail.url);
    }
    
    const newThumbnails = uploadedThumbnails.filter(t => t.id !== id);
    setUploadedThumbnails(newThumbnails);
    
    // Regenerate positions for remaining thumbnails
    if (newThumbnails.length > 0) {
      const newPositions = generateUserThumbnailPositions(newThumbnails.length);
      setUserThumbnailPositions(newPositions);
    } else {
      setUserThumbnailPositions([]);
    }
  };

  const updateThumbnailTitle = (id, newTitle) => {
    setUploadedThumbnails(uploadedThumbnails.map(thumb => 
      thumb.id === id ? { ...thumb, title: newTitle } : thumb
    ));
  };

  const handleShuffle = () => {
    // Shuffle both competitors AND user thumbnail positions
    const shuffled = [...competitors].sort(() => Math.random() - 0.5);
    setShuffledCompetitors(shuffled);
    // buildSimulationList will be called automatically via useEffect
  };

  const isLightMode = theme === 'light';
  const isMobile = device === 'mobile';

  return (
    <AccessGuard requirePro={true}>
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
          <div 
            className="w-[320px] bg-slate-900 border-r border-slate-700 flex flex-col"
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Drag & Drop Overlay */}
            {isDragging && (
              <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm border-4 border-blue-500 border-dashed z-50 flex items-center justify-center">
                <div className="text-center">
                  <Upload size={48} className="text-blue-400 mx-auto mb-3 animate-bounce" />
                  <p className="text-white text-lg font-bold" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    Bırak ve Test Et
                  </p>
                  <p className="text-blue-200 text-sm" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                    Max 3 thumbnail
                  </p>
                </div>
              </div>
            )}

            <div className="p-5 space-y-4 flex-1 overflow-y-auto">
              {/* Header */}
              <div>
                <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Test Ayarları
                </h2>
                <p className="text-slate-400 text-xs" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  A/B test için thumbnail ekleyin
                </p>
              </div>

              {/* Upload Zone - Compact Grid */}
              <div className="space-y-2">
                <Label className="text-white text-sm font-semibold" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  Thumbnail'lar ({uploadedThumbnails.length}/3)
                </Label>
                
                {/* Hidden File Input */}
                <input
                  id="testFileInput"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Horizontal Grid Layout */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Uploaded Thumbnails */}
                  {uploadedThumbnails.map((thumb, idx) => (
                    <div key={thumb.id} className="flex flex-col gap-1">
                      {/* Thumbnail Card */}
                      <div className="relative group rounded overflow-hidden border border-slate-700 hover:border-slate-600 transition-all">
                        <img 
                          src={thumb.url} 
                          alt={`Thumbnail ${idx + 1}`} 
                          className="w-full aspect-video object-cover"
                        />
                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeThumbnail(thumb.id);
                          }}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                        {/* Number Badge */}
                        <div className="absolute bottom-0.5 left-0.5 bg-blue-500 text-white text-[10px] px-1 py-0.5 rounded font-bold">
                          #{idx + 1}
                        </div>
                      </div>
                      
                      {/* Title Input - Compact */}
                      <Input
                        placeholder="Başlık..."
                        value={thumb.title}
                        onChange={(e) => updateThumbnailTitle(thumb.id, e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white text-[10px] h-6 px-1.5"
                        style={{ fontFamily: 'Geist Sans, sans-serif' }}
                      />
                    </div>
                  ))}
                  
                  {/* Add Button (if space available) */}
                  {uploadedThumbnails.length < 3 && (
                    <div 
                      className="flex flex-col items-center justify-center border-2 border-dashed border-blue-500/50 rounded cursor-pointer hover:border-blue-500 hover:bg-slate-800/50 transition-all aspect-video"
                      onClick={() => document.getElementById('testFileInput').click()}
                    >
                      <Upload size={16} className="text-blue-400 mb-0.5" />
                      <p className="text-white text-[9px] font-medium" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                        Ekle
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata Inputs - Compact Grid */}
              <div className="space-y-3">
                <Label className="text-white text-sm font-semibold" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  Video Bilgileri
                </Label>
                
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Kanal Adı"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white text-xs h-8"
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  />
                  <Input
                    placeholder="Görüntülenme"
                    value={viewsMeta}
                    onChange={(e) => setViewsMeta(e.target.value)}
                    className="bg-slate-800 border-slate-600 text-white text-xs h-8"
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  />
                </div>
              </div>

              {/* Controls - Compact Toggles */}
              <div className="space-y-3">
                <Label className="text-white text-sm font-semibold" style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  Görünüm
                </Label>
                
                {/* Device + Theme in single row */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => setDevice('desktop')}
                    size="sm"
                    className={`flex-1 h-8 ${
                      device === 'desktop' 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Monitor size={14} className="mr-1" />
                    <span className="text-xs">PC</span>
                  </Button>
                  <Button
                    onClick={() => setDevice('mobile')}
                    size="sm"
                    className={`flex-1 h-8 ${
                      device === 'mobile' 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  >
                    <Smartphone size={14} className="mr-1" />
                    <span className="text-xs">Mobil</span>
                  </Button>
                </div>

                {/* Theme Toggle - Same Row */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => setTheme('dark')}
                    size="sm"
                    className={`flex-1 h-8 ${
                      theme === 'dark' 
                        ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                    }`}
                  >
                    <Moon size={14} className="mr-1" />
                    <span className="text-xs">Koyu</span>
                  </Button>
                  <Button
                    onClick={() => setTheme('light')}
                    size="sm"
                    className={`flex-1 h-8 ${
                      theme === 'light' 
                        ? 'bg-slate-200 hover:bg-slate-100 text-slate-900' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                    }`}
                  >
                    <Sun size={14} className="mr-1" />
                    <span className="text-xs">Açık</span>
                  </Button>
                </div>
              </div>

              {/* Shuffle Button - Compact */}
              <Button
                onClick={handleShuffle}
                className="w-full h-9 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-sm"
                style={{ fontFamily: 'Geist Sans, sans-serif' }}
              >
                <Shuffle size={14} className="mr-2" />
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

              {/* Video Grid - Scrollable for 60+ items */}
              <div className={`${
                isMobile 
                  ? 'flex flex-col gap-4' 
                  : 'grid grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8'
              }`}>
                {simulationList.map((video) => (
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
              
              {/* Show count */}
              {simulationList.length > 0 && (
                <div className={`mt-8 text-center text-sm ${
                  isLightMode ? 'text-slate-600' : 'text-slate-400'
                }`} style={{ fontFamily: 'Geist Sans, sans-serif' }}>
                  Toplam {simulationList.length} video gösteriliyor
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </AccessGuard>
  );
};

export default TestPage;