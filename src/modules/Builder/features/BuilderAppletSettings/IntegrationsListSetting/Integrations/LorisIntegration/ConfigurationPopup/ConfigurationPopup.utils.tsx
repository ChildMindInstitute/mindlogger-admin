import { Trans } from 'react-i18next';

import i18n from 'i18n';
import { SelectController } from 'shared/components/FormComponents';
import { StyledTitleMedium, variables } from 'shared/styles';

import { ConfigurationForm } from './ConfigurationForm';
import { ConfigurationsSteps, GetScreensProps } from './ConfigurationPopup.types';

const { t } = i18n;

export const getMatchOptions = (projects: string[]) =>
  projects.map((p) => ({
    labelKey: p,
    value: p,
  }));

export const getScreens = ({
  control,
  setStep,
  onClose,
  onNext,
  onSave,
  projects,
}: GetScreensProps) => [
  {
    leftButtonText: t('cancel'),
    rightButtonText: t('next'),
    description: t('loris.configurationPopupDescription'),
    content: <ConfigurationForm />,
    leftButtonClick: onClose,
    rightButtonClick: onNext,
  },
  {
    leftButtonText: t('back'),
    rightButtonText: t('loris.connect'),
    disabledRightButton: !projects?.length,
    description: projects?.length ? t('loris.selectProject') : '',
    content: (
      <>
        {projects?.length ? (
          <SelectController
            fullWidth
            control={control}
            name="project"
            options={getMatchOptions(projects)}
            placeholder={t('loris.project')}
            data-testid="loris-project-select"
            isLabelNeedTranslation={false}
          />
        ) : (
          <StyledTitleMedium sx={{ color: variables.palette.semantic.error }}>
            <Trans i18nKey="loris.projectsEmptyState">
              We were unable to access the Projects list for the selected account, likely because it
              is empty.
              <br />
              <br />
              Please contact the LORIS team for assistance.
            </Trans>
          </StyledTitleMedium>
        )}
      </>
    ),
    leftButtonClick: () => {
      setStep(ConfigurationsSteps.LorisConfigurations);
    },
    rightButtonClick: onSave,
  },
];
