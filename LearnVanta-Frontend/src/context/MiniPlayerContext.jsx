import React, { createContext, useContext, useState, useCallback } from "react";

const MiniPlayerContext = createContext(null);

export const MiniPlayerProvider = ({ children }) => {
  const [miniPlayerVideo, setMiniPlayerVideo] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  const openMiniPlayer = useCallback((video, time = 0) => {
    setMiniPlayerVideo(video);
    setCurrentTime(time);
    setIsMinimized(true);
  }, []);

  const closeMiniPlayer = useCallback(() => {
    setMiniPlayerVideo(null);
    setCurrentTime(0);
    setIsMinimized(false);
  }, []);

  const updateTime = useCallback((time) => {
    setCurrentTime(time);
  }, []);

  const expandPlayer = useCallback(() => {
    setIsMinimized(false);
  }, []);

  return (
    <MiniPlayerContext.Provider
      value={{
        miniPlayerVideo,
        currentTime,
        isMinimized,
        openMiniPlayer,
        closeMiniPlayer,
        updateTime,
        expandPlayer,
      }}
    >
      {children}
    </MiniPlayerContext.Provider>
  );
};

export const useMiniPlayer = () => {
  const context = useContext(MiniPlayerContext);
  if (!context) {
    throw new Error("useMiniPlayer must be used within a MiniPlayerProvider");
  }
  return context;
};
