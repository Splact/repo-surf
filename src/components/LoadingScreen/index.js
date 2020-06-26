import classnames from "classnames";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";

import "./style.scss";

const MESSAGES = ["status", "fetch", "checkout", "pull", "log"];

const LoadingScreen = ({ loaded: isLoaded, progress: targetProgress }) => {
  const progressContainer = useRef();
  const progress = useRef(0);
  const animation = useRef(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const isFullyLoaded = progress.current === 1 && isLoaded;

  const handleTransitionEnd = useCallback(() => {
    if (!isFullyLoaded) {
      return;
    }

    setIsVisible(false);
  }, [isFullyLoaded]);

  const handleProgressAnimation = useCallback(() => {
    if (
      !animation.current ||
      animation.current.targetProgress === progress.current
    ) {
      // target reached, interrupt animation
      animation.current = null;
      return;
    }

    // update progress
    progress.current +=
      (animation.current.targetProgress - progress.current) * 0.05;
    const newProgressValue = Math.round(progress.current * 100);
    if (newProgressValue === 100) {
      // if round value is 100, update progress to 1 and interrupt animation
      progress.current = 1;
    }
    progressContainer.current.textContent = newProgressValue;

    // check for new message
    const newMessageIndex = Math.floor(
      progress.current * (MESSAGES.length - 1)
    );

    if (newMessageIndex !== animation.current.messageIndex) {
      // if message changed fire new render
      setMessageIndex(newMessageIndex);
    }

    animation.current.raf = requestAnimationFrame(handleProgressAnimation);
  }, []);

  useEffect(() => {
    if (!animation.current) {
      animation.current = {
        raf: requestAnimationFrame(handleProgressAnimation),
        targetProgress,
        messageIndex
      };
    }

    return () => {
      if (animation.current) {
        cancelAnimationFrame(animation.current.raf);
        animation.current = null;
      }
    };
  }, [handleProgressAnimation, targetProgress, messageIndex]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={classnames("LoadingScreen", {
        "LoadingScreen--visible": !isFullyLoaded
      })}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="LoadingScreen__inner">
        <div ref={progressContainer} className="LoadingScreen__progress">
          {Math.round(progress.current * 100)}
        </div>
        <div className="LoadingScreen__messages">
          <SwitchTransition>
            <CSSTransition
              key={MESSAGES[messageIndex]}
              timeout={300}
              classNames="LoadingScreen__message-"
            >
              <div className="LoadingScreen__message">
                {MESSAGES[messageIndex]}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
