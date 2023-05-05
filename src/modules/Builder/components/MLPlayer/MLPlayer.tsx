import ReactPlayer from 'react-player/lazy';

import { StyledClearedButton, StyledTitleSmall, theme } from 'shared/styles';
import { Svg } from 'shared/components';

import {
  StyledFooter,
  StyledHeader,
  StyledName,
  StyledNameWrapper,
  StyledPlayerWrapper,
  StyledSlider,
} from './MLPlayer.styles';
import { MLPlayerProps } from './MLPlayer.types';
import { useMLPlayerSetup } from './MLPlayer.hooks';

export const MLPlayer = ({ media, onRemove }: MLPlayerProps) => {
  const {
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
  } = useMLPlayerSetup(media);

  return (
    <StyledPlayerWrapper>
      <ReactPlayer
        ref={playerRef}
        width="0"
        height="0"
        url={url}
        pip={state.pip}
        playing={state.playing}
        controls={state.controls}
        light={state.light}
        loop={state.loop}
        playbackRate={state.playbackRate}
        volume={state.volume}
        muted={state.muted}
        onPlay={handlePlay}
        onPause={handlePause}
        onProgress={handleProgress}
        onDuration={handleDuration}
      />
      <StyledHeader>
        <StyledClearedButton onClick={handlePlayPause}>
          <Svg id={state.playing ? 'pause' : 'play'} width={24} height={24} />
        </StyledClearedButton>
      </StyledHeader>
      <StyledNameWrapper>
        {uploaded && <Svg id="check" width={18} height={18} />}
        <StyledName sx={{ marginRight: theme.spacing(0.4) }} title={fileName}>
          {fileName}
        </StyledName>
        <StyledClearedButton onClick={onRemove}>
          <Svg id="close" width={18} height={18} />
        </StyledClearedButton>
      </StyledNameWrapper>
      <StyledSlider
        size="medium"
        min={0}
        max={1}
        step={0.01}
        value={state.played}
        onChange={handleSeekChange}
        onChangeCommitted={handleSeekMouseUp}
      />
      <StyledFooter>
        <StyledTitleSmall>{elapsedTime}</StyledTitleSmall>
        <StyledTitleSmall>{duration}</StyledTitleSmall>
      </StyledFooter>
    </StyledPlayerWrapper>
  );
};
