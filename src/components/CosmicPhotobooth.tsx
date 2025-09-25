import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Download, Printer, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { STICKER_THEMES } from './stickers';

interface Filter {
  name: string;
  cssFilter: string;
}

const filters: Filter[] = [
  { name: 'No Filter', cssFilter: 'none' },
  { name: 'B&W', cssFilter: 'var(--filter-bw)' },
  { name: 'Sepia', cssFilter: 'var(--filter-sepia)' },
  { name: 'Vintage', cssFilter: 'var(--filter-vintage)' },
  { name: 'Soft', cssFilter: 'var(--filter-soft)' },
  { name: 'Noir', cssFilter: 'var(--filter-noir)' },
  { name: 'Vivid', cssFilter: 'var(--filter-vivid)' },
];

// Update stripStyles to only include Custom Color:
const stripStyles = [
  { name: 'Custom Color', className: 'strip-custom' },
];

const CosmicPhotobooth: React.FC = () => {
  // Address for display
  const presentAddress = '123 Main St, YourCity'; // Change as needed
  const [captureTime, setCaptureTime] = useState<string>('');
  const [customColor, setCustomColor] = useState('#e0f7fa');
  // Photo strip style options
  const [selectedStripStyle, setSelectedStripStyle] = useState(stripStyles[0].className);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [activeFilter, setActiveFilter] = useState<Filter>(filters[0]);
  const [countdownTime, setCountdownTime] = useState<number>(3);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownValue, setCountdownValue] = useState<number>(0);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectedStickerTheme, setSelectedStickerTheme] = useState('none');

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, []);

  useEffect(() => {
    initializeCamera();
    return () => {
      // Cleanup function will be handled by the stream state change
    };
  }, [initializeCamera]);

  // Separate effect for stream cleanup to prevent camera blinking
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Capture photo function
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Apply filter and draw
    ctx.filter = activeFilter.cssFilter;
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL('image/jpeg', 0.8);
  }, [activeFilter]);

  // Start photo sequence
  const startPhotoSequence = useCallback(async () => {
    if (isCapturing) return;
    
  setIsCapturing(true);
  setCapturedPhotos([]);
  setCaptureTime(new Date().toLocaleString());

    for (let i = 0; i < 3; i++) {
      // Countdown
      setIsCountingDown(true);
      for (let count = countdownTime; count > 0; count--) {
        setCountdownValue(count);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setIsCountingDown(false);

      // Capture photo
      const photo = capturePhoto();
      if (photo) {
        setCapturedPhotos(prev => [...prev, photo]);
      }

      // Brief pause between photos
      if (i < 2) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setIsCapturing(false);
  }, [countdownTime, capturePhoto, isCapturing]);

  // Download photo strip
  // Download photo strip with style
  const downloadPhotoStrip = useCallback((stripStyleClass = selectedStripStyle, customColorParam = customColor) => {
    if (capturedPhotos.length === 0) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Photo strip dimensions
    const photoWidth = 400;
    const photoHeight = 300;
    const stripWidth = photoWidth + 40;
    const previewPaddingTop = 60; // top padding for header
    const previewPhotoGap = 10; // gap between photos
    const previewDatePadding = 16; // padding below last photo for date
    const numPhotos = capturedPhotos.length;
    const stripHeight = previewPaddingTop + (photoHeight * numPhotos) + (previewPhotoGap * (numPhotos - 1)) + previewDatePadding + 24; // 24px for date text height
    canvas.width = stripWidth;
    canvas.height = stripHeight;

    // Style backgrounds
    switch (stripStyleClass) {
      case 'strip-cartoon':
        ctx.fillStyle = '#ffe066'; // cartoon yellow
        ctx.fillRect(0, 0, stripWidth, stripHeight);
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 8;
        ctx.strokeRect(0, 0, stripWidth, stripHeight);
        break;
      case 'strip-flower':
        ctx.fillStyle = '#f7e1ff'; // soft purple
        ctx.fillRect(0, 0, stripWidth, stripHeight);
        // Draw butterfly shapes on edges
        function drawButterfly(x, y) {
          ctx.save();
          ctx.translate(x, y);
          ctx.beginPath();
          ctx.ellipse(0, -10, 8, 12, 0, 0, 2 * Math.PI);
          ctx.fillStyle = '#ffb6b9';
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(0, 10, 8, 12, 0, 0, 2 * Math.PI);
          ctx.fillStyle = '#b6e2ff';
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(-10, 0, 12, 8, 0, 0, 2 * Math.PI);
          ctx.fillStyle = '#c3f584';
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(10, 0, 12, 8, 0, 0, 2 * Math.PI);
          ctx.fillStyle = '#f7e1ff';
          ctx.fill();
          ctx.restore();
        }
        drawButterfly(20, 20);
        drawButterfly(stripWidth - 20, stripHeight - 20);
        break;
      case 'strip-heart':
        ctx.fillStyle = '#fff0f6'; // pink
        ctx.fillRect(0, 0, stripWidth, stripHeight);
        // Draw hearts
        for (let i = 0; i < 5; i++) {
          ctx.save();
          ctx.translate(80 + i * 60, 40);
          ctx.rotate(-0.2);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(0, -10, 20, -10, 20, 0);
          ctx.bezierCurveTo(20, 15, 0, 20, 0, 30);
          ctx.bezierCurveTo(0, 20, -20, 15, -20, 0);
          ctx.bezierCurveTo(-20, -10, 0, -10, 0, 0);
          ctx.fillStyle = '#ff69b4';
          ctx.fill();
          ctx.restore();
        }
        break;
      case 'strip-custom':
        ctx.fillStyle = customColorParam;
        ctx.fillRect(0, 0, stripWidth, stripHeight);
        break;
      default:
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, stripWidth, stripHeight);
    }

        // Draw top message
    ctx.font = 'bold 32px "Times New Roman", Times, serif';
    ctx.fillStyle = '#222';
    ctx.textAlign = 'center';
    ctx.fillText('Captured by FotoJB', stripWidth / 2, 40);

    // Draw photos
    let loadedCount = 0;
    capturedPhotos.forEach((photo, index) => {
      const img = new window.Image();
      img.onload = () => {
        // Calculate y position for each photo
        const y = previewPaddingTop + (index * (photoHeight + previewPhotoGap));
        ctx.save();
        // Resolve filter value for canvas
        let filterValue = activeFilter.cssFilter;
        if (filterValue.startsWith('var(')) {
          const cssVar = filterValue.match(/var\(([^)]+)\)/);
          if (cssVar && cssVar[1]) {
            filterValue = getComputedStyle(document.documentElement).getPropertyValue(cssVar[1].trim()) ||
                          getComputedStyle(document.body).getPropertyValue(cssVar[1].trim()) ||
                          'none';
          }
        }
        ctx.filter = filterValue.trim() || 'none';
        ctx.drawImage(img, 20, y, photoWidth, photoHeight);
        ctx.restore();
        // Randomize sticker placement if selected
        if (selectedStickerTheme !== 'none') {
          const theme = STICKER_THEMES.find(t => t.value === selectedStickerTheme);
          if (theme && theme.images.length) {
            const stickerSrc = theme.images[0];
            const stickerSize = Math.floor(photoWidth * 0.12); // 12% of photo width
            const stickerImg = new window.Image();
            stickerImg.src = stickerSrc;
            stickerImg.onload = () => {
              // Place 7-8 stickers at random positions in the photo
              const stickerCount = Math.floor(Math.random() * 2) + 7; // 7 or 8
              for (let s = 0; s < stickerCount; s++) {
                // Random position within photo frame, with margin
                const margin = 8;
                const randX = 20 + margin + Math.random() * (photoWidth - stickerSize - 2 * margin);
                const randY = y + margin + Math.random() * (photoHeight - stickerSize - 2 * margin);
                ctx.save();
                // Optionally randomize rotation for more natural look
                const angle = Math.random() * 2 * Math.PI;
                ctx.translate(randX + stickerSize / 2, randY + stickerSize / 2);
                ctx.rotate(angle);
                ctx.drawImage(stickerImg, -stickerSize / 2, -stickerSize / 2, stickerSize, stickerSize);
                ctx.restore();
              }
            };
          }
        }
        loadedCount++;
        if (loadedCount === capturedPhotos.length) {
          // Draw date/time below last photo, matching preview
          ctx.font = '16px Arial';
          ctx.fillStyle = '#555';
          ctx.textAlign = 'center';
          const dateY = previewPaddingTop + (photoHeight * numPhotos) + (previewPhotoGap * (numPhotos - 1)) + previewDatePadding;
          ctx.fillText(captureTime, stripWidth / 2, dateY);
          // Download when all photos are drawn
          const link = document.createElement('a');
          link.download = `cosmic-photobooth-${Date.now()}.jpg`;
          link.href = canvas.toDataURL('image/jpeg', 0.9);
          link.click();
        }
      };
      img.src = photo;
    });
  }, [capturedPhotos, selectedStripStyle]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      {/* Photobooth Banner Title at the Top */}
      <div className="photobooth-banner">
  FOTOJB – POSE WHAT U LIKE!
</div>

      <div className="flex flex-col lg:flex-row items-center gap-8 max-w-7xl w-full">
        {/* Main Camera Area */}
        <div className="card-cosmic flex-1 max-w-2xl">
          <div className="space-y-6">
            {/* Camera Preview */}
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-preview w-full aspect-[4/3]"
                style={{ filter: activeFilter.cssFilter }}
              />
              
              {/* Countdown Overlay */}
              {isCountingDown && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl">
                  <div className="countdown-number">
                    {countdownValue}
                  </div>
                </div>
              )}

              {/* Camera icon when not capturing */}
              {!stream && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/20 rounded-2xl">
                  <Camera className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Countdown Selector */}
              <div className="flex items-center gap-4">
                <label className="text-lg font-medium text-foreground">
                  Countdown:
                </label>
                <Select value={countdownTime.toString()} onValueChange={(value) => setCountdownTime(Number(value))}>
                  <SelectTrigger className="w-32 bg-card/80 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="3">3s</SelectItem>
                    <SelectItem value="5">5s</SelectItem>
                    <SelectItem value="10">10s</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Capture Button */}
              <Button
                onClick={startPhotoSequence}
                disabled={isCapturing || !stream}
                className="btn-cosmic w-full"
              >
                <Play className="w-5 h-5 mr-2" />
                {isCapturing ? 'Taking Photos...' : 'Start Capture (3 photos)'}
              </Button>
            </div>
          </div>
        </div>

        {/* Photo Strip Style Selection */}
        {capturedPhotos.length > 0 && (
          <>
            <div className="mb-4 flex flex-col items-center">
              <label htmlFor="strip-style" className="font-semibold mb-2">Choose Strip Style:</label>
              <select
                id="strip-style"
                value={selectedStripStyle}
                onChange={e => setSelectedStripStyle(e.target.value)}
                className="border rounded px-3 py-1 bg-card/80"
              >
                {stripStyles.map(style => (
                  <option key={style.className} value={style.className}>{style.name}</option>
                ))}
              </select>
              {selectedStripStyle === 'strip-custom' && (
                <div className="mt-2 flex items-center gap-2">
                  <label htmlFor="custom-color" className="text-sm">Pick Color:</label>
                  <input
                    id="custom-color"
                    type="color"
                    value={customColor}
                    onChange={e => setCustomColor(e.target.value)}
                    className="w-8 h-8 border rounded"
                  />
                </div>
              )}
            </div>
            <div className={`photo-strip w-80 ${selectedStripStyle}`} style={selectedStripStyle === 'strip-custom' ? { background: customColor, position: 'relative' } : { position: 'relative' }}>
              {/* Butterfly SVGs for Flower style */}
              {selectedStripStyle === 'strip-flower' && (
                <>
                  <div style={{ position: 'absolute', left: -20, top: 10 }}>
                    <svg width="40" height="40" viewBox="0 0 40 40"><g><ellipse cx="20" cy="10" rx="8" ry="12" fill="#ffb6b9"/><ellipse cx="20" cy="30" rx="8" ry="12" fill="#b6e2ff"/><ellipse cx="10" cy="20" rx="12" ry="8" fill="#c3f584"/><ellipse cx="30" cy="20" rx="12" ry="8" fill="#f7e1ff"/></g></svg>
                  </div>
                  <div style={{ position: 'absolute', right: -20, bottom: 10 }}>
                    <svg width="40" height="40" viewBox="0 0 40 40"><g><ellipse cx="20" cy="10" rx="8" ry="12" fill="#ffb6b9"/><ellipse cx="20" cy="30" rx="8" ry="12" fill="#b6e2ff"/><ellipse cx="10" cy="20" rx="12" ry="8" fill="#c3f584"/><ellipse cx="30" cy="20" rx="12" ry="8" fill="#f7e1ff"/></g></svg>
                  </div>
                </>
              )}
              {/* Heart SVGs for Heart style */}
              {selectedStripStyle === 'strip-heart' && (
                <>
                  <div style={{ position: 'absolute', left: 10, top: 10 }}>
                    <svg width="32" height="32" viewBox="0 0 32 32"><path d="M16 29s-13-8.35-13-17A7 7 0 0 1 16 7a7 7 0 0 1 13 5c0 8.65-13 17-13 17z" fill="#ff69b4"/></svg>
                  </div>
                  <div style={{ position: 'absolute', right: 10, bottom: 10 }}>
                    <svg width="32" height="32" viewBox="0 0 32 32"><path d="M16 29s-13-8.35-13-17A7 7 0 0 1 16 7a7 7 0 0 1 13 5c0 8.65-13 17-13 17z" fill="#ff69b4"/></svg>
                  </div>
                </>
              )}
              {/* Sticker overlays */}
              {/* Top message */}
              <div className="w-full text-center font-bold text-lg py-2" style={{ fontFamily: 'Times New Roman' }}>Captured by FotoJB</div>
              <div className="space-y-2">
                {capturedPhotos.map((photo, index) => (
                  <div key={index} style={{ position: 'relative', width: '100%' }}>
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full aspect-[4/3] object-cover rounded-lg"
                      style={{ filter: activeFilter.cssFilter }}
                    />
                    {selectedStickerTheme !== 'none' && (() => {
                      const theme = STICKER_THEMES.find(t => t.value === selectedStickerTheme);
                      if (!theme || !theme.images.length) return null;
                      const stickerSrc = theme.images[0];
                      const stickerSize = 32;
                      // Place 7-8 stickers at random positions in the preview
                      const stickerCount = Math.floor(Math.random() * 2) + 7;
                      const stickers = Array.from({ length: stickerCount }).map((_, s) => {
                        const margin = 8;
                        const randX = margin + Math.random() * (100 - (stickerSize / 3)); // percent width
                        const randY = margin + Math.random() * (100 - (stickerSize / 3)); // percent height
                        const angle = Math.random() * 360;
                        return (
                          <img
                            key={s}
                            src={stickerSrc}
                            alt="sticker"
                            style={{
                              position: 'absolute',
                              left: `${randX}%`,
                              top: `${randY}%`,
                              width: stickerSize,
                              height: stickerSize,
                              transform: `rotate(${angle}deg)`,
                              pointerEvents: 'none',
                            }}
                          />
                        );
                      });
                      return stickers;
                    })()}
                  </div>
                ))}
                {/* Bottom date and time only */}
                <div className="w-full text-center text-sm py-2 text-muted-foreground">
                  {captureTime}
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
              onClick={() => downloadPhotoStrip(selectedStripStyle, customColor)}
                    variant="outline"
                    className="flex-1 bg-card/80 border-border hover:bg-accent/20"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={() => window.print()}
                    variant="outline"
                    className="flex-1 bg-card/80 border-border hover:bg-accent/20"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="w-full max-w-4xl">
        <h3 className="text-lg font-bold text-center text-foreground mb-4">
          Choose Your Cosmic Filter
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter.name}
              onClick={() => setActiveFilter(filter)}
              className={`btn-filter ${activeFilter.name === filter.name ? 'active' : ''}`}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CosmicPhotobooth;
