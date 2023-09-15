import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import {
  EditorController,
  InputController,
  SelectController,
} from 'shared/components/FormComponents';
import { StyledFlexTopCenter, theme } from 'shared/styles';
import { useBreadcrumbs } from 'shared/hooks';
import { Tooltip, Uploader } from 'shared/components';
import {
  MAX_DESCRIPTION_LENGTH_LONG,
  MAX_FILE_SIZE_25MB,
  MAX_NAME_LENGTH,
  TEXTAREA_ROWS_COUNT,
} from 'shared/consts';
import { byteFormatter } from 'shared/utils';
import { Uploads } from 'modules/Builder/components';
import { themes } from 'modules/Builder/state';
import { BuilderContainer } from 'shared/features';

import { StyledContainer, StyledSvg, StyledTitle } from './AboutApplet.styles';
import { getColorThemeOptions } from './AboutApplet.utils';
import { commonUploaderProps } from './AboutApplet.const';

export const AboutApplet = () => {
  const { t } = useTranslation();
  const { result: themesArr = [] } = themes.useThemesData() || {};
  const themesOptions = getColorThemeOptions(themesArr);
  const { control, setValue, watch } = useFormContext();
  useBreadcrumbs([
    {
      icon: 'more-info-outlined',
      label: t('aboutApplet'),
    },
  ]);

  const commonInputProps = {
    control,
    fullWidth: true,
  };

  const uploads = [
    {
      title: t('appletImg'),
      tooltipTitle: t('appletImageDescription'),
      upload: (
        <Uploader
          {...commonUploaderProps}
          setValue={(val: string) => setValue('image', val)}
          getValue={() => watch('image')}
          description={t('uploadImg', { size: byteFormatter(MAX_FILE_SIZE_25MB) })}
          data-testid="about-applet-image"
        />
      ),
    },
    {
      title: t('appletWatermark'),
      tooltipTitle: t('appletWatermarkDescription'),
      upload: (
        <Uploader
          {...commonUploaderProps}
          setValue={(val: string) => setValue('watermark', val)}
          getValue={() => watch('watermark')}
          description={t('uploadTransfluent', { size: byteFormatter(MAX_FILE_SIZE_25MB) })}
          data-testid="about-applet-watermark"
        />
      ),
    },
  ];

  return (
    <BuilderContainer title={t('aboutApplet')}>
      <StyledFlexTopCenter>
        <StyledContainer>
          <Box sx={{ mb: theme.spacing(4.4) }}>
            <InputController
              {...commonInputProps}
              name="displayName"
              maxLength={MAX_NAME_LENGTH}
              label={t('appletName')}
              restrictExceededValueLength
              data-testid="about-applet-display-name"
            />
          </Box>
          <Box sx={{ mb: theme.spacing(4.4) }}>
            <InputController
              {...commonInputProps}
              name="description"
              maxLength={MAX_DESCRIPTION_LENGTH_LONG}
              restrictExceededValueLength
              label={t('appletDescription')}
              multiline
              rows={TEXTAREA_ROWS_COUNT}
              data-testid="about-applet-description"
            />
          </Box>
          {!!themesArr.length && (
            <StyledFlexTopCenter sx={{ position: 'relative' }}>
              <SelectController
                {...commonInputProps}
                name="themeId"
                label={t('appletColorTheme')}
                options={themesOptions}
                sx={{ margin: theme.spacing(0, 0, 3.6, 0) }}
                dropdownStyles={{
                  maxHeight: '25rem',
                  width: '55rem',
                }}
                data-testid="about-applet-theme"
              />
            </StyledFlexTopCenter>
          )}
        </StyledContainer>
        <Uploads uploads={uploads} />
      </StyledFlexTopCenter>
      <StyledTitle>
        {t('aboutAppletPage')}
        <Tooltip tooltipTitle={t('aboutAppletTooltip')}>
          <span>
            <StyledSvg id="more-info-outlined" />
          </span>
        </Tooltip>
      </StyledTitle>
      <EditorController control={control} name="about" data-testid="about-applet-about" />
    </BuilderContainer>
  );
};
