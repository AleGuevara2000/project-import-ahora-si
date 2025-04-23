
import { useCallback } from 'react';

export function useUploadProgressSimulation(setUploadProgress: (progress: number) => void) {
  return useCallback(() => {
    let progress = 10;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15);
      if (progress >= 90) {
        clearInterval(interval);
        progress = 90;
      }
      setUploadProgress(progress);
    }, 800);
    return () => clearInterval(interval);
  }, [setUploadProgress]);
}
