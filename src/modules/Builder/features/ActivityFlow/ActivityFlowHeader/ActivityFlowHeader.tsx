import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, generatePath } from 'react-router-dom';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { page } from 'resources';
import { StyledBuilderBtn } from 'shared/styles';
import { StyledHeader, BuilderContainerProps } from 'shared/features';
import { Svg } from 'shared/components';
import { getNewActivityFlow } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';

export const ActivityFlowHeader: BuilderContainerProps['Header'] = ({ isSticky, children }) => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();
  const navigate = useNavigate();

  const { control } = useFormContext();

  const { append: appendActivityFlow } = useFieldArray({
    control,
    name: 'activityFlows',
  });

  const handleAddActivityFlow = () => {
    const newActivityFlow = getNewActivityFlow();

    appendActivityFlow(newActivityFlow);

    navigate(
      generatePath(page.builderAppletActivityFlowItem, {
        appletId,
        activityFlowId: newActivityFlow.id,
      }),
    );
  };

  return (
    <StyledHeader isSticky={isSticky}>
      {children}
      <StyledBuilderBtn startIcon={<Svg id="flow" />} onClick={handleAddActivityFlow}>
        {t('addActivityFlow')}
      </StyledBuilderBtn>
    </StyledHeader>
  );
};
