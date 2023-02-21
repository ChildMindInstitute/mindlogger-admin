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
import { Svg, Tooltip, Uploader } from 'components';
import theme from 'styles/theme';

import {
  StyledForm,
  StyledContainer,
  StyledUploadImg,
  StyledUploadImgs,
  StyledSvg,
  StyledTitle,
} from './AboutApplet.styles';
import { AboutAppletSchema } from './AboutApplet.schema';
import { defaultValues, colorThemeOptions, FormValues } from './AboutApplet.const';

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
  };

  const commonUploaderProps = {
    width: 20,
    height: 20,
  };

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
              maxLength={55}
              label={t('appletName')}
              sx={{ marginBottom: theme.spacing(4.4) }}
            />
            <InputController
              {...commonProps}
              name="description"
              maxLength={230}
              label={t('appletDescription')}
              sx={{ marginBottom: theme.spacing(4.4) }}
              multiline
              rows={2}
            />
            <StyledFlexTopCenter sx={{ position: 'relative' }}>
              <SelectController
                {...commonProps}
                name="colorTheme"
                label={t('appletColorTheme')}
                options={colorThemeOptions}
                sx={{ margin: theme.spacing(0, 2.4, 3.6, 0) }}
              />
              <Tooltip tooltipTitle={mockedTooltipText}>
                <span>
                  <StyledSvg id="more-info-outlined" />
                </span>
              </Tooltip>
            </StyledFlexTopCenter>
          </StyledContainer>
          <StyledUploadImgs>
            <StyledUploadImg>
              <StyledTitle>
                {t('appletImg')}
                <Tooltip tooltipTitle={mockedTooltipText}>
                  <span>
                    <StyledSvg id="more-info-outlined" />
                  </span>
                </Tooltip>
              </StyledTitle>
              <Uploader
                {...commonUploaderProps}
                setValue={(val: string) => setValue('appletImage', val)}
                getValue={() => watch('appletImage')}
              />
            </StyledUploadImg>
            <StyledUploadImg>
              <StyledTitle>
                {t('appletWatermark')}
                <Tooltip tooltipTitle={mockedTooltipText}>
                  <span>
                    <StyledSvg id="more-info-outlined" />
                  </span>
                </Tooltip>
              </StyledTitle>
              <Uploader
                {...commonUploaderProps}
                setValue={(val: string) => setValue('appletWatermark', val)}
                getValue={() => watch('appletWatermark')}
              />
            </StyledUploadImg>
          </StyledUploadImgs>
        </StyledFlexTopCenter>
        <StyledTitle>
          {t('aboutAppletPage')}
          <Tooltip tooltipTitle={mockedTooltipText}>
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
