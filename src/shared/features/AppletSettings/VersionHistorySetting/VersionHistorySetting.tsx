import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { MenuItem, SelectChangeEvent } from '@mui/material';

import { useAsync } from 'shared/hooks';
import { getAppletVersionsApi } from 'api';

import { StyledHeadline } from '../AppletSettings.styles';
import { StyledVersionSelect } from './VersionHistorySetting.styles';

export const VersionHistorySetting = () => {
  const { t } = useTranslation('app');
  const { appletId: id } = useParams();

  const [versions, setVersions] = useState<string[]>([]);
  const [currentVersion, setCurrentVersion] = useState<string>();

  const { execute: getAppletVersions } = useAsync(getAppletVersionsApi);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const result = await getAppletVersions({ appletId: id });
      const versions = result?.data.result.map(({ version }: { version: string }) => version);
      setVersions(versions);
      setCurrentVersion(versions[0]);

      // TODO: get changes for current version
      // getAppletVersionChanges({ appletId: id, version: versions[0] });
    })();
  }, []);

  const changeValue = ({ target: { value } }: SelectChangeEvent<unknown>) => {
    setCurrentVersion(value as string);
  };

  return (
    <>
      <StyledHeadline>{t('versionHistory')}</StyledHeadline>
      {!!versions?.length && (
        <StyledVersionSelect value={currentVersion} onChange={changeValue}>
          {versions.map((version) => (
            <MenuItem key={version} value={version}>
              {t('version', { version })}
            </MenuItem>
          ))}
        </StyledVersionSelect>
      )}
    </>
  );
};
