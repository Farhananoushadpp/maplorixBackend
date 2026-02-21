import { useState, useEffect } from 'react';

const useVideoOptimization = () => {
  const [loadedVideos, setLoadedVideos] = useState(new Set());
  const [videoElements, setVideoElements] = useState({});

  const markVideoLoaded = (videoId) => {
    setLoadedVideos(prev => new Set(prev).add(videoId));
  };

  const registerVideoElement = (videoId, element) => {
    setVideoElements(prev => ({ ...prev, [videoId]: element }));
  };

  const playVideoWhenVisible = (videoId) => {
    const video = videoElements[videoId];
    if (video && loadedVideos.has(videoId)) {
      video.play().catch(err => console.log('Video play failed:', err));
    }
  };

  return {
    loadedVideos,
    markVideoLoaded,
    registerVideoElement,
    playVideoWhenVisible
  };
};

export default useVideoOptimization;
