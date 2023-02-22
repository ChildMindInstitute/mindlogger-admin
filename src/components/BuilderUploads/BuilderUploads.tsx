import { Tooltip } from 'components';

import { StyledSvg, StyledTitle, StyledUploadImg, StyledUploadImgs } from './BuilderUploads.styles';
import { BuilderUploadsProps } from './BuilderUploads.types';

export const BuilderUploads = ({ uploads }: BuilderUploadsProps) => (
  <StyledUploadImgs>
    {uploads?.map(({ title, tooltipTitle, upload }) => (
      <StyledUploadImg key={title}>
        <StyledTitle>
          {title}
          <Tooltip tooltipTitle={tooltipTitle}>
            <span>
              <StyledSvg id="more-info-outlined" />
            </span>
          </Tooltip>
        </StyledTitle>
        {upload}
      </StyledUploadImg>
    ))}
  </StyledUploadImgs>
);
