import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music as MusicIcon, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "SynthAI Beta",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop",
    color: "cyan"
  },
  {
    id: 2,
    title: "Cyberpunk Dreams",
    artist: "Neural Drift",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop",
    color: "rose"
  },
  {
    id: 3,
    title: "Digital Rain",
    artist: "Flow Machine",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=400&fit=crop",
    color: "purple"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const colorClasses = {
    cyan: {
      bg: "bg-cyan-500",
      bgSoft: "bg-cyan-500/20",
      bgMuted: "bg-cyan-500/10",
      border: "border-cyan-500/50",
      text: "text-cyan-400",
      shadow: "shadow-[0_0_20px_rgba(34,211,238,0.2)]",
      glow: "shadow-[0_0_10px_rgba(6,182,212,0.5)]"
    },
    fuchsia: {
      bg: "bg-fuchsia-500",
      bgSoft: "bg-fuchsia-500/20",
      bgMuted: "bg-fuchsia-500/10",
      border: "border-fuchsia-500/50",
      text: "text-fuchsia-400",
      shadow: "shadow-[0_0_20px_rgba(217,70,239,0.2)]",
      glow: "shadow-[0_0_10px_rgba(217,70,239,0.5)]"
    },
    purple: {
      bg: "bg-purple-500",
      bgSoft: "bg-purple-500/20",
      bgMuted: "bg-purple-500/10",
      border: "border-purple-500/50",
      text: "text-purple-400",
      shadow: "shadow-[0_0_20px_rgba(168,85,247,0.2)]",
      glow: "shadow-[0_0_10px_rgba(168,85,247,0.5)]"
    }
  }[currentTrack.color === 'rose' ? 'fuchsia' : currentTrack.color as 'cyan' | 'fuchsia' | 'purple'];

  return (
    <div className="w-full max-w-md bg-black border-2 border-white/20 p-8 shadow-[8px_8px_0px_rgba(255,255,255,0.1)] overflow-hidden relative group">
      {/* Decorative background glow */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 ${colorClasses.bgSoft} rounded-full blur-3xl transition-colors duration-1000`} />
      
      <div className="flex flex-col items-center gap-8 relative z-10">
        {/* Album Art */}
        <div className="relative">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="w-48 h-48 overflow-hidden border-4 border-white shadow-[0_0_30px_rgba(255,211,238,0.1)] relative flex items-center justify-center bg-zinc-900"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className={`w-full h-full object-cover transition-grayscale duration-500 ${isPlaying ? 'grayscale-0' : 'grayscale'}`} 
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
               <div className="w-12 h-12 bg-white flex items-center justify-center">
                 <Disc className={`w-8 h-8 text-black ${isPlaying ? 'animate-spin' : ''}`} />
               </div>
            </div>
          </motion.div>
        </div>

        {/* Track Info */}
        <div className="text-center space-y-2 w-full">
          <AnimatePresence mode="wait">
            <motion.h3
              key={currentTrack.title}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              data-text={currentTrack.title.toUpperCase()}
              className="text-3xl font-black text-white tracking-widest uppercase font-mono tear-effect"
            >
              {currentTrack.title}
            </motion.h3>
          </AnimatePresence>
          <p className="text-cyan-400 font-mono text-xs uppercase tracking-[0.4em] opacity-80">
            {currentTrack.artist}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-4">
          <div className="h-4 w-full bg-zinc-900 border-2 border-white/20 p-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full ${colorClasses.bg} transition-all duration-100`}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-[0.5em]">
            <span>DATA::STREAM</span>
            <span className="text-white">ENCRYPTED_LINK_08</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-10">
          <button 
            onClick={handlePrev}
            className="text-white hover:text-cyan-400 transition-colors hover:scale-125 active:scale-90"
          >
            <SkipBack className="w-8 h-8" />
          </button>
          
          <button 
            onClick={togglePlay}
            className={`w-20 h-20 bg-white flex items-center justify-center transition-all shadow-[4px_4px_0px_#ff00ff] hover:shadow-none hover:translate-x-1 hover:translate-y-1`}
          >
            {isPlaying ? (
              <Pause className={`w-10 h-10 text-black fill-current`} />
            ) : (
              <Play className={`w-10 h-10 text-black fill-current ml-1`} />
            )}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-white hover:text-fuchsia-400 transition-colors hover:scale-125 active:scale-90"
          >
            <SkipForward className="w-8 h-8" />
          </button>
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleNext}
        />
      </div>
    </div>
  );
};
