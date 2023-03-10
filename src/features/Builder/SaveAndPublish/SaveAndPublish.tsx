import { useTranslation } from 'react-i18next';

import { Svg } from 'components';

import { StyledButton } from './SaveAndPublish.styles';

export const SaveAndPublish = () => {
  const { t } = useTranslation('app');

  return (
    <StyledButton variant="contained" startIcon={<Svg id="save" width={18} height={18} />}>
      {t('saveAndPublish')}
    </StyledButton>
  );
};
