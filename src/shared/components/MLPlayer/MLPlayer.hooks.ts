import { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import { OnProgressProps } from 'react-player/base';
import ReactPlayer from 'react-player';

import { ResourceDataType } from 'shared/components/MediaUploader/MediaUploader.types';

import { MLPlayerStateProps } from './MLPlayer.types';
import { PLAYER_DEFAULTS } from './MLPlayer.const';

const calculateTime = (secs: number) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${minutes}:${returnedSeconds}`;
};

export const useMLPlayerSetup = (resourceData: ResourceDataType | null) => {
  const { name: fileName, url, uploaded } = resourceData ?? {};

  const [state, setState] = useState<MLPlayerStateProps>(PLAYER_DEFAULTS);

  const duration = useMemo(() => calculateTime(state.duration), [state.duration]);
  const elapsedTime = useMemo(
    () => calculateTime(state.duration * state.played),
    [state.duration, state.played],
  );
  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      url,
    }));
  }, [url]);

  const handlePlayPause = () => {
    setState((prevState) => ({
      ...prevState,
      playing: !prevState.playing,
    }));
  };

  const handlePlay = () => {
    setState((prevState) => ({
      ...prevState,
      playing: true,
    }));
  };

  const handlePause = () => {
    setState((prevState) => ({
      ...prevState,
      playing: false,
    }));
  };

  const handleSeekChange = (e: Event, value: number | Array<number>) => {
    setState((prevState) => ({
      ...prevState,
      played: value as number,
      seeking: true,
    }));
  };

  const handleSeekMouseUp = (e: SyntheticEvent | Event, value: number | Array<number>) => {
    setState((prevState) => ({
      ...prevState,
      seeking: false,
    }));

    playerRef.current?.seekTo(value as number);
  };

  const handleProgress = (newState: OnProgressProps) => {
    if (!state.seeking) {
      setState((prevState) => ({
        ...prevState,
        ...newState,
      }));
    }
  };

  const handleDuration = (duration: number) => {
    setState((prevState) => ({
      ...prevState,
      duration,
    }));
  };

  return {
    playerRef,
    state,
    fileName,
    url,
    uploaded,
    duration,
    elapsedTime,
    handlePlayPause,
    handlePause,
    handlePlay,
    handleDuration,
    handleProgress,
    handleSeekChange,
    handleSeekMouseUp,
  };
};
