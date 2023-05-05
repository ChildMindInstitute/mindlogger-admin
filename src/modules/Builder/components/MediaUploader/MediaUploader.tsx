import { Trans, useTranslation } from 'react-i18next';

import {
  StyledBodyMedium,
  StyledFlexColumn,
  StyledLinearProgress,
  StyledLabelBoldLarge,
  theme,
  variables,
} from 'shared/styles';
import { Svg } from 'shared/components';
import { byteFormatter } from 'shared/utils';
import { MAX_FILE_SIZE_8MB } from 'shared/consts';

import { StyledContainer, StyledSourceContainer, StyledPreview } from './MediaUploader.styles';
import { useMediaUploader } from './MediaUploader.hooks';
import { MediaUploaderProps } from './MediaUploader.types';
import { MLPlayer } from '../MLPlayer';

export const MediaUploader = ({
  width,
  height,
  media,
  placeholder,
  hasPreview,
  onUpload,
}: MediaUploaderProps) => {
  const { t } = useTranslation('app');
  const { uploadInputRef, error, dragEvents, handleChange, onRemove } = useMediaUploader({
    onUpload,
  });

  return (
    <>
      <input
        ref={uploadInputRef}
        onChange={handleChange}
        accept="audio/mp3,audio/wav"
        type="file"
        name="uploadFile"
        hidden
      />
      {!media && (
        <StyledContainer
          width={width}
          height={height}
          onClick={() => uploadInputRef?.current?.click()}
          {...dragEvents}
        >
          <StyledSourceContainer>
            <Svg id="audio-player-filled" width={32} height={42} />
            {error && (
              <StyledBodyMedium
                sx={{ marginBottom: theme.spacing(1) }}
                color={variables.palette.semantic.error}
              >
                {t(error, { size: byteFormatter(MAX_FILE_SIZE_8MB) })}
              </StyledBodyMedium>
            )}
            <StyledBodyMedium sx={{ m: theme.spacing(1, 0) }}>
              {placeholder ?? (
                <Trans i18nKey="dropAudio">
                  Drop Audio here <br /> or <span>click to browse</span>.
                </Trans>
              )}
            </StyledBodyMedium>
          </StyledSourceContainer>
        </StyledContainer>
      )}
      {!!media && hasPreview && (
        <StyledFlexColumn sx={{ mr: theme.spacing(3.2) }}>
          <StyledLabelBoldLarge sx={{ color: variables.palette.primary }}>
            <StyledPreview>
              {media.uploaded && <Svg id="check" width={16} height={16} />}
              {media?.name}
            </StyledPreview>
          </StyledLabelBoldLarge>
          {!media.uploaded && <StyledLinearProgress />}
        </StyledFlexColumn>
      )}
      {!!media && !hasPreview && <MLPlayer media={media} onRemove={onRemove} />}
    </>
  );
};
