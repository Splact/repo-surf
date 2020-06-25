import { useState, useCallback, useEffect } from "react";

import LoadingManager from "./LoadingManager";
export { RESOURCE_TYPE_FETCH, RESOURCE_TYPE_FONT } from "./LoadingManager";

const loadingManager = new LoadingManager();

export const useLoadingState = () => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);

  const handleStart = useCallback(() => {
    console.log("Start loading...");
  }, []);
  const handleProgress = useCallback(
    progress => {
      setProgress(progress);
    },
    [setProgress]
  );
  const handleLoad = useCallback(() => {
    console.log("Loading complete! 👌");
    setProgress(1);
  }, [setProgress]);
  const handleError = useCallback(
    url => {
      console.log(`Error loading "${url}" 👌`);
      setError(true);
    },
    [setError]
  );

  useEffect(() => {
    loadingManager.init({
      onStart: handleStart,
      onProgress: handleProgress,
      onLoad: handleLoad,
      onError: handleError
    });
  }, [handleStart, handleProgress, handleLoad, handleError]);

  return { progress, error };
};

export default loadingManager;
