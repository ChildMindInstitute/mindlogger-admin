import { Fragment, useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { Svg } from 'shared/components';
import { StyledTitleMedium, theme } from 'shared/styles';
import { BuilderContainer } from 'shared/features';
import { useBreadcrumbs } from 'shared/hooks';
import { Item, ItemUiType } from 'modules/Builder/components';
import { page } from 'resources';
import { getNewActivityFlow } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.utils';
import {
  ActivityFlowFormValues,
  AppletFormValues,
} from 'modules/Builder/pages/BuilderApplet/BuilderApplet.types';

import { DeleteFlowModal } from './DeleteFlowModal';
import { getFlowsItemActions } from './ActivityFlow.utils';
import { StyledAdd, StyledAddWrapper } from './ActivityFlow.styles';
import { ActivityFlowHeader } from './ActivityFlowHeader';

export const ActivityFlow = () => {
  const [, setDuplicateIndexes] = useState<Record<string, number> | null>(null);
  const [flowToDeleteData, setFlowToDeleteData] = useState<{
    id: string;
    index: number;
    name: string;
  } | null>(null);
  const { t } = useTranslation('app');
  const { watch, control, getFieldState } = useFormContext<AppletFormValues>();
  const { appletId } = useParams();
  const navigate = useNavigate();

  const activityFlows: AppletFormValues['activityFlows'] = watch('activityFlows');

  const {
    remove: removeActivityFlow,
    append: appendActivityFlow,
    insert: insertActivityFlow,
    update: updateActivityFlow,
  } = useFieldArray({
    control,
    name: 'activityFlows',
  });

  const errors = activityFlows?.reduce(
    (err: Record<string, boolean>, _: ActivityFlowFormValues, index: number) => ({
      ...err,
      [`activityFlows.${index}`]: !!getFieldState(`activityFlows.${index}`).error,
    }),
    {},
  );

  const handleFlowDelete = () => {
    if (!flowToDeleteData) return;

    removeActivityFlow(flowToDeleteData.index);
    setFlowToDeleteData(null);
  };

  const handleEditActivityFlow = (activityFlowId: string) =>
    navigate(
      generatePath(page.builderAppletActivityFlowItem, {
        appletId,
        activityFlowId,
      }),
    );

  const handleAddActivityFlow = (positionToAdd?: number) => {
    const newActivityFlow = getNewActivityFlow();

    if (positionToAdd) {
      insertActivityFlow(positionToAdd, newActivityFlow);
    } else {
      appendActivityFlow(newActivityFlow);
    }
    handleEditActivityFlow(newActivityFlow.id);
  };

  const handleDuplicateActivityFlow = (index: number) => {
    const duplicatedItem = activityFlows[index];
    setDuplicateIndexes((prevState) => {
      const duplicatedItemId = duplicatedItem.id || '';
      const insertedNumber =
        prevState && prevState[duplicatedItemId] ? prevState[duplicatedItemId] + 1 : 1;

      insertActivityFlow(index + 1, {
        ...activityFlows[index],
        id: uuidv4(),
        name: `${activityFlows[index].name} (${insertedNumber})`,
      });

      return {
        ...prevState,
        [duplicatedItemId]: insertedNumber,
      };
    });
  };

  const handleToggleActivityFlowVisibility = (index: number) =>
    updateActivityFlow(index, {
      ...activityFlows[index],
      isHidden: !activityFlows[index].isHidden,
    });

  const getActivityFlowVisible = (isHidden: boolean | undefined) =>
    isHidden === undefined ? false : isHidden;

  const handleSetFlowToDeleteData = (id: string | undefined, index: number, name: string) => () =>
    setFlowToDeleteData(id ? { id, index, name } : null);

  useBreadcrumbs([
    {
      icon: 'flow',
      label: t('activityFlow'),
    },
  ]);

  return (
    <BuilderContainer
      title={t('activityFlow')}
      Header={ActivityFlowHeader}
      headerProps={{ onAddActivityFlow: handleAddActivityFlow }}
    >
      {activityFlows?.length ? (
        <>
          {activityFlows.map((item, index) => (
            <Fragment key={item.id}>
              <Item
                onItemClick={() => handleEditActivityFlow(item.id || '')}
                getActions={() =>
                  getFlowsItemActions({
                    activityFlowIndex: index,
                    activityFlowId: item.id || '',
                    activityFlowHidden: getActivityFlowVisible(item.isHidden),
                    removeActivityFlow: handleSetFlowToDeleteData(item.id, index, item.name),
                    editActivityFlow: handleEditActivityFlow,
                    duplicateActivityFlow: handleDuplicateActivityFlow,
                    toggleActivityFlowVisibility: handleToggleActivityFlowVisibility,
                  })
                }
                isInactive={item.isHidden}
                hasStaticActions={item.isHidden}
                uiType={ItemUiType.Flow}
                hasError={errors[`activityFlows.${index}`]}
                {...item}
              />
              {index >= 0 && index < activityFlows.length - 1 && (
                <StyledAddWrapper>
                  <span />
                  <StyledAdd onClick={() => handleAddActivityFlow(index + 1)}>
                    <Svg id="add" width={18} height={18} />
                  </StyledAdd>
                </StyledAddWrapper>
              )}
            </Fragment>
          ))}
          {flowToDeleteData && (
            <DeleteFlowModal
              activityFlowName={flowToDeleteData.name}
              isOpen={!!flowToDeleteData}
              onModalClose={() => setFlowToDeleteData(null)}
              onModalSubmit={handleFlowDelete}
            />
          )}
        </>
      ) : (
        <StyledTitleMedium sx={{ marginTop: theme.spacing(0.4) }}>
          {t('activityFlowIsRequired')}
        </StyledTitleMedium>
      )}
    </BuilderContainer>
  );
};
