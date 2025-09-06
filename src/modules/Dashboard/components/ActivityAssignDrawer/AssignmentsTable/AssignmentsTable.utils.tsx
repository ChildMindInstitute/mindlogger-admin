import i18n from 'i18n';
import { Svg, Tooltip } from 'shared/components';
import { StyledFlexAllCenter, StyledFlexTopCenter, variables } from 'shared/styles';

export const getHeadCells = (isReadOnly?: boolean) => {
  const { t } = i18n;

  return [
    {
      key: 'respondentSubjectId',
      label: (
        <StyledFlexTopCenter sx={{ gap: 0.6 }}>
          {t('activityAssign.assignTo')}
          {!isReadOnly && (
            <Tooltip tooltipTitle={t('activityAssign.assignToTooltip')}>
              <StyledFlexAllCenter component="span">
                <Svg
                  id="help-outlined"
                  width={18}
                  height={18}
                  fill={variables.palette.on_surface_variant}
                />
              </StyledFlexAllCenter>
            </Tooltip>
          )}
        </StyledFlexTopCenter>
      ),
      width: '50%',
      enableSort: false,
    },
    {
      key: 'targetSubjectId',
      label: (
        <StyledFlexTopCenter sx={{ gap: 0.6 }}>
          {t('activityAssign.whoIsActivityAbout')}
          {!isReadOnly && (
            <Tooltip tooltipTitle={t('activityAssign.whoIsActivityAboutTooltip')}>
              <StyledFlexAllCenter component="span">
                <Svg
                  id="help-outlined"
                  width={18}
                  height={18}
                  fill={variables.palette.on_surface_variant}
                />
              </StyledFlexAllCenter>
            </Tooltip>
          )}
        </StyledFlexTopCenter>
      ),
      width: '50%',
      enableSort: false,
    },
  ];
};
