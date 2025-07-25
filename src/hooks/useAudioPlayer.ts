import { useState, useRef, useEffect } from 'react';

interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isRepeat: boolean;
  repeatTime: number;
  repeatStartTime: number | null;
}

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    isRepeat: false,
    repeatTime: 3,
    repeatStartTime: null
  });

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setAudioState(prev => ({
        ...prev,
        currentTime: audio.currentTime
      }));
    };

    const handleLoadedMetadata = () => {
      setAudioState(prev => ({
        ...prev,
        duration: audio.duration || 0
      }));
    };

    const handlePlay = () => {
      setAudioState(prev => ({
        ...prev,
        isPlaying: true
      }));
    };

    const handlePause = () => {
      setAudioState(prev => ({
        ...prev,
        isPlaying: false
      }));
    };

    const handleEnded = () => {
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        currentTime: 0
      }));
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);


    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  const loadAudio = (url: string) => {
    if (audioRef.current) {
      audioRef.current.src = url;
      setAudioState(prev => ({
        ...prev,
        currentTime: 0,
        duration: 0,
        repeatStartTime: null
      }));
    }
  };

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioState(prev => ({
        ...prev,
        currentTime: 0,
        repeatStartTime: null
      }));
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setAudioState(prev => ({
        ...prev,
        volume
      }));
    }
  };

  const setPlaybackRate = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setAudioState(prev => ({
        ...prev,
        playbackRate: rate
      }));
    }
  };

  const seekForward = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.min(audioRef.current.currentTime + seconds, audioRef.current.duration);
      audioRef.current.currentTime = newTime;
    }
  };

  const seekBackward = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(audioRef.current.currentTime - seconds, 0);
      audioRef.current.currentTime = newTime;
    }
  };

  const toggleRepeat = () => {
    setAudioState(prev => {
      const newIsRepeat = !prev.isRepeat;
      return {
        ...prev,
        isRepeat: newIsRepeat,
        // Set repeatStartTime to current time when enabling repeat
        repeatStartTime: newIsRepeat ? prev.currentTime : null
      };
    });
  };

  const setRepeatTime = (time: number) => {
    setAudioState(prev => ({
      ...prev,
      repeatTime: time
    }));
  };

  // Check for repeat functionality
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdateForRepeat = () => {
      if (audioState.isRepeat && audioState.duration > 0 && audioState.repeatStartTime !== null) {
        // Check if we've reached the end of the repeat section
        const repeatEndTime = Math.min(
          audioState.repeatStartTime + audioState.repeatTime,
          audioState.duration
        );

        if (audio.currentTime >= repeatEndTime) {
          // Reset to the start of the repeat section
          audio.currentTime = audioState.repeatStartTime;
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdateForRepeat);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdateForRepeat);
    };
  }, [audioState.isRepeat, audioState.duration, audioState.repeatStartTime, audioState.repeatTime]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when audio is loaded
      if (!audioRef.current || audioState.duration === 0) return;

      // Check if Alt key is pressed
      if (!e.altKey) return;

      switch (e.key.toLowerCase()) {
        case 'j':
          e.preventDefault();
          seekBackward(3);
          break;
        case 'k':
          e.preventDefault();
          seekForward(3);
          break;
        case 'h':
          e.preventDefault();
          seekBackward(5);
          break;
        case 'l':
          e.preventDefault();
          seekForward(5);
          break;
        case 'n':
          e.preventDefault();
          toggleRepeat();
          break;
        case 'p':
          e.preventDefault();
          if (audioState.isPlaying) {
            pause();
          } else {
            play();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [audioState.duration]);

  return {
    ...audioState,
    loadAudio,
    play,
    pause,
    stop,
    seek,
    setVolume,
    setPlaybackRate,
    seekForward,
    seekBackward,
    toggleRepeat,
    setRepeatTime,
    audioRef: audioRef.current
  };
};