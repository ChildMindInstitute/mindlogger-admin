import { Box, Button } from '@mui/material';

import { StyledSvg } from '../FileUploader.styles';
import { DownloadTemplateProps } from './DownloadTemplate.types';

export const DownloadTemplate = ({ children, onClick, sxProps }: DownloadTemplateProps) => (
  <Box>
    <Button
      sx={sxProps}
      variant="text"
      startIcon={<StyledSvg width="18" height="18" id="export" />}
      onClick={onClick}
      data-testid="download-template">
      {children}
    </Button>
  </Box>
);
