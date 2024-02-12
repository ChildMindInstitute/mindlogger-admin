import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Box, MenuItem, SelectChangeEvent } from '@mui/material';

import { useAsync } from 'shared/hooks/useAsync';
import { getAppletVersionChangesApi, getAppletVersionsApi } from 'api';
import { StyledBodyLarge, StyledTitleBoldMedium, theme, variables } from 'shared/styles';
import { Accordion, AccordionUiType } from 'modules/Dashboard/components';
import { Spinner, Svg } from 'shared/components';

import {
  StyledChangesContainer,
  StyledVersionHistoryContainer,
  StyledVersionSelect,
} from './VersionHistorySetting.styles';
import { VersionChanges } from './VersionHistorySetting.types';

export const VersionHistorySetting = () => {
  const { t } = useTranslation('app');
  const { appletId } = useParams();

  const [selectOpen, setSelectOpen] = useState(false);
  const [versions, setVersions] = useState<string[]>([]);
  const [currentVersion, setCurrentVersion] = useState<string>();
  const [versionChanges, setVersionChanges] = useState<VersionChanges | null>(null);

  const { execute: getAppletVersions, isLoading: areAppletVersionsLoading } =
    useAsync(getAppletVersionsApi);
  const { execute: getAppletVersionChanges, isLoading: areAppletVersionChangesLoading } = useAsync(
    getAppletVersionChangesApi,
  );
  const isLoading = areAppletVersionsLoading || areAppletVersionChangesLoading;

  const hasAppletChanges = !!versionChanges?.changes.length;
  const hasActivitiesChanges = !!versionChanges?.activities.length;
  const dataTestid = 'applet-settings-version-history';

  const changeValue = ({ target: { value } }: SelectChangeEvent<unknown>) => {
    setCurrentVersion(value as string);
  };

  const renderChangeItem = (change: string) => (
    <StyledBodyLarge
      sx={{
        mb: theme.spacing(1),
      }}
      color={variables.palette.on_surface_variant}
      key={change}
    >
      {change}
    </StyledBodyLarge>
  );

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
    (async () => {
      const changesResult = await getAppletVersionChanges({
        appletId,
        version: currentVersion,
      });
      setVersionChanges(changesResult?.data.result);
    })();
  }, [appletId, currentVersion]);

  return (
    <StyledVersionHistoryContainer>
      {!areAppletVersionsLoading || !!versions?.length ? (
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
            data-testid={`${dataTestid}-version`}
          >
            {versions.map((version, index) => (
              <MenuItem
                key={version}
                value={version}
                data-testid={`${dataTestid}-version-${index}`}
              >
                {t(index === 0 ? 'current' : 'version', { version })}
              </MenuItem>
            ))}
          </StyledVersionSelect>
          <StyledChangesContainer>
            {isLoading && <Spinner noBackground />}
            {!hasAppletChanges && !hasActivitiesChanges && !isLoading && (
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
              <Accordion
                uiType={AccordionUiType.Secondary}
                title={t('appletMetadata')}
                data-testid={`${dataTestid}-applet-changes`}
              >
                <Box sx={{ ml: theme.spacing(2.5) }}>
                  {versionChanges?.changes.map((change) => renderChangeItem(change))}
                </Box>
              </Accordion>
            )}
            {hasActivitiesChanges && (
              <Accordion
                uiType={AccordionUiType.Secondary}
                title={t('activities')}
                data-testid={`${dataTestid}-activities-changes`}
              >
                <Box sx={{ ml: theme.spacing(2.5) }}>
                  {versionChanges?.activities.map((activity) => (
                    <Accordion
                      uiType={AccordionUiType.Secondary}
                      key={activity.name}
                      title={activity.name}
                    >
                      <Box sx={{ ml: theme.spacing(2.5) }}>
                        {!!activity?.changes.length && (
                          <Accordion
                            uiType={AccordionUiType.Secondary}
                            title={t('activityMetadata')}
                          >
                            <Box sx={{ ml: theme.spacing(2.5) }}>
                              {activity.changes.map((change) => renderChangeItem(change))}
                            </Box>
                          </Accordion>
                        )}
                        {!!activity?.items.length && (
                          <Accordion uiType={AccordionUiType.Secondary} title={t('items')}>
                            <Box sx={{ ml: theme.spacing(2.5) }}>
                              {activity?.items.map((item) => {
                                if (!item.changes && item.name) {
                                  return renderChangeItem(item.name);
                                }

                                return (
                                  item.changes && (
                                    <Accordion
                                      key={item.name}
                                      uiType={AccordionUiType.Secondary}
                                      title={item.name}
                                    >
                                      <Box sx={{ ml: theme.spacing(2.5) }}>
                                        {item.changes?.map((change) => renderChangeItem(change))}
                                      </Box>
                                    </Accordion>
                                  )
                                );
                              })}
                            </Box>
                          </Accordion>
                        )}
                      </Box>
                    </Accordion>
                  ))}
                </Box>
              </Accordion>
            )}
          </StyledChangesContainer>
        </>
      ) : (
        <Spinner />
      )}
    </StyledVersionHistoryContainer>
  );
};
