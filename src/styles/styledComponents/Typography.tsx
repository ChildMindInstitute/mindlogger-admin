import { styled } from '@mui/system';
import { Typography } from '@mui/material';

import { variables } from 'styles/variables';

type FontWeight = keyof typeof variables.font.weight;
type LetterSpacing = keyof typeof variables.letterSpacing;

type StyledProps = {
  withDecoration?: boolean;
  color?: string;
  fontWeight?: FontWeight;
  letterSpacing?: LetterSpacing;
};

export const StyledHeadlineLarge = styled(Typography)`
  font-size: ${variables.font.size.xxxl};
  line-height: ${variables.lineHeight.xxxl};
  font-weight: ${({ fontWeight }: StyledProps) =>
    fontWeight ? variables.font.weight[fontWeight] : variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.on_surface};
`;

export const StyledHeadline = styled(Typography)`
  font-size: ${variables.font.size.xxl};
  line-height: ${variables.lineHeight.xxl};
  font-weight: ${({ fontWeight }: StyledProps) =>
    fontWeight ? variables.font.weight[fontWeight] : variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
`;

export const StyledTitleLarge = styled(Typography)`
  font-size: ${variables.font.size.xl};
  line-height: ${variables.lineHeight.xl};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
`;

export const StyledTitleMedium = styled(Typography)`
  font-size: ${variables.font.size.lg};
  line-height: ${variables.lineHeight.lg};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
  letter-spacing: ${variables.letterSpacing.md};
`;

export const StyledTitleSmall = styled(Typography)`
  font-size: ${variables.font.size.md};
  line-height: ${variables.lineHeight.md};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.on_surface_variant};
  letter-spacing: ${variables.letterSpacing.sm};
`;

export const StyledTitleBoldLarge = styled(StyledTitleLarge)`
  font-weight: ${variables.font.weight.bold};
`;

export const StyledTitleBoldMedium = styled(StyledTitleMedium)`
  font-weight: ${variables.font.weight.bold};
`;

export const StyledTitleBoldSmall = styled(StyledTitleSmall)`
  font-weight: ${variables.font.weight.bold};
`;

export const StyledLabelLarge = StyledTitleSmall;

export const StyledLabelMedium = styled(Typography)`
  font-size: ${variables.font.size.sm};
  line-height: ${variables.lineHeight.sm};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
  text-decoration: ${({ withDecoration }: StyledProps) => (withDecoration ? 'underline' : 'none')};
  letter-spacing: ${variables.letterSpacing.xxl};
`;

export const StyledLabelSmall = styled(Typography)`
  font-size: ${variables.font.size.xs};
  line-height: ${variables.lineHeight.sm};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
  letter-spacing: ${variables.letterSpacing.xxl};
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

export const StyledBodyLarge = styled(Typography)`
  font-size: ${variables.font.size.lg};
  line-height: ${variables.lineHeight.lg};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.black};
  letter-spacing: ${({ letterSpacing }: StyledProps) =>
    letterSpacing ? variables.letterSpacing[letterSpacing] : variables.letterSpacing.md};
`;

export const StyledBodyMedium = styled(Typography)`
  font-size: ${variables.font.size.md};
  line-height: ${variables.lineHeight.md};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.on_surface};
  letter-spacing: ${variables.letterSpacing.lg};
`;

export const StyledBodySmall = styled(Typography)`
  font-size: ${variables.font.size.sm};
  line-height: ${variables.lineHeight.sm};
  font-weight: ${variables.font.weight.regular};
  color: ${({ color }: StyledProps) => color || variables.palette.on_surface};
  letter-spacing: ${variables.letterSpacing.xl};
`;
