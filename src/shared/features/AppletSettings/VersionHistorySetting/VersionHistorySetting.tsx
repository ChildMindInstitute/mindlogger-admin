import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box, MenuItem, SelectChangeEvent } from '@mui/material';

import { useAsync } from 'shared/hooks';
import { getAppletVersionChangesApi, getAppletVersionsApi } from 'api';
import { StyledBodyLarge, StyledTitleBoldMedium, theme, variables } from 'shared/styles';
import { Accordion, AccordionUiType } from 'modules/Dashboard/components';
import { Svg } from 'shared/components';

import { StyledVersionSelect } from './VersionHistorySetting.styles';
import { VersionChanges } from './VersionHistorySetting.types';

export const VersionHistorySetting = () => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();

  const [selectOpen, setSelectOpen] = useState(false);
  const [versions, setVersions] = useState<string[]>([]);
  const [currentVersion, setCurrentVersion] = useState<string>();
  const [versionChanges, setVersionChanges] = useState<VersionChanges | null>(null);

  const { execute: getAppletVersions } = useAsync(getAppletVersionsApi);
  const { execute: getAppletVersionChanges } = useAsync(getAppletVersionChangesApi);

  const isLastVersion = currentVersion === versions[0];
  const hasAppletChanges = !isLastVersion && !!versionChanges?.changes.length;
  const hasActivitiesChanges = !isLastVersion && !!versionChanges?.activities.length;

  const changeValue = ({ target: { value } }: SelectChangeEvent<unknown>) => {
    setCurrentVersion(value as string);
  };

  useEffect(() => {
    if (!appletId) return;

    (async () => {
      const result = await getAppletVersions({ appletId });
      const versions = result?.data.result.map(({ version }: { version: string }) => version);
      setVersions(versions);
      setCurrentVersion(versions[0]);
    })();
  }, [appletId]);

  useEffect(() => {
    if (!appletId || !currentVersion) return;
    setVersionChanges(null);
    if (isLastVersion) return;

    (async () => {
      const changesResult = await getAppletVersionChanges({
        appletId,
        version: currentVersion,
      });
      setVersionChanges(changesResult?.data.result);
    })();
  }, [appletId, currentVersion]);

  return (
    <>
      {!!versions?.length && (
        <>
          <StyledVersionSelect
            value={currentVersion}
            onChange={changeValue}
            open={selectOpen}
            onOpen={() => setSelectOpen(true)}
            onClose={() => setSelectOpen(false)}
            IconComponent={() => (
              <Svg className="navigate-arrow" id={selectOpen ? 'navigate-up' : 'navigate-down'} />
            )}
          >
            {versions.map((version, index) => (
              <MenuItem key={version} value={version}>
                {t(index === 0 ? 'current' : 'version', { version })}
              </MenuItem>
            ))}
          </StyledVersionSelect>
          {isLastVersion && (
            <StyledBodyLarge color={variables.palette.on_surface_variant}>
              {t('noChanges')}
            </StyledBodyLarge>
          )}
          {(hasAppletChanges || hasActivitiesChanges) && (
            <StyledTitleBoldMedium sx={{ mb: theme.spacing(1) }}>
              {t('changes')}
            </StyledTitleBoldMedium>
          )}
          {hasAppletChanges && (
            <Accordion uiType={AccordionUiType.Secondary} title={t('appletMetadata')}>
              <Box sx={{ ml: theme.spacing(2.5) }}>
                {versionChanges?.changes.map((change) => (
                  <StyledBodyLarge
                    sx={{
                      mb: theme.spacing(1),
                    }}
                    color={variables.palette.on_surface_variant}
                    key={change}
                  >
                    {change}
                  </StyledBodyLarge>
                ))}
              </Box>
            </Accordion>
          )}
          {hasActivitiesChanges && (
            <Accordion uiType={AccordionUiType.Secondary} title={t('activities')}>
              <Box sx={{ ml: theme.spacing(2.5) }}>
                {versionChanges?.activities.map((activity) => (
                  <Accordion
                    uiType={AccordionUiType.Secondary}
                    key={activity.name}
                    title={activity.name}
                  >
                    <Box sx={{ ml: theme.spacing(2.5) }}>
                      {!!activity?.changes.length && (
                        <Accordion uiType={AccordionUiType.Secondary} title={t('activityMetadata')}>
                          <Box sx={{ ml: theme.spacing(2.5) }}>
                            {activity.changes.map((change) => (
                              <StyledBodyLarge
                                sx={{
                                  mb: theme.spacing(1),
                                }}
                                color={variables.palette.on_surface_variant}
                                key={change}
                              >
                                {change}
                              </StyledBodyLarge>
                            ))}
                          </Box>
                        </Accordion>
                      )}
                      {!!activity?.items.length && (
                        <Accordion uiType={AccordionUiType.Secondary} title={t('items')}>
                          <Box sx={{ ml: theme.spacing(2.5) }}>
                            {activity?.items.map(
                              (item) =>
                                item.changes && (
                                  <Accordion
                                    key={item.name}
                                    uiType={AccordionUiType.Secondary}
                                    title={item.name}
                                  >
                                    <Box sx={{ ml: theme.spacing(2.5) }}>
                                      {item.changes?.map((change) => (
                                        <StyledBodyLarge
                                          sx={{
                                            mb: theme.spacing(1),
                                          }}
                                          color={variables.palette.on_surface_variant}
                                          key={change}
                                        >
                                          {change}
                                        </StyledBodyLarge>
                                      ))}
                                    </Box>
                                  </Accordion>
                                ),
                            )}
                          </Box>
                        </Accordion>
                      )}
                    </Box>
                  </Accordion>
                ))}
              </Box>
            </Accordion>
          )}
        </>
      )}
    </>
  );
};
