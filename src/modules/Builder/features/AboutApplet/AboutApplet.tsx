import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';

import {
  EditorController,
  InputController,
  SelectController,
} from 'shared/components/FormComponents';
import {
  StyledBuilderWrapper,
  StyledFlexTopCenter,
  StyledHeadlineLarge,
  theme,
} from 'shared/styles';
import { useBreadcrumbs, useBuilderSessionStorageFormChange } from 'shared/hooks';
import { Svg, Tooltip, Uploader } from 'shared/components';
import { MAX_DESCRIPTION_LENGTH_LONG, MAX_FILE_SIZE_1GB, MAX_NAME_LENGTH } from 'shared/consts';
import { byteFormatter } from 'shared/utils';
import { Uploads } from 'modules/Builder/components';
import { useBuilderSessionStorageFormValues, useCheckIfNewApplet } from 'shared/hooks';
import { applet, SingleApplet } from 'shared/state';
import { getDictionaryText } from 'shared/utils';

import { StyledContainer, StyledForm, StyledSvg, StyledTitle } from './AboutApplet.styles';
import { AboutAppletSchema } from './AboutApplet.schema';
import { colorThemeOptions, defaultValues } from './AboutApplet.const';
import { FormValues } from './AboutApplet.types';

const commonUploaderProps = {
  width: 20,
  height: 20,
  maxFileSize: MAX_FILE_SIZE_1GB,
};

export const AboutApplet = () => {
  const { t } = useTranslation();
  const { result: appletData } = applet.useAppletData() ?? {};
  const isNewApplet = useCheckIfNewApplet();
  const {
    displayName = '',
    description = '',
    themeId = '',
    about = '',
    image = '',
    watermark = '',
  } = appletData ??
  ({
    description: {},
    about: {},
  } as SingleApplet);
  const defaults = isNewApplet
    ? defaultValues
    : ({
        displayName,
        description: getDictionaryText(description),
        themeId,
        about: getDictionaryText(about),
        image,
        watermark,
      } as FormValues);

  useBreadcrumbs([
    {
      icon: <Svg id="more-info-outlined" width="18" height="18" />,
      label: t('aboutApplet'),
    },
  ]);

  const { getFormValues } = useBuilderSessionStorageFormValues<FormValues>(defaults);
  const { control, setValue, watch, getValues } = useForm<FormValues>({
    resolver: yupResolver(AboutAppletSchema()),
    defaultValues: getFormValues(),
    mode: 'onChange',
  });

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
          description={t('uploadImg', { size: byteFormatter(MAX_FILE_SIZE_1GB) })}
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
          description={t('uploadTransfluent', { size: byteFormatter(MAX_FILE_SIZE_1GB) })}
        />
      ),
    },
  ];

  const { handleFormChange } = useBuilderSessionStorageFormChange<FormValues>(getValues);

  return (
    <StyledBuilderWrapper sx={{ paddingRight: theme.spacing(27.7) }}>
      <StyledHeadlineLarge sx={{ marginBottom: theme.spacing(4) }}>
        {t('aboutApplet')}
      </StyledHeadlineLarge>
      <StyledForm noValidate onChange={handleFormChange}>
        <Box sx={{ display: 'flex' }}>
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
        </Box>
        <StyledTitle>
          {t('aboutAppletPage')}
          <Tooltip tooltipTitle={t('aboutAppletTooltip')}>
            <span>
              <StyledSvg id="more-info-outlined" />
            </span>
          </Tooltip>
        </StyledTitle>
        <EditorController control={control} name="about" />
      </StyledForm>
    </StyledBuilderWrapper>
  );
};
