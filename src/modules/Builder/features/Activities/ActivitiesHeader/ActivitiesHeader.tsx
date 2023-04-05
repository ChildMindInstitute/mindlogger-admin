import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useNavigate, useParams, generatePath } from 'react-router-dom';

import { StyledBuilderBtn } from 'shared/styles';
import { StyledHeader, BuilderContainerProps } from 'shared/features';
import { Svg } from 'shared/components';
import { page } from 'resources';
import { getNewActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';

export const ActivitiesHeader: BuilderContainerProps['Header'] = ({ isSticky, children }) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { appletId } = useParams();

  const { control } = useFormContext();
  const { append: appendActivity } = useFieldArray({
    control,
    name: 'activities',
  });

  const handleAddActivity = () => {
    const newActivity = getNewActivity();

    appendActivity(newActivity);
    navigate(
      generatePath(page.builderAppletActivityAbout, { appletId, activityId: newActivity.key }),
    );
  };

  return (
    <StyledHeader isSticky={isSticky}>
      {children}
      <StyledBuilderBtn startIcon={<Svg id="checklist-filled" />} onClick={handleAddActivity}>
        {t('addActivity')}
      </StyledBuilderBtn>
    </StyledHeader>
  );
};
