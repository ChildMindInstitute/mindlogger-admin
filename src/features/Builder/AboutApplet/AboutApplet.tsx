import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

import { EditorController, InputController, SelectController } from 'components/FormComponents';
import { StyledFlexTopCenter } from 'styles/styledComponents/Flex';
import { useBreadcrumbs } from 'hooks';
import { Svg, Tooltip, Uploader } from 'components';
import { StyledBodyMedium, StyledHeadlineLarge } from 'styles/styledComponents';
import { StyledBuilderWrapper } from 'styles/styledComponents';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

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

  const { control } = useForm<FormValues>({
    resolver: yupResolver(AboutAppletSchema()),
    defaultValues,
    mode: 'onChange',
  });

  const commonProps = {
    control,
    fullWidth: true,
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
              <Uploader width={20} height={20} />
              <StyledBodyMedium
                color={variables.palette.on_surface_variant}
                sx={{ marginTop: theme.spacing(1.6) }}
              >
                {t('uploadImg')}
              </StyledBodyMedium>
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
              <Uploader width={20} height={20} />
              <StyledBodyMedium
                color={variables.palette.on_surface_variant}
                sx={{ marginTop: theme.spacing(1.6) }}
              >
                {t('uploadImg')}
              </StyledBodyMedium>
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
