import { useTranslation } from 'react-i18next';

import { Svg, Uploader, UploaderUiType } from 'shared/components';
import {
  StyledBodyMedium,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  variables,
} from 'shared/styles';
import { getMediaName } from 'shared/utils';

import { PhrasalTemplateImageFieldProps } from './PhrasalTemplateImageField.types';

export const PhrasalTemplateImageField = ({
  value = '',
  onChangeValue,
}: PhrasalTemplateImageFieldProps) => {
  const { t } = useTranslation('app');

  return (
    <StyledFlexTopCenter component="label" sx={{ gap: 1.6, width: 'max-content' }}>
      <Uploader
        getValue={() => value}
        height={5.6}
        setValue={onChangeValue}
        uiType={UploaderUiType.Secondary}
        width={5.6}
      />

      {value ? (
        <StyledLabelBoldLarge
          color={variables.palette.primary}
          sx={{ display: 'flex', placeItems: 'center' }}
        >
          {getMediaName(value)} <Svg fill="currentColor" id="check" />
        </StyledLabelBoldLarge>
      ) : (
        <StyledBodyMedium color={variables.palette.outline}>
          {t('phrasalTemplateItem.imageLabel')}
        </StyledBodyMedium>
      )}
    </StyledFlexTopCenter>
  );
};
