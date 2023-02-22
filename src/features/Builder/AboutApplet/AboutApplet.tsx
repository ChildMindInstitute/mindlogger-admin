import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

import { EditorController, InputController, SelectController } from 'components/FormComponents';
import {
  StyledFlexTopCenter,
  StyledHeadlineLarge,
  StyledBuilderWrapper,
} from 'styles/styledComponents';
import { useBreadcrumbs } from 'hooks';
import { BuilderUploads, Svg, Tooltip, Uploader } from 'components';
import theme from 'styles/theme';
import { MAX_DESCRIPTION_LENGTH_LONG, MAX_NAME_LENGTH } from 'consts';

import { StyledForm, StyledContainer, StyledSvg, StyledTitle } from './AboutApplet.styles';
import { AboutAppletSchema } from './AboutApplet.schema';
import { defaultValues, colorThemeOptions } from './AboutApplet.const';
import { FormValues } from './AboutApplet.types';

export const AboutApplet = () => {
  const { t } = useTranslation();
  const mockedTooltipText = 'Lorem ipsum';

  useBreadcrumbs([
    {
      icon: <Svg id="more-info-outlined" width="18" height="18" />,
      label: t('aboutApplet'),
    },
  ]);

  const { control, setValue, watch } = useForm<FormValues>({
    resolver: yupResolver(AboutAppletSchema()),
    defaultValues,
    mode: 'onChange',
  });

  const commonProps = {
    control,
    fullWidth: true,
    sx: { marginBottom: theme.spacing(4.4) },
  };

  const commonUploaderProps = {
    width: 20,
    height: 20,
  };

  const uploads = [
    {
      title: t('appletImg'),
      tooltipTitle: mockedTooltipText,
      upload: (
        <Uploader
          {...commonUploaderProps}
          setValue={(val: string) => setValue('appletImage', val)}
          getValue={() => watch('appletImage')}
        />
      ),
    },
    {
      title: t('appletWatermark'),
      tooltipTitle: mockedTooltipText,
      upload: (
        <Uploader
          {...commonUploaderProps}
          setValue={(val: string) => setValue('appletWatermark', val)}
          getValue={() => watch('appletWatermark')}
        />
      ),
    },
  ];

  return (
    <StyledBuilderWrapper sx={{ marginRight: theme.spacing(20) }}>
      <StyledHeadlineLarge sx={{ marginBottom: theme.spacing(4) }}>
        {t('aboutApplet')}
      </StyledHeadlineLarge>
      <StyledForm noValidate>
        <StyledFlexTopCenter>
          <StyledContainer>
            <InputController
              {...commonProps}
              name="name"
              maxLength={MAX_NAME_LENGTH}
              label={t('appletName')}
            />
            <InputController
              {...commonProps}
              name="description"
              maxLength={MAX_DESCRIPTION_LENGTH_LONG}
              label={t('appletDescription')}
              multiline
              rows={2}
            />
            <StyledFlexTopCenter sx={{ position: 'relative' }}>
              <SelectController
                {...commonProps}
                name="colorTheme"
                label={t('appletColorTheme')}
                options={colorThemeOptions}
                sx={{ margin: theme.spacing(0, 0, 3.6, 0) }}
              />
            </StyledFlexTopCenter>
          </StyledContainer>
          <BuilderUploads uploads={uploads} />
        </StyledFlexTopCenter>
        <StyledTitle>
          {t('aboutAppletPage')}
          <Tooltip tooltipTitle={t('aboutAppletTooltip')}>
            <span>
              <StyledSvg id="more-info-outlined" />
            </span>
          </Tooltip>
        </StyledTitle>
        <EditorController control={control} name="aboutApplet" />
      </StyledForm>
    </StyledBuilderWrapper>
  );
};
