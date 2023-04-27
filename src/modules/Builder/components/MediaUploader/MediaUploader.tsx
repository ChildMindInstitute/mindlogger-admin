import { Trans, useTranslation } from 'react-i18next';

import { StyledBodyMedium, StyledTitleTooltipIcon, theme, variables } from 'shared/styles';
import { Svg, Tooltip } from 'shared/components';
import { byteFormatter } from 'shared/utils';
import { MAX_FILE_SIZE_8MB } from 'shared/consts';

import {
  StyledContainer,
  StyledNameWrapper,
  StyledSourceContainer,
  StyledTitle,
} from './MediaUploader.styles';
import { useMediaUploader } from './MediaUploader.hooks';
import { MediaUploaderProps } from './MediaUploader.types';
import { MLPlayer } from '../MLPlayer';

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
            <Tooltip
              tooltipTitle={t('uploadAudioRestrictions', {
                size: byteFormatter(MAX_FILE_SIZE_8MB),
              })}
            >
              <span>
                <StyledTitleTooltipIcon id="more-info-outlined" />
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
                  {t(error, { size: byteFormatter(MAX_FILE_SIZE_8MB) })}
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
