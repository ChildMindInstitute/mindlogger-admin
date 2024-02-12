import { Trans, useTranslation } from 'react-i18next';

import {
  StyledBodyMedium,
  StyledFlexColumn,
  StyledLinearProgress,
  StyledLabelBoldLarge,
  theme,
  variables,
  StyledTitleSmall,
} from 'shared/styles';
import { Svg } from 'shared/components/Svg';
import { byteFormatter } from 'shared/utils';
import { MAX_FILE_SIZE_150MB, ALLOWED_AUDIO_FILE_TYPES } from 'shared/consts';

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
  'data-testid': dataTestid,
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
        accept={ALLOWED_AUDIO_FILE_TYPES}
        type="file"
        name="uploadFile"
        data-testid="media-uploader-input"
        hidden
      />
      {!media && (
        <StyledContainer
          width={width}
          height={height}
          onClick={() => uploadInputRef?.current?.click()}
          {...dragEvents}
          data-testid={dataTestid}
        >
          <StyledSourceContainer>
            <Svg id="audio-player-filled" width={32} height={42} />
            {error && (
              <StyledBodyMedium sx={{ marginBottom: theme.spacing(1) }} color={variables.palette.semantic.error}>
                {t(error, { size: byteFormatter(MAX_FILE_SIZE_150MB) })}
              </StyledBodyMedium>
            )}
            {placeholder ?? (
              <StyledTitleSmall sx={{ textAlign: 'center', m: theme.spacing(1, 0) }}>
                <Trans i18nKey="mediaUploaderPlaceholder">
                  Drop <strong>.mp3</strong> or <strong>.wav</strong> here <br />
                  or <span>click to browse</span>.
                </Trans>
              </StyledTitleSmall>
            )}
          </StyledSourceContainer>
        </StyledContainer>
      )}
      {!!media && hasPreview && (
        <StyledFlexColumn sx={{ mr: theme.spacing(3.2) }}>
          <StyledPreview>
            {media.uploaded && <Svg id="check" width={16} height={16} />}
            <StyledLabelBoldLarge sx={{ color: variables.palette.primary }}>{media?.name}</StyledLabelBoldLarge>
          </StyledPreview>
          {!media.uploaded && <StyledLinearProgress sx={{ mt: theme.spacing(0.5) }} />}
        </StyledFlexColumn>
      )}
      {!!media && !hasPreview && (
        <MLPlayer media={media} onRemove={onRemove} data-testid={`${dataTestid}-media-player`} />
      )}
    </>
  );
};
