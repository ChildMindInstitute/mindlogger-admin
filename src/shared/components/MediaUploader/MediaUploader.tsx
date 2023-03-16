import { Trans, useTranslation } from 'react-i18next';

import { StyledBodyMedium, theme, variables } from 'shared/styles';
import { Svg, Tooltip } from 'shared/components/index';

import {
  StyledContainer,
  StyledNameWrapper,
  StyledSourceContainer,
  StyledSvg,
  StyledTitle,
} from 'shared/components/MediaUploader/MediaUploader.styles';
import { useMediaUploader } from 'shared/components/MediaUploader/MediaUploader.hooks';
import { MediaUploaderProps } from 'shared/components/MediaUploader/MediaUploader.types';
import { MLPlayer } from 'shared/components/MLPlayer';

export const MediaUploader = ({
  width,
  height,
  resourceData,
  setResourceData,
}: MediaUploaderProps) => {
  const { t } = useTranslation('app');
  const { uploadInputRef, error, dragEvents, handleChange, onRemove } = useMediaUploader({
    setResourceData,
  });

  return (
    <>
      <input
        ref={uploadInputRef}
        onChange={handleChange}
        accept="audio/*"
        type="file"
        name="uploadFile"
        hidden
      />
      {!resourceData ? (
        <>
          <StyledTitle>
            {t('audio')}
            <Tooltip tooltipTitle={t('uploadAudioRestrictions')}>
              <span>
                <StyledSvg id="more-info-outlined" />
              </span>
            </Tooltip>
          </StyledTitle>
          <StyledContainer
            width={width}
            height={height}
            onClick={() => uploadInputRef?.current?.click()}
            {...dragEvents}
          >
            <StyledSourceContainer>
              <Svg id={'audio-player-filled'} width={32} height={42} />
              {error && (
                <StyledBodyMedium
                  sx={{ marginBottom: theme.spacing(1) }}
                  color={variables.palette.semantic.error}
                >
                  {t(error)}
                </StyledBodyMedium>
              )}
              <StyledBodyMedium sx={{ m: theme.spacing(1, 0) }}>
                <Trans i18nKey="dropAudio">
                  Drop Audio here <br /> or <span>click to browse</span>.
                </Trans>
              </StyledBodyMedium>
            </StyledSourceContainer>
          </StyledContainer>
          <StyledNameWrapper>{t('uploadAudioDescription')}</StyledNameWrapper>
        </>
      ) : (
        <MLPlayer resourceData={resourceData} onRemove={onRemove} />
      )}
    </>
  );
};
