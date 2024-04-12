import { styled, Typography } from '@mui/material';

import { variables } from 'shared/styles/variables';
import { shouldForwardProp } from 'shared/utils/shouldForwardProp';

export type FontWeight = keyof typeof variables.font.weight;
type LetterSpacing = keyof typeof variables.font.letterSpacing;

type StyledProps = {
  withDecoration?: boolean;
  color?: string;
  fontWeight?: FontWeight;
  letterSpacing?: LetterSpacing;
};

export const StyledHeadlineLarge = styled(Typography)`
  font-size: ${variables.font.size.xxxl};
  line-height: ${variables.font.lineHeight.xxxl};
  font-weight: ${({ fontWeight }: StyledProps) =>
    fontWeight ? variables.font.weight[fontWeight] : variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.on_surface};
`;

export const StyledHeadline = styled(Typography)`
  font-size: ${variables.font.size.xxl};
  line-height: ${variables.font.lineHeight.xxl};
  font-weight: ${({ fontWeight }: StyledProps) =>
    fontWeight ? variables.font.weight[fontWeight] : variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
`;

export const StyledStickyHeadline = styled(StyledHeadlineLarge, shouldForwardProp)`
  transition: ${variables.transitions.fontSize};
  font-size: ${({ isSticky }: { isSticky: boolean }) =>
    isSticky ? variables.font.size.lrg : variables.font.size.xxxl};
`;

export const StyledTitleLarge = styled(Typography)`
  font-size: ${variables.font.size.xl};
  line-height: ${variables.font.lineHeight.xl};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
`;

export const StyledTitleLargish = styled(Typography)`
  font-size: ${variables.font.size.lrg};
  line-height: ${variables.font.lineHeight.xl};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
`;

export const StyledTitleMedium = styled(Typography, shouldForwardProp)`
  font-size: ${variables.font.size.lg};
  line-height: ${variables.font.lineHeight.lg};
  font-weight: ${({ fontWeight }: StyledProps) => fontWeight || variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
  letter-spacing: ${variables.font.letterSpacing.md};
`;

export const StyledTitleSmall = styled(Typography)`
  font-size: ${variables.font.size.md};
  line-height: ${variables.font.lineHeight.md};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.on_surface_variant};
  letter-spacing: ${variables.font.letterSpacing.sm};
`;

export const StyledTitleBoldLarge = styled(StyledTitleLarge)`
  font-weight: ${variables.font.weight.bold};
`;

export const StyledTitleBoldLargish = styled(StyledTitleLargish)`
  font-weight: ${variables.font.weight.bold};
`;

export const StyledTitleBoldMedium = styled(StyledTitleMedium)`
  font-weight: ${variables.font.weight.bold};
`;

export const StyledTitleBoldSmall = styled(StyledTitleSmall)`
  font-weight: ${variables.font.weight.bold};
`;

export const StyledLabelLarge = StyledTitleSmall;

export const StyledLabelMedium = styled(Typography, shouldForwardProp)`
  font-size: ${variables.font.size.sm};
  line-height: ${variables.font.lineHeight.sm};
  font-weight: ${({ fontWeight }: StyledProps) => fontWeight || variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
  text-decoration: ${({ withDecoration }: StyledProps) => (withDecoration ? 'underline' : 'none')};
  letter-spacing: ${variables.font.letterSpacing.xxl};
`;

export const StyledLabelSmall = styled(Typography)`
  font-size: ${variables.font.size.xs};
  line-height: ${variables.font.lineHeight.sm};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
  letter-spacing: ${variables.font.letterSpacing.xxl};
`;

export const StyledLabelBoldLarge = styled(StyledLabelLarge)`
  font-weight: ${variables.font.weight.bold};
`;

export const StyledLabelBoldMedium = styled(StyledLabelMedium)`
  font-weight: ${variables.font.weight.bold};
`;

export const StyledLabelBoldSmall = styled(StyledLabelSmall)`
  font-weight: ${variables.font.weight.bold};
`;

export const StyledBodyLarger = styled(Typography)`
  font-size: ${variables.font.size.lg2};
  line-height: ${variables.font.lineHeight.xl};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
`;

export const StyledBodyLarge = styled(Typography)`
  font-size: ${variables.font.size.lg};
  line-height: ${variables.font.lineHeight.lg};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
  letter-spacing: ${({ letterSpacing }: StyledProps) =>
    letterSpacing ? variables.font.letterSpacing[letterSpacing] : variables.font.letterSpacing.md};
`;

export const StyledBodyMedium = styled(Typography)`
  font-size: ${variables.font.size.md};
  line-height: ${variables.font.lineHeight.md};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.on_surface};
  letter-spacing: ${variables.font.letterSpacing.lg};
`;

export const StyledBodySmall = styled(Typography)`
  font-size: ${variables.font.size.sm};
  line-height: ${variables.font.lineHeight.sm};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.on_surface};
  letter-spacing: ${variables.font.letterSpacing.xl};
`;

export const StyledEllipsisText = styled(Typography)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
