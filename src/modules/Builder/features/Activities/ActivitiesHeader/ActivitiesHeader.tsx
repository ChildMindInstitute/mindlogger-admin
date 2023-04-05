import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { StyledBuilderBtn } from 'shared/styles';
import { StyledHeader, BuilderContainerProps } from 'shared/features';
import { Svg } from 'shared/components';

import { getNewActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';

export const ActivitiesHeader: BuilderContainerProps['Header'] = ({ isSticky, children }) => {
  const { t } = useTranslation('app');

  const { control } = useFormContext();
  const { append: appendActivity } = useFieldArray({
    control,
    name: 'activities',
  });

  const handleAddActivity = () => appendActivity(getNewActivity());

  return (
    <StyledHeader isSticky={isSticky}>
      {children}
      <StyledBuilderBtn startIcon={<Svg id="checklist-filled" />} onClick={handleAddActivity}>
        {t('addActivity')}
      </StyledBuilderBtn>
    </StyledHeader>
  );
};
