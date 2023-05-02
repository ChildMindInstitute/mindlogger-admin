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
import { MAX_DESCRIPTION_LENGTH_LONG, MAX_FILE_SIZE_5MB, MAX_NAME_LENGTH } from 'shared/consts';
import { byteFormatter } from 'shared/utils';
import { Uploads } from 'modules/Builder/components';
import { BuilderContainer } from 'shared/features';

import { StyledContainer, StyledSvg, StyledTitle } from './AboutApplet.styles';
import { colorThemeOptions } from './AboutApplet.const';

const commonUploaderProps = {
  width: 20,
  height: 20,
  maxFileSize: MAX_FILE_SIZE_5MB,
};

export const AboutApplet = () => {
  const { t } = useTranslation();

  useBreadcrumbs([
    {
      icon: 'more-info-outlined',
      label: t('aboutApplet'),
    },
  ]);

  const { control, setValue, watch } = useFormContext();

  const commonProps = {
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
          description={t('uploadImg', { size: byteFormatter(MAX_FILE_SIZE_5MB) })}
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
          description={t('uploadTransfluent', { size: byteFormatter(MAX_FILE_SIZE_5MB) })}
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
              {...commonProps}
              name="displayName"
              maxLength={MAX_NAME_LENGTH}
              label={t('appletName')}
            />
          </Box>
          <Box sx={{ mb: theme.spacing(4.4) }}>
            <InputController
              {...commonProps}
              name="description"
              maxLength={MAX_DESCRIPTION_LENGTH_LONG}
              label={t('appletDescription')}
              multiline
              rows={5}
            />
          </Box>
          <StyledFlexTopCenter sx={{ position: 'relative' }}>
            <SelectController
              {...commonProps}
              name="themeId"
              label={t('appletColorTheme')}
              options={colorThemeOptions}
              sx={{ margin: theme.spacing(0, 0, 3.6, 0) }}
            />
          </StyledFlexTopCenter>
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
      <EditorController control={control} name="about" />
    </BuilderContainer>
  );
};
