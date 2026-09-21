import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, X, Loader2, AlertCircle } from 'lucide-react';
import { DietaryType } from '../../types/menu';
import { SafeImage } from '../common/SafeImage';
import { DietaryIndicator } from './DietaryIndicator';
import { resolveImageUrl, resolveVideoSource, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageResolver';

export type MediaState = 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'ended' | 'error' | 'fallback';

interface FoodDetailMediaProps {
  imageUrl: string;
  videoUrl?: string | null;
  youtubeVideoId?: string | null;
  youtubeVideoUrl?: string | null;
  foodName: string;
  categoryName?: string;
  dietaryType?: DietaryType;
  offerLabel?: string | null;
  onClose?: () => void;
  closeButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

export function FoodDetailMedia({
  imageUrl,
  videoUrl,
  youtubeVideoId,
  youtubeVideoUrl,
  foodName,
  categoryName,
  dietaryType,
  offerLabel,
  onClose,
  closeButtonRef,
}: FoodDetailMediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const youtubeIframeRef = useRef<HTMLIFrameElement | null>(null);
  
  const effectiveVideoUrl = youtubeVideoUrl || (youtubeVideoId ? `https://www.youtube.com/watch?v=${youtubeVideoId}` : videoUrl);
  const videoSource = resolveVideoSource(effectiveVideoUrl);
  
  // Use YouTube thumbnail if food image is default and YouTube video is provided
  const effectiveImageUrl = (videoSource.type === 'youtube' && videoSource.thumbnailUrl && (!imageUrl || imageUrl.includes('default-fallback_image')))
    ? videoSource.thumbnailUrl
    : imageUrl;

  const resolvedImageSrc = resolveImageUrl(effectiveImageUrl, DEFAULT_FALLBACK_IMAGE);

  const [mediaState, setMediaState] = useState<MediaState>('idle');
  const [isMuted, setIsMuted] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showControlsOverlay, setShowControlsOverlay] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Send JS API postMessage commands to YouTube iframe
  const postYouTubeCommand = useCallback((command: 'playVideo' | 'pauseVideo' | 'mute' | 'unMute') => {
    if (youtubeIframeRef.current && youtubeIframeRef.current.contentWindow) {
      youtubeIframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: '' }),
        '*'
      );
    }
  }, []);

  // Reset media state when video source or image source changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setMediaState(videoSource.type ? 'idle' : 'fallback');
    setCurrentTime(0);
    setDuration(0);
    setImageError(false);
  }, [videoSource.type, videoSource.url, imageUrl]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const triggerControlsOverlay = useCallback(() => {
    setShowControlsOverlay(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControlsOverlay(false);
    }, 3000);
  }, []);

  const handlePlay = async () => {
    if (!videoSource.type) return;

    if (videoSource.type === 'youtube') {
      postYouTubeCommand('playVideo');
      postYouTubeCommand(isMuted ? 'mute' : 'unMute');
      setMediaState('playing');
      triggerControlsOverlay();
      return;
    }

    if (!videoRef.current) return;

    try {
      setMediaState('loading');
      videoRef.current.muted = isMuted;
      await videoRef.current.play();
      setMediaState('playing');
      triggerControlsOverlay();
    } catch {
      setMediaState('error');
    }
  };

  const handlePause = () => {
    if (videoSource.type === 'youtube') {
      postYouTubeCommand('pauseVideo');
      setMediaState('paused');
      setShowControlsOverlay(true);
      return;
    }

    if (!videoRef.current) return;
    videoRef.current.pause();
    setMediaState('paused');
    setShowControlsOverlay(true);
  };

  const handleTogglePlayPause = () => {
    if (mediaState === 'playing') {
      handlePause();
    } else if (mediaState === 'paused' || mediaState === 'idle' || mediaState === 'ready') {
      handlePlay();
    } else if (mediaState === 'ended') {
      handleReplay();
    }
  };

  const handleReplay = async () => {
    if (videoSource.type === 'youtube') {
      postYouTubeCommand('playVideo');
      postYouTubeCommand(isMuted ? 'mute' : 'unMute');
      setMediaState('playing');
      triggerControlsOverlay();
      return;
    }

    if (!videoRef.current) return;
    try {
      videoRef.current.currentTime = 0;
      setMediaState('loading');
      await videoRef.current.play();
      setMediaState('playing');
      triggerControlsOverlay();
    } catch {
      setMediaState('error');
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (videoSource.type === 'youtube') {
      postYouTubeCommand(nextMuted ? 'mute' : 'unMute');
    } else if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
    triggerControlsOverlay();
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime || 0);
    }
  };

  const handleVideoEnded = () => {
    setMediaState('ended');
    setShowControlsOverlay(true);
  };

  const handleVideoError = () => {
    setMediaState('error');
  };

  const finalPosterImage = imageError ? DEFAULT_FALLBACK_IMAGE : resolvedImageSrc;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className="relative aspect-[16/10] sm:aspect-[16/9] w-full shrink-0 bg-[#121216] overflow-hidden group select-none cursor-pointer"
      onClick={() => {
        if (mediaState === 'playing') {
          handlePause();
        } else if (mediaState === 'paused') {
          handlePlay();
        }
      }}
    >
      {/* 1. Base Poster Image */}
      <SafeImage
        src={finalPosterImage}
        alt={foodName}
        loading="eager"
        decoding="async"
        onError={() => setImageError(true)}
        onLoad={() => setImageLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          mediaState === 'playing' ? 'opacity-0' : 'opacity-100'
        } ${imageLoaded ? 'brightness-95' : 'opacity-0'}`}
      />

      {/* Image Loading Skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-[#1B1B22] animate-pulse" />
      )}

      {/* Top and Bottom Cinematic Gradient Vignettes */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#151518] via-transparent to-black/60 pointer-events-none z-10" />

      {/* 2A. Direct HTML5 Video Element */}
      {videoSource.type === 'direct' && (
        <video
          ref={videoRef}
          src={videoSource.url}
          playsInline
          muted={isMuted}
          preload="metadata"
          onLoadedMetadata={handleVideoLoadedMetadata}
          onTimeUpdate={handleVideoTimeUpdate}
          onEnded={handleVideoEnded}
          onError={handleVideoError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-0 ${
            mediaState === 'playing' || mediaState === 'paused' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* 2B. Stealth YouTube Embedded Iframe (Cropped UI & Pointer Protection) */}
      {videoSource.type === 'youtube' && (mediaState === 'playing' || mediaState === 'paused') && (
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black pointer-events-none">
          <iframe
            ref={youtubeIframeRef}
            src={videoSource.url}
            title={`${foodName} Video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={false}
            className="w-[135%] h-[135%] -top-[17.5%] -left-[17.5%] absolute border-0 object-cover scale-125 pointer-events-none"
          />
        </div>
      )}

      {/* 3. Close Button (Over media top right) */}
      {onClose && (
        <button
          ref={closeButtonRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close food details"
          className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white/90 hover:text-white flex items-center justify-center border border-white/15 transition-all shadow-lg cursor-pointer active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* 4. Center Play & Pause Overlay Controls (Strictly Play/Pause Only - Zero Prev/Next) */}
      
      {/* STATE: Idle / Poster (Show Cinematic Play Button) */}
      {videoSource.type && (mediaState === 'idle' || mediaState === 'ready') && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
            aria-label="Play food video"
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-black/50 hover:bg-[#E5A93C] text-white hover:text-black border-2 border-white/30 hover:border-[#E5A93C] backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-2xl hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
          </button>
        </div>
      )}

      {/* STATE: Video Loading */}
      {mediaState === 'loading' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs text-white">
          <Loader2 className="w-10 h-10 animate-spin text-[#E5A93C] mb-2" />
          <span className="text-xs font-semibold tracking-wide text-white/90">Loading video...</span>
        </div>
      )}

      {/* STATE: Video Paused (Show Center Play Button Overlay) */}
      {mediaState === 'paused' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
            aria-label="Play food video"
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-black/60 hover:bg-[#E5A93C] text-white hover:text-black border-2 border-white/40 hover:border-[#E5A93C] backdrop-blur-md flex items-center justify-center transition-all shadow-2xl cursor-pointer"
          >
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
          </button>
        </div>
      )}

      {/* STATE: Video Ended (Show Replay/Play Again Button) */}
      {mediaState === 'ended' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-xs text-white pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleReplay();
            }}
            aria-label="Replay food video"
            className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#E5A93C] hover:bg-[#FBBF24] text-black font-extrabold text-sm shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            <span>Play Again</span>
          </button>
        </div>
      )}

      {/* STATE: Video Error */}
      {mediaState === 'error' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-xs text-white p-4 text-center pointer-events-auto">
          <AlertCircle className="w-8 h-8 text-rose-400 mb-2" />
          <p className="text-sm font-semibold text-white/90 mb-3">
            Unable to play this video.
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
            aria-label="Try video playback again"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* STATE: Video Playing / Paused - Custom King's Platter Strictly Play / Pause & Mute Control Bar */}
      {(mediaState === 'playing' || mediaState === 'paused') && showControlsOverlay && (
        <div className="absolute bottom-12 left-0 right-0 z-20 px-4 py-2 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-between transition-opacity duration-200 pointer-events-auto">
          <div className="flex items-center justify-between w-full">
            {/* Dedicated Play / Pause Control */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleTogglePlayPause();
              }}
              aria-label={mediaState === 'playing' ? 'Pause food video' : 'Play food video'}
              className="flex items-center gap-2 text-white hover:text-[#E5A93C] font-semibold text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              {mediaState === 'playing' ? (
                <>
                  <Pause className="w-4 h-4 fill-current text-[#E5A93C]" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-[#E5A93C]" />
                  <span>Play</span>
                </>
              )}
            </button>

            {/* Mute / Unmute Sound Control */}
            <button
              type="button"
              onClick={handleToggleMute}
              aria-label={isMuted ? 'Unmute food video' : 'Mute food video'}
              className="text-white hover:text-[#E5A93C] bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* 5. Food Badges (Over media bottom left & bottom right) */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex items-end justify-between pointer-events-none">
        <div className="flex flex-wrap items-center gap-2">
          {dietaryType && (
            <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 flex items-center gap-2">
              <DietaryIndicator type={dietaryType} showLabel={true} size="md" />
            </div>
          )}

          {categoryName && (
            <span className="bg-[#24242C]/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-[#D4D4DE] border border-white/15">
              {categoryName}
            </span>
          )}
        </div>

        {offerLabel && (
          <span className="bg-[#E5A93C] text-black px-3 py-0.5 rounded-full text-xs font-extrabold shadow-lg">
            {offerLabel}
          </span>
        )}
      </div>
    </div>
  );
}

