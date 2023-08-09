import { Controller } from 'react-hook-form';
import { FormControlLabelProps, Radio, RadioGroup } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

import { AppletImage, Table, UiType } from 'shared/components';
import { RadioGroupController } from 'shared/components/FormComponents';
import { WorkspaceImage, WorkspaceUiType } from 'shared/features/SwitchWorkspace';
import {
  PublishedApplet,
  SelectedCartApplet,
  SelectedCombinedCartApplet,
} from 'modules/Library/state';
import { SelectedItem } from 'modules/Library/features/Applet';
import {
  StyledBodyLarge,
  StyledErrorText,
  StyledFlexTopCenter,
  StyledLabelLarge,
  theme,
  variables,
} from 'shared/styles';
import { HeadCell } from 'shared/types/table';
import i18n from 'i18n';
import {
  SingleAndMultipleSelectMatrix,
  SingleAndMultiSelectOption,
  SingleAndMultiSelectRowOption,
  SingleAndMultipleSelectRowsResponseValues,
  Workspace,
} from 'shared/state';
import { Applet as FullApplet, DashboardAppletType } from 'modules/Dashboard';
import {
  ItemResponseType,
  performanceTaskResponseTypes,
  PerfTaskType,
  responseTypeToHaveOptions,
} from 'shared/consts';
import { getSelectedItemsFromStorage } from 'modules/Library/utils';

import {
  AddToBuilderActions,
  AddToBuilderSteps,
  Applet,
  GetStep,
  Step,
  TableController,
} from './AddToBuilderPopup.types';
import { StyledTableFormControlLabel } from './AddToBuilderPopup.styles';

const getHeadCell = ({ id, label }: { id: string; label: string }): HeadCell[] => [
  {
    id,
    label,
    enableSort: false,
  },
];

const getWorkspacesRows = (workspaces: Workspace[]) =>
  workspaces?.map(({ ownerId, workspaceName, image }) => ({
    workspaceName: {
      content: () => (
        <StyledTableFormControlLabel
          value={ownerId}
          control={<Radio />}
          labelPlacement="start"
          label={
            <StyledFlexTopCenter>
              <WorkspaceImage
                uiType={WorkspaceUiType.Table}
                image={image}
                workspaceName={workspaceName}
              />
              <StyledLabelLarge sx={{ marginLeft: theme.spacing(1.2) }}>
                {workspaceName}
              </StyledLabelLarge>
            </StyledFlexTopCenter>
          }
        />
      ),
      value: workspaceName,
    },
  }));

const getAppletsRows = (applets: Applet[]) =>
  applets?.map(({ id, appletName, image }) => ({
    appletName: {
      content: () => (
        <StyledTableFormControlLabel
          value={id}
          control={<Radio />}
          labelPlacement="start"
          label={
            <StyledFlexTopCenter>
              <AppletImage image={image} appletName={appletName} />
              <StyledLabelLarge sx={{ marginLeft: theme.spacing(1.2) }}>
                {appletName}
              </StyledLabelLarge>
            </StyledFlexTopCenter>
          }
        />
      ),
      value: appletName,
    },
  }));

const getActions = (): Omit<FormControlLabelProps, 'control'>[] => {
  const { t } = i18n;

  return [
    {
      value: AddToBuilderActions.CreateNewApplet,
      label: (
        <>
          <StyledBodyLarge>{t('createNewApplet')}</StyledBodyLarge>
          <StyledLabelLarge
            className="option-hint"
            sx={{ color: variables.palette.primary, marginTop: theme.spacing(0.4) }}
          >
            {t('createNewAppletHint')}
          </StyledLabelLarge>
        </>
      ),
    },
    {
      value: AddToBuilderActions.AddToExistingApplet,
      label: (
        <>
          <StyledBodyLarge>{t('addToExistingApplet')}</StyledBodyLarge>
          <StyledLabelLarge
            className="option-hint"
            sx={{ color: variables.palette.primary, marginTop: theme.spacing(0.4) }}
          >
            {t('exitingAppletHint')}
          </StyledLabelLarge>
        </>
      ),
    },
  ];
};

const getTableController = ({
  name,
  defaultValue = '',
  control,
  columns,
  rows,
  orderBy,
}: TableController) => (
  <Controller
    name={name}
    defaultValue={defaultValue}
    control={control}
    render={({ field, fieldState: { error } }) => (
      <>
        <RadioGroup {...field}>
          <Table
            className={error && 'error'}
            maxHeight="32.4rem"
            columns={columns}
            rows={rows}
            orderBy={orderBy}
            uiType={UiType.Secondary}
          />
        </RadioGroup>
        {error && <StyledErrorText marginTop={1.2}>{error?.message}</StyledErrorText>}
      </>
    )}
  />
);

export const getSteps = ({
  control,
  isWorkspacesModalVisible,
  workspaces,
  applets,
  setStep,
  setAddToBuilderPopupVisible,
  handleNext,
  handleAddToBuilder,
  handleAddToExistingApplet,
}: GetStep): Step[] => {
  const { t } = i18n;
  const options = getActions();

  return [
    {
      stepId: AddToBuilderSteps.SelectWorkspace,
      popupTitle: 'workspaceSelection',
      render: () =>
        getTableController({
          name: 'selectedWorkspace',
          control,
          columns: getHeadCell({
            id: 'workspaceName',
            label: t('workspaceName'),
          }),
          rows: getWorkspacesRows(workspaces),
          orderBy: 'workspaceName',
        }),
      buttonText: 'confirm',
      hasSecondBtn: true,
      secondBtnText: 'cancel',
      onSecondBtnSubmit: () => setAddToBuilderPopupVisible(false),
      onSubmitStep: () => handleNext(AddToBuilderSteps.AddToBuilderActions),
    },
    {
      stepId: AddToBuilderSteps.AddToBuilderActions,
      popupTitle: 'contentActions',
      render: () => (
        <RadioGroupController name="addToBuilderAction" control={control} options={options} />
      ),
      buttonText: 'continue',
      hasSecondBtn: true,
      secondBtnText: isWorkspacesModalVisible ? 'back' : 'cancel',
      onSecondBtnSubmit: () =>
        isWorkspacesModalVisible
          ? setStep(AddToBuilderSteps.SelectWorkspace)
          : setAddToBuilderPopupVisible(false),
      onSubmitStep: () => handleAddToBuilder(),
    },
    {
      stepId: AddToBuilderSteps.SelectApplet,
      popupTitle: 'selectApplet',
      render: () => (
        <>
          <StyledBodyLarge
            sx={{ color: variables.palette.on_surface, marginBottom: theme.spacing(2.4) }}
          >
            {t('selectAppletDescription')}
          </StyledBodyLarge>
          {getTableController({
            name: 'selectedApplet',
            control,
            columns: getHeadCell({
              id: 'appletName',
              label: t('appletName'),
            }),
            rows: getAppletsRows(applets),
            orderBy: 'appletName',
          })}
        </>
      ),
      buttonText: 'confirm',
      hasSecondBtn: true,
      secondBtnText: 'back',
      onSecondBtnSubmit: () => setStep(AddToBuilderSteps.AddToBuilderActions),
      onSubmitStep: () => handleAddToExistingApplet(),
    },
    {
      stepId: AddToBuilderSteps.Error,
      popupTitle: 'addToBuilder',
      render: () => (
        <StyledBodyLarge color={variables.palette.semantic.error}>
          {t('addToBuilderError')}
        </StyledBodyLarge>
      ),
      buttonText: 'retry',
      hasSecondBtn: true,
      secondBtnText: 'cancel',
      onSecondBtnSubmit: () => setAddToBuilderPopupVisible(false),
      onSubmitStep: () => setAddToBuilderPopupVisible(false),
    },
  ];
};

export const getArrayFromApplets = (applets: FullApplet[]) =>
  applets.reduce((acc: Applet[], { id, type, displayName, image }) => {
    if (type === DashboardAppletType.Applet) {
      acc.push({ id, appletName: displayName, image });
    }

    return acc;
  }, []);

export const getPerformanceTaskType = (responseType: ItemResponseType) => {
  let performanceTaskType;
  switch (responseType) {
    case ItemResponseType.Flanker:
      performanceTaskType = PerfTaskType.Flanker;
      break;
    case ItemResponseType.TouchPractice:
    case ItemResponseType.TouchTest:
      performanceTaskType = PerfTaskType.Touch;
      break;
    case ItemResponseType.ABTrails:
      performanceTaskType = PerfTaskType.ABTrailsMobile;
      break;
    case ItemResponseType.StabilityTracker:
      performanceTaskType = PerfTaskType.Gyroscope;
      break;
  }

  return performanceTaskType;
};

const mapResponseValues = <
  T extends {
    dataMatrix?: SingleAndMultipleSelectMatrix[] | null;
    options: (SingleAndMultiSelectOption | SingleAndMultiSelectRowOption)[];
  },
>(
  responseValues: T,
): T => ({
  ...responseValues,
  ...(!responseValues.dataMatrix
    ? {
        options: responseValues.options?.map((option) => ({
          ...option,
          id: option.id ?? uuidv4(),
        })),
      }
    : {
        options: responseValues.options?.map((option, index) => ({
          ...option,
          id: option.id ?? responseValues.dataMatrix?.[0].options[index]?.optionId ?? uuidv4(),
        })),
      }),
});

export const getSelectedAppletData = (
  applet: PublishedApplet,
  selectedItems: SelectedItem[],
): SelectedCartApplet | null => {
  const selectedActivityKeysSet = new Set(selectedItems?.map((item) => item.activityKey));
  const selectedItemNamesSet = new Set(selectedItems?.map((item) => item.itemNamePlusActivityName));

  const selectedActivities = applet.activities
    .filter((activity) => selectedActivityKeysSet.has(activity.key))
    .map((activity) => {
      let isPerformanceTask = false;
      let performanceTaskType: PerfTaskType | null = null;

      const filteredItems = activity.items
        .filter((item) => selectedItemNamesSet.has(`${item.name}-${activity.name}`))
        .map((item, index, items) => {
          const newItem = {
            ...item,
            key: uuidv4(),
          };

          //for security reasons there is no 'id' in responseValues.options for Single/Multi selection (+ per row)
          if (responseTypeToHaveOptions.includes(newItem.responseType)) {
            newItem.responseValues = mapResponseValues(
              newItem.responseValues as SingleAndMultipleSelectRowsResponseValues,
            );
          }

          //per requirements if not all of the items in activity were selected, conditional logic should be removed
          if (activity.items.length > items.length) newItem.conditionalLogic = undefined;

          return newItem;
        });

      for (const item of activity.items) {
        if (performanceTaskResponseTypes.includes(item.responseType)) {
          isPerformanceTask = true;
          performanceTaskType = getPerformanceTaskType(item.responseType) || null;
        }
      }

      //per requirements if not all of the items in activity were selected, scores & reports and subscales should be removed
      const hasSubscalesAndScores = filteredItems.length === activity.items.length;

      return {
        ...activity,
        isPerformanceTask,
        performanceTaskType: performanceTaskType || undefined,
        items: filteredItems,
        ...(!hasSubscalesAndScores && { subscaleSetting: undefined, scoresAndReports: undefined }),
      };
    });

  //per requirements if not all of the activites in applet were selected, activity flows should be removed
  const hasActivityFlows = applet.activities.length === selectedActivityKeysSet.size;

  const selectedActivityFlows = hasActivityFlows
    ? applet.activityFlows.map((flow) => ({
        ...flow,
        key: uuidv4(),
        items: flow.items.map((item) => ({ ...item, key: uuidv4() })),
      }))
    : [];

  const { id, keywords, version, activities, activityFlows, ...restApplet } = applet;

  return {
    ...restApplet,
    activities: selectedActivities,
    activityFlows: selectedActivityFlows,
  };
};

export const getAddToBuilderData = async (cartItems: PublishedApplet[] | null) => {
  const selectedItems = getSelectedItemsFromStorage();

  const preparedApplets =
    cartItems?.reduce((acc: SelectedCartApplet[], applet) => {
      const selectedData = selectedItems[applet.id];
      const appletData = getSelectedAppletData(applet, selectedData);

      if (appletData) {
        acc.push(appletData);
      }

      return acc;
    }, []) || [];

  let appletToBuilder;

  if (preparedApplets.length === 1) {
    appletToBuilder = preparedApplets[0];
  }
  if (preparedApplets.length > 1) {
    appletToBuilder = preparedApplets.reduce(
      (acc: SelectedCombinedCartApplet, applet) => {
        acc.themeId = null;
        acc.activities.push(...applet.activities);
        acc.activityFlows.push(...applet.activityFlows);

        return acc;
      },
      { activities: [], activityFlows: [] },
    );
  }

  return { appletToBuilder };
};
