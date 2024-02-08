import { Trans, useTranslation } from 'react-i18next';

import { Svg } from 'shared/components/Svg';
import { StyledBodyMedium, StyledFlexAllCenter, StyledFlexColumn } from 'shared/styles/styledComponents';
import theme from 'shared/styles/theme';

import {
  StyledDashedWrapper,
  StyledEnterText,
  StyledPresentation,
  StyledTooltipText,
} from './TooltipComponents.styles';
import { DashedProps, DashedUiType } from './TooltipComponents.types';

export const Dashed = ({ uiType }: DashedProps) => {
  const { t } = useTranslation();
  const isTextUiType = uiType === DashedUiType.Text;
  const isDrawingUiType = uiType === DashedUiType.Drawing;
  const isMessageUiType = uiType === DashedUiType.Message;

  const commonStyles = { mt: theme.spacing(0.2), textAlign: 'center' };

  const getContent = () => ({
    [DashedUiType.Text]: <StyledEnterText>{t('enterText')}...</StyledEnterText>,
    [DashedUiType.Drawing]: <Svg id="drawing-star" width="46" height="44" />,
    [DashedUiType.Photo]: (
      <>
        <Svg id="camera-outline" />
        <StyledTooltipText sx={commonStyles}>{t('takePhoto')}</StyledTooltipText>
      </>
    ),
    [DashedUiType.Video]: (
      <>
        <Svg id="video" />
        <StyledTooltipText sx={commonStyles}>
          <Trans i18nKey="captureVideo">
            Capture <br /> Video
          </Trans>
        </StyledTooltipText>
      </>
    ),
    [DashedUiType.Geolocation]: (
      <>
        <Svg id="geolocation" />
        <StyledTooltipText sx={commonStyles}>
          <Trans i18nKey="setGeolocation">
            Set <br /> Geolocation
          </Trans>
        </StyledTooltipText>
      </>
    ),
    [DashedUiType.Audio]: (
      <>
        <Svg id="audio" />
        <StyledTooltipText sx={commonStyles}>
          <Trans i18nKey="recordAudio">
            Record <br /> Audio
          </Trans>
        </StyledTooltipText>
      </>
    ),
    [DashedUiType.Message]: (
      <>
        <Svg id="quote" />
        <StyledTooltipText sx={{ mt: theme.spacing(0.2) }}>{t('message')}...</StyledTooltipText>
      </>
    ),
    [DashedUiType.AudioPlayer]: (
      <>
        <StyledFlexAllCenter sx={{ mb: theme.spacing(1.2) }}>
          <Svg id="play" />
        </StyledFlexAllCenter>
        <Svg id="progress-bar" width="72" height="4" />
      </>
    ),
  });

  const getText = () => ({
    [DashedUiType.Text]: t('textHint'),
    [DashedUiType.Drawing]: t('drawingHint'),
    [DashedUiType.Photo]: t('photoHint'),
    [DashedUiType.Video]: t('videoHint'),
    [DashedUiType.Geolocation]: t('geolocationHint'),
    [DashedUiType.Audio]: t('audioHint'),
    [DashedUiType.Message]: t('messageHint'),
    [DashedUiType.AudioPlayer]: t('audioPlayerHint'),
  });

  const alignItems = isMessageUiType ? 'flex-start' : 'center';

  return (
    <>
      <StyledPresentation>
        <StyledDashedWrapper>
          {isTextUiType || isDrawingUiType ? (
            getContent()[uiType]
          ) : (
            <StyledFlexColumn sx={{ alignItems }}>{getContent()[uiType]}</StyledFlexColumn>
          )}
        </StyledDashedWrapper>
      </StyledPresentation>
      <StyledBodyMedium>{getText()[uiType]}.</StyledBodyMedium>
    </>
  );
};
